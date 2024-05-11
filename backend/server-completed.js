// imports required for server
import { uniqueNamesGenerator, colors, names } from "unique-names-generator";
import express from "express";
import http from "http";

// import the socket.io library
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
