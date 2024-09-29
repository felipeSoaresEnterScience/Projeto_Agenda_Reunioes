import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Event } from "@/types/Event";

interface MonthViewProps {
  date: Date;
  events: Event[];
  onSlotSelect: (date: Date) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  date,
  events,
  onSlotSelect,
}) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const endDay = 6 - endOfMonth.getDay();

  const calendarDays = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: endOfMonth.getDate() }, (_, i) => i + 1),
    ...Array(endDay).fill(null),
  ];

  const getEventsForDay = (day: number | null) => {
    if (day === null) return [];
    const dayDate = new Date(date.getFullYear(), date.getMonth(), day);
    return events.filter(
      (event) => new Date(event.date).toDateString() === dayDate.toDateString()
    );
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dayName) => (
        <div key={dayName} className="text-center font-semibold p-2">
          {dayName}
        </div>
      ))}
      {calendarDays.map((day, index) => (
        <div
          key={index}
          className={cn(
            "p-2 border rounded-md h-32 overflow-hidden cursor-pointer hover:bg-gray-50",
            day === null ? "bg-gray-100" : "bg-white"
          )}
          onClick={() =>
            day !== null &&
            onSlotSelect(new Date(date.getFullYear(), date.getMonth(), day))
          }
        >
          {day !== null && (
            <>
              <div className="text-right">{day}</div>
              <ScrollArea className="h-24 mt-1">
                {getEventsForDay(day).map((event) => (
                  <div
                    key={event.id}
                    className="text-xs p-1 mb-1 bg-blue-100 rounded truncate"
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
              </ScrollArea>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
