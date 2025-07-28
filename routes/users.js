const userController= require("../controller/users");
const express = require('express');
const { validate } = require("../middlewares/validate");
const { createUserSchema, updateUserSchema, signupSchema, loginSchema } = require("../utils/validation/users");
const { upload,uploadFiles } = require("../middlewares/uploadeOnImgaekit");
const auth = require("../middlewares/auth");
const restrictTo = require("../middlewares/restrictTo");
// const { upload } = require("../middlewares/uploadeLocal");
const router = express.Router();


router.post("/signup",validate(signupSchema),userController.signup)
router.post("/login",validate(loginSchema),userController.login)


router.post("/",auth,restrictTo("admin","superAdmin"),upload.single('photo'),uploadFiles(false),validate(createUserSchema),userController.createUser)
router.get("/",userController.getAllUsers)

router.get("/email", userController.getUserByEmail)
router.get("/:id", userController.getUserById)

router.patch("/:id",validate(updateUserSchema),userController.updateUserPatch )
router.put("/:id",validate(createUserSchema),userController.updateUserPut)

router.delete("/:id",userController.deleteUser )

module.exports = router;
