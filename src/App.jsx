import React, { useState, useEffect, useRef } from 'react';
import { Activity, FileText, Cpu, Github, Radio, Terminal, ExternalLink, ArrowRight, Languages, Wifi, Database, ShieldAlert, Ban, Globe, Sparkles, Zap, Monitor, LayoutGrid } from 'lucide-react';

// ==========================================
//               数据配置区域
// ==========================================

const SHARED_DATA = {
  social: {
    github: "https://github.com/ZekaiShi",
    scholar: "https://www.researchgate.net/profile/Zekai-Shi?ev=hdr_xprf",
    email: "mailto:shizk2000@outlook.com",
  },
  papers: [
    {
      id: "2024-09",
      links: { pdf: "https://www.mdpi.com/2072-4292/16/16/2897", code: "#", project: "#" },
      en: {
        title: "BresNet: Applying Residual Learning in Backpropagation Neural Networks",
        venue: "Remote Sensing",
        desc: "A novel residual learning model improves prediction of multiple air pollutants from satellite data.",
        tags: ["Residual Learning", "BPNN", "Air Pollutants"]
      },
      zh: {
        title: "BresNet: 在反向传播神经网络中应用残差学习预测主要空气污染物地面浓度",
        venue: "Remote Sensing (遥感)",
        desc: "一种新颖的残差学习模型，利用卫星数据改进了多种空气污染物的预测。",
        tags: ["残差学习", "BP神经网络", "空气污染物"]
      }
    },
    {
      id: "2023-11",
      links: { pdf: "#", code: "#", project: "#" },
      en: {
        title: "Super-resolution reconstruction of 3 arc-second global DEM dataset",
        venue: "11th Academic Conf. Geology",
        desc: "A deep learning approach improves global DEM resolution, reducing ocean mapping needs.",
        tags: ["Super-resolution", "Deep Learning", "Global DEM"]
      },
      zh: {
        title: "3角秒全球DEM数据集的超分辨率重建",
        venue: "第十一届地质资源管理学术会议",
        desc: "一种深度学习方法，提高了全球DEM分辨率，减少了海洋测绘的需求。",
        tags: ["超分辨率", "深度学习", "全球DEM"]
      }
    }
  ],
  news: [
    {
      date: "2026.01",
      en: { text: "New paper submitted", type: "JOURNAL" },
      zh: { text: "新论文提交", type: "论文" }
    },
    { 
      date: "2024.08", 
      en: { text: "Paper published to Remote Sensing", type: "JOURNAL" },
      zh: { text: "论文发表于 Remote Sensing", type: "期刊" }
    }
  ]
};

const UI_LABELS = {
  en: {
    name: "ZEKAI SHI",
    role: "Developer / Researcher",
    title: "Geo Vision Model Developer",
    bio: "> LOAD_KERNEL: {zekai|ZEKAI} SHI... [OK]\n\nIncoming Ph.D. at CAS IGSNRR (from XJTU).\n\n[MISSION_TARGET]:\nBridging Computer Vision & Earth Observation.\nBuilding a Universal Multi-modal Vision-Language Model to decode our planet.\n\n> STATUS: READY_TO_CONNECT_",
    intro: "Incoming Ph.D. at CAS IGSNRR.",
    labels: {
      newsTitle: "Latest Updates",
      pubTitle: "Publications",
      btnLang: "中文", 
      linkPdf: "PDF",
      linkCode: "Code",
      linkProject: "Project",
      toastError: "Access Denied / No Data",
      switchRetro: "Switch to Retro OS",
      switchModern: "Switch to Modern UI",
      crtSys: "CRT_SYS",
      sonyLabel: "SONY_TRINITRON",
    }
  },
  zh: {
    name: "师 泽楷",
    role: "程序猿 / 研究牲",
    title: "地理视觉模型开发者",
    bio: "> 加载内核用户: {shizekai|师泽楷}... [成功]\n\n{zhongguo|中国}科学院地理科学与资源研究所 准博士 (来自西安交通大学)。\n\n[核心任务]:\n连接计算机视觉与地球观测技术。\n构建通用的多模态视觉-语言模型以解码我们的星球。\n\n> 终端状态: 等待指令_",
    intro: "中国科学院地理科学与资源研究所 准博士 (来自西安交通大学)。",
    labels: {
      newsTitle: "最新动态",
      pubTitle: "出版物",
      btnLang: "English", 
      linkPdf: "论文",
      linkCode: "代码",
      linkProject: "项目",
      toastError: "访问拒绝 / 暂无数据",
      switchRetro: "切换至复古终端",
      switchModern: "切换至现代界面",
      crtSys: "CRT_系统",
      sonyLabel: "索尼_特丽珑",
    }
  }
};

