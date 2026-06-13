window.BoltPrep = window.BoltPrep || {};

window.BoltPrep.Navbar = function Navbar({
    FastFrameLogo,
    isExamMode,
    quizSet,
    allQuestions,
    viewMode,
    setViewMode,
    wrongCount,
    starredCount,
    currentQuestionList,
    jumpNumber,
    setJumpNumber,
    handleJumpToQuestion,
    handleResumeProgress,
    generateExam,
    setIsExamMode,
    setShowSet,
    apiKey,
    translateAll
}) {
    return (
        <nav className="fixed top-0 left-0 right-0 glass-nav px-3 py-2 z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center group">
                <div className="flex items-center gap-2">
                    <div className="scale-75"><FastFrameLogo /></div>
                    <h1 className="text-xl font-black tracking-tighter text-slate-100 italic">BOLTPREP <span className="text-blue-400 font-bold not-italic">AI</span></h1>
                </div>
                <div className="flex gap-2 items-center flex-wrap justify-end">
                    {(isExamMode ? quizSet.length > 0 : allQuestions.length > 0) && (
                        <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-xl p-1 shadow-sm">
                            <button
                                onClick={() => setViewMode("all")}
                                className={`px-2 py-1 rounded-lg text-xs font-bold transition ${viewMode === "all" ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"}`}
                            >
                                全部
                            </button>
                            <button
                                onClick={() => setViewMode("wrong")}
                                disabled={wrongCount === 0}
                                className={`px-2 py-1 rounded-lg text-xs font-bold transition ${viewMode === "wrong" ? "bg-amber-600 text-white" : "text-slate-300 hover:bg-slate-800"} disabled:opacity-40 disabled:cursor-not-allowed`}
                            >
                                錯題本({wrongCount})
                            </button>
                            <button
                                onClick={() => setViewMode("starred")}
                                disabled={starredCount === 0}
                                className={`px-2 py-1 rounded-lg text-xs font-bold transition ${viewMode === "starred" ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"} disabled:opacity-40 disabled:cursor-not-allowed`}
                            >
                                星號題({starredCount})
                            </button>
                        </div>
                    )}
                    {currentQuestionList.length > 0 && (
                        <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-2 py-1 shadow-sm">
                            <input
                                type="number"
                                min="1"
                                max={currentQuestionList.length}
                                value={jumpNumber}
                                onChange={(e) => setJumpNumber(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleJumpToQuestion();
                                }}
                                className="w-20 px-2 py-1 text-sm outline-none bg-slate-900 text-slate-200"
                                placeholder="題號"
                            />
                            <button onClick={handleJumpToQuestion} className="text-xs font-bold text-blue-600 hover:underline">跳轉</button>
                        </div>
                    )}
                    <button
                        onClick={handleResumeProgress}
                        className="px-3 py-1.5 rounded-xl font-bold transition text-sm border bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800"
                    >
                        回到上次進度
                    </button>
                    {!isExamMode && allQuestions.length > 0 && (
                        <button onClick={generateExam} className="bg-blue-600 text-white px-4 py-1.5 rounded-xl font-bold transition text-sm shadow-lg hover:bg-blue-700">開始測驗</button>
                    )}
                    {isExamMode && (
                        <button onClick={() => setIsExamMode(false)} className="bg-rose-950 text-rose-300 px-4 py-1.5 rounded-xl font-bold border border-rose-800 transition text-sm">離開測驗</button>
                    )}
                    {apiKey && allQuestions.length > 0 && (
                        <button onClick={translateAll} className="bg-emerald-950 text-emerald-300 px-4 py-1.5 rounded-xl font-bold border border-emerald-800 transition text-sm hover:bg-emerald-900"><i className="fas fa-language mr-2"></i>翻譯全部</button>
                    )}
                    <button onClick={() => setShowSet(true)} className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition shadow-sm"><i className="fas fa-bolt text-slate-400"></i></button>
                </div>
            </div>
        </nav>
    );
};
