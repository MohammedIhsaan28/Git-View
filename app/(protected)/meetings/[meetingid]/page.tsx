import IssuesList from "./issues-list";

type Props = {
  params: { meetingid: string };
};

export default async function MeetingsPage({ params }: Props) {
  const { meetingid } = await params;

  return (
    <div>
        <IssuesList meetingId={meetingid}/>
    </div>
  )
}
