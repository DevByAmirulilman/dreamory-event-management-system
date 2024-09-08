import Event from "../models/event.js"
import fs from 'fs'

export const createEvent = async(req,res)=>{
    try{
        //
        const {name,location,startdate,enddate,createdby} = req.fields
        const {thumbnail} = req.files

        if(!name){
            return res.json({error:"Name is required"})
        }
        if(!location){
            return res.json({error:"Name is required"})
        }
        if(!startdate){
            return res.json({error:"Name is required"})
        }
        if(!enddate){
            return res.json({error:"Name is required"})
        }

        if(thumbnail && thumbnail > 1000000){
            return res.json({error:"thumnail size is too Big"})
        }

        const event = new Event({
            name:name,
            location:location,
            startdate:startdate,
            enddate:enddate,
            createdby:createdby
        })

        if(thumbnail){
            event.thumbnail.data = fs.readFileSync(thumbnail.path)
            event.thumbnail.contentType = thumbnail.type
        }

        await event.save()

        res.json(event)
    } catch(err){
        //
        console.log(err)
    }
}

export const getAllEvents = async(req,res) => {
    try{
        //
        const event = await Event.find({})
            .select('-thumbnail')
            .populate('createdby')
            .limit(12)
            .sort({createdAt:-1})
        
        res.json(event)
    } catch(err){
        console.log(err)
    }
}

export const getThumbnail = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId).select('thumbnail');
        
        if (event && event.thumbnail && event.thumbnail.data) {
            res.set('Content-Type', event.thumbnail.contentType);
            return res.send(event.thumbnail.data);
        }

        // If no thumbnail or event found, return 404
        return res.json({ message: 'Thumbnail not found' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to retrieve thumbnail' });
    }
};

export const updateEvent = async (req,res) => {
    try{
        //
        const {thumbnail} = req.files

        if(thumbnail && thumbnail > 1000000){
            return res.json({error:"thumnail size is too Big"})
        }

        const event = await Event.findByIdAndUpdate(req.params.eventId,{
            ...req.fields
        },{new:true})

        if(thumbnail){
            event.thumbnail.data = fs.readFileSync(thumbnail.path)
            event.thumbnail.contentType = thumbnail.type
        }

        await event.save()
        res.json(event)

    } catch(err){
        console.log(err)
    }
}

export const deleteEvent = async (req,res) => {
    try{
        //
        const event = await Event.findByIdAndDelete(req.params.eventId).select('-thumbnail')
        res.json(event)
    } catch(err){
        console.log(err)
    }
}