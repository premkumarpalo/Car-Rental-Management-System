import React, { useState,useEffect } from "react"
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import carBikePhoto from "../../logos/CarAndBikePhoto.png"
import BMW_CAR from "../../logos/BMW_CAR.png"
import lock_icon from "../../logos/lock_icon.jpg"
export default function Login() {
    const [ownerName, setownerName] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const Loginhandle = async (e) => {
        // do not save it by default
        e.preventDefault()
        try {
            // get the response from the backend and connect the frontend to the endpoint
            const response = await axios.post("http://localhost:8000/api/v1/owner/login", { ownerName , password })
            // console.log(response.data)

            // fetch accessTokens and refreshTokens
            const { accessToken, refreshToken } = response.data.data
            // set the access and refresh Tokens
            localStorage.setItem("accessToken",accessToken)
            localStorage.setItem("refreshToken",refreshToken)

            navigate("/dashboard",{replace:true})
        } catch (e) {
            alert("Invalid Credentials")
            console.log("Error is : ",e)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            navigate("/dashboard", { replace: true });
        }
    }, [])

    return (
        <div id="main-container" className="h-screen flex relative">

            <div id="left-section" className="bg-[#d0e1f2] h-full w-[790px]">
                <img className="mt-25 ml-55" src={carBikePhoto} alt="car pic" />
                <h2 className="font-bold italic ml-68 mt-5 text-[#1E3A8A] text-2xl">RENT-A-RIDE</h2>
                <h2 className="font-bold font-['Inter'] ml-69 mt-2">Car & Bike Rentals</h2>
                <h2 className="font-semibold font-['Inter'] italic ml-60 mt-15 text-2xl">Manage Your Rentals</h2>
                <h2 className="font-semibold font-['Inter'] text-[#1E3A8A] italic ml-70 text-xl mt-2">All in One Place</h2>
                <hr className="border-t border-black border-2 mx-70 my-4 w-37"></hr>

                <div id="promotion" className="inline-block ml-68 mt-5">
                    <div id="promotion-1" className="flex justify-center items-center mr-15">
                        <img width="35" height="35" src="https://img.icons8.com/fluency/48/fiat-500.png" alt="fiat-500" />
                        <h3 className="font-bold italic ml-3">Easy Booking</h3>
                    </div>
                    <div id="promotion-2" className="flex justify-center items-center mr-4 mt-2">
                        <img width="30" height="35" src="https://img.icons8.com/ios-filled/50/notepad.png" alt="notepad" />
                        <h3 className="font-bold italic ml-3">Smart Management</h3>
                    </div>
                    <div id="promotion-3" className="flex justify-center items-center mr-16 mt-3">
                        <img width="30" height="25" src="https://img.icons8.com/wired/64/online-support--v2.png" alt="online-support--v2" />
                        <h3 className="font-bold italic ml-3">24/7 support</h3>
                    </div>
                </div>

            </div>

            <div id="right-section" className="bg-[#c9dcf6] h-full w-[790px]">
                <img className="mt-55 ml-33 h-[353px] w-[633px]" src={BMW_CAR} alt="" srcset="" />
            </div>

            <div id="login-container" className="absolute inset-0 flex justify-center items-center">
                <div className="bg-white h-[460px] w-[350px] rounded-lg shadow-[0_4px_8px_15px_rgba(172,189,234,0.4)]">
                    <img className="ml-18 relative" src={lock_icon} alt="lock icon" />
                    <h2 className="text-center font-bold text-lg">Welcome Back</h2>
                    <h3 className="text-center text-xs font-bold">Sign in to manage your rentals</h3>
                    <form onSubmit={Loginhandle}>

                        <div className="flex items-center rounded-lg p-2 w-70 ml-9 mt-5 bg-gray-200">
                            <img
                                width="20"
                                height="20"
                                src="https://img.icons8.com/ios-glyphs/30/name.png"
                                alt="name"
                                className="mr-2"
                            />
                            <input
                                className="flex-1 outline-none"
                                type="text"
                                placeholder="Enter Your Name"
                                value={ownerName}
                                required
                                onChange={(e) => setownerName(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center rounded-lg p-2 w-70 ml-9 mt-5 bg-gray-200">
                            <img width="20" 
                            height="20" 
                            src="https://img.icons8.com/parakeet-filled/48/lock.png" 
                            alt="lock"/>

                            <input
                                className="flex-1 outline-none"
                                type="password"
                                placeholder="Enter Your password"
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button className="cursor-pointer text-center ml-45 mt-2 italic font-bold text-[#2E1DE2]">Forgot Password ?</button>

                        <button type="submit" className="font-bold italic w-70 bg-[#BAD1FF] mt-4 py-1 text-lg ml-9 rounded-xl cursor-pointer">Login</button>

                        <h3 className="font-bold italic text-center text-sm mt-3">OR</h3>

                        <h3 className="text-center text-sm mt-2 font-semibold font-['Inter'] italic">Don't have an account ?{" "} <Link className="text-blue-700 font-bold" to={"/register"}>Register</Link></h3>
                    </form>
                </div>
            </div>
        </div>
    )
}