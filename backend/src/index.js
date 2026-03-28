import dotenv from "dotenv"
import { connectDB } from "./databaseConnectivity/db_connection.js"
import {app} from "./App.js"

dotenv.config()

app.get("/",(req,res)=>{
    res.send("App is running successfully")
})
connectDB().then(()=>{
    app.listen(process.env.PORT || 3000 ,()=>{
        console.log(`Server is running at port http://localhost:${process.env.PORT}`)
    })
}).catch((err)=>{
    console.log("Something went wrong : ",err)
})