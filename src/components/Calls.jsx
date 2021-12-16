import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { HiPhoneMissedCall } from 'react-icons/hi'



export default function Calls(){
  const [ showCalls, setShowCalls ] = useState({
    calls: []
  })
  const [ state, setState ] = useState('Inbox')
 
  useEffect(()=> {
    
    axios.get(`https://aircall-job.herokuapp.com/activities`)
       .then((res) => {
        console.log(res)
        setShowCalls({calls: res.data})
        
        
      });
      
      console.log('test', showCalls)
  },[]);
 
 

return (
  <div className="call-container">
    <div className="buttons">
    <button onClick={(()=>{setState('Inbox')})}>Inbox</button>
      <button onClick={(()=>{setState('Archive')})}>Archive</button>
      </div>
      {state === 'Inbox' && 
      <div>
      {showCalls.calls.map(call =>
      {if (!call.is_archived)
        return (
      <div>
        
          
          
      <div className="date-divider">
        
        - - - - {call.created_at.slice(0, 10)} - - - -
        </div>
         
         <div className="call">
           <div className="phone-icon">
         <HiPhoneMissedCall size='2em'/>
         </div>
           <div className="caller">
             
           <p>{call.to || 'Unknown'}</p>
           
           <p className="small-text">tried to call on {call.from}</p>
           </div>
           <div className="timestamp">
             {call.created_at.slice(11, 16)}
           <p>id:{call.id}</p></div>
           
           </div>
         </div>
        )}
         )}
         </div>}
         {state === 'Archive' && 
      <div>
      {showCalls.calls.map(call =>
      {if (call.is_archived)
        return (
      <div>
        
          
          
      <div className="date-divider">
        
        - - - - {call.created_at.slice(0, 10)} - - - -
        </div>
         
         <div className="call">
           <div className="phone-icon">
         <HiPhoneMissedCall size='2em'/>
         </div>
           <div className="caller">
           <p>{call.to || 'Unknown'}</p>
           
           <p className="small-text">tried to call on {call.from}</p>
           </div>
           <div className="timestamp">{call.created_at.slice(11, 16)}</div>
           
           </div>
           
         </div>
         
        )}
         )}
         <button>reset all archived</button>
         </div>}
    
  </div>
)


}