
import api from "../../service/api";

export const getTodayMeetings = async () => {
  const res = await api.get("/meeting/student/today");
  return res.data; 
};

