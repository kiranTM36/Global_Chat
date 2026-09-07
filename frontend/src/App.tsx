import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'

const socket = io('http://localhost:8900')

interface messageData {
  message : string,
  username : string,
  id : string
}

const App = () => {
  const [ username , setUsername ] = useState('')
  const [ message ,  setMessage ] = useState('')
  const [ messages , setMessages ] = useState<messageData[]>([])
  const [ display , setDisplay ] = useState(true)

  useEffect(()=> {
    const handleReceiveMessage = (data : messageData) => {
      setMessages((prev) => [
        ...prev, 
        data
      ])
    }

    socket.on('received_message', handleReceiveMessage)

    
    return () => {
      socket.off('received_message', handleReceiveMessage)
    }
  }, [])


  const sendMessage = () => {
    socket.emit('send_message' , {
      message ,
      username , 
    })
    setMessage('')
  }

  return (  
    <div className='h-screen w-screen flex justify-center items-center bg-gray-50'>
      {
        display && (
          <div className='h-screen w-screen drop-shadow-3xl bg-gray-200 fixed z-10 flex justify-center items-center'>
            <div className='bg-white shadow-2xl p-4 rounded-md'>
              <h1>Enter Username to join :</h1>
              <input type="text" className='border p-1' 
                onChange={(e)=> setUsername(e.target.value)}
                value={username}
                onKeyDown={(e)=> {
                  if(e.key === 'Enter' ){
                    if(username.trim() === '') return alert("Enter Name")
                    else {
                      setDisplay(false)
                    }
                  }
                }}
              />
            </div>
          </div>
        )
      }
      <div className='h-[70vh] w-[50vh] shadow-2xl rounded-md bg-white flex flex-col justify-between pb-4'>
        
        <div className='p-5 h-[65vh] w-full overflow-y-auto flex flex-col gap-2'>
          {
            messages.map((msg , index) =>(
              <div key={index} className={msg.username === username ? 'myChat' : 'otherChat'}>
                {msg.message}
              </div>
            ))
          }
        </div>
        <div className='flex justify-center items-center gap-3 px-5'>
          <input type="text"
            className='border p-1 w-[90%]'
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            onKeyDown={(e) => {
              if(e.key === 'Enter'){
                sendMessage()
              }
            }}
           />
           
           <button onClick={sendMessage} className='bg-blue-500 text-white p-1 px-3 rounded-sm'>send</button>
        </div>
      </div>
    </div>
  )
}

export default App