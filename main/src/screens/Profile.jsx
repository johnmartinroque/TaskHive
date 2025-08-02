import React from "react";
import { onAuthStateChanged } from "firebase/auth";
import ChangePassword from "../components/authentication/ChangePassword";
import ProfilePicture from "../components/authentication/ProfilePicture";

function Profile() {
  return (
    <div>
      <ProfilePicture />
      <ChangePassword />
    </div>
  );
}

export default Profile;
