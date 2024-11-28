import React, { useState, useRef } from "react";
import CanvasDraw from "react-canvas-draw";

const TicketRaising = () => {
  const canvasRef = useRef(null);
  const [ticketDescription, setTicketDescription] = useState("");
  const [drawingData, setDrawingData] = useState(null);

  const saveDrawing = () => {
    const savedData = canvasRef.current.getSaveData();
    setDrawingData(savedData);
    alert("Drawing saved successfully!");
  };

  const clearDrawing = () => {
    canvasRef.current.clear();
  };

  const undoDrawing = () => {
    canvasRef.current.undo();
  };

  const submitTicket = () => {
    const ticketPayload = {
      description: ticketDescription,
      drawing: drawingData,
    };
    console.log("Submitting Ticket: ", ticketPayload);
    // You can send `ticketPayload` to the backend using Axios or Fetch
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Raise a Ticket</h1>
      <div>
        <label>Description:</label>
        <textarea
          rows="4"
          cols="50"
          value={ticketDescription}
          onChange={(e) => setTicketDescription(e.target.value)}
          placeholder="Describe your issue"
        />
      </div>

      <div>
        <h3>Draw or Annotate</h3>
        <CanvasDraw
          ref={canvasRef}
          brushColor="#000"
          brushRadius={2}
          canvasWidth={500}
          canvasHeight={300}
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <button onClick={saveDrawing}>Save Drawing</button>
        <button onClick={undoDrawing}>Undo</button>
        <button onClick={clearDrawing}>Clear</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={submitTicket}>Submit Ticket</button>
      </div>
    </div>
  );
};

export default TicketRaising;
