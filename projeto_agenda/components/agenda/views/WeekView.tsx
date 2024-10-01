import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2 } from "lucide-react";

interface Event {
  id: number;
  title: string;
  description: string | null;
  start: string;
  end: string;
  date: string;
  duration: number;
  category: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
}

interface EventsData {
  result: boolean;
  data: Event[];
}

interface WeekViewProps {
  date: Date;
  events: EventsData;
  onSlotSelect: (date: Date) => void;
  onEventClick: (event: Event) => void;
  onDeleteEventClick: (eventId: string) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  date,
  events,
  onSlotSelect,
  onEventClick,
  onDeleteEventClick,
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
    if (!Array.isArray(events.data)) return [];
    return events.data.filter((event) => {
      const eventStartDate = new Date(event.start);
      return (
        eventStartDate.toDateString() === day.toDateString() &&
        eventStartDate.getHours() === hour
      );
    });
  };

  const handleSlotClick = (day: Date, hour: number) => {
    const selectedDate = new Date(day);
    selectedDate.setHours(hour, 0, 0, 0);
    onSlotSelect(selectedDate);
  };

  const formatTime = (dateTimeString: string) => {
    const eventDate = new Date(dateTimeString);
    return eventDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="grid grid-cols-8 gap-1">
      <div className="col-span-1"></div>
      {days.map((day, index) => (
        <div key={index} className="text-center font-semibold text-gray-800">
          <div>{day.toLocaleDateString("pt-BR", { weekday: "short" })}</div>
          <div>{day.getDate()}</div>
        </div>
      ))}
      {hours.map((hour) => (
        <React.Fragment key={hour}>
          <div className="text-right pr-2 font-semibold text-gray-600">{`${hour}:00`}</div>
          {days.map((day, dayIndex) => (
            <div
              key={`${hour}-${dayIndex}`}
              className="border h-12 relative cursor-pointer hover:bg-gray-100 transition-all"
              onClick={() => handleSlotClick(day, hour)}
            >
              {getEventsForDayAndHour(day, hour).map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    "absolute top-0 left-0 right-0 bg-blue-50 text-sm p-2 rounded-md shadow-md hover:shadow-lg transition-all duration-200 flex justify-between items-center group"
                  )}
                  style={{
                    height: `${(event.duration / 60) * 100}%`,
                  }}
                  title={`${event.title}: ${
                    event.description || "Sem descrição"
                  }`}
                >
                  <span className="font-semibold text-blue-700">
                    {event.title}
                  </span>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que o clique abra o modal de adição
                        onEventClick(event);
                      }}
                    >
                      <Edit2 className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteEventClick(event.id.toString());
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};
