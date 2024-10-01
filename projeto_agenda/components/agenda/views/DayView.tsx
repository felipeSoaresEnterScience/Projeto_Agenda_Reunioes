import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react"; // Importando ícones para Editar e Deletar

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

interface DayViewProps {
  date: Date;
  events: EventsData;
  onSlotSelect: (date: Date) => void;
  onEventClick: (event: Event) => void; // Função para editar evento
  onDeleteEventClick: (eventId: string) => void; // Função para deletar evento
}

export const DayView: React.FC<DayViewProps> = ({
  date,
  events,
  onSlotSelect,
  onEventClick,
  onDeleteEventClick,
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForHour = (hour: number) => {
    if (!Array.isArray(events.data)) return [];
    return events.data.filter((event) => {
      const eventStart = new Date(event.start);
      return (
        eventStart.toDateString() === date.toDateString() &&
        eventStart.getHours() === hour
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
          <div className="w-16 text-right pr-2 font-semibold text-gray-600">{`${hour}:00`}</div>
          <div
            className="flex-grow relative h-16 cursor-pointer hover:bg-gray-100 transition-all duration-200"
            onClick={() => handleSlotClick(hour)}
          >
            {getEventsForHour(hour).map((event) => (
              <div
                key={event.id}
                className={cn(
                  "absolute left-0 right-0 bg-blue-50 text-sm p-2 flex justify-between items-center rounded-md shadow-md hover:shadow-lg transition-shadow duration-200 group"
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
                      e.stopPropagation();
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
        </div>
      ))}
    </div>
  );
};
