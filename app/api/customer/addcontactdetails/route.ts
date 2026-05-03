import { connect } from "@/config/dbconfig";
import contact from "@/models/contactModal";
import { NextRequest, NextResponse } from "next/server";



connect();

export async function POST(request:NextRequest) {
    try {
        const {name,email,subject,message} = await request.json();

        if(!name||!email||!subject||!message){
            return NextResponse.json(
                {error:"values not found"},
                {status:200}
            )
        }

        const newContactDetails = new contact({
            name,
            email,
            subject,
            message
        });

        const savedContact = await newContactDetails.save();
        console.log("SavedContact => "+savedContact);

        return NextResponse.json(
            {success:200},
            {status:200}
        )
    } catch (error) {
        return NextResponse.json(
            {error:"Internal Server error"+error},
            {status:500}
        )
    }
}