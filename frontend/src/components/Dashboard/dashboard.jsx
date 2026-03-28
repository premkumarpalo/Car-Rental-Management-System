import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
export default function Dashboard(){
    const [ownerName ,setownerName] = useState("")
    const [totalVehicles,settotalVehicles] = useState("")
    const [availableVehicles,setavailableVehicles] = useState("")
    const [activeRentals,setactiveRentals] = useState("")
    const [vehicles, setVehicles] = useState([]);
    const [visibleCount, setVisibleCount] = useState(6);

    const navigate = useNavigate()

    const getProfile = async() => {
        const token = localStorage.getItem("accessToken")
        if(!token){
            navigate("/login")
            return;
        }
        try {
            const response = await axios.get("http://localhost:8000/api/v1/owner/profile",{headers:{
                Authorization:`Bearer ${localStorage.getItem("accessToken")}`
            }})
            setownerName(response.data.data.ownerName)
        } catch (error) {
            console.log("Error is : ",error)
        }
    }

    const getDetails = async() => {
        try {
            const [details, vehicleDetail, fetchAvailableVehicles] = await Promise.all([
                axios.get("http://localhost:8000/api/v1/rental/totalActiveRentals", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
                }),
                axios.get("http://localhost:8000/api/v1/vehicle/totalVehicles", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
                }),
                axios.get("http://localhost:8000/api/v1/vehicle/totalAvailableVehicles", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
                })
            ])

            setactiveRentals(details.data.data);
            settotalVehicles(vehicleDetail.data.data);
            setavailableVehicles(fetchAvailableVehicles.data.data);
        } catch (error) {
            console.log("Error occurred in getDetails function : ", error)
        }
    }

    const getVehicles = async() => {
        try {
            const vehicleData = await axios.get("http://localhost:8000/api/v1/vehicle/list-Vehicles",{headers:{Authorization:`Bearer ${localStorage.getItem("accessToken")}`}})
            setVehicles(vehicleData.data.data)
            
        } catch (error) {
            console.log("Error in getVehicle func : ",error)
        }
    }

    const visibleVehicles = vehicles.slice(0,visibleCount)

    useEffect(()=>{
        getProfile(),
        getDetails(),
        getVehicles()
    },[])

    return (
        <div className="min-h-screen">
            <h1 className="font-bold mt-10 ml-17 text-2xl font-['Inter']">Welcome Back , {ownerName} 👋</h1>
            <h2 className="ml-17 mt-2">Here's your rental overview</h2>

            <div className="flex mt-5 justify-around ml-[-25px]">

                <div className="flex justify-center items-center bg-white shadow-[0_4px_16px_0px_rgba(0,0,0,0.2)] h-[200px] w-[330px]">
                    <img width="50" height="50" src="https://img.icons8.com/ios-glyphs/30/car--v1.png" alt="car--v1"/>
                    <div className="flex flex-col ml-10">
                        <h2 className="text-xl font-bold">{totalVehicles}</h2>
                        <h2 className="text-xl mt-3 font-['Inter'] font-bold">Total Vehicles</h2>
                    </div>
                </div>

                <div className="flex justify-center items-center bg-white shadow-[0_4px_16px_0px_rgba(0,0,0,0.2)] h-[200px] w-[330px]">
                    <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/document--v1.png" alt="document--v1"/>
                    <div className="flex flex-col ml-10">
                        <h2 className="text-xl font-bold">{activeRentals}</h2>
                        <h2 className="text-xl mt-3 font-['Inter'] font-bold">Active Rentals</h2>
                    </div>
                </div>

                <div className="flex justify-center items-center bg-white shadow-[0_4px_16px_0px_rgba(0,0,0,0.2)] h-[200px] w-[330px]">
                    <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/create-new.png" alt="create-new"/>
                    <div className="flex flex-col ml-10">
                        <h2 className="text-xl font-bold">{availableVehicles}</h2>
                        <h2 className="text-xl mt-3 font-['Inter'] font-bold">Available Vehicles</h2>
                    </div>
                </div>

            </div>

            <h1 className="ml-16 font-bold font-['Inter'] mt-6 text-2xl">All Vehicles</h1>

            <div className="grid grid-cols-3 gap-6">
                {visibleVehicles.map((vehicle, index) => (
                    <div key={index} className="bg-white shadow-[0_4px_16px_0_rgba(0,0,0,0.4)] rounded-xl h-[330px] w-[330px] ml-17 mt-5">
                        <img
                            src={vehicle.vehiclePhoto}
                            alt="vehicle"
                            className="w-[298px] h-[170px] object-cover rounded-md ml-4 mt-4"
                        />

                        <div className="mt-3">
                            <h2 className="font-bold text-lg ml-4 mt-2 font-['Inter']">{vehicle.vehicleModelName}</h2>
                            <div className="flex items-center justify-between">
                                <p className="ml-4 mt-3 font-bold font-['Inter']">{vehicle.vehicleType}</p>
                                <p className={`text-md font-['Inter'] font-bold mr-5 mt-4 ${vehicle.rentStatus === "NOT RENTED" ? "text-[#127F03]" : "text-[#E63419]"}`}>{vehicle.rentStatus === "NOT RENTED" ? "Available" : "Unavailable"}</p>
                            </div>
                            <button type="submit" className="bg-[#D9D9D9] w-[180px] mt-5 ml-18 pl-4 pr-4 text-lg text-center font-bold rounded-md cursor-pointer" onClick={()=>navigate("/vehicles")}>View Details</button>
                        </div>
                    </div>
                ))}
            </div>

            {visibleCount < vehicles.length && (
                <div className="flex justify-center mt-6">
                    <button onClick={() => setVisibleCount((prev) => prev + 3)}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    )
}