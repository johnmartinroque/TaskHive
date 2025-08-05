import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

function UserAvatar({ size = 40, rounded = true, style = {} }) {
  const [avatarUrl, setAvatarUrl] = useState("/images/default-avatar.jpeg");

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
              data.profilePicture ||
                user.photoURL ||
                "/images/default-avatar.jpeg"
            );
          } else {
            setAvatarUrl(user.photoURL || "/images/default-avatar.jpeg");
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
        objectFit: "cover",
        borderRadius: rounded ? "50%" : "8px",
        ...style,
      }}
    />
  );
}

export default UserAvatar;
