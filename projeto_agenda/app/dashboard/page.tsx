"use client";

import React, { useState, useEffect } from "react";
import { useEvent, Event } from "@/hooks/useDashboard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const { events: eventResponse, fetchEvents, loading } = useEvent();
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (
      eventResponse &&
      eventResponse.data &&
      Array.isArray(eventResponse.data)
    ) {
      setRecentEvents(eventResponse.data.slice(0, 5)); // Mostrando os últimos 5 eventos
    }
  }, [eventResponse]);

  const handleRefresh = () => {
    fetchEvents();
  };

  const totalEvents =
    eventResponse && eventResponse.data && Array.isArray(eventResponse.data)
      ? eventResponse.data.length
      : 0;

  const todayEvents =
    eventResponse && eventResponse.data && Array.isArray(eventResponse.data)
      ? eventResponse.data.filter(
          (event) =>
            format(new Date(event.start), "yyyy-MM-dd") ===
            format(new Date(), "yyyy-MM-dd")
        ).length
      : 0;

  const futureEvents =
    eventResponse && eventResponse.data && Array.isArray(eventResponse.data)
      ? eventResponse.data.filter((event) => new Date(event.start) > new Date())
          .length
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-8"
    >
      {/* Header da Dashboard */}
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h1 className="text-4xl font-extrabold text-gray-800">Dashboard</h1>
        <Button
          variant="outline"
          className="flex items-center border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
          onClick={handleRefresh}
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Atualizar
        </Button>
      </motion.div>

      {/* Card de Eventos Recentes */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="bg-gray-100 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">
              Eventos Recentes
            </CardTitle>
            <CardDescription className="text-gray-600">
              Veja os eventos mais recentes criados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-700">Carregando eventos...</p>
            ) : recentEvents.length === 0 ? (
              <p className="text-gray-500">Nenhum evento recente encontrado.</p>
            ) : (
              <ul className="space-y-4">
                {recentEvents.map((event) => (
                  <li
                    key={event.id}
                    className="border border-gray-300 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow hover:scale-[1.02] transform"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {format(new Date(event.start), "dd/MM/yyyy HH:mm")} -{" "}
                          {format(new Date(event.end), "HH:mm")}
                        </p>
                        {event.category && (
                          <p className="text-xs text-gray-500">
                            Categoria: {event.category}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Estatísticas Rápidas */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card className="shadow-lg transition-transform hover:shadow-xl hover:scale-[1.03] bg-white border border-gray-300">
          <CardHeader>
            <CardTitle className="text-lg text-gray-700">
              Total de Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-800">{totalEvents}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg transition-transform hover:shadow-xl hover:scale-[1.03] bg-white border border-gray-300">
          <CardHeader>
            <CardTitle className="text-lg text-gray-700">
              Eventos de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-800">{todayEvents}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg transition-transform hover:shadow-xl hover:scale-[1.03] bg-white border border-gray-300">
          <CardHeader>
            <CardTitle className="text-lg text-gray-700">
              Eventos Futuros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-800">{futureEvents}</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
