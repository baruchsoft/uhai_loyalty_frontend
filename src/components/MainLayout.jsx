import React, { useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Avatar, Button, Layout, Menu, theme, Card, Input } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { MdMapsHomeWork } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import { FaUniversity } from "react-icons/fa";
import { GiVillage } from "react-icons/gi";
import { RiGraduationCapFill } from "react-icons/ri";
import { BsFillBuildingsFill } from "react-icons/bs";
import { IoMapSharp } from "react-icons/io5";
import { FaMapMarked } from "react-icons/fa";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { PiUsersFill } from "react-icons/pi";
import { PiGlobeBold } from "react-icons/pi";
import { FaLocationDot } from "react-icons/fa6";
import { FaLocationPinLock } from "react-icons/fa6";
import { FaMessage } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";
import { UserOutlined } from "@ant-design/icons";
import { LiaUniversitySolid } from "react-icons/lia";
import { FaUsersGear } from "react-icons/fa6";
import { TiShoppingCart } from "react-icons/ti";
import { MdPointOfSale } from "react-icons/md";
import { FaFileInvoice } from "react-icons/fa6";
import Cookies from "js-cookie";
import { MdLoyalty } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { getAUser } from "../features/user/userSlice";

const { Search } = Input;
const onSearch = (value, _e, info) => console.log(info?.source, value);

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [decodedUser, setDecodedUser] = useState(null);
  const [seletedKey, setSelectedKey] = useState("dashboard");
  const location = useLocation();

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  };

  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const currentPath = pathSegments[2];
    setSelectedKey(currentPath);
  }, [location.pathname]);

  useEffect(() => {
    if (window.location.pathname === "/admin") {
      navigate("dashboard");
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    console.log(accessToken, "=> accessToken");

    if (accessToken) {
      const decodedUser = jwtDecode(accessToken);
      setDecodedUser(decodedUser);
      console.log(decodedUser);
    }
  }, []);

  useEffect(() => {
    if (decodedUser?.userId) {
      dispatch(getAUser(decodedUser?.userId));
    }
  }, [decodedUser?.userId]);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    window.location.reload();
  };

  const currentUser = useSelector((state) => state?.user?.user);
  console.log(currentUser, "...=>currentUser");

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="bg-white"
      >
        <div className="flex items-center justify-center h-16 bg-blue-600">
          {!collapsed ? (
            <div
              className="flex gap-1 items-center justify-center"
              style={{ margin: "4px" }}
            >
              <p className="text-white text-xl font-bold">VillageCAN</p>
              <Card
                style={{
                  margin: "4px",
                  width: "72px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "4px",
                }}
              >
                <p style={{ fontSize: "14px", fontWeight: "600" }}>
                  {" "}
                  {decodedUser?.role}
                </p>
              </Card>
            </div>
          ) : (
            <p className=" text-white text-xl font-bold">VC</p>
          )}
        </div>

        <Menu
          theme="light"
          mode="inline"
          selectedKeys={seletedKey}
          defaultSelectedKeys={["dashboard"]}
          onClick={({ key }) => {
            navigate(key);
            setSelectedKey(key);
          }}
          items={[
            {
              key: "user-profile",
              icon: (
                <FaUser
                  style={{
                    width: "16px",
                    height: "16px",
                    fontWeight: "800",
                    fontSize: "30px",
                  }}
                />
              ),
              label: (
                <p className="text-base font-medium cursor-pointer">
                  Welcome {currentUser && currentUser?.firstname}
                </p>
              ),
            },
            {
              key: "dashboard",
              icon: (
                <MdMapsHomeWork
                  style={{
                    width: "16px",
                    height: "16px",
                    fontWeight: "800",
                    fontSize: "30px",
                  }}
                />
              ),
              label: <p className="text-base font-medium">Dashboard</p>,
            },
            {
              key: "usersetups",
              icon: (
                <FaUsersGear
                  style={{
                    width: "16px",
                    height: "16px",
                    fontWeight: "800",
                    fontSize: "30px",
                  }}
                />
              ),
              label: <p className="text-base font-medium">Users Setups</p>,
              children: [
                {
                  key: "users",
                  icon: (
                    <PiUsersFill
                      style={{
                        width: "16px",
                        height: "16px",
                        fontWeight: "800",
                        fontSize: "30px",
                      }}
                    />
                  ),
                  label: <p className="text-base font-medium">Users</p>,
                },
                {
                  key: "roles",
                  icon: (
                    <FaKey
                      style={{
                        width: "16px",
                        height: "16px",
                        fontWeight: "800",
                        fontSize: "30px",
                      }}
                    />
                  ),
                  label: <p className="text-base font-medium">Roles</p>,
                },
                {
                  key: "customers",
                  icon: (
                    <MdLoyalty
                      style={{
                        width: "16px",
                        height: "16px",
                        fontWeight: "800",
                        fontSize: "30px",
                      }}
                    />
                  ),
                  label: <p className="text-base font-medium">Customers</p>,
                },
              ],
            },

            {
              key: "location Setups",
              icon: (
                <FaLocationPinLock style={{ width: "16px", height: "16px" }} />
              ),
              label: <p className="text-base font-medium">Location Setups</p>,
              children: [
                {
                  key: "countries",
                  icon: (
                    <PiGlobeBold style={{ width: "16px", height: "16px" }} />
                  ),
                  label: <p className="text-base font-medium">Countries</p>,
                },
                {
                  key: "counties",
                  icon: (
                    <FaMapMarkedAlt style={{ width: "16px", height: "16px" }} />
                  ),
                  label: <p className="text-base font-medium">Counties</p>,
                },
                {
                  key: "constituencies",
                  icon: (
                    <FaMapMarked style={{ width: "16px", height: "16px" }} />
                  ),
                  label: (
                    <p className="text-base font-medium">Constituencies</p>
                  ),
                },
                {
                  key: "wards",
                  icon: (
                    <IoMapSharp style={{ width: "16px", height: "16px" }} />
                  ),
                  label: <p className="text-base font-medium">Wards</p>,
                },
                {
                  key: "location",
                  icon: (
                    <FaLocationDot style={{ width: "16px", height: "16px" }} />
                  ),
                  label: <p className="text-base font-medium">Location</p>,
                },

                {
                  key: "sub-locations",
                  icon: (
                    <BsFillBuildingsFill
                      style={{ width: "16px", height: "16px" }}
                    />
                  ),
                  label: <p className="text-base font-medium">Sub-Locations</p>,
                },
                {
                  key: "villages",
                  icon: <GiVillage style={{ width: "16px", height: "16px" }} />,
                  label: <p className="text-base font-medium">Villages</p>,
                },
              ],
            },

            {
              key: "university-setups",
              icon: <FaUniversity style={{ width: "16px", height: "16px" }} />,
              label: <p className="text-base font-medium">University Setups</p>,
              children: [
                {
                  key: "universities",
                  icon: (
                    <LiaUniversitySolid
                      style={{ width: "16px", height: "16px" }}
                    />
                  ),
                  label: <p className="text-base font-medium">Universities</p>,
                },
                {
                  key: "campuses",
                  icon: (
                    <RiGraduationCapFill
                      style={{ width: "16px", height: "16px" }}
                    />
                  ),
                  label: <p className="text-base font-medium">Campuses</p>,
                },
              ],
            },

            {
              key: "Pos setups",
              icon: <MdPointOfSale style={{ width: "16px", height: "16px" }} />,
              label: <p className="text-base font-medium">Group Setups</p>,
              children: [
                {
                  key: "pos-types",
                  icon: (
                    <FaFileInvoice style={{ width: "16px", height: "16px" }} />
                  ),
                  label: <p className="text-base font-medium">POS Types</p>,
                },
                {
                  key: "pos",
                  icon: (
                    <TiShoppingCart style={{ width: "16px", height: "16px" }} />
                  ),
                  label: <p className="text-base font-medium">Groupes</p>,
                },
              ],
            },
            {
              key: "Loan Management",
              icon: <MdPointOfSale style={{ width: "16px", height: "16px" }} />,
              label: <p className="text-base font-medium">Loan Setup</p>,
              children: [
                {
                  key: "products",
                  icon: (
                    <FaFileInvoice style={{ width: "16px", height: "16px" }} />
                  ),
                  label: <p className="text-base font-medium">Loan Product</p>,
                },
                {
                  key: "merchants",
                  icon: (
                    <FaFileInvoice style={{ width: "16px", height: "16px" }} />
                  ),
                  label: <p className="text-base font-medium">Merchants</p>,
                },
                {
                  key: "accounts",
                  icon: (
                    <TiShoppingCart style={{ width: "16px", height: "16px" }} />
                  ),
                  label: <p className="text-base font-medium">Accounts</p>,
                },

                {
                  key: "grouploan",
                  icon: (
                    <TiShoppingCart style={{ width: "16px", height: "16px" }} />
                  ),
                  label: <p className="text-base font-medium">Group Loan</p>,
                },
                {
                  key: "grouploanrepayment",
                  icon: (
                    <TiShoppingCart style={{ width: "16px", height: "16px" }} />
                  ),
                  label: (
                    <p className="text-base font-medium">
                      Group Loan Repayment
                    </p>
                  ),
                },
                {
                  key: "loans",
                  icon: (
                    <TiShoppingCart style={{ width: "16px", height: "16px" }} />
                  ),
                  label: <p className="text-base font-medium">Loans</p>,
                },
                {
                  key: "loanrepayment",
                  icon: (
                    <TiShoppingCart style={{ width: "16px", height: "16px" }} />
                  ),
                  label: (
                    <p className="text-base font-medium">Loan Repayment</p>
                  ),
                },
              ],
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header
          style={{ padding: 0, background: colorBgContainer }}
          className="relative"
        >
          <div className="flex flex-row justify-between gap-1 items-center">
            <div className="flex flex-row justify-between items-center  gap:8 lg:gap-16">
              <Button
                type="text"
                htmlType="button"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: "16px", width: 64, height: 64 }}
              />
              <div className="  d-flex items-center justify-center hidden md:block">
                <Search
                  placeholder="Search"
                  onSearch={onSearch}
                  enterButton
                  style={{ width: "400px", marginTop: "16px" }}
                />
              </div>
            </div>

            <div className="flex flex-row items-center  gap-4 mr-4 lg:mr-12">
              <div>
                <FaMessage
                  className="text-lg cursor-pointer"
                  onClick={() => navigate("/messages")}
                />
              </div>
              <div>
                <IoNotifications className="text-lg cursor-pointer" />
              </div>
              <div className="flex flex-row gap-1  items-center">
                <Avatar
                  style={{ cursor: "pointer" }}
                  size={36}
                  icon={<UserOutlined />}
                  onClick={() => setOpen(!open)}
                  className="shrink-0"
                />
                <button
                  type="button"
                  className="text-sm cursor-pointer font-medium"
                  onClick={() => setOpen(!open)}
                >
                  {currentUser &&
                    `${currentUser?.firstname}  ${currentUser?.lastname}`}
                </button>
              </div>
            </div>
          </div>
        </Header>

        {open && (
          <div className="absolute flex flex-col justify-between border rounded-md w-24 h-24 bg-gray-100 p-2 md:right-32  lg:right-36 top-12 right-8">
            <button
              type="button"
              onClick={() => {
                navigate("/admin/user-profile");
                setOpen(!open);
              }}
              className="m-0 p-0 font-normal text-sm text-black font-sans hover:text-blue-600"
            >
              My Profile
            </button>
            <button
              type="button"
              onClick={() => {
                navigate("/admin/user-profile");
                setOpen(!open);
              }}
              className="m-0 p-0 font-normal text-sm text-black font-sans hover:text-blue-600"
            >
              Edit profile
            </button>
            <button
              type="button"
              onClick={() => {
                handleLogout();
                setOpen(!open);
              }}
              className="m-0 p-0 font-normal text-sm text-black font-sans hover:text-blue-600"
            >
              Logout
            </button>
          </div>
        )}

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
