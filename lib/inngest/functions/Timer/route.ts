// here we will be creating a function for (waiting) the slot
// before 10 min ack and after 10 min based on the location the timing start
// NOTE : For demonstration purpose chnaging the time

import { NextResponse } from "next/server";
import { inngest } from "../../client";
import queue from "@/models/QueueModal";
import customer from "@/models/CustomerModal";
import business from "@/models/BusinessModal";
import { getDistanceInMeters } from "@/helpers/getDistanceInMeters";
import service from "@/models/serviceModal";

export const SlotTime = inngest.createFunction(
    {
        id: 'slot Timer',
        triggers: {
            event: "slot/StartTime"
        }
    },
    async ({ event, step }) => {
        try {
            const { uid, bid, queueId } = event.data;

            // // if(parseInt(postion)!==1){
            // await step.sleep('waiting-Time',`${1}m`);
            // // }
            // await step.run('before-10min',async()=>{
            //     console.log("Sending an acknowledgment via call or email");
            // });
            // // await step.sleep("Waiting/final-10mins",`${10}m`);


            // if the user is in the range of 50 meters then make the status started
            // else make it fails to come i.e slot failed then instead of waiting i need to come immediately based on the psotion
            // i.e if i'm the first person then there will be no wating immediately an acknowment will be sentand w'll be waiting final 10 min
            // if the user doesn't come in that particular location then fail that slot , but the next user will be having the time of service time (like 40 min(waiting time))
            // which is not expected i.e the user should get the acknowledgement immediately and wating time for the next slot
            // step 01 : polling (for every 1 min till the );

            let pollCount = 0;
            let shouldNotify = false;

            while (!shouldNotify) {
                const result = await step.run(`poll-check-${pollCount}`, async (): Promise<{ cancelled?: boolean; notify?: boolean }> => {
                    const QueueEntry = await queue.findById(queueId);

                    if (!QueueEntry || !QueueEntry.JoinedQueue) {
                        return { cancelled: true };
                    }

                    const now = new Date();
                    const expectedStartTime = new Date(QueueEntry.expectedStartTime);
                    const MinsRemaining = (expectedStartTime.getTime() - now.getTime()) / 60000;
                    // console.log('Mins Remaingin' + expectedStartTime.getTime()/60000)
                    // console.log('Mins Remaingin' + now.getTime()/60000)

                    console.log(`User ${uid} — mins remaining: ${MinsRemaining}`);

                    if (MinsRemaining <= 9) {
                        return { notify: true };
                    }

                    return { notify: false };
                });

                if (result.cancelled) return;

                if (result.notify) {
                    shouldNotify = true;
                } else {
                    await step.sleep(`poll-sleep-${pollCount}`, '1m');
                }

                pollCount++;
            }

            // step 02:ack sending
            await step.run('ack-sending', async (): Promise<{ status?: boolean }> => {
                const QueueEntry = await queue.findById(queueId);
                if (!QueueEntry || !QueueEntry.JoinedQueue) {
                    return { status: false };
                };
                console.log("Notified through call/SMS and stored in DB");
                return { status: true }
            });

            // STEP 3: Wait final 10 mins
            await step.sleep('final-10min', '1m');

            // step 04: location confirmation
            const isNearby = await step.run('check-location', async () => {
                const CustomerDB = await customer.findById(uid);
                const businessDB = await business.findById(bid);

                const distance = getDistanceInMeters(
                    CustomerDB.CustomerCurrentLocation.coordinates,
                    businessDB.BusinessCurrentLocation.coordinates
                );

                return distance <= 50;
            });

            if (isNearby) {
                await step.run('slot-started', async (): Promise<{ status?: string }> => {
                    console.log("Make a DB query to indicate the slot has started");
                    return { status: "slot-started" }
                })
            } else {
                // failing the slot
                console.log("Started with failed slot checking...");
                await step.run('fail/rebalance', async () => {
                    // also we need to remove/pull from the users list
                    const date = new Date();
                    const userDB = await customer.findById(uid);
                    const entry = userDB.activeQueues?.find(
                        (q: { businessId: { toString: () => string }, date: string }) => (
                            q.businessId.toString() === bid &&
                            q.date === date.toLocaleDateString()
                        )
                    );

                    console.log("Entry => " + entry);

                    await customer.findByIdAndUpdate(uid, {
                        $pull: {
                            activeQueues: {
                                queueId: entry.queueId
                            }
                        }
                    });
                    const failedEntry = await queue.findByIdAndUpdate(
                        queueId,
                        { status: "failed", JoinedQueue: false },
                        { new: true }
                    );

                    // Get failed user's total service duration
                    const failedServices = await service.find({
                        _id: { $in: failedEntry.ServiceId }
                    });
                    const deductMins = failedServices.reduce(
                        (acc, s) => acc + s.AvgDurationPerCustomer, 0
                    );

                    // Find all users behind the failed user
                    const usersAhead = await queue.find({
                        businessId: bid,
                        date: new Date().toLocaleDateString(),
                        JoinedQueue: true,
                        CurrentPostion: { $gt: failedEntry.CurrentPostion }
                    });

                    // Deduct time from each user's ExpectedStartTime in DB
                    await Promise.all(usersAhead.map(async (u) => {
                        const newExpectedStart = new Date(
                            new Date(u.ExpectedStartTime).getTime() - deductMins * 60000
                        );
                        await queue.findByIdAndUpdate(u._id, {
                            ExpectedStartTime: newExpectedStart
                        });
                    }));



                    console.log(`Deducted ${deductMins} mins from ${usersAhead.length} users`);

                });

                const nextUSer = await step.run('get-next-user', async () => {
                    const failedEntry = await queue.findById(queueId);
                    return await queue.findOne({
                        businessId: bid,
                        date: new Date().toLocaleDateString(),
                        JoinedQueue: true,
                        CurrentPostion: failedEntry.CurrentPostion + 1
                    });
                });

                if (nextUSer) {
                    await step.run('trigger-next', async () => {
                        await inngest.send({
                            name: "slot/StartTime",
                            data: {
                                uid: nextUSer.UserId,
                                bid,
                                queueId: nextUSer._id,
                            }
                        })
                    })
                }
            }





        } catch (error) {
            console.log("Error=>" + error);
            return NextResponse.json(
                { error: "Internal Server error => " + error },
                { status: 500 }
            );
        }
    }
)