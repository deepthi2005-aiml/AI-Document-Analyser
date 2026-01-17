import React, { useState, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import { DocSession, TabType, ChatMessage } from './types';
import { analyzeDocument } from './services/geminiService';

const App: React.FC = () => {
  const [session, setSession] = useState<DocSession | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.DASHBOARD);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setProgress(10);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const metadata = {
        name: file.name,
        size: file.size,
        type: file.type || 'text/plain',
        lastModified: file.lastModified,
        wordCount: text.split(/\s+/).length,
        charCount: text.length,
      };

      setProgress(30);

      try {
        const analysis = await analyzeDocument(text);
        setProgress(100);
        
        setSession({
          id: crypto.randomUUID(),
          metadata,
          content: text,
          analysis,
          history: []
        });
        setIsProcessing(false);
      } catch (err) {
        console.error("Analysis failed", err);
        setIsProcessing(false);
      }
    };
    reader.readAsText(file);
  };

  const addChatMessage = useCallback((msg: ChatMessage) => {
    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        history: [...prev.history, msg]
      };
    });
  }, []);

  const reset = () => {
    setSession(null);
    setProgress(0);
    setActiveTab(TabType.DASHBOARD);
  };

  return (
    <Layout>
      {!session && !isProcessing && (
        <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-xl w-full">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-black mb-4 tracking-tight">Turn Reading into <span className="text-indigo-600">Knowing</span></h1>
              <p className="text-slate-500 text-lg">Upload your PDF, Docx, or Text files and let our AI extract insights, answer questions, and summarize everything instantly.</p>
            </div>
            
            <div className="relative group">
              <input 
                type="file" 
                accept=".txt,.md,.csv,.json" 
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-12 text-center group-hover:border-indigo-500 transition-all bg-white dark:bg-slate-900 group-hover:shadow-xl group-hover:shadow-indigo-500/10">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
                  <i className="fas fa-cloud-upload-alt text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-2">Drop your files here</h3>
                <p className="text-slate-400">or click to browse from computer</p>
                <div className="mt-8 flex justify-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><i className="fas fa-file-pdf"></i> PDF</span>
                  <span className="flex items-center gap-1"><i className="fas fa-file-word"></i> DOCX</span>
                  <span className="flex items-center gap-1"><i className="fas fa-file-alt"></i> TXT</span>
                </div>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Feature icon="fa-bolt" title="Fast" desc="Instant summarization" />
              <Feature icon="fa-shield-alt" title="Secure" desc="Local text processing" />
              <Feature icon="fa-comment-dots" title="Interactive" desc="Chat with your docs" />
            </div>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8">
          <div className="relative">
             <div className="w-24 h-24 border-4 border-slate-200 dark:border-slate-800 rounded-full"></div>
             <div className="absolute top-0 left-0 w-24 h-24 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center font-bold text-indigo-600">
                {progress}%
             </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Processing Intelligence</h3>
            <p className="text-slate-500">Gemini is reading and analyzing your document structure...</p>
          </div>
        </div>
      )}

      {session && !isProcessing && (
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900">
          <header className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <button 
                onClick={reset}
                className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 transition-colors"
               >
                 <i className="fas fa-arrow-left"></i>
               </button>
               <div>
                  <h2 className="font-bold truncate max-w-[200px] md:max-w-md">{session.metadata.name}</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {Math.round(session.metadata.size / 1024)} KB &bull; {session.metadata.wordCount} WORDS
                  </p>
               </div>
            </div>

            <div className="hidden md:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
               <TabButton 
                active={activeTab === TabType.DASHBOARD} 
                onClick={() => setActiveTab(TabType.DASHBOARD)} 
                icon="fa-th-large" 
                label="Insights" 
               />
               <TabButton 
                active={activeTab === TabType.CHAT} 
                onClick={() => setActiveTab(TabType.CHAT)} 
                icon="fa-comment-alt" 
                label="Ask AI" 
               />
               <TabButton 
                active={activeTab === TabType.PREVIEW} 
                onClick={() => setActiveTab(TabType.PREVIEW)} 
                icon="fa-eye" 
                label="View Content" 
               />
            </div>

            <div className="flex items-center gap-2">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all">
                <i className="fas fa-download"></i>
                Export
              </button>
              <button className="md:hidden w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500">
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-hidden">
            {activeTab === TabType.DASHBOARD && session.analysis && (
              <Dashboard analysis={session.analysis} metadata={session.metadata} />
            )}
            {activeTab === TabType.CHAT && (
              <ChatInterface 
                docText={session.content} 
                history={session.history} 
                onNewMessage={addChatMessage} 
              />
            )}
            {activeTab === TabType.PREVIEW && (
              <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-950 shadow-inner">
                <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300 leading-relaxed">
                    {session.content}
                  </pre>
                </div>
              </div>
            )}
          </div>

          <div className="md:hidden grid grid-cols-3 border-t border-slate-200 dark:border-slate-800 p-2">
            <MobileTab 
              active={activeTab === TabType.DASHBOARD} 
              onClick={() => setActiveTab(TabType.DASHBOARD)} 
              icon="fa-th-large" 
            />
            <MobileTab 
              active={activeTab === TabType.CHAT} 
              onClick={() => setActiveTab(TabType.CHAT)} 
              icon="fa-comment-alt" 
            />
            <MobileTab 
              active={activeTab === TabType.PREVIEW} 
              onClick={() => setActiveTab(TabType.PREVIEW)} 
              icon="fa-eye" 
            />
          </div>
        </div>
      )}
    </Layout>
  );
};

const Feature = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 mb-3">
      <i className={`fas ${icon}`}></i>
    </div>
    <h4 className="font-bold text-sm mb-1">{title}</h4>
    <p className="text-xs text-slate-400">{desc}</p>
  </div>
);

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: string, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
      active ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    <i className={`fas ${icon}`}></i>
    {label}
  </button>
);

const MobileTab = ({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: string }) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-center py-3 rounded-xl transition-all ${
      active ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'text-slate-400'
    }`}
  >
    <i className={`fas ${icon} text-xl`}></i>
  </button>
);

export default App;
