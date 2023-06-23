import dbConn from "@/utils/dbConn";
import User from '@/models/user'
import {NextResponse} from "next/server";
import mongoose from "mongoose";

export async function POST(req, res) {
    try {
        const body = await req.json();
        await dbConn();

       let userdata= await User.create(body);

        return NextResponse.json({
            message:"User Created successfully!"
        }, {
            status: 200
        })

    }catch (e) {
        return NextResponse.json(
            { message: "Server error, please try again!" },
            { status: 500 }
        )
    }
}

export async function GET(req, res) {
    try {

        // const body = await req.json();
        await dbConn();

        let user = await User.find();

        return NextResponse.json({
            message:"User get successfully!",
            data:user
        }, {
            status: 200
        })

    }catch (e) {
        return NextResponse.json(
            { message: "Server error, please try again!" },
            { status: 500 }
        )
    }
}

export async function DELETE(req, res) {
    try {
        const url = new URL(req.url, "http://localhost"); // Assuming the req.url contains the full URL including the query string
    const searchParams = new URLSearchParams(url.search);
    const id = searchParams.get('id');
    
    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json(
          { message: "Invalid user ID format!" },
          { status: 400 }
        );
      }

     
      await dbConn();
  
      let user = await User.findByIdAndDelete(id);
  
      if (!user) {
        return NextResponse.json(
          { message: "User not found!" },
          { status: 404 }
        );
      }
  
      return NextResponse.json({
        message: "User deleted successfully!"
      }, {
        status: 200
      });
  
    } catch (e) {
      console.error(e); // Log the error to the console
      return NextResponse.json(
        { message: "Server error, please try again!" },
        { status: 500 }
      );
    }
  }
  