import { useState, useEffect } from "react";
import axios from "axios";

// Definir o tipo do evento
export interface Event {
  id: number;
  title: string;
  description: string | null;
  start: string;
  end: string;
  date: string;
  duration: number;
  category: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
}

interface EventsResponse {
  result: boolean;
  data: Event[]; // A resposta da API contém a chave `data`, que é um array de eventos
}

// Hook customizado para eventos
export const useEvent = () => {
  const [events, setEvents] = useState<EventsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true); // Começa carregando
    setError(null); // Reseta o erro para uma nova requisição
    try {
      const token = localStorage.getItem("authToken"); // Pegando o token do localStorage

      if (!token) {
        setError("Token não encontrado");
        setLoading(false);
        return;
      }

      const response = await axios.get<EventsResponse>(
        "http://127.0.0.1:8000/api/events",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEvents(response.data); // Setar eventos da resposta da API
    } catch (err) {
      setError("Erro ao buscar eventos"); // Mensagem de erro ao falhar a requisição
    } finally {
      setLoading(false); // Parar o carregamento
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, loading, error, fetchEvents };
};
