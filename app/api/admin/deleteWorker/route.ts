import { connect } from "@/config/dbconfig";
import { GETADMINTOKENDATA } from "@/helpers/getAdminTokenData";
import worker from "@/models/workermodal";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function DELETE(request:NextRequest){
    try {
        const adminId = await GETADMINTOKENDATA(request);
        if(!adminId){
            return NextResponse.json(
                {error:"Unauthorized Admin"},
                {status:401}
            )
        }

        const {searchParams} = new URL(request.url);
        const id = searchParams.get('id');

        await worker.findByIdAndDelete(id);

        return NextResponse.json(
            {success:true},
            {status:200}
        )

    } catch (error) {
        return NextResponse.json(
            {error:"Internal sErver errror "+error},
            {status:500}
        )
    }
}