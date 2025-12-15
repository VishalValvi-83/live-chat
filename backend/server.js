import app from "./src/app.js";
import http from 'http'
import { initSocket } from "./src/websocket/index.js";

const server = http.createServer(app)
initSocket(server)

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
