import React, { useEffect } from "react";
import { Card, Space, Typography,Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { getAllPoses } from "../features/pos/posSlice";
import { getAllUniversities } from "../features/university/universitySlice";
import { getAllCustomers } from "../features/customer/customerSlice";
import { getAllMechants } from "../features/loans/merhcantSlice";


const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllPoses())
    dispatch(getAllUniversities())
    dispatch(getAllCustomers());
    dispatch(getAllMechants());
  }, [dispatch]);

  const users = useSelector((state) => state?.user?.users);
  const customers = useSelector((state)=>state?.customer?.customers);
  const poses = useSelector((state)=>state?.pos?.poses)
  const merchants = useSelector((state)=> state?.merchant?.merchants)
  console.log(merchants,"=>allMerchants")

  //  reverse merchants array to get lates merchants
  const latestMerchants = Array.isArray(merchants) && merchants.length > 0 && [...merchants].reverse().slice(0,10);
  console.log(latestMerchants,"=>latestMerchants")

  const merchantColumns = [
    {title:"#", dataIndex:"key"},
    {title:"Merchant Name", dataIndex:"merchantName"},
    {title:"Merchant Type", dataIndex:"merchantType"},
    {title:"Mobile Number", dataIndex:"mobileNumber"},
    {title:"Email Address", dataIndex:"emailAddress"},
    {title:"Date Of Registration", dataIndex:"dateOfRegistration"},
    {title:"Physical Address", dataIndex:"physicalAddress"},
  ]

  const dataSource = Array.isArray(latestMerchants) && latestMerchants.map((merchant,index)=>({
    key:index+1,
    merchantName:merchant?.merchantName,
    merchantType:merchant?.merchantType,
    mobileNumber:merchant?.mobileNumber,
    emailAddress:merchant?.emailAddress,
    dateOfRegistration:merchant?.dateOfRegistration,
    physicalAddress:merchant?.physicalAddress,
  }))


  return (
    <div>
      <div style={{ display:"flex", flexDirection:"column", gap:"10px"}}>
        <div style={{ display:"flex", flexDirection:"column"}}>
          <Typography style={{fontWeight:"700", fontSize:"24px", textAlign:"start", color:"#1F2937"}} >Dashboard</Typography>
        </div>
        <div style={{ gap:"14px", width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap" }}>

          <Card style={{ }} onClick={()=>navigate("/admin/users")} className="h-36 flex-1 cursor-pointer">
            <Space className="d-flex flex-row gap-4  items-center">
              <Typography style={{ color:"#1F2937",fontSize:"20px", fontWeight:"700", textAlign:"start",textWrap:"nowrap"}} >Users</Typography>
            </Space>
            <Typography style={{fontWeight:"600", fontSize:"30px", textAlign:"start"}}>{users?.length}</Typography>
          </Card>

          <Card onClick={()=> navigate("/admin/customers")} className="h-36 flex-1 cursor-pointer">
            <Space className="d-flex flex-row gap-4  items-center">
              <Typography style={{fontWeight:"700", fontSize:"20px", textAlign:"start",color:"#1F2937",textWrap:"nowrap"}}>Customers</Typography>
            </Space>
            <Typography style={{ fontWeight:"600", fontSize:"30px", textAlign:"start", color:"#1F2937" }} >{customers?.length}</Typography>
          </Card>

          <Card onClick={()=>{navigate("/admin/pos")}} className="h-36 flex-1 cursor-pointer">
            <Space className="d-flex flex-row gap-4  items-center">
              <Typography style={{ color:"#1F2937",fontSize:"20px", fontWeight:"700", textAlign:"start",textWrap:"nowrap"}}>Groupes</Typography>
            </Space>
            <Typography  style={{ color:"#1F2937", textAlign:"start", fontWeight:"600", fontSize:"30px" }}>{poses?.length}</Typography>
          </Card>

          <Card onClick={()=>navigate("/admin/merchants")} className="h-36 flex-1 cursor-pointer">
            <Space className="d-flex flex-row gap-4  items-center">
              <Typography style={{color:"#1F2937",fontSize:"20px", fontWeight:"700", textAlign:"start",textWrap:"nowrap"}}>Merchants</Typography>
            </Space>
             <Typography style={{fontSize:"30px", textAlign:"start", fontWeight:"600", color:"#1F2937" }}>{merchants?.length}</Typography>
          </Card>

        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:"20px", width:"100%", marginTop:"10px", marginBottom:"10px"}}>
          <Typography style={{fontWeight:"600", fontSize:"20px", textAlign:"start", color:"#1F2937" }}>Latest Merchants</Typography>
          <div>
            <Table columns={merchantColumns} dataSource={dataSource} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
