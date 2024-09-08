import mongoose from "mongoose";

const {Schema} = mongoose

const userSchema = Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minimum:6,
        max:60
    },
    role:{
        type:Number,
        default:0
    }
},{
    timestamps:true
})

export default mongoose.model("User",userSchema)