export function getWeekDays(baseDate) {
  const start = new Date(baseDate);
  start.setDate(start.getDate() - start.getDay()); // Sunday-start week

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}