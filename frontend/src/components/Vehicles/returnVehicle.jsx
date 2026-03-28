import {useEffect, useState} from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
export default function ReturnVehicle(){
    const {rentalId} = useParams()
    const [bill,setBill] = useState("")
    const [loading,setLoading] = useState(true)
    const navigate = useNavigate()
    const getBill = async() => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/rental/rentalById/${rentalId}`,{headers:{Authorization:`Bearer ${localStorage.getItem("accessToken")}`}})
            setBill(response.data.data)
            setLoading(false)
        } catch (error) {
            console.log("Billing Error : ",error)
        }
    }

    useEffect(()=>{
        getBill()
    },[rentalId])

    if(loading){
        return (
            <div className="min-h-screen flex justify-center items-center">
                <h2 className="font-['Inter'] font-bold">Loading Billing Details....</h2>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#E6F0FA] pt-8">

            <div className="flex flex-col items-center">
                <img className="mt-4" width="88" height="88" src="https://img.icons8.com/color/48/verified-account--v1.png" alt="verified-account--v1" />
                <h1 className="font-['Inter'] font-bold mt-2 text-xl">Vehicle has Successfully been returned</h1>
            </div>

            <div className="flex flex-col items-center ml-115 mt-5 h-120 w-150 bg-white shadow-[0_4px_16px_0_rgba(0,0,0,0.2)]">
                <h2 className="font-['Inter'] font-bold italic text-xl mt-5 mb-2 underline">BILLING DETAILS</h2>
                <h2 className="font-['Inter'] font-bold mt-2 text-lg">Name : <span className="font-['Inter'] text-lg">{bill?.customerId?.name}</span></h2>
                <h2 className="font-['Inter'] font-bold mt-2 text-lg">Contact No : <span className="font-['Inter'] text-lg">{bill?.customerId?.contactNo}</span></h2>
                <h2 className="font-['Inter'] font-bold mt-2 text-lg">Vehicle Type : <span className="font-['Inter'] text-lg">{bill?.vehicleId?.vehicleType}</span></h2>
                <h2 className="font-['Inter'] font-bold mt-2 text-lg">vehicle Name : <span className="font-['Inter'] text-lg">{bill?.vehicleId?.vehicleModelName}</span></h2>
                <h2 className="font-['Inter'] font-bold mt-2 text-lg">Payment Type : <span className="font-['Inter'] text-lg">{bill?.paymentType}</span></h2>
                <h2 className="font-['Inter'] font-bold mt-2 text-lg">Payment Status : <span className="font-['Inter'] text-lg">{bill?.paymentStatus}</span></h2>
                <h2 className="font-['Inter'] font-bold mt-2 text-lg">Start Time : <span className="font-['Inter'] text-lg">{new Date(bill?.startTime).toLocaleString("en-IN")}</span></h2>
                <h2 className="font-['Inter'] font-bold mt-2 text-lg">End Time : <span className="font-['Inter'] text-lg">{new Date(bill?.endTime).toLocaleString("en-IN")}</span></h2>
                <h2 className="font-['Inter'] font-bold mt-2 text-lg">Total Cost : <span className="font-['Inter'] text-lg">₹ {bill?.totalFare}</span></h2>

                <button type="button" onClick={()=> navigate("/vehicles")} className="bg-[#a5cfff] hover:bg-[#4694ec] hover:text-white mt-8 cursor-pointer w-40 h-10 rounded-lg text-center text-['Inter'] text-lg font-bold">Done</button>
            </div>
            
        </div>
    )
}