import React from 'react';
import { Bot, Menu, X, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ onHome, onGetStarted }: { onHome?: () => void, onGetStarted?: () => void }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between border border-white/10">
                <div className="flex items-center gap-2 cursor-pointer" onClick={onHome}>
                    <div className="w-10 h-10 bg-electric-blue rounded-xl flex items-center justify-center blue-glow">
                        <Bot className="text-white" size={24} />
                    </div>
                    <span className="font-bold text-xl tracking-tight hidden sm:block">AI Screen<span className="text-electric-blue">.</span></span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {['Features', 'Workflow', 'Demo', 'Pricing'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                        >
                            {item}
                        </a>
                    ))}
                    <a
                        href="https://github.com"
                        target="_blank"
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <Github size={20} className="text-slate-300 hover:text-white" />
                    </a>
                    <button
                        onClick={onGetStarted}
                        className="bg-electric-blue hover:bg-blue-600 px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 blue-glow"
                    >
                        Get Started
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-slate-300 hover:text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden absolute top-24 left-6 right-6 glass rounded-2xl p-6 border border-white/10"
                >
                    <div className="flex flex-col gap-4">
                        {['Features', 'Workflow', 'Demo', 'Pricing'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-lg font-medium text-slate-300"
                                onClick={() => setIsOpen(false)}
                            >
                                {item}
                            </a>
                        ))}
                        <hr className="border-white/10" />
                        <button
                            onClick={() => { onGetStarted?.(); setIsOpen(false); }}
                            className="w-full bg-electric-blue py-3 rounded-xl font-semibold"
                        >
                            Get Started
                        </button>
                    </div>
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;
