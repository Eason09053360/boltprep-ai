window.BoltPrep = window.BoltPrep || {};

window.BoltPrep.SettingsModal = function SettingsModal({
    showSet,
    apiKey,
    setApiKey,
    examSize,
    setExamSize,
    setShowSet
}) {
    if (!showSet) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[90] p-4">
            <div className="bg-amber-50 p-8 rounded-[2rem] shadow-2xl w-full max-w-md animate-fade-in border border-amber-200">
                <h2 className="text-xl font-bold mb-6 text-slate-800">系統配置</h2>
                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-black text-slate-600 uppercase tracking-tighter">API KEY (Groq/Gemini)</label>
                        <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="w-full border-2 p-3 rounded-xl mt-1 outline-none bg-white text-slate-800 border-amber-300 focus:border-blue-500" placeholder="貼上 Key..." />
                        <p className="mt-2 text-[10px] text-slate-600 leading-relaxed">
                            <i className="fas fa-bolt text-amber-600 mr-1"></i>
                            推薦使用 <a href="https://console.groq.com/" target="_blank" className="text-blue-600 font-bold underline">Groq API Key</a> (gsk_...)，翻譯極速且穩定。
                        </p>
                    </div>
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-tighter">測驗題數</label>
                        <input type="number" value={examSize} onChange={(e) => setExamSize(e.target.value)} className="w-full border-2 p-3 rounded-xl mt-1 outline-none bg-slate-700 text-white border-slate-600 focus:border-blue-500" />
                    </div>
                    <button onClick={() => { const key = apiKey.trim(); localStorage.setItem("fastframe_key", key); setApiKey(key); setShowSet(false); }} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition active:scale-95 shadow-xl">儲存並返回</button>
                </div>
            </div>
        </div>
    );
};
