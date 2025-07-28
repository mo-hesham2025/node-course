const express = require('express');
const { createPost , getPost } = require('../controller/posts');
const auth = require('../middlewares/auth');

const router = express.Router();


router.post("/",auth,createPost)
router.get("/",getPost)


module.exports=router
