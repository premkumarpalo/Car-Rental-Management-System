import Router from "express"
import {verifyJWT} from "../middleware/auth.middleware.js"
import {upload} from "../middleware/multer.middleware.js"
import { addCustomer, editCustomerDetails, getAllCustomers, searchCustomer } from "../controllers/customer.controller.js"
const router = Router()
router.route("/add-Customer").post(verifyJWT,upload.fields([{name:"drivingLicense",maxCount:1},{name:"customerSign",maxCount:1}]),addCustomer)
router.route("/edit-info/:customerId").patch(verifyJWT,editCustomerDetails)
router.route("/get-All-Customers").get(verifyJWT,getAllCustomers)
router.route("/search").get(verifyJWT,searchCustomer)
export default router