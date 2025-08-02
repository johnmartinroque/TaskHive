import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

function ProfilePicture() {
  const [selectedAvatar, setSelectedAvatar] = useState("/images/avatar1.jpeg"); // default avatar

  const navigate = useNavigate();

  const avatars = [
    "/images/avatar1.jpeg",
    "/images/avatar2.jpeg",
    "/images/avatar3.jpeg",
    "/images/avatar4.jpeg",
    "/images/avatar5.jpeg",
  ];

  return (
    <div className="mb-3">
      <label className="form-label">
        <h3>Select Profile Picture</h3>
      </label>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        {avatars.map((avatar, index) => (
          <img
            key={index}
            src={avatar}
            alt={`avatar${index + 1}`}
            onClick={() => setSelectedAvatar(avatar)}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              cursor: "pointer",
              border:
                selectedAvatar === avatar ? "3px solid blue" : "2px solid gray",
            }}
          />
        ))}
      </div>
    </div>
  );
}
export default ProfilePicture;
