import { connect } from "@/config/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import admin from "@/models/AdminModal";


connect();

export async function POST(request: NextRequest) {
    try {
        const {email,password} = await request.json();
        if(!email||!password){
            return NextResponse.json(
                {error:"Incomplete Fields!"},
                {status:404}
            )
        }

        const useravailable = await admin.findOne({email});
        if(!useravailable){
            return NextResponse.json(
                {error:"Account already exits!"},
                {status:401}
            )
        }

        const passwordCheck = await bcrypt.compare(password,useravailable.password);
        if(!passwordCheck){
            return NextResponse.json(
                {error:"Invalid Credentials"},
                {status:401}
            )
        }

        const payloadData = {
            email,
            uid:useravailable._id
        }

        const token = jwt.sign(payloadData,process.env.SECRET_KEY!,{
            expiresIn:'1d'
        });

        const response = NextResponse.json(
            {success:true},
            {status:200}
        )

        response.cookies.set("admintoken",token);
        return response;
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server error" + error },
            { status: 500 }
        )
    }
}