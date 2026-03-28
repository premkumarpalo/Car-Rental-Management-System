import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import {uploadoncloudinary} from "../utils/cloudinary.js"
import { customer } from "../models/customerDetails.models.js"

const addCustomer = asyncHandler(async(req,res)=>{
    const {name,age,address,contactNo} = req.body
    if(!name || !age || !contactNo){
        throw new ApiError(400,"These are the required fields")
    }
    // in order to check existingNumber we need to find the contact no not use .exists()

    const existingNo = await customer.findOne({shopId:req.user._id,contactNo})
    if(existingNo){
        throw new ApiError(409,"User already exists")
    }

    const dlLocalPath = req.files?.drivingLicense[0]?.path
    const uploadDrivingLicense = await uploadoncloudinary(dlLocalPath)

    if(!uploadDrivingLicense.url){
        throw new ApiError(400,"Something went wrong while uploading")
    }

    const signLocalPath = req.files?.customerSign[0]?.path
    const uploadCustomerSign = await uploadoncloudinary(signLocalPath)

    if(!uploadCustomerSign.url){
        throw new ApiError(400,"Something went wrong while uploading")
    }

    const customerDetail = await customer.create({
        name,
        age,
        drivingLicense:uploadDrivingLicense.url,
        shopId:req.user._id,
        contactNo,
        address,
        customerSign:uploadCustomerSign.url
    })

    return res.status(200).json(new ApiResponse(200,customerDetail,"Customer Successfully added"))
})

const editCustomerDetails = asyncHandler(async(req,res)=>{
    const {name , age , contactNo , address} = req.body
    const {customerId} = req.params
    if(!customerId){
        throw new ApiError(400,"Customer Id is required")
    }

    const update = {}
    if(name !== undefined) update.name = name
    if(age !== undefined) update.age = age
    if(contactNo !== undefined) update.contactNo = contactNo
    if(address !== undefined) update.address = address

    const updatedCustomer = await customer.findOneAndUpdate({shopId:req.user._id,_id:customerId},{$set:update},{new:true})

    if(!updatedCustomer){
        throw new ApiError(404,"Customer not found or unauthorized")
    }

    return res.status(200).json(new ApiResponse(200,updatedCustomer,"Customer details updated"))
})

const getAllCustomers = asyncHandler(async(req,res)=>{
    const fetchAll = await customer.find({shopId:req.user._id})
    return res.status(200).json(new ApiResponse(200,fetchAll,"Customers fetched successfully"))
})

const searchCustomer = asyncHandler(async(req,res)=>{
    const {name,contactNo} = req.body
    const details = {shopId:req.user._id}
    if(name) details.name = name
    if(contactNo) details.contactNo = contactNo

    const findCustomer = await customer.find(details)
    if(findCustomer.length === 0){
        throw new ApiError(404,"Customer not found")
    }

    return res.status(200).json(new ApiResponse(200,findCustomer,"Customer fetched successfully"))
})

export {addCustomer,editCustomerDetails,getAllCustomers,searchCustomer}