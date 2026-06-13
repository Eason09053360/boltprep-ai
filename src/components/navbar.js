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
        <nav className="fixed top-0 left-0 right-0 glass-nav px-6 py-4 z-50">
            <div className="max-w-4xl mx-auto flex justify-between items-center group">
                <div className="flex items-center gap-3">
                    <FastFrameLogo />
                    <h1 className="text-2xl font-black tracking-tighter text-slate-800 italic">BOLTPREP <span className="text-blue-600 font-bold not-italic">AI</span></h1>
                </div>
                <div className="flex gap-2 items-center flex-wrap justify-end">
                    {(isExamMode ? quizSet.length > 0 : allQuestions.length > 0) && (
                        <div className="flex items-center gap-1 bg-white border border-amber-200 rounded-xl p-1 shadow-sm">
                            <button
                                onClick={() => setViewMode("all")}
                                className={`px-2 py-1 rounded-lg text-xs font-bold transition ${viewMode === "all" ? "bg-amber-700 text-white" : "text-slate-700 hover:bg-amber-100"}`}
                            >
                                全部
                            </button>
                            <button
                                onClick={() => setViewMode("wrong")}
                                disabled={wrongCount === 0}
                                className={`px-2 py-1 rounded-lg text-xs font-bold transition ${viewMode === "wrong" ? "bg-amber-500 text-white" : "text-slate-700 hover:bg-amber-100"} disabled:opacity-40 disabled:cursor-not-allowed`}
                            >
                                錯題本({wrongCount})
                            </button>
                            <button
                                onClick={() => setViewMode("starred")}
                                disabled={starredCount === 0}
                                className={`px-2 py-1 rounded-lg text-xs font-bold transition ${viewMode === "starred" ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-amber-100"} disabled:opacity-40 disabled:cursor-not-allowed`}
                            >
                                星號題({starredCount})
                            </button>
                        </div>
                    )}
                    {currentQuestionList.length > 0 && (
                        <div className="hidden md:flex items-center gap-2 bg-white border border-amber-200 rounded-xl px-2 py-1 shadow-sm">
                            <input
                                type="number"
                                min="1"
                                max={currentQuestionList.length}
                                value={jumpNumber}
                                onChange={(e) => setJumpNumber(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleJumpToQuestion();
                                }}
                                className="w-20 px-2 py-1 text-sm outline-none bg-amber-100 text-slate-800 border border-amber-300 rounded"
                                placeholder="題號"
                            />
                            <button onClick={handleJumpToQuestion} className="text-xs font-bold text-blue-600 hover:underline">跳轉</button>
                        </div>
                    )}
                    <button
                        onClick={handleResumeProgress}
                        className="px-3 py-2 rounded-xl font-bold transition text-sm border bg-white text-slate-700 border-amber-200 hover:bg-amber-50"
                    >
                        回到上次進度
                    </button>
                    {!isExamMode && allQuestions.length > 0 && (
                        <button onClick={generateExam} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold transition text-sm shadow-lg hover:bg-blue-700">開始測驗</button>
                    )}
                    {isExamMode && (
                        <button onClick={() => setIsExamMode(false)} className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl font-bold border border-rose-100 transition text-sm">離開測驗</button>
                    )}
                    {apiKey && allQuestions.length > 0 && (
                        <button onClick={translateAll} className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold border border-green-300 transition text-sm hover:bg-green-200"><i className="fas fa-language mr-2"></i>翻譯全部</button>
                    )}
                    <button onClick={() => setShowSet(true)} className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center hover:bg-amber-50 transition shadow-sm"><i className="fas fa-bolt text-amber-600"></i></button>
                </div>
            </div>
        </nav>
    );
};
