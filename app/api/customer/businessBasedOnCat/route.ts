// displaying all the business based on the category and location (i.e 3-4 KM nearby)

import { connect } from "@/config/dbconfig";
import business from "@/models/BusinessModal";
import { NextRequest, NextResponse } from "next/server";


connect();



export async function POST(request: NextRequest) {
    await business.syncIndexes()

    try {
        const { searchParams } = new URL(request.url);
        const { latitude,longitude } = await request.json();
        const categoryBlob = searchParams.get("category");
        console.log("Latitude"+latitude)
        console.log("Longotude"+longitude)
        if (!latitude || !longitude) {
            return NextResponse.json(
                { error: "No Location access" },
                { status: 404 }
            )
        }

        // for calculating the distance we can use mongodb aggreate function along with the $geonear piplenine
        const allbusiness = await business.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [longitude,latitude],
                    },
                    distanceField: "distance",
                    maxDistance: 4000,
                    spherical: true,
                    query: {
                        BusinessCategory: categoryBlob,
                    },
                },
            },
            {
                $sort:{
                    distance:1
                }
            },
        ]);

        console.log("Data => "+JSON.stringify(allbusiness));

        return NextResponse.json(
            {success:true,businessess:allbusiness},
            {status:200}
        )


    } catch (error) {
        console.log("error=>"+error)
        return NextResponse.json(
            { error: "Internal Server error" + error },
            { status: 500 }
        )
    }
}