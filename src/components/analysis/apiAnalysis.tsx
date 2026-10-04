import api from "../../service/api";

export const getAnalyticsReport = async (startDate: string, endDate: string) => {
  const res = await api.get(
    `/admin/analytics/report?startDate=${startDate}&endDate=${endDate}`
  );
  return res.data;
};