import React, { useState } from "react";
import Chat from "../group/chat/Chat";

function LandingPage() {
  const [button, setButton] = useState(true);

  const click = () => {
    if (button) {
      setButton(false);
    } else {
      setButton(true);
    }
  };
  return (
    <div>
      <h1>Landing Page</h1>
      <p>gskehjhejklsehjklg</p>
      <h1>COMMIT TEST</h1>
      <button onClick={click}>TEST BUTTOn</button>
      <h1>{button ? <h1>hello</h1> : <h1>bye </h1>}</h1>
    </div>
  );
}

export default LandingPage;
