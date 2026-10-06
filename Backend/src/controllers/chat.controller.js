import { generateResponse , generateChatTitle} from "../services/ai.service.js";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

export async function createChat(req, res){
    const { message , chat : chatId} =req.body;
    const userId = req.user.id
    try {
        let chat = null
        let title = null
        if(!chatId){
            title = await generateChatTitle(message)
            chat = await Chat.create({
                title:title,
                user:userId
            })
        }
        const userMessage = await Message.create({
            chat: chat._id,
            role : "user",
            content : message
        })

        const messages = await Message.find({
            chat: chatId || chat._id
        })
        
        const response = await generateResponse(messages)

        const aiMessage = await Message.create({
            chat: chat?._id || chatId,
            role : "ai",
            content : response
        })
        return res.status(200).json({
            chat,
            aiMessage,
            userMessage
        })
    } catch (error) {
        throw new Error(error.message)
    }    
}

export async function getChats(req , res){
    const userId = req.user.id
    const chats = await Chat.find({
        user: userId
    })
    return res.status(200).json({
        message:"Chats fetched successfully",
        chats
    })
}

export async function getMessages(req , res)
{
    try {
        const { chatId } = req.params
        const chat = await Chat.findById({
            _id : chatId,
            user : req.user.id
        })
        if(!chat)
        {
            return res.status(404).json({
                message:"Chat not found"
            })
        }
        const messages = await Message.find({
            chat: chatId
        })
        return res.status(200).json({
            message:"Messages fetched successfully",
            messages
        })
    } catch (error) {
        throw new Error(error)
    }
}

export async function deleteChat(req , res)
{
    try {
        const { chatId } = req.params
        const chat = await Chat.findByIdAndDelete({
            _id : chatId,
            user : req.user.id
        })
        if(!chat)
        {
            return res.status(404).json({
                message:"Chat not found"
            })
        }
        await Message.deleteMany({
            chat: chatId
        })
        return res.status(200).json({
            message:"Chat deleted successfully",
            chat
        })
    } catch (error) {
        throw new Error(error)
    }
}