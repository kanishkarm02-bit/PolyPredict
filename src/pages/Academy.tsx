import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Lock, PlayCircle, Trophy, Target, Calculator, LineChart, Code, Clock, ArrowLeft, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import { ACADEMY_CONTENT } from '../data/academyContent';

const MODULES = [
  {
    id: 1,
    title: 'Prediction Markets 101',
    description: 'Understand the mechanics of binary options, order books, and how real-world events are priced.',
    icon: Target,
    status: 'in-progress',
    duration: '15 min',
    progress: 0,
  },
  {
    id: 2,
    title: 'Expected Value & Edge',
    description: 'Learn to calculate P_fair vs P_mkt. Discover how to identify mispriced events and calculate your mathematical edge.',
    icon: Calculator,
    status: 'locked',
    duration: '25 min',
    progress: 0,
  },
  {
    id: 3,
    title: 'The Kelly Criterion',
    description: 'Master position sizing. Learn why the Conservative Kelly (Fractional Kelly) protects your bankroll from ruin.',
    icon: LineChart,
    status: 'locked',
    duration: '30 min',
    progress: 0,
  },
  {
    id: 4,
    title: 'Automated Execution',
    description: 'Connect to APIs, handle rate limits, and deploy your first High-Frequency Strategic Quant (HFSQ) bot.',
    icon: Code,
    status: 'locked',
    duration: '45 min',
    progress: 0,
  }
];

export default function Academy() {
  const [overallProgress, setOverallProgress] = useState(0);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [completedModules, setCompletedModules] = useState<number[]>([]);

  const handleStartModule = (id: number) => {
    setSelectedModule(id);
    setQuizMode(false);
    setCurrentQuestion(0);
    setScore(0);
    setQuizCompleted(false);
  };

  const handleStartQuiz = () => {
    setQuizMode(true);
  };

  const handleAnswer = (index: number, correctIndex: number) => {
    if (index === correctIndex) {
      setScore(s => s + 1);
    }
    
    if (selectedModule && currentQuestion < ACADEMY_CONTENT[selectedModule].quiz.length - 1) {
      setCurrentQuestion(c => c + 1);
    } else {
      setQuizCompleted(true);
      if (selectedModule && !completedModules.includes(selectedModule)) {
        const newCompleted = [...completedModules, selectedModule];
        setCompletedModules(newCompleted);
        setOverallProgress((newCompleted.length / MODULES.length) * 100);
      }
    }
  };

  const handleBack = () => {
    setSelectedModule(null);
  };

  if (selectedModule) {
    const content = ACADEMY_CONTENT[selectedModule];
    const moduleInfo = MODULES.find(m => m.id === selectedModule);

    if (!content || !moduleInfo) return null;

    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Academy
        </button>

        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-800/60">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <moduleInfo.icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">{moduleInfo.title}</h2>
              <p className="text-slate-400">{moduleInfo.description}</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!quizMode ? (
              <motion.div 
                key="article"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="prose prose-invert prose-indigo max-w-none">
                  <ReactMarkdown>{content.article}</ReactMarkdown>
                </div>
                
                <div className="pt-8 border-t border-slate-800/60 flex justify-end">
                  <button 
                    onClick={handleStartQuiz}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    Take Quiz <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ) : !quizCompleted ? (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center text-sm font-medium text-slate-400">
                  <span>Question {currentQuestion + 1} of {content.quiz.length}</span>
                  <span>Score: {score}</span>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-100">
                    {content.quiz[currentQuestion].question}
                  </h3>

                  <div className="grid gap-3">
                    {content.quiz[currentQuestion].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx, content.quiz[currentQuestion].answerIndex)}
                        className="p-4 text-left rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-indigo-900/30 hover:border-indigo-500/50 transition-all text-slate-300 hover:text-indigo-100"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-12"
              >
                <div className="w-20 h-20 mx-auto bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400">
                  <Trophy className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-100 mb-2">Quiz Completed!</h3>
                  <p className="text-slate-400">You scored {score} out of {content.quiz.length}</p>
                </div>
                <button 
                  onClick={handleBack}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors"
                >
                  Return to Academy
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8 shadow-xl shadow-black/20">
        <div className="space-y-4 flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            Quant Scholar
          </div>
          <h2 className="text-3xl font-bold text-slate-100 tracking-tight">HFSQ Learning Path</h2>
          <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
            Master the mathematics of prediction markets. Progress through the modules to unlock advanced terminal features and automated execution capabilities.
          </p>
        </div>
        <div className="w-full md:w-64 space-y-2">
          <div className="flex justify-between text-xs font-medium text-slate-400 uppercase tracking-wider">
            <span>Course Progress</span>
            <span className="text-indigo-400">{overallProgress}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-indigo-500 rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {MODULES.map((mod, i) => {
          const isCompleted = completedModules.includes(mod.id);
          const isInProgress = !isCompleted && (mod.id === 1 || completedModules.includes(mod.id - 1));
          const isLocked = !isCompleted && !isInProgress;

          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative overflow-hidden rounded-xl border p-6 transition-all duration-300",
                isCompleted ? "bg-slate-900/40 border-slate-800 hover:border-indigo-500/30" :
                isInProgress ? "bg-indigo-950/20 border-indigo-500/30 shadow-[0_0_30px_-10px_rgba(99,102,241,0.15)]" :
                "bg-slate-950/50 border-slate-800/50 opacity-75"
              )}
            >
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                {/* Status Icon */}
                <div className={cn(
                  "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border",
                  isCompleted ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                  isInProgress ? "bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20" :
                  "bg-slate-900 border-slate-800 text-slate-600"
                )}>
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> :
                   isInProgress ? <PlayCircle className="w-6 h-6 fill-current" /> :
                   <Lock className="w-5 h-5" />}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Module {mod.id}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {mod.duration}
                    </span>
                  </div>
                  <h3 className={cn(
                    "text-lg font-bold tracking-tight",
                    isLocked ? "text-slate-500" : "text-slate-100"
                  )}>
                    {mod.title}
                  </h3>
                  <p className={cn(
                    "text-sm leading-relaxed",
                    isLocked ? "text-slate-600" : "text-slate-400"
                  )}>
                    {mod.description}
                  </p>
                </div>

                {/* Action / Progress */}
                <div className="w-full md:w-48 flex-shrink-0">
                  {isInProgress ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-indigo-400">In Progress</span>
                        <span className="text-slate-400">{mod.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${mod.progress}%` }}
                          className="h-full bg-indigo-500 rounded-full"
                        />
                      </div>
                      <button 
                        onClick={() => handleStartModule(mod.id)}
                        className="w-full mt-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                      >
                        Continue
                      </button>
                    </div>
                  ) : isCompleted ? (
                    <button 
                      onClick={() => handleStartModule(mod.id)}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-slate-700"
                    >
                      Review Material
                    </button>
                  ) : (
                    <button disabled className="w-full py-2 bg-slate-950 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-lg border border-slate-800/50 cursor-not-allowed flex items-center justify-center gap-2">
                      <Lock className="w-3.5 h-3.5" /> Locked
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
