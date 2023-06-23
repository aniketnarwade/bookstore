import dbConn from "@/utils/dbConn";
import Books from "@/models/books";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req, res) {
  try {
    const body = await req.json();

    await dbConn();

    if (body.data._id) {
      let userData = await Books.findByIdAndUpdate(
        { _id: body.data._id },
        body.data
      );
      return NextResponse.json(
        {
          message: "Book Updated successfully!",
          data: userData,
        },
        {
          status: 200,
        }
      );
    } else {
      let userdata = await Books.create(body.data);
      return NextResponse.json(
        {
          message: "Book Created successfully!",
        },
        {
          status: 200,
        }
      );
    }
  } catch (e) {
    return NextResponse.json(
      { message: "Server error, please try again!" },
      { status: 500 }
    );
  }
}

export async function GET(req, res) {
  try {
    const url = new URL(req.url, "https://bookstore-nu-ten.vercel.app"); // Assuming the req.url contains the full URL including the query string
    const searchParams = new URLSearchParams(url.search);
    const id = searchParams.get("id");

    // const body = await req.json();
    await dbConn();

    let book = await Books.find({ userId: id });

    return NextResponse.json(
      {
        message: "Books get successfully!",
        data: book,
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Server error, please try again!" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, res) {
  try {
    const url = new URL(req.url, "https://bookstore-nu-ten.vercel.app"); // Assuming the req.url contains the full URL including the query string
    const searchParams = new URLSearchParams(url.search);
    const id = searchParams.get("id");

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid user ID format!" },
        { status: 400 }
      );
    }

    await dbConn();

    let user = await Books.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json({ message: "Book not found!" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Book deleted successfully!",
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    console.error(e); // Log the error to the console
    return NextResponse.json(
      { message: "Server error, please try again!" },
      { status: 500 }
    );
  }
}
