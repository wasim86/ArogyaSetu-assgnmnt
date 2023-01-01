const express= require("express")
const router= express.Router()
const UserController= require("../controllers/userController")
const AdminController= require("../controllers/adminController")


router.post("/User",UserController.createUser)
router.post("/Login",UserController.userLogin)
router.post("/Vaccine",AdminController.createVaccine)
router.get("/VaccineData",UserController.getVaccineData)
router.put("/VaccineData",UserController.bookSlot)

// -------------for admin-----------------//
router.get("/UserData",AdminController.getUserData)
router.get("/vaccineDetails",AdminController.vaccineDetails)

module.exports=router