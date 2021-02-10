import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

//app config
const app = express();
const dbConnection =
  "mongodb+srv://admin:admin@chat.jhrtz.mongodb.net/chat?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5050;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // origin: "https://sasocket.vercel.app",
    origin: "*",
    methods: ["GET", "POST"],
  },
});

//db config

mongoose.connect(dbConnection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("db connected");
  const dbCollection = db.collection("messages");
  const msgstrem = dbCollection.watch();

  msgstrem.on("change", (change) => {
    if (change.operationType == "insert") {
      const data = change.fullDocument;
      console.log(data);
      io.emit("msg", data);
    } else {
      console.log("error");
    }
  });
});

// midleware
app.use(cors());
app.use(express.json());

///request
import userRouter from "./router/userRouter.js";
import messageRouter from "./router/messageRouter.js";

app.get("/", (req, res) => {
  res.send("fuck you");
});

app.use("/", userRouter);
app.use("/", messageRouter);

//listen

server.listen(PORT, () => {
  console.log(`App start http://localhost:${PORT}`);
});
