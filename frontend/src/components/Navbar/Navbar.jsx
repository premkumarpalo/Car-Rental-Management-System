import { NavLink, useNavigate } from "react-router-dom"
import logo from "../../logos/CarRentalLogo.jpg"
import { useEffect, useState } from "react"
import axios from "axios"
export default function Navbar(){
    const navigate = useNavigate()
    const [ownerName,setownerName] = useState("")
    const [open,setOpen] = useState(false)

    const getProfile = async() => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                navigate("/login");
                return;
            }
            const response = await axios.get("http://localhost:8000/api/v1/owner/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setownerName(response.data.data.ownerName)   
        } catch (error) {
            console.log("Error occurred : ",error.response)
        }
    }

    const logoutUser = async() => {
        try {
            await axios.post("http://localhost:8000/api/v1/owner/logout", {} , {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                withCredentials: true
            })
        } catch (error) {
            console.log("Error in logout : ",error)
        } finally {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            navigate("/login")
        }
    }

    useEffect(()=>{
        getProfile()
    },[])
    return (
        <>
            <nav className="h-12 shadow-[0_4px_4px_8px_rgba(138,217,241,0.4)] mt-7 ml-16 mr-16 rounded-md sticky top-0 border-blue-700 border-2 flex justify-between items-center bg-white">

                <div className="h-8 w-15">
                    <img className="ml-10" src={logo} alt="logo" />
                </div>

                <div className="pr-5 pl-5">
                    <ul className="flex items-center font-bold font-['Inter'] text-xs">

                        <li className="ml-7"><NavLink to="/dashboard" className={({ isActive }) => `${isActive ? "text-[#FB0D0D]" : "text-black"}`}>DASHBOARD</NavLink>
                        </li>

                        <li className="ml-7"><NavLink to="/vehicles" className={({ isActive }) =>`${isActive ? "text-[#FB0D0D]" : "text-black"}`}>VEHICLES</NavLink>
                        </li>

                        <li className="ml-7">
                            <NavLink to="/rental" className={({ isActive }) =>`${isActive ? "text-[#FB0D0D]" : "text-black"}`}>RENTAL</NavLink>
                        </li>

                        <li className="ml-7">
                            <NavLink to="/rentalHistory" className={({ isActive }) => `${isActive ? "text-[#FB0D0D]" : "text-black"}`}>HISTORY</NavLink>
                        </li>
                    </ul>
                </div>

                <div className="relative">
                    <button onClick={()=>setOpen(!open)} className="flex items-center gap-2 bg-blue-300 px-3 py-1 mr-8 rounded-md cursor-pointer">
                        <img width="20" src="https://img.icons8.com/ios-filled/50/gender-neutral-user.png" alt="user"/>
                        <h2 className="font-bold">{ownerName}</h2>
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-2">
                            <button onClick={logoutUser} className="bg-blue-300 rounded-md text-center font-['Inter'] font-bold cursor-pointer shadow-md w-[90px]">LogOut</button>
                        </div>
                    )}
                </div>
            </nav>
        </>
    )
}