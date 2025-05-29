import React, { useEffect } from "react";
import { Card, Space, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../features/user/userSlice";
import { FaUsers } from "react-icons/fa6";
import { MdPointOfSale } from "react-icons/md";
import { TbWorld } from "react-icons/tb";
import { MdOutlineLoyalty } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getAllPoses } from "../features/pos/posSlice";
import { getAllUniversities } from "../features/university/universitySlice";
import { getAllCustomers } from "../features/customer/customerSlice";


const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllPoses())
    dispatch(getAllUniversities())
    dispatch(getAllCustomers());
  }, [dispatch]);

  const users = useSelector((state) => state?.user?.users);
  const customers = useSelector((state)=>state?.customer?.customers);
  const poses = useSelector((state)=>state?.pos?.poses)
  const universities = useSelector((state)=>state?.university?.universities)


  return (
    <div>
      <div>
        <div style={{ display:"flex", flexDirection:"column"}}>
          <Typography.Title level={3}>Dashboard</Typography.Title>
        </div>
        <div style={{ gap:"14px", width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap" }}>
          <Card onClick={()=>navigate("/admin/users")} className="h-36 flex-1 cursor-pointer">
            <Space className="d-flex flex-row gap-4  items-center">
              <FaUsers style={{ width: "16px", height: "16px"}}/>
              <Typography.Title style={{ textWrap:"nowrap"}} level={4}>Users</Typography.Title>
            </Space>
            <Typography.Title level={2}>{users?.length}</Typography.Title>
          </Card>
          <Card onClick={()=> navigate("/admin/customers")} className="h-36 flex-1 cursor-pointer">
            <Space className="d-flex flex-row gap-4  items-center">
              <MdOutlineLoyalty style={{ width: "16px", height: "16px"}}/>
              <Typography.Title style={{ textWrap:"nowrap"}} level={4}>Customers</Typography.Title>
            </Space>
            <Typography.Title level={2}>{customers?.length}</Typography.Title>
          </Card>

          <Card onClick={()=>{navigate("/admin/pos")}} className="h-36 flex-1 cursor-pointer">
            <Space className="d-flex flex-row gap-4  items-center">
              <MdPointOfSale style={{ width: "16px", height: "16px"}}/>
              <Typography.Title  style={{ textWrap:"nowrap"}} level={4}>Pos</Typography.Title>
            </Space>
            <Typography.Title level={2}>{poses?.length}</Typography.Title>
          </Card>
          <Card onClick={()=>navigate("/admin/universities")} className="h-36 flex-1 cursor-pointer">
            <Space className="d-flex flex-row gap-4  items-center">
              <TbWorld style={{width: "16px",height: "16px"}}/>
              <Typography.Title style={{  textWrap:"nowrap"}} level={4}>Universities</Typography.Title>
            </Space>
            <Typography.Title level={2}>{universities?.length}</Typography.Title>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
