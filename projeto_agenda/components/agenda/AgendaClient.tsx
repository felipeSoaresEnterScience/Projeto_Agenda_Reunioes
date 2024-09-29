"use client";

import React, { useState } from "react";
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
import { MonthView } from "./views/MonthView";
import { WeekView } from "./views/WeekView";
import { DayView } from "./views/DayView";
import { ListView } from "./views/ListView";
import { AddEventModal } from "./AddEventModal"; // Certifique-se que o caminho está correto

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
  const router = useRouter();

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      router.push(
        `/agenda?date=${newDate.toISOString().split("T")[0]}&view=${activeView}`
      );
    }
  };

  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
    router.push(
      `/agenda?date=${date.toISOString().split("T")[0]}&view=${view}`
    );
  };

  const handleAddEvent = (event: Event) => {
    setEvents([...events, event]);
    setIsModalOpen(false);
  };

  const handleSlotSelect = (slotDate: Date) => {
    setSelectedSlot(slotDate);
    setIsModalOpen(true);
  };

  const ViewIcon: React.FC<{ view: ViewType }> = ({ view }) => {
    switch (view) {
      case "month":
        return <CalendarIcon className="h-4 w-4" />;
      case "week":
        return <CalendarIcon className="h-4 w-4" />;
      case "day":
        return <Clock className="h-4 w-4" />;
      case "list":
        return <List className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - 5 + i
  );

  return (
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
                  onSlotSelect={handleSlotSelect}
                />
              )}
              {activeView === "week" && (
                <WeekView
                  date={date}
                  events={events}
                  onSlotSelect={handleSlotSelect}
                />
              )}
              {activeView === "day" && (
                <DayView
                  date={date}
                  events={events}
                  onSlotSelect={handleSlotSelect}
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
  );
}
