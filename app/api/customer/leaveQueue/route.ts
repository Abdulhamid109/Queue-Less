// only the user who has joined can only leave...i.e the current user only

import { connect } from "@/config/dbconfig";
import { GETTOKENDATA } from "@/helpers/getTokenData";
import customer from "@/models/CustomerModal";
import queue from "@/models/QueueModal";
import { NextRequest, NextResponse } from "next/server";



connect();

export async function DELETE(request:NextRequest){
    try {
        const uid = await GETTOKENDATA(request);
        const {searchParams} = new URL(request.url);
        const bid = await searchParams.get("bid");
        if(!uid){
            return NextResponse.json(
                {error:"Un-authorized User"},
                {status:401}
            )
        }

        const date = new Date();
        const userDB = await customer.findById(uid);
        const entry = userDB.activeQueues?.find(
            (q: { businessId: { toString: () => string } ,date:string}) =>(
                q.businessId.toString() === bid &&
                q.date === date.toLocaleDateString()
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
        
        await customer.findByIdAndUpdate(uid,{
            $pull:{
                activeQueues:{
                    queueId:entry.queueId
                }
            }
        });


        //instead of deleting make the join status as false
        // await queue.findByIdAndDelete(entry.queueId);
        const updateQueue = await queue.findByIdAndUpdate(entry.queueId,{
            JoinedQueue:false,
            status:'failed'
        });

        console.log("Leaved Person From Queue => "+updateQueue);

        return NextResponse.json(
            {success:true},
            {status:200}
        )


    } catch (error) {
        console.log("Error =>"+error);
        return NextResponse.json(
            {error:"Internal Server error"+error},
            {status:500}
        )
    }
}