
import { trpc } from '@/app/_trpc/client';
import { useLocalStorage } from 'usehooks-ts';

const useProject = () => {
    const {data: projects} = trpc.project.getProject.useQuery();
    const [projectId,setProjectId] = useLocalStorage('gitview-project','');
    const project = projects?.find(project => project.id === projectId);
    return {
        projects,
        project,
        projectId,
        setProjectId
    }
}

export default useProject;
