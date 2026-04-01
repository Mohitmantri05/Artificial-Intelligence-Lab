import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Award, Brain, Target, ArrowLeft, Sparkles, Download, Users, LayoutGrid, List, FileText } from 'lucide-react';
import type { CandidateResult } from '../App';

interface ResultsDashboardProps {
    onReset: () => void;
    results: CandidateResult[];
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ onReset, results }) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [compareIds, setCompareIds] = useState<number[]>([]);
    const [showComparison, setShowComparison] = useState(false);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'info' } | null>(null);

    const showToast = (message: string, type: 'success' | 'info' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const downloadReport = () => {
        const header = "Name,Score,Match,Role,AI Feedback\n";
        const rows = results.map(r => `"${r.name}",${r.score}%,${r.match},"${r.role}","${r.aiFeedback.replace(/"/g, '""')}"`).join("\n");
        const blob = new Blob([header + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AI_Screening_Report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const toggleCompare = (index: number) => {
        setCompareIds(prev =>
            prev.includes(index) ? prev.filter(id => id !== index) :
                prev.length < 2 ? [...prev, index] : [prev[1], index]
        );
    };

    const downloadFullReport = (candidate: CandidateResult) => {
        const content = `
AI SCREENING REPORT - ${candidate.name}
Role: ${candidate.role}
Date: ${new Date().toLocaleDateString()}
------------------------------------------
OVERALL SCORE: ${candidate.score}%
MATCH STATUS: ${candidate.match}

AI FEEDBACK:
${candidate.aiFeedback}

CORE STRENGTHS:
${candidate.strengths.map(s => `- ${s}`).join('\n')}

IDENTIFIED GAPS:
${candidate.weaknesses.map(w => `- ${w}`).join('\n')}

SKILL PROFICIENCY:
${candidate.skills.map(s => `- ${s.name}: ${s.match}%`).join('\n')}

RECRUITER NOTES:
__________________________________________
__________________________________________
`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Report_${candidate.name.replace(/\s+/g, '_')}.txt`;
        a.click();
        showToast(`Report downloaded for ${candidate.name}`);
    };

    const generateInterviewGuide = (ids: number[]) => {
        const candidates = ids.map(id => results[id]);
        let guide = `INTERVIEW PREPARATION GUIDE\n`;
        guide += `Candidates: ${candidates.map(c => c.name).join(' vs ')}\n`;
        guide += `------------------------------------------\n\n`;

        candidates.forEach(c => {
            guide += `CANDIDATE: ${c.name}\n`;
            guide += `Target Role: ${c.role}\n`;
            guide += `Focus Areas:\n`;
            c.weaknesses.forEach(w => {
                guide += `- Technical Deep-dive: ${w}\n`;
                guide += `  * Recommended Question: "Can you walk us through a complex project where you had to manage ${w}?"\n`;
                guide += `  * Assessment Goal: Verify depth vs breadth in ${w}.\n`;
            });
            guide += `\n`;
        });

        const blob = new Blob([guide], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Interview_Guide_${new Date().getTime()}.txt`;
        a.click();
        showToast("Interview guide generated successfully!");
    };

    if (results.length === 0) {
        return (
            <div className="text-center py-32 glass-card max-w-2xl mx-auto">
                <AlertCircle size={48} className="text-slate-600 mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4">No Candidates Found</h2>
                <p className="text-slate-400 mb-8">We couldn't extract enough data from the uploaded files. Please try again with different resumes.</p>
                <button onClick={onReset} className="px-8 py-3 bg-electric-blue rounded-xl font-bold">Try Again</button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: '-50%' }}
                        animate={{ opacity: 1, y: 20, x: '-50%' }}
                        exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
                        className={`fixed top-4 left-1/2 z-[200] px-6 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-3 min-w-[320px] ${notification.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                            }`}
                    >
                        <CheckCircle2 size={20} />
                        <span className="text-sm font-bold">{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold tracking-widest uppercase mb-4">
                        <CheckCircle2 size={12} />
                        <span>Analysis Complete</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-2">Shortlist Results</h2>
                    <p className="text-slate-400 flex items-center gap-2">
                        <Users size={16} />
                        Found <span className="text-white font-bold">{results.length}</span> candidates matching your criteria.
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-electric-blue text-white' : 'text-slate-500'}`}
                        >
                            <List size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-electric-blue text-white' : 'text-slate-500'}`}
                        >
                            <LayoutGrid size={20} />
                        </button>
                    </div>

                    <button
                        onClick={downloadReport}
                        className="flex-grow lg:flex-grow-0 flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all font-bold text-sm"
                    >
                        <Download size={18} /> Export Data
                    </button>
                    <button
                        onClick={onReset}
                        className="flex-grow lg:flex-grow-0 flex items-center justify-center gap-2 px-6 py-3 bg-electric-blue border border-electric-blue/20 rounded-xl hover:bg-blue-600 transition-all font-bold text-sm shadow-[0_0_20px_rgba(0,112,243,0.3)]"
                    >
                        <ArrowLeft size={18} /> Reset
                    </button>
                </div>
            </div>

            {/* Comparison Bar (Sticky) */}
            <AnimatePresence>
                {compareIds.length > 0 && !showComparison && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 glass-card px-8 py-4 border-electric-blue/30 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center gap-8 min-w-[400px]"
                    >
                        <div className="flex -space-x-3">
                            {compareIds.map(id => (
                                <img key={id} src={results[id].avatar} className="w-10 h-10 rounded-full border-2 border-deep-navy shadow-lg" alt="" />
                            ))}
                        </div>
                        <div className="flex-grow text-sm">
                            <span className="font-bold text-blue-400">{compareIds.length}</span> Candidate{compareIds.length > 1 ? 's' : ''} selected
                            <p className="text-[10px] text-slate-500">Compare strengths & weaknesses side-by-side</p>
                        </div>
                        <button
                            disabled={compareIds.length < 2}
                            onClick={() => setShowComparison(true)}
                            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${compareIds.length === 2 ? 'bg-electric-blue text-white cursor-pointer hover:blue-glow' : 'bg-white/5 text-slate-600 cursor-not-allowed'}`}
                        >
                            Compare Now
                        </button>
                        <button onClick={() => setCompareIds([])} className="text-slate-500 hover:text-white ml-2"><X size={18} /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Comparison Modal */}
            <AnimatePresence>
                {showComparison && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-deep-navy/90 backdrop-blur-xl"
                            onClick={() => setShowComparison(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-5xl glass-card border-white/20 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                                <h3 className="text-2xl font-bold flex items-center gap-3">
                                    <Target className="text-electric-blue" />
                                    Candidate Comparison Analysis
                                </h3>
                                <button onClick={() => setShowComparison(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                                <div className="grid grid-cols-2 gap-8">
                                    {compareIds.map(id => {
                                        const c = results[id];
                                        return (
                                            <div key={id} className="space-y-8">
                                                <div className="flex flex-col items-center text-center">
                                                    <img src={c.avatar} className="w-24 h-24 rounded-3xl border-2 border-electric-blue/50 mb-4" alt="" />
                                                    <h4 className="text-2xl font-bold text-white">{c.name}</h4>
                                                    <p className="text-slate-500 text-sm mb-4">{c.role}</p>
                                                    <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${c.score >= 85 ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                        c.score >= 70 ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                        }`}>
                                                        {c.score}% Match Score
                                                    </div>
                                                </div>

                                                <div className="glass-card p-6 border-white/5 bg-white/[0.02]">
                                                    <p className="text-sm text-slate-300 italic leading-relaxed">"{c.aiFeedback}"</p>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase tracking-widest">
                                                        <Award size={14} /> Key Strengths
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {c.strengths.map((s, i) => (
                                                            <span key={i} className="text-[10px] bg-green-500/10 text-green-500 px-3 py-1 rounded-lg border border-green-500/20">{s}</span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                                                        <AlertCircle size={14} /> Gap Analysis
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {c.weaknesses.map((w, i) => (
                                                            <span key={i} className="text-[10px] bg-amber-500/10 text-amber-500 px-3 py-1 rounded-lg border border-amber-500/20">{w}</span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                                                        <Sparkles size={14} /> Skills Mapping
                                                    </div>
                                                    <div className="space-y-3">
                                                        {c.skills.map((skill, i) => (
                                                            <div key={i}>
                                                                <div className="flex justify-between text-[10px] mb-1">
                                                                    <span className="text-slate-400">{skill.name}</span>
                                                                    <span className="text-slate-600 font-bold">{skill.match}%</span>
                                                                </div>
                                                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                                    <div className={`h-full ${skill.match === 100 ? 'bg-electric-blue' : 'bg-slate-700'}`} style={{ width: `${skill.match}%` }} />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/10 flex justify-end gap-4 bg-white/[0.02]">
                                <button onClick={() => setShowComparison(false)} className="px-6 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors">Close Analysis</button>
                                <button
                                    onClick={() => generateInterviewGuide(compareIds)}
                                    className="px-8 py-2 bg-electric-blue rounded-xl text-sm font-bold blue-glow"
                                >
                                    Prepare Interview Guide
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className={viewMode === 'list' ? 'space-y-6' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'}>
                {results.map((candidate, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`glass-card group relative ${viewMode === 'list' ? 'overflow-hidden border-l-4' : 'flex flex-col'} ${candidate.score >= 85 ? 'border-l-green-500 border-green-500/10' :
                            candidate.score >= 70 ? 'border-l-blue-500 border-blue-500/10' :
                                candidate.score >= 40 ? 'border-l-amber-500 border-amber-500/10' : 'border-l-red-500 border-red-500/10'
                            }`}
                    >
                        <div
                            className={`p-6 cursor-pointer ${viewMode === 'list' ? 'flex flex-col sm:flex-row items-center justify-between gap-6' : 'text-center'}`}
                            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                        >
                            <div className={`flex items-center gap-6 ${viewMode === 'grid' ? 'flex-col mb-4' : ''}`}>
                                <div className="relative">
                                    <img src={candidate.avatar} alt="" className="w-16 h-16 rounded-2xl border-2 border-white/10 bg-deep-navy object-cover" />
                                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] border-2 border-deep-navy ${candidate.score >= 85 ? 'bg-green-500 text-white' :
                                        candidate.score >= 70 ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'
                                        }`}>
                                        {candidate.score}
                                    </div>
                                </div>
                                <div className={viewMode === 'grid' ? 'text-center' : 'text-left'}>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-electric-blue transition-colors">{candidate.name}</h3>
                                    <p className="text-sm text-slate-500 font-medium truncate max-w-[200px]">{candidate.role}</p>
                                </div>
                            </div>

                            <div className={`flex items-center gap-8 ${viewMode === 'grid' ? 'w-full justify-center mt-4 border-t border-white/5 pt-4' : ''}`}>
                                <div className="text-center hidden sm:block">
                                    <div className={`text-sm font-bold uppercase tracking-widest mb-1 ${candidate.score >= 85 ? 'text-green-500' :
                                        candidate.score >= 70 ? 'text-blue-500' : 'text-amber-500'
                                        }`}>
                                        {candidate.match} Match
                                    </div>
                                    <div className="h-1 w-20 bg-white/5 rounded-full overflow-hidden mx-auto">
                                        <div className={`h-full ${candidate.score >= 85 ? 'bg-green-500' :
                                            candidate.score >= 70 ? 'bg-blue-500' : 'bg-amber-500'
                                            }`} style={{ width: `${candidate.score}%` }} />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleCompare(index); }}
                                        className={`p-2 rounded-lg border transition-all ${compareIds.includes(index) ? 'bg-electric-blue border-electric-blue text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'}`}
                                        title="Compare Candidate"
                                    >
                                        <Users size={18} />
                                    </button>
                                    <div className="p-2 text-slate-600">
                                        {expandedIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {(expandedIndex === index || viewMode === 'grid') && (
                                <motion.div
                                    initial={viewMode === 'list' ? { height: 0, opacity: 0 } : { opacity: 1 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={viewMode === 'list' ? { height: 0, opacity: 0 } : { opacity: 1 }}
                                    className={`border-t border-white/5 bg-white/[0.01] ${viewMode === 'list' ? 'p-8' : 'p-6 pt-0'}`}
                                >
                                    <div className={`grid ${viewMode === 'list' ? 'md:grid-cols-2 lg:grid-cols-3 gap-12' : 'grid-cols-1 gap-6'}`}>
                                        <div className={viewMode === 'list' ? 'lg:col-span-2' : ''}>
                                            <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-tighter text-[10px] mb-4">
                                                <Brain size={12} /> AI Insight Feedback
                                            </div>
                                            <p className="text-sm text-slate-300 leading-relaxed italic mb-6 border-l-2 border-blue-500/20 pl-4 py-2 bg-blue-500/5 rounded-r-xl">
                                                "{candidate.aiFeedback}"
                                            </p>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                                    <div className="flex items-center gap-2 text-green-500 text-[10px] font-bold mb-3 uppercase tracking-widest">
                                                        <Award size={12} /> Strengths
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {candidate.strengths.map((s, i) => (
                                                            <span key={i} className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded border border-green-500/20">{s}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                                    <div className="flex items-center gap-2 text-amber-500 text-[10px] font-bold mb-3 uppercase tracking-widest">
                                                        <Target size={12} /> Gaps
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {candidate.weaknesses.map((w, i) => (
                                                            <span key={i} className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20">{w}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={viewMode === 'grid' ? 'mt-4' : ''}>
                                            <div className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-tighter text-[10px] mb-4">
                                                <Sparkles size={12} /> Skill Proficiency
                                            </div>
                                            <div className="space-y-3">
                                                {candidate.skills.map((skill, i) => (
                                                    <div key={i}>
                                                        <div className="flex justify-between text-[10px] mb-1">
                                                            <span className="text-slate-400">{skill.name}</span>
                                                            <span className="text-slate-600 font-bold">{skill.match}%</span>
                                                        </div>
                                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${skill.match}%` }}
                                                                transition={{ duration: 1, delay: 0.2 }}
                                                                className={`h-full ${skill.match === 100 ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-slate-700'}`}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-6 flex flex-col gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); downloadFullReport(candidate); }}
                                                    className="w-full bg-white/5 hover:bg-white/10 py-2.5 rounded-lg font-bold text-xs transition-all border border-white/5 flex items-center justify-center gap-2"
                                                >
                                                    <FileText size={14} /> Full AI Report
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); showToast(`Interview invitation sent to ${candidate.name}`); }}
                                                    className="w-full bg-electric-blue hover:bg-blue-600 py-2.5 rounded-lg font-bold text-xs transition-all blue-glow"
                                                >
                                                    Interview Candidate
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const X = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>
);

export default ResultsDashboard;
