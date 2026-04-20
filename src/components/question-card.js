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
        <div id={`question-card-${idx + 1}`} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden hover:border-blue-300 transition-all duration-500">
            <div className="px-8 py-4 bg-slate-50/50 border-b flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
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
                    }} className="text-blue-600 font-bold hover:underline">Translate</button>}
                </div>
            </div>
            <div className="p-10">
                <div className="lang-pair mb-8">
                    {t && <p className="lang-zh mb-2 animate-fade-in">{t.question}</p>}
                    <p className="lang-en font-medium leading-relaxed">{q.question}</p>
                </div>
                <div className="grid gap-3">
                    {q.options.map((opt, i) => {
                        const char = opt.trim().charAt(0);
                        const isSel = selectedAnswer === char;
                        const isCorrect = char === q.suggested_answer;
                        let cls = "w-full text-left p-5 rounded-2xl border-2 transition-all flex items-start ";
                        if (!isAns) cls += "border-slate-50 hover:border-blue-400 bg-slate-50/20";
                        else if (isSel && isCorrect) cls += "border-emerald-500 bg-emerald-50";
                        else if (isSel && !isCorrect) cls += "border-rose-500 bg-rose-50";
                        else if (isCorrect) cls += "border-emerald-200 bg-emerald-50/50 opacity-80";
                        else cls += "opacity-30";

                        return (
                            <button key={i} onClick={() => handleAnswerSelect(q, char, inWrongBookView)} className={cls} disabled={!inWrongBookView && isAns}>
                                <span className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center mr-4 font-bold ${isSel ? "bg-slate-800 text-white" : "bg-white border text-slate-300"}`}>{char}</span>
                                <div className="lang-pair text-sm pt-0.5 leading-snug">
                                    {t && t.options[i] && <p className="lang-zh font-bold mb-1">{t.options[i].split(". ")[1] || t.options[i].substring(2)}</p>}
                                    <p className="lang-en">{opt.split(". ")[1] || opt.substring(2)}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {retakeCorrect && (
                    <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                        <p className="text-sm text-emerald-800 font-bold mb-2">這題你重做答對了，要移出錯題本嗎？</p>
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
                                className="px-3 py-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition"
                            >
                                先保留
                            </button>
                        </div>
                    </div>
                )}

                {canShowDiscussion && (
                    <div className="mt-6 border-t border-slate-100 pt-4">
                        <button
                            onClick={() => toggleDiscussion(q.question_id)}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition text-left"
                        >
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">討論區 / Explanation</span>
                            <i className={`fas ${discussionOpen ? "fa-chevron-up" : "fa-chevron-down"} text-slate-400`}></i>
                        </button>
                        <div className={`${discussionOpen ? "collapse-open mt-3" : "collapse-content"}`}>
                            <div className="space-y-4 text-sm bg-slate-50/70 border border-slate-100 rounded-xl p-4">
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
