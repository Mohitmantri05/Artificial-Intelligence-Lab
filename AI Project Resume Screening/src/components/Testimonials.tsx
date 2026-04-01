import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const Testimonials = () => {
    return (
        <section className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="glass-card p-12 md:p-20 relative overflow-hidden text-center max-w-4xl mx-auto border-white/10">
                    <Quote className="absolute top-10 left-10 text-blue-500/20" size={80} />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-2xl md:text-3xl font-medium leading-relaxed mb-10 text-slate-200">
                            "This platform transformed our hiring process. What used to take two weeks now takes literal minutes. The AI accuracy is incredible."
                        </h3>

                        <div className="flex flex-col items-center">
                            <img
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2340&auto=format&fit=crop"
                                alt="Testimonial User"
                                className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-electric-blue"
                            />
                            <div className="font-bold">David Chen</div>
                            <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">VP of Talent, TechCorp</div>
                        </div>
                    </motion.div>
                </div>

                {/* Value Prop Cards */}
                <div className="grid md:grid-cols-3 gap-8 mt-20">
                    {[
                        { label: "85%", sub: "Time Saved" },
                        { label: "10K+", sub: "Resumes Processed" },
                        { label: "4.9/5", sub: "User Rating" }
                    ].map((stat, i) => (
                        <div key={i} className="text-center p-8 rounded-2xl bg-white/5 border border-white/5">
                            <div className="text-4xl font-bold text-electric-blue mb-2">{stat.label}</div>
                            <div className="text-slate-500 font-bold text-sm uppercase tracking-wider">{stat.sub}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
