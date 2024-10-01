// /components/agenda/EditEventModal.tsx

import React, { useState, useEffect } from "react";
import { Event } from "@/types/Event";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format, parseISO } from "date-fns";

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateEvent: (event: Event) => void;
  eventToEdit: Event | null;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({
  isOpen,
  onClose,
  onUpdateEvent,
  eventToEdit,
}) => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (eventToEdit) {
      setEventName(eventToEdit.title);
      setEventDate(parseISO(eventToEdit.start));
      setStartTime(format(parseISO(eventToEdit.start), "HH:mm"));
      setEndTime(format(parseISO(eventToEdit.end), "HH:mm"));
      setEventDescription(eventToEdit.description || "");
      setCategory(eventToEdit.category || null);
    }
  }, [eventToEdit]);

  const handleSubmit = async () => {
    if (!eventDate) return;

    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const startDateTime = new Date(eventDate);
    startDateTime.setHours(startHours, startMinutes);

    const endDateTime = new Date(eventDate);
    endDateTime.setHours(endHours, endMinutes);

    const updatedEvent: Event = {
      ...eventToEdit!,
      title: eventName,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      description: eventDescription,
      category: category,
      updated_at: new Date().toISOString(),
    };

    setIsLoading(true);
    try {
      await onUpdateEvent(updatedEvent);
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Evento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Nome do evento"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
          <Input
            type="date"
            value={eventDate ? format(eventDate, "yyyy-MM-dd") : ""}
            onChange={(e) => setEventDate(parseISO(e.target.value))}
          />
          <div className="flex space-x-2">
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <span className="self-center">até</span>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <Textarea
            placeholder="Descrição do evento"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />
          <Input
            placeholder="Categoria"
            value={category || ""}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} variant="default" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
          <Button onClick={onClose} variant="outline">
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
