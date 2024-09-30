import React from "react";
import { Event } from "@/types/Event";
import { cn } from "@/lib/utils";

interface WeekViewProps {
  date: Date;
  events: Event[];
  onSlotSelect: (date: Date) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  date,
  events,
  onSlotSelect,
}) => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());

  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDayAndHour = (day: Date, hour: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.toDateString() === day.toDateString() &&
        eventDate.getHours() === hour
      );
    });
  };

  const handleSlotClick = (day: Date, hour: number) => {
    const selectedDate = new Date(day);
    selectedDate.setHours(hour, 0, 0, 0);
    onSlotSelect(selectedDate);
  };

  return (
    <div className="grid grid-cols-8 gap-1">
      <div className="col-span-1"></div>
      {days.map((day, index) => (
        <div key={index} className="text-center font-semibold">
          <div>{day.toLocaleDateString("pt-BR", { weekday: "short" })}</div>
          <div>{day.getDate()}</div>
        </div>
      ))}
      {hours.map((hour) => (
        <React.Fragment key={hour}>
          <div className="text-right pr-2">{`${hour}:00`}</div>
          {days.map((day, dayIndex) => (
            <div
              key={`${hour}-${dayIndex}`}
              className="border h-12 relative cursor-pointer hover:bg-gray-50"
              onClick={() => handleSlotClick(day, hour)}
            >
              {getEventsForDayAndHour(day, hour).map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    "absolute top-0 left-0 right-0 bg-blue-100 text-xs p-1 overflow-hidden"
                  )}
                  style={{
                    height: `${((event.duration || 60) / 60) * 100}%`,
                  }}
                >
                  {event.title}
                </div>
              ))}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};
