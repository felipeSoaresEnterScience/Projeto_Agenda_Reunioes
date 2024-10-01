import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteEvent: (eventId: string) => void;
  eventId: string | null;
}

export const DeleteEventModal: React.FC<DeleteEventModalProps> = ({
  isOpen,
  onClose,
  onDeleteEvent,
  eventId,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!eventId) return;

    setIsLoading(true);
    try {
      await onDeleteEvent(eventId);
      onClose();
    } catch (error) {
      console.error("Erro ao deletar evento:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deletar Evento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Tem certeza de que deseja deletar este evento?</p>
        </div>
        <DialogFooter>
          <Button
            onClick={handleDelete}
            variant="destructive"
            disabled={isLoading}
          >
            {isLoading ? "Deletando..." : "Deletar"}
          </Button>
          <Button onClick={onClose} variant="outline">
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
