import { connect } from "@/config/dbconfig";
import { GETTOKENDATA } from "@/helpers/getTokenData";
import queue from "@/models/QueueModal";
import { NextRequest, NextResponse } from "next/server";
import customer from "@/models/CustomerModal";


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
        const UserDB = await customer.findById(uid);
        const entry = UserDB.activeQueues?.find(
            (q: { businessId: { toString: () => string } }) =>
                q.businessId.toString() === businessId
        );

        console.log("Entry => "+entry);
        
        if(entry){
            return NextResponse.json(
                {error:"Already joined the Queue"},
                {status:401}
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

        
        //storing the queueid in the browser queue (this will be only of current user)(it will be overrriden when the user joins another business)

        // const payload = {
        //     qid:savedQueue._id
        // }
        // const queueToken = jwt.sign(payload,process.env.SECRET_KEY!);

        // console.log("Queue => "+savedQueue);

        // update the record in the userModal
        const custModalDB = await customer.findOneAndUpdate({_id:uid},
            {
                $push:{
                    activeQueues:{
                        businessId:businessId,
                        queueId:newQueueJoinee._id,
                        date:localeDate
                    }
                }
            }
        );

        const savedQueue = await newQueueJoinee.save();

        console.log("Customer update DB => "+custModalDB)
        return NextResponse.json(
            {success:true,queue:savedQueue},
            {status:200}
        )

        // response.cookies.set('queueToken',queueToken);
        // return response;
    } catch (error) {
        console.log("Error on Server => "+error)
        return NextResponse.json(
            {error:"Internal Server error"+error},
            {status:500}
        )
    }
}