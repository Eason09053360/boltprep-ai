const { useState, useEffect } = React;
const { DEFAULT_CONFIG, FastFrameLogo, translateQuizData, Navbar, SettingsModal, QuestionCard } = window.BoltPrep;

function App() {
    const [allQuestions, setAllQuestions] = useState([]);
    const [syllabus, setSyllabus] = useState(DEFAULT_CONFIG);
    const [isExamMode, setIsExamMode] = useState(false);
    const [showConfigEditor, setShowConfigEditor] = useState(false);
    const [tempConfigText, setTempConfigText] = useState(JSON.stringify(DEFAULT_CONFIG, null, 4));

    const [quizSet, setQuizSet] = useState([]);
    const [translated, setTranslated] = useState({});
    const [answers, setAnswers] = useState({});
    const [apiKey, setApiKey] = useState(localStorage.getItem("fastframe_key") || "");
    const [showSet, setShowSet] = useState(false);
    const [examResult, setExamResult] = useState(null);
    const [examSize, setExamSize] = useState(65);
    const [jumpNumber, setJumpNumber] = useState("");
    const [viewMode, setViewMode] = useState("all");
    const [practiceWrongQuestionIds, setPracticeWrongQuestionIds] = useState(() => {
        try {
            const saved = localStorage.getItem("boltprep_practice_wrong_questions");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [examWrongQuestionIds, setExamWrongQuestionIds] = useState([]);
    const [wrongBookAnswers, setWrongBookAnswers] = useState({});
    const [openDiscussions, setOpenDiscussions] = useState({});
    const [lastProgress, setLastProgress] = useState(() => {
        try {
            const saved = localStorage.getItem("boltprep_last_progress");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    const [starredQuestions, setStarredQuestions] = useState(() => {
        try {
            const saved = localStorage.getItem("boltprep_starred_questions");
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    useEffect(() => {
        localStorage.setItem("boltprep_starred_questions", JSON.stringify(starredQuestions));
    }, [starredQuestions]);

    useEffect(() => {
        localStorage.setItem("boltprep_last_progress", JSON.stringify(lastProgress));
    }, [lastProgress]);

    useEffect(() => {
        localStorage.setItem("boltprep_practice_wrong_questions", JSON.stringify(practiceWrongQuestionIds));
    }, [practiceWrongQuestionIds]);

    const classifyQuestion = (q) => {
        if (!syllabus) return "Uncategorized";
        const text = (q.question + " " + q.options.join(" ")).toLowerCase();
        for (const [category, config] of Object.entries(syllabus)) {
            const keywords = Array.isArray(config) ? config : config.keywords;
            if (Array.isArray(keywords) && keywords.some((kw) => text.includes(String(kw).toLowerCase()))) {
                return category;
            }
        }
        return "📁 Others / General";
    };

    const normalizeQuestionId = (id) => String(id ?? "");
    const currentWrongQuestionIds = isExamMode ? examWrongQuestionIds : practiceWrongQuestionIds;

    const generateExam = () => {
        if (allQuestions.length < examSize) {
            alert(`題庫不足（目前 ${allQuestions.length} 題）。模擬考需 ${examSize} 題。`);
            return;
        }
        const categorized = {};
        Object.keys(syllabus).forEach((cat) => (categorized[cat] = []));
        categorized["📁 Others / General"] = [];

        allQuestions.forEach((q) => {
            const cat = classifyQuestion(q);
            categorized[cat].push(q);
        });

        let newQuiz = [];
        Object.entries(syllabus).forEach(([cat, config]) => {
            const weight = config.weight || 1 / Object.keys(syllabus).length;
            const count = Math.round(examSize * weight);
            const shuffled = categorized[cat].sort(() => 0.5 - Math.random());
            newQuiz.push(...shuffled.slice(0, count));
        });

        if (newQuiz.length < examSize) {
            const remain = examSize - newQuiz.length;
            const pickedIds = new Set(newQuiz.map((item) => item.question_id));
            const othersPool = categorized["📁 Others / General"].filter((item) => !pickedIds.has(item.question_id));
            newQuiz.push(...othersPool.sort(() => 0.5 - Math.random()).slice(0, remain));
        }

        setQuizSet(newQuiz.slice(0, examSize).sort(() => 0.5 - Math.random()));
        setIsExamMode(true);
        setAnswers({});
        setExamResult(null);
        setViewMode("all");
        setExamWrongQuestionIds([]);
        setWrongBookAnswers({});
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const getQuestionListByMode = (mode) => {
        const base = isExamMode ? quizSet : allQuestions;
        if (mode === "wrong") {
            const wrongIdSet = new Set(currentWrongQuestionIds.map(normalizeQuestionId));
            return base.filter((q) => wrongIdSet.has(normalizeQuestionId(q.question_id)));
        }
        if (mode === "starred") return base.filter((q) => starredQuestions[q.question_id]);
        return base;
    };

    const getCurrentQuestionList = () => {
        return getQuestionListByMode(viewMode);
    };

    const saveProgressAt = (questionNumber, sourceMode = viewMode) => {
        setLastProgress({
            isExamMode,
            viewMode: sourceMode,
            questionNumber,
            updatedAt: Date.now()
        });
    };

    const handleJumpToQuestion = () => {
        const list = getCurrentQuestionList();
        const target = Number.parseInt(jumpNumber, 10);

        if (!Number.isInteger(target) || target < 1 || target > list.length) {
            alert(`請輸入 1 到 ${list.length} 的題號`);
            return;
        }

        const node = document.getElementById(`question-card-${target}`);
        if (!node) {
            alert("找不到該題，請重新整理後再試。");
            return;
        }

        node.scrollIntoView({ behavior: "smooth", block: "start" });
        saveProgressAt(target);
    };

    const handleResumeProgress = () => {
        if (!lastProgress || !Number.isInteger(lastProgress.questionNumber)) {
            alert("目前沒有可恢復的進度。");
            return;
        }

        if (lastProgress.isExamMode !== isExamMode) {
            alert(`上次進度在${lastProgress.isExamMode ? "測驗模式" : "題庫模式"}，請先切換模式後再恢復。`);
            return;
        }

        const targetList = getQuestionListByMode(lastProgress.viewMode);
        if (targetList.length === 0) {
            alert("上次所在視圖目前沒有題目可顯示。");
            return;
        }

        const targetNumber = Math.min(lastProgress.questionNumber, targetList.length);
        setViewMode(lastProgress.viewMode);
        setJumpNumber(String(targetNumber));

        setTimeout(() => {
            const node = document.getElementById(`question-card-${targetNumber}`);
            if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
    };

    const toggleStar = (questionId) => {
        setStarredQuestions((prev) => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    };

    const toggleDiscussion = (questionId) => {
        setOpenDiscussions((prev) => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    };

    const addPracticeWrongQuestion = (questionId) => {
        const normalizedId = normalizeQuestionId(questionId);
        setPracticeWrongQuestionIds((prev) => {
            const set = new Set(prev.map(normalizeQuestionId));
            set.add(normalizedId);
            return Array.from(set);
        });
    };

    const removeFromWrongBook = (questionId) => {
        const normalizedId = normalizeQuestionId(questionId);
        if (isExamMode) {
            setExamWrongQuestionIds((prev) => prev.filter((id) => normalizeQuestionId(id) !== normalizedId));
        } else {
            setPracticeWrongQuestionIds((prev) => prev.filter((id) => normalizeQuestionId(id) !== normalizedId));
        }

        setWrongBookAnswers((prev) => {
            const next = { ...prev };
            delete next[normalizedId];
            return next;
        });
    };

    const handleAnswerSelect = (q, char, inWrongBookView) => {
        const normalizedId = normalizeQuestionId(q.question_id);

        if (inWrongBookView) {
            setWrongBookAnswers((prev) => ({
                ...prev,
                [normalizedId]: char
            }));
            return;
        }

        setAnswers((prev) => ({ ...prev, [q.question_id]: char }));

        if (!isExamMode && char !== q.suggested_answer) {
            addPracticeWrongQuestion(q.question_id);
        }
    };

    const currentQuestionList = getCurrentQuestionList();
    const wrongCount = getQuestionListByMode("wrong").length;
    const starredCount = getQuestionListByMode("starred").length;

    useEffect(() => {
        if (!isExamMode || quizSet.length === 0) return;

        const liveWrongIds = quizSet
            .filter((q) => {
                const picked = answers[q.question_id];
                return picked !== undefined && picked !== q.suggested_answer;
            })
            .map((q) => normalizeQuestionId(q.question_id));

        setExamWrongQuestionIds((prev) => {
            const prevJoined = prev.join("|");
            const nextJoined = liveWrongIds.join("|");
            return prevJoined === nextJoined ? prev : liveWrongIds;
        });
    }, [answers, isExamMode, quizSet]);

    useEffect(() => {
        if (viewMode !== "wrong") return;
        setWrongBookAnswers({});
    }, [viewMode, isExamMode]);

    useEffect(() => {
        if (currentQuestionList.length === 0) return;

        const trackProgress = () => {
            let bestIndex = 1;
            let bestDistance = Number.POSITIVE_INFINITY;
            for (let i = 1; i <= currentQuestionList.length; i++) {
                const node = document.getElementById(`question-card-${i}`);
                if (!node) continue;
                const distance = Math.abs(node.getBoundingClientRect().top - 120);
                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestIndex = i;
                }
            }

            setLastProgress((prev) => {
                if (
                    prev &&
                    prev.isExamMode === isExamMode &&
                    prev.viewMode === viewMode &&
                    prev.questionNumber === bestIndex
                ) {
                    return prev;
                }

                return {
                    isExamMode,
                    viewMode,
                    questionNumber: bestIndex,
                    updatedAt: Date.now()
                };
            });
        };

        trackProgress();
        window.addEventListener("scroll", trackProgress, { passive: true });
        return () => window.removeEventListener("scroll", trackProgress);
    }, [currentQuestionList.length, isExamMode, viewMode]);

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <Navbar
                FastFrameLogo={FastFrameLogo}
                isExamMode={isExamMode}
                quizSet={quizSet}
                allQuestions={allQuestions}
                viewMode={viewMode}
                setViewMode={setViewMode}
                wrongCount={wrongCount}
                starredCount={starredCount}
                currentQuestionList={currentQuestionList}
                jumpNumber={jumpNumber}
                setJumpNumber={setJumpNumber}
                handleJumpToQuestion={handleJumpToQuestion}
                handleResumeProgress={handleResumeProgress}
                generateExam={generateExam}
                setIsExamMode={setIsExamMode}
                setShowSet={setShowSet}
            />

            <div className="mt-20">
                {lastProgress && Number.isInteger(lastProgress.questionNumber) && (
                    <div className="mb-4 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-600 flex items-center justify-between">
                        <span>
                            已記錄進度：{lastProgress.isExamMode ? "測驗模式" : "題庫模式"} / {lastProgress.viewMode === "all" ? "全部" : (lastProgress.viewMode === "wrong" ? "錯題本" : "星號題")} / 第 {lastProgress.questionNumber} 題
                        </span>
                        <button onClick={handleResumeProgress} className="text-blue-600 font-bold hover:underline">立即返回</button>
                    </div>
                )}
                {showConfigEditor && (
                    <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col animate-fade-in">
                        <header className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                            <div className="flex items-center gap-3">
                                <div className="scale-75"><FastFrameLogo /></div>
                                <h2 className="text-white text-xl font-bold">BoltPrep 配置工作站</h2>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowConfigEditor(false)} className="text-slate-400 px-4 py-2 hover:text-white transition font-bold">取消</button>
                                <button onClick={() => { setSyllabus(JSON.parse(tempConfigText)); setShowConfigEditor(false); }} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-500 transition active:scale-95">套用並存檔</button>
                            </div>
                        </header>
                        <main className="flex-1 flex overflow-hidden">
                            <div className="flex-1 p-6">
                                <textarea
                                    value={tempConfigText}
                                    onChange={(e) => setTempConfigText(e.target.value)}
                                    className="w-full h-full editor-bg p-6 rounded-xl outline-none resize-none text-sm leading-relaxed"
                                    spellCheck="false"
                                />
                            </div>
                            <aside className="w-96 bg-slate-800 p-8 text-slate-300 overflow-y-auto border-l border-slate-700">
                                <div className="mb-8">
                                    <div className="bg-blue-900/40 border border-blue-500/50 p-5 rounded-xl">
                                        <h4 className="text-blue-400 font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <i className="fas fa-info-circle"></i> 當前範例說明
                                        </h4>
                                        <p className="text-sm leading-relaxed text-slate-200">
                                            本框架目前預載之配置是以 <span className="font-bold text-white underline decoration-blue-500">AWS CLF-C02 (Cloud Practitioner)</span> 考照為範例進行設定。
                                        </p>
                                    </div>
                                </div>

                                <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">配置指南</h3>
                                <div className="space-y-6 text-sm">
                                    <div>
                                        <p className="text-emerald-400 font-bold mb-1">Weight (權重/佔比)</p>
                                        <p className="text-slate-400 leading-snug">定義該類別在總題數中佔的比例。0.24 代表約 16 題。</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-400 font-bold mb-1">Keywords (分類關鍵字)</p>
                                        <p className="text-slate-400 leading-snug">系統會掃描題目，包含其中關鍵字即自動歸入該考綱分類。</p>
                                        <p className="text-slate-500 leading-snug mt-2">若題目被歸類到 Others，代表您的關鍵字覆蓋率不足，請至左側編輯區補充關鍵字。</p>
                                    </div>
                                </div>
                            </aside>
                        </main>
                    </div>
                )}

                <SettingsModal
                    showSet={showSet}
                    apiKey={apiKey}
                    setApiKey={setApiKey}
                    examSize={examSize}
                    setExamSize={setExamSize}
                    setShowSet={setShowSet}
                />

                {!isExamMode && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 animate-fade-in">
                        <div className="bg-white p-7 rounded-[2rem] border border-slate-200 shadow-sm relative group overflow-hidden hover:border-blue-300 transition-all cursor-pointer">
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${allQuestions.length > 0 ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400"}`}>
                                    <i className="fas fa-file-import text-2xl"></i>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">1. 資料來源</p>
                                    <p className="font-bold text-lg">{allQuestions.length > 0 ? `已載入 ${allQuestions.length} 題` : "上傳題庫 JSON"}</p>
                                </div>
                            </div>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" accept=".json" onChange={(e) => {
                                const reader = new FileReader();
                                reader.onload = (ev) => setAllQuestions(JSON.parse(ev.target.result));
                                reader.readAsText(e.target.files[0]);
                            }} />
                        </div>

                        <div onClick={() => setShowConfigEditor(true)} className="bg-white p-7 rounded-[2rem] border border-slate-200 shadow-sm hover:border-emerald-500 transition-all cursor-pointer group">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    <FastFrameLogo />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">2. 考綱設定</p>
                                    <p className="font-bold text-lg">進入配置工作站</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-8">
                    {examResult && isExamMode && (
                        <div className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-blue-50 animate-fade-in relative">
                            <div className="absolute top-8 right-8 scale-50 opacity-10"><FastFrameLogo /></div>
                            <h3 className="text-lg font-black mb-6 flex items-center gap-2"><i className="fas fa-chart-pie text-blue-600"></i> 能力衝刺評估</h3>
                            <div className="grid gap-4 relative z-10">
                                {Object.entries(examResult).map(([cat, stat]) => {
                                    const score = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                                    return (
                                        <div key={cat}>
                                            <div className="flex justify-between text-xs font-bold mb-1 uppercase text-slate-500">
                                                <span>{cat}</span> <span>{score}% ({stat.correct}/{stat.total})</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                <div className={`h-full transition-all duration-1000 ${score < 70 ? "bg-rose-400" : "bg-emerald-400"}`} style={{ width: `${score}%` }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {currentQuestionList.map((q, idx) => (
                        <QuestionCard
                            key={idx}
                            q={q}
                            idx={idx}
                            isExamMode={isExamMode}
                            viewMode={viewMode}
                            translated={translated}
                            answers={answers}
                            wrongBookAnswers={wrongBookAnswers}
                            starredQuestions={starredQuestions}
                            openDiscussions={openDiscussions}
                            classifyQuestion={classifyQuestion}
                            normalizeQuestionId={normalizeQuestionId}
                            toggleStar={toggleStar}
                            translateQuizData={translateQuizData}
                            apiKey={apiKey}
                            setTranslated={setTranslated}
                            handleAnswerSelect={handleAnswerSelect}
                            removeFromWrongBook={removeFromWrongBook}
                            setWrongBookAnswers={setWrongBookAnswers}
                            toggleDiscussion={toggleDiscussion}
                        />
                    ))}

                    {isExamMode && !examResult && quizSet.length > 0 && (
                        <button onClick={() => {
                            const stats = {};
                            const wrongIds = [];
                            Object.keys(syllabus).forEach((cat) => (stats[cat] = { total: 0, correct: 0 }));
                            stats["📁 Others / General"] = { total: 0, correct: 0 };
                            quizSet.forEach((q) => {
                                const cat = classifyQuestion(q);
                                if (stats[cat]) {
                                    stats[cat].total++;
                                    if (answers[q.question_id] === q.suggested_answer) stats[cat].correct++;
                                    else wrongIds.push(normalizeQuestionId(q.question_id));
                                }
                            });
                            setExamResult(stats);
                            setExamWrongQuestionIds(wrongIds);
                            setViewMode("all");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }} className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl hover:scale-[1.02] transition active:scale-95 mb-20">交卷並生成報告</button>
                    )}
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
