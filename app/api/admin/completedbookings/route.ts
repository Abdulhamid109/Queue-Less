// fetching the bookings based on the date

import { connect } from "@/config/dbconfig";
import { GETADMINTOKENDATA } from "@/helpers/getAdminTokenData";
import { isCheckTime } from "@/helpers/TimeCheck";
import business from "@/models/BusinessModal";
import queue from "@/models/QueueModal";
import BusinessTime from "@/models/TimeModal";
import { NextRequest, NextResponse } from "next/server";

connect();


export async function POST(request: NextRequest) {
    try {
        const adminID = await GETADMINTOKENDATA(request);
        const { searchParams } = new URL(request.url);
        const bid = searchParams.get('id');
        const inputDate = await request.json();
        if (!adminID) {
            return NextResponse.json(
                { error: "Un-authorized Admin!" },
                { status: 401 }
            )
        }
        if (inputDate === '' || !inputDate || inputDate == null) {
            return NextResponse.json(
                { error: "Kindly select the date" },
                { status: 404 }
            )
        }
        console.log("BID => " + bid)
        const BusinessTimeDetails = await BusinessTime.findOne({ BusinessID: bid });
        console.log("BET" + BusinessTimeDetails)
        const BET: string = await BusinessTimeDetails.BET;
        const today = new Date().toISOString().split("T")[0];

        console.log("Locale-Date =>" + today);
        console.log("Input-Date =>" + inputDate);
        //this is check only possible if the input date from the user is same as that of the current date
        if (inputDate === today) {
            const isGreaterThanCurrentTime = isCheckTime(BET);

            if (!isGreaterThanCurrentTime) {
                return NextResponse.json(
                    { error: "Records are only visible at the end of the day" },
                    { status: 401 }
                )
            }
        }
        const [year, month, day] = inputDate.split("-");
        const date = new Date(year, month - 1, day);
        const formattedDate = date.toLocaleDateString();

        console.log("Formatted date for query:", formattedDate);


        const QueueRecords = await queue.countDocuments({
            date: formattedDate,
            JoinedQueue:true,
            status:'active',
            businessId: bid
        });
        console.log("REcords count " + QueueRecords)
        return NextResponse.json(
            { success: true, count: QueueRecords },
            { status: 200 }
        )

    } catch (error) {
        console.log("Error => " + error);
        return NextResponse.json(
            { error: "Internal Server error" },
            { status: 500 }
        )
    }
}