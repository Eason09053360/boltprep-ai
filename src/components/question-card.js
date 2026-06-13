window.BoltPrep = window.BoltPrep || {};

window.BoltPrep.QuestionCard = function QuestionCard({
    q,
    idx,
    isExamMode,
    viewMode,
    translated,
    answers,
    wrongBookAnswers,
    starredQuestions,
    openDiscussions,
    classifyQuestion,
    normalizeQuestionId,
    toggleStar,
    translateQuizData,
    apiKey,
    setTranslated,
    handleAnswerSelect,
    removeFromWrongBook,
    setWrongBookAnswers,
    toggleDiscussion
}) {
    const normalizedId = normalizeQuestionId(q.question_id);
    const t = translated[q.question_id];
    const inWrongBookView = viewMode === "wrong";
    const selectedAnswer = inWrongBookView ? wrongBookAnswers[normalizedId] : answers[q.question_id];
    const isAns = selectedAnswer !== undefined;
    const isStarred = !!starredQuestions[q.question_id];
    const discussions = Array.isArray(q.discussions) ? q.discussions : [];
    const translatedDiscussions = t && Array.isArray(t.discussions) ? t.discussions : [];
    const canShowDiscussion = discussions.length > 0 && (!isExamMode || isAns);
    const discussionOpen = !!openDiscussions[q.question_id];
    const retakeCorrect = inWrongBookView && selectedAnswer === q.suggested_answer;

    return (
        <div id={`question-card-${idx + 1}`} className="bg-slate-900 rounded-xl border border-slate-700 shadow-sm overflow-hidden hover:border-blue-500 transition-all duration-500">
            <div className="px-5 py-2 bg-slate-800/70 border-b border-slate-700 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>{isExamMode ? `Quiz Q${idx + 1}` : `Lib #${q.question_id}`} | {classifyQuestion(q)}</span>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => toggleStar(q.question_id)}
                        className={`text-base transition ${isStarred ? "text-amber-500" : "text-slate-300 hover:text-amber-400"}`}
                        title={isStarred ? "取消標記" : "加入標記"}
                    >
                        <i className={`${isStarred ? "fas" : "far"} fa-star`}></i>
                    </button>
                    {!t && <button onClick={async () => {
                        try {
                            const res = await translateQuizData(q, apiKey);
                            setTranslated((prev) => ({ ...prev, [q.question_id]: res }));
                        } catch (e) { alert(e.message); }
                    }} className="text-blue-400 font-bold hover:underline">Translate</button>}
                </div>
            </div>
            <div className="p-5">
                <div className="lang-pair mb-4">
                    {t && <p className="lang-zh mb-2 animate-fade-in">{t.question}</p>}
                    <p className="lang-en font-medium leading-relaxed">{q.question}</p>
                </div>
                <div className="grid gap-2">
                    {q.options.map((opt, i) => {
                        const char = opt.trim().charAt(0);
                        const isSel = selectedAnswer === char;
                        const isCorrect = char === q.suggested_answer;
                        let cls = "w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-start ";
                        if (!isAns) cls += "border-slate-700 hover:border-blue-500 bg-slate-800/60";
                        else if (isSel && isCorrect) cls += "border-emerald-500 bg-emerald-950";
                        else if (isSel && !isCorrect) cls += "border-rose-500 bg-rose-950";
                        else if (isCorrect) cls += "border-emerald-700 bg-emerald-950/70 opacity-80";
                        else cls += "opacity-30";

                        return (
                            <button key={i} onClick={() => handleAnswerSelect(q, char, inWrongBookView)} className={cls} disabled={!inWrongBookView && isAns}>
                                <span className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mr-3 font-bold ${isSel ? "bg-blue-600 text-white" : "bg-slate-900 border border-slate-600 text-slate-300"}`}>{char}</span>
                                <div className="lang-pair text-sm pt-0.5 leading-snug">
                                    {t && t.options[i] && <p className="lang-zh font-bold mb-1">{t.options[i].split(". ")[1] || t.options[i].substring(2)}</p>}
                                    <p className="lang-en">{opt.split(". ")[1] || opt.substring(2)}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {retakeCorrect && (
                    <div className="mt-4 bg-emerald-950 border border-emerald-800 rounded-xl p-4">
                        <p className="text-sm text-emerald-200 font-bold mb-2">這題你重做答對了，要移出錯題本嗎？</p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => removeFromWrongBook(q.question_id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition"
                            >
                                移出錯題本
                            </button>
                            <button
                                onClick={() => setWrongBookAnswers((prev) => {
                                    const next = { ...prev };
                                    delete next[normalizedId];
                                    return next;
                                })}
                                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-emerald-800 text-emerald-300 text-xs font-bold hover:bg-slate-800 transition"
                            >
                                先保留
                            </button>
                        </div>
                    </div>
                )}

                {canShowDiscussion && (
                    <div className="mt-6 border-t border-slate-700 pt-4">
                        <button
                            onClick={() => toggleDiscussion(q.question_id)}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition text-left"
                        >
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">討論區 / Explanation</span>
                            <i className={`fas ${discussionOpen ? "fa-chevron-up" : "fa-chevron-down"} text-slate-400`}></i>
                        </button>
                        <div className={`${discussionOpen ? "collapse-open mt-3" : "collapse-content"}`}>
                            <div className="space-y-4 text-sm bg-slate-800/70 border border-slate-700 rounded-xl p-4">
                                {discussions.map((item, i) => (
                                    <div key={i} className="space-y-1">
                                        {translatedDiscussions[i] && (
                                            <p className="lang-zh text-sm leading-relaxed">{translatedDiscussions[i]}</p>
                                        )}
                                        <p className="lang-en leading-relaxed">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
