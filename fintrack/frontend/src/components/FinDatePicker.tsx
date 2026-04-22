import { useEffect, useMemo, useRef, useState } from "react";

interface FinDatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const toDateValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateValue = (value: string): Date => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const FinDatePicker = ({ value, onChange }: FinDatePickerProps) => {
  const [open, setOpen] = useState(false);
  const [monthDate, setMonthDate] = useState(() => parseDateValue(value));
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [openUpward, setOpenUpward] = useState(false);
  const [alignRight, setAlignRight] = useState(false);

  useEffect(() => {
    const next = parseDateValue(value);
    setMonthDate(new Date(next.getFullYear(), next.getMonth(), 1));
  }, [value]);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const updatePlacement = () => {
      if (!triggerRef.current) {
        return;
      }

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popupHeight = popupRef.current?.offsetHeight ?? 320;
      const popupWidth = popupRef.current?.offsetWidth ?? 290;
      const gap = 8;
      const viewportPadding = 8;

      const shouldOpenUpward =
        triggerRect.bottom + popupHeight + gap > window.innerHeight &&
        triggerRect.top - popupHeight - gap > viewportPadding;
      const shouldAlignRight =
        triggerRect.left + popupWidth > window.innerWidth - viewportPadding;

      setOpenUpward(shouldOpenUpward);
      setAlignRight(shouldAlignRight);
    };

    const rafId = window.requestAnimationFrame(updatePlacement);
    window.addEventListener("resize", updatePlacement);
    window.addEventListener("scroll", updatePlacement, true);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updatePlacement);
      window.removeEventListener("scroll", updatePlacement, true);
    };
  }, [open]);

  const days = useMemo(() => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: 42 }, (_, index) => {
      const day = index - firstDayIndex + 1;
      const isInCurrentMonth = day >= 1 && day <= daysInMonth;
      const date = new Date(year, month, day);
      return {
        key: `${year}-${month}-${index}`,
        date,
        isInCurrentMonth,
      };
    });
  }, [monthDate]);

  const selectedValue = value;
  const yearOptions = Array.from({ length: 101 }, (_, index) => 1970 + index);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        data-component-id="fin-date-picker-trigger"
        onClick={() => setOpen((prev) => !prev)}
        className="fin-date-trigger mt-1 flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-left text-slate-900 ring-violet-500 transition focus-visible:ring-2 dark:border-slate-700 dark:bg-black/80 dark:text-slate-100"
      >
        <span>{parseDateValue(value).toLocaleDateString("en-IN")}</span>
        <span className="ml-2 rounded-md bg-violet-100 px-1.5 py-1 text-[11px] text-violet-700 dark:bg-violet-500/20 dark:text-violet-200">
          📅
        </span>
      </button>

      {open && (
        <div
          ref={popupRef}
          data-component-id="fin-date-picker-popup"
          className={`absolute z-[90] w-[290px] rounded-2xl border border-emerald-500/20 bg-[#12181d] p-3 shadow-[0_14px_30px_rgba(0,0,0,0.45)] ${
            openUpward ? "bottom-full mb-2" : "top-full mt-2"
          } ${alignRight ? "right-0" : "left-0"}`}
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() =>
                setMonthDate(
                  (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
                )
              }
              className="rounded-md px-2 py-1 text-slate-300 hover:bg-slate-800"
            >
              ‹
            </button>
            <div className="flex items-center gap-1.5">
              <select
                data-component-id="fin-date-picker-month-select"
                value={monthDate.getMonth()}
                onChange={(event) =>
                  setMonthDate(
                    (current) =>
                      new Date(
                        current.getFullYear(),
                        Number(event.target.value),
                        1,
                      ),
                  )
                }
                className="fin-select rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs font-medium text-slate-100 outline-none ring-violet-500 focus:ring-2"
              >
                {MONTHS.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                data-component-id="fin-date-picker-year-select"
                value={monthDate.getFullYear()}
                onChange={(event) =>
                  setMonthDate(
                    (current) =>
                      new Date(
                        Number(event.target.value),
                        current.getMonth(),
                        1,
                      ),
                  )
                }
                className="fin-select rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs font-medium text-slate-100 outline-none ring-violet-500 focus:ring-2"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() =>
                setMonthDate(
                  (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
                )
              }
              className="rounded-md px-2 py-1 text-slate-300 hover:bg-slate-800"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400">
            {WEEK_DAYS.map((day) => (
              <span key={day} className="py-1">
                {day}
              </span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1 text-center">
            {days.map(({ key, date, isInCurrentMonth }) => {
              const dateValue = toDateValue(date);
              const selected = dateValue === selectedValue;
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => {
                    onChange(dateValue);
                    setOpen(false);
                  }}
                  className={`h-8 rounded-md text-xs transition ${
                    selected
                      ? "bg-emerald-500 text-white"
                      : isInCurrentMonth
                        ? "text-slate-200 hover:bg-slate-800"
                        : "text-slate-600 hover:bg-slate-800/60"
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
