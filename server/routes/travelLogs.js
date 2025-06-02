import express from 'express';
import TravelLogsController from '../controllers/TravelLogsController.js';

const router = express.Router();
// const baseUrl = import.meta.env.VITE_API_BASE_URL; 
// console.log(`Base URL: ${baseUrl}`);
router.get(`/getCategory`, TravelLogsController.getCategory);
router.get(`/travel-logs`, TravelLogsController.getAllTravelLogs);
router.post('/travel-logs', TravelLogsController.addTravelLog);

router.put('/travel-logs/:id', TravelLogsController.editTravelLog);
router.delete('/travel-logs/:id', TravelLogsController.delTravelLog);



export default router;