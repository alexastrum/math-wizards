
import React, { useState, useEffect, useCallback } from 'react';
import { generatePuzzles } from './services/geminiService';
import type { Puzzle, OperatorSymbol } from './types';
import PuzzleBoard from './components/PuzzleBoard';
import OperatorPad from './components/OperatorPad';
import Controls from './components/Controls';

const WizardIcon = () => (
    <span className="text-5xl md:text-6xl" role="img" aria-label="wizard emoji">🧙</span>
);

const App: React.FC = () => {
    const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
    const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
    const [userSolution, setUserSolution] = useState<(OperatorSymbol | null)[]>([null, null]);
    const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean | null } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [shake, setShake] = useState(false);

    const loadPuzzles = useCallback(async () => {
        setIsLoading(true);
        const fetchedPuzzles = await generatePuzzles();
        setPuzzles(fetchedPuzzles);
        setCurrentPuzzleIndex(0);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadPuzzles();
    }, [loadPuzzles]);

    const handleNewPuzzle = useCallback(() => {
        setCurrentPuzzleIndex(prevIndex => (prevIndex + 1) % puzzles.length);
        setUserSolution([null, null]);
        setFeedback(null);
    }, [puzzles.length]);

    const handleDrop = (index: number, operator: OperatorSymbol) => {
        setUserSolution(prev => {
            const newSolution = [...prev];
            newSolution[index] = operator;
            return newSolution;
        });
        setFeedback(null);
    };

    const calculateResult = (numbers: number[], operators: (OperatorSymbol | null)[]): number | null => {
        if (operators.some(op => op === null)) return null;

        let result = numbers[0];
        for (let i = 0; i < operators.length; i++) {
            const operator = operators[i];
            const nextNumber = numbers[i + 1];
            switch (operator) {
                case '+': result += nextNumber; break;
                case '-': result -= nextNumber; break;
                case '×': result *= nextNumber; break;
                case '÷': result /= nextNumber; break;
                default: return null;
            }
        }
        return result;
    };

    const handleCheckAnswer = () => {
        if (isLoading || puzzles.length === 0) return;

        const currentPuzzle = puzzles[currentPuzzleIndex];
        const result = calculateResult(currentPuzzle.numbers, userSolution);
        
        // Using a small tolerance for floating point comparisons
        if (result !== null && Math.abs(result - currentPuzzle.result) < 0.001) {
            setFeedback({ message: 'Correct!', isCorrect: true });
            setTimeout(handleNewPuzzle, 1500);
        } else {
            setFeedback({ message: 'Try Again!', isCorrect: false });
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    };
    
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white text-4xl bg-slate-800" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                <WizardIcon />
                <h1 className="mt-4">Summoning Puzzles...</h1>
            </div>
        );
    }
    
    if (puzzles.length === 0) {
       return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white text-center p-4 bg-slate-800" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                <WizardIcon />
                <h1 className="text-4xl mt-4">Oh no!</h1>
                <p className="text-2xl mt-2">Could not generate any puzzles. Please check your connection or API Key.</p>
                 <button onClick={loadPuzzles} className="mt-8 px-6 py-3 text-2xl text-white font-bold rounded-lg border-2 border-white/80 transition-all duration-300 bg-blue-500/80 hover:bg-blue-500 hover:border-white">
                    Retry
                </button>
            </div>
        );
    }

    const currentPuzzle = puzzles[currentPuzzleIndex];
    const isPuzzleComplete = userSolution.every(op => op !== null);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-white">
            <header className="flex items-center space-x-4 mb-4">
                 <WizardIcon />
                <h1 className="text-5xl md:text-7xl tracking-wider">Math Wizards</h1>
            </header>

            <main className={`bg-black/20 border-4 border-white/60 rounded-3xl p-6 md:p-10 shadow-2xl w-full max-w-4xl transition-transform duration-500 ${shake ? 'animate-shake' : ''}`}>
                <div className={`transition-opacity duration-500 ${feedback ? 'opacity-100' : 'opacity-0'}`}>
                    {feedback && (
                        <div className={`text-center text-4xl mb-4 font-bold ${feedback.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                            {feedback.message}
                        </div>
                    )}
                </div>
                 
                <PuzzleBoard puzzle={currentPuzzle} userSolution={userSolution} onDrop={handleDrop} isCorrect={feedback?.isCorrect ?? null} />
                <p className="text-center text-white/80 text-2xl mt-6">Drag a symbol to a box to solve the puzzle!</p>
                <OperatorPad />
                <Controls onCheck={handleCheckAnswer} onNewPuzzle={handleNewPuzzle} isPuzzleComplete={isPuzzleComplete} />
            </main>
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                    20%, 40%, 60%, 80% { transform: translateX(10px); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default App;
