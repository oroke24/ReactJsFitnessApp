import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
//import '@fullcalendar/daygrid/index.css';

const Calendar = () => {
    const events = [
        {title: 'Workout: Cardio', date: '2025-05-20'},
        {title: 'Recipe: Chicken Bowl', date: '2025-05-20'}
    ];

    return(
        <div className="p-4">
            <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            height="auto"
            />
        </div>
    );
};
export default Calendar;