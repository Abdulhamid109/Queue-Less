import { connect } from "@/config/dbconfig";
import { GETTOKENDATA } from "@/helpers/getTokenData";
import customer from "@/models/CustomerModal";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function GET(request:NextRequest){
    try {
        const uid = await GETTOKENDATA(request);
        console.log("UID",uid)
        if(!uid){
            return NextResponse.json(
                {error:"Un-authorized User"},
                {status:401}
            )
        }
        const profile = await customer.findById(uid);

        return NextResponse.json
        (
            {success:true,profile},
            {status:200}
        )

    } catch (error) {
        console.log("Error => "+error)
        return NextResponse.json(
                    {error:"Internal Server error"+error},
                    {status:500}
                )
    }
}