import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";


interface DecodedData{
    uid:string;
    email:string;
}
export async function GETADMINTOKENDATA(request:NextRequest){
    try {
        const token = request.cookies.get('admintoken')?.value;
        const data = jwt.verify(token!,process.env.SECRET_KEY!,) as DecodedData;
        return data.uid;
    } catch (error) {
        return NextResponse.json(
            {error:"Internal Server error"+error},
            {status:500}
        )
    }
}