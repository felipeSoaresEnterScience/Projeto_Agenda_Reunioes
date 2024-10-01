"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Event } from "@/types/Event";

const API_URL = "http://127.0.0.1:8000/api/events"; // URL base da API

// Função para obter o token de autenticação
const getToken = () => {
  return localStorage.getItem("authToken"); // Substitua isso pela lógica de obtenção do token
};

export const useEvent = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Event[]>(API_URL, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setEvents(response.data);
    } catch (err) {
      setError("Erro ao buscar eventos");
    } finally {
      setLoading(false);
    }
  };

  // Função para adicionar um novo evento
  const addEvent = async (newEvent: Event) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<Event>(API_URL, newEvent, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setEvents((prevEvents) =>
        Array.isArray(prevEvents)
          ? [...prevEvents, response.data]
          : [response.data]
      );
    } catch (err) {
      setError("Erro ao adicionar evento");
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar um evento existente
  const updateEvent = async (id: string, updatedEvent: Event) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put<Event>(
        `${API_URL}/${id}`,
        updatedEvent,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setEvents((prevEvents) =>
        Array.isArray(prevEvents)
          ? prevEvents.map((event) =>
              event.id === Number(id) ? response.data : event
            )
          : []
      );
    } catch (err) {
      setError("Erro ao atualizar evento");
    } finally {
      setLoading(false);
    }
  };

  // Função para deletar um evento
  const deleteEvent = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setEvents((prevEvents) =>
        Array.isArray(prevEvents)
          ? prevEvents.filter((event) => event.id.toString() !== id)
          : []
      );
    } catch (err) {
      setError("Erro ao deletar evento");
    } finally {
      setLoading(false);
    }
  };

  // Busca os eventos ao carregar o componente
  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    fetchEvents,
  };
};
