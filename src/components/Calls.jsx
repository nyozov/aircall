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
         <div className="call">{call.from}</div>
         
         )}
    
  </div>
)


}