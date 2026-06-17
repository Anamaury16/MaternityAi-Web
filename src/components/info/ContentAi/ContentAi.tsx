import { useState } from 'react';
import { ChatIA } from './ChatIA/ChatIA';
import styles from './ContentAi.module.css';
import { Historial } from './Historial/Historial';
import { useChat } from '../../../hooks/ia/useChat';
import { getMessagesByTopic, TOPIC_TAGS } from '../../../utils/iaHelpers';

export const ContentAi = () => {
  const [activeTopic, setActiveTopic] = useState(0);
  const {
    messages,
    isLoading,
    isSending,
    error,
    sendMessage,
    clearHistory,
  } = useChat();

  const activeTopicTag = TOPIC_TAGS[activeTopic] || 'General';
  const filteredMessages = getMessagesByTopic(messages, activeTopicTag);

  return (
    <section className={styles.container}>
      <div className={styles.historial}>
        <Historial
          activeTopic={activeTopic}
          setActiveTopic={setActiveTopic}
          clearHistory={clearHistory}
          hasMessages={filteredMessages.length > 0}
        />
      </div>
      <div className={styles.chat}>
        <ChatIA
          messages={filteredMessages}
          isLoading={isLoading}
          isSending={isSending}
          error={error}
          sendMessage={sendMessage}
          clearHistory={clearHistory}
          activeTopicTag={activeTopicTag}
        />
      </div>
    </section>
  );
};
export default ContentAi;
