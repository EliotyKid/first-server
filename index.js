import * as colyseus from "colyseus"
import {createServer} from "http"
import {WebSocketTransport} from "@colyseus/ws-transport"
const matchMaker = colyseus.matchMaker
import {MainRoom} from "./src/rooms/main.js"
import express from "express"
import cors from "cors"


const app = express()
app.use(cors({origin: "*"}))

const httpServer = createServer(app)
const gameServer = new colyseus.Server({
  transport: new WebSocketTransport({
    server: httpServer,
  }),
  greet: false,
})

gameServer.listen(3000)
await matchMaker.onReady
matchMaker.controller.exposedMethods = ["joinById", "join"]

gameServer.define("main_room", MainRoom)
await matchMaker.createRoom("main_room")