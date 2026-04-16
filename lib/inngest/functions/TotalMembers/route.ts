// Deprecated :  Using SSE Events along with the TimeInterval

// import { NextResponse } from "next/server";
// import { inngest } from "../../client";
// import { connect } from "@/config/dbconfig";
// import queue from "@/models/QueueModal";


// export const TotalQueueMembers = inngest.createFunction(
//     {
//         id:"TotalQueue-Members",triggers:{cron:"* * * * * *"}
//     },
//     async({step})=>{
//         try {
//             // we are jus gonna fetch the total members based on the date
//             const date = new Date();
//             const localeDate = date.toLocaleDateString();

//             await connect();
//             const Queue = await queue.find({date:localeDate});
//             console.log("QueueData"+Queue);

//         } catch (error) {
//             console.log("Error => "+error);
//             return NextResponse.json(
//                 {error:"Internal Server error"+error},
//                 {status:500}
//             )
//         }
//     }
// )