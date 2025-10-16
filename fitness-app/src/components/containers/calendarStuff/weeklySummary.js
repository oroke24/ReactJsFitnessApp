import React from 'react';
import DayComponent from './DayComponent';
import { Link } from 'react-router-dom';

const WeeklySummary = ({ selectedDate, days, onDayClick, email }) => {
    const isLoading = !days || days.length === 0;
    //console.log("days in weeklySummary:", days);
    //console.log("days[0] in weeklySummary:", days[0]);

    return (
        <div className='flex overflow-x-auto space-x-5 mt-5 mb-5 mr-2 color-white'>
            {isLoading ? (
              <div className="mt-5 container text-center flex overflow-x-auto space-x-4">
                {Array.from({ length: 7 }).map((_, idx) => (
                  <div key={idx} className="ps-1 pt-7 flex flex-col items-center">
                    <h3 className='text-xl font-bold text-center text-gray-400 mb-1'>Day</h3>
                    <div className="w-[380px] h-[300px] foggy-background rounded-lg shadow animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (

                days.map((day, index) => (
                    <div
                        key={index}
                        className={`p-1`}
                    >
                        {index === 0 ? (<h3 className='font-bold text-center'>Today</h3>) : (<div className='p-3'></div>)}
                        <Link
                            to="/calendar"
                            state={{ email: email, dateFromWeekly: new Date(day.date).setHours(0, 0, 0, 0) }}
                        >
                            <DayComponent
                                date={day.date}
                                recipes={day.recipes}
                                exercises={day.exercises}
                            />
                        </Link>
                    </div>
                ))

            )}
        </div>
    );
};

export default WeeklySummary;