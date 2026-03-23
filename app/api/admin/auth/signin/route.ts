import { connect } from "@/config/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import admin from "@/models/AdminModal";


connect();

export async function POST(request:NextRequest){
    try {
        const {name,email,password} = await request.json();
        if(!name||!email||!password){
            return NextResponse.json(
                {error:"Incomplete fields"},
                {status:404}
            )
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newCustomer = new admin({
            name,
            email,
            password:hashedPassword
        });

        const savedCustomer = await newCustomer.save();
        console.log("Customer-Debug(signup Route)=>"+savedCustomer);
        return NextResponse.json(
            {success:true},
            {status:200}
        )

    } catch (error) {
        return NextResponse.json(
            {error:"Internal Server error"+error},
            {status:500}
        )
    }
}