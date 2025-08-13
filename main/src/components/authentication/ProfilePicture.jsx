import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { Button } from "react-bootstrap"; 

function ProfilePicture() {
  const [selectedAvatar, setSelectedAvatar] = useState("/images/avatar1.jpeg");
  const [currentAvatar, setCurrentAvatar] = useState(null); // currently saved avatar
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  const avatars = [
    "/images/avatar1.jpeg",
    "/images/avatar2.jpeg",
    "/images/avatar3.jpeg",
    "/images/avatar4.jpeg",
    "/images/avatar5.jpeg",
  ];

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setCurrentUserId(user.uid);
      const fetchAvatar = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.profilePicture) {
            setSelectedAvatar(data.profilePicture); // also set preview
            setCurrentAvatar(data.profilePicture); // track saved version
          }
        }
      };
      fetchAvatar();
    }
  }, []);

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleSubmit = async () => {
    if (selectedAvatar === currentAvatar) {
      // alert("No changes made.");
      return;
    }

    if (currentUserId) {
      try {
        const userDocRef = doc(db, "users", currentUserId);
        await updateDoc(userDocRef, {
          profilePicture: selectedAvatar,
        });
        setCurrentAvatar(selectedAvatar);
        // alert("Profile picture updated!");
        window.location.reload();
      } catch (error) {
        console.error("Failed to update profile picture:", error);
        // alert("Something went wrong.");
      }
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label">
        <h3>Select Profile Picture</h3>
      </label>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", justifyContent:"center" }}>
        {avatars.map((avatar, index) => (
          <img
            key={index}
            src={avatar}
            alt={`avatar${index + 1}`}
            onClick={() => handleAvatarSelect(avatar)}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              cursor: "pointer",
              objectFit: "cover",
              border:
                selectedAvatar === avatar ? "3px solid #ff8307ff" : "2px solid gray",
            }}
          />
        ))}
      </div>

      <button id="main-way" style={{width:"13rem", marginTop:"1rem"}} onClick={handleSubmit}>SUBMIT</button>

      {/* <div style={{ marginTop: "1rem" }}>
        <strong>Selected Picture Preview:</strong>
      </div>
      <img
        src={selectedAvatar}
        alt="Selected Avatar"
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          border: "2px solid black",
          objectFit: "cover",
          marginTop: "0.5rem",
        }}
      /> */}
    </div>
  );
}

export default ProfilePicture;
