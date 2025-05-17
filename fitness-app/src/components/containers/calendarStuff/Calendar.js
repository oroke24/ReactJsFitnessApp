import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import WeeklySummary from './weeklySummary';
//import '@fullcalendar/daygrid/index.css';

const Calendar = ({userId}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    return(
        <div>
            <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            dateClick={(info) => setSelectedDate(new Date(info.date))}
            //more stuff here
            />
            <WeeklySummary selectedDate={selectedDate} userId={userId}/>
        </div>
    );
};
export default Calendar;