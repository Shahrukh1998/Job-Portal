import Application from '../models/application.js';
import Job from '../models/job.js';
import multer from 'multer';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stoarge = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb){
        cb(null, Date.now()+ '-' + file.originalname)
    }
});

const upload = multer({
    storage: stoarge,
    fileFilter: function(req,file,cb){
        if(file.mimetype === 'application/pdf'){
            cb(null, true);
        }else{
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
    
});

export const uploadResume = upload.single('resume');

export const applyForJob = async (req, res) => {
  try {
    const { name, email, contact } = req.body;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).render('404');
    }

    const existingApplication = await Application.findOne({
      job_id: jobId,
      email: email
    });

    if (existingApplication) {
      return res.status(400).render('error', {
        message: 'You have already applied for this job'
      });
    }

    const application = await Application.create({
      job_id: jobId,
      name,
      email,
      contact,
      resumePath: req.file.filename
    });

    await Job.findByIdAndUpdate(jobId, {
      $push: { applicants: application._id }
    });

    res.redirect(`/job/${jobId}?application=success`);
  } catch (error) {
    res.status(500).render('error', {
      message: 'Error submitting application'
    });
  }
};