import './calendar.css';
import React, { useState } from 'react';
import auth from '../../../firebase/firebaseAuth';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import WeeklySummary from './weeklySummary';
import useWeeklyData from '../../../hooks/useWeeklyData';
import { getStartOfWeek } from '../../../utils/dateUtil';
import DayComponent from './DayComponent';
import { dayDataManager } from '../../../firebase/dayDataManager';
import useDailyData from '../../../hooks/useDailyData';

const Calendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [email, setEmail] = useState(auth?.currentUser?.email)
    const days = useWeeklyData(email, selectedDate);
    const dayData = useDailyData(selectedDate, email);
    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
        <div className='responsive-container'>
            <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
                left: 'prev',
                center: 'title',
                right: 'next'
            }}
            dateClick={(info) => setSelectedDate(new Date(info.date))}
            //more stuff here
            dayCellClassNames={(arg) =>{
                const clickedDateStr = selectedDate.toISOString().split('T')[0];
                const cellDateStr = arg.date.toISOString().split('T')[0];
                return cellDateStr === clickedDateStr ? ['selected-day'] : [];
            }}
            />
            <h3 className='text-xl font-bold mt-5'>Week of {getStartOfWeek(selectedDate).toDateString()}</h3>
            <WeeklySummary selectedDate={selectedDate.toDateString()} days={days}/>
            {dayData && (<DayComponent 
            date={selectedDate.toDateString()} 
            recipes={dayData.recipes} 
            exercises={dayData.exercises}/>)}
        </div>
        </div>
    );
};
export default Calendar;