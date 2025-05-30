// src/hooks/useDayData.js
import { useState, useEffect } from 'react';
import { dayDataManager } from '../firebase/dayDataManager';

const useDailyData = (selectedDate, userEmail) => {
  const [dayData, setDayData] = useState({
    date: '',
    recipes: [],
    exercises: [],
  });

  useEffect(() => {
    if (!selectedDate || !userEmail) return;

    const fetchDay = async () => {
      const dayManager = new dayDataManager(userEmail);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const day = await dayManager.getDayFromDate(formattedDate);

      const exercises = [
        day.exercise1Id,
        day.exercise2Id,
        day.exercise3Id,
        day.exercise4Id,
        day.exercise5Id,
      ];

      const recipes = [
        day.recipe1Id,
        day.recipe2Id,
        day.recipe3Id,
        day.recipe4Id,
        day.recipe5Id,
      ];

      setDayData({
        date: formattedDate,
        exercises,
        recipes
      });
    };
    fetchDay();
  }, [selectedDate, userEmail]);

  return dayData;
};

export default useDailyData;
