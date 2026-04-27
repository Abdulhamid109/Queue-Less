import { connect } from "@/config/dbconfig";
import { GETTOKENDATA } from "@/helpers/getTokenData";
import queue from "@/models/QueueModal";
import { NextRequest, NextResponse } from "next/server";
import customer from "@/models/CustomerModal";
import service from "@/models/serviceModal";
import { inngest } from "@/lib/inngest/client";
import BusinessTime from "@/models/TimeModal";


connect();

export async function POST(request: NextRequest) {
    try {
        const { businessId, services } = await request.json();
        console.log("bid" + businessId)
        console.log("Service array" + services);

        const uid = await GETTOKENDATA(request);
        console.log("uid" + uid);
        if (!uid) {
            return NextResponse.json(
                { error: "Un authorized User" },
                { status: 401 }
            )
        }
        const Datee = new Date();
        const localeDate = Datee.toLocaleDateString();
        const TimeDb = await BusinessTime.findOne({ BusinessID: businessId });


        const UserDB = await customer.findById(uid);
        console.log("Bid => " + businessId)
        const entry = UserDB.activeQueues?.find(
            (q: { businessId: { toString: () => string }, date: string }) => (
                q.businessId.toString() === businessId &&
                q.date.toString() === localeDate
            )

        );

        console.log("Entry => " + entry);

        if (entry) {
            return NextResponse.json(
                { error: "Already joined the Queue" },
                { status: 401 }
            )
        }





        //storing the queueid in the browser queue (this will be only of current user)(it will be overrriden when the user joins another business)

        // const payload = {
        //     qid:savedQueue._id
        // }
        // const queueToken = jwt.sign(payload,process.env.SECRET_KEY!);

        // console.log("Queue => "+savedQueue);

        // update the record in the userModal



        // if the user is in the Queue then we can get his position
        const countAhead = await queue.countDocuments({
            businessId: businessId,
            date: localeDate,
            JoinedQueue: true
        });

        const postion = countAhead + 1;
        console.log("Current Users postion in the Queue" + postion);

        // if the current users postion is surpassing the totalcustomerlimit then done for the day
        if (postion >= TimeDb.CustomerLimitPerDay) {
            return NextResponse.json(
                { error: "Unable to book ,Customer limit exceeds" },
                { status: 402 }
            )
        }

        // if the current time is greator than the BET then user cannot book the slot
        const now = new Date();
        const hr = now.getHours().toString().padStart(2, '0');
        const min = now.getMinutes().toString().padStart(2, '0');

        const [dbHr, dbMin] = TimeDb.BET.split(':');

        const currentMins = parseInt(hr) * 60 + parseInt(min);
        const dbMins = parseInt(dbHr) * 60 + parseInt(dbMin);

        if (currentMins > dbMins) {
            return NextResponse.json(
                { error: "Slot cannot be booked as the shop is closed!" },
                { status: 403 }
            );
        }





        //Estimated waiting time based on the service the previous queue-members enrolled in

        const previousQueue = await queue.find({
            businessId: businessId,
            date: localeDate,
            JoinedQueue: true
        });

        //finding all the user who are already in the queue based on the business id and todays date
        console.log("previousQueue" + previousQueue)



        // from here

        // ✅ Collect all service IDs from all previous queue members
        const allServiceIds = previousQueue.flatMap((d) => d.ServiceId);

        // Fetch all services in parallel
        const allServices = await Promise.all(
            allServiceIds.map((serviceid: string) => service.findById(serviceid))
        );

        // Sum up durations, filtering nulls in case a service was deleted
        const TotalTime: number = allServices.reduce((acc, ServiceDB) => {
            if (!ServiceDB) return acc;
            return acc + (ServiceDB.AvgDurationPerCustomer || 0);
        }, 0);

        const expectedSt = new Date(
            Date.now() + TotalTime * 60000
        );




        console.log("Estimated Waiting Time (in mins) => " + TotalTime);
        console.log("Expected Start Time (in mins) => " + expectedSt);


        const newQueueJoinee = new queue({
            UserId: uid,
            businessId,
            ServiceId: services,
            date: localeDate,
            status: "active",
            JoinedQueue: true,
            CurrentPostion: postion,
            UserWaitingTime: TotalTime,
            expectedStartTime: expectedSt
        });

        const custModalDB = await customer.findOneAndUpdate({ _id: uid },
            {
                $push: {
                    activeQueues: {
                        businessId: businessId,
                        queueId: newQueueJoinee._id,
                        date: localeDate
                    }
                }
            }
        );
        console.log("Customer update DB => " + custModalDB);


        //calling the inngest cron job from here to start(when 10 mins remaining the send an ack email(less priority(for now))/call(high Priority))
        // once the user confirms it the timer should get started!
        // and at the end of the time if the current location of the user is not in the radius(10m) of the business location then delete the user from the Queue
        // and move to the next person in the queue


        const savedQueue = await newQueueJoinee.save();






        // calling our inngest event
        await inngest.send(
            {
                name: "slot/StartTime",
                data: {
                    uid,
                    bid: businessId,
                    queueId: savedQueue._id
                }
            }
        )

        return NextResponse.json(
            { success: true, queue: savedQueue, Position: postion, WT: postion === 1 ? 10 : TotalTime },
            { status: 200 }
        )

        // response.cookies.set('queueToken',queueToken);
        // return response;
    } catch (error) {
        console.log("Error on Server => " + error)
        return NextResponse.json(
            { error: "Internal Server error" + error },
            { status: 500 }
        )
    }
}