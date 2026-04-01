import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Workflow from './components/Workflow';
import Demo from './components/Demo';
import Footer from './components/Footer';
import Scanner from './components/Scanner';
import ResultsDashboard from './components/ResultsDashboard';
import { AnimatePresence, motion } from 'framer-motion';

export type AppState = 'landing' | 'scanning' | 'results';

export interface CandidateResult {
  name: string;
  role: string;
  score: number;
  match: string;
  avatar: string;
  skills: { name: string; match: number }[];
  aiFeedback: string;
  strengths: string[];
  weaknesses: string[];
}

function App() {
  const [state, setState] = useState<AppState>('landing');
  const [jd, setJd] = useState('');
  const [results, setResults] = useState<CandidateResult[]>([]);

  const handleStartScan = () => setState('scanning');
  const handleScanComplete = (scanResults: CandidateResult[]) => {
    setResults(scanResults);
    setState('results');
  };
  const handleReset = () => {
    setState('landing');
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-deep-navy text-white selection:bg-electric-blue/30">
      <Navbar onHome={handleReset} onGetStarted={handleStartScan} />

      <AnimatePresence mode="wait">
        {state === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero onStart={handleStartScan} />
            <Features />
            <Workflow />
            <Demo onGetStarted={handleStartScan} />
          </motion.div>
        )}

        {state === 'scanning' && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="pt-32 pb-20 px-6"
          >
            <Scanner onComplete={handleScanComplete} jd={jd} setJd={setJd} />
          </motion.div>
        )}

        {state === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pt-32 pb-20 px-6"
          >
            <ResultsDashboard onReset={handleReset} results={results} />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default App;
