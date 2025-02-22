import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import { useGetUserByIdQuery } from "../redux/apis/user.api";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userId, setUserId] = useState("")

  const { data } = useGetUserByIdQuery(userId || "", {
    skip: !userId
  })

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    if (user) {
      setUserId(user._id)
    }
  }, [userId])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleMediaQueryChange = (e) => {
      setIsSidebarOpen(e.matches);
    };

    handleMediaQueryChange(mediaQuery);
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <>
      <div>
        <div className="w-full">
          <Navbar toggleSidebar={() => setIsSidebarOpen(true)} userData={data} />
        </div>
        <div className="flex s">
          {isSidebarOpen && (
            <>
              <div className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden" onClick={toggleSidebar}></div>
              <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 lg:hidden">
                <Sidebar toggleSidebar={toggleSidebar} userData={data} />
              </div>
            </>
          )}
          <div className={`overflow-y-auto fixed h-full bg-white shadow-lg z-20 hidden lg:block ${isSidebarOpen ? "w-64" : "w-0"}`}>
            <Sidebar toggleSidebar={toggleSidebar} userData={data} />
          </div>
          <div className={`flex-1 pt-28 pb-10 px-4 sm:px-8 transition-all bg-gray-50 duration-300 overflow-y-hidden min-h-screen ${isSidebarOpen ? "ml-0 lg:ml-80" : "ml-0"}`}>
            <Outlet />
          </div>
        </div>
      </div >

    </>
  );
};

export default Layout;
