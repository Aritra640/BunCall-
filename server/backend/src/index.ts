import { Server as BunServer } from "bun";
import { Hono } from "hono";
import { Server as Socketio } from "socket.io";
import { Server as Engine } from "@socket.io/bun-engine";

const io = new Socketio({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const engine = new Engine({ path: "/socket.io/" });
io.bind(engine);

const emailToSocketMapping = new Map<string, string>();

io.on("connection", (socket) => {
  console.log("socket.io connected successfully!");

  socket.on("join-room", (data) => {
    const { roomID, emailID } = data;
    console.log("User", emailID, "Joined Room", roomID);
    emailToSocketMapping.set(emailID, socket.id);
    socket.join(roomID);
    socket.broadcast.to(roomID).emit("user-joined", { emailID });
  });
});

const app = new Hono();
app.get("/hello", (c) => c.text("hello from bun, hono and socket.io"));
const { websocket } = engine.handler();

export default {
  port: process.env.PORT ?? 8080,
  idleTimeout: 30,

  fetch(req: Request, server: BunServer) {
    const url = new URL(req.url);
    if (url.pathname.startsWith("/socket.io")) {
      //Websocket upgrade and socket.io go to engine
      return engine.handleRequest(req, server);
    } else {
      //All other http requests go to hono app
      return app.fetch(req, server);
    }
  },
};
