import mongoose from "mongoose"
const vehicleSchema = new mongoose.Schema({
  shopId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"owner"
  },
  vehiclePhoto:{
    type:String,
    required:true
  },
  vehicleType:{
    type:String,
    required:true,
    enum:["BIKE","SCOOTY","CAR"]
  },
  vehicleModelName:{
    type:String,
    required:true
  },
  vehicleColour:{
    type:String,
    required:true
  },
  fuelType:{
    type:String,
    required:true,
    enum:["PETROL","DIESEL","ELECTRIC"]
  },
  rentStatus:{
    type:String,
    required:true,
    enum:["RENTED","NOT RENTED"],
    default:"NOT RENTED"
  },
  vehicleNumber:{
    type:String,
    required:true
  },
  pricePerHour:{
    type:String,
  },
  pricePerDay:{
    type:String,
  }
},{timestamps:true})
export const vehicle = mongoose.model("vehicle",vehicleSchema)