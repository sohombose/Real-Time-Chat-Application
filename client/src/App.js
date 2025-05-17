// src/App.js
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [socketId, setSocketId] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      setSocketId(socket.id); // store your socket ID
    });

    socket.on('receive_message', (data) => {
      const self = data.id === socket.id;
      setChat((prevChat) => [...prevChat, { message: data.message, self }]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('send_message', { message,id:socket.id });
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <h2>Real-Time Chat App</h2>
      <div className="chat-box">
        {chat.map((chatMsg, index) => (
          <div
            key={index}
            className={`message ${chatMsg.self ? 'sender' : 'receiver'}`}
          >
            {chatMsg.message}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;

