import { observer } from "mobx-react-lite";
import { meetingStore } from "../store/meeting";
import { COLOR_CLASSES, formatTime } from "../store/meeting/function";
import { useEffect } from "react";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  notes: string;
  color?: "indigo" | "violet" | "sky" | "emerald" | "rose";
}

interface DetailModalProps {
  event: CalendarEvent | null;
  dateLabel: string;
  isPast: boolean;
  onClose: () => void;
}

const SessionDetailModal = observer(
  ({ event, dateLabel, isPast, onClose }: DetailModalProps) => {

    useEffect(() => {
      if (!event?.id) return;

      meetingStore.state.setNote("");
      meetingStore.state.sessionNote = null;

      meetingStore.getMeetingNoteById(Number(event.id));
    }, [event?.id]);

    useEffect(() => {
      meetingStore.state.setNote(
        meetingStore.state.sessionNote?.sessionNote || ""
      );
    }, [meetingStore.state.sessionNote]);

    if (!event) return null;

    const handleSaveRecord = async () => {
      try {
        await meetingStore.saveMeetingNote(Number(event.id));
        if (meetingStore.state.sessionNote) {
          meetingStore.state.sessionNote.sessionNote = "";
        }
        onClose();
      } catch (error) {
        console.error("Failed to save meeting note", error);
        alert("Failed to save record");
      } finally {

      }
    };

    const c = COLOR_CLASSES[event.color ?? "indigo"];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

        {/* Modal */}
        <div className="
        w-full 
        max-w-md 
        max-h-[85vh]
        bg-white 
        rounded-2xl 
        shadow-2xl 
        flex flex-col 
        overflow-hidden
      ">

          {/* Header */}
          <div
            className={`${c.light} px-5 py-4 border-b border-gray-100`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${c.dot}`} />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-800">
                    {event.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    {dateLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

            <div className="flex justify-between">
              <div>
                <p className="text-xs text-gray-400">Time</p>
                <p className="text-sm font-semibold text-gray-700">
                  {formatTime(event.time)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-400">Duration</p>
                <p className="text-sm font-semibold text-gray-700">
                  {event.duration || "—"}
                </p>
              </div>
            </div>

            {event.notes && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Notes</p>
                <div className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3 leading-relaxed">
                  {event.notes}
                </div>
              </div>
            )}

            {isPast && (
              <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-500">
                🔒 This session has already passed
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 pb-5 pt-4 border-t border-gray-100 space-y-4 bg-white">

            {/* Notes Input */}

            <div>
              {meetingStore.state.sessionNote?.sessionNote}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Notes
              </label>
              <textarea
                value={meetingStore.state.note}
                onChange={(e) => meetingStore.state.setNote(e.target.value)}
                rows={4}
                placeholder="Write notes about this session..."
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 resize-none outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="w-1/2 rounded-xl bg-gray-100 text-gray-700 py-3 text-sm font-semibold hover:bg-gray-200 transition"
              >
                Close
              </button>

              <button
                onClick={handleSaveRecord}
                disabled={!meetingStore.state.note.trim()}
                className="w-1/2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3 text-sm font-semibold shadow-md hover:opacity-90 transition"
              >
                Save Record
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  });

export default SessionDetailModal;