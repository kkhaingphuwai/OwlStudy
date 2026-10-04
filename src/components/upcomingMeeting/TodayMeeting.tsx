import { useEffect, useState } from "react";
import { getTodayMeetings } from "./apiTodayMeeting";

interface TodayMeetingUI {
  id: number;
  name: string;
  session: string;
  time: string;
  status?: "ongoing";
  avatarColor: string;
}

const AVATAR_COLORS = [
  "from-orange-300 to-orange-500",
  "from-blue-300 to-blue-600",
  "from-purple-300 to-purple-600",
  "from-emerald-300 to-emerald-500",
];

const TodayMeeting = () => {
  const [meetings, setMeetings] = useState<TodayMeetingUI[]>([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await getTodayMeetings();

        const backendData = res.data;
        console.log("API DATA:", backendData); 

        const mapped: TodayMeetingUI[] = backendData.map(
          (item: any, index: number) => ({
            id: item.id,
            name: item.studentName,
            session:
              item.sessionTitle ||
              item.session ||
              item.title ||
              item.session?.title ||
              "No Session",

            time: item.isOngoing ? "On Going" : item.time,
            status: item.isOngoing ? "ongoing" : undefined,
            avatarColor:
              AVATAR_COLORS[index % AVATAR_COLORS.length],
          })
        );

        setMeetings(mapped);
      } catch (err) {
        console.error("Failed to load meetings", err);
      }
    };

    fetchMeetings();
  }, []);

  return (
    <div className="group flex flex-col bg-white rounded-[2.5rem] border border-slate-100 hover:border-orange-200 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(255,107,0,0.12)] transition-all duration-500 overflow-hidden h-full transform hover:-translate-y-2 p-8 my-4 ">

      {/* Title */}
      <h2 className="text-xl font-extrabold text-slate-800 group-hover:text-orange-600 transition-colors mb-4">
        Today's Meeting
      </h2>

      {/* Header */}
      <div className="grid grid-cols-[1fr_90px] gap-6 text-[11px] text-slate-400 font-semibold px-1 pb-2 border-b border-slate-100">
        <span>Session</span>
        <span className="text-right">Time</span>
      </div>

      {/* Rows */}
      <div className="mt-1 flex-grow">
        {meetings.length === 0 ? (
          <p className="text-center text-slate-400 mt-6 text-sm">
            No meetings today
          </p>
        ) : (
          meetings.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_auto] gap-30 items-center px-1 py-2.5 rounded-xl hover:bg-orange-50 transition-colors"
            >
              {/* Session */}
              <div>
                <p className="text-[13px] text-slate-500 mt-0.5">
                  {item.session}
                </p>
              </div>

              {/* Time */}
              <div className="flex justify-end">
                {item.status === "ongoing" ? (
                  <span className="text-[11px] font-semibold bg-gradient-to-tr from-orange-500 to-rose-500 text-white px-2.5 py-1 rounded-lg whitespace-nowrap">
                    On Going
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold bg-gradient-to-tr from-orange-400 to-rose-500 text-white px-2.5 py-1 rounded-lg whitespace-nowrap">
                    {item.time}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodayMeeting;