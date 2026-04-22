import { connect } from "@/config/dbconfig";
import { GETTOKENDATA } from "@/helpers/getTokenData";
import customer from "@/models/CustomerModal";
import queue from "@/models/QueueModal";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const bid = searchParams.get("bid");

        if (!bid) {
            return NextResponse.json(
                { error: "Business ID is required!" },
                { status: 400 }
            );
        }

        // Get the logged-in user's ID from their auth token
        const uid = await GETTOKENDATA(request);
        if (!uid) {
            return NextResponse.json(
                { error: "Unauthorized User!" },
                { status: 401 }
            );
        }

        // Find the user and look up their activeQueues for this business
        const user = await customer.findById(uid);
        if (!user) {
            return NextResponse.json(
                { error: "User not found!" },
                { status: 404 }
            );
        }

        const date = new Date();
        const localeDate = date.toLocaleDateString();
        const entry = user.activeQueues?.find(
            (q: { businessId: { toString: () => string } ,date:string}) =>(
                q.businessId.toString() === bid &&
                q.date === localeDate
            )
        );

        console.log("Entry => "+entry);

        // User has no queue entry for this business
        if (!entry) {
            return NextResponse.json(
                { success: true, Joined: false },
                { status: 200 }
            );
        }

        // Check the actual queue document status
        const queueStatus = await queue.findById(entry.queueId);
        if (!queueStatus) {
            return NextResponse.json(
                { success: true, Joined: false },
                { status: 200 }
            );
        }

        console.log("Queue => "+queueStatus);
        
        

        return NextResponse.json(
            { success: true, Joined: queueStatus.JoinedQueue, queueId: queueStatus._id ,currentPosition: queueStatus.CurrentPostion},
            { status: 200 }
        );

    } catch (error) {
        console.log("Error from server => " + error);
        return NextResponse.json(
            { error: "Internal Server error: " + error },
            { status: 500 }
        );
    }
}