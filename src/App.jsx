import React, { useState, useEffect, useRef } from 'react';
import { Activity, FileText, Cpu, Github, Radio, Terminal, ExternalLink, ArrowRight, Languages } from 'lucide-react';

// --- 全局社交链接 ---
const SOCIAL_LINKS = {
  github: "https://github.com/ZekaiShi",
  scholar: "https://www.researchgate.net/profile/Zekai-Shi?ev=hdr_xprf",
  email: "mailto:shizk2000@outlook.com",
};

// --- 数据配置 ---
const DATA = {
  en: {
    name: "ZEKAI SHI",
    chineseName: "师 泽楷", 
    title: "RESEARCH UNIT: Geo Vision",
    
    // Bio: 精简了冗余的启动代码，利用更宽的屏幕
    bio: "> LOAD_KERNEL: {zekai|ZEKAI} SHI... [OK]\n\nIncoming Ph.D. at CAS IGSNRR (from XJTU).\n\n[MISSION_TARGET]:\nBridging Computer Vision & Earth Observation.\nBuilding a Universal Multi-modal Vision-Language Model to decode our planet.\n\n> STATUS: READY_TO_CONNECT_",
    
    labels: {
      status: "SYSTEM_STATUS: ONLINE",
      newsTitle: "News Update",
      pubTitle: "PUBLICATIONS",
      crtSys: "CRT_SYS",
      sonyLabel: "SONY_TRINITRON",
      btnGithub: "GITHUB",
      btnScholar: "SCHOLAR",
      btnEmail: "EMAIL",
      btnLang: "中文", 
      linkPdf: "PDF_VIEW",
      linkCode: "SOURCE_CODE",
      linkProject: "PROJECT_PAGE"
    },

    news: [
      { date: "2024.08", text: "Paper published to Remote Sensing", type: "JOURNAL" },
    ],
    
    papers: [
      {
        id: "2024-09",
        title: "BresNet: Applying Residual Learning in Backpropagation Neural Networks",
        venue: "Remote Sensing",
        desc: "A novel residual learning model improves prediction of multiple air pollutants from satellite data.",
        tags: ["Residual Learning", "Backpropagation Neural Networks", "Air Pollutants"],
        links: {
          pdf: "https://www.mdpi.com/2072-4292/16/16/4003", 
          code: "#",
          project: "#"
        }
      },
      {
        id: "2023-11",
        title: "Super-resolution reconstruction of 3 arc-second global DEM dataset",
        venue: "11th Academic Conference of Geology Resource Management",
        desc: "A deep learning approach improves global DEM resolution, reducing ocean mapping needs.",
        tags: ["Super-resolution", "Deep Learning", "Global DEM"],
        links: { pdf: "#", code: "#", project: "#" }
      }
    ]
  },

  zh: {
    name: "师 泽楷",
    chineseName: "ZEKAI SHI", 
    title: "研究单元: 地理视觉 (Geo Vision)",
    
    // Bio: 中文版
    bio: "> 加载内核用户: {shizekai|师泽楷}... [成功]\n\n{zhongguo|中国}科学院地理科学与资源研究所 准博士 (来自西安交通大学)。\n\n[核心任务]:\n连接计算机视觉与地球观测技术。\n构建通用的多模态视觉-语言模型以解码我们的星球。\n\n> 终端状态: 等待指令_",
    
    labels: {
      status: "系统状态: 在线",
      newsTitle: "最新动态",
      pubTitle: "发表论文",
      crtSys: "CRT_系统",
      sonyLabel: "索尼_特丽珑",
      btnGithub: "GITHUB",
      btnScholar: "学术主页",
      btnEmail: "电子邮件",
      btnLang: "ENGLISH", 
      linkPdf: "论文PDF",
      linkCode: "源代码",
      linkProject: "项目主页"
    },

    news: [
      { date: "2024.08", text: "论文发表于 Remote Sensing", type: "期刊" },
    ],
    
    papers: [
      {
        id: "2024-09",
        title: "BresNet: 在反向传播神经网络中应用残差学习预测主要空气污染物地面浓度",
        venue: "Remote Sensing (遥感)",
        desc: "一种新颖的残差学习模型，利用卫星数据改进了多种空气污染物的预测。",
        tags: ["残差学习", "BP神经网络", "空气污染物"],
        links: {
          pdf: "https://www.mdpi.com/2072-4292/16/16/4003", 
          code: "#",
          project: "#"
        }
      },
      {
        id: "2023-11",
        title: "3角秒全球DEM数据集的超分辨率重建",
        venue: "2023年第十一届地质资源管理与可持续发展学术会议",
        desc: "一种深度学习方法，提高了全球DEM分辨率，减少了海洋测绘的需求。",
        tags: ["超分辨率", "深度学习", "全球DEM"],
        links: { pdf: "#", code: "#", project: "#" }
      }
    ]
  }
};

