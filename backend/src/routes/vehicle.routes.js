import Router from "express"
import {upload} from "../middleware/multer.middleware.js"
import {verifyJWT} from "../middleware/auth.middleware.js"
import { addVehicle, availableVehicles, getAllVehicles, getVehicleById, removeVehicle, searchVehicle, totalVehicles, updateVehicleDetails } from "../controllers/vehicle.controllers.js"
const router = Router()
router.route("/add-Vehicle").post(verifyJWT,upload.single("vehiclePhoto"),addVehicle)
router.route("/update-Vehicle-Details/:vehicleId").patch(verifyJWT,upload.single("vehiclePhoto"),updateVehicleDetails)
router.route("/list-Vehicles").get(verifyJWT,getAllVehicles)
router.route("/remove-Vehicles/:vehicleId").patch(verifyJWT,removeVehicle)
router.route("/getVehicle/:vehicleId").get(verifyJWT,getVehicleById)
router.route("/search").get(verifyJWT,searchVehicle)
router.route("/totalVehicles").get(verifyJWT,totalVehicles)
router.route("/totalAvailableVehicles").get(verifyJWT,availableVehicles)
export default router