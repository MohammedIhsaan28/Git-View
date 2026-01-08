'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MDEditor from '@uiw/react-md-editor';
import { Textarea } from "@/components/ui/textarea";
import useProject from "@/hooks/use-project";
import Image from "next/image";
import { useState } from "react";
import { askQuestion } from "./actions";
import { readStreamableValue } from "@ai-sdk/rsc";
import CodeReferences from "./code-references";
import { trpc } from "@/app/_trpc/client";
import { toast } from "sonner";
import useRefetch from "@/hooks/use-refetch";

export default function AskQuestionCard() {

    const { project } = useProject();
    const [open,setOpen] = useState(false);
    const [question, setQuestion] = useState("");
    const [loading,setLoading] = useState(false);
    const [filesReferences,setFilesReferences] = useState<{fileName:string;sourceCode:string;summary:string}[]>([]);
    const [answer,setAnswer] = useState<string>("");
    const saveAnswer = trpc.project.saveAnswer.useMutation();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setAnswer('');
        setFilesReferences([]);
        e.preventDefault();
        if(!project?.id) return 
        setLoading(true);
        
        const {output,filesReferences} = await askQuestion(question,project.id);
        setOpen(true);
        setFilesReferences(filesReferences);
        toast.success(`${filesReferences.length} file references found.`);

        for await (const delta of readStreamableValue(output)){
            if(delta){
                setAnswer(ans => ans + delta);
            }
            
        }
        setLoading(false);
    }
    const refetch = useRefetch();
    return(
        <>
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogContent className="sm:max-w-[80vw]">
                <DialogHeader>
                    <DialogTitle>
                        <div className="mx-auto flex items-center rounded-md overflow-hidden">
                            <Image src='/logo.png' alt='gitview' width={50} height={50}/>
                            <p className="">Gitview Assistant</p>
                        </div>
                        <Button className='' disabled={saveAnswer.isPending} variant={'outline'} onClick={()=> {
                            saveAnswer.mutate({
                                projectId: project?.id || 'Undefined',
                                question:question,
                                answer:answer,
                                filesReferences:filesReferences,
                            },{
                                onSuccess:()=> {
                                    toast.success('Answer saves!');
                                    refetch();
                                },
                                onError: () => {
                                    toast.error('Failed to save answer!');
                                }
                            }
                        )
                        }}>
                            Save Answer 
                        </Button>
                        
                    </DialogTitle>
                </DialogHeader>

                <div className="overflow-y-scroll max-h-[calc(80vh-200px)] flex-1">
                    <MDEditor.Markdown source={answer}  className="rounded-md p-4"/>
                    <div className="h-4"></div>
                    <CodeReferences filesReferences={filesReferences}/>
                </div>
             
                {/* <h1>Files References</h1> */}
                <Button type="button" onClick={()=> {setOpen(false); setAnswer("")}}>
                    Close
                </Button>
               
            </DialogContent>
        </Dialog>

            <Card className="w-full rounded-md bg-white">
                <CardHeader className="p-2 px-4 mt-4">
                    <CardTitle className="px-4">
                        Ask Questions!
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form className="p-2" onSubmit={onSubmit}>
                        <Textarea 
                            placeholder="Which file should I edit to change the home page"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="w-full"
                        />
                        <div className="h-4">
                        </div>
                        <Button type="submit" disabled={loading} className="mb-4">Ask GitView</Button>
                        
                    </form>
                </CardContent>

            </Card>
        </>
    )
}