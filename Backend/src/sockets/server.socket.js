import { Server } from "socket.io"

let io;

export function initServer(httpServer) {

    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    })
    console.log("socket server initialized");
    
    io.on("connection", (socket) => {
        console.log("user joined :", socket.id)
    })
}

export function getIO()
{
    if(!io)
    {
        throw new Error("server.io not initialized")
    }
    return io;
}