import Job from '../models/job.js';


export const getHome = (req,res)=>{
    res.render('landing-page', {user: req.user});
};

export const getJobs = async(req, res)=>{
   try{
    const jobs = await Job.find({}).sort({createdAt: -1});
    res.render('list-all-jobs', {user: req.user, jobs: jobs});
   } catch(error){
    console.error('Error fecthing jobs:', error);
    res.status(500).render('list-all-jobs',{user: req.user, jobs: [], error: 'failed to load jobs'});
   }
};

export const getPostJob = (req,res)=>{
    if(!req.user){
        return res.redirect('/user-login');
    }
    res.render('new-job', {user: req.user})
};

export const getUpdateJob = async (req,res)=>{
    try{
        const job = await job.findById(req.params.id);
        if(!job){
            return res.status(404).render('404');
        }
        res.render('update-job', {job, user: req.user});
    } catch(error){
        res.status(500).render('error',{
            message: 'Error loading job for update'
        });
    }
};

export const getLogin = (req,res)=>{
    res.render('user-login', {user: req.user});
};