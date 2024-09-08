
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

export const requireSignIn = (req,res,next) =>{
    try{
        //
        const decoded = jwt.verify(
            req.headers.authorization,
            process.env.JWT
        )
        req.user = decoded
        console.log(decoded)
        next()
    } catch(err){
        return res.status(401).json(err)
    }
}

