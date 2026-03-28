import {useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import axios from "axios"
import carBikePhoto from "../../logos/CarAndBikePhoto.png"
import create_image from "../../logos/create_image.png"

export default function Register(){
    const [ownerName,setownerName] = useState("")
    const [shopName,setshopName] = useState("")
    const [email,setemail] = useState("")
    const [contactNo,setcontactNo] = useState("")
    const [password,setpassword] = useState("")

    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post("http://localhost:8000/api/v1/owner/register",{ownerName,shopName,email,contactNo,password})

            const { accessToken, refreshToken } = response.data.data
            localStorage.setItem("accessToken", accessToken)
            localStorage.setItem("refreshToken", refreshToken)

            toast.success("Registered successfully")
            navigate("/dashboard")
        } catch (e) {
            toast.error("Registration Failed")
            console.log("Error is : ",e)
        } 
    }
    return (
        <div id="main-container" className="h-screen flex">
            <div id="left-section" className="bg-gradient-to-br from-[#F6F6F6] to-[#bfecff] h-full w-[790px]">
                <div className="inline-block mt-30 ml-50">
                    <img src={carBikePhoto} alt="" />
                </div>
                <h2 className="italic font-['Inter'] font-bold text-[#1E3A8A] ml-63 mt-3 text-2xl">RENT-A-RIDE</h2>
                <h2 className="font-['Inter'] ml-64 mt-1">Car & Bike Rentals</h2>
                <h2 className="font-semibold font-['Inter'] italic ml-53 mt-10 text-2xl">Manage Your Rentals</h2>
                <h2 className="font-semibold font-['Inter'] text-[#1E3A8A] italic ml-63 text-xl mt-2">All in One Place</h2>
                <hr class="border-t border-black border-2 mx-63 my-4 w-37"></hr>

                <div id="promotion" className="inline-block ml-55 mt-5">
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

            <div id="right-section" className="bg-gradient-to-br from-[#F6F6F6] to-[#87DDFF] h-full w-[790px] flex justify-center items-center">
                <div className="bg-[#F7F6F6] h-[600px] w-[350px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] rounded-xl">
                    <img src={create_image} alt="create icon" className="ml-13"/>
                    <h1 className="font-['Inter'] font-bold text-center text-xl">Create Account</h1>
                    <h2 className="font-['Inter'] text-center text-sm font-bold">Join Rent-A-Ride Today</h2>
                    <form onSubmit={handleRegister}>

                        <div className="border-2 rounded-lg ml-5 mr-5 h-[30px] mt-6">
                            <input type="text" 
                            placeholder="Enter Your Name"
                            value={ownerName}
                            onChange={(e)=>setownerName(e.target.value)}
                            required
                            className="w-full h-full px-2 outline-none"/>
                        </div>

                        <div className="border-2 rounded-lg ml-5 mr-5 h-[30px] mt-6">
                            <input type="text" 
                            placeholder="Enter Your shop Name"
                            value={shopName}
                            onChange={(e)=>setshopName(e.target.value)}
                            required
                            className="w-full h-full px-2 outline-none"/>
                        </div>

                        <div className="border-2 rounded-lg ml-5 mr-5 h-[30px] mt-6">
                            <input type="email" 
                            placeholder="Enter Your Email"
                            value={email}
                            onChange={(e)=>setemail(e.target.value)}
                            className="w-full h-full px-2 outline-none"/>
                        </div>

                        <div className="border-2 rounded-lg ml-5 mr-5 h-[30px] mt-6">
                            <input type="password" 
                            placeholder="Enter Your Password"
                            value={password}
                            onChange={(e)=>setpassword(e.target.value)}
                            required
                            className="w-full h-full px-2 outline-none"/>
                        </div>

                        <div className="border-2 rounded-lg ml-5 mr-5 h-[30px] mt-6">
                            <input type="tel" 
                            placeholder="Enter Your Mobile Number"
                            value={contactNo}
                            onChange={(e)=>setcontactNo(e.target.value)}
                            required
                            className="w-full h-full px-2 outline-none"/>
                        </div>

                        <div className="flex justify-center mt-4">
                            <button type="submit" className="bg-blue-200 font-['Inter'] font-semibold pt-1 pb-1 pr-8 pl-8 border-2 text-xl rounded-xl mt-5 cursor-pointer">Register</button>
                        </div>

                        <h2 className="text-sm mt-4 text-center">If Already Registered {" "}<Link to={"/login"} className="text-[#0411C3] font-bold">Login</Link></h2>

                    </form>
                </div>
            </div>
        </div>
    )
}