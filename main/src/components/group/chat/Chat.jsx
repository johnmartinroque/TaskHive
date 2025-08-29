import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { Filter } from "bad-words";
import { getAuth } from "firebase/auth";
import { Button } from "react-bootstrap";

function Chat({ groupId, groupMembers }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isChatMinimized, setIsChatMinimized] = useState(true);
  const messagesEndRef = useRef(null); // Ref for scrolling

  const MAX_MESSAGE_LENGTH = 280;

  const auth = getAuth();
  const currentUser = auth.currentUser;

  const messagesRef = collection(db, "messages");

  useEffect(() => {
    if (!groupId) return;

    const queryMessages = query(
      messagesRef,
      where("groupId", "==", groupId),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [groupId]);

useEffect(() => {
  if (!isChatMinimized && messages.length > 0) {
    // Scroll to bottom when chat is opened or messages update
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
}, [messages, isChatMinimized]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const userInGroup = groupMembers.find((m) => m.id === currentUser.uid);
    if (!userInGroup) {
      alert("You are not allowed to send messages in this group.");
      return;
    }

    const userDocRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userDocRef);
    const userData = userSnap.exists() ? userSnap.data() : {};

    const filter = new Filter();
    const cleanedMessage = filter.clean(newMessage.trim());

    if (cleanedMessage.length > MAX_MESSAGE_LENGTH) {
      alert(`Message is too long. Limit: ${MAX_MESSAGE_LENGTH} characters.`);
      return;
    }

    await addDoc(messagesRef, {
      text: cleanedMessage,
      createdAt: serverTimestamp(),
      groupId,
      userId: currentUser.uid,
      userName: userInGroup.name || "Anonymous",
      profilePicture: userData.profilePicture || "/images/default-avatar.jpeg",
    });

    setNewMessage("");
  };

  return (
    <div className="chat-wrapper">
      {isChatMinimized ? (
        <Button
          className="chat-toggle-btn bi bi-chat"
          variant="warning"
          onClick={() => setIsChatMinimized(false)}
        ></Button>
      ) : (
        <div className="chat-box">
          <div className="chat-header">
            <h3 className="m-0">Group Chat</h3>
            <button
              className="chat-toggle-btn bi bi-x"
              onClick={() => setIsChatMinimized(true)}
            ></button>
          </div>

          <div className="messages">
            {messages.map((message) => (
              <div key={message.id} className="message">
                <img
                  src={message.profilePicture || "/images/default-avatar.jpeg"}
                  alt="avatar"
                  className="avatar"
                />
                <div className="message-content">
                  <span className="user">{message.userName}</span>
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} /> {/* Scroll target */}
          </div>

          <form onSubmit={handleSubmit} className="new-message-form">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="new-message-input"
              placeholder="Type your message..."
              maxLength={MAX_MESSAGE_LENGTH}
            />
            <Button
              type="submit"
              variant="warning"
              className="send-button bi bi-send"
            ></Button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
