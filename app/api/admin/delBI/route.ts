import { connect } from "@/config/dbconfig";
import business from "@/models/BusinessModal";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function DELETE(request:NextRequest){
    try {
        const {searchParams} = new URL(request.url);
        const uid = searchParams.get('uid');
        if(!uid){
            return NextResponse.json(
                {error:"Un-authorized Token"},
                {status:401}
            )
        }

        const delBI = await business.findByIdAndDelete(uid);
        console.log("Deleted BI Info"+delBI);
        return NextResponse.json(
            {success:true},
            {status:200}
        )
    } catch (error) {
        console.log("Error=>"+error)
        return NextResponse.json(
            {error:"INternal Server error"+error},
            {status:500}
        )
    }
}