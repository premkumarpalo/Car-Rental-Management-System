import mongoose from "mongoose"
import { DB_NAME } from "../../constants.js"
export const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`MONGODB CONNECTED SUCCESSFULLY !! HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error("Error in connecting database : ",error)
    }
}