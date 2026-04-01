import { motion } from 'framer-motion';
import { Search, BarChart3, Users, Zap, Shield, Cpu } from 'lucide-react';

const features = [
    {
        icon: <Cpu className="text-blue-500" />,
        title: "LLM-Based Analysis",
        description: "Go beyond keyword matching. Our AI understands context, skills, and experience like a human recruiter."
    },
    {
        icon: <Search className="text-purple-500" />,
        title: "Smart Filtering",
        description: "Instantly rank candidates based on custom job descriptions and specific semantic requirements."
    },
    {
        icon: <BarChart3 className="text-green-500" />,
        title: "Insightful Analytics",
        description: "Get detailed scoring reports and visualization of candidate strengths and weaknesses."
    },
    {
        icon: <Users className="text-orange-500" />,
        title: "Bias Reduction",
        description: "Ensure fair hiring with AI that focuses purely on merit and skill sets, removing unconscious bias."
    },
    {
        icon: <Zap className="text-yellow-500" />,
        title: "Lightning Fast",
        description: "Process thousands of applications in minutes, saving your team weeks of manual screening time."
    },
    {
        icon: <Shield className="text-red-500" />,
        title: "Secure & Compliant",
        description: "Enterprise-grade data protection ensures all candidate information is kept safe and private."
    }
];

const Features = () => {
    return (
        <section id="features" className="py-24 px-6 relative">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold mb-4 text-gradient"
                    >
                        Powerful Features for Modern Teams
                    </motion.h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Everything you need to find the perfect candidate in a fraction of the time.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-8 group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
