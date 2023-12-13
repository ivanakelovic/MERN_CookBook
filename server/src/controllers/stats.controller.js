const statsService=require("../services/stats.service");
const catchAsync=require("../utils/catchAsync");

const getStats=catchAsync(async(req,res)=>{
    const stats=await statsService.getStats();

    res.send(stats);
});

module.exports={
    getStats
}