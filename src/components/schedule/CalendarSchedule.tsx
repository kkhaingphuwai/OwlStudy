import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { COLOR_CLASSES, firstDayOffset, formatTime, getDaysInMonth, makeDateKey } from "../store/meeting/function";
import AddEventModal from "./AddEventModal";
import SessionDetailModal from "./SessionDetailsModal";
import { useStore } from "../store/useStore";
import type { CalendarEvent } from "../../service/meeting/calendar";
import MessengerWidget from "../message/MessageWidget";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function EventPill({ event, onClick }: { event: CalendarEvent; onClick: (e: React.MouseEvent) => void }) {
  const colorKey = event.sessionColor && COLOR_CLASSES[event.sessionColor] ? event.sessionColor : "indigo";
  const c = COLOR_CLASSES[colorKey];
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium ${c.pill} truncate cursor-pointer hover:brightness-95 transition`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${c.dot}`} />
      <span className="truncate flex-1">{event.title}</span>
      <span className="shrink-0 text-[10px] opacity-60">{formatTime(event.time)}</span>
    </div>
  );
}


// ─── Main Calendar ────────────────────────────────────────────────────────────
const CalendarSchedule = observer(() => {

  const today = new Date();

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const { meetingStore } = useStore();

  useEffect(() => {
    meetingStore.gtAllMeetingSchedule();
  }, [])

  const [addModalDate, setAddModalDate] = useState<{ year: number; month: number; day: number } | null>(null);
  const [detailState, setDetailState] = useState<{ event: CalendarEvent; dateLabel: string; isPast: boolean } | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const offset = firstDayOffset(currentYear, currentMonth);
  const prevMonthDays = getDaysInMonth(currentYear, currentMonth === 0 ? 11 : currentMonth - 1);
  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const goPrev = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const goNext = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };
  const goToday = () => { setCurrentYear(today.getFullYear()); setCurrentMonth(today.getMonth()); };

  const isToday = (day: number) =>
    day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  return (
    <>
      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left Side: Navigation Controls */}
        <div className="flex items-center justify-center gap-2 sm:justify-start">
          <button onClick={goPrev} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 transition">‹</button>

          {/* Adjusted min-width for mobile to prevent squishing */}
          <span className="min-w-[120px] sm:min-w-[160px] text-center text-base font-bold text-gray-800">
            {MONTHS[currentMonth]} {currentYear}
          </span>

          <button onClick={goNext} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 transition">›</button>

          <button onClick={goToday} className="ml-1 rounded-lg border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition">
            Today
          </button>
        </div>

        {/* Right Side: Action Button */}
        <button
          onClick={() => setAddModalDate({ year: currentYear, month: currentMonth, day: today.getDate() })}
          className="w-full sm:w-auto cursor-pointer rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow hover:opacity-90 active:scale-95 transition-all"
        >
          + Add Session
        </button>
      </div>
      
      {/* Calendar */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
          {WEEKDAYS.map(d => (
            <div key={d} className="py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({ length: totalCells }).map((_, i) => {
            const dayNum = i - offset + 1;
            const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
            const displayDay = isCurrentMonth
              ? dayNum
              : dayNum < 1 ? prevMonthDays + dayNum : dayNum - daysInMonth;

            let cellEvents: CalendarEvent[] = [];
            if (isCurrentMonth) {
              const key = makeDateKey(currentYear, currentMonth, dayNum);
              cellEvents = meetingStore.state.calendarEventMap[key] ?? [];
            }

            const todayCell = isCurrentMonth && isToday(dayNum);
            const isPast = isCurrentMonth && new Date(currentYear, currentMonth, dayNum) < todayStart;

            return (
              <div
                key={i}
                onClick={() => { if (!isCurrentMonth || isPast) return; setAddModalDate({ year: currentYear, month: currentMonth, day: dayNum }); }}
                className={[
                  "min-h-[100px] border-b border-r border-gray-100 p-2 transition-colors",
                  i % 7 === 6 ? "border-r-0" : "",
                  !isCurrentMonth ? "bg-gray-50/70" :
                    isPast ? "cursor-not-allowed bg-gray-50/50" :
                      "cursor-pointer hover:bg-orange-50/40",
                  isPast ? "cursor-not-allowed bg-gray-50/50" :
                    "cursor-pointer hover:bg-orange-50/40",
                ].join(" ")}
              >
                <div className="mb-1.5 flex">
                  <span className={[
                    "flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
                    todayCell ? "bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow" :
                      isPast ? "text-gray-300" :
                        isCurrentMonth ? "text-gray-700" : "text-gray-300",
                  ].join(" ")}>
                    {displayDay}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  {cellEvents.slice(0, 2).map(ev => (
                    <EventPill
                      key={ev.id}
                      event={ev}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailState({
                          event: ev,
                          dateLabel: `${MONTHS[currentMonth]} ${dayNum}, ${currentYear}`,
                          isPast,
                        });
                      }}
                    />
                  ))}
                  {cellEvents.length > 2 && (
                    <span className="pl-1 text-[10px] font-medium text-gray-400">+{cellEvents.length - 2} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      
      <AddEventModal
        date={addModalDate}
        onClose={() => setAddModalDate(null)}
      />

      {/* Session Details */}
      <SessionDetailModal
        event={detailState?.event ?? null}
        dateLabel={detailState?.dateLabel ?? ""}
        isPast={detailState?.isPast ?? false}
        onClose={() => setDetailState(null)}
      />

      <MessengerWidget />
    </>
    
  );
})

export default CalendarSchedule;