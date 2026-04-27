import { connect } from "@/config/dbconfig";
import { GETADMINTOKENDATA } from "@/helpers/getAdminTokenData";
import { isCheckTime } from "@/helpers/TimeCheck";
import queue from "@/models/QueueModal";
import service from "@/models/serviceModal";
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
                    { error: "Current day records are only visible after the shop-end time" },
                    { status: 401 }
                )
            }
        }
        const [year, month, day] = inputDate.split("-");
        const date = new Date(year, month - 1, day);
        const formattedDate = date.toLocaleDateString();

        console.log("Formatted date for query:", formattedDate);
        const AllQueues = await queue.find({ businessId: bid, date: formattedDate, JoinedQueue: true });
        console.log("TotalQueues => " + AllQueues.length)

        const allServiceIds = AllQueues.flatMap((d) => d.ServiceId);
        const allServices = await Promise.all(
            allServiceIds.map((e: string) => service.findById(e))
        );
        const totalExpense = allServices.reduce((acc, serviceDB) => {
            if (!serviceDB) return acc;
            return acc + (serviceDB.ChargesPerService || 0);
        }, 0);

        console.log("Total Expense for " + formattedDate + " is " + totalExpense);

        return NextResponse.json(
            { success: true, expense: totalExpense },
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