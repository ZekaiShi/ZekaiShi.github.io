import React, { useState, useEffect, useRef } from 'react';
import { Activity, FileText, Cpu, Github, Radio, Terminal, ExternalLink, ArrowRight } from 'lucide-react';

// --- 数据配置 ---
const DATA = {
  // 1. 名字配置
  name: "ZEKAI SHI", 
  chineseName: "师 泽楷",
  title: "RESEARCH UNIT: Geo Vision",
  
  // 2. 个人简介 (BIO) - 这里使用 \n 来换行，模仿老式终端的输出风格
  bio: "> SYSTEM_BOOT_SEQUENCE...\n> LOAD_USER: ZEKAI SHI [OK]\n\nIncoming Ph.D. at CAS IGSNRR (from XJTU).\n\n[MISSION_KV]:\nBridging Computer Vision & Earth Observation.\nBuilding a Universal Multi-modal Vision-Language Model to decode our planet.\n\n> STATUS: READY_TO_CONNECT_",
  
  // 3. 社交链接
  social: {
    github: "https://github.com/ZekaiShi",
    scholar: "https://www.researchgate.net/profile/Zekai-Shi?ev=hdr_xprf",
    email: "mailto:shizk2000@outlook.com",
  },

  news: [
    { date: "2024.08", text: "Paper published to Remote Sensing", type: "JOURNAL" },
  ],
  
  // 4. 论文列表
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
      links: {
        pdf: "#",
        code: "#",
        project: "#"
      }
    }
  ]
};

// --- 新增：打字机效果 Hook ---
function useTypewriter(text, speed = 30) {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return displayedText;
}

