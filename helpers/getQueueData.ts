// fetching the qid from the browser cookies and decoding i
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";


interface DecodedData{
    qid:string;
   
}
export async function GETQUEUETOKENDATA(request:NextRequest){
    try {
        const token = request.cookies.get('queueToken')?.value;
        const data = jwt.verify(token!,process.env.SECRET_KEY!,) as DecodedData;
        return data.qid;
    } catch (error) {
        return NextResponse.json(
            {error:"Internal Server error"+error},
            {status:500}
        )
    }
}