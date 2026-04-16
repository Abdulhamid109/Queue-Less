import { connect } from "@/config/dbconfig";
import { GETTOKENDATA } from "@/helpers/getTokenData";
import queue from "@/models/QueueModal";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { GETQUEUETOKENDATA } from "@/helpers/getQueueData";


connect();

export async function POST(request:NextRequest){
    try {
        const {businessId,services} = await request.json();
        console.log("bid"+businessId)
        console.log("Service array"+services);

        const uid = await GETTOKENDATA(request);
        console.log("uid"+uid);
        if(!uid){
            return NextResponse.json(
                {error:"Un authorized User"},
                {status:401}
            )
        }
        const Datee = new Date();
        const localeDate = Datee.toLocaleDateString();

        const qid = await GETQUEUETOKENDATA(request);
        console.log("QID => "+qid);
        const UserJoinedStatus = await queue.findOne({businessId:businessId,_id:qid});;
        if(UserJoinedStatus){
            return NextResponse.json(
                {error:"User already Joined"},
                {status:404}
            )
        }
        

        const newQueueJoinee = new queue({
            UserId:uid,
            businessId,
            ServiceId:services,
            date:localeDate,
            status:"active",
            JoinedQueue:true
        });

        const savedQueue = await newQueueJoinee.save();
        //storing the queueid in the browser queue (this will be only of current user)
        const payload = {
            qid:savedQueue._id
        }
        const queueToken = jwt.sign(payload,process.env.SECRET_KEY!);

        console.log("Queue => "+savedQueue);
        const response = NextResponse.json(
            {success:true,queue:savedQueue},
            {status:200}
        )

        response.cookies.set('queueToken',queueToken);
        return response;
    } catch (error) {
        console.log("Error on Server => "+error)
        return NextResponse.json(
            {error:"Internal Server error"+error},
            {status:500}
        )
    }
}