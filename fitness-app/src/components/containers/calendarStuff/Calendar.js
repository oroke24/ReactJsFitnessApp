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
import { FaArrowAltCircleLeft, FaArrowCircleLeft, FaArrowCircleRight, FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { setLogLevel } from 'firebase/app';
import '../containers.css';

const Calendar = () => {
    const location = useLocation();
    const email = location.state?.email;
    const newDate = new Date();
    //console.log("newDate:", newDate);
    newDate.setHours(0, 0, 0, 0);
    const today = newDate;
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

    const handlePreviousDay = () => {
        const prevDate = new Date(selectedDate);
        prevDate.setDate(prevDate.getDate() - 1);
        setSelectedDate(prevDate);
    }
    const handleNextDay = () => {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + 1);
        setSelectedDate(nextDate);
    }
    return (
        <div className='light-dark-gradient h-screen overflow-y-auto'>

            <div style={{margin: '30px', marginBottom:'50px', display: 'flex', justifyContent: 'center' }}>
                <Link to="/" className='text-5xl'><FaHome></FaHome></Link>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className='responsive-container'>
                    <div className='calendar-background'>
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'title',
                            center: '',
                            right: 'today prev next'
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
                    </div>
                    <div className='mt-10 calendar-background'>
                    <div className='mt-5 px-3 flex justify-between items-center'>
                        <FaArrowCircleLeft className='text-6xl' onClick={handlePreviousDay}></FaArrowCircleLeft>
                        {today.getDate() === selectedDate.getDate() ? <p className='text-2xl'>Today</p> : ''}
                        {today.getDate()+1 === selectedDate.getDate() ? <p className='text-2xl'>Tomorrow</p> : ''}
                        {console.log("today: ", today, " SelectedDate: ", selectedDate)}
                        <FaArrowCircleRight  className='text-6xl' onClick={handleNextDay}></FaArrowCircleRight>
                    </div>
                    {dayData && (<EditDayComponent
                        email={email}
                        date={selectedDate.toDateString()}
                        recipes={dayData.recipes}
                        exercises={dayData.exercises} />)}
                </div>
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