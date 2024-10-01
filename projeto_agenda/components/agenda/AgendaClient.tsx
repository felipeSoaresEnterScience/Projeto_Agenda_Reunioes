"use client";

import React, { useState, useMemo, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  List,
  Clock,
  Plus,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Event } from "@/types/Event";
import { AddEventModal } from "./AddEventModal";
import { EditEventModal } from "./EditEventModal";
import { DeleteEventModal } from "./DeleteEventModal";
import { useEvent } from "@/hooks/useEvent";

// Lazy load view components
const MonthView = lazy(() =>
  import("./views/MonthView").then((module) => ({ default: module.MonthView }))
);
const WeekView = lazy(() =>
  import("./views/WeekView").then((module) => ({ default: module.WeekView }))
);
const DayView = lazy(() =>
  import("./views/DayView").then((module) => ({ default: module.DayView }))
);
const ListView = lazy(() =>
  import("./views/ListView").then((module) => ({ default: module.ListView }))
);

type ViewType = "month" | "week" | "day" | "list";

const views: ViewType[] = ["month", "week", "day", "list"];

export default function AgendaClient() {
  const [activeView, setActiveView] = useState<ViewType>("month");
  const [date, setDate] = useState<Date>(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Modal de adição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal de edição
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Modal de exclusão
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
  const [eventIdToDelete, setEventIdToDelete] = useState<string | null>(null);
  const router = useRouter();

  const {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    fetchEvents,
    loading,
    error,
  } = useEvent();

  const handleDateChange = useCallback(
    (newDate: Date | undefined) => {
      if (newDate) {
        setDate(newDate);
        router.push(
          `/agenda?date=${
            newDate.toISOString().split("T")[0]
          }&view=${activeView}`
        );
      }
    },
    [activeView, router]
  );

  const handleViewChange = useCallback(
    (view: ViewType) => {
      setActiveView(view);
      router.push(
        `/agenda?date=${date.toISOString().split("T")[0]}&view=${view}`
      );
    },
    [date, router]
  );

  // Adicionar evento
  const handleAddEvent = useCallback(
    async (event: Event) => {
      try {
        await addEvent(event); // Chama a função do hook
        await fetchEvents(); // Atualiza a lista de eventos
        setIsAddModalOpen(false); // Fecha o modal de adição
      } catch (error) {
        console.error("Erro ao adicionar evento:", error);
      }
    },
    [addEvent, fetchEvents]
  );

  // Editar evento
  const handleUpdateEvent = useCallback(
    async (event: Event) => {
      try {
        await updateEvent(event.id.toString(), event); // Chama a função de atualização do hook
        await fetchEvents(); // Atualiza a lista de eventos
        setIsEditModalOpen(false);
      } catch (error) {
        console.error("Erro ao atualizar evento:", error);
      }
    },
    [updateEvent, fetchEvents]
  );

  // Deletar evento
  const handleDeleteEvent = useCallback(
    async (eventId: string) => {
      try {
        await deleteEvent(eventId); // Chama a função de deletar do hook
        await fetchEvents(); // Atualiza a lista de eventos
        setIsDeleteModalOpen(false); // Fecha o modal de exclusão
      } catch (error) {
        console.error("Erro ao deletar evento:", error);
      }
    },
    [deleteEvent, fetchEvents]
  );

  // Selecionar slot para adicionar evento
  const handleSlotSelect = useCallback((slotDate: Date) => {
    // Configurando a data e a hora selecionada ao clicar em um dia ou hora no calendário
    setSelectedSlot(slotDate);
    setIsAddModalOpen(true); // Abre o modal de adição
  }, []);

  // Clique em um evento para editar
  const handleEventClick = useCallback((event: Event) => {
    setEventToEdit(event);
    setIsEditModalOpen(true); // Abre o modal de edição
  }, []);

  // Abrir modal de exclusão de evento
  const handleDeleteEventClick = useCallback((eventId: string) => {
    setEventIdToDelete(eventId);
    setIsDeleteModalOpen(true); // Abre o modal de exclusão
  }, []);

  // Fechar todos os modais
  const handleModalClose = useCallback(() => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setEventToEdit(null);
    setSelectedSlot(null);
    setEventIdToDelete(null);
  }, []);

  const ViewIcon = useCallback(({ view }: { view: ViewType }) => {
    switch (view) {
      case "month":
      case "week":
        return <CalendarIcon className="h-4 w-4" />;
      case "day":
        return <Clock className="h-4 w-4" />;
      case "list":
        return <List className="h-4 w-4" />;
      default:
        return null;
    }
  }, []);

  const years = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i),
    []
  );

  return (
    <>
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const newDate = new Date(date);
                  if (activeView === "month")
                    newDate.setMonth(date.getMonth() - 1);
                  else if (activeView === "week")
                    newDate.setDate(date.getDate() - 7);
                  else if (activeView === "day")
                    newDate.setDate(date.getDate() - 1);
                  handleDateChange(newDate);
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Select
                  value={date.getMonth().toString()}
                  onValueChange={(value) => {
                    const newDate = new Date(date);
                    newDate.setMonth(parseInt(value));
                    handleDateChange(newDate);
                  }}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {new Date(0, i).toLocaleString("default", {
                          month: "long",
                        })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={date.getFullYear().toString()}
                  onValueChange={(value) => {
                    const newDate = new Date(date);
                    newDate.setFullYear(parseInt(value));
                    handleDateChange(newDate);
                  }}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const newDate = new Date(date);
                  if (activeView === "month")
                    newDate.setMonth(date.getMonth() + 1);
                  else if (activeView === "week")
                    newDate.setDate(date.getDate() + 7);
                  else if (activeView === "day")
                    newDate.setDate(date.getDate() + 1);
                  handleDateChange(newDate);
                }}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar Evento
              </Button>
              <Tabs
                value={activeView}
                onValueChange={(value: string) =>
                  handleViewChange(value as ViewType)
                }
              >
                <TabsList>
                  {views.map((view) => (
                    <TabsTrigger key={view} value={view} className="capitalize">
                      <ViewIcon view={view} />
                      <span className="ml-2 hidden sm:inline">{view}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="overflow-x-auto"
            >
              <div className="min-w-[800px]">
                <Suspense fallback={<div>Carregando...</div>}>
                  {activeView === "month" && (
                    <MonthView
                      date={date}
                      events={events}
                      onSlotSelect={(day) =>
                        handleSlotSelect(new Date(day.setHours(9, 0, 0, 0)))
                      }
                      onEventClick={handleEventClick}
                      onDeleteEventClick={handleDeleteEventClick} // Passando função para deletar
                    />
                  )}
                  {activeView === "week" && (
                    <WeekView
                      date={date}
                      events={events}
                      onSlotSelect={handleSlotSelect}
                      onEventClick={handleEventClick}
                      onDeleteEventClick={handleDeleteEventClick} // Passando função para deletar
                    />
                  )}
                  {activeView === "day" && (
                    <DayView
                      date={date}
                      events={events}
                      onSlotSelect={handleSlotSelect}
                      onEventClick={handleEventClick}
                      onDeleteEventClick={handleDeleteEventClick} // Passando função para deletar
                    />
                  )}
                  {activeView === "list" && (
                    <ListView
                      events={events}
                      onSlotSelect={handleSlotSelect}
                      onEventClick={handleEventClick}
                      onDeleteEventClick={handleDeleteEventClick} // Passando função para deletar
                    />
                  )}
                </Suspense>
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
      {/* Modal de Adição */}
      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onAddEvent={handleAddEvent}
        initialDate={selectedSlot || date} // Selecione o slot ou use a data atual
      />
      {/* Modal de Edição */}
      <EditEventModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onUpdateEvent={handleUpdateEvent}
        eventToEdit={eventToEdit}
      />
      {/* Modal de Exclusão */}
      <DeleteEventModal
        isOpen={isDeleteModalOpen}
        onClose={handleModalClose}
        onDeleteEvent={handleDeleteEvent}
        eventId={eventIdToDelete}
      />
    </>
  );
}
