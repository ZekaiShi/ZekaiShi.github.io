import { useState } from "react";
import {
  ArrowDown,
  Github,
  GraduationCap,
  Languages,
  Mail,
  ScanLine,
} from "lucide-react";
import { usePreferences } from "./hooks/usePreferences";
import { profile, socialLinks } from "./content/profile";
import news from "./content/news.json";
import publications from "./content/publications.json";
import Atmosphere from "./components/Atmosphere";
import ResearchConsole from "./components/ResearchConsole";
import TerminalBio from "./components/TerminalBio";
import PublicationCard from "./components/PublicationCard";
import DisplayControls from "./components/DisplayControls";
import GlassSurface from "./components/GlassSurface";

export default function App() {
  const preferences = usePreferences();
  const { theme, lang, setLang, motion } = preferences;
  const [focus, setFocus] = useState(0);
  const copy = profile[lang];
  const light = theme === "light";
  return (
    <div
      className="site-shell"
      data-theme={theme}
      data-motion={motion ? "on" : "off"}
    >
      <a className="skip-link" href="#main">
        {copy.skip}
      </a>
      <Atmosphere motion={motion} theme={theme} />
      <header className="site-header">
        <GlassSurface className="header-inner" motion={motion}>
          <a className="brand" href="#top" aria-label={copy.home}>
            <span className="brand-mark">
              <ScanLine size={21} />
            </span>
            <span>
              ZS<span className="brand-divider">/</span>GEO_LAB
              <span className="brand-dot" />
            </span>
          </a>
          <nav className="header-nav" aria-label={copy.navigation}>
            <a href="#research">{copy.research}</a>
            <a href="#publications">{copy.publications}</a>
            <a href="#news">{copy.news}</a>
          </nav>
          <button
            className="language-button"
            onClick={() => setLang(lang === "en" ? "zh" : "en")}
            aria-label={copy.switchLanguage}
          >
            <Languages size={15} />
            <span>{lang === "en" ? "中文" : "EN"}</span>
          </button>
        </GlassSurface>
      </header>
      <main id="main" className="page-container">
        <section className="hero" id="top" aria-labelledby="hero-heading">
          <div className="hero-copy enter">
            <div className="eyebrow">
              <span className="status-dot" />
              {copy.eyebrow}
              <span className="eyebrow-index">01 / PROFILE</span>
            </div>
            <p className="hero-kicker">
              {light
                ? "COMPUTER VISION × EARTH OBSERVATION"
                : `${copy.name} / AI RESEARCHER`}
            </p>
            <h1 id="hero-heading">
              {light ? (
                copy.name
              ) : (
                <>
                  {copy.headlineStart}
                  <br />
                  <span className="gradient-text">{copy.headlineEnd}</span>
                  <span className="title-period">.</span>
                </>
              )}
            </h1>
            <p className="hero-role">
              {copy.role}
              <span className="slash"> / </span>
              {copy.intro}
            </p>
            <p className="hero-description">{copy.description}</p>
            <div className="interest-tags" aria-label={copy.interests}>
              {copy.tags.map((tag, index) => (
                <span key={tag}>
                  <i>0{index + 1}</i>
                  {tag}
                </span>
              ))}
            </div>
            <div className="social-links">
              <a
                className="primary-link"
                href={socialLinks.scholar}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GraduationCap size={18} />
                Google Scholar<span aria-hidden="true">↗</span>
              </a>
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={17} />
                GitHub
              </a>
              <a href={socialLinks.email} aria-label={copy.email}>
                <Mail size={17} />
                <span>{copy.contact}</span>
              </a>
            </div>
            <a className="explore-link" href="#publications">
              <ArrowDown size={14} />
              {copy.explore}
              <span aria-hidden="true">[↓]</span>
            </a>
          </div>
          <ResearchConsole
            lang={lang}
            focus={focus}
            setFocus={setFocus}
            motion={motion}
          />
        </section>
        <div className="research-strip" aria-label={copy.researchBridge}>
          <span>
            <span className="status-dot" />
            {copy.researchBridge}
          </span>
          <div>
            <span>OBSERVE</span>
            <i>→</i>
            <span>ALIGN</span>
            <i>→</i>
            <span>UNDERSTAND</span>
          </div>
          <span className="strip-coordinate">VISION · LANGUAGE · EARTH</span>
        </div>
        <div className="content-layout">
          <aside className="sidebar">
            <TerminalBio copy={copy} lang={lang} />
            <section
              className="news-section"
              id="news"
              aria-labelledby="news-heading"
            >
              <div className="section-heading">
                <span className="section-number">02</span>
                <h2 id="news-heading">{copy.news}</h2>
                <span className="heading-rule" />
              </div>
              <ol className="news-list">
                {news.map((item, index) => (
                  <li key={`${item.date}-${index}`}>
                    <div className="news-meta">
                      <time dateTime={item.date.replace(".", "-")}>
                        {item.date}
                      </time>
                      <span>{item[lang].type}</span>
                      {index === 0 && (
                        <span className="new-label">{copy.latest}</span>
                      )}
                    </div>
                    <p>{item[lang].text}</p>
                  </li>
                ))}
              </ol>
            </section>
          </aside>
          <section
            className="publications-section"
            id="publications"
            aria-labelledby="publications-heading"
          >
            <div className="section-heading">
              <span className="section-number">03</span>
              <h2 id="publications-heading">{copy.publications}</h2>
              <span className="heading-rule" />
              <span className="section-count">
                [{String(publications.length).padStart(2, "0")}]
              </span>
            </div>
            <p className="section-caption">{copy.publicationsIntro}</p>
            <div className="publication-list">
              {publications.map((paper, index) => (
                <PublicationCard
                  key={paper.id}
                  {...{ paper, lang, index, copy, motion }}
                />
              ))}
            </div>
            <a
              className="scholar-footer"
              href={socialLinks.scholar}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GraduationCap size={17} />
              {copy.scholarMore}
              <span aria-hidden="true">↗</span>
            </a>
          </section>
        </div>
        <footer className="site-footer">
          <a href="#top">
            ZS / GEO_LAB
            <span className="status-dot" />
          </a>
          <span>{copy.footer}</span>
          <span>COMPUTER VISION × EARTH OBSERVATION</span>
        </footer>
      </main>
      <DisplayControls {...preferences} copy={copy} />
    </div>
  );
}
