import React from 'react'
import { useNavigate } from 'react-router-dom'
import {Button} from 'react-bootstrap'
function  Home() {
  const nav=useNavigate()
  return (
    <div>
        {/* <Button onClick={()=>{nav("/projects")}} >asdasdasd</Button> */}
        home
    </div>
  )
}

export default Home