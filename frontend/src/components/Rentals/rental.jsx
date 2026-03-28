import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
export default function Rental(){
    const [rental,setRental] = useState([])
    const [loading,setLoading] = useState(true)
    const navigate = useNavigate()
    const fetchRental = async() => {
        const token = localStorage.getItem("accessToken")
        if(!token){
            navigate("/login")
            return;
        }
        try {
            const response = await axios.get("http://localhost:8000/api/v1/rental/activeRentals",{headers:{Authorization:`Bearer ${token}`}})
            setRental(response.data.data)
            setLoading(false)
        } catch (error) {
            console.log("fetchRental error",error)
        }
    }

    const handleReturn = async(rentalId) => {
        try {
            const returnResponse = await axios.post(`http://localhost:8000/api/v1/rental/returnvehicle/${rentalId}`,{},{headers:{Authorization:`Bearer ${localStorage.getItem("accessToken")}`}})
        } catch (error) {
            console.log("return error : ",error)
        }finally{
            navigate(`/returnVehicle/${rentalId}`)
        }
    }

    useEffect(()=>{
        fetchRental()
    },[])

    if(loading){
        return(
            <div className="min-h-screen flex justify-center items-center">
                <h2 className="font-bold font-['Inter']">Loading Rentals...</h2>
            </div>
        )
    }

    if (rental.length === 0) {
        return (
            <div className="min-h-screen">
                <div className="flex justify-between">
                    <h1 className="ml-17 font-bold font-['Inter'] mt-10 text-2xl">Here are all your active Rentals 😃 </h1>

                    <button className="flex items-center mr-25 w-[180px] h-[30px] bg-white mt-10 shadow-[0_4px_4px_0_rgba(0,0,0,0.3)] rounded-md cursor-pointer">
                        <img className="ml-2" width="30" height="20" src="https://img.icons8.com/fluency-systems-filled/48/sorting-options.png" alt="sorting-options" />
                        <h2 className="font-['Inter'] font-bold ml-5">Sort By</h2>
                        <img className="ml-5" width="20" height="20" src="https://img.icons8.com/ios/50/expand-arrow--v1.png" alt="expand-arrow--v1" />
                    </button>

                </div>
                
                <p className="font-bold ml-17 mt-5 font-['Inter']">No Active Rentals</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-15">
            <div className="flex justify-between">
                <h1 className="ml-17 font-bold font-['Inter'] mt-10 text-2xl">Here are all your active Rentals 😃 </h1>

                <button className="flex items-center mr-25 w-[180px] h-[30px] bg-white mt-10 shadow-[0_4px_4px_0_rgba(0,0,0,0.3)] rounded-md cursor-pointer">
                    <img className="ml-2" width="30" height="20" src="https://img.icons8.com/fluency-systems-filled/48/sorting-options.png" alt="sorting-options" />
                    <h2 className="font-['Inter'] font-bold ml-5">Sort By</h2>
                    <img className="ml-5" width="20" height="20" src="https://img.icons8.com/ios/50/expand-arrow--v1.png" alt="expand-arrow--v1" />
                </button>

            </div>

            <div className="ml-17 border border-[#4804BE] shadow-[0_4px_16px_0_rgba(0,0,0,0.3)] rounded-lg h-10 flex w-140 bg-white mt-8">
                <img className="ml-4" width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/search--v1.png" alt="search--v1" />
                <input type="search" placeholder="Search All Your Rentals" className="ml-2 outline-none w-full font-bold" />
            </div>

            <div className="flex flex-col gap-3">
                {rental.map((rent, index) => (
                    <div key={index} className="relative flex items-center w-300 h-70 bg-white mt-8 ml-17 rounded-md shadow-[0_4px_16px_0_rgba(0,0,0,0.3)]">

                        <div className="h-full w-100 flex items-center justify-center">
                            <img
                                src={rent.vehicleId.vehiclePhoto}
                                alt="vehicle photo"
                                className="h-50 object-contain"
                            />
                        </div>

                        <div className="flex flex-col justify-center ml-10">

                            <h2 className="font-semibold font-['Inter']">
                                Customer Name : <span className="italic">{rent.customerId.name}</span>
                            </h2>

                            <h2 className="font-semibold font-['Inter'] mt-1">
                                Contact Number : <span className="italic">{rent.customerId.contactNo}</span>
                            </h2>

                            <h2 className="font-semibold font-['Inter'] mt-1">
                                Address : <span className="italic">{rent.customerId.address}</span>
                            </h2>

                            <h2 className="font-semibold font-['Inter'] mt-1">
                                Payment Type : <span className="italic">{rent.paymentType}</span>
                            </h2>

                            <h2 className="font-semibold font-['Inter'] mt-1">
                                Payment Status :
                                <span className={`italic ml-1 ${rent.paymentStatus === "PAID" ? "text-green-700" : "text-red-500"}`}>
                                    {rent.paymentStatus}
                                </span>
                            </h2>

                        </div>

                        {rent.status === "ACTIVE" && (
                            <button
                                onClick={() => handleReturn(rent._id)}
                                className="absolute bottom-5 right-5 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-semibold shadow-md transition duration-200 cursor-pointer"
                            >
                                Return Now
                            </button>
                        )}

                    </div>
                ))}
            </div>
            
        </div>
    )
}