const mongoose=require("mongoose")
const bycript=require("bcryptjs")
const UserModel=mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    userName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
},
{
    timeStamp:true,
})
UserModel.methods.matchPassword=async function(enteredpassword)
{
    return await bycript.compare(enteredpassword,this.password)
}
UserModel.pre("save", async function(next)
{
if(!this.isModified)
{
    next()
}
const salt=await bycript.genSalt(10)
this.password=await bycript.hash(this.password,salt)
})
const User = mongoose.model('User', UserModel);
module.exports = User;