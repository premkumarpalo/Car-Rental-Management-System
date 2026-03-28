import ApiError from "../utils/ApiError.js"
import asyncHandler from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import { owner } from "../models/owner.models.js"

export const verifyJWT = asyncHandler(async (req, _ ,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "unAuthorized Access")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await owner.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid Access token")
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(402,error?.message || "Invalid access token")
    }
})