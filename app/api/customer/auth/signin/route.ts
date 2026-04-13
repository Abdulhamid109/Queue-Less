import { connect } from "@/config/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import customer from "@/models/CustomerModal";


connect();

export async function POST(request:NextRequest){
    try {
        const {name,email,password,latitude,longitude,phone,CustomerAddress} = await request.json();
        if(!name||!email||!password||!phone||!latitude||!longitude||!CustomerAddress){
            return NextResponse.json(
                {error:"Incomplete fields"},
                {status:404}
            )
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newCustomer = new customer({
            name,
            email,
            password:hashedPassword,
            phone,
            "CustomerCurrentLocation.type":"Point",
            "CustomerCurrentLocation.coordinates": [longitude,latitude],
            CustomerAddress
        });

        const savedCustomer = await newCustomer.save();
        console.log("Customer-Debug(signup Route)=>"+savedCustomer);
        return NextResponse.json(
            {success:true},
            {status:200}
        )

    } catch (error) {
        return NextResponse.json(
            {error:"Internal Server error"+error},
            {status:500}
        )
    }
}