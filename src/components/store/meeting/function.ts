export const COLOR_CLASSES: Record<string, { pill: string; dot: string; ring: string; light: string }> = {
  indigo: { pill: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-500", ring: "ring-indigo-400", light: "bg-indigo-50" },
  violet: { pill: "bg-violet-100 text-violet-700", dot: "bg-violet-500", ring: "ring-violet-400", light: "bg-violet-50" },
  sky: { pill: "bg-sky-100 text-sky-700", dot: "bg-sky-500", ring: "ring-sky-400", light: "bg-sky-50" },
  emerald: { pill: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500", ring: "ring-emerald-400", light: "bg-emerald-50" },
  rose: { pill: "bg-rose-100 text-rose-700", dot: "bg-rose-500", ring: "ring-rose-400", light: "bg-rose-50" },
};

export function getEndTimeOptions(startTime: string) {
  const steps = [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 270, 300, 330, 360, 390, 420, 450, 480];
  return steps.map(mins => ({
    value: addMinutes(startTime, mins),
    label: `${formatDisplay(addMinutes(startTime, mins))} (${formatDuration(mins)})`,
  }));
}

export function getTodayStr() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

export function minutesBetween(start: string, end: string) {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

export function formatDuration(mins: number) {
  if (mins <= 0) return "Invalid";
  const h = Math.floor(mins / 60), m = mins % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

export function addMinutes(time: string, minutesToAdd: number): string {
  if (!time) return "";

  const parts = time.split(":");
  if (parts.length !== 2) return "";

  const h = Number(parts[0]);
  const m = Number(parts[1]);

  if (Number.isNaN(h) || Number.isNaN(m)) return "";

  const total = h * 60 + m + minutesToAdd;
  const normalized = total % (24 * 60);

  const hh = Math.floor(normalized / 60);
  const mm = normalized % 60;

  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function getStartTimeOptions(minTime?: string) {
  const opts: { value: string; label: string }[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const val = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      if (minTime && val < minTime) continue;
      opts.push({ value: val, label: formatDisplay(val) });
    }
  }
  return opts;
}

export function formatDisplay(t: string) {
  if (!t) return "";

  const [h, m] = t.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return "";

  const hour12 = h % 12 || 12;
  const period = h >= 12 ? "PM" : "AM";

  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function firstDayOffset(year: number, month: number) {
  return (new Date(year, month, 1).getDay() + 6) % 7;
}

export function makeDateKey(
  year: number,
  month: number, // 0-based
  day: number
) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function formatTime(t: string) {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export function calculateDuration(start: string, end: string) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  const minutes = (eh * 60 + em) - (sh * 60 + sm);

  if (minutes < 60) return `${minutes} min`;
  if (minutes % 60 === 0) return `${minutes / 60} hr`;
  return `${Math.floor(minutes / 60)} hr ${minutes % 60} min`;
};