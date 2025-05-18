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
import EditDayComponent from './EditDayComponent';
import { dayDataManager } from '../../../firebase/dayDataManager';
import useDailyData from '../../../hooks/useDailyData';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import useAuthStatus from '../../../hooks/useAuthStatus';

const Calendar = () => {
    const location = useLocation();
    const email = location.state?.email;

    const [selectedDate, setSelectedDate] = useState(new Date());

    const days = useWeeklyData(selectedDate, email);
    const dayData = useDailyData(selectedDate, email);

    return (
        <div>

        <div style={{display: 'flex', justifyContent: 'center', margin:'15px 0px 25px 0px'}}>
         <Link to="/" className='text-5xl'><FaArrowAltCircleLeft></FaArrowAltCircleLeft></Link>
        </div>

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
            {days && (<WeeklySummary selectedDate={selectedDate.toDateString()} days={days}/>)}
            {dayData && (<EditDayComponent 
            date={selectedDate.toDateString()} 
            recipes={dayData.recipes} 
            exercises={dayData.exercises}/>)}
        </div>
        </div>
        </div>
    );
};
export default Calendar;