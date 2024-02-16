import React, { useEffect, useState } from "react";
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import toast, { Toaster } from "react-hot-toast";

type ExtendedProps = {
    reason?: string;
    training?: string;
    course?: string;
    language?: string;
};

type Shift = {
    id: string;
    title: string;
    start: string;
    end: string;
    color: string;
    extendedProps?: ExtendedProps;
};

type ShiftsProps = {
    reloadShifts: () => void;
};

const Shifts: React.FC<ShiftsProps> = ({ reloadShifts }) => {
    const [shifts, setShifts] = useState<Shift[]>([]);

    useEffect(() => {
        const fetchShifts = async () => {
            try {
                const response = await fetch("staff/shifts_schedule/get_shifts", {
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch shifts');
                }
                const data = await response.json();
                const formattedShifts = data.map((shift: any) => ({
                    id: shift.id.toString(),
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