import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

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

interface ListViewProps {
  events: {
    result: boolean;
    data: Event[];
  };
  onSlotSelect: (date: Date) => void;
  onEventClick: (event: Event) => void;
  onDeleteEventClick: (eventId: string) => void;
}

export const ListView: React.FC<ListViewProps> = ({
  events,
  onSlotSelect,
  onEventClick,
  onDeleteEventClick,
}) => {
  const sortedEvents = events.data
    ? [...events.data].sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
      )
    : [];

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-2">
      {sortedEvents.map((event) => (
        <Card
          key={event.id}
          className="shadow-md group hover:shadow-lg transition-shadow"
        >
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-800">{event.title}</h3>
              <p className="text-sm text-gray-500">
                {formatDateTime(event.start)} - {formatDateTime(event.end)}
              </p>
              {event.category && (
                <p className="text-xs text-gray-400">{event.category}</p>
              )}
            </div>
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEventClick(event)}
              >
                <Edit2 className="h-4 w-4 text-blue-600" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteEventClick(event.id.toString())}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      {sortedEvents.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum evento agendado. Clique em um slot de tempo para adicionar um
          novo evento.
        </div>
      )}
    </div>
  );
};
