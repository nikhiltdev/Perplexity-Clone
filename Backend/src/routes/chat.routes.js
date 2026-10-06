import express from "express"
import { createChat , getChats , getMessages , deleteChat} from "../controllers/chat.controller.js"
import { userMiddleware } from "../middleware/user.middleware.js"
const chatRoutes = express.Router()

chatRoutes.post("/create-chat", userMiddleware ,createChat)
chatRoutes.get("/", userMiddleware ,getChats)
chatRoutes.get("/:chatId/message", userMiddleware ,getMessages)
chatRoutes.delete("/:chatId", userMiddleware ,deleteChat)

export default chatRoutes

