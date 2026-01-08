
import db from "@/lib/db";
import {auth, currentUser} from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";


export default async function SyncUser(){
    const {userId} = await auth();
    if(!userId){
        throw new Error("User is not authenticated");
    }
    const user = await currentUser();
    if(!user?.emailAddresses[0]?.emailAddress){
        return notFound();
    }

    await db.user.upsert({
        where:{
            email: user.emailAddresses[0].emailAddress
        },
        update:{
            imageUrl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName
        },
        create:{
            id: userId,
            imageUrl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.emailAddresses[0].emailAddress,
        }
    });

    return redirect('/dashboard');
    
}