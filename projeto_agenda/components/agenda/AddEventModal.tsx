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
import { format, addMinutes, parseISO } from "date-fns";

type ViewType = "month" | "week" | "day" | "list";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: Event) => void;
  initialDate: Date;
  activeView: ViewType;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onAddEvent,
  initialDate,
  activeView,
}) => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(initialDate);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  useEffect(() => {
    setEventDate(initialDate);
    setStartTime(format(initialDate, "HH:mm"));
    setEndTime(format(addMinutes(initialDate, 60), "HH:mm"));
  }, [initialDate]);

  const handleSubmit = () => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const startDateTime = new Date(eventDate);
    startDateTime.setHours(startHours, startMinutes);

    const endDateTime = new Date(eventDate);
    endDateTime.setHours(endHours, endMinutes);

    const duration =
      (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);

    const newEvent: Event = {
      id: Math.random().toString(),
      title: eventName,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      description: eventDescription,
      duration: duration,
      date: startDateTime.toISOString(),
    };
    onAddEvent(newEvent);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Evento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Nome do evento"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
          {activeView !== "list" && (
            <Input
              type="date"
              value={format(eventDate, "yyyy-MM-dd")}
              onChange={(e) => setEventDate(parseISO(e.target.value))}
            />
          )}
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
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} variant="default">
            Adicionar
          </Button>
          <Button onClick={onClose} variant="outline">
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventModal;
