const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const adminController = require("../controllers/adminController")

//home
router.get("/", userController.landingPg)

//Login
router.get("/login", userController.home)
router.post("/login",userController.login)

//Logout
router.get("/logout",userController.logout)
//dashboard
router.get("/dashboard",userController.dashboard)




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

//delete
router.get("/:service_num", adminController.delete);

//edit
router.get('/editInfo/:service_num', adminController.edit);
router.post('/editInfo/:service_num', adminController.save);


module.exports = router;