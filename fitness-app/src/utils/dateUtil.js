export function getWeekDays(baseDate) {
  const start = new Date(baseDate);
  start.setDate(start.getDate() - start.getDay()); // Sunday-start week

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}
export const getStartOfWeek = (date) =>{
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}
export const formatDate = (date) =>
  new Intl.DateTimeFormat('sv-SE').format(date).replace(/-/g, '');

export const getDayLabel = (date) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const isSame = (d1, d2) => d1.toDateString() === d2.toDateString();

  if (isSame(date, today)) return `Today: ${date.toDateString()}`;
  if (isSame(date, tomorrow)) return `Tomorrow: ${date.toDateString()}`;
  return date.toDateString();
};
