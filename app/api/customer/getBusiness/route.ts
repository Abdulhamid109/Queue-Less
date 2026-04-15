// universal api for getting the business on basis of bid

import { connect } from "@/config/dbconfig";
import business from "@/models/BusinessModal";
import BusinessTime from "@/models/TimeModal";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function GET(request:NextRequest) {
    try {
        const {searchParams} = new URL(request.url);
        const bid = searchParams.get('id');
        if(!bid){
            return NextResponse.json(
                {error:"No ID Found!"},
                {status:401}
            )
        }
        const businessDetails = await business.findById(bid);
        const BusinessTimeDetails = await BusinessTime.findOne({BusinessID:bid});
        console.log("Business Data => "+businessDetails);
        return NextResponse.json(
            {success:true,business:businessDetails,time:BusinessTimeDetails},
            {status:200}
        )
    } catch (error) {
        console.log("Error=>"+error);
        return NextResponse.json(
            {error:"Internal Server error"},
            {status:500}
        )
    }
}