
import db from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Props ={
    params: Promise<{projectid: string}>
}
export default async function JoinHandler({params}: Props) {
    const {projectid} =  await params;
    const {userId} = await auth();

    if(!userId) {
        return redirect('/sign-in');
    }

    const dbUser = await db.user.findUnique({
        where:{
            id: userId
        }
    })

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    if(!dbUser){
        await db.user.create({
            data:{
                id:userId,
                email: user.emailAddresses[0].emailAddress,
                imageUrl:user.imageUrl,
                firstName: user.firstName,
                lastName: user.lastName
            }
        })
    }

    const project = await db.project.findUnique({
        where:{
            id:projectid
        }
    })

    if(!project) return redirect('/dashboard');

    try{
        await db.userToProject.create({
            data:{
                userId,
                projectId:projectid
            }
        })

    } catch(err){
        console.log('User already in project',err);
    }

    return redirect(`/dashboard`);
}