// --- 打字机逻辑 (保留拼音功能) ---
function useScifiTypewriter(text) {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    let isMounted = true;
    setDisplayedText(''); 
    const segments = [];
    const regex = /\{([^|]+)\|([^}]+)\}/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: 'normal', content: text.substring(lastIndex, match.index) });
      }
      segments.push({ type: 'ime', pinyin: match[1], word: match[2] });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      segments.push({ type: 'normal', content: text.substring(lastIndex) });
    }

    const typeSequence = async () => {
      let currentString = '';
      for (const segment of segments) {
        if (!isMounted) break;
        if (segment.type === 'normal') {
          for (let i = 0; i < segment.content.length; i++) {
            if (!isMounted) break;
            const char = segment.content[i];
            currentString += char;
            setDisplayedText(currentString);
            let delay = 30 + Math.random() * 40; 
            if (char === ',' || char === '，') delay += 150;
            if (char === '.' || char === '。' || char === '\n') delay += 300;
            await newRPromise(delay);
          }
        } else if (segment.type === 'ime') {
          for (let i = 0; i < segment.pinyin.length; i++) {
            if (!isMounted) break;
            currentString += segment.pinyin[i];
            setDisplayedText(currentString);
            await newRPromise(30 + Math.random() * 30);
          }
          await newRPromise(150);
          if (isMounted) {
             currentString = currentString.slice(0, -segment.pinyin.length);
             currentString += segment.word;
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

const newRPromise = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- 线框地球 ---
function WireframeEarth() {
  return (
    <div className="absolute -right-12 -bottom-20 w-72 h-72 opacity-25 pointer-events-none select-none">
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full stroke-[#5af78e] fill-none animate-[spin_40s_linear_infinite]" 
        strokeWidth="0.3"
      >
        <circle cx="50" cy="50" r="48" opacity="0.8" />
        <ellipse cx="50" cy="50" rx="20" ry="48" opacity="0.5" />
        <ellipse cx="50" cy="50" rx="36" ry="48" opacity="0.5" />
        <line x1="50" y1="2" x2="50" y2="98" opacity="0.5" />
        <line x1="2" y1="50" x2="98" y2="50" opacity="0.5" />
        <ellipse cx="50" cy="50" rx="48" ry="20" opacity="0.5" />
        <ellipse cx="50" cy="50" rx="48" ry="36" opacity="0.5" />
        <ellipse cx="50" cy="50" rx="60" ry="12" stroke="none" fill="none" className="animate-[spin_6s_linear_infinite_reverse]" />
      </svg>
      <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 animate-[spin_12s_linear_infinite_reverse]">
          <div className="absolute top-[42%] left-[8%] w-1.5 h-1.5 bg-[#5af78e] rounded-full shadow-[0_0_5px_#5af78e]"></div>
      </div>
    </div>
  );
}

// --- 复古米色 CRT 电视 ---
function RetroTV({ text, labels }) {
  const typedText = useScifiTypewriter(text);

  return (
    <div className="relative group mb-10 w-full">
      {/* 米色外壳: 宽度自适应 */}
      <div className="bg-[#e6e2d3] p-4 rounded-xl border-b-[8px] border-r-[8px] border-[#b8b4a4] shadow-[10px_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden">
        
        {/* 屏幕外框 */}
        <div className="bg-[#1a1a1a] p-2 rounded-lg shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]">
            
            {/* 屏幕本体：深灰绿背景 */}
            <div className="relative bg-[#0a140a] rounded-lg overflow-hidden min-h-[220px] border-[2px] border-[#000]">
              
              {/* 地球背景 */}
              <WireframeEarth />

              {/* 视觉特效层 */}
              <div className="absolute inset-0 z-40 bg-[linear-gradient(110deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0)_30%,rgba(255,255,255,0.04)_45%,rgba(255,255,255,0)_60%)] pointer-events-none"></div>
              <div className="absolute inset-0 z-30 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.9)_100%)]"></div>
              <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20"></div>

              {/* 文字内容：去掉了故障抖动，回归清晰 */}
              <div className="relative z-10 p-6 font-mono-cool text-sm md:text-base leading-relaxed text-[#5af78e] opacity-90" style={{ textShadow: '0 0 3px rgba(90, 247, 142, 0.5)' }}>
                <div className="whitespace-pre-wrap break-words">
                    {typedText}
                    <span className="inline-block w-2.5 h-5 bg-[#5af78e] align-middle ml-1 animate-[blink_1s_step-end_infinite] shadow-[0_0_8px_rgba(90,247,142,0.8)]"></span>
                </div>
              </div>
            </div>
        </div>

        {/* 底部控制栏 */}
        <div className="mt-3 flex justify-between items-center px-4 py-2 bg-[#dcd8c8] rounded border-t border-[#c0bcad]">
            <div className="flex gap-1.5">
                {[...Array(6)].map((_,i) => <div key={i} className="w-1.5 h-1.5 bg-[#8a867a] rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)]"></div>)}
            </div>
            <div className="flex items-center gap-3">
                <span className="font-pixel text-[8px] text-[#555] tracking-widest uppercase opacity-70">{labels.crtSys} // {labels.sonyLabel}</span>
                <div className="relative flex items-center justify-center w-3 h-3 bg-[#333] rounded-full border border-[#555]">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_6px_red] animate-pulse"></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  
  const [lang, setLang] = useState('en'); 
  const currentData = DATA[lang]; 

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleMouseDown = () => setCursorVariant('click');
    const handleMouseUp = () => setCursorVariant('default');
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#e0e6e0] text-[#1f3322] overflow-hidden relative cursor-none selection:bg-[#1f3322] selection:text-[#e0e6e0]">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700&family=Roboto+Mono:wght@400;500;700&family=Press+Start+2P&display=swap');
        
        .font-pixel { 
          font-family: 'Press Start 2P', 'Outfit', 'Microsoft YaHei', 'PingFang SC', sans-serif; 
        }
        .font-sans-cool { 
          font-family: 'Outfit', 'Microsoft YaHei', 'PingFang SC', sans-serif; 
        }
        .font-mono-cool { 
          font-family: 'Roboto Mono', 'Microsoft YaHei', 'PingFang SC', monospace; 
        }
        
        .dot-matrix-bg {
          background-image: radial-gradient(#aec0ae 15%, transparent 15%);
          background-size: 14px 14px;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        body { cursor: none; }
        a, button { cursor: none; }
      `}</style>

      <CustomCursor x={mousePos.x} y={mousePos.y} variant={cursorVariant} />

      {/* --- 背景 --- */}
      <div className="fixed inset-0 dot-matrix-bg opacity-30 pointer-events-none z-0"></div>
      <div 
        className="fixed top-1/2 left-1/2 font-pixel text-[18vw] text-[#ccd6cc] pointer-events-none z-0 select-none opacity-60 leading-none whitespace-nowrap"
        style={{
          transform: `translate(-50%, -50%) rotate(-5deg) translate(${(mousePos.x - window.innerWidth/2) * -0.03}px, ${(mousePos.y - window.innerHeight/2) * -0.03}px)`
        }}
      >
        GEO_LAB
      </div>
      <div className="fixed inset-0 pointer-events-none z-0">
        <PixelDebris count={12} mouseX={mousePos.x} mouseY={mousePos.y} />
      </div>
      <div className="fixed inset-0 pointer-events-none z-0 mix-blend-soft-light" style={{ background: `radial-gradient(circle 500px at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.8), transparent)` }} />

      {/* --- 主内容 --- */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-16 pb-6 border-b-4 border-[#1f3322] border-double relative">
          <div>
            <div className="flex items-center gap-2 mb-3">
               <div className="w-2 h-2 bg-[#d35400] animate-pulse rounded-full"></div>
               <span className="font-mono-cool text-xs font-bold tracking-widest text-[#d35400]">{currentData.labels.status}</span>
            </div>
            <h1 
              className="font-sans-cool font-bold text-4xl md:text-5xl text-[#1f3322] mb-3 transition-transform duration-75 ease-out tracking-tight"
              style={{ transform: `translate(${(mousePos.x - window.innerWidth/2)/80}px, ${(mousePos.y - window.innerHeight/2)/80}px)` }}
            >
              {currentData.name}
            </h1>
            <p className="font-sans-cool text-lg font-bold text-[#4a5f4d]">
              {currentData.chineseName} // {currentData.title}
            </p>
          </div>
          
          <div className="mt-8 md:mt-0 flex flex-wrap gap-4 items-center">
            <MagneticButton 
                onClick={toggleLanguage}
                setCursor={setCursorVariant} 
                label={currentData.labels.btnLang} 
                icon={<Languages size={18} />} 
                active={true}
            />
            
            <div className="w-[1px] h-6 bg-[#1f3322]/30 mx-2 hidden md:block"></div>

            <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer">
              <MagneticButton setCursor={setCursorVariant} label={currentData.labels.btnGithub} icon={<Github size={18}/>} />
            </a>
            <a href={SOCIAL_LINKS.scholar} target="_blank" rel="noopener noreferrer">
              <MagneticButton setCursor={setCursorVariant} label={currentData.labels.btnScholar} icon={<Radio size={18}/>} />
            </a>
            <a href={SOCIAL_LINKS.email}>
              <MagneticButton setCursor={setCursorVariant} label={currentData.labels.btnEmail} icon={<Terminal size={18}/>} />
            </a>
          </div>
        </header>

        {/* --- 核心布局调整 --- 
           将 grid 比例改为 5:7 (原 4:8) 
           这样左边的电视机就有更多横向空间，文字行数减少，高度自然降低。
        */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* 左侧栏: col-span-5 (变宽) */}
          <div className="md:col-span-5 space-y-10">
            <RetroTV text={currentData.bio} labels={currentData.labels} />

            {/* Logs */}
            <div className="">
              <h3 className="text-sm font-bold bg-[#1f3322] text-[#e0e6e0] inline-block px-2 py-1 mb-4 font-pixel">
                {currentData.labels.newsTitle}
              </h3>
              <ul className="space-y-4 relative border-l-2 border-[#1f3322]/20 pl-4 ml-2">
                {currentData.news.map((item, idx) => (
                  <li 
                    key={idx} 
                    className="relative group cursor-none"
                    onMouseEnter={() => setCursorVariant('hover')}
                    onMouseLeave={() => setCursorVariant('default')}
                  >
                    <div className="absolute -left-[21px] top-1.5 w-2 h-2 bg-[#1f3322] rounded-full group-hover:bg-[#d35400] transition-colors"></div>
                    <div className="text-xs font-bold text-[#5a6e5d] mb-1 font-mono-cool">{item.date} // {item.type}</div>
                    <div className="text-sm font-semibold group-hover:text-[#d35400] transition-colors font-sans-cool">
                      {item.text}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 右侧栏: col-span-7 (稍稍变窄，但依然足够) */}
          <div className="md:col-span-7">
             <div className="flex items-center gap-3 mb-8">
                <Cpu size={24} className="text-[#1f3322]" />
                <span className="font-pixel text-lg">{currentData.labels.pubTitle}</span>
                <div className="h-0.5 flex-grow bg-[#1f3322] opacity-20"></div>
             </div>

             <div className="space-y-8">
               {currentData.papers.map((paper, idx) => (
                 <TiltCard key={idx} setCursor={setCursorVariant}>
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start mb-3">
                       <h3 className="font-sans-cool text-xl md:text-2xl font-bold text-[#1f3322] leading-tight group-hover:text-[#d35400] transition-colors">
                         {paper.title}
                       </h3>
                       <span className="font-pixel text-[10px] bg-[#1f3322]/10 px-2 py-1 rounded text-[#1f3322] whitespace-nowrap">
                         {paper.id}
                       </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm font-mono-cool font-bold text-[#4a5f4d]">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[#1f3322]"></span>
                        {paper.venue}
                      </span>
                      {paper.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 border border-[#1f3322]/30 rounded-full text-xs hover:bg-[#1f3322] hover:text-[#e0e6e0] transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="font-sans-cool text-base text-[#333] leading-relaxed mb-6 max-w-2xl font-medium">
                      {paper.desc}
                    </p>

                    <div className="flex gap-6 font-mono-cool text-sm font-bold">
                      <ActionLink href={paper.links.pdf} icon={<FileText size={16}/>} label={currentData.labels.linkPdf} />
                      <ActionLink href={paper.links.code} icon={<Github size={16}/>} label={currentData.labels.linkCode} />
                      <ActionLink href={paper.links.project} icon={<ExternalLink size={16}/>} label={currentData.labels.linkProject} />
                    </div>
                 </TiltCard>
               ))}
             </div>
          </div>

        </div>
      </main>

      <div className="fixed bottom-6 right-6 font-mono-cool text-xs font-bold text-[#1f3322] opacity-40 pointer-events-none">
        X:{mousePos.x.toString().padStart(4, '0')} Y:{mousePos.y.toString().padStart(4, '0')}
      </div>
    </div>
  );
}

// --- 交互组件 (保持不变) ---

function TiltCard({ children, setCursor }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3; 
    const rotateY = ((x - centerX) / centerX) * 3;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0) rotateY(0) scale(1)');
    setCursor('default');
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setCursor('hover')}
      onMouseLeave={handleMouseLeave}
      className="relative bg-[#ecf2ec] border-l-4 border-[#1f3322] p-6 transition-transform duration-100 ease-out shadow-sm hover:shadow-md group"
      style={{ transform, transformStyle: 'preserve-3d' }}
    >
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#1f3322] opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#1f3322] opacity-0 group-hover:opacity-100 transition-opacity"></div>
      {children}
    </div>
  );
}

function MagneticButton({ label, icon, setCursor, onClick, active }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const x = (e.clientX - centerX) * 0.2;
    const y = (e.clientY - centerY) * 0.2;
    setPos({ x, y });
  };

  const handleMouseLeave = () => {
    setPos({ x: 0, y: 0 });
    setCursor('default');
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setCursor('hover')}
      onMouseLeave={handleMouseLeave}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      className={`
        flex items-center gap-2 px-4 py-2 font-pixel text-[10px] transition-colors duration-200 shadow-[4px_4px_0px_rgba(0,0,0,0.1)]
        ${active ? 'bg-[#d35400] text-white' : 'bg-[#1f3322] text-[#e0e6e0] hover:bg-[#d35400]'}
      `}
    >
      {icon} {label}
    </button>
  );
}

function CustomCursor({ x, y, variant }) {
  return (
    <div 
      className="fixed pointer-events-none z-50 mix-blend-difference"
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
    >
      <div className={`relative transition-all duration-200 ${variant === 'hover' ? 'scale-150' : 'scale-100'}`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-[1px] bg-[#e0e6e0]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-8 bg-[#e0e6e0]"></div>
        <div className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          border border-[#e0e6e0] rounded-full transition-all duration-200
          ${variant === 'click' ? 'w-2 h-2 bg-[#e0e6e0]' : 'w-4 h-4 bg-transparent'}
        `}></div>
      </div>
    </div>
  );
}

function ActionLink({ icon, label, href }) {
  return (
    <a href={href} target="_blank" className="flex items-center gap-2 hover:text-[#d35400] transition-colors group">
      {icon}
      <span className="border-b border-transparent group-hover:border-[#d35400]">{label}</span>
      <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
    </a>
  );
}

function PixelDebris({ count, mouseX, mouseY }) {
  const [pixels] = useState(() => Array.from({ length: count }).map(() => ({
    left: Math.random() * 100, top: Math.random() * 100, size: Math.random() * 20 + 5
  })));
  
  return pixels.map((p, i) => (
    <div key={i} className="absolute bg-[#1f3322] opacity-5 transition-transform duration-1000 ease-out"
      style={{
        left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size,
        transform: `translate(${(mouseX - window.innerWidth/2) * (i%2===0?0.02:-0.02)}px, ${(mouseY - window.innerHeight/2) * 0.02}px)`
      }} 
    />
  ));
}