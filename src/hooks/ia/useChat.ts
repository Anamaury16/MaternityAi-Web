import { useState, useEffect, useCallback } from 'react';
import {
  getChatHistory,
  sendChatMessage,
  deleteChatHistory,
  type ChatMessage,
} from '../../services/iaService';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getChatHistory();
      setMessages(response.mensajes);
    } catch (err: any) {
      console.error('Error loading chat history:', err);
      setError(
        err.response?.data?.detail || 'No se pudo cargar el historial de conversación.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isSending) return;

    setIsSending(true);
    setError(null);

    // 1. Crear el mensaje del usuario (optimistic update)
    const userMessage: ChatMessage = {
      id: `user-msg-${Date.now()}`,
      rol: 'user',
      contenido: text,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      // 2. Realizar POST al backend
      const assistantMessage = await sendChatMessage(text);
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Error sending chat message:', err);
      setError(
        err.response?.data?.detail || 'No se pudo enviar el mensaje. Intenta nuevamente.'
      );
    } finally {
      setIsSending(false);
    }
  }, [isSending]);

  const clearHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteChatHistory();
      setMessages([]);
      return true;
    } catch (err: any) {
      console.error('Error clearing chat history:', err);
      setError(
        err.response?.data?.detail || 'No se pudo eliminar el historial.'
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar historial al montar el hook
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    messages,
    isLoading,
    isSending,
    error,
    sendMessage,
    clearHistory,
    refreshHistory: loadHistory,
  };
};
