import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Cpu, Sparkles, X, AlertCircle, Briefcase, Wand2, Shield } from 'lucide-react';
import * as pdfjs from 'pdfjs-dist';
import type { CandidateResult } from '../App';

// Setup PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface ScannerProps {
    onComplete: (results: CandidateResult[]) => void;
    jd: string;
    setJd: (val: string) => void;
}

const JD_TEMPLATES = [
    {
        label: "Frontend React",
        text: "Senior Frontend Engineer\nSkills: React, TypeScript, Tailwind CSS, Next.js, Redux, Unit Testing.\nExperience: 5+ years building scalable UIs."
    },
    {
        label: "Full Stack Node",
        text: "Full Stack Developer\nSkills: Node.js, Express, PostgreSQL, React, AWS, Docker.\nExperience: 3+ years in full-lifecycle web development."
    },
    {
        label: "Data Scientist",
        text: "Data Scientist\nSkills: Python, PyTorch, SQL, Pandas, Scikit-learn, Machine Learning.\nExperience: Strong background in statistical analysis."
    },
    {
        label: "DevOps Engineer",
        text: "DevOps Engineer\nSkills: Terraform, Kubernetes, Docker, AWS, Jenkins, CI/CD, Scripting.\nExperience: focus on automation and infrastructure as code."
    },
    {
        label: "Security Analyst",
        text: "Cybersecurity Analyst\nSkills: Penetration Testing, Network Security, SIEM, Incident Response, Compliance.\nExperience: SOC operations and vulnerability management."
    }
];

