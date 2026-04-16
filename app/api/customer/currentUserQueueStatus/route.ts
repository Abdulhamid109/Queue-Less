// to check whether the current user is present in the Queue 

import { connect } from "@/config/dbconfig";
import { GETQUEUETOKENDATA } from "@/helpers/getQueueData";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request:NextRequest){
    await connect();
    try {
        const qid = await GETQUEUETOKENDATA(request);
        // based on this make sure you display whether the user is in the Queue or not!
    } catch (error) {
        return NextResponse.json(
            {error:"Internal Server error"+error},
            {status:500}
        )
    }
}