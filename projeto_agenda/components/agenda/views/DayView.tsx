import React from "react";
import { Event } from "@/types/Event";
import { cn } from "@/lib/utils";

interface DayViewProps {
  date: Date;
  events: Event[];
  onSlotSelect: (date: Date) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  date,
  events,
  onSlotSelect,
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForHour = (hour: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.toDateString() === date.toDateString() &&
        eventDate.getHours() === hour
      );
    });
  };

  const handleSlotClick = (hour: number) => {
    const selectedDate = new Date(date);
    selectedDate.setHours(hour, 0, 0, 0);
    onSlotSelect(selectedDate);
  };

  return (
    <div className="grid grid-cols-1 gap-1">
      {hours.map((hour) => (
        <div key={hour} className="flex border-b">
          <div className="w-16 text-right pr-2">{`${hour}:00`}</div>
          <div
            className="flex-grow relative h-16 cursor-pointer hover:bg-gray-50"
            onClick={() => handleSlotClick(hour)}
          >
            {getEventsForHour(hour).map((event) => (
              <div
                key={event.id}
                className={cn(
                  "absolute left-0 right-0 bg-blue-100 text-xs p-1 overflow-hidden rounded",
                  "top-0"
                )}
                style={{
                  height: `${((event.duration || 60) / 60) * 100}%`,
                }}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
