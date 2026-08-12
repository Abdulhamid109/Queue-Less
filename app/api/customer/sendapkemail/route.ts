import { connect } from "@/config/dbconfig";
import resend from "@/lib/resend";
import { NextRequest, NextResponse } from "next/server";



connect();

export async function POST(request:NextRequest){
    try {
        const {waitlistemail} = await request.json();
        if(!waitlistemail){
            return NextResponse.json(
                {error:"Kindly enter email"},
                {status:404}
            )
        }

        const { data, error } = await resend.emails.send({
        from: "Queueless <info@queueless.fun>",
        to: waitlistemail,
        subject: "Thank-You for joining our waitlist",
        text: `You have joined our product waitlist with ${waitlistemail}`,
        html: `
        <div style="font-family: sans-serif; padding: 20px;">
            <h2>Queueless early access</h2>
            <a href=${'https://github.com/Abdulhamid109/Queue-Less/releases/download/queueless-apk-v2.5.0/app-release.apk'} style="font-size: 17px; color: blue;">Click Here!</a>
            <p>© ${new Date().getFullYear()} Queueless. All rights reserved</p>
            <hr/>
            <p style="font-size: 12px; color: #888;">Queueless · info@queueless.fun</p>
        </div>
    `
    });

    if (error) {
        console.log("Error => " + JSON.stringify(error));
        throw new Error("From Email" + error)
    }
    console.log("Data from Email => "+data);

    return NextResponse.json(
        {success:true},
        {status:200}
    )

    } catch (error) {
        return NextResponse.json(
            {error:"Internal server error "+error},
            {status:500}
        )
    }
}