import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

function UserAvatar({ size = 40, rounded = true, style = {} }) {
  const [avatarUrl, setAvatarUrl] = useState("/images/avatar1.jpeg");

  useEffect(() => {
    const fetchAvatar = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setAvatarUrl(
              data.profilePicture || user.photoURL || "/images/avatar1.jpeg"
            );
          } else {
            setAvatarUrl(user.photoURL || "/images/avatar1.jpeg");
          }
        } catch (error) {
          console.error("Error fetching avatar:", error);
        }
      }
    };

    fetchAvatar();
  }, []);

  return (
    <img
      src={avatarUrl}
      alt="User Avatar"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "fill",
        aspectRatio: "1 / 1",
        borderRadius: rounded ? "50%" : "8px",
        ...style,
      }}
    />
  );
}

export default UserAvatar;
