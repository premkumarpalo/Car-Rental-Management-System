import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"
export default function Book(){
    const { vehicleId } = useParams()
    const [vehicle,setVehicle] = useState(null)
    const [name,setName] = useState("")
    const [age,setAge] = useState("")
    const [contactNo,setcontactNo] = useState("")
    const [drivingLicense,setdrivingLicense] = useState(null)
    const [customerSign,setcustomerSign] = useState(null)
    const [paymentType,setpaymentType] = useState("")
    const [paymentStatus,setpaymentStatus] = useState("UNPAID")
    const [address,setaddress] = useState("")
    const [rentLoad,setrentLoad] = useState(false)

    const navigate = useNavigate()

    const fetchVehicles = async() => {
        try {
            const token = localStorage.getItem("accessToken")
            if(!token){
                navigate("/login")
                return;
            }
            const vehicleData = await axios.get(`http://localhost:8000/api/v1/vehicle/getVehicle/${vehicleId}`,{headers:{Authorization:`Bearer ${token}`}})
            setVehicle(vehicleData.data.data)
        } catch (error) {
            console.log("fetchvehicle Error : ",error)
        }
    }

    const createCustomer = async() => {
        const token = localStorage.getItem("accessToken")
        if (!token) {
            navigate("/login")
            return;
        }
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("age", age);
            formData.append("contactNo", contactNo);
            formData.append("address", address);
            formData.append("drivingLicense", drivingLicense);
            formData.append("customerSign", customerSign);

            const customerResponse = await axios.post("http://localhost:8000/api/v1/customer/add-Customer",formData,{headers:{Authorization:`Bearer ${localStorage.getItem("accessToken")}`}})
            alert("Customer Added")
            return customerResponse.data.data._id
        } catch (error) {
            console.log("fetchRental Error : ",error)
        }
    }

    const handleBooking = async(e) => {
        e.preventDefault()
        if (!name.trim() || !age || !contactNo.trim()) {
            alert("Name, Age and Contact No are required");
            return;
        }

        if(contactNo.length<10){
            alert("Contact No is invalid")
            return;
        }
        
        try {
            setrentLoad(true)
            const customerId = await createCustomer()
            if (!customerId) {
                alert("Customer creation failed");
                return;
            }
            const rentalRes = await axios.post("http://localhost:8000/api/v1/rental/createRent",{customerId,vehicleId,paymentType,paymentStatus},{headers:{Authorization:`Bearer ${localStorage.getItem("accessToken")}`}})
                console.log("Booking Successful", rentalRes.data);
                setrentLoad(false)
                alert("Booking Successful")
                navigate("/success")
               
        } catch (error) {
            console.log("handle rent error",error)
        }
    }

    useEffect(()=>{
        fetchVehicles()
    },[vehicleId])

    if (!vehicle) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p className="text-lg font-bold">Loading vehicle...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#E6F0FA] min-h-screen pt-8">

            <div className="h-75 w-350 ml-15 mr-15 bg-white rounded-md flex shadow-[0_4px_16px_0_rgba(0,0,0,0.3)]">

                <div className="ml-15 mt-9" id="left-section">
                    <img src={vehicle?.vehiclePhoto} height={390} width={390} alt="" />
                </div>

                <div id="right-section" className="ml-70">
                    <h1 className="font-bold font-['Inter'] text-xl mt-8">{vehicle.vehicleModelName}</h1>
                    <hr className="border-2 border-blue-600 mt-2" />

                    <ul className="list-disc ml-5 mt-5 font-bold font-['Inter'] text-md">
                        <li>{vehicle.vehicleType}</li>
                        <li>{vehicle.fuelType}</li>
                        <li>{vehicle.vehicleColour}</li>
                    </ul>
                </div>

            </div>

            <h2 className="ml-15 mt-7 text-xl font-['Inter'] font-bold">Booking Details</h2>

            <form>
                <div className="flex items-center">
                    <div>
                        <h2 className="ml-15 mt-3 font-bold font-['Inter']">Customer Name :</h2>
                        <input type="text"
                            placeholder="Enter Customer Name"
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                            required
                            className="mt-2 ml-15 bg-white outline-none w-100 h-8 rounded-md" />
                    </div>

                    <div className="ml-100">
                        <h2 className="mt-3 font-bold font-['Inter']">Payment Type :</h2>
                        <select className="mt-2 bg-white p-2 rounded-md w-100 h-10" value={paymentType} onChange={(e)=>setpaymentType(e.target.value)} required>

                            <option value="" disabled>SELECT PAYMENT TYPE</option>
                            <option value="UPI">UPI</option>
                            <option value="CASH">CASH</option>
                            <option value="CARD">CARD</option>

                        </select>
                    </div>

                </div>

                <div className="flex items-center">
                    <div>
                        <h2 className="ml-15 mt-3 font-bold font-['Inter']">Age :</h2>
                        <input type="number"
                            placeholder="Enter Customer Age"
                            value={age}
                            min="18"
                            max="100"
                            required
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value <= 100) {
                                    setAge(value);
                                }
                            }}
                            className="mt-2 ml-15 bg-white outline-none w-100 h-8 rounded-md" />
                    </div>

                    <div className="ml-100">
                        <h2 className="mt-3 font-bold font-['Inter']">Payment Status :</h2>
                        <select className="mt-2 bg-white p-2 rounded-md w-100 h-10" required value={paymentStatus} onChange={(e)=>setpaymentStatus(e.target.value)}>
                            <option value="UNPAID">UNPAID</option>
                            <option value="PAID">PAID</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center">
                    <div>
                        <h2 className="ml-15 mt-3 font-bold font-['Inter']">Contact No :</h2>
                        <input type="tel"
                            placeholder="Enter Customer Contact No"
                            value={contactNo}
                            required
                            onChange={(e)=>setcontactNo(e.target.value)}
                            className="mt-2 ml-15 bg-white outline-none w-100 h-8 rounded-md" />
                    </div>

                    <div className="ml-86">
                        <h2 className="ml-15 mt-3 font-bold font-['Inter']">Address :</h2>
                        <input type="text"
                            placeholder="Enter Customer Address"
                            value={address}
                            onChange={(e)=>setaddress(e.target.value)}
                            className="mt-2 ml-15 bg-white outline-none w-100 h-8 rounded-md" />
                    </div>
                </div>

                <div className="flex items-center">
                    <div>
                        <h2 className="ml-15 mt-3 font-bold font-['Inter']">Driving License :</h2>
                        <label className="flex items-center cursor-pointer ml-15 mt-2 gap-2 bg-white w-100 h-8 rounded-md">
                            <img
                                width="34"
                                height="34"
                                src="https://img.icons8.com/sf-black-filled/64/add-file.png"
                                alt="add-file"
                            />

                            <p className="text-sm">
                                {drivingLicense ? drivingLicense.name : "No file selected"}
                            </p>

                            <input
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={(e) => setdrivingLicense(e.target.files[0])}
                            />
                        </label>
                    </div>

                    <div className="ml-86">
                        <h2 className="ml-15 mt-3 font-bold font-['Inter']">Customer Sign :</h2>
                        <label className="flex items-center cursor-pointer ml-15 mt-2 gap-2 bg-white w-100 h-9 rounded-md">
                            <img width="32" height="32" src="https://img.icons8.com/sf-black/64/upload.png" alt="upload pic" />

                            <p className="text-sm">
                                {customerSign ? customerSign.name : "No file selected"}
                            </p>

                            <input
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={(e) => setcustomerSign(e.target.files[0])}
                            />
                        </label>
                    </div>

                </div>

            </form>

            <div className="flex justify-center mt-10">
                 <button type="button" className="bg-[#4DF4BD] border-[#5418BD] border font-['Inter'] font-bold w-40 h-8 text-center rounded-lg shadow-[0_4px_4px_0_rgba(0,0,0,0.4)] mb-5 cursor-pointer" onClick={handleBooking}>{rentLoad ? "Renting" : "Rent Now"}</button>
            </div>
            
        </div>

    )
}