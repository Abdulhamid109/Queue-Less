// to check whether the current user is present in the Queue 

import { connect } from "@/config/dbconfig";
import { GETQUEUETOKENDATA } from "@/helpers/getQueueData";
import queue from "@/models/QueueModal";
import { NextRequest, NextResponse } from "next/server";


connect();
export async function GET(request: NextRequest) {
    try {
        const qid = await GETQUEUETOKENDATA(request);
        const {searchParams} = new URL(request.url);
        const bid = searchParams.get("bid");
        // based on this make sure you display whether the user is in the Queue or not!
        console.log("QID => "+JSON.stringify(qid))
        if (!qid) {
            return NextResponse.json(
                { error: "Queue not found!" },
                { status: 401 }
            )
        }
        const QueueStatus = await queue.findOne({businessId:bid,_id:qid});
        return NextResponse.json(
            { success: true, Joined: QueueStatus.JoinedQueue },
            { status: 200 }
        )

    } catch (error) {
        console.log("Error from server =>"+error);
        return NextResponse.json(
            { error: "Internal Server error" + error },
            { status: 500 }
        )
    }
}