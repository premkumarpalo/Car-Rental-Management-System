import mongoose from "mongoose"
const customerSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    lowercase:true,
    trim:true
  },
  age:{
    type:Number,
    required:true
  },
  shopId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"owner"
  },
  drivingLicense:{
    type:String,
    required:true
  },
  address:{
    type:String,
  },
  contactNo:{
    type:String,
    required:true
  },
  customerSign:{
    type:String,
    required:true
  }
},{timestamps:true})
export const customer = mongoose.model("customer",customerSchema)