import Router from "express"
import {verifyJWT} from "../middleware/auth.middleware.js"
import { countActiveRentals, createRent, fetchAllStarredRental, getActiveRentals, getAllRental, getRentalById, makeRentalUnstarred, makeStarredRental, returnVehicle} from "../controllers/rental.controller.js"
const router = Router()
router.route("/createRent").post(verifyJWT,createRent)
router.route("/returnvehicle/:rentalId").post(verifyJWT,returnVehicle)
router.route("/getAllRentals").get(verifyJWT,getAllRental)
router.route("/activeRentals").get(verifyJWT,getActiveRentals)
router.route("/rentalById/:rentalId").get(verifyJWT,getRentalById)
router.route("/mark-as-important/:rentalId").patch(verifyJWT,makeStarredRental)
router.route("/starred-rentals").get(verifyJWT,fetchAllStarredRental)
router.route("/unstar-rental/:rentalId").patch(verifyJWT,makeRentalUnstarred)
router.route("/totalActiveRentals").get(verifyJWT,countActiveRentals)
export default router