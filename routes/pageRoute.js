import express from 'express';
import{
    getHome,
    getJobs,
    getLogin
} from '../controllers/pageController.js';

const router = express.Router();

router.get('/', getHome);
router.get('/jobs', getJobs);
router.get('/login', getLogin);

export default router;