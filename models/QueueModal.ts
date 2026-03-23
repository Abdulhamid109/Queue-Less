import mongoose from "mongoose";

const QueueModal = new mongoose.Schema({
    businessId:{
        type:String
    },
    UserId:{
        type:String
    },
    ServiceId:{
        type:String
    },
    //neeed to update based on the logic
    status:{
        type:String
    }
});

const queue = mongoose.models.queue || mongoose.model('queue',QueueModal);
export default queue;