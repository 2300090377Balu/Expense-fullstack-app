// Chat.jsx
import { useState } from "react";
import axios from "axios";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    const res = await axios.post("http://localhost:8080/api/chat", { message: input });
    const botMessage = { sender: "bot", text: res.data.reply };
    setMessages(prev => [...prev, botMessage]);
    setInput("");
  };

  return (
    <div>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
    </div>
  );
}

export default Chat;
