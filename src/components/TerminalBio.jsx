import { Terminal } from "lucide-react";

export default function TerminalBio({ copy, lang }) {
  return (
    <section className="crt-case" aria-label={copy.terminalLabel}>
      <div className="terminal-bar">
        <span>
          <Terminal size={13} />
          {copy.terminalTitle}
        </span>
        <span className="terminal-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="terminal-screen">
        <div className="terminal-scan" aria-hidden="true" />
        <div className="terminal-orbit" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="terminal-content">
          <p className="terminal-command">
            $ whoami<span className="terminal-ok">[OK]</span>
          </p>
          <p className="terminal-name">
            {lang === "en" ? "Zekai Shi" : "师泽楷"}
          </p>
          <p>{copy.terminalIntro}</p>
          <p className="terminal-key">[MISSION_TARGET]</p>
          <p>{copy.terminalMission}</p>
          <p className="terminal-key">[RESEARCH_FOCUS]</p>
          <p>{copy.terminalFocus}</p>
          <p className="terminal-prompt">
            &gt; {copy.terminalStatus}
            <span className="terminal-caret" aria-hidden="true" />
          </p>
        </div>
      </div>
      <div className="crt-hardware" aria-hidden="true">
        <span className="speaker-grille">▥ ▥ ▥</span>
        <span>CRT_SYS // SONY_TRINITRON</span>
        <i />
      </div>
    </section>
  );
}
