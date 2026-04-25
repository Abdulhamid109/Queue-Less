import { connect } from "@/config/dbconfig";
import FeedBack from "@/models/FeedBackModal";
import { NextRequest, NextResponse } from "next/server";


connect()

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const bid = searchParams.get("id");
        console.log("bid value"+bid);
        const allFeedbacks = await FeedBack.find({bid}).sort({createdAt:-1});

        return NextResponse.json(
            {success:true,feedbacks:allFeedbacks},
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