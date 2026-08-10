const mongoose=require("mongoose")
const dotenv=require("dotenv")
dotenv.config()

 const connectDatabase =()=>{
    mongoose.connect(process.env.Mongo_uri,{
        dbName:"vedicVisson"
    }).then(()=>{
        console.log("db connected")
    }).catch((err)=>{
        console.log(err)
    })
}
module.exports={connectDatabase}