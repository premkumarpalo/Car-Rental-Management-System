import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import {owner} from "../models/owner.models.js"
import {uploadoncloudinary} from "../utils/cloudinary.js"

const generateAccessAndRefreshTokens = async(ownerId) => {
    try {
        const user = await owner.findById(ownerId)
        const accessToken = user.generateAccessTokens()
        const refreshToken = user.generateRefreshTokens()

        user.refreshToken = refreshToken

        user.save({ validateBeforeSave: false })

        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating and accessing tokens")
    }
}

const registerUser = asyncHandler(async(req,res)=>{
    const {email , password , ownerName , shopName , contactNo} = req.body

    if([password,ownerName,shopName,contactNo].some((field)=>field.trim() === "")){
        throw new ApiError(400,"These fields are required")
    }

    const existingUser = await owner.findOne({
        $or: [{ email }, { contactNo }]
    })

    if(existingUser){
        throw new ApiError(400,"user already exists , so kindly login")
    }

    const user = await owner.create({
        ownerName,
        password,
        email,
        shopName,
        contactNo,
    })

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    return res.status(200).json(new ApiResponse(200,{user,accessToken,refreshToken},"User registered successfully"))
})

const loginUser = asyncHandler(async(req,res)=>{
    const {ownerName , password} = req.body

    if([ownerName,password].some((field)=>
        field.trim() === ""
    )){
        throw new ApiError(400,"These are the required fields to login")
    }

    const existingUser = await owner.findOne({ownerName}).select("-refreshToken")

    if(!existingUser){
        throw new ApiError(400,"User doesnt exist")
    }

    const isPasswordValid = await existingUser.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(400,"User password invalid")
    }

    const {accessToken , refreshToken} = await generateAccessAndRefreshTokens(existingUser._id)

    const loggedinUser = await owner.findById(existingUser._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: false
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(
            200,
            {
                existingUser: loggedinUser, accessToken, refreshToken
            },
            "User loggedIn successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req,res)=>{
    await owner.findByIdAndUpdate(req.user._id,{$unset:{refreshToken:""}},{new:true})

    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{},"user logged out successfully"))

})

const updateProfile = asyncHandler(async(req,res)=>{
    const profileLocalPath = req.file?.path

    if(!profileLocalPath){
        throw new ApiError(401,"path doesnt exists")
    }

    const uploadedProfile = await uploadoncloudinary(profileLocalPath)

    if(!uploadedProfile.url){
        throw new ApiError(401,"Error while uploading")
    }

    const userProfile = await owner.findByIdAndUpdate(req.user._id,{$set:{profile:uploadedProfile.url}},{new:true}).select("-password -refreshToken")

    return res.status(200).json(new ApiResponse(200,userProfile,"Profile updated successfully"))

})

const updateAccountDetails = asyncHandler(async(req,res)=>{
const {ownerName , email , shopName} = req.body
const updateDetails = {}

// this means if owner wants to edit only email then it will update only the email field

if(ownerName) updateDetails.ownerName = ownerName
if(email) updateDetails.email = email
if(shopName) updateDetails.shopName = shopName

const editedDetails = await owner.findByIdAndUpdate(req.user._id,{$set:updateDetails},{new:true}).select("-refreshToken")

return res.status(200).json(new ApiResponse(200,editedDetails,"Account updated successfully"))
})

const updatePassword = asyncHandler(async(req,res)=>{
    const { oldPassword,newPassword } = req.body

    const user = await owner.findById(req.user._id)

    if(!user){
        throw new ApiError(402,"User doesnt exists")
    }
    if(!oldPassword || !newPassword){
        throw new ApiError(400,"Old password or new Password is missing")
    }
    const isCorrect = await user.isPasswordValid(oldPassword)
    if(!isCorrect){
        throw new ApiError(402,"Old Password is incorrect")
    }
    user.password = newPassword
    user.refreshToken = undefined // this forces to re login once again
    await user.save()
    return res.status(200).json(new ApiResponse(200,{},"Password changed successfully"))
})

const fetchProfile = asyncHandler(async(req,res)=>{
    const userExists = await owner.findById(req.user._id).select("ownerName shopName email")  // this select will used to send only ownername shopname and email as response not the whole data
    if(!userExists){
        throw new ApiError(401,"User doesnt exists")
    }

    res.status(200).json(new ApiResponse(200,userExists,"user fetched successfully"))
})

export {generateAccessAndRefreshTokens,registerUser,loginUser,logoutUser,updateProfile,updateAccountDetails,updatePassword,fetchProfile}