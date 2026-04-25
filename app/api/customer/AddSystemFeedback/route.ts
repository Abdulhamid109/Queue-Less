import { connect } from "@/config/dbconfig";
import SfeedBack from "@/models/SystemFeedBack";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function POST(request:NextRequest){
    try {
        const {title,description} = await request.json();

        if(!title || !description){
            return NextResponse.json(
                {error:"Empty Values"},
                {status:404}
            )
        }

        const newSystemFeedBack = new SfeedBack({
            Title:title,
            Description:description
        });

        const savedSystemFeedback = await newSystemFeedBack.save();

        console.log("System-Feedback => "+savedSystemFeedback);
        return NextResponse.json(
            {success:true},
            {status:200}
        )
    } catch (error) {
        console.log("Error => "+error);
        return NextResponse.json(
            {error:"Internal Server error"+error},
            {status:500}
        )
    }
}