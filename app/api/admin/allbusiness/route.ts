import { connect } from "@/config/dbconfig";
import { GETADMINTOKENDATA } from "@/helpers/getAdminTokenData";
import business from "@/models/BusinessModal";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function GET(request:NextRequest) {
    try {
        const adminID = await GETADMINTOKENDATA(request);
        if(!adminID){
            return NextResponse.json(
                {error:"Invalid user"},
                {status:401}
            )
        }
        
        const allbusinessness = await business.find({adminid:adminID});
        console.log("ALL Business => "+allbusinessness);
        return NextResponse.json(
            {success:true,Business:allbusinessness},
            {status:200}
        )
    } catch (error) {
        console.log("Error=>" + error);
        return NextResponse.json(
            { error: "Internal Server error" + error },
            { status: 500 }
        )
    }
}