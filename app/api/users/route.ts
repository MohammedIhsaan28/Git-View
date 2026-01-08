import db from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const userSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(2).max(100),
  email: z.string().email("Invalid email address"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email } = userSchema.parse(body);
    const user = await db.user.create({
      data: {
        id,
        name,
        email,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (e) {
    return NextResponse.json({
        error: 'Invalid user data',
        status: 400
    })
  }
}

export async function GET() {
    try{
    const users = await db.user.findMany();
    return NextResponse.json(users);
    } catch(e){
        return NextResponse.json({
            error: 'Failed to fetch users',
            status: 500
        })
    }

}

export async function DELETE(request: Request) {
    try{
    const body = await request.json();
    const { id } = z.object({id: z.number().int().positive()}).parse(body);
    await db.user.delete({
        where: {id}
    });
    return NextResponse.json({message: 'User deleted successfully'});
    } catch(e){
        return NextResponse.json({
            error: 'Failed to delete user',
            status: 500
        })
    }
} 

export async function PUT(request: Request) {
    try{
    const body = await request.json();
    const { id, name, email } = userSchema.parse(body);
    const user = await db.user.update({
        where: {id},
        data: {
            name,
            email,
            updatedAt: new Date(),
        }
    });
    return NextResponse.json(user,{status:200});
    } catch(e){
        return NextResponse.json({
            error: 'Failed to update user',
            status: 500
        })
    }
}