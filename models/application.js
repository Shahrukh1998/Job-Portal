import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    job_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job',
        required: true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    contact:{
        type: String,
        required: true
    },
    resumePath:{
        type: String,
        required: true
    },
    applied_at:{
        type: Date,
        default: Date.now
    },
    status:{
        type: String,
        enum: ['pending', 'reviewed', 'accepted', 'rejected'],
        default: 'pending'
    }
});
export default mongoose.model('Application', applicationSchema);