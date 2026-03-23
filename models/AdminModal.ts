import mongoose from "mongoose";


const AdminModal = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    emailVerificationId:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    AssociatedBusiness:{
        type:String,
        ref:'business'
    }
});

const admin = mongoose.models.admin || mongoose.model('admin',AdminModal);
export default admin;