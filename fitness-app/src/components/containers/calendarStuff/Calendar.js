import './calendar.css';
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import WeeklySummary from './weeklySummary';
import useWeeklyData from '../../../hooks/useWeeklyData';
import EditDayComponent from './EditDayComponent';
import useDailyData from '../../../hooks/useDailyData';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Calendar = () => {
    const location = useLocation();
    const email = location.state?.email;
    //console.log("Email in calendar: ", email);

    const [selectedDate, setSelectedDate] = useState(new Date());

    const days = useWeeklyData(selectedDate, email);
    //console.log("days:", days);
    const dayData = useDailyData(selectedDate, email);

    return (
        <div>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '15px 0px 25px 0px' }}>
                <Link to="/" className='text-5xl'><FaArrowAltCircleLeft></FaArrowAltCircleLeft></Link>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
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
                        dayCellClassNames={(arg) => {
                            const clickedDateStr = selectedDate.toISOString().split('T')[0];
                            const cellDateStr = arg.date.toISOString().split('T')[0];
                            return cellDateStr === clickedDateStr ? ['selected-day'] : [];
                        }}
                    />
                    {days && (
                        <WeeklySummary
                        selectedDate={selectedDate.toISOString().split('T')[0]}
                        days={days}
                        onDayClick={(dateStr) => { setSelectedDate(new Date(dateStr)); console.log("datestr: ", dateStr); }}
                    />)}
                    {dayData && (<EditDayComponent
                        email={email}
                        date={selectedDate.toDateString()}
                        recipes={dayData.recipes}
                        exercises={dayData.exercises} />)}
                </div>
            </div>
        </div>
    );
};
export default Calendar;