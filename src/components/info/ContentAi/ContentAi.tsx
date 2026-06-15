import { ChatIA } from './ChatIA/ChatIA';
import styles from './ContentAi.module.css';
import { Historial } from './Historial/Historial';
import { useChat } from '../../../hooks/ia/useChat';

export const ContentAi = () => {
  const {
    messages,
    isLoading,
    isSending,
    error,
    sendMessage,
    clearHistory,
  } = useChat();

  return (
    <section className={styles.container}>
      <div className={styles.historial}>
        <Historial clearHistory={clearHistory} hasMessages={messages.length > 0} />
      </div>
      <div className={styles.chat}>
        <ChatIA
          messages={messages}
          isLoading={isLoading}
          isSending={isSending}
          error={error}
          sendMessage={sendMessage}
          clearHistory={clearHistory}
        />
      </div>
    </section>
  );
};
export default ContentAi;
