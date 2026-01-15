
import React, { useState, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-20 lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
            <i className="fas fa-brain text-xl"></i>
          </div>
          <span className="text-xl font-bold hidden lg:block tracking-tight">DocuMind AI</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <SidebarItem icon="fa-file-upload" label="Upload" active />
          <SidebarItem icon="fa-history" label="Library" />
          <SidebarItem icon="fa-cog" label="Settings" />
        </nav>

        <div className="mt-auto space-y-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-lg text-slate-500`}></i>
            <span className="hidden lg:block text-slate-500 font-medium">
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <i className="fas fa-brain"></i>
          </div>
          <span className="font-bold">DocuMind</span>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)}>
          <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
        </button>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false }: { icon: string, label: string, active?: boolean }) => (
  <button className={`w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-all ${
    active ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
  }`}>
    <i className={`fas ${icon} text-lg`}></i>
    <span className="hidden lg:block font-medium">{label}</span>
  </button>
);

export default Layout;
