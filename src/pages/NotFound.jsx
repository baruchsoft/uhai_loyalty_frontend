import React from 'react'
import { MdOutlineErrorOutline } from "react-icons/md";
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';


const NotFound = () => {
    const navigate = useNavigate()
  return (
    <div style={{ overflow:"hidden", width:"100%", height:"100%"}}>
        <div style={{ rowGap:"16px",width:"100%", height:"100vh", flexDirection:"column",display:"flex", alignItems:"center", justifyContent:"center"}}>
            <MdOutlineErrorOutline style={{ fontSize:"32px", height:"48px",  width:"48px", color:"red"}} />
            <p style={{fontSize:"20px", fontWeight:"500", textAlign:"center",}}>404 - Page Not Found</p>
            <p style={{fontSize:"16x", fontWeight:"500", textAlign:"center"}}>Oops! The page you're looking for doesn’t exist or has been moved.</p>
            <Button onClick={()=> navigate(-1)} type='primary' htmlType='button' style={{ width:"132px",  height:"40px", fontSize:"16px", fontWeight:"500"}} >Go Back</Button>
        </div>
    </div>
  )
}

export default NotFound
