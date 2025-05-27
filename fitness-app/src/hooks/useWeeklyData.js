import {useState, useEffect} from 'react';
import {dayDataManager} from '../firebase/dayDataManager';
import { getStartOfWeek } from '../utils/dateUtil';

const useWeeklyData = (selectedDate, userEmail) => {
    const [days, setDays] = useState([]);

    useEffect(() => {
        if(!userEmail) return;
        //console.log("selectedDate in useWeekData: ", selectedDate);
        const manager = new dayDataManager(userEmail);

        const loadWeek = async () => {
            const week = [];

            for (let i = 0; i < 7; i++){
                let date = new Date(selectedDate);
                date.setHours(0,0,0,0);
                date.setDate(date.getDate() + i);
                //date.setDate(weekStart.getDate() + i);
                const iso = date.toISOString().split('T')[0];

                const dayData = await manager.getDayFromDate(iso);
                //console.log("dayData in useWeeklyData", dayData);
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

    }, [selectedDate, userEmail]);
    return days;
};
export default useWeeklyData;