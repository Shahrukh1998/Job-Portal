import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    job_category:{
        type: String,
        required: true,
        enum: ['Tech', 'Non-Tech']
    },
    job_designation:{
        type: String,
        required: true
    },
    job_location:{
        type: String,
        required: true
    },
    company_name:{
        type: String,
        required: true
    },
    company_founded:{
        type: String,
        required: true
    },
    employees:{
        type:String,
        required: true
    },
    salary:{
        type: String,
        required: true
    },
    number_of_openings: {
    type: Number,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  skills_required: [{
    type: String
  }],
  logo: {
    type: String,
    required: true
  },
  apply_by: {
    type: Date,
    required: true
  },
  posted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  job_posted: {
    type: Date,
    default: Date.now
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }]

});
export default mongoose.model('model', jobSchema);