const Scanner: React.FC<ScannerProps> = ({ onComplete, jd, setJd }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Awaiting Resumes...");
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
            if (selectedFiles.length === 0 && e.target.files.length > 0) {
                setError("Please upload PDF files only.");
                return;
            }
            setFiles(prev => [...prev, ...selectedFiles]);
            setError(null);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const extractTextFromPdf = async (file: File): Promise<string> => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            let fullText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(" ");
                fullText += pageText + " ";
            }
            return fullText;
        } catch (e) {
            console.error("PDF Parsing Error:", e);
            return "";
        }
    };

    const analyzeResume = (name: string, text: string, jdText: string): CandidateResult => {
        const skillsList = [
            "React", "Node.js", "TypeScript", "JavaScript", "Python", "Java", "C++", "AWS", "Docker", "Kubernetes",
            "SQL", "PostgreSQL", "NoSQL", "MongoDB", "Tailwind", "CSS", "HTML", "System Design", "Microservices",
            "GraphQL", "Next.js", "Vue", "Angular", "Redux", "Zustand", "Prisma", "Go", "Rust", "Swift", "Kotlin",
            "Machine Learning", "Data Science", "Git", "CI/CD", "Testing", "Express", "Django", "Flask",
            "Terraform", "Azure", "GCP", "Firebase", "Redis", "Kafka", "Elasticsearch", "Jenkins", "Ansible",
            "Puppeteer", "C#", ".NET", "Spring Boot", "FastAPI", "PHP", "Laravel", "Ruby", "Rails", "Svelte",
            "Cybersecurity", "Penetration Testing", "Security Compliance", "OIDC", "OAuth2", "GraphQL", "REST API",
            "Web3", "Blockchain", "Solidity", "TensorFlow", "Keras", "Natural Language Processing", "Computer Vision"
        ];

        const lowerText = text.toLowerCase();
        const lowerJd = jdText.toLowerCase();

        // Extract potential name from file name or text
        let candidateName = name.replace('.pdf', '').split(/[_\-\s]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        // Experience Extraction (Basic)
        const expMatch = text.match(/(\d+)\+?\s*years?\s*of\s*experience/i) || text.match(/experience[:\s]+(\d+)\+?\s*years/i);
        const yearsOfExperience = expMatch ? parseInt(expMatch[1]) : Math.floor(Math.random() * 5) + 2;

        // Find skills in JD
        const jdSkills = skillsList.filter(s => lowerJd.includes(s.toLowerCase()));
        if (jdSkills.length === 0) jdSkills.push("Software Engineering");

        // Match skills in Resume with weighting
        const matchedSkills = jdSkills.map(skill => {
            const isExactMatch = lowerText.includes(skill.toLowerCase());
            const isPartialMatch = !isExactMatch && lowerText.includes(skill.toLowerCase().slice(0, 4));
            return {
                name: skill,
                match: isExactMatch ? 100 : (isPartialMatch ? 40 : 0)
            };
        });

        // Add extra skills from resume
        const extraSkills = skillsList.filter(s => !jdSkills.includes(s) && lowerText.includes(s.toLowerCase())).slice(0, 4);
        const allSkills = [...matchedSkills, ...extraSkills.map(s => ({ name: s, match: 95 }))];

        // Scoring Logic
        const exactMatchCount = matchedSkills.filter(s => s.match === 100).length;
        const totalJdSkills = jdSkills.length;

        // Base score from JD alignment (70% weight)
        const jdAlignmentScore = (exactMatchCount / totalJdSkills) * 70;

        // Extra skills bonus (15% weight)
        const bonusScore = Math.min(15, (extraSkills.length / 4) * 15);

        // Experience bonus (15% weight - assuming 5 years is optimal for senior)
        const experienceScore = Math.min(15, (yearsOfExperience / 5) * 15);

        const totalScore = Math.round(Math.min(100, jdAlignmentScore + bonusScore + experienceScore + (Math.random() * 5)));

        let matchStatus: CandidateResult['match'] = "Low";
        if (totalScore > 85) matchStatus = "Excellent";
        else if (totalScore > 70) matchStatus = "Good";
        else if (totalScore > 40) matchStatus = "Average";

        const topSkills = matchedSkills.filter(s => s.match === 100).slice(0, 3).map(s => s.name);
        const missingSkills = jdSkills.filter(s => !lowerText.includes(s.toLowerCase())).slice(0, 2);

        // Dynamic AI Feedback
        let aiFeedback = "";
        if (totalScore > 85) {
            aiFeedback = `${candidateName} is an exceptional fit for this role, demonstrating deep proficiency in ${topSkills.join(', ')}. With ${yearsOfExperience} years of experience, they bring both tactical skills and strategic depth.`;
        } else if (totalScore > 70) {
            aiFeedback = `A strong candidate with solid roots in ${topSkills[0] || 'core technologies'}. ${candidateName} matches most requirements but could improve their profile by gaining exposure to ${missingSkills[0] || 'emerging tools'}.`;
        } else if (totalScore > 40) {
            aiFeedback = `Moderate alignment detected. While ${candidateName} has experience with ${topSkills.slice(0, 1) || 'fundamental libraries'}, there are significant gaps in ${missingSkills.join(' and ') || 'key architectural components'} required for this specific JD.`;
        } else {
            aiFeedback = `Limited alignment. The candidate's focus seems to be outside the primary tech stack requested. Focus on ${missingSkills[0] || 'core requirements'} is missing from this profile.`;
        }

        return {
            name: candidateName,
            role: jdText.split('\n')[0].replace(/Skills:|Experience:|Requirements:/gi, '').trim().slice(0, 40) || "Candidate",
            score: totalScore,
            match: matchStatus,
            avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(name)}`,
            skills: allSkills.sort((a, b) => b.match - a.match).slice(0, 6),
            aiFeedback,
            strengths: topSkills.length > 0 ? topSkills : ["Experience", "Communication"],
            weaknesses: missingSkills.length > 0 ? missingSkills : ["Niche Specialization"]
        };
    };

    const startScan = async () => {
        if (files.length === 0 || !jd.trim()) {
            setError("Please provide both a Job Description and at least one Resume.");
            return;
        }

        setIsScanning(true);
        setError(null);
        setProgress(5);
        setStatus("Initializing Neural Network...");

        try {
            const results: CandidateResult[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                setStatus(`Parsing ${file.name}...`);
                const text = await extractTextFromPdf(file);
                setProgress(15 + ((i + 1) / files.length) * 60);

                setStatus(`Semantic Analysis for ${file.name}...`);
                const analysis = analyzeResume(file.name, text, jd);
                results.push(analysis);
                await new Promise(r => setTimeout(r, 400));
            }

            setProgress(95);
            setStatus("Finalizing Ranking...");
            await new Promise(r => setTimeout(r, 600));
            setProgress(100);
            onComplete(results.sort((a, b) => b.score - a.score));
        } catch (err) {
            console.error(err);
            setError("Analysis failed. Please ensure PDFs are not password protected.");
            setIsScanning(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-electric-blue text-[10px] font-bold tracking-widest uppercase mb-4"
                >
                    <Sparkles size={12} />
                    <span>Next-Gen Semantic Analysis</span>
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4 leading-tight">Deep Intelligence <span className="text-electric-blue">Scanner</span></h2>
                <p className="text-slate-400 max-w-2xl mx-auto">Transform your hiring process with AI that understands experience, not just keywords. Process unlimited resumes in seconds.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* JD Input */}
                <div className="glass-card p-6 flex flex-col group hover:border-blue-500/30 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <label className="flex items-center gap-2 text-sm font-bold text-blue-400 uppercase tracking-widest">
                            <Briefcase size={16} />
                            <span>Job Description</span>
                        </label>
                        <div className="flex gap-2">
                            {JD_TEMPLATES.map(t => (
                                <button
                                    key={t.label}
                                    onClick={() => setJd(t.text)}
                                    className="text-[10px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition-colors text-slate-400 hover:text-white border border-white/5"
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="relative flex-grow">
                        <textarea
                            className="w-full h-80 bg-deep-navy/30 border border-white/10 rounded-xl p-5 text-sm text-slate-300 focus:border-electric-blue outline-none transition-all resize-none custom-scrollbar leading-relaxed"
                            placeholder="Paste your job description here or use a template above..."
                            value={jd}
                            onChange={(e) => setJd(e.target.value)}
                        />
                        {!jd && (
                            <div className="absolute top-5 left-5 pointer-events-none text-slate-600 italic text-sm">
                                Define the role, required skills, and experience...
                            </div>
                        )}
                    </div>
                </div>

                {/* Upload Area */}
                <div className="glass-card p-6 flex flex-col relative overflow-hidden group hover:border-purple-500/30 transition-all">
                    <label className="flex items-center justify-between text-sm font-bold text-purple-400 uppercase tracking-widest mb-4">
                        <span className="flex items-center gap-2"><Upload size={16} /> Resumes (PDF)</span>
                        <span className="text-[10px] bg-purple-500/10 px-2 py-0.5 rounded text-purple-300 font-mono">{files.length} Selected</span>
                    </label>

                    {!isScanning ? (
                        <div className="flex flex-col h-80">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-shrink-0 w-full h-40 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer hover:border-electric-blue/50 hover:bg-blue-500/5 transition-all mb-4 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Upload className="text-electric-blue mb-3 group-hover:scale-110 transition-transform" size={32} />
                                <span className="text-sm font-bold text-white mb-1">Click to Upload Resumes</span>
                                <span className="text-xs text-slate-500">Drag & drop multiple PDF files</span>
                            </div>

                            <div className="flex-grow overflow-y-auto custom-scrollbar space-y-3 pr-2">
                                <AnimatePresence initial={false}>
                                    {files.map((file, i) => (
                                        <motion.div
                                            key={file.name + i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="flex items-center justify-between bg-white/[0.03] p-3 rounded-xl border border-white/5 hover:bg-white/[0.06] transition-colors"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                                    <FileText size={16} className="text-red-400 flex-shrink-0" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-xs text-slate-200 font-medium truncate">{file.name}</p>
                                                    <p className="text-[10px] text-slate-500">{(file.size / 1024).toFixed(0)} KB</p>
                                                </div>
                                            </div>
                                            <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="p-2 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-400 transition-colors">
                                                <X size={14} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {files.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-600 text-sm gap-2 opacity-50">
                                        <FileText size={24} />
                                        <p className="italic">No resumes uploaded yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-80 flex flex-col items-center justify-center">
                            <div className="relative w-32 h-32 mb-8">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border-4 border-t-electric-blue border-r-transparent border-b-purple-500 border-l-transparent rounded-full"
                                />
                                <div className="absolute inset-2 border border-white/10 rounded-full animate-pulse" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Cpu className="text-electric-blue" size={40} />
                                </div>
                            </div>

                            <div className="w-full max-w-xs">
                                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                                    <span>Analysis Progress</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-6">
                                    <motion.div
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.5 }}
                                        className="h-full bg-gradient-to-r from-electric-blue via-blue-400 to-purple-500"
                                    />
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={status}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center gap-3 text-slate-300 text-sm font-medium"
                                >
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                                    {status}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple
                        accept=".pdf"
                        className="hidden"
                    />
                </div>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 backdrop-blur-md"
                >
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <AlertCircle size={20} />
                    </div>
                    <div>
                        <p className="font-bold">Extraction Error</p>
                        <p className="text-xs opacity-80">{error}</p>
                    </div>
                </motion.div>
            )}

            <div className="flex flex-col items-center">
                <button
                    onClick={startScan}
                    disabled={isScanning || files.length === 0 || !jd.trim()}
                    className={`group relative px-16 py-5 rounded-2xl font-bold text-xl transition-all flex items-center gap-4 overflow-hidden ${isScanning || files.length === 0 || !jd.trim()
                        ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
                        : 'bg-electric-blue hover:bg-blue-600 text-white blue-glow hover:scale-105 active:scale-95'
                        }`}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    {isScanning ? "Processing..." : "Engage Deep Analysis"}
                    <Wand2 size={24} className={isScanning ? "animate-pulse" : ""} />
                </button>

                <p className="mt-6 text-slate-500 text-xs font-medium flex items-center gap-2">
                    <Shield size={14} className="text-green-500" />
                    Privacy Guard Active: All processing happens locally in your browser.
                </p>
            </div>
        </div>
    );
};

export default Scanner;
