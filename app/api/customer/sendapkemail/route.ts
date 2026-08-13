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
  subject: "You're on the Queueless waitlist",
  text: `Hi,

Thanks for signing up for Queueless early access using ${waitlistemail}.

Download the app here: https://github.com/Abdulhamid109/Queue-Less/releases/download/queueless-apk-v3.0.0/app-release.apk

If you didn't request this, you can ignore this email.

— The Queueless Team`,
  html: `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #222; line-height: 1.5; max-width: 480px;">
      <p>Hi,</p>
      <p>Thanks for signing up for Queueless early access using <strong>${waitlistemail}</strong>.</p>
      <p>You can download the app here: <a href="https://github.com/Abdulhamid109/Queue-Less/releases/download/queueless-apk-v2.5.0/app-release.apk">Download Queueless APK</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <p>— The Queueless Team</p>
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
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