function getMergedData(lang) {
  const ui = UI_LABELS[lang];
  return {
    ...ui, 
    social: SHARED_DATA.social, 
    news: SHARED_DATA.news.map(item => ({ date: item.date, ...item[lang] })),
    papers: SHARED_DATA.papers.map(paper => ({ id: paper.id, links: paper.links, ...paper[lang] }))
  };
}

// ==========================================
//               Hooks & Utils
// ==========================================

const newRPromise = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function useScifiTypewriter(text) {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    let isMounted = true;
    setDisplayedText(''); 
    const segments = [];
    const regex = /\{([^|]+)\|([^}]+)\}/g;
    let lastIndex = 0; let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) segments.push({ type: 'normal', content: text.substring(lastIndex, match.index) });
      segments.push({ type: 'ime', pinyin: match[1], word: match[2] });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) segments.push({ type: 'normal', content: text.substring(lastIndex) });

    const typeSequence = async () => {
      let currentString = '';
      for (const segment of segments) {
        if (!isMounted) break;
        if (segment.type === 'normal') {
          for (let i = 0; i < segment.content.length; i++) {
            if (!isMounted) break;
            currentString += segment.content[i];
            setDisplayedText(currentString);
            await newRPromise(20 + Math.random() * 30);
          }
        } else if (segment.type === 'ime') {
          for (let i = 0; i < segment.pinyin.length; i++) {
            if (!isMounted) break;
            currentString += segment.pinyin[i];
            setDisplayedText(currentString);
            await newRPromise(30);
          }
          await newRPromise(100);
          if (isMounted) {
             currentString = currentString.slice(0, -segment.pinyin.length) + segment.word;
             setDisplayedText(currentString);
          }
          await newRPromise(100); 
        }
      }
    };
    typeSequence();
    return () => { isMounted = false; };
  }, [text]);
  return displayedText;
}

// ==========================================
//               组件库
// ==========================================

