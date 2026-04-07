import { connect } from "@/config/dbconfig";
import { GETADMINTOKENDATA } from "@/helpers/getAdminTokenData";
import admin from "@/models/AdminModal";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function GET(request:NextRequest){
    try {
        const adminid = await GETADMINTOKENDATA(request);
        if(!adminid){
            return NextResponse.json(
                {error:"Un-authorized admin"},
                {status:401}
            )
        }

        const adminProfile = await admin.findById(adminid);
        return NextResponse.json(
            {success:true,profile:adminProfile},
            {status:200}
        )
    } catch (error) {
        console.log("Error"+error)
        return NextResponse.json(
            {error:"Internal Server error"+error},
            {status:500}
        )
    }
}