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

interface AgendaClientProps {
  initialEvents: Event[];
}

export default function AgendaClient({ initialEvents }: AgendaClientProps) {
  const [activeView, setActiveView] = useState<ViewType>("month");
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<Event | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const router = useRouter();

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

  const handleAddEvent = useCallback((event: Event) => {
    setEvents((prevEvents) => [...prevEvents, event]);
    setIsModalOpen(false);
  }, []);

  const handleSlotSelect = useCallback((slotDate: Date) => {
    setSelectedSlot(slotDate);
    setIsModalOpen(true);
  }, []);

  const handleEventDragStart = useCallback((event: Event) => {
    setDraggedEvent(event);
  }, []);

  const handleEventDragEnd = useCallback(
    (newStart: Date, newEnd: Date) => {
      if (draggedEvent) {
        const updatedEvent = {
          ...draggedEvent,
          start: newStart.toISOString(),
          end: newEnd.toISOString(),
        };
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === draggedEvent.id ? updatedEvent : event
          )
        );
        setDraggedEvent(null);
      }
    },
    [draggedEvent]
  );

  const handlePeriodSelect = useCallback((start: Date, end: Date) => {
    setSelectedPeriod({ start, end });
    setIsModalOpen(true);
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

  const monthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        value: i.toString(),
        label: new Date(0, i).toLocaleString("default", { month: "long" }),
      })),
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
              <Button onClick={() => setIsModalOpen(true)}>
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
                {activeView === "month" && (
                  <MonthView
                    date={date}
                    events={events}
                    onSlotSelect={(day) =>
                      handleSlotSelect(new Date(day.setHours(9, 0, 0, 0)))
                    }
                  />
                )}
                {activeView === "week" && (
                  <WeekView
                    date={date}
                    events={events}
                    onSlotSelect={(slotDate: Date) => {
                      handleSlotSelect(slotDate);
                    }}
                  />
                )}
                {activeView === "day" && (
                  <DayView
                    date={date}
                    events={events}
                    onSlotSelect={(slotDate: Date) => {
                      handleSlotSelect(slotDate);
                    }}
                  />
                )}
                {activeView === "list" && (
                  <ListView events={events} onSlotSelect={handleSlotSelect} />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddEvent={handleAddEvent}
        initialDate={selectedSlot || date}
        activeView={activeView}
      />
    </>
  );
}
