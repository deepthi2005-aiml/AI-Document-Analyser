
import React from 'react';
import { AnalysisResult, DocumentMetadata } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface DashboardProps {
  analysis: AnalysisResult;
  metadata: DocumentMetadata;
}

const Dashboard: React.FC<DashboardProps> = ({ analysis, metadata }) => {
  const sentimentData = [
    { name: 'Sentiment', value: analysis.sentiment_score },
    { name: 'Remaining', value: 100 - analysis.sentiment_score }
  ];

  const entityCounts = [
    { name: 'People', count: analysis.entities.people.length },
    { name: 'Orgs', count: analysis.entities.organizations.length },
    { name: 'Locs', count: analysis.entities.locations.length },
    { name: 'Dates', count: analysis.entities.dates.length },
  ];

  const COLORS = ['#6366f1', '#e2e8f0'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 custom-scrollbar overflow-y-auto max-h-[calc(100vh-140px)]">
      {/* Summary Card */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <i className="fas fa-magic text-indigo-500"></i>
            Executive Summary
          </h2>
          <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full uppercase tracking-wider">
            {analysis.tone}
          </span>
        </div>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg italic">
          "{analysis.summary}"
        </p>
        
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="Words" value={metadata.wordCount.toLocaleString()} icon="fa-font" />
          <StatBox label="Entities" value={entityCounts.reduce((a, b) => a + b.count, 0)} icon="fa-users" />
          <StatBox label="Topics" value={analysis.topics.length} icon="fa-tags" />
          <StatBox label="Actions" value={analysis.action_items.length} icon="fa-check-double" />
        </div>
      </div>

      {/* Sentiment Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center">
        <h3 className="text-lg font-bold mb-6 self-start">Sentiment Analysis</h3>
        <div className="h-48 w-full relative flex items-center justify-center">
           <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold">{analysis.sentiment_score}%</span>
            <span className="text-xs text-slate-500 font-medium uppercase">Positive</span>
          </div>
        </div>
        <p className="text-sm text-center text-slate-500 mt-4">
          The document carries a primarily {analysis.sentiment_score > 50 ? 'positive' : 'cautious'} tone with high factual density.
        </p>
      </div>

      {/* Entity Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-bold mb-6">Entity Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={entityCounts}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
              <YAxis hide />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Topics & Entities Chips */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-bold mb-4">Key Themes</h3>
        <div className="flex flex-wrap gap-2">
          {analysis.topics.map((topic, i) => (
            <span key={i} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium">
              #{topic}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-bold mt-8 mb-4">Top Entities</h3>
        <div className="space-y-3">
          {analysis.entities.organizations.slice(0, 3).map((org, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                <i className="fas fa-building text-xs"></i>
              </div>
              <span className="text-sm font-medium">{org}</span>
            </div>
          ))}
          {analysis.entities.people.slice(0, 3).map((person, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                <i className="fas fa-user text-xs"></i>
              </div>
              <span className="text-sm font-medium">{person}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-bold mb-4">Recommended Actions</h3>
        <div className="space-y-4">
          {analysis.action_items.map((item, i) => (
            <div key={i} className="flex gap-4 group">
              <div className="mt-1 w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-700 flex-shrink-0 flex items-center justify-center group-hover:border-indigo-500 transition-colors">
                <i className="fas fa-check text-[10px] text-white opacity-0 group-hover:opacity-100 group-hover:text-indigo-500"></i>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, icon }: { label: string, value: string, icon: string }) => (
  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
    <div className="flex items-center gap-2 text-slate-400 mb-1">
      <i className={`fas ${icon} text-[10px]`}></i>
      <span className="text-[10px] uppercase font-bold tracking-widest">{label}</span>
    </div>
    <div className="text-xl font-bold">{value}</div>
  </div>
);

export default Dashboard;
