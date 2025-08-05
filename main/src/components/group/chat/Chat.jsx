import React, { useState, useEffect } from "react";
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

function Chat({ groupId, groupMembers }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
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
    const cleanedMessage = filter.clean(newMessage);

    await addDoc(messagesRef, {
      text: cleanedMessage,
      createdAt: serverTimestamp(),
      groupId,
      userId: currentUser.uid,
      userName: userInGroup.name || "Anonymous",
      profilePicture: userData.profilePicture || "/images/default-avatar.jpeg", // ✅ add this
    });

    setNewMessage("");
  };

  return (
    <div className="chat-app">
      <div className="header">
        <h1>Group Chat</h1>
      </div>
      <div className="messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className="message"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <img
              src={message.profilePicture || "/images/default-avatar.jpeg"}
              alt="avatar"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "1px solid #ccc",
              }}
            />
            <div>
              <span className="user" style={{ fontWeight: "bold" }}>
                {message.userName}:
              </span>{" "}
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="new-message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="new-message-input"
          placeholder="Type your message..."
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