function UnifiedCursor({ x, y, variant, theme }) {
  return (
    <div className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference" style={{ transform: `translate(${x}px, ${y}px)` }}>
      <div className={`relative -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-300 ease-out ${variant === 'hover' ? (theme === 'retro' ? 'w-14 h-14' : 'w-8 h-8') : (theme === 'retro' ? 'w-5 h-5' : 'w-3 h-3')} ${variant === 'click' ? 'scale-75' : 'scale-100'}`}>
        {theme === 'retro' ? (
          <div className={`w-full h-full box-border transition-all duration-200 ${variant === 'hover' ? 'bg-transparent border-2 animate-[spin-slow_4s_linear_infinite]' : 'bg-[#e0e6e0] rotate-45'} ${variant === 'click' ? 'border-[#d35400]' : 'border-[#e0e6e0]'} ${variant === 'default' && 'animate-pulse'}`}>
            {variant === 'hover' && <><div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-[#e0e6e0] animate-pulse"></div><div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#e0e6e0] animate-pulse"></div><div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-[#e0e6e0] animate-pulse"></div><div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-[#e0e6e0] animate-pulse"></div></>}
          </div>
        ) : (
          <div className={`rounded-full border border-white transition-all duration-200 ${variant === 'hover' ? 'w-full h-full bg-white/10' : 'w-full h-full bg-white'}`}></div>
        )}
      </div>
    </div>
  );
}

// --- 修复版：ThemeSwitcher 必须在 App 外部定义 ---
function ThemeSwitcher({ theme, setTheme, toast, currentData, setCursorVariant }) {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3 items-end">
      {/* Toast 提示 */}
      {toast.show && (
        <div className={`mb-2 px-4 py-2 text-sm shadow-lg border animate-[slide-up_0.2s_ease-out] ${theme === 'retro' ? 'bg-[#cf0000] text-white font-pixel border-white border-2' : 'bg-red-500/10 text-red-200 border-red-500/20 rounded-lg backdrop-blur-md'}`}>
          <div className="flex items-center gap-2"><ShieldAlert size={14}/> {toast.msg}</div>
        </div>
      )}
      
      {/* 切换按钮 */}
      <button 
        onClick={() => setTheme(prev => prev === 'retro' ? 'modern' : 'retro')}
        onMouseEnter={() => setCursorVariant('hover')} 
        onMouseLeave={() => setCursorVariant('default')}
        className={`
          flex items-center gap-2 px-5 py-3 transition-all duration-500 shadow-xl cursor-pointer
          ${theme === 'retro' 
            ? 'bg-[#1f3322] text-[#e0e6e0] font-pixel text-xs hover:bg-[#d35400] border-2 border-[#e0e6e0]' 
            : 'bg-white text-black font-sans font-medium text-sm rounded-full hover:scale-105'
          }
        `}
      >
        {theme === 'retro' 
          ? <><LayoutGrid size={16} /> {currentData.labels.switchModern}</> 
          : <><Monitor size={16} /> {currentData.labels.switchRetro}</>
        }
      </button>
    </div>
  );
}

function WireframeEarth() {
  return (
    <div className="absolute -right-12 -bottom-20 w-72 h-72 opacity-25 pointer-events-none select-none">
      <svg viewBox="0 0 100 100" className="w-full h-full stroke-[#5af78e] fill-none animate-[spin_40s_linear_infinite]" strokeWidth="0.3">
        <circle cx="50" cy="50" r="48" opacity="0.8" />
        <ellipse cx="50" cy="50" rx="20" ry="48" opacity="0.5" />
        <ellipse cx="50" cy="50" rx="36" ry="48" opacity="0.5" />
        <line x1="50" y1="2" x2="50" y2="98" opacity="0.5" />
        <line x1="2" y1="50" x2="98" y2="50" opacity="0.5" />
        <ellipse cx="50" cy="50" rx="48" ry="20" opacity="0.5" />
        <ellipse cx="50" cy="50" rx="48" ry="36" opacity="0.5" />
        <ellipse cx="50" cy="50" rx="60" ry="12" stroke="none" fill="none" className="animate-[spin_6s_linear_infinite_reverse]" />
      </svg>
    </div>
  );
}

function RetroTV({ text, labels }) {
  const typedText = useScifiTypewriter(text);
  return (
    <div className="relative group mb-10 w-full">
      <div className="bg-[#e6e2d3] p-4 rounded-xl border-b-[8px] border-r-[8px] border-[#b8b4a4] shadow-[10px_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden">
        <div className="bg-[#1a1a1a] p-2 rounded-lg shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]">
            <div className="relative bg-[#2f382f] rounded-lg overflow-hidden min-h-[220px] border-[2px] border-[#111] shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]">
              <div className="opacity-80"><WireframeEarth /></div>
              <div className="absolute inset-0 z-40 bg-[linear-gradient(110deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_30%,rgba(255,255,255,0.05)_45%,rgba(255,255,255,0)_60%)] pointer-events-none"></div>
              <div className="absolute inset-0 z-30 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_90%,rgba(0,0,0,0.9)_100%)]"></div>
              <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] opacity-40"></div>
              <div className="relative z-10 p-6 font-mono-cool text-sm md:text-base leading-relaxed text-[#5af78e] opacity-90" style={{ textShadow: '0 0 3px rgba(90, 247, 142, 0.5)' }}>
                <div className="whitespace-pre-wrap break-words">{typedText}<span className="inline-block w-2.5 h-5 bg-[#5af78e] align-middle ml-1 animate-[blink_1s_step-end_infinite] shadow-[0_0_8px_rgba(90,247,142,0.8)]"></span></div>
              </div>
            </div>
        </div>
        <div className="mt-3 flex justify-between items-center px-4 py-2 bg-[#dcd8c8] rounded border-t border-[#c0bcad]">
            <div className="flex gap-1.5">{[...Array(6)].map((_,i) => <div key={i} className="w-1.5 h-1.5 bg-[#8a867a] rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)]"></div>)}</div>
            <div className="flex items-center gap-3"><span className="font-pixel text-[8px] text-[#555] tracking-widest uppercase opacity-70">{labels.crtSys} // {labels.sonyLabel}</span><div className="relative flex items-center justify-center w-3 h-3 bg-[#333] rounded-full border border-[#555]"><div className="w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_6px_red] animate-pulse"></div></div></div>
        </div>
      </div>
    </div>
  );
}

