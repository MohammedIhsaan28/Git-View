import {
  BrainCircuit,
  FileOutput,
  FileText,
  Github,
  MoveRight,
} from "lucide-react";
import BgGradient from "../ui/bgGradient";

type Steps = {
  icon: React.ReactNode;
  label: string;
  description: string;
};

const steps: Steps[] = [
  {
    icon: <Github size={64} strokeWidth={1.5} />,
    label: "Upload your project",
    description: "Simply create a new project by uploading your GitHub repo link",
  },
  {
    icon: <BrainCircuit size={64} strokeWidth={1.5} />,
    label: "AI Analysis",
    description:
      "Our advanced AI processes and analyzes your project instantly",
  },
  {
    icon: <FileOutput size={64} strokeWidth={1.5} />,
    label: "Get Summary",
    description:
      "Receive a clean, concise summary of your project in minutes and start chatting!",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative w-full ">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 sm:py-12 py-8">
        <BgGradient/>
        <div className="text-center mb-16">
          <h2 className="font-bold text-xl uppercase italic mb-4 text-violet-500"
          >
            How it works
          </h2>
          <h3 className="font-bold italic text-3xl max-w-2xl mx-auto"
          >
            Transform any pdf into an easy-to-digest summary in three simple
            steps
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
          {steps.map((step, idx) => (
            <div className="relative flex items-stretch"
              key={idx}
            >
              <StemItem {...step} />
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10"
                >
                  <MoveRight
                    size={32}
                    strokeWidth={1}
                    className="text-violet-400"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  function StemItem({ icon, label, description }: Steps) {
    return (
      <div
        className="relative p-6 rounded-2xl bg-white/5
        backdrop-blur-xs border border-white/10 hover:border-violet-500/50 
        transition-colors group w-full"
      >
        <div className="flex flex-col gap-4 h-full">
          <div
            className="flex items-center justify-center h-24 w-24 
                mx-auto rounded-2xl bg-linear-to-br from-violet-500/10 to-transparent 
                group-hover:from-violet-500/20 transition-colors"
          >
            <div className="text-violet-500">{icon}</div>
          </div>
          <div className="flex flex-col flex-1 gap-1 justify-between">
            <h4 className="text-center font-bold text-xl italic">{label}</h4>
            <p className="text-center text-gray-600 text-sm italic">{description}</p>
          </div>
        </div>
      </div>
    );
  }
}
