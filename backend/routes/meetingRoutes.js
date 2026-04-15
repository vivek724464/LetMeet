import express from 'express';
import { getMeetings, createMeeting, cancelMeeting, rescheduleMeeting } from '../controllers/meetingController.js';

const router = express.Router();

router.get('/', getMeetings);
router.post('/', createMeeting);
router.put('/:id/cancel', cancelMeeting);
router.put('/:id/reschedule', rescheduleMeeting);

export default router;