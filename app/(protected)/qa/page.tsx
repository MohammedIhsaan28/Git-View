'use client';

import { trpc } from "@/app/_trpc/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import useProject from "@/hooks/use-project";
import AskQuestionCard from "../dashboard/ask-question-card";
import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "../dashboard/code-references";


export default function QAPage(){
    const {projectId} = useProject();
    const {data:questions} = trpc.project.getQuestions.useQuery({projectId});
    const [questionIndex,setQuestionIndex] = useState(0);
    const question = questions?.[questionIndex];

    return(
        <Sheet>
            <AskQuestionCard/>
            <div className="h-4"></div>

            <h1 className="text-xl font-semibold">Saved Questions</h1>
            <div className="h-2"></div>

            <div className="flex flex-col gap-2">
                {
                    questions?.map((question,index)=>{
                        return (
                        
                        <React.Fragment key={question.id}>
                                <SheetTrigger onClick={()=> setQuestionIndex(index)}>
                                    <div className="flex items-center gap-4 bg-white rounded-md  p-4 shadow border">
                                        

                                        <div className="text-left flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <img className="rounded-full" height={30} width={30} src={question.user.imageUrl ?? 'X'} />
                                                <p className="text-gray-700 line-clamp-1 text-md font-medium border p-2 rounded-md">
                                                    Q. {question.question}
                                                </p>
                                                <span className="text-xs border rounded-md p-1 text-gray-400 whitespace-nowrap">
                                                    {new Date(question.createdAt).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'medium'})}
                                                </span>

                                            </div>

                                            <p className="text-gray-400 mt-4 border overflow-y-scroll overflow-hidden p-4 rounded-md line-clamp-7 text-sm">
                                                    {question.answer}
                                            </p>

                                        </div>

                                    </div>

                                </SheetTrigger>

                            </React.Fragment>
                            )})
                }
            </div>

            {question && (
                <SheetContent className="sm:max-w-[80vw]">
                    <SheetHeader className="overflow-y-scroll">
                        <SheetTitle>
                            {question.question}
                        </SheetTitle>
                        <div className="overflow-y-scroll max-h-full flex-1 bg-white">
                            <MDEditor.Markdown className="rounded-md p-4" source={question.answer}/>
                            <div className='h-4'></div>
                            <CodeReferences filesReferences={(question.filesReferences ?? []) as any }/>
                        </div>
                        
                        
                    </SheetHeader>
                </SheetContent>
            )}
        </Sheet>
    )
}

// className="overflow-y-scroll max-h-[calc(80vh-200px)] flex-1"