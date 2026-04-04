import mongoose from "mongoose";


const CustomerModal = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    phone:{
        type:String,
    },
    location:{
        type:String
    },

});

const customer = mongoose.models.customer || mongoose.model('customer',CustomerModal);
export default customer;