import { motion } from 'framer-motion';
import { Search, Filter, Share2 } from 'lucide-react';

const Demo = ({ onGetStarted }: { onGetStarted?: () => void }) => {
    const candidates = [
        { name: "John Doe", score: 94, role: "Senior Frontend Engineer", match: "High" },
        { name: "Jane Smith", score: 88, role: "Full Stack Developer", match: "High" },
        { name: "Mike Ross", score: 42, role: "Product Manager", match: "Low" },
    ];

    return (
        <section id="demo" className="py-24 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">The Smarter Way to Shortlist</h2>
                        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                            Experience the power of semantic search and intelligent ranking. Our dashboard provides a clear overview of candidate suitability based on your specific requirements.
                        </p>

                        <div className="space-y-6 mb-10">
                            {[
                                "Instant semantic matching",
                                "Advanced filtering & sorting",
                                "Direct collaboration tools",
                                "Export-ready reports"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    </div>
                                    <span className="text-slate-300 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={onGetStarted}
                            className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all hover:border-electric-blue/50"
                        >
                            Explore Dashboard
                        </button>
                    </div>

                    <div className="relative">
                        <div className="glass-card p-6 border border-white/20 shadow-2xl">
                            {/* Dashboard Mockup UI */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                                        <Search size={18} className="text-slate-400" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-400">Search Candidates...</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Filter size={18} className="text-slate-400" />
                                    <Share2 size={18} className="text-slate-400" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                {candidates.map((candidate, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-sm">
                                                {candidate.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm">{candidate.name}</h4>
                                                <p className="text-xs text-slate-500">{candidate.role}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-blue-400 mb-1">{candidate.score}% Match</div>
                                            <div className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${candidate.match === 'High' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                {candidate.match}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Background Glow */}
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 blur-[100px] rounded-full" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Demo;
