import React from "react";
import { onAuthStateChanged } from "firebase/auth";
import ChangePassword from "../components/authentication/ChangePassword";

function Profile() {
  return (
    <div>
      <ChangePassword />
    </div>
  );
}

export default Profile;
