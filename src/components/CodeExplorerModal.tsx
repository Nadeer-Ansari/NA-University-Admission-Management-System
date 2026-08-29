import React, { useState } from 'react';
import { CSHARP_PROJECT_FILES, CSharpFileItem } from '../data/csharpProjectFiles';
import { 
  FolderTree, 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  Database, 
  ShieldCheck, 
  Server, 
  TestTube2, 
  FileText,
  X,
  Search
} from 'lucide-react';

interface CodeExplorerModalProps {
  onClose: () => void;
}

export const CodeExplorerModal: React.FC<CodeExplorerModalProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<CSharpFileItem>(CSHARP_PROJECT_FILES[1]); // Default to AdmissionStatus.cs
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Domain', 'Application', 'Infrastructure', 'Web', 'Tests', 'Docs'];

  const filteredFiles = CSHARP_PROJECT_FILES.filter(file => {
    const matchesCategory = activeCategory === 'All' || file.category === activeCategory;
    const matchesSearch = file.path.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          file.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = selectedFile.path.split('/').pop() || 'code.cs';
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Domain': return <Layers className="w-4 h-4 text-emerald-500" />;
      case 'Application': return <Server className="w-4 h-4 text-blue-500" />;
      case 'Infrastructure': return <Database className="w-4 h-4 text-amber-500" />;
      case 'Web': return <ShieldCheck className="w-4 h-4 text-purple-500" />;
      case 'Tests': return <TestTube2 className="w-4 h-4 text-rose-500" />;
      default: return <FileText className="w-4 h-4 text-[var(--nau-text-muted)]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-hidden">
      <div className="bg-[var(--nau-card-bg)] border border-[var(--nau-border)] text-[var(--nau-text-primary)] rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--nau-border)] bg-[var(--nau-surface-tertiary)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-xl text-[var(--nau-primary)]">
              <FolderTree className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[var(--nau-heading)] tracking-tight">
                  ASP.NET Core 8 MVC Solution Explorer
                </h2>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded">
                  Clean Architecture
                </span>
              </div>
              <p className="text-xs text-[var(--nau-text-muted)]">
                Inspect complete production C# source code, EF Core configurations, and xUnit test suites.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[var(--nau-text-muted)] hover:text-[var(--nau-text-primary)] rounded-lg hover:bg-[var(--nau-hover-bg)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Body Grid */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Sidebar: File Tree & Filters */}
          <div className="w-80 border-r border-[var(--nau-border)] bg-[var(--nau-surface-secondary)] flex flex-col">
            
            {/* Search & Categories */}
            <div className="p-3 border-b border-[var(--nau-border)] space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--nau-text-muted)]" />
                <input
                  type="text"
                  placeholder="Search C# files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[var(--nau-input-bg)] border border-[var(--nau-border)] rounded-lg text-xs text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] focus:outline-none focus:border-[var(--nau-primary)]"
                />
              </div>

              <div className="flex flex-wrap gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-[var(--nau-primary)] text-white font-semibold'
                        : 'bg-[var(--nau-surface-tertiary)] text-[var(--nau-text-secondary)] hover:text-[var(--nau-text-primary)] hover:bg-[var(--nau-hover-bg)]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* File List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredFiles.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-2.5 transition-all text-xs cursor-pointer ${
                      isSelected
                        ? 'bg-blue-500/10 border border-blue-500/40 text-[var(--nau-primary)] font-medium'
                        : 'text-[var(--nau-text-secondary)] hover:bg-[var(--nau-hover-bg)] hover:text-[var(--nau-text-primary)] border border-transparent'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {getCategoryIcon(file.category)}
                    </div>
                    <div className="overflow-hidden min-w-0">
                      <div className="font-mono font-medium text-[var(--nau-text-primary)] truncate">
                        {file.path.split('/').pop()}
                      </div>
                      <div className="text-[10px] text-[var(--nau-text-muted)] truncate">
                        {file.path}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Layer Info Footer */}
            <div className="p-3 border-t border-[var(--nau-border)] text-[11px] text-[var(--nau-text-muted)] flex items-center justify-between">
              <span>{filteredFiles.length} files available</span>
              <span className="font-mono text-[var(--nau-text-muted)]">.NET 8.0</span>
            </div>
          </div>

          {/* Right Editor Pane */}
          <div className="flex-1 flex flex-col bg-[var(--nau-surface)] overflow-hidden">
            
            {/* File Info Bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--nau-border)] bg-[var(--nau-surface-tertiary)]">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileCode className="w-4 h-4 text-[var(--nau-primary)] shrink-0" />
                <span className="font-mono text-xs text-[var(--nau-primary)] font-semibold truncate">
                  {selectedFile.path}
                </span>
                <span className="text-[var(--nau-text-muted)]">•</span>
                <span className="text-xs text-[var(--nau-text-muted)] truncate">
                  {selectedFile.description}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--nau-surface)] hover:bg-[var(--nau-hover-bg)] text-[var(--nau-text-primary)] rounded-lg text-xs font-medium transition-colors cursor-pointer border border-[var(--nau-border)]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
                <button
                  onClick={handleDownloadFile}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--nau-primary)] hover:bg-[var(--nau-primary-hover)] text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto p-6 font-mono text-xs leading-relaxed bg-[var(--nau-page-bg)] text-[var(--nau-text-primary)] border-t border-[var(--nau-border)]">
              <pre className="whitespace-pre">
                <code>{selectedFile.code}</code>
              </pre>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