function BootScreen({ onComplete }) {
  const [lines, setLines] = useState([]);
  const bootText = ["BIOS DATE 01/12/2025 VER 1.0.2", "CPU: NEURAL_PROCESSOR @ 4.20GHz", "Checking Memory... OK", "Loading Drivers... DONE", " > BOOT_SEQUENCE_COMPLETE"];
  useEffect(() => {
    let delay = 0;
    bootText.forEach((line, index) => {
      delay += Math.random() * 200 + 50; 
      setTimeout(() => { setLines(prev => [...prev, line]); if (index === bootText.length - 1) setTimeout(onComplete, 800); }, delay);
    });
  }, []);
  return (
    <div className="fixed inset-0 bg-black z-[100] p-8 font-mono-cool text-[#33ff33] text-sm leading-relaxed overflow-hidden">
      {lines.map((line, i) => <div key={i} className="mb-1">{line}</div>)}<div className="animate-pulse mt-2">_</div>
    </div>
  );
}

function TiltCard({ children, setCursor }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    const centerX = rect.width / 2; const centerY = rect.height / 2;
    setTransform(`perspective(1000px) rotateX(${((y - centerY) / centerY) * -3}deg) rotateY(${((x - centerX) / centerX) * 3}deg) scale(1.01)`);
  };
  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} onMouseEnter={() => setCursor('hover')} onMouseLeave={() => { setTransform('perspective(1000px) rotateX(0) rotateY(0) scale(1)'); setCursor('default'); }} className="relative bg-[#ecf2ec] border-l-4 border-[#1f3322] p-6 transition-transform duration-100 ease-out shadow-sm hover:shadow-md group" style={{ transform, transformStyle: 'preserve-3d' }}>
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#1f3322] opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#1f3322] opacity-0 group-hover:opacity-100 transition-opacity"></div>
      {children}
    </div>
  );
}

function RetroButton({ label, icon, setCursor, onClick, active }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  const handleMouseMove = (e) => {
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    setPos({ x: (e.clientX - (left + width/2)) * 0.2, y: (e.clientY - (top + height/2)) * 0.2 });
  };
  return (
    <button ref={ref} onClick={onClick} onMouseMove={handleMouseMove} onMouseEnter={() => setCursor('hover')} onMouseLeave={() => { setPos({x:0,y:0}); setCursor('default'); }} style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }} className={`flex items-center gap-2 px-4 py-2 font-pixel text-[10px] transition-colors duration-200 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] ${active ? 'bg-[#d35400] text-white' : 'bg-[#1f3322] text-[#e0e6e0] hover:bg-[#d35400]'}`}>
      {icon} {label}
    </button>
  );
}

