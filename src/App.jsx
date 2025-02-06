import { useState, useEffect, useRef } from "react"

function App() {

  const [ messages, setMessages ] = useState([])
  const [ userMess, setUserMess ] = useState('')
  const [ loading, setLoading ] = useState(false)

  const userInput = useRef(null)
  const bottomMess = useRef(null) //to keep message window always at the bottom
  
  useEffect(() => {
    bottomMess.current.scrollIntoView({ behavior: 'smooth' })
  })

  const sendMess = async() => {
    setLoading(true)

    if (!userMess) return
    setMessages([
      ...messages, 
      // { message: userMess, user: 'leo', length: 50, temperature: 0.5}
      { message: userMess, user: 'leo'}
    ])
    const request = await fetch('http://localhost:803/assistant', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      // body: JSON.stringify({ message: userMess.toLowerCase(), user: 'leo', length: 90, temperature: 1.0}),
      body: JSON.stringify({ message: userMess.toLowerCase(), user: 'leo'}),
    })
    const data = await request.json()
    setMessages([...messages, data])

    setUserMess('')
    setLoading(false)
  }

  return (
    <div className='chatpanel'>
      {/* header */}
      <div className='flex w-[100%] justify-center'>
        <h1 className='text-3xl text-red-700'>Q & A</h1>
      </div>
      {/* header */}

      {/* message body */}
      <div className='chatmessage'>
        {messages.map((mess, i) => (
          <div
            key={i}
            className='flex flex-col'
          >
            <div className='flex bg-green-200 justify-end w-[80%] ml-[19%] mr-[1%] mt-2 px-5 py-2 rounded-bl-xl rounded-tl-xl rounded-tr-xl'>
              {mess.userMessage && (
                <>
                  <h1 className='text-xl text-blue-600 text-right font-semibold'>
                    {mess.userMessage.charAt(0).toUpperCase()}{mess.userMessage.slice(1).replaceAll("::", "")}:
                    <span className='text-lg text-red-500 font-semibold ml-2'>user</span>
                  </h1>
                </>
              )}
            </div>

            <div className='flex flex-col bg-green-200 text-justifyjustify justify-start w-[80%] mr-[19%] ml-[1%] mt-2 px-5 py-2 rounded-tl-xl rounded-tr-xl rounded-br-xl'>
              <span className='text-lg text-red-500 font-semibold mr-2'>Anw:</span>

              {mess.serverResponse && mess.serverResponse.includes('\n') ? (
                  <>
                    {mess.serverResponse.split('\n').map((mes, i) => {
                      return (<h1 key={i} className='text-xl text-blue-700 font-semibold justify text-left'>{mes.charAt(0).toUpperCase()}{mes.slice(1)}</h1>)
                    })}
                  </>
                ) : (
                  <>
                    <h1 className='text-xl text-blue-700 font-semibold justify text-left'>{mess.serverResponse}</h1>
                  </>
              )}

              {/* Display loading spinner */}
              {loading && i === messages.length - 1 && <div className="loader"></div>}
              {/* {loading && i === messages.length - 1 && <div> <h1>Looking for answer</h1></div>} */}
              
            </div>
          </div>
        ))}

        {/* keep message window always at the bottom */}
        <div ref={bottomMess}></div>
        {/* keep message window always at the bottom */}
      </div>
      {/* message body */}

      {/* input area */}
      <div className='inputmessage'>
        <textarea 
          ref={userInput}
          value={userMess}
          onChange={(e) => setUserMess(e.target.value)}
          onKeyDown={(e) => {
            if(e.key === 'Enter') {
              setUserMess(e.target.value)
              sendMess()
              // setUserMess('')
            }
          }}
          placeholder="Type your question"
        />
        <div>
          <button
            onClick={(e) => sendMess()}
          >Send</button>
        </div>
      </div>
      {/* input area */}

    </div>
  )
}

export default App
