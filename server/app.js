const express  = require('express')
const { createServer } = require('node:http')
const { Server } = require('socket.io')
const cors = require('cors')

const app = express()

const server = createServer(app)

const io = new Server(server , {
    cors : {
        origin : "http://localhost:5173",
        credentials : true
    }
})
 
app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true,
    methods : ['GET','POST']
}))

io.on('connection', (socket) => {

    console.log("user Connected : ", socket.id)

    socket.on('send_message', (data) => {
        console.log(data)
        io.emit('received_message' ,{
            ...data , 
            id : socket.id
        })
    })

    socket.on('disconnect', ()=> {
        console.log("user Disconnected : ", socket.id)
    })
})

server.listen(8900, ()=> {
    console.log("App Started")
})