function RetroActionLink({ icon, label, href, onInvalid }) {
  const isInvalid = !href || href === '#' || href === '';
  return (
    <a href={isInvalid ? undefined : href} target={!isInvalid ? "_blank" : undefined} rel="noopener noreferrer" onClick={(e) => { if(isInvalid){e.preventDefault(); if(onInvalid)onInvalid();} }} className={`flex items-center gap-2 transition-all duration-200 group ${isInvalid ? 'cursor-not-allowed text-gray-500 hover:text-red-500' : 'cursor-pointer hover:text-[#d35400]'}`}>
      {isInvalid ? <Ban size={16} /> : icon} <span className={`border-b ${isInvalid ? 'border-transparent group-hover:border-red-500' : 'border-transparent group-hover:border-[#d35400]'}`}>{label}</span> {!isInvalid && <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />}
    </a>
  );
}

function SpotlightCard({ children, className = "" }) {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  return (
    <div ref={divRef} onMouseMove={handleMouseMove} onMouseEnter={() => setOpacity(1)} onMouseLeave={() => setOpacity(0)} className={`relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 md:p-8 transition-all duration-300 hover:border-white/20 ${className}`}>
      <div className="pointer-events-none absolute -inset-px transition-opacity duration-300" style={{ opacity, background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.1), transparent 40%)` }} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function ModernLink({ href, icon, label, onClick }) {
  const isInvalid = !href || href === '#' || href === '';
  return (
    <a href={isInvalid ? undefined : href} target={!isInvalid ? "_blank" : undefined} rel="noopener noreferrer" onClick={(e) => { if (isInvalid) { e.preventDefault(); if (onClick) onClick(); } }} className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${isInvalid ? 'text-zinc-500 cursor-not-allowed hover:bg-red-500/10 hover:text-red-400' : 'text-zinc-400 bg-white/5 hover:bg-white/10 hover:text-white cursor-pointer hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'}`}>
      {isInvalid ? <span className="opacity-50">{icon}</span> : icon} <span>{label}</span> {!isInvalid && <ArrowRight size={12} className="opacity-0 -translate-x-2 transition-all group-hover:translate-x-0 group-hover:opacity-100" />}
    </a>
  );
}

// ==========================================
//               主程序入口 & 布局切换
// ==========================================

