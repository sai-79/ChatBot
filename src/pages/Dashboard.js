import { useState } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import gql from 'graphql-tag';
import styles from '../styles/pages/Dashboard.module.css';
import { Helmet } from 'react-helmet';

const CHATS_QUERY = gql`
  query MyChats {
    chats(order_by: {created_at: desc}) {
      id
      title
    }
  }
`;

const MESSAGES_SUBSCRIPTION = gql`
  subscription ChatMessages($chat_id: uuid!) {
    messages(where: {chat_id: {_eq: $chat_id}}, order_by: {created_at: asc}) {
      id
      sender
      content
      created_at
    }
  }
`;

const CREATE_CHAT_MUTATION = gql`
  mutation CreateChat($title: String!) {
    insert_chats_one(object: {title: $title}) {
      id
      title
    }
  }
`;

const INSERT_USER_MESSAGE = gql`
  mutation InsertUserMessage($chat_id: uuid!, $content: String!) {
    insert_messages_one(object: {chat_id: $chat_id, sender: "user", content: $content}) {
      id
      content
      created_at
    }
  }
`;

const Dashboard = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [createChat] = useMutation(CREATE_CHAT_MUTATION);
  const [insertUserMessage] = useMutation(INSERT_USER_MESSAGE);

  
  const { data: chatsData, loading: chatsLoading, error: chatsError } = useQuery(CHATS_QUERY);

 
  const { data: messagesData, loading: messagesLoading, error: messagesError } = useSubscription(
    MESSAGES_SUBSCRIPTION,
    { variables: { chat_id: selectedChat }, skip: !selectedChat }
  );

  const handleCreateChat = async () => {
    const title = prompt('Enter chat title:');
    if (title) {
      const { data } = await createChat({ variables: { title } });
      setSelectedChat(data.insert_chats_one.id);
    }
  };

  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat) return;

    try {
      
      await insertUserMessage({
        variables: {
          chat_id: selectedChat,
          content: messageInput,
        },
      });

      // Calling  n8n webhook 
      const response = await fetch('https://saivenkat-03.app.n8n.cloud/webhook/hasura-sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: selectedChat,
          content: messageInput,
        }),
      });

      if (!response.ok) throw new Error('n8n webhook error');
      console.log('Message sent successfully:', await response.json());

      
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
     
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - Nhost</title>
      </Helmet>
      <div className={styles.chatContainer}>
        <div className={styles.sidebar}>
          <h3>Chats</h3>
          <button onClick={handleCreateChat} className={styles.newChatBtn}>+ New Chat</button>
          {chatsLoading && <div>Loading chats...</div>}
          {chatsError && <div>Error loading chats</div>}
          <ul className={styles.chatList}>
            {chatsData?.chats.map(chat => (
              <li
                key={chat.id}
                className={selectedChat === chat.id ? styles.activeChat : ''}
                onClick={() => setSelectedChat(chat.id)}
              >
                {chat.title}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.mainChat}>
          {selectedChat ? (
            <>
              <div className={styles.messages}>
                {messagesLoading && <div>Loading messages...</div>}
                {messagesError && <div>Error loading messages</div>}
                {messagesData?.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={msg.sender === 'user' ? styles.userMsg : styles.botMsg}
                  >
                    <b>{msg.sender === 'user' ? 'You' : 'Bot'}:</b> {msg.content}
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className={styles.form}>
                <input
                  type="text"
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className={styles.input}
                  autoComplete="off"
                />
                <button type="submit" className={styles.sendButton}>Send</button>
              </form>
            </>
          ) : (
            <div className={styles.selectChat}>Select a chat to start messaging</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
