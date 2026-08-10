const mongoose=require("mongoose")
const planModel=mongoose.Schema({
    planName:{
        type:String
    },
    photos: {
        type: [String],
        default: [] 
    }
   
    
},
{
    timeStamp:true,
})
const plan=mongoose.model('plandata',planModel)
module.exports=plan