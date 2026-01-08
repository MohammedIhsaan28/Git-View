'use client';

import { trpc } from "@/app/_trpc/client";
import useProject from "@/hooks/use-project";
import Image from "next/image";

export default function TeamMembers(){
    const {projectId} = useProject();
    const {data: members} = trpc.project.getTeamMembers.useQuery({projectId});

    return(

        <div className="flex items-center gap-2">
            {members?.map((member) => (
                <img key={member.id} src={member.user.imageUrl ?? 'A'} width={30} height={30} alt={member.user.firstName ?? 'FirstName'} className="rounded-full"/>

            ))}

        </div>

    )
}