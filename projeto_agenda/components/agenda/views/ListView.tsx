import React from "react";
import { Event } from "@/types/Event";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ListViewProps {
  events: Event[];
  onSlotSelect: (date: Date) => void;
}

export const ListView: React.FC<ListViewProps> = ({ events, onSlotSelect }) => {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-2">
      {sortedEvents.map((event) => (
        <Card key={event.id}>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold">{event.title}</h3>
              <p className="text-sm text-gray-500">
                {new Date(event.date).toLocaleString()}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSlotSelect(new Date(event.date))}
            >
              Editar
            </Button>
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
