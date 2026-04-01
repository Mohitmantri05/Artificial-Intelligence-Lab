import { motion } from 'framer-motion';
import { Upload, FileSearch, CheckCircle2, Send } from 'lucide-react';

const steps = [
    {
        icon: <Upload size={32} />,
        title: "Upload Resumes",
        description: "Deep-load bulk PDFs or Docx files directly into our secure processing engine."
    },
    {
        icon: <FileSearch size={32} />,
        title: "AI Analysis",
        description: "Our LLM extracts skills, experience, and intent from every application."
    },
    {
        icon: <CheckCircle2 size={32} />,
        title: "Scoring & Ranking",
        description: "Candidates are instantly ranked based on job-specific relevance scores."
    },
    {
        icon: <Send size={32} />,
        title: "Hire the Best",
        description: "Export shortlist reports and start interviewing the top 1% immediately."
    }
];

const Workflow = () => {
    return (
        <section id="workflow" className="py-24 px-6 relative bg-white/[0.02]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">How It Works</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        A simple, streamlined process to elevate your recruitment game.
                    </p>
                </div>

                <div className="relative">
                    {/* Connector Line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -translate-y-1/2" />

                    <div className="grid lg:grid-cols-4 gap-12 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="w-20 h-20 rounded-[2rem] bg-electric-blue flex items-center justify-center mb-8 blue-glow relative">
                                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-deep-navy border border-white/10 flex items-center justify-center text-xs font-bold">
                                        0{index + 1}
                                    </div>
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed max-w-[200px]">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Workflow;
