import { connect } from "@/config/dbconfig";
import service from "@/models/serviceModal";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function POST(request:NextRequest){
    try {
        const {bid,serviceName,serviceDuration,ServiceCharge,customerPerDay} = await request.json();
        console.log("Bud"+bid)
        console.log(customerPerDay)
        console.log(ServiceCharge)
        console.log(serviceName)
        console.log(serviceDuration)
        if(!bid){
            return NextResponse.json(
                {error:"No associated business!"},
                {status:401}
            )
        }
        // make creating make sure to check the same service is not repeated i mean based on serviceid(take it from frontend)
        const newService = new service({
            businessId:bid,
            name:serviceName,
            CustomerLimitPerDay:customerPerDay,
            AvgDurationPerCustomer:serviceDuration,
            ChargesPerService:ServiceCharge

        });

        const savedService = await newService.save();
        console.log("Added Service => "+savedService)
        return NextResponse.json(
            {success:true,service:savedService},
            {status:200}
        )
    } catch (error) {
        return NextResponse.json(
            {error:"Internal Server error"+error},
            {status:500}
        )
    }
}