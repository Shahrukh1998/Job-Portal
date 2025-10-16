import express from 'express';

import{
    getAllJobs,
    getJobs
} from '../controllers/jobController.js';

const router = express.Router();

router.get('/', getAllJobs);
router.get('/',getJobs);


export default router;