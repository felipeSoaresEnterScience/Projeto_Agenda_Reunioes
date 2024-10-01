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

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: Event) => void;
  initialDate: Date;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onAddEvent,
  initialDate,
}) => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(initialDate);
  const [startTime, setStartTime] = useState(""); // Hora de início
  const [endTime, setEndTime] = useState(""); // Hora de término
  const [eventDescription, setEventDescription] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Preenche os campos com base no initialDate quando o modal é aberto
  useEffect(() => {
    if (initialDate) {
      setEventDate(initialDate); // Preencher a data
      setStartTime(format(initialDate, "HH:mm")); // Preencher hora de início
      setEndTime(format(addMinutes(initialDate, 60), "HH:mm")); // Definir a hora de término uma hora depois
    }
  }, [initialDate]);

  // Submissão do formulário para adicionar um evento
  const handleSubmit = async () => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const startDateTime = new Date(eventDate);
    startDateTime.setHours(startHours, startMinutes);

    const endDateTime = new Date(eventDate);
    endDateTime.setHours(endHours, endMinutes);

    const duration =
      (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);

    const newEvent: Event = {
      id: Math.random(),
      title: eventName,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      description: eventDescription,
      duration: duration,
      date: startDateTime.toISOString().split("T")[0],
      category: category,
      user_id: 5, // Supondo que o `user_id` seja 5 para novos eventos
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setIsLoading(true);
    try {
      await onAddEvent(newEvent); // Adicionar novo evento
      // Limpar os campos do formulário após adicionar
      setEventName("");
      setEventDate(initialDate);
      setStartTime("");
      setEndTime("");
      setEventDescription("");
      setCategory(null);

      onClose();
    } catch (error) {
      console.error("Erro ao adicionar evento:", error);
    } finally {
      setIsLoading(false);
    }
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
          <Input
            type="date"
            value={format(eventDate, "yyyy-MM-dd")}
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
            {isLoading ? "Salvando..." : "Adicionar"}
          </Button>
          <Button onClick={onClose} variant="outline">
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
