const express=require("express");
const validate=require("../../middlewares/validate");
const statsController=require('../../controllers/stats.controller');

const router=express.Router();

router
.route("/")
.get(statsController.getStats);

module.exports=router;