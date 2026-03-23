import mongoose from "mongoose";


const ServiceModal = new mongoose.Schema({
    businessId:{
        type:String
    },
    name:{
        type:String
    },
    AvgDurationPerCustomer:{
        type:String
    },
    AvgCustomerPerDay:{
        type:String
    },
    CustomerLimitPerDay:{
        type:String
    }
});

const service = mongoose.models.service || mongoose.model('service',ServiceModal);
export default service;