import './calendar.css';
import React, { useEffect, useRef, useState } from 'react';
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
    const newDate = new Date();
    //console.log("newDate:", newDate);
    newDate.setHours(0, 0, 0, 0);
    //console.log("Email in calendar: ", email);

    const [selectedDate, setSelectedDate] = useState(newDate);

    const dayData = useDailyData(selectedDate, email);
    //console.log("selecedDate in calendar: ", selectedDate);

    const calendarRef = useRef(null);
    useEffect(() => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.gotoDate(newDate);
        }

        if(calendarRef.current.el){
            calendarRef.current.el.scrollIntoView({behavior: 'smooth'});
        }


    }, []);

    return (
        <div>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '15px 0px 25px 0px' }}>
                <Link to="/" className='text-5xl'><FaArrowAltCircleLeft></FaArrowAltCircleLeft></Link>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className='responsive-container'>
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev',
                            center: 'title',
                            right: 'next'
                        }}
                        dateClick={(info) => {
                            const newDate = new Date(info.date);
                            //console.log("newDate:", newDate)
                            newDate.setHours(0, 0, 0, 0);
                            setSelectedDate(newDate);
                            //console.log("datestr:", newDate.toISOString().split('T')[0]);
                        }}
                        //more stuff here
                        dayCellClassNames={(arg) => {
                            const clickedDateStr = selectedDate.toISOString().split('T')[0];
                            const cellDateStr = arg.date.toISOString().split('T')[0];
                            return cellDateStr === clickedDateStr ? ['selected-day'] : [];
                        }}
                    />
                    <div className='m-10'></div>
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
/* Removed week view
                    const days = useWeeklyData(selectedDate, email);
                    //console.log("days:", days);
                    {days && (
                        <WeeklySummary
                        selectedDate={selectedDate.toISOString().split('T')[0]}
                        days={days}
                    />)}
*/