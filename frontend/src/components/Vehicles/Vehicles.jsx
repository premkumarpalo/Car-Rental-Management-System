import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"
export default function Vehicles(){
    const navigate = useNavigate()
    const [vehicles, setVehicles] = useState([])
    const [loading , setLoading] = useState(true)
    const [visibleCount,setvisibleCount] = useState(6)
    const [showModal, setShowModal] = useState(false)
    const [vehiclePhoto,setVehiclePhoto] = useState(null)
    const [ModelName,setModelName] = useState("")
    const [vehicleType,setVehicleType] = useState("")
    const [fuelType,setfuelType] = useState("")
    const [vehicleColour,setvehicleColour] = useState("")
    const [vehicleNo,setvehicleNo] = useState("")
    const [addLoad,setAddLoad] = useState(false)
    const [pop, setPop] = useState(false);
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);

    const getVehicles = async() => {
        try{
            const token = localStorage.getItem("accessToken")
            if (!token) {
                navigate("/login")
                return;
            }
            const response = await axios.get("http://localhost:8000/api/v1/vehicle/list-Vehicles", { headers: { Authorization: `Bearer ${token}`}})
            setVehicles(response.data.data)
        } catch(error){
            console.log("getVehicles Error : ",error)
        }finally{
            setLoading(false)
        }
    }
    
    const visibleVehicles = vehicles.slice(0,visibleCount)

    const AddVehicle = async() => {
        try {
            setAddLoad(true)
            const formData = new FormData()
            formData.append("vehiclePhoto",vehiclePhoto);
            formData.append("vehicleModelName",ModelName);
            formData.append("vehicleType",vehicleType);
            formData.append("vehicleColour",vehicleColour);
            formData.append("vehicleNumber",vehicleNo);
            formData.append("fuelType",fuelType);
            const vehicleRes = await axios.post("http://localhost:8000/api/v1/vehicle/add-Vehicle",formData,{headers:{Authorization:`Bearer ${localStorage.getItem("accessToken")}`}}) 
            alert("Vehicle Added")
        } catch (error) {
            console.log("Add vehicle error : ",error)
        }finally{
            setAddLoad(false)
            setShowModal(false)
        }
    }

    const removeVehicle = async(vehicleId) => {
        try {
            const response = await axios.patch(`http://localhost:8000/api/v1/vehicle/remove-Vehicles/${vehicleId}`,{},{headers:{Authorization:`Bearer ${localStorage.getItem("accessToken")}`}})
        } catch (error) {
            console.log("Remove Vehicle Error : ",error)
        }finally{
            setpop(false)
            setSelectedVehicleId(null)
        }
    }

    useEffect(() => {
        getVehicles()
    },[])

    if(loading){
        return(
            <div className="min-h-screen flex justify-center items-center">
                <h2 className="font-bold font-['Inter']">Loading Vehicles...</h2>
            </div>
        );
    }

    return(
        <div className="min-h-screen">
            
            <div className="flex justify-between">
                <h1 className="ml-17 font-bold font-['Inter'] mt-10 text-2xl">Here are all your vehicles 😃 </h1>

                <button className="flex items-center mr-25 w-[180px] h-[30px] bg-white mt-10 shadow-[0_4px_4px_0_rgba(0,0,0,0.3)] rounded-md cursor-pointer">
                    <img className="ml-2" width="30" height="20" src="https://img.icons8.com/fluency-systems-filled/48/sorting-options.png" alt="sorting-options"/>
                    <h2 className="font-['Inter'] font-bold ml-5">Sort By</h2>
                    <img className="ml-5" width="20" height="20" src="https://img.icons8.com/ios/50/expand-arrow--v1.png" alt="expand-arrow--v1"/>
                </button>

            </div>

            <div className="flex justify-between items-center">
                <div className="ml-17 border border-[#4804BE] shadow-[0_4px_16px_0_rgba(0,0,0,0.3)] rounded-lg h-10 flex w-140 bg-white mt-8">
                    <img className="ml-4" width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/search--v1.png" alt="search--v1" />
                    <input type="search" id="" placeholder="Search Vehicles" className="ml-2 outline-none w-full font-bold" />
                </div>
                <button type="button" onClick={() => setShowModal(true)} className="flex w-50 h-8 bg-white mr-20 items-center rounded-lg mt-7 cursor-pointer">
                    <img className="ml-3" width="35" height="35" src="https://img.icons8.com/fluency/48/add--v1.png" alt="add--v1"/>
                    <h2 className="ml-5 font-bold font-['Inter'] mr-2">Add Vehicles</h2>
                </button>
            </div>

            <div className="grid grid-cols-3 gap-6 ml-17 mt-8">
                {visibleVehicles.map((vehicle,index)=>(
                    // earlier the container height was 110 when return button was there
                    <div key={index} className="bg-white h-110 w-80"> 
                        <img className="h-40 w-75 ml-2 mt-2 object-cover" src={vehicle.vehiclePhoto} alt="vehicle photo" />
                        <h1 className="font-bold mt-4 font-['Inter'] ml-3">{vehicle.vehicleModelName}</h1>
                        <h1 className="font-bold mt-2 font-['Inter'] ml-3">Type : <span className="text-gray-700">{vehicle?.vehicleType}</span></h1>
                        <h1 className="font-bold mt-2 font-['Inter'] ml-3">Fuel : <span className="text-gray-700">{vehicle?.fuelType}</span></h1>
                        <h1 className="font-bold mt-2 font-['Inter'] ml-3">Colour : <span className="text-gray-700">{vehicle?.vehicleColour}</span></h1>

                        <div>
                            {vehicle.rentStatus === "NOT RENTED" ? (
                                <button className="bg-green-300 hover:bg-green-400 w-50 h-10 font-bold text-center cursor-pointer font-['Inter'] ml-15 rounded-lg mt-5" onClick={()=> navigate(`/BookNow/${vehicle._id}`)}>Book Now
                                </button>
                            ):(
                                <button className="bg-gray-300 text-gray-800 font-bold w-50 h-10 text-center cursor-pointer font-['Inter'] rounded-lg ml-15 mt-5">
                                    Booked
                                </button>
                            )}

                            <button
                                className={`w-50 h-10 text-center cursor-pointer font-['Inter'] rounded-lg ml-15 mt-5 font-bold ${vehicle.rentStatus === "RENTED" ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-300 hover:bg-red-400 text-gray-800" }`}

                                disabled={vehicle.rentStatus === "RENTED"}

                                onClick={() => {
                                    if (vehicle.rentStatus === "RENTED") return;
                                    setSelectedVehicleId(vehicle._id);
                                    setPop(true);
                                }}
                            >
                                Remove Vehicle
                            </button>

                        </div>
                    </div>
                ))}
            </div>

            {visibleCount<vehicles.length && (
                 <div className="flex justify-center mt-6">
                    <button onClick={() => setvisibleCount((prev) => prev + 3)}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Load More
                    </button>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-blue-100 bg-opacity-40 flex justify-center items-center z-50">

                    <div className="bg-white w-[500px] p-6 rounded-xl shadow-lg relative">

                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 text-xl font-bold cursor-pointer"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold mb-4">Add New Vehicle 🚗</h2>

                        <form className="flex flex-col gap-3">

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setVehiclePhoto(e.target.files[0])}
                                className="border p-2 rounded-md"
                            />

                            <input
                                type="text"
                                placeholder="Vehicle Model Name"
                                value={ModelName}
                                onChange={(e)=>setModelName(e.target.value)}
                                className="border p-2 rounded-md"
                            />

                            <select className="border p-2 rounded-md" value={vehicleType} onChange={(e)=>setVehicleType(e.target.value)}>
                                <option value = "" disabled>Select Vehicle Type</option>
                                <option value="BIKE">BIKE</option>
                                <option value="SCOOTY">SCOOTY</option>
                                <option value="CAR">CAR</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Vehicle Colour"
                                value={vehicleColour}
                                onChange={(e)=>setvehicleColour(e.target.value)}
                                className="border p-2 rounded-md"
                            />

                            <select className="border p-2 rounded-md" value={fuelType} onChange={(e)=>setfuelType(e.target.value)}>
                                <option value="" disabled>Select Fuel Type</option>
                                <option value="PETROL">PETROL</option>
                                <option value="DIESEL">DIESEL</option>
                                <option value="ELECTRIC">ELECTRIC</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Vehicle Number"
                                value={vehicleNo}
                                onChange={(e)=>setvehicleNo(e.target.value)}
                                className="border p-2 rounded-md"
                            />

                            <button type="button" className="bg-green-500 text-white py-2 rounded-md mt-2 hover:bg-green-600 cursor-pointer" onClick={()=>AddVehicle()}>
                                {addLoad ? "Adding" : "Add Vehicle"}
                            </button>

                        </form>

                    </div>
                </div>
            )}

            {pop && (
                <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50">

                    <div className="bg-white relative w-[500px] p-6 rounded-lg shadow-[0_4px_16px_0_rgba(0,0,0,0.3)]">

                        <button
                            onClick={() => setPop(false)}
                            className="absolute top-3 right-3 text-xl font-bold cursor-pointer"
                        >
                            ✕
                        </button>

                        <h2 className="font-['Inter'] font-bold text-center mt-5 text-lg">Are you sure you want to remove vehicle</h2>
                        <div className="flex items-center ml-22 mt-7">
                            <button type="button" className="bg-gray-300 text-blue-800 rounded-lg w-30 h-8 text-center font-bold cursor-pointer" onClick={()=>setPop(false)}>Cancel</button>
                            <button type="button" className="bg-red-300 text-blue-800 font-bold rounded-lg w-30 h-8 text-center ml-8 cursor-pointer" onClick={()=>{removeVehicle(selectedVehicleId);setPop(false)}}>Ok</button>
                        </div>
                    </div>

                </div>
            )}

        </div>
    )
}