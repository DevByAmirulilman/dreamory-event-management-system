import express from 'express'
import { createEvent, deleteEvent, getAllEvents, getThumbnail, updateEvent } from '../controllers/event.js'
import ExpressFormidable from 'express-formidable'
import { requireSignIn } from '../middleware/auth.js'

const router = express.Router()

router.post('/event',requireSignIn,ExpressFormidable(),createEvent)
router.post('/event/update/:eventId',requireSignIn,ExpressFormidable(),updateEvent)
router.get('/events',getAllEvents)
router.get('/event/thumbnail/:eventId', getThumbnail);
router.delete('/event/:eventId',requireSignIn,deleteEvent)

export default router
