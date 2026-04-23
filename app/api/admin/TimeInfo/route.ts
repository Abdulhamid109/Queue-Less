import { connect } from "@/config/dbconfig";
import BusinessTime from "@/models/TimeModal";
import { NextRequest, NextResponse } from "next/server";


connect();


export async function POST(request:NextRequest){
    try {
        const {bid,BusinessStartTime,BusinessEndTime,CustomerLimitPerDay,AdditionalInformation} = await request.json();

        if(!BusinessStartTime || !BusinessEndTime ||!CustomerLimitPerDay){
            return NextResponse.json(
                {error:"Empty Fields"},
                {status:404}
            )
        }

        const newTimeInfo = new BusinessTime({
            BusinessID:bid,
            BST:BusinessStartTime,
            BET:BusinessEndTime,
            CustomerLimitPerDay,
            AdditionalInformation
        });

        const savedTimeInfo = await newTimeInfo.save();
        console.log("TT => "+savedTimeInfo);

        return NextResponse.json(
            {success:true},
            {status:200}
        )
    } catch (error) {
        console.log("Error=>"+error);
        return NextResponse.json(
            {error:"Internal Server error"+error},
            {status:500}
        )
    }
}