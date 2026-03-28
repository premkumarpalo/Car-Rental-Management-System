import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function SuccessPage(){
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-[#E6F0FA] flex justify-center items-center">
            <div className="shadow-[0_4px_16px_0_rgba(0,0,0,0.4)] w-130 h-90 bg-white">
                <div className="flex flex-col justify-center items-center gap-3">
                    <img className="mt-4" width="68" height="68" src="https://img.icons8.com/color/48/verified-account--v1.png" alt="verified-account--v1" />
                    <h2 className="text-center font-bold font-['Inter'] text-xl mt-2">Booking Confirmed</h2>
                </div>
                <h2 className="text-center mt-1">Your vehicle has succesfully been rented</h2>
                <div className="flex items-center bg-green-300 ml-45 mt-3 w-40 h-8 rounded-sm">
                    <img width="34" height="34" src="https://img.icons8.com/cute-clipart/64/approval.png" alt="approval" className="ml-2"/>
                    <h2 className="font-bold font-['Inter'] ml-2">Just Booked</h2>
                </div>
                <div className="flex items-center w-118 rounded-md h-8 bg-green-200 mt-5 ml-7">
                    <img className="ml-2" width="30" height="30" src="https://img.icons8.com/ios-filled/50/40C057/high-importance.png" alt="high-importance"/>
                    <h2 className="ml-2 text-sm">Please bring your valid ID and driving license at the time of pick up</h2>
                </div>
                <button onClick={()=>navigate("/dashboard")} className="bg-gray-300 text-center w-30 h-8 font-bold rounded-lg mt-5 ml-50 cursor-pointer">Done</button>
            </div>
        </div>
    )
}