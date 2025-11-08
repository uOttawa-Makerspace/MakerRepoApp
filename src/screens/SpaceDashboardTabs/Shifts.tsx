import React, { useEffect, useState, useRef } from "react";
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import toast from "react-hot-toast";
import { get } from '../../utils/HTTPRequests';
import { 
    CalendarMonth, 
    RefreshOutlined, 
    EventNote,
    AccessTime,
    ChevronLeft,
    ChevronRight,
    ViewWeek,
    ViewDay,
    ViewList
} from '@mui/icons-material';
import './Shifts.scss';

type ExtendedProps = {
    reason?: string;
    training?: string;
    course?: string;
    language?: string;
};

type Shift = {
    title: string;
    start: string;
    end: string;
    color: string;
    extendedProps?: ExtendedProps;
};

type ShiftsProps = {
    reloadShifts: () => void;
    spaceId?: number | string | null;
};

type MobileView = 'day' | 'week' | 'list';

const Shifts: React.FC<ShiftsProps> = ({ reloadShifts, spaceId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileView, setMobileView] = useState<MobileView>('day');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [mobileShifts, setMobileShifts] = useState<Shift[]>([]);
    const calendarRef = useRef<FullCalendar>(null);

    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Fetch shifts for mobile views (day/week overview)
    const fetchMobileShifts = async (start: Date, end: Date) => {
        if (!spaceId) {
            setError("No space selected");
            return;
        }
        
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                space_id: spaceId.toString(),
                start: start.toISOString(),
                end: end.toISOString()
            });
            
            // use admin/calendar endpoint
            const data = await get(`admin/calendar/shifts_json?${params}`);
            
            if (!data) {
                throw new Error("No data received");
            }
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            const formattedShifts = data.map((shift: any) => ({
                title: shift.title,
                start: shift.start,
                end: shift.end,
                color: shift.color,
                extendedProps: shift.extendedProps,
            }));
            setMobileShifts(formattedShifts);
        } catch (error) {
            console.error(error);
            setError("Failed to load shifts. Please try again.");
            toast.error("Failed to load shifts.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch mobile shifts when needed
    useEffect(() => {
        if (isMobile && (mobileView === 'day' || mobileView === 'week')) {
            const start = new Date(currentDate);
            start.setDate(start.getDate() - 7); // 1 week before
            const end = new Date(currentDate);
            end.setDate(end.getDate() + 14); // 2 weeks after
            fetchMobileShifts(start, end);
        }
    }, [spaceId, currentDate, mobileView, isMobile]);

    const handleRefresh = () => {
        if (calendarRef.current) {
            calendarRef.current.getApi().refetchEvents();
            toast.success("Shifts refreshed!");
        } else if (isMobile) {
            const start = new Date(currentDate);
            start.setDate(start.getDate() - 7);
            const end = new Date(currentDate);
            end.setDate(end.getDate() + 14);
            fetchMobileShifts(start, end);
        }
    };

    // Dynamic event fetcher for FullCalendar
    const fetchEvents = async (fetchInfo: any, successCallback: any, failureCallback: any) => {
        if (!spaceId) {
            failureCallback(new Error("No space selected"));
            return;
        }

        try {
            const params = new URLSearchParams({
                space_id: spaceId.toString(),
                start: fetchInfo.startStr,
                end: fetchInfo.endStr
            });
            
            // use admin/calendar endpoint
            const data = await get(`admin/calendar/shifts_json?${params}`);
            
            if (!data) {
                throw new Error("No data received");
            }
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            const formattedShifts = data.map((shift: any) => ({
                title: shift.title,
                start: shift.start,
                end: shift.end,
                color: shift.color,
                extendedProps: shift.extendedProps,
            }));
            
            successCallback(formattedShifts);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load shifts.");
            failureCallback(error);
        }
    };

    // Navigate days
    const goToPreviousDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 1);
        setCurrentDate(newDate);
    };

    const goToNextDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 1);
        setCurrentDate(newDate);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Get shifts for a specific day
    const getShiftsForDay = (date: Date) => {
        return mobileShifts.filter(shift => {
            const shiftDate = new Date(shift.start);
            return shiftDate.toDateString() === date.toDateString();
        });
    };

    // Get shifts for the week
    const getShiftsForWeek = () => {
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        
        const weekShifts = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(weekStart.getDate() + i);
            weekShifts.push({
                date: day,
                shifts: getShiftsForDay(day)
            });
        }
        return weekShifts;
    };

    // Format time
    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    };

    const SLOT_MIN_TIME = "07:00:00";
    const SLOT_MAX_TIME = "23:00:00";

    const dayShifts = getShiftsForDay(currentDate);
    const weekShifts = getShiftsForWeek();
    const isToday = currentDate.toDateString() === new Date().toDateString();

    return (
        <div className="shifts-container">
            {/* Header */}
            <div className="shifts-header">
                <div className="header-content">
                    <div className="header-title">
                        <CalendarMonth className="title-icon" />
                        <h2 className="title-text">My Shifts</h2>
                    </div>
                    <div className="header-actions">
                        <button 
                            className="refresh-btn"
                            onClick={handleRefresh}
                            disabled={loading}
                            aria-label="Refresh shifts"
                        >
                            <RefreshOutlined className={loading ? 'rotating' : ''} />
                            {!isMobile && <span>Refresh</span>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Card */}
            <div className="calendar-card">
                {loading && (
                    <div className="loading-overlay">
                        <div className="spinner"></div>
                        <p>Loading shifts...</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="error-state">
                        <EventNote className="error-icon" />
                        <p className="error-message">{error}</p>
                        <button className="retry-btn" onClick={handleRefresh}>
                            Try Again
                        </button>
                    </div>
                )}

                {!error && (
                    <>
                        {isMobile ? (
                            // Custom Mobile View
                            <div className="mobile-calendar">
                                {/* View Switcher */}
                                <div className="view-switcher">
                                    <button 
                                        className={`view-btn ${mobileView === 'day' ? 'active' : ''}`}
                                        onClick={() => setMobileView('day')}
                                    >
                                        <ViewDay />
                                        <span>Day</span>
                                    </button>
                                    <button 
                                        className={`view-btn ${mobileView === 'week' ? 'active' : ''}`}
                                        onClick={() => setMobileView('week')}
                                    >
                                        <ViewWeek />
                                        <span>Week</span>
                                    </button>
                                    <button 
                                        className={`view-btn ${mobileView === 'list' ? 'active' : ''}`}
                                        onClick={() => setMobileView('list')}
                                    >
                                        <ViewList />
                                        <span>List</span>
                                    </button>
                                </div>

                                {/* Day View */}
                                {mobileView === 'day' && (
                                    <div className="day-view">
                                        {/* Date Navigation */}
                                        <div className="date-navigation">
                                            <button 
                                                className="nav-btn"
                                                onClick={goToPreviousDay}
                                                aria-label="Previous day"
                                            >
                                                <ChevronLeft />
                                            </button>
                                            
                                            <div className="current-date">
                                                <div className="date-main">
                                                    {currentDate.toLocaleDateString('en-US', { 
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                                {isToday && <span className="today-badge">Today</span>}
                                            </div>
                                            
                                            <button 
                                                className="nav-btn"
                                                onClick={goToNextDay}
                                                aria-label="Next day"
                                            >
                                                <ChevronRight />
                                            </button>
                                        </div>

                                        {!isToday && (
                                            <button className="today-btn" onClick={goToToday}>
                                                Go to Today
                                            </button>
                                        )}

                                        {/* Shifts for the day */}
                                        <div className="day-shifts">
                                            {dayShifts.length === 0 ? (
                                                <div className="no-shifts-day">
                                                    <AccessTime className="no-shifts-icon" />
                                                    <p>No shifts scheduled for this day</p>
                                                </div>
                                            ) : (
                                                dayShifts.map((shift, index) => (
                                                    <div 
                                                        key={index} 
                                                        className="shift-card"
                                                        style={{ borderLeftColor: shift.color }}
                                                    >
                                                        <div className="shift-header">
                                                            <h4 className="shift-title">{shift.title}</h4>
                                                            <div 
                                                                className="shift-color-dot"
                                                                style={{ backgroundColor: shift.color }}
                                                            />
                                                        </div>
                                                        <div className="shift-time">
                                                            <AccessTime className="time-icon" />
                                                            <span>
                                                                {formatTime(shift.start)} - {formatTime(shift.end)}
                                                            </span>
                                                        </div>
                                                        {shift.extendedProps?.reason && (
                                                            <div className="shift-details">
                                                                <span className="detail-label">Reason:</span>
                                                                <span className="detail-value">
                                                                    {shift.extendedProps.reason}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {shift.extendedProps?.training && (
                                                            <div className="shift-details">
                                                                <span className="detail-label">Training:</span>
                                                                <span className="detail-value">
                                                                    {shift.extendedProps.training}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {shift.extendedProps?.course && (
                                                            <div className="shift-details">
                                                                <span className="detail-label">Course:</span>
                                                                <span className="detail-value">
                                                                    {shift.extendedProps.course}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Week Overview */}
                                {mobileView === 'week' && (
                                    <div className="week-view">
                                        <div className="week-header">
                                            <h3>Week Overview</h3>
                                        </div>
                                        <div className="week-days">
                                            {weekShifts.map((day, index) => {
                                                const isDayToday = day.date.toDateString() === new Date().toDateString();
                                                return (
                                                    <div 
                                                        key={index} 
                                                        className={`week-day ${isDayToday ? 'today' : ''}`}
                                                        onClick={() => {
                                                            setCurrentDate(day.date);
                                                            setMobileView('day');
                                                        }}
                                                    >
                                                        <div className="week-day-header">
                                                            <div className="day-name">
                                                                {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                                                            </div>
                                                            <div className="day-number">
                                                                {day.date.getDate()}
                                                            </div>
                                                        </div>
                                                        <div className="week-day-shifts">
                                                            {day.shifts.length === 0 ? (
                                                                <span className="no-shifts-text">No shifts</span>
                                                            ) : (
                                                                <>
                                                                    <div className="shift-count-badge">
                                                                        {day.shifts.length} {day.shifts.length === 1 ? 'shift' : 'shifts'}
                                                                    </div>
                                                                    {day.shifts.map((shift, idx) => (
                                                                        <div 
                                                                            key={idx}
                                                                            className="mini-shift"
                                                                            style={{ backgroundColor: shift.color }}
                                                                        >
                                                                            <div className="mini-shift-time">
                                                                                {formatTime(shift.start)}
                                                                            </div>
                                                                            <div className="mini-shift-title">
                                                                                {shift.title}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* List View */}
                                {mobileView === 'list' && (
                                    <div className="list-view">
                                        <FullCalendar
                                            ref={calendarRef}
                                            plugins={[listPlugin]}
                                            initialView="listWeek"
                                            headerToolbar={{
                                                left: 'prev,next',
                                                center: 'title',
                                                right: ''
                                            }}
                                            height="auto"
                                            timeZone="America/New_York"
                                            events={fetchEvents}
                                            eventTimeFormat={{ 
                                                hour: 'numeric', 
                                                minute: '2-digit', 
                                                hour12: true 
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Desktop Calendar View
                            <div className="calendar-wrapper">
                                <FullCalendar
                                    ref={calendarRef}
                                    plugins={[timeGridPlugin, dayGridPlugin, listPlugin, googleCalendarPlugin]}
                                    initialView="timeGridWeek"
                                    headerToolbar={{
                                        left: 'prev,today,next',
                                        center: 'title',
                                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                                    }}
                                    height={600}
                                    allDaySlot={false}
                                    timeZone="America/New_York"
                                    selectable={false}
                                    editable={false}
                                    slotMinTime={SLOT_MIN_TIME}
                                    slotMaxTime={SLOT_MAX_TIME}
                                    eventTimeFormat={{ 
                                        hour: '2-digit', 
                                        minute: '2-digit', 
                                        hour12: true 
                                    }}
                                    dayMaxEvents={true}
                                    events={fetchEvents}  // Dynamic fetching!
                                    nowIndicator={true}
                                    eventDisplay="block"
                                    eventContent={(eventInfo) => (
                                        <div className="custom-event">
                                            <div className="event-time">
                                                {eventInfo.timeText}
                                            </div>
                                            <div className="event-title">
                                                {eventInfo.event.title}
                                            </div>
                                            {eventInfo.event.extendedProps?.reason && (
                                                <div className="event-reason">
                                                    {eventInfo.event.extendedProps.reason}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Shifts;