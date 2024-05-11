// imports required for server
import { uniqueNamesGenerator, colors, names } from "unique-names-generator";
import express from "express";
import http from "http";

// Step 1
// import the socket.io library
import { Server } from "socket.io";

// Step 2
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Step 3
const chatHistory = [];

// Step 4
io.on("connection", function callback(socket) {
  const username = getUniqueUsername();
  console.log(`${username} connected`);

  socket.emit("receive-messages", {
    chatHistory: getAllMessages(),
    username,
  });

  // Step 5
  socket.on("post-message", function receiveMessages(data) {
    const { message } = data || { message: "" };
    console.log(message);
    chatHistory.push({
      username,
      message,
    });

    io.emit("receive-messages", {
      chatHistory: getAllMessages(),
    });
  });

  socket.on("disconnect", () => {
    console.log(`${username} disconnected`);
  });
});

// HELPER FUNCTIONS
// generate a unique username for each user
function getUniqueUsername() {
  return uniqueNamesGenerator({
    dictionaries: [names, colors],
    length: 2,
    style: "capital",
    separator: " ",
  });
}

function getAllMessages() {
  return Array.from(chatHistory).reverse();
}

// SERVER BOILERPLATE
// HTTP server setup to serve the page assets
app.use(express.static(process.cwd() + "/frontend"));

// HTTP server setup to serve the page at /
app.get("/", (req, res) => {
  return res.sendFile(process.cwd() + "/frontend/index.html");
});

// start the HTTP server to serve the page
server.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
