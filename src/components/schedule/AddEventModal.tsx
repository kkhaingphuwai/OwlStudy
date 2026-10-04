import { observer } from "mobx-react-lite";
import { useStore } from "../store/useStore";
import { COLOR_CLASSES, getEndTimeOptions, getStartTimeOptions, getTodayStr, minutesBetween } from "../store/meeting/function";
import { GoogleMeetIcon, TeamsIcon, ZoomIcon } from "./MeetingIcons";
import { useEffect, useRef, useState } from "react";
import type { MeetingState } from "../store/meeting/state";
import LoaderIcon from "../common/LoaderIcon";

interface AddModalProps {
  date: { year: number; month: number; day: number } | null;
  onClose: () => void;
}

const AddEventModal = observer(({ date, onClose }: AddModalProps) => {
  const { meetingStore } = useStore();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    meetingStore.state.resetForm();
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!date) return null;

  const todayStr = getTodayStr();
  const defaultDate = `${date.year}-${String(date.month + 1).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;

  const diffMins = minutesBetween(meetingStore.state.startTime, meetingStore.state.endTime);
  const durationInvalid = meetingStore.state.startTime && meetingStore.state.endTime && diffMins <= 0;

  const now = new Date();
  const minTime = (meetingStore.state.scheduledAt || defaultDate) === todayStr
    ? `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    : undefined;
  const startOptions = getStartTimeOptions(minTime);

  const handleOnChange = async (value: string) => {
    const userInfo = sessionStorage.getItem('user');
    if (!userInfo) return;
    const user = JSON.parse(userInfo);

    setInputValue(value);
    if (value.trim().length < 2) {
      setOpen(false);
      return;
    }
    meetingStore.getAllStudentEmail(user.id, value);
    setOpen(true);
  };

  const handleSave = async () => {
    const state = meetingStore.state as MeetingState;
    const newErrors: Record<string, boolean> = {};

    // Standard Fields
    if (!state.meetingTitle.trim()) newErrors.meetingTitle = true;
    if (!state.scheduledAt && !defaultDate) newErrors.scheduledAt = true;
    if (!state.startTime) newErrors.startTime = true;
    if (!state.endTime) newErrors.endTime = true;
    if (state.studentEmail.length === 0) newErrors.studentEmail = true;

    // Tricky Conditional Fields
    if (state.meetingType === "IN_PERSON" && !state.location?.trim()) {
      newErrors.location = true;
    }
    if (state.meetingType === "VIRTUAL") {
      if (!state.virtualPlatform) newErrors.virtualPlatform = true;
      if (!state.virtualPlatformLink?.trim()) newErrors.virtualPlatformLink = true;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && !durationInvalid) {
      await meetingStore.arrangeMeeting();
      onClose();
      meetingStore.state.resetForm();
    }
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-0 sm:p-4">
      {/* 1. Added max-h and overflow-y-auto to prevent the modal from disappearing behind the Mac notch/taskbar */}
      {meetingStore.state.loading && <LoaderIcon />}
      <div className="w-full sm:max-w-md max-h-[95vh] sm:max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-3xl border border-gray-100 bg-white shadow-2xl overflow-hidden">

        {/* 2. Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5 custom-scrollbar">

          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">Schedule Session</h3>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">✕</button>
          </div>

          {/* Session Title */}
          <div className="mb-3">
            <label className="mb-1.5 block text-sm font-medium text-gray-600">Session Title</label>
            <div className={`rounded-2xl border transition-all overflow-hidden focus-within:border-orange-400 ${errors.meetingTitle ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-100' : 'border-gray-200 bg-gray-50'
              }`}>
              <input
                className="w-full bg-transparent px-4 py-2.5 text-sm font-medium text-gray-700 outline-none placeholder:text-gray-400"
                placeholder={errors.meetingTitle ? "Title is required" : "e.g., Mathematics Weekly Sync"}
                value={meetingStore.state.meetingTitle}
                onChange={(e) => {
                  clearError("meetingTitle");
                  meetingStore.state.setField("meetingTitle", e.target.value);
                }}
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="mb-3">
            <label className="mb-2 block text-sm font-medium text-gray-600">Date & Time</label>
            <div className={`rounded-2xl border overflow-hidden transition-colors ${(errors.scheduledAt || errors.startTime || errors.endTime) ? 'border-rose-500 bg-rose-50' : 'border-gray-200 bg-gray-50'
              }`}>
              <div className="flex items-center border-b border-gray-100 px-3">
                <svg className={`w-4 h-4 shrink-0 mr-2 ${errors.scheduledAt ? 'text-rose-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input
                  type="date"
                  value={meetingStore.state.scheduledAt}
                  min={todayStr}
                  className="flex-1 min-w-0 bg-transparent py-2.5 text-sm font-medium text-gray-700 outline-none cursor-pointer"
                  onChange={(e) => {
                    clearError("scheduledAt");
                    meetingStore.state.setField("scheduledAt", e.target.value);
                  }}
                />
              </div>

              <div className="flex items-center px-3">
                <select
                  value={meetingStore.state.startTime}
                  className={`min-w-0 flex-1 bg-transparent py-2.5 text-sm font-medium outline-none cursor-pointer appearance-none ${errors.startTime ? 'text-rose-600 font-bold' : 'text-gray-700'
                    }`}
                  onChange={(e) => {
                    clearError("startTime");
                    meetingStore.state.setField("startTime", e.target.value);
                  }}
                >
                  <option value="">{errors.startTime ? "Pick Start" : "Start time"}</option>
                  {startOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <span className="shrink-0 text-gray-400 font-medium px-1">–</span>
                <select
                  value={meetingStore.state.endTime}
                  disabled={!meetingStore.state.startTime}
                  className={`min-w-0 flex-1 bg-transparent py-2.5 text-sm font-medium outline-none cursor-pointer appearance-none disabled:text-gray-300 ${errors.endTime ? 'text-rose-600 font-bold' : 'text-gray-700'
                    }`}
                  onChange={(e) => {
                    clearError("endTime");
                    meetingStore.state.setField("endTime", e.target.value);
                  }}
                >
                  <option value="">{errors.endTime ? "Pick End" : "End time"}</option>
                  {meetingStore.state.startTime && getEndTimeOptions(meetingStore.state.startTime).map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {durationInvalid && (
                <div className="flex items-center gap-2 border-t border-rose-200 bg-rose-50 px-3 py-2">
                  <svg className="w-3.5 h-3.5 shrink-0 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-semibold text-rose-500">End time must be after start time</span>
                </div>
              )}
            </div>
          </div>

          {/* Students */}
          <div className="mb-3">
            <div className="space-y-2">
              <div className="relative w-full" ref={containerRef}>
                {/* 3. Added max-h-[120px] and overflow-y-auto here to stop the list from growing forever */}
                <div className={`flex max-h-[120px] overflow-y-auto w-full flex-wrap items-center gap-2 rounded-xl border transition-all focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100 p-2 ${errors.studentEmail ? 'border-rose-500 bg-rose-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                  <div className="shrink-0 text-gray-400 self-start mt-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex flex-1 flex-wrap items-center gap-2">
                    {meetingStore.state.studentEmail.map((email: string) => (
                      <div key={email} className="flex items-center gap-1.5 rounded-lg bg-orange-100 pl-2 pr-1 py-1 text-xs font-medium text-orange-700 ring-1 ring-orange-200 animate-in zoom-in-95">
                        <span className="max-w-[150px] truncate">{email}</span>
                        <button type="button" onClick={() => {
                          const updated = meetingStore.state.studentEmail.filter((e: string) => e !== email);
                          meetingStore.state.setField("studentEmail", updated);
                        }} className="flex h-4 w-4 items-center justify-center rounded-md hover:bg-orange-200">✕</button>
                      </div>
                    ))}
                    <input
                      value={inputValue}
                      onChange={(e) => {
                        clearError("studentEmail");
                        handleOnChange(e.target.value);
                      }}
                      className="flex-1 min-w-[140px] bg-transparent py-1 text-sm text-gray-800 outline-none"
                      placeholder={meetingStore.state.studentEmail.length === 0 ? (errors.studentEmail ? "Email is required" : "Student email...") : ""}
                    />
                  </div>
                </div>

                {open && inputValue.trim().length >= 2 && (
                  <div className="absolute left-0 right-0 z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-gray-100 bg-white p-1 shadow-2xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1">
                    {meetingStore.state.suggestion.length > 0 ? (
                      <>
                        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Suggested Students</div>
                        {meetingStore.state.suggestion.map((email: string) => (
                          <button key={email} type="button" onClick={() => {
                            const current = meetingStore.state.studentEmail || [];
                            if (!current.includes(email)) meetingStore.state.setField("studentEmail", [...current, email]);
                            setInputValue("");
                            setOpen(false);
                            clearError("studentEmail");
                          }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[11px] font-bold text-orange-600 uppercase">{email[0]}</div>
                            <span className="truncate font-medium">{email}</span>
                          </button>
                        ))}
                      </>
                    ) : <div className="px-3 py-6 text-center text-sm text-gray-500">No students found</div>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Meeting Type */}
          <div className="mb-3">
            <label className="mb-2 block text-sm font-medium text-gray-600">Meeting Type</label>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => {
                  meetingStore.state.setField("meetingType", "IN_PERSON");
                  clearError("virtualPlatformLink");
                  clearError("virtualPlatform");
                }}
                className={`cursor-pointer flex flex-1 items-center justify-center gap-2 rounded-xl border py-2 text-sm font-semibold transition ${meetingStore.state.meetingType === "IN_PERSON" ? "border-orange-400 bg-orange-50 text-orange-600" : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                In-Person
              </button>
              <button
                onClick={() => {
                  meetingStore.state.setField("meetingType", "VIRTUAL");
                  clearError("location");
                }}
                className={`cursor-pointer flex flex-1 items-center justify-center gap-2 rounded-xl border py-2 text-sm font-semibold transition ${meetingStore.state.meetingType === "VIRTUAL" ? "border-indigo-400 bg-indigo-50 text-indigo-600" : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.382v7.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                Virtual
              </button>
            </div>

            {meetingStore.state.meetingType === "IN_PERSON" && (
              <div className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 transition focus-within:ring-2 focus-within:ring-orange-100 ${errors.location ? 'border-rose-500 bg-rose-50' : 'border-gray-200 bg-gray-50 focus-within:border-orange-400 focus-within:bg-white'
                }`}>
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <input
                  className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                  placeholder={errors.location ? "Location is required" : "Enter location (room, address...)"}
                  value={meetingStore.state.location}
                  onChange={(e) => {
                    clearError("location");
                    meetingStore.state.setField("location", e.target.value);
                  }}
                />
              </div>
            )}

            {meetingStore.state.meetingType === "VIRTUAL" && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  {(['zoom', 'team', 'meet'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        clearError("virtualPlatform");
                        meetingStore.state.setField("virtualPlatform", p);
                      }}
                      className={`cursor-pointer flex flex-1 flex-col items-center gap-1.5 rounded-xl border-2 py-2 text-xs font-semibold transition ${meetingStore.state.virtualPlatform === p ? 'border-[#2D8CFF] bg-blue-50 text-[#2D8CFF]' : errors.virtualPlatform ? 'border-rose-200 bg-rose-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                        }`}
                    >
                      {p === 'zoom' && <ZoomIcon className="w-6 h-6" />}
                      {p === 'team' && <TeamsIcon className="w-6 h-6" />}
                      {p === 'meet' && <GoogleMeetIcon className="w-6 h-6" />}
                      <span className="capitalize">{p}</span>
                    </button>
                  ))}
                </div>
                {meetingStore.state.virtualPlatform && (
                  <div className={`flex items-center gap-2 rounded-xl border border-dashed px-3 py-2.5 transition ${errors.virtualPlatformLink ? 'border-rose-500 bg-rose-50' : 'border-gray-300 bg-gray-50'
                    }`}>
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    <input
                      onChange={(e) => {
                        clearError("virtualPlatformLink");
                        meetingStore.state.setField("virtualPlatformLink", e.target.value);
                      }}
                      placeholder={errors.virtualPlatformLink ? "Link is required" : "Paste meeting link..."}
                      className="flex-1 truncate text-xs text-gray-500 font-mono bg-transparent outline-none"
                      value={meetingStore.state.virtualPlatformLink}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Session Color */}
          <div className="mb-3">
            <label className="mb-2 block text-sm font-medium text-gray-600">Session Color</label>
            <div className="flex gap-2.5">
              {(["indigo", "violet", "sky", "emerald", "rose"] as const).map(c => (
                <button key={c} onClick={() => meetingStore.state.setField("sessionColor", c)}
                  className={`cursor-pointer h-7 w-7 rounded-full ${COLOR_CLASSES[c].dot} transition-transform ${meetingStore.state.sessionColor === c ? `ring-2 ring-offset-2 ${COLOR_CLASSES[c].ring} scale-110` : "hover:scale-105"}`} />
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-3">
            <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 transition">
              <svg className="mt-0.5 w-4 h-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h10" /></svg>
              <textarea
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm text-gray-800 outline-none"
                placeholder="Add description"
                value={meetingStore.state.description}
                onChange={(e) => meetingStore.state.setField("description", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 4. Sticky Actions Container to keep buttons visible regardless of scroll */}
        <div className="px-5 py-4 bg-white border-t border-gray-100 flex gap-3 sm:px-6">
          <button onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleSave} className="cursor-pointer flex-1 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 py-2.5 text-sm font-bold text-white shadow-md hover:opacity-90 active:scale-95 transition-all">
            Create Request
          </button>
        </div>
      </div>
    </div>
  );
});

export default AddEventModal;