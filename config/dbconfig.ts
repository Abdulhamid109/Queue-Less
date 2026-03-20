import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function connect(){
    try {
        await mongoose.connect(process.env.MONGO_URL!);
        const connection = mongoose.connection;

        connection.on("connected",()=>{
            console.log("Successfully connected to mongodb!");
        });

        connection.on('error',(e)=>{
            console.log("Failed to connect to mongodb =>"+e);
            process.exit(1);
        })
    } catch (error) {
        return NextResponse.json(
            {error:"Failed to connect to the DB"+error},
            {status:500}
        )
    }
}