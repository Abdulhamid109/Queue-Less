// Radius based fetching of the business when no business found

import { connect } from "@/config/dbconfig";
import business from "@/models/BusinessModal";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try {
        const { radius, longitude, latitude } = await request.json();
        if(!radius){
            return NextResponse.json(
                {error:"Kindly enter the radius value"},
                {status:404}
            )
        }
        if(!latitude || !longitude){
            return NextResponse.json(
                {error:"Location not found kindly allow the permission"},
                {status:404}
            )
        }
        const { searchParams } = new URL(request.url);
        const b_cat = searchParams.get('slug');
        if (parseInt(radius) < 4 || parseInt(radius) > 10) {
            return NextResponse.json(
                { error: "Radius Limit Exceeds" },
                { status: 401 }
            )
        }

        const fetchedBusinesses = await business.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    },
                    distanceField: "distance",
                    maxDistance: parseInt(radius)*1000,
                    spherical: true,
                    query: {
                        BusinessCategory: b_cat,
                    },
                }
            },
            {
                $sort: {
                    distance: 1
                }
            },
        ]);

        console.log("Data => " + JSON.stringify(fetchedBusinesses));

        return NextResponse.json(
            { success: true, business: fetchedBusinesses },
            { status: 200 }
        )


    } catch (error) {
        console.log("Error => " + error);
        return NextResponse.json(
            { error: "Internal Server rerror" + error },
            { status: 500 }
        )
    }
}