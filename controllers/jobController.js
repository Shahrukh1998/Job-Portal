import Job from '../models/job.js';
import Application from '../models/application.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
});

export const uploadLogo = upload.single('logo');

export const createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      skills_required: Array.isArray(req.body.skills_required) 
        ? req.body.skills_required 
        : [req.body.skills_required],
      posted_by: req.user.id,
      logo: req.file ? req.file.filename : 'default-logo.png'
    };

    await Job.create(jobData);
    res.redirect('/jobs');
  } catch (error) {
    res.status(500).render('error', { 
      message: 'Error creating job posting' 
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('posted_by', 'name');
    res.render('jobs', { jobs, user: req.user });
  } catch (error) {
    res.status(500).render('error', { 
      message: 'Error fetching jobs' 
    });
  }
};

export const getJobs = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('applicants');
    if (!job) {
      return res.status(404).render('404');
    }
    res.render('job-detail', { data: job, user: req.user });
  } catch (error) {
    res.status(500).render('error', { 
      message: 'Error fetching job details' 
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).render('404');
    }

    if (job.posted_by.toString() !== req.user.id) {
      return res.status(403).render('error', { 
        message: 'Not authorized to update this job' 
      });
    }

    const updateData = {
      ...req.body,
      skills_required: Array.isArray(req.body.skills_required) 
        ? req.body.skills_required 
        : [req.body.skills_required]
    };

    await Job.findByIdAndUpdate(req.params.id, updateData);
    res.redirect(`/job/${req.params.id}`);
  } catch (error) {
    res.status(500).render('error', { 
      message: 'Error updating job' 
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).render('404');
    }

    if (job.posted_by.toString() !== req.user.id) {
      return res.status(403).render('error', { 
        message: 'Not authorized to delete this job' 
      });
    }

    await Job.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ job_id: req.params.id });
    
    res.redirect('/jobs');
  } catch (error) {
    res.status(500).render('error', { 
      message: 'Error deleting job' 
    });
  }
};

export const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    const applicants = await Application.find({ job_id: req.params.id });
    
    if (!job) {
      return res.status(404).render('404');
    }

    if (job.posted_by.toString() !== req.user.id) {
      return res.status(403).render('error', { 
        message: 'Not authorized to view applicants' 
      });
    }

    res.render('applicants', { allApplicants: applicants, user: req.user });
  } catch (error) {
    res.status(500).render('error', { 
      message: 'Error fetching applicants' 
    });
  }
};