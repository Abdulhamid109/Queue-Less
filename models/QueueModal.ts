import mongoose from "mongoose";

const QueueModal = new mongoose.Schema({
    businessId:{
        type:String
    },
    date:{
        type:String
    },
    UserId:{
        type:String
    },
    ServiceId:{
        type:[String]
    },
    //for setting the positioin based on the time
    Addedat:{
        type:Date,
        default:new Date
    },
    //neeed to update based on the logic
    status:{
        type:String
    },
    JoinedQueue:{
        type:Boolean,
        default:false
    }
});

const queue = mongoose.models.queue || mongoose.model('queue',QueueModal);
export default queue;