// displaying all the business based on the category and location (i.e 3-4 KM nearby)

import { connect } from "@/config/dbconfig";
import business from "@/models/BusinessModal";
import { NextRequest, NextResponse } from "next/server";


connect();



export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const { coordinates } = await request.json();
        const categoryBlob = searchParams.get("category");
        if (coordinates) {
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
                        coordinates: coordinates,
                    },
                    distanceField: "distance",
                    maxDistance: 4000,
                    spherical: true,
                    query: {
                        BusinessCategory: categoryBlob,
                    },
                },
            },
        ]);

        return NextResponse.json(
            {success:true,businessess:allbusiness},
            {status:200}
        )


    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server error" + error },
            { status: 500 }
        )
    }
}