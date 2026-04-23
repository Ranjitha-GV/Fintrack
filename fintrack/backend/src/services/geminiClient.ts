const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

interface GeminiCandidate {
  content?: { parts?: Array<{ text?: string }> };
}

interface GeminiResponseBody {
  error?: { message?: string };
  candidates?: GeminiCandidate[];
}

type QueueTask<T> = () => Promise<T>;

let queueChain: Promise<void> = Promise.resolve();

const enqueueGeminiTask = <T>(task: QueueTask<T>): Promise<T> => {
  const resultPromise = queueChain.then(task);
  queueChain = resultPromise.then(
    () => undefined,
    () => undefined,
  );
  return resultPromise;
};

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const shouldRetry = (status: number, providerMessage: string): boolean => {
  if (status === 429 || status === 500 || status === 503) {
    return true;
  }
  return providerMessage.toLowerCase().includes("high demand");
};

const callSingleModel = async (
  apiKey: string,
  model: string,
  prompt: string,
  temperature: number,
): Promise<{ status: number; providerMessage: string; text: string }> => {
  const response = await fetch(
    `${GEMINI_BASE_URL}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          responseMimeType: "application/json",
        },
      }),
    },
  );

  const result = (await response.json()) as GeminiResponseBody;
  return {
    status: response.status,
    providerMessage: result.error?.message || "",
    text: result.candidates?.[0]?.content?.parts?.[0]?.text ?? "",
  };
};

export const callGeminiWithFallback = async ({
  apiKey,
  prompt,
  models,
  temperature,
}: {
  apiKey: string;
  prompt: string;
  models: string[];
  temperature: number;
}): Promise<string> => {
  const uniqueModels = Array.from(new Set(models.filter(Boolean)));
  let lastErrorMessage = "Gemini request failed.";

  for (const model of uniqueModels) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const result = await enqueueGeminiTask(() =>
        callSingleModel(apiKey, model, prompt, temperature),
      );

      if (result.status === 200 && result.text) {
        return result.text;
      }

      if (result.status === 401 || result.status === 403) {
        throw new Error("Gemini authentication failed. Check GEMINI_API_KEY.");
      }

      const providerMessage = result.providerMessage || "Gemini request failed.";
      lastErrorMessage = providerMessage;

      if (shouldRetry(result.status, providerMessage) && attempt < 2) {
        await delay(1200 * (attempt + 1));
        continue;
      }
      break;
    }
  }

  if (lastErrorMessage.toLowerCase().includes("rate limit")) {
    throw new Error(`Gemini rate limit reached. ${lastErrorMessage}`);
  }
  if (lastErrorMessage.toLowerCase().includes("high demand")) {
    throw new Error(`Gemini high demand. ${lastErrorMessage}`);
  }
  throw new Error(`Gemini request failed: ${lastErrorMessage}`);
};
