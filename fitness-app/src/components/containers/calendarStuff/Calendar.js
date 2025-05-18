import './calendar.css';
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import WeeklyCalendar from './weeklySummary';
//import '@fullcalendar/daygrid/index.css';

const Calendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
        <div className='responsive-container'>
            <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth, timeGridWeek, timeGridDay'
            }}
            dateClick={(info) => setSelectedDate(new Date(info.date))}
            //more stuff here
            />
            <WeeklyCalendar selectedDate={selectedDate}/>
        </div>
        </div>
    );
};
export default Calendar;