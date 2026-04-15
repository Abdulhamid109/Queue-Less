import { connect } from "@/config/dbconfig";
import service from "@/models/serviceModal";
import { NextRequest, NextResponse } from "next/server";



connect();

export async function GET(request:NextRequest){
    try {
        const {searchParams} = new URL(request.url);
        const bid = searchParams.get("bid");
        if(!bid){
            return NextResponse.json(
                {error:"Corrupted Service"},
                {status:401}
            )
        }

        const ServiceDetails = await service.find({businessId:bid});
        console.log("Service Details => "+ServiceDetails);

        return NextResponse.json(
            {success:true,service:ServiceDetails},
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