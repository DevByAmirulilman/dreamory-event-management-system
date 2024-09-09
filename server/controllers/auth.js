import User from "../models/user.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { comparePassword, hashPassword } from "../helpers/auth.js";

dotenv.config()

export const registerUser = async(req,res) => {
    try {
        //deconstruct
        const {name, email, password} = req.body

        //validation
        if(!name.trim()){
            return res.json({error:"Name is required"})
        }
        if(!email.trim()){
            return res.json({error:"Email is required"})
        }
        if(!password.trim()){
            return res.json({error:"Name is required"})
        }
        
        const existingEmail = await User.findOne({email})
        if(existingEmail){
            return res.json({error:"Email Already exist"})
        }

        //hash the passord
        const hashedPassword = await hashPassword(password)

        //save user to DB
        const user = await new User({name,email,password:hashedPassword}).save()
        
        //create Signed JWT
        const token = jwt.sign({_id:user._id},process.env.JWT,{expiresIn:'7d'})

        res.json({
            user:{
                name:user.name,
                email:user.email,
                password:user.password,
                userId:user._id
            },
            token
        })
    } catch(err){
        console.log(err)
        res.json(err)
    }
}

export const loginUser = async(req,res) => {
    try{
        //
        const { email, password } = req.body

        if(!email){
            return res.json({error:"Email is required"})
        }
        if(!password){
            return res.json({error:"Password is required"})
        }
    
        const user = await User.findOne({email})
        if(!user){
            return res.json({error:"User does not exist"})
        }
        
        const match = await comparePassword(password,user.password)
        if(!match){
            return res.json({error:"Wrong Password"})
        }
    
        const token = jwt.sign({_id:user._id},process.env.JWT,{expiresIn:'7d'})
console.log(req.body)
        res.json({
            user:{
                name:user.name,
                email:user.email,
                role:user.role,
                userId:user._id
            },
            token
        })
    } catch(err){
        console.log(err)
    }
}