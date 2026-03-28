import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const ownerSchema = new mongoose.Schema({
  ownerName:{
    type:String,
    required:true,
    trim:true
  },
  profile:{
    type:String
  },
  shopName:{
    type:String,
    required:true,
    trim:true
  },
  email:{
    type:String,
    trim:true
  },
  contactNo:{
    type:Number,
    required:true
  },
  address:{
    type:String,
  },
  password:{
    type:String,
    required:[true,"password is required"]
  },
  refreshToken:{
    type:String
  }
},{timestamps:true})

ownerSchema.methods.generateAccessTokens = function(){
  return jwt.sign(
    {
      _id:this._id,
      name:this.ownerName,
      email:this.email
    },
      process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

ownerSchema.methods.generateRefreshTokens = function(){
  return jwt.sign(
    {
      _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

ownerSchema.pre("save",async function(){
  if(!this.isModified("password")){
    // console.log("Password is not modified")
    return;
  }
  this.password = await bcrypt.hash(this.password,10)
})

ownerSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password,this.password)
}

export const owner = mongoose.model("owner",ownerSchema)