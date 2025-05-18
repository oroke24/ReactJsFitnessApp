import {useState, useEffect} from 'react';
import {dayDataManager} from '../firebase/dayDataManager';
import { getStartOfWeek } from '../utils/dateUtil';

const useWeeklyData = (userId, selectedDate) => {
    const [days, setDays] = useState([]);

    useEffect(() => {
        if(!selectedDate) return;

        const manager = new dayDataManager(userId);

        const loadWeek = async () => {
            const weekStart = getStartOfWeek(selectedDate);
            const week = [];

            for (let i = 0; i < 7; i++){
                const date = new Date(weekStart);
                date.setDate(weekStart.getDate() + i);
                const iso = date.toISOString().split('T')[0];

                const dayData = await manager.getDayFromDate(iso);
                week.push({
                    date: iso,
                    recipes:[
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

    }, [userId, selectedDate]);
    return days;
};
export default useWeeklyData;