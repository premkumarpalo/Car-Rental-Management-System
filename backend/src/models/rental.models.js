import mongoose from "mongoose"
const rentalSchema = new mongoose.Schema({
  customerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"customer",
    required:true
  },
  vehicleId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"vehicle",
    required:true
  },
  shopId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"owner",
    required:true
  },
  status: {
   type: String,
   enum: ["ACTIVE", "COMPLETED", "CANCELLED"],
   default: "ACTIVE"
  },
  totalFare:{
    type:String,
    // required:true
  },
  paymentType:{
    type:String,
    required:true
  },
  paymentStatus:{
    type:String,
    required:true,
    enum:["PAID","UNPAID"],
    default:"UNPAID"
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime:{
    type:Date,
  },
  isImportant:{
    type: Boolean,
    dafault:false
  }
},{timestamps:true})
export const rental = mongoose.model("rental",rentalSchema)