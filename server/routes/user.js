const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const adminController = require("../controllers/adminController")

//home
router.get("/", userController.landingPg)

//Login
router.get("/login", userController.home)
router.post("/login",userController.login)

//dashboard
router.get("/dashboard", userController.dashboard)

//Render and add a base
router.get("/view-Base",adminController.viewBase)


//Add user form
router.get("/addUser",adminController.addUser)
router.post("/addUser",adminController.saveUser)

//view user
router.get("/view-user", adminController.viewusers)

//Add course
router.get("/addCourse", adminController.viewCourse)
router.post("/addCourse",adminController.addCourse)

//Tracking Info
router.get("/trackingInfo", adminController.trackingInfo)
router.post("/trackingInfo", adminController.saveTrackingInfo)


module.exports = router;