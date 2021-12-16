import React, { useState, useEffect } from 'react'
import axios from 'axios'




export default function Calls(){
  const [ showCalls, setShowCalls ] = useState({
    calls: []
  })
 
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
    
      {showCalls.calls.map(call =>
      <div>
      <div className="date-divider">
        
        - - - - {call.created_at.slice(0, 10)} - - - -
        </div>
         
         <div className="call">
           <div className="caller">
           <p>{call.to}</p>
           
           <p className="small-text">tried to call on {call.from}</p>
           </div>
           <div className="timestamp">{call.created_at.slice(11, 16)}</div>
           
           </div>
         </div>
         )}
    
  </div>
)


}