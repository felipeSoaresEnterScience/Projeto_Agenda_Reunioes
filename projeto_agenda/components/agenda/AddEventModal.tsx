import React, { useState } from "react";
import { Event } from "@/types/Event"; // Certifique-se de que o tipo Event está corretamente importado
import Dialog from "@/components/ui/dialog"; // Certifique-se que tem um Dialog implementado

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: Event) => void;
  initialDate: Date;
  activeView: "month" | "week" | "day" | "list"; // Propriedade adicionada
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onAddEvent,
  initialDate,
  activeView, // Novo parâmetro recebido
}) => {
  const [eventName, setEventName] = useState<String>("");
  const [eventDate, setEventDate] = useState<Date>(initialDate);

  //const handleSubmit = () => {
  //const newEvent: Event = {
  //id: Math.random().toString(), // Pode usar um UUID real
  //name: eventName,
  //date: eventDate.toISOString(),
  //};
  //onAddEvent(newEvent);
  //};

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Adicionar Evento"></Dialog>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nome do Evento"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="input input-bordered w-full"
        />
        <input
          type="date"
          value={eventDate.toISOString().split("T")[0]}
          onChange={(e) => setEventDate(new Date(e.target.value))}
          className="input input-bordere d w-full"
        />
      </div>
      <div className="mt-4 flex justify-end">
        <button className="btn btn-primary">Adicionar</button>
        <button onClick={onClose} className="btn btn-outline ml-2">
          Cancelar
        </button>
      </div>
    </Dialog>
  );
};
