import './calendar.css';
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import WeeklySummary from './weeklySummary';

//Eventually load days from firebase instead of mockDays
const mockDays = [
    {date: 'Mon', recipes:['Oatmeal'], exercises:['Run']},
    {date: 'Tue', recipes:['Oatmeal'], exercises:['Run']},
    {date: 'Wed', recipes:['Oatmeal'], exercises:['Run']},
    {date: 'Thu', recipes:['Oatmeal'], exercises:['Run']},
    {date: 'Fri', recipes:['Oatmeal'], exercises:['Run']},
    {date: 'Sat', recipes:['Oatmeal'], exercises:['Run']},
    {date: 'Sun', recipes:['Oatmeal'], exercises:['Run']},
]


const Calendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

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
            />
            <h3 className='text-xl font-bold mt-5'>Week of {selectedDate.toDateString()}</h3>
            <WeeklySummary selectedDate={selectedDate} days={mockDays}/>
        </div>
        </div>
    );
};
export default Calendar;