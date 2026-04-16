import { connect } from "@/config/dbconfig";
import queue from "@/models/QueueModal";
import { NextRequest, NextResponse } from "next/server";


connect();
export const dynamic = "force-dynamic"
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const bid = searchParams.get('bid');


        //ReadableStream => A Web API create the stream of data chunks
        const stream = new ReadableStream({
            async start(controller) {
                const send = async () => {
                    try {
                        const Datee = new Date();
                        const localeDate = Datee.toLocaleDateString();

                        const QueueDB = await queue.countDocuments({ businessId: bid, date: localeDate, status: "active" });
                        console.log("Total => "+QueueDB)
                        controller.enqueue(`data: ${JSON.stringify({ count: QueueDB })}\n\n`)


                    } catch (error) {
                        console.error("SSE error:", error)
                    }
                }

                await send();
                const interval = setInterval(send, 1000);


                //when the user disconnects cleanup the connection
                request.signal.addEventListener("abort", () => {
                    clearInterval(interval);
                    controller.close();
                })
            }
        })

        console.log("Stream"+stream);
        return new Response(
            stream,
            {
                headers: {
                    "Content-Type": "text/event-stream",
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                }
            }
        )


    } catch (error) {
        console.log("Error" + error);
        return NextResponse.json(
            { error: "Internal Server error" + error },
            { status: 500 }
        )
    }
}