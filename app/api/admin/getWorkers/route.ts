import { connect } from "@/config/dbconfig";
import { GETADMINTOKENDATA } from "@/helpers/getAdminTokenData";
import worker from "@/models/workermodal";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function GET(request:NextRequest){
    try {
        const adminId = await GETADMINTOKENDATA(request);
        if(!adminId){
            return NextResponse.json(
                {error:"Unauthorized Admin"},
                {status:401}
            )
        }
        const {searchParams} = new URL(request.url);
        const bid = searchParams.get("bid");
        if(!bid){
            return NextResponse.json(
                {error:"No Associated business found, start freshly"},
                {status:404}
            )
        }
        const allworkers = await worker.find({adminId,businessId:bid});
        return NextResponse.json(
            {success:true,workers:allworkers},
            {status:200}
        )
    } catch (error) {
        console.log("Error => "+error);
        return NextResponse.json(
            {error:"Internal Server error"+error},
            {status:500}
        );
    }
}