export default function App() {
  const [theme, setTheme] = useState('retro'); // 'retro' | 'modern'
  const [lang, setLang] = useState('en');
  const [booted, setBooted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const [toast, setToast] = useState({ show: false, msg: '' });

  const currentData = getMergedData(lang);
  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'zh' : 'en');
  const triggerToast = (msg) => { setToast({ show: true, msg }); setTimeout(() => setToast({ show: false, msg: '' }), 3000); };

  // 全局鼠标追踪
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 鼠标点击状态
  useEffect(() => {
    const handleMouseDown = () => setCursorVariant('click');
    const handleMouseUp = () => setCursorVariant('default');
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => { window.removeEventListener('mousedown', handleMouseDown); window.removeEventListener('mouseup', handleMouseUp); };
  }, []);

  // --- RENDER ---
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&family=Outfit:wght@400;500;700&family=Roboto+Mono:wght@400;500;700&family=Press+Start+2P&display=swap');
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes turn-on { 0% { transform: scale(1, 0.002) scaleY(0) scaleX(0); opacity: 0; } 60% { transform: scale(1, 0.002) scaleY(1) scaleX(1); opacity: 1; } 100% { transform: scale(1, 1); opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        .font-pixel { font-family: 'Press Start 2P', 'Outfit', 'Noto Sans SC', sans-serif; }
        .font-sans-cool { font-family: 'Outfit', 'Noto Sans SC', sans-serif; }
        .font-mono-cool { font-family: 'Roboto Mono', 'Noto Sans SC', monospace; }
        .dot-matrix-bg { background-image: radial-gradient(#aec0ae 15%, transparent 15%); background-size: 14px 14px; }
        .bg-grid { background-size: 40px 40px; background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px); mask-image: linear-gradient(to bottom, black 40%, transparent 100%); }
        
        body { cursor: none; } a, button { cursor: none; }
      `}</style>

      {/* 公共组件 */}
      <UnifiedCursor x={mousePos.x} y={mousePos.y} variant={cursorVariant} theme={theme} />
      
      {/* ⚠️ ThemeSwitcher 必须在 App 外部定义，这里直接调用 */}
      <ThemeSwitcher 
        theme={theme} 
        setTheme={setTheme} 
        toast={toast} 
        currentData={currentData} 
        setCursorVariant={setCursorVariant} 
      />

      {/* ====== 模式 A: 复古终端 (Retro) ====== */}
      {theme === 'retro' && (
        <div className="min-h-screen bg-[#e0e6e0] text-[#1f3322] font-sans-cool selection:bg-[#1f3322] selection:text-[#e0e6e0]">
          {!booted && <BootScreen onComplete={() => setBooted(true)} />}
          {booted && (
            <div className="animate-[turn-on_0.5s_ease-out]">
              <div className="fixed inset-0 dot-matrix-bg opacity-30 pointer-events-none z-0"></div>
              <div className="fixed top-1/2 left-1/2 font-pixel text-[18vw] text-[#ccd6cc] pointer-events-none z-0 select-none opacity-60 leading-none whitespace-nowrap" style={{ transform: `translate(-50%, -50%) rotate(-5deg) translate(${(mousePos.x - window.innerWidth/2) * -0.03}px, ${(mousePos.y - window.innerHeight/2) * -0.03}px)` }}>GEO_LAB</div>
              <div className="fixed inset-0 pointer-events-none z-0 mix-blend-soft-light" style={{ background: `radial-gradient(circle 500px at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.8), transparent)` }} />
              
              <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
                <header className="flex flex-col md:flex-row justify-between items-end mb-16 pb-6 border-b-4 border-[#1f3322] border-double relative">
                  <div>
                    <div className="flex items-center gap-2 mb-3"><div className="w-2 h-2 bg-[#d35400] animate-pulse rounded-full"></div><span className="font-mono-cool text-xs font-bold tracking-widest text-[#d35400]">{currentData.labels.status}</span></div>
                    <h1 className="font-sans-cool font-bold text-4xl md:text-5xl text-[#1f3322] mb-3 transition-transform duration-75 ease-out tracking-tight" style={{ transform: `translate(${(mousePos.x - window.innerWidth/2)/80}px, ${(mousePos.y - window.innerHeight/2)/80}px)` }}>{currentData.name}</h1>
                    <p className="font-sans-cool text-lg font-bold text-[#4a5f4d]">{currentData.subName} // {currentData.title}</p>
                  </div>
                  <div className="mt-8 md:mt-0 flex flex-wrap gap-4 items-center">
                    <RetroButton onClick={toggleLanguage} setCursor={setCursorVariant} label={currentData.labels.btnLang} icon={<Languages size={18} />} active={true} />
                    <div className="w-[1px] h-6 bg-[#1f3322]/30 mx-2 hidden md:block"></div>
                    <a href={currentData.social.github} target="_blank" rel="noopener noreferrer"><RetroButton setCursor={setCursorVariant} label={currentData.labels.btnGithub} icon={<Github size={18}/>} /></a>
                    <a href={currentData.social.scholar} target="_blank" rel="noopener noreferrer"><RetroButton setCursor={setCursorVariant} label={currentData.labels.btnScholar} icon={<Radio size={18}/>} /></a>
                    <a href={currentData.social.email}><RetroButton setCursor={setCursorVariant} label={currentData.labels.btnEmail} icon={<Terminal size={18}/>} /></a>
                  </div>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                  <div className="md:col-span-5 space-y-10">
                    <RetroTV text={currentData.bio} labels={currentData.labels} />
                    <div>
                      <h3 className="text-sm font-bold bg-[#1f3322] text-[#e0e6e0] inline-block px-2 py-1 mb-4 font-pixel">{currentData.labels.newsTitle}</h3>
                      <ul className="space-y-4 relative border-l-2 border-[#1f3322]/20 pl-4 ml-2">
                        {currentData.news.map((item, idx) => (
                          <li key={idx} className="relative group cursor-none" onMouseEnter={() => setCursorVariant('hover')} onMouseLeave={() => setCursorVariant('default')}>
                            <div className="absolute -left-[21px] top-1.5 w-2 h-2 bg-[#1f3322] rounded-full group-hover:bg-[#d35400] transition-colors"></div>
                            <div className="text-xs font-bold text-[#5a6e5d] mb-1 font-mono-cool">{item.date} // {item.type}</div>
                            <div className="text-sm font-semibold group-hover:text-[#d35400] transition-colors font-sans-cool">{item.text}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="md:col-span-7">
                     <div className="flex items-center gap-3 mb-8"><Cpu size={24} className="text-[#1f3322]" /><span className="font-pixel text-lg">{currentData.labels.pubTitle}</span><div className="h-0.5 flex-grow bg-[#1f3322] opacity-20"></div></div>
                     <div className="space-y-8">
                       {currentData.papers.map((paper, idx) => (
                         <TiltCard key={idx} setCursor={setCursorVariant}>
                            <div className="flex flex-col md:flex-row gap-4 justify-between items-start mb-3"><h3 className="font-sans-cool text-xl md:text-2xl font-bold text-[#1f3322] leading-tight group-hover:text-[#d35400] transition-colors">{paper.title}</h3><span className="font-pixel text-[10px] bg-[#1f3322]/10 px-2 py-1 rounded text-[#1f3322] whitespace-nowrap">{paper.id}</span></div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm font-mono-cool font-bold text-[#4a5f4d]"><span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[#1f3322]"></span>{paper.venue}</span>{paper.tags.map(tag => (<span key={tag} className="px-2 py-0.5 border border-[#1f3322]/30 rounded-full text-xs hover:bg-[#1f3322] hover:text-[#e0e6e0] transition-colors">{tag}</span>))}</div>
                            <p className="font-sans-cool text-base text-[#333] leading-relaxed mb-6 max-w-2xl font-medium">{paper.desc}</p>
                            <div className="flex gap-6 font-mono-cool text-sm font-bold">
                              <RetroActionLink href={paper.links.pdf} icon={<FileText size={16}/>} label={currentData.labels.linkPdf} onInvalid={() => triggerToast(currentData.labels.toastError)}/>
                              <RetroActionLink href={paper.links.code} icon={<Github size={16}/>} label={currentData.labels.linkCode} onInvalid={() => triggerToast(currentData.labels.toastError)}/>
                              <RetroActionLink href={paper.links.project} icon={<ExternalLink size={16}/>} label={currentData.labels.linkProject} onInvalid={() => triggerToast(currentData.labels.toastError)}/>
                            </div>
                         </TiltCard>
                       ))}
                     </div>
                  </div>
                </div>
              </main>
            </div>
          )}
        </div>
      )}

      {/* ====== 模式 B: 现代硅谷风 (Modern) ====== */}
      {theme === 'modern' && (
        <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200 font-sans animate-[fade-in_0.5s_ease-out]">
          <div className="fixed inset-0 bg-grid pointer-events-none z-0"></div>
          <div className="fixed top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-900/10 via-purple-900/5 to-transparent pointer-events-none z-0"></div>
          
          <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-black/50 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
              <div className="flex items-center gap-2"><div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg"><span className="font-bold text-white">Z</span><div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/20"></div></div><span className="font-sans font-bold tracking-tight text-white/90 hidden md:block">{currentData.name}</span></div>
              <div className="flex items-center gap-4"><button onClick={toggleLanguage} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-xs text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"><Globe size={14} />{currentData.labels.btnLang}</button><div className="h-4 w-px bg-white/10"></div><div className="flex gap-2"><a href={currentData.social.github} target="_blank" className="text-zinc-400 hover:text-white transition-colors"><Github size={18}/></a><a href={currentData.social.scholar} target="_blank" className="text-zinc-400 hover:text-white transition-colors"><Radio size={18}/></a><a href={currentData.social.email} className="text-zinc-400 hover:text-white transition-colors"><Terminal size={18}/></a></div></div>
            </div>
          </nav>

          <main className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
              <div className="lg:col-span-8 animate-enter">
                <div className="flex items-center gap-3 mb-6"><div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium flex items-center gap-2"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span></span>{currentData.role}</div><span className="text-zinc-500 text-sm font-mono">// {currentData.title}</span></div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">{currentData.name === "ZEKAI SHI" ? (<>Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Vision</span> for<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Our Planet.</span></>) : (<>用 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">视觉技术</span><br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">解码地球。</span></>)}</h1>
                <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl mb-8 whitespace-pre-wrap">{currentData.bio.replace(/>.*?\n/g, '') .replace(/\[.*?\]:/g, '') .trim()}</p>
                <div className="flex flex-wrap gap-4"><a href={currentData.social.github} target="_blank" className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-2"><Github size={20} /> GitHub</a><a href={currentData.social.scholar} target="_blank" className="px-6 py-3 rounded-lg bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2"><Radio size={20} /> Scholar</a></div>
              </div>
              <div className="lg:col-span-4 animate-enter delay-100">
                <SpotlightCard className="h-full">
                  <div className="flex items-center gap-2 mb-6 text-zinc-400"><Sparkles size={16} /><span className="text-xs font-bold uppercase tracking-wider">{currentData.labels.newsTitle}</span></div>
                  <div className="space-y-6">{currentData.news.map((item, idx) => (<div key={idx} className="group cursor-default"><div className="flex items-center gap-3 mb-2"><div className="h-px flex-1 bg-white/10 group-hover:bg-indigo-500/50 transition-colors"></div><span className="text-xs font-mono text-zinc-500">{item.date}</span></div><p className="text-sm font-medium text-zinc-200 group-hover:text-indigo-300 transition-colors">{item.text}</p><span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded bg-white/5 text-zinc-500">{item.type}</span></div>))}</div>
                </SpotlightCard>
              </div>
            </div>
            <div className="animate-enter delay-200">
              <div className="flex items-center gap-4 mb-8"><h2 className="text-2xl font-bold text-white">{currentData.labels.pubTitle}</h2><div className="h-px flex-1 bg-white/10"></div></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentData.papers.map((paper, idx) => (
                  <SpotlightCard key={idx} className="flex flex-col h-full group">
                    <div className="flex justify-between items-start mb-4"><div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400"><FileText size={24} /></div><span className="font-mono text-xs text-zinc-600">{paper.id}</span></div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors leading-snug">{paper.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-6 flex-grow">{paper.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-6">{paper.tags.map(tag => (<span key={tag} className="px-2 py-1 rounded text-xs bg-white/5 text-zinc-400 border border-white/5">{tag}</span>))}</div>
                    <div className="pt-6 border-t border-white/5 flex gap-3 mt-auto">
                      <ModernLink href={paper.links.pdf} icon={<ExternalLink size={14}/>} label={currentData.labels.linkPdf} onClick={() => triggerToast(currentData.labels.toastError)} />
                      <ModernLink href={paper.links.code} icon={<Github size={14}/>} label={currentData.labels.linkCode} onClick={() => triggerToast(currentData.labels.toastError)} />
                      <ModernLink href={paper.links.project} icon={<Zap size={14}/>} label={currentData.labels.linkProject} onClick={() => triggerToast(currentData.labels.toastError)} />
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}