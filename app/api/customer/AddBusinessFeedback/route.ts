import { connect } from "@/config/dbconfig";
import { GETTOKENDATA } from "@/helpers/getTokenData";
import FeedBack from "@/models/FeedBackModal";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function POST(request: NextRequest) {
    try {
        const uid = await GETTOKENDATA(request);
        if(!uid){
            return NextResponse.json(
                {error:"Un-authorized User"},
                {status:401}
            );
        }
        const {searchParams} = new URL(request.url);
        const bid = searchParams.get("id");

        const {title,description} = await request.json();
        if(!title || !description){
            return NextResponse.json(
                {error:"Empty Values"},
                {status:404}
            )
        }

        const newFeedback = new FeedBack({
            cid:uid,
            bid,
            Title:title,
            Description:description
        });
        const savedFeedback = await newFeedback.save();
        console.log("Busineess feedback"+savedFeedback);
        return NextResponse.json(
            {success:true},
            {status:200}
        )
    } catch (error) {
        console.log("Error => " + error);
        return NextResponse.json(
            { error: "Internal Server error" + error },
            { status: 500 }
        )
    }
}