// --- 新增：老式 CRT 电视组件 ---
function RetroTV({ text }) {
  const typedText = useTypewriter(text, 30); // 打字速度，越小越快

  return (
    <div className="relative group mb-10">
      {/* 电视外壳 */}
      <div className="bg-[#1a1a1a] p-3 rounded-lg border-b-4 border-r-4 border-[#0f0f0f] shadow-xl">
        
        {/* 屏幕区域：深色背景 + 内阴影 */}
        <div className="relative bg-[#0c140c] rounded border-[3px] border-[#333] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] min-h-[200px] p-5 overflow-hidden">
          
          {/* 屏幕文字：绿色荧光字 + 阴影 + 换行支持 */}
          <div className="relative z-10 font-mono-clean text-sm md:text-base leading-relaxed text-[#33ff33] drop-shadow-[0_0_5px_rgba(51,255,51,0.6)] whitespace-pre-wrap">
            {typedText}
            {/* 闪烁光标 */}
            <span className="inline-block w-2.5 h-5 bg-[#33ff33] align-middle ml-1 animate-[blink_1s_step-end_infinite]"></span>
          </div>

          {/* 装饰：扫描线 (Scanlines) */}
          <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>
          
          {/* 装饰：屏幕微光 (Glow) */}
          <div className="absolute inset-0 pointer-events-none z-30 bg-radial-gradient from-transparent to-[rgba(0,0,0,0.4)]"></div>
        </div>

        {/* 电视底部装饰条 */}
        <div className="mt-2 flex justify-between items-center px-2">
            <div className="flex gap-1">
                {/* 散热孔 */}
                {[...Array(3)].map((_,i) => <div key={i} className="w-8 h-1.5 bg-[#0f0f0f] rounded-full"></div>)}
            </div>
            <div className="flex items-center gap-2">
                <span className="font-pixel text-[8px] text-[#555]">CRT_SYS</span>
                {/* 红色电源指示灯 */}
                <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_5px_red] animate-pulse"></div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');

  // 全局鼠标监听
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 鼠标点击状态监听
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
    // 背景颜色 #e0e6e0
    <div className="min-h-screen bg-[#e0e6e0] text-[#1f3322] overflow-hidden relative cursor-none selection:bg-[#1f3322] selection:text-[#e0e6e0]">
      
      {/* 字体引入与样式注入 */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Press+Start+2P&display=swap');
        
        .font-pixel { font-family: 'Press Start 2P', cursive; }
        .font-mono-clean { font-family: 'JetBrains Mono', monospace; }
        
        .dot-matrix-bg {
          background-image: radial-gradient(#aec0ae 15%, transparent 15%);
          background-size: 14px 14px;
        }

        /* 闪烁光标动画 */
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        body { cursor: none; }
        a, button { cursor: none; }
      `}</style>

      {/* --- 自定义光标 --- */}
      <CustomCursor x={mousePos.x} y={mousePos.y} variant={cursorVariant} />

      {/* --- 背景装饰层 --- */}
      <div className="fixed inset-0 dot-matrix-bg opacity-30 pointer-events-none z-0"></div>
      
      <div 
        className="fixed top-1/2 left-1/2 font-pixel text-[18vw] text-[#ccd6cc] pointer-events-none z-0 select-none opacity-60 leading-none whitespace-nowrap"
        style={{
          transform: `
            translate(-50%, -50%) 
            rotate(-5deg) 
            translate(${(mousePos.x - window.innerWidth/2) * -0.03}px, ${(mousePos.y - window.innerHeight/2) * -0.03}px)
          `
        }}
      >
        GEO_LAB
      </div>

      <div className="fixed inset-0 pointer-events-none z-0">
        <PixelDebris count={12} mouseX={mousePos.x} mouseY={mousePos.y} />
      </div>

      <div 
        className="fixed inset-0 pointer-events-none z-0 mix-blend-soft-light"
        style={{
          background: `radial-gradient(circle 500px at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.8), transparent)`
        }}
      />

      {/* --- 主要内容层 --- */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-16 pb-6 border-b-4 border-[#1f3322] border-double relative">
          <div>
            <div className="flex items-center gap-2 mb-3">
               <div className="w-2 h-2 bg-[#d35400] animate-pulse rounded-full"></div>
               <span className="font-mono-clean text-xs font-bold tracking-widest text-[#d35400]">SYSTEM_STATUS: ONLINE</span>
            </div>
            <h1 
              className="font-pixel text-4xl md:text-5xl text-[#1f3322] mb-3 transition-transform duration-75 ease-out"
              style={{ transform: `translate(${(mousePos.x - window.innerWidth/2)/80}px, ${(mousePos.y - window.innerHeight/2)/80}px)` }}
            >
              {DATA.name}
            </h1>
            <p className="font-mono-clean text-lg font-medium text-[#4a5f4d]">
              {DATA.chineseName} // {DATA.title}
            </p>
          </div>
          <div className="mt-8 md:mt-0 flex gap-4">
            <a href={DATA.social.github} target="_blank" rel="noopener noreferrer">
              <MagneticButton setCursor={setCursorVariant} label="GITHUB" icon={<Github size={18}/>} />
            </a>
            <a href={DATA.social.scholar} target="_blank" rel="noopener noreferrer">
              <MagneticButton setCursor={setCursorVariant} label="SCHOLAR" icon={<Radio size={18}/>} />
            </a>
            <a href={DATA.social.email}>
              <MagneticButton setCursor={setCursorVariant} label="EMAIL" icon={<Terminal size={18}/>} />
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* 左侧栏 */}
          <div className="md:col-span-4 space-y-10">
            
            {/* --- 替换部分：这里是新的 CRT 电视机组件 --- */}
            <RetroTV text={DATA.bio} />
            {/* ------------------------------------- */}

            {/* Logs */}
            <div className="font-mono-clean">
              <h3 className="text-sm font-bold bg-[#1f3322] text-[#e0e6e0] inline-block px-2 py-1 mb-4 font-pixel">
                News Update
              </h3>
              <ul className="space-y-4 relative border-l-2 border-[#1f3322]/20 pl-4 ml-2">
                {DATA.news.map((item, idx) => (
                  <li 
                    key={idx} 
                    className="relative group cursor-none"
                    onMouseEnter={() => setCursorVariant('hover')}
                    onMouseLeave={() => setCursorVariant('default')}
                  >
                    <div className="absolute -left-[21px] top-1.5 w-2 h-2 bg-[#1f3322] rounded-full group-hover:bg-[#d35400] transition-colors"></div>
                    <div className="text-xs font-bold text-[#5a6e5d] mb-1">{item.date} // {item.type}</div>
                    <div className="text-sm font-medium group-hover:text-[#d35400] transition-colors">
                      {item.text}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/*Rb右侧栏：研究成果 */}
          <div className="md:col-span-8">
             <div className="flex items-center gap-3 mb-8">
                <Cpu size={24} className="text-[#1f3322]" />
                <span className="font-pixel text-lg">PUBLICATIONS</span>
                <div className="h-0.5 flex-grow bg-[#1f3322] opacity-20"></div>
             </div>

             <div className="space-y-8">
               {DATA.papers.map((paper, idx) => (
                 <TiltCard key={idx} setCursor={setCursorVariant}>
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start mb-3">
                       <h3 className="font-mono-clean text-xl md:text-2xl font-bold text-[#1f3322] leading-tight group-hover:text-[#d35400] transition-colors">
                         {paper.title}
                       </h3>
                       <span className="font-pixel text-[10px] bg-[#1f3322]/10 px-2 py-1 rounded text-[#1f3322] whitespace-nowrap">
                         {paper.id}
                       </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm font-mono-clean font-bold text-[#4a5f4d]">
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

                    <p className="font-mono-clean text-base text-[#333] leading-relaxed mb-6 max-w-2xl">
                      {paper.desc}
                    </p>

                    <div className="flex gap-6 font-mono-clean text-sm font-bold">
                      <ActionLink href={paper.links.pdf} icon={<FileText size={16}/>} label="PDF_VIEW" />
                      <ActionLink href={paper.links.code} icon={<Github size={16}/>} label="SOURCE_CODE" />
                      <ActionLink href={paper.links.project} icon={<ExternalLink size={16}/>} label="PROJECT_PAGE" />
                    </div>
                 </TiltCard>
               ))}
             </div>
          </div>

        </div>
      </main>

      {/* 底部坐标 */}
      <div className="fixed bottom-6 right-6 font-mono-clean text-xs font-bold text-[#1f3322] opacity-40 pointer-events-none">
        X:{mousePos.x.toString().padStart(4, '0')} Y:{mousePos.y.toString().padStart(4, '0')}
      </div>
    </div>
  );
}

// --- 交互组件 ---

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

function MagneticButton({ label, icon, setCursor }) {
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
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setCursor('hover')}
      onMouseLeave={handleMouseLeave}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      className="flex items-center gap-2 px-4 py-2 bg-[#1f3322] text-[#e0e6e0] font-pixel text-[10px] hover:bg-[#d35400] transition-colors duration-200 shadow-[4px_4px_0px_rgba(0,0,0,0.1)]"
    >
      {icon} {label}
    </button>
  );
}

function CustomCursor({ x, y, variant }) {
  return (
    <div 
      className="fixed pointer-events-none z-50 mix-blend-difference"
      style={{ 
        left: x, 
        top: y,
        transform: 'translate(-50%, -50%)'
      }}
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