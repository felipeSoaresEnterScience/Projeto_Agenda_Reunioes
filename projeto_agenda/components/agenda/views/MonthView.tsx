// /components/agenda/views/MonthView.tsx

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Trash2, Edit2 } from "lucide-react"; // Ícones para Editar e Deletar

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

interface MonthViewProps {
  date: Date;
  events: EventsData;
  onSlotSelect: (date: Date) => void;
  onEventClick: (event: Event) => void; // Função para editar evento
  onDeleteEventClick: (eventId: string) => void; // Função para deletar evento
}

export const MonthView: React.FC<MonthViewProps> = ({
  date,
  events,
  onSlotSelect,
  onEventClick,
  onDeleteEventClick,
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
    if (day === null || !Array.isArray(events.data)) return [];
    const dayDate = new Date(date.getFullYear(), date.getMonth(), day);
    const formattedDate = dayDate.toISOString().split("T")[0];
    return events.data.filter((event) => event.date === formattedDate);
  };

  const formatTime = (dateTimeString: string) => {
    const eventDate = new Date(dateTimeString);
    return eventDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
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
            "p-2 border rounded-md h-32 overflow-hidden relative",
            day === null ? "bg-gray-100" : "bg-white hover:bg-gray-50"
          )}
          onClick={() =>
            day !== null &&
            onSlotSelect(new Date(date.getFullYear(), date.getMonth(), day))
          }
        >
          {day !== null && (
            <>
              <div className="text-right font-semibold text-lg">{day}</div>
              <ScrollArea className="h-24 mt-2">
                {getEventsForDay(day).map((event) => (
                  <div
                    key={event.id}
                    className="relative group p-1 mb-2 bg-blue-100 rounded-md shadow-md hover:shadow-lg transition-all"
                    title={`${event.title}: ${
                      event.description || "Sem descrição"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm text-blue-700">
                        {event.title}
                      </span>
                      {/* Ícones aparecem apenas no hover */}
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation(); // Evita que o clique abra o modal de adição
                            onEventClick(event);
                          }}
                        >
                          <Edit2 className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteEventClick(event.id.toString());
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {`${formatTime(event.start)} - ${formatTime(event.end)}`}
                    </div>
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
