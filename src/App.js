import React, { useState } from "react";
import "./App.css";

function App() {
  const [state, setState] = useState({});

  const asyncRequest = async () => {
    const response = await fetch("/.netlify/functions/shuffle-tweets");

    if (response.ok) {
      const json = await response.json();
      setState({ winner: json.winners[0] === null ? [] : json.winners[0] });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center"
      }}
    >
      {state.winner && (
        <div style={{ marginBottom: 24 }}>
          <img
            src={state.winner.avatar}
            alt="Winner!"
            style={{ borderRadius: "50%" }}
            width="100"
          />
          <h2 style={{ fontSize: 48 }}>{state.winner.handler}</h2>
        </div>
      )}

      <div>
        <button
          style={{
            backgroundColor: "#378aae",
            borderRadius: 5,
            color: "white",
            appearance: "none",
            border: 0,
            fontSize: 24,
            fontWeight: 600,
            padding: "16px 24px"
          }}
          onClick={() => asyncRequest()}
        >
          Start Raffle!
        </button>
      </div>
    </div>
  );
}

export default App;
