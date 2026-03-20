import { connect } from "@/config/dbconfig";
import { NextResponse } from "next/server";


connect();

export async function GET(){
    try {
        const response = NextResponse.json(
            {success:true,message:"Successfully logged out!"},
            {status:200}
        );

        response.cookies.set("token","",{expires:new Date(0)});
        return response;
    } catch (error) {
        return NextResponse.json(
            {error:"Internal Server error "+error},
            {status:500}
        )
    }
}