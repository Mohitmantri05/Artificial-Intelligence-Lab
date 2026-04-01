import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

const Hero = ({ onStart }: { onStart: () => void }) => {
    return (
        <section className="relative pt-32 pb-20 px-6 overflow-hidden mesh-container min-h-screen flex items-center">
            {/* Background Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse delay-700" />

            <div className="max-w-7xl mx-auto w-full relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-electric-blue text-xs font-bold tracking-wider uppercase mb-6">
                            <Sparkles size={14} />
                            <span>Next Gen Recruitment</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 text-gradient">
                            AI-Powered <br />
                            <span className="text-electric-blue">Resume Screening</span> <br />
                            Redefined.
                        </h1>

                        <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-xl">
                            Automate your hiring workflow with pinpoint accuracy. Filter thousands of resumes in seconds using advanced LLM-based analysis.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={onStart}
                                className="px-8 py-4 bg-electric-blue hover:bg-blue-600 rounded-2xl font-bold transition-all hover:scale-105 flex items-center justify-center gap-2 blue-glow"
                            >
                                Try Free Demo <ArrowRight size={20} />
                            </button>
                            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold transition-all">
                                View on GitHub
                            </button>
                        </div>

                        <div className="mt-12 flex items-center gap-6 text-slate-500 text-sm">
                            <div className="flex items-center gap-2">
                                <Shield size={16} className="text-blue-500" />
                                <span>Enterprise Ready</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap size={16} className="text-yellow-500" />
                                <span>99.9% Accuracy</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        {/* Mockup Placeholder */}
                        <div className="relative glass rounded-[2.5rem] p-4 border border-white/20 shadow-2xl overflow-hidden animate-float">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent" />
                            <img
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                                alt="Dashboard Mockup"
                                className="rounded-[1.5rem] w-full object-cover shadow-lg border border-white/5 opacity-80"
                            />

                            {/* Floating Element */}
                            <div className="absolute -bottom-6 -left-6 glass-card p-4 rounded-2xl border border-white/20 shadow-xl max-w-[200px]">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <Zap size={16} className="text-green-500" />
                                    </div>
                                    <span className="text-xs font-bold">Top Match Found</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-[94%] bg-green-500 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
