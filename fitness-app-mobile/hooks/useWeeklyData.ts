import { useEffect, useState } from 'react';
import { dayDataManager } from '../lib/firebase/dayDataManager';

type WeekDay = {
  date: string;
  recipes: string[];
  exercises: string[];
};

const useWeeklyData = (selectedDate: Date, userEmail?: string | null) => {
  const [days, setDays] = useState<WeekDay[]>([]);

  useEffect(() => {
    if (!selectedDate || !userEmail) return;
    const manager = new dayDataManager(userEmail);

    const loadWeek = async () => {
      const week: WeekDay[] = [];
      for (let i = 0; i < 7; i++) {
        let date = new Date(selectedDate);
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + i);
        const iso = date.toISOString().split('T')[0];
        const dayData = await manager.getDayFromDate(iso);
        week.push({
          date: iso,
          recipes: [
            dayData.recipe1Id,
            dayData.recipe2Id,
            dayData.recipe3Id,
            dayData.recipe4Id,
            dayData.recipe5Id,
          ].filter(Boolean),
          exercises: [
            dayData.exercise1Id,
            dayData.exercise2Id,
            dayData.exercise3Id,
            dayData.exercise4Id,
            dayData.exercise5Id,
          ].filter(Boolean),
        });
      }
      setDays(week);
    };
    loadWeek();
  }, [selectedDate, userEmail]);

  return days;
};

export default useWeeklyData;
