import { connect } from "@/config/dbconfig";
import { GETADMINTOKENDATA } from "@/helpers/getAdminTokenData";
import business from "@/models/BusinessModal";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function POST(request:NextRequest){
    try {
        const adminid = await GETADMINTOKENDATA(request);
        if(!adminid){
            return NextResponse.json(
                {error:"Invalid admin credentials"},
                {status:401}
            )
        }
        const reqbody = await request.json();
        const {CompanyName,BusinessType,Country,State,City,Pincode,BusinessAddress,latitude,longitude,website} = reqbody;
        if(!CompanyName||!BusinessAddress||!BusinessType||!Country||!State||!City||!Pincode||!latitude||!longitude){
            return NextResponse.json(
                {error:"No Fields form"},
                {status:404}
            )
        }

        const newBusiness = new business({
            adminid:adminid,
            BusinessName:CompanyName,
            "BusinessCurrentLocation.type":"Point",
            "BusinessCurrentLocation.coordinates":[longitude,latitude],
            BusinessAddress:BusinessAddress,
            BusinessCategory:BusinessType,
            Country,
            State,
            City,
            pinCode:Pincode,
            website
        });

        const savedBusiness = await newBusiness.save();
        console.log("New business"+savedBusiness);

        return NextResponse.json(
            {success:true,Business:savedBusiness},
            {status:200}
        )
    } catch (error) {
        console.log("Error"+error);
        return NextResponse.json(
            {error:"Internal Server error"+error},
            {status:500}
        )
    }
}