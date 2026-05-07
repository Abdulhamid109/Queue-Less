import { connect } from "@/config/dbconfig";
import { GETADMINTOKENDATA } from "@/helpers/getAdminTokenData";
import worker from "@/models/workermodal";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function POST(request:NextRequest){
    try {
        const {workerName,WorkerEmail} = await request.json();
        const {searchParams} = new URL(request.url);
        const bid = searchParams.get("bid");
        const adminId = await GETADMINTOKENDATA(request);

        if(!adminId){
            return NextResponse.json(
                {error:"Unauthorized Admin"},
                {status:401}
            )
        }
        if(!workerName || !WorkerEmail){
            return NextResponse.json(
                {error:"Empty fields"},
                {status:404}
            )
        }

        const workeravailibility = await worker.findOne({WorkerEmail});
        if(workeravailibility){
            console.log("Already entered the worker details");
            return NextResponse.json(
                {error:"Worker account already exists"},
                {status:401}
            )
        }

        const newWorkerRecord = new worker({
            workerName,
            WorkerEmail,
            businessId:bid,
            adminId
        });

        const savedWorker = await newWorkerRecord.save();

        console.log("SavedWorker"+savedWorker);
        return NextResponse.json(
            {success:true},
            {status:200}
        )

    } catch (error) {
        console.log("error"+error);
        return NextResponse.json(
            {error:"Internal Server error"+error},
            {status:500}
        )
    }
}