import express from 'express';
import { getSchedules, createSchedule, updateSchedule } from '../controllers/scheduleController.js';

const router = express.Router();

router.get('/', getSchedules);
router.post('/', createSchedule);
router.put('/:id', updateSchedule);

export default router;