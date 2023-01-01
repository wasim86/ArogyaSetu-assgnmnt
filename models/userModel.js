const mongoose= require("mongoose")

const userSchema= new mongoose.Schema({
    Name:{type:String,required:true},
    PhoneNumber:{type:String,required:true},
    Age:{type:Number,required:true},
    Pincode:{type:String,required:true},
    AadharNo:{type:String,required:true},
    Password:{type:String,required:true},
    VaccinationStatus:{type:String,default:"None",enum:["firstDose","secondDose","None"]},
    SlotBoookedAt:{type:String, default:null}

},{timestamps:true})

module.exports= mongoose.model("NewUser",userSchema)