import React, { useEffect, useState } from "react";
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
    name?: string;
    draft?: boolean;
    description?: string;
    eventType?: string;
    hasCurrentUser?: boolean;
    background?: string;
};

type Shift = {
    id?: string;
    title: string;
    start: string;
    end: string;
    color?: string;
    rrule?: string;
    duration?: number;
    allDay?: boolean;
    extendedProps?: ExtendedProps;
};

type ShiftsProps = {
    reloadShifts: number;
    spaceId?: number;
    currentUserId?: number;
};

type MobileView = 'day' | 'week' | 'list';

const Shifts: React.FC<ShiftsProps> = ({ 
    reloadShifts, 
    spaceId,
    currentUserId 
}) => {
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileView, setMobileView] = useState<MobileView>('day');
    const [currentDate, setCurrentDate] = useState(new Date());

    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const fetchShifts = async () => {
        setLoading(true);
        setError(null);
        try {
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 3);
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 3);

            const params = new URLSearchParams({
                event_type: 'shift',
                start: startDate.toISOString(),
                end: endDate.toISOString(),
            });

            if (currentUserId) {
                params.append('user_id', currentUserId.toString());
            }

            const data = await get(`staff/my_calendar/json/${spaceId}?${params.toString()}`);
            
            if (!Array.isArray(data)) {
                throw new Error('Invalid response format from server');
            }
            
            const formattedShifts = data
                .filter((event: any) => event.extendedProps?.eventType === 'shift')
                .map((event: any) => ({
                    id: event.id,
                    title: event.title,
                    start: event.start,
                    end: event.end,
                    color: extractColorFromBackground(event.extendedProps?.background),
                    allDay: event.allDay,
                    extendedProps: {
                        reason: event.extendedProps?.description,
                        training: event.extendedProps?.training,
                        course: event.extendedProps?.course,
                        language: event.extendedProps?.language,
                        ...event.extendedProps
                    },
                }));
            
            setShifts(formattedShifts);
        } catch (error) {
            setError("Failed to load shifts. Please try again.");
            toast.error("Failed to load shifts.");
        } finally {
            setLoading(false);
        }
    };

    const extractColorFromBackground = (background?: string): string => {
        if (!background) return '#3788d8';
        const match = background.match(/#[0-9A-Fa-f]{6}/);
        return match ? match[0] : '#3788d8';
    };

    useEffect(() => {
        if (spaceId) {
            fetchShifts();
        }
    }, [reloadShifts, spaceId, currentUserId]);

    const handleRefresh = () => {
        fetchShifts();
        toast.success("Shifts refreshed!");
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
        return shifts.filter(shift => {
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

    // Calculate statistics
    const totalShifts = shifts.length;
    const thisWeekShifts = shifts.filter(shift => {
        const shiftDate = new Date(shift.start);
        const now = new Date();
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);
        return shiftDate >= weekStart && shiftDate < weekEnd;
    }).length;

    return (
        <div className="shifts-container">
            {/* Header */}
            <div className="shifts-header">
                <div className="header-content">
                    <div className="header-title">
                        <CalendarMonth className="title-icon" />
                        <h2 className="title-text">My Shifts</h2>
                    </div>
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
                        <button className="retry-btn" onClick={fetchShifts}>
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && shifts.length === 0 && (
                    <div className="empty-state">
                        <AccessTime className="empty-icon" />
                        <h3>No Shifts Scheduled</h3>
                        <p>You don't have any shifts scheduled at the moment.</p>
                    </div>
                )}

                {!loading && !error && shifts.length > 0 && (
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
                                                        key={shift.id || index} 
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
                                                                            key={shift.id || idx}
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
                                            plugins={[listPlugin]}
                                            initialView="listWeek"
                                            headerToolbar={{
                                                left: 'prev,next',
                                                center: 'title',
                                                right: ''
                                            }}
                                            height="auto"
                                            timeZone="America/New_York"
                                            events={shifts}
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
                                    events={shifts}
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

                        {/* Shift Statistics */}
                        <div className="shift-stats">
                            <div className="stat-item">
                                <span className="stat-label">Total Shifts</span>
                                <span className="stat-value">{totalShifts}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">This Week</span>
                                <span className="stat-value">{thisWeekShifts}</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Shifts;