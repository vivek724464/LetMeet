import express from 'express';
import { 
  getSchedules, 
  createSchedule, 
  updateSchedule,
  addOverride,
  deleteOverride 
} from '../controllers/scheduleController.js';

const router = express.Router();

router.get('/', getSchedules);
router.post('/', createSchedule);
router.put('/:id', updateSchedule);
router.post('/:scheduleId/overrides', addOverride);
router.delete('/:scheduleId/overrides/:overrideId', deleteOverride);

export default router;