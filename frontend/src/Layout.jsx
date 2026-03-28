import React from "react";
import { Outlet } from "react-router-dom"
import Navbar from "./components/Navbar/Navbar.jsx";
export default function Layout(){
    return(
        <>
        <div className="bg-[#E6F0FA] min-h-screen">
            <Navbar/>
            <Outlet/>
        </div>
        </>
    )
}