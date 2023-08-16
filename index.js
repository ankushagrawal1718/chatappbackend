const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const socket = require("socket.io")
require("dotenv").config();
const app = express();
app.use(express.json());

const userRoutes = require("./routes/userRoutes"); 
const messageRoutes = require("./routes/messagesRoute");
app.use(cors());

app.use("/api/auth",userRoutes)
app.use("/api/messages",messageRoutes)
 
   
// mongoose.connect(process.env.MONGO_URL,{
//     useNewUrlParser:true,
//     useUnifiedTopology:true
// })
// .then(()=>{
//     console.log('Db connection is Successful')
// }).catch((e)=>{
//     console.log(e.message)
// })

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log('Db connection is Successful')
}).catch((e)=>{
    console.log(e.message)
})

app.get('/',(req,res)=>{
    res.send('Hello world');
})


const server = app.listen(process.env.PORT,()=>{
    console.log(`our basic express appp is setup now on port ${process.env.PORT}`);
})

const io = socket(server,{
    cors:{
        origin:"http://localhost:3000",
        credentials: true,
    }
})

global.onlineUsers = new Map();

io.on("connection",(socket)=>{
    global.chatSocket = socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId,socket.id);
    });

    socket.on("send-msg",(data)=>{
        // console.log("sendmsg",{data});
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit('msg-receive',data.message)
        }
    })
});
