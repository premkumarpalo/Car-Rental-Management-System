import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import {uploadoncloudinary} from "../utils/cloudinary.js"
import { vehicle } from "../models/vehicle.models.js"

const addVehicle = asyncHandler(async(req,res)=>{
    const {vehicleType , vehicleModelName , vehicleColour , fuelType , vehicleNumber} = req.body
    if([vehicleType , vehicleModelName , vehicleColour , fuelType , vehicleNumber].some((field)=>field.trim() === "")){
        throw new ApiError(400,"These fields are required")
    }

    const vehiclePhotoLocalPath = req.file?.path
    if(!vehiclePhotoLocalPath){
        throw new ApiError(400,"Vehicle photo locally couldn't found")
    }

    const uploadVehiclePhoto = await uploadoncloudinary(vehiclePhotoLocalPath)

    if(!uploadVehiclePhoto.url){
        throw new ApiError(400,"upload failed")
    }

    const createAddVehicle = await vehicle.create({
        vehiclePhoto:uploadVehiclePhoto.url,
        shopId:req.user._id,
        vehicleType,
        vehicleColour,
        vehicleModelName,
        vehicleNumber,
        fuelType
    })

    return res.status(200).json(new ApiResponse(200,createAddVehicle,"Vehicle added successfully"))
})

const updateVehicleDetails = asyncHandler(async(req,res)=>{
    const { vehicleId } = req.params

    const { vehicleType, vehicleModelName, vehicleColour , fuelType, vehicleNumber } = req.body

    const existingVehicle = await vehicle.findById(vehicleId)

    if (!existingVehicle) {
        throw new ApiError(404, "Vehicle not found")
    }

    if (existingVehicle.rentStatus === "RENTED") {
        throw new ApiError(400, "Cannot update rented vehicle")
    }

    if(vehicleType) existingVehicle.vehicleType = vehicleType.toUpperCase()
    if(vehicleModelName) existingVehicle.vehicleModelName = vehicleModelName
    if(vehicleColour) existingVehicle.vehicleColour = vehicleColour
    if(fuelType) existingVehicle.fuelType = fuelType.toUpperCase()
    if(vehicleNumber) existingVehicle.vehicleNumber= vehicleNumber

    // Optional photo update
    if (req.file?.path) {
        const uploadVehiclePhoto = await uploadoncloudinary(req.file.path)

        if (!uploadVehiclePhoto?.url) {
            throw new ApiError(400, "Upload failed")
        }

        existingVehicle.vehiclePhoto = uploadVehiclePhoto.url
    }

    await existingVehicle.save()

    return res.status(200).json(new ApiResponse(200,existingVehicle,"Vehicle Details updated"))
})

const getAllVehicles = asyncHandler(async(req,res)=>{
    const getAll = await vehicle.find({shopId:req.user._id})
    return res.status(200).json(new ApiResponse(200,getAll,"All Vehicles fetched successfully"))
})

const removeVehicle = asyncHandler(async(req,res)=>{
    const {vehicleId} = req.params
    const existingVehicle = await vehicle.findById(vehicleId)

    if(!existingVehicle){
        throw new ApiError(404,"Vehicle doesnt exists")
    }

    if(existingVehicle.rentStatus === "RENTED"){
        throw new ApiError(400,"Vehicle cant be deleted while it is on rent")
    }

    const remVehicle = await vehicle.findByIdAndDelete(vehicleId)

    return res.status(200).json(new ApiResponse(200,remVehicle,"Vehicle Removed"))

})

const getVehicleById = asyncHandler(async (req, res) => {
    const { vehicleId } = req.params
    const existingVehicle = await vehicle.findOne({_id: vehicleId,shopId: req.user._id})
    if (!existingVehicle) {
        throw new ApiError(404, "Vehicle not found or unauthorized")
    }
    return res.status(200).json(
        new ApiResponse(200, existingVehicle, "Vehicle fetched successfully")
    )
})

const searchVehicle = asyncHandler(async(req,res)=>{
    const {fuelType,vehicleType,rentStatus} = req.query

    const filter = {shopId:req.user._id}

    if(fuelType) filter.fuelType = fuelType.toUpperCase()
    if(vehicleType) filter.vehicleType = vehicleType.toUpperCase()
    if(rentStatus) filter.rentStatus = rentStatus.toUpperCase()

    const vehicles = await vehicle.find(filter)

    return res.status(200).json(new ApiResponse(200,vehicles,"Successfully fetched"))
})

const totalVehicles = asyncHandler(async(req,res)=>{
    const total = await vehicle.countDocuments({shopId:req.user._id})
    return res.status(200).json(new ApiResponse(200,total,"All Vehicles Counted"))
})

const availableVehicles = asyncHandler(async(req,res)=>{
    const available = await vehicle.countDocuments({shopId:req.user._id,rentStatus:"NOT RENTED"})
    return res.status(200).json(new ApiResponse(200,available,"Number of available vehicles fetched"))
})

export {addVehicle,updateVehicleDetails,getAllVehicles,removeVehicle,getVehicleById,searchVehicle,totalVehicles,availableVehicles}