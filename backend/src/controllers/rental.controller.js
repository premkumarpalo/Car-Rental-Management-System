import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import {rental} from "../models/rental.models.js"
import {vehicle} from "../models/vehicle.models.js"

const createRent = asyncHandler(async(req,res)=>{
    const {customerId , vehicleId , paymentType , paymentStatus} = req.body
    if(!customerId || !vehicleId || !paymentType){
        throw new ApiError(400,"These fields are required")
    }

    const Vehicle = await vehicle.findOne({ _id: vehicleId, shopId: req.user._id })
    if(!Vehicle){
        throw new ApiError(404,"Vehicle doesnt exists")
    }

    if(Vehicle.rentStatus === "RENTED"){
        throw new ApiError(409,"Vehicle not available currently")
    }

    const rentVehicle = await rental.create({
        vehicleId,
        customerId,
        shopId:req.user._id,
        paymentType,
        paymentStatus
    })

    Vehicle.rentStatus = "RENTED"
    await Vehicle.save()

    return res.status(200).json(new ApiResponse(200,rentVehicle,"Vehicle Rented Successfully"))

})

const returnVehicle = asyncHandler(async (req, res) => {
    const { rentalId } = req.params;

    if (!rentalId) {
        throw new ApiError(400, "These are the required fields");
    }

    const activeRental = await rental.findById(rentalId);

    if (!activeRental) {
        throw new ApiError(404, "Rental doesn't exist");
    }

    if (activeRental.status !== "ACTIVE") {
        throw new ApiError(400, "There is no active rental");
    }

    const Vehicle = await vehicle.findById(activeRental.vehicleId);

    if (!Vehicle) {
        throw new ApiError(404, "Vehicle doesn't exist");
    }

    const endTime = new Date();
    activeRental.endTime = endTime;
    activeRental.status = "COMPLETED";

    if (endTime <= activeRental.startTime) {
        throw new ApiError(400, "Invalid return time");
    }

    const totalMin = Math.ceil(
        (endTime - activeRental.startTime) / (1000 * 60)
    );

    let totalCost;

    if (Vehicle.vehicleType === "BIKE") {
        totalCost = 1.5 * totalMin;
    } else if (Vehicle.vehicleType === "SCOOTY") {
        totalCost = 1 * totalMin;
    } else if (Vehicle.vehicleType === "CAR") {
        totalCost = 2 * totalMin;
    }

    activeRental.totalFare = totalCost;

    Vehicle.rentStatus = "NOT RENTED";

    await activeRental.save();
    await Vehicle.save();

    return res.status(200).json(
        new ApiResponse(200, activeRental, "Vehicle returned successfully")
    )
})

const getAllRental = asyncHandler(async(req,res)=>{
    const allRentals = await rental.find({shopId:req.user._id}).populate("vehicleId").populate("customerId")

    return res.status(200).json(new ApiResponse(200,allRentals,"All Rentals fetched Successfully"))
})

const getActiveRentals = asyncHandler(async(req,res)=>{
    const ActiveRental = await rental.find({
        shopId:req.user._id,
        status:"ACTIVE"
    }).populate("vehicleId").populate("customerId","name contactNo address")

    return res.status(200).json(new ApiResponse(200,ActiveRental,"Fetched All Active Rentals"))
})

const getRentalById = asyncHandler(async(req,res)=>{
    const {rentalId} = req.params
    if(!rentalId){
        throw new ApiError(400,"Rental id required")
    }

    const rentById = await rental.findOne({_id:rentalId,shopId:req.user._id}).populate("vehicleId").populate("customerId","name contactNo")

    if(!rentById){
        throw new ApiError(400,"Rental not found")
    }

    return res.status(200).json(new ApiResponse(200,rentById,"Fetched successfully through id"))
})

const makeStarredRental = asyncHandler(async(req,res)=>{
    const {rentalId} = req.params
    if(!rentalId){
        throw new ApiError(400,"Rental id is required")
    }

    const existingRental = await rental.findOne({shopId:req.user._id,_id:rentalId})

    if(!existingRental){
        throw new ApiError(404,"Rental not found")
    }

    existingRental.isImportant = true
    await existingRental.save()

    return res.status(200).json(new ApiResponse(200,existingRental,"Marked as important"))
})

const fetchAllStarredRental = asyncHandler(async(req,res)=>{
    const existingRental = await rental.find({shopId:req.user._id,isImportant:true})
    return res.status(200).json(new ApiResponse(200,existingRental,"Starred rentals fetched successfully"))
})

const makeRentalUnstarred = asyncHandler(async(req,res)=>{
    const {rentalId} = req.params
    if(!rentalId){
        throw new ApiError(400,"rental id is required")
    }

    const existingStarred = await rental.findOne({shopId:req.user._id,isImportant:true,_id:rentalId})
    if(!existingStarred){
        throw new ApiError(400,"rental not starred")
    }

    existingStarred.isImportant = false
    await existingStarred.save()

    return res.status(200).json(new ApiResponse(200,existingStarred,"Unstarred successfully"))
})

const countActiveRentals = asyncHandler(async(req,res)=>{
    const totalActive = await rental.countDocuments({shopId:req.user._id,status:"ACTIVE"})
    return res.status(200).json(new ApiResponse(200,totalActive,"All Active rentals counted"))
})

export {createRent,returnVehicle,getAllRental,getActiveRentals,getRentalById,makeStarredRental,fetchAllStarredRental,makeRentalUnstarred,countActiveRentals}