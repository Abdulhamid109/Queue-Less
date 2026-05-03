// fetching the bookings based on the date

import { connect } from "@/config/dbconfig";
import { GETADMINTOKENDATA } from "@/helpers/getAdminTokenData";
import { isCheckTime } from "@/helpers/TimeCheck";
import business from "@/models/BusinessModal";
import customer from "@/models/CustomerModal";
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
        // console.log("BID => " + bid)
        // const BusinessTimeDetails = await BusinessTime.findOne({ BusinessID: bid });
        // console.log("BET" + BusinessTimeDetails)
        // const BET: string = await BusinessTimeDetails.BET;
        const today = new Date().toISOString().split("T")[0];

        console.log("Locale-Date =>" + today);
        console.log("Input-Date =>" + inputDate);
        const [year, month, day] = inputDate.split("-");
        const date = new Date(year, month - 1, day);
        const formattedDate = date.toLocaleDateString();

        console.log("Formatted date for query:", formattedDate);


        const QueueRecords = await queue.find({
            date: formattedDate,
            businessId: bid,
        }).sort({Addedat:-1});


        const data = await Promise.all(
            QueueRecords.map(async (d) => {
                const usrdb = await customer.findById(d.UserId);

                return {
                    name: usrdb?.name || "Unknown",
                    bookingDate: d.date,
                    CurrentPostion:d.CurrentPostion,
                    joinedQueue: d.JoinedQueue,
                };
            })
        )

        return NextResponse.json(
            { success: true, data},
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