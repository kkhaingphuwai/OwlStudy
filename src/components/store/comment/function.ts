export const formatDate = (dateStr: string ) => {
  const date = new Date(dateStr);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // convert to 12-hour

  return `${yyyy}-${mm}-${dd} ${hours}:${minutes} ${ampm}`;
};