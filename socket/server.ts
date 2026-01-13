import { WebSocketServer } from "ws";

const PORT = 3001;
const BACKEND_URL = "http://localhost:3000/api/admin/products/add";

const wss = new WebSocketServer({ port: PORT });
const chunkStore = new Map<string, any[]>();

console.log(`🟢 WebSocket server running on ws://localhost:${PORT}`);

wss.on("connection", (ws) => {
  console.log("✅ Client connected");

  ws.on("message", async (data) => {
    try {
      const payload = JSON.parse(data.toString());
      const { requestId, chunk, done } = payload;
      if (!requestId) {
        return ws.send(JSON.stringify({
          type: "ERROR",
          message: "requestId missing"
        }));
      }
      // Add chunk
      // chunkStore.get(requestId)!.push(chunk);

      // If last chunk → send to backend
        // 🔁 Send to backend
        const backendResponse = await fetch(BACKEND_URL, {
          method: "POST",
          headers: { "Content-Type": "multipart/form-data" },
          credentials: "include",
          body: JSON.stringify(chunk)
        });
        const result = await backendResponse.json();

        // 📤 Send response back to client
        ws.send(JSON.stringify({
          type: "BACKEND_RESPONSE",
          done,
          requestId,
          data: result
        }));

    } catch (err) {
      console.error("WS Error:", err);
      ws.send(JSON.stringify({
        type: "ERROR",
        message: "Invalid JSON payload"
      }));
    }
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});
