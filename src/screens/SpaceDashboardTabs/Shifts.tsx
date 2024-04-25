import React, { useEffect, useState } from "react";
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import toast, { Toaster } from "react-hot-toast";
import { get } from '../../utils/HTTPRequests';

// Type definition for the (optional) extended properties of a shift
type ExtendedProps = {
    reason?: string;
    training?: string;
    course?: string;
    language?: string;
};

// Type definition for a shift object
type Shift = {
    title: string;
    start: string;
    end: string;
    color: string;
    extendedProps?: ExtendedProps;
};

// Props for the Shifts component
type ShiftsProps = {
    reloadShifts: () => void;
};

const Shifts: React.FC<ShiftsProps> = ({ reloadShifts }) => {
    const [shifts, setShifts] = useState<Shift[]>([]);

    // Fetch shifts from the server and format them for the calendar
    useEffect(() => {
        const fetchShifts = async () => {
            try {
                const data = await get("staff/shifts_schedule/get_shifts");
                const formattedShifts = data.map((shift: any) => ({
                    title: shift.title,
                    start: shift.start,
                    end: shift.end,
                    color: shift.color,
                    extendedProps: shift.extendedProps,
                }));
                setShifts(formattedShifts);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load shifts.");
            }
        };

        fetchShifts();
    }, [reloadShifts]);

    // Define the minimum and maximum time slots for the calendar
    const SLOT_MIN_TIME = new Date(new Date().setHours(7, 0, 0, 0));
    const SLOT_MAX_TIME = new Date(new Date().setHours(23, 0, 0, 0));

    return (
        <>
            <h3 className="text-center mt-2">Shifts</h3>
            <div>
                <FullCalendar
                    plugins={[timeGridPlugin, listPlugin, googleCalendarPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={{
                        left: 'prev,today,next',
                        center: 'title',
                        right: 'timeGridWeek,timeGridDay'
                    }}
                    contentHeight="auto"
                    allDaySlot={false}
                    timeZone="America/New_York"
                    selectable={false}
                    editable={false}
                    slotMinTime={SLOT_MIN_TIME.toTimeString().split(' ')[0]}
                    slotMaxTime={SLOT_MAX_TIME.toTimeString().split(' ')[0]}
                    eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                    dayMaxEvents={true}
                    events={shifts}
                />
            </div>
            <Toaster />
        </>
    );
};

export default Shifts;