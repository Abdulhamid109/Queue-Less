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
    CustomerCurrentLocation:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    CustomerAddress:{
        type:String
    },

});

const customer = mongoose.models.customer || mongoose.model('customer',CustomerModal);
export default customer;