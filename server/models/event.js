import mongoose from "mongoose";

const {Schema} = mongoose

const eventSchema = new Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    location:{
        type:String,
        trim:true,
        required:true
    },
    startdate:{
        type:Date,
        required:true
    },
    enddate:{
        type:Date,
        required:true
    },
    thumbnail:{
        data:Buffer,
        contentType:String
    },
    status:{
        type:String,
        default:"Ongoing"
    },
    createdby:{
        type:Schema.ObjectId,
        ref:"User",
        required:true
    }
})

export default mongoose.model("Event",eventSchema)