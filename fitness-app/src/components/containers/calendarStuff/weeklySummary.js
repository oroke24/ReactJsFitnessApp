import { useEffect, useState } from 'react';
import { fetchWeeklyData } from '../../../firebase/dayDataManager.js';
import {getWeekDays} from '../../../utils/dateUtil.js';

export default function WeeklySummary({ selectedDate, userId }) {
    const [weekDays, setWeekDays] = useState([]);
    const [dayData, setDayData] = useState({});

    useEffect(() => {
        const days = getWeekDays(selectedDate);
        setWeekDays(days);

        fetchWeeklyData(days, userId).then(data => setDayData(data));
    }, [selectedDate, userId]);

    return (
        <div className="flex overflow-x-auto gap-4 py-4 px-2">
            {weekDays.map((day, i) => {
                const key = day.toISOString().split('T')[0];
                const data = dayData[key];

                return (
                    <div
                        key={i}
                        classname="min-w-[160px] bg-white rounded-xl shadow-md p-4 flex-shrink-0"
                    >
                        <div className="font-semibold text-sm text-gray-600 mb-2">
                            {day.toDateString()}
                        </div>
                        <div className="text-sm">
                            {data ? (
                                <>
                                    <div><strong>Exercise:</strong> {data.exrcise || 'None'}</div>
                                    <div><strong>Recipe:</strong> {data.recipe || 'None'}</div>
                                </>
                            ) : (
                                <div className="text-gray-400 italic"> No data </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}