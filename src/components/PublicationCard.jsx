import { ArrowUpRight, BookOpen, ExternalLink, Github } from "lucide-react";
import GlassSurface from "./GlassSurface";

export default function PublicationCard({ paper, lang, index, copy, motion }) {
  const content = paper[lang];
  const links = [
    {
      href: paper.links.pdf,
      icon: BookOpen,
      label: paper.links.pdf?.includes("doi.org") ? copy.doi : copy.paper,
    },
    { href: paper.links.code, icon: Github, label: copy.code },
    { href: paper.links.project, icon: ExternalLink, label: copy.project },
  ].filter(({ href }) => href && href !== "#");
  return (
    <GlassSurface
      as="article"
      className={`publication-card ${index === 0 ? "featured" : ""}`}
      motion={motion}
    >
      <div className="publication-topline">
        <span className="paper-index">
          PUBLICATION_{String(index + 1).padStart(2, "0")}
        </span>
        <time dateTime={paper.id}>{paper.id.replace("-", ".")}</time>
      </div>
      <h3>
        {links.length > 0 ? (
          <a href={links[0].href} target="_blank" rel="noopener noreferrer">
            {content.title}
            <ArrowUpRight size={20} aria-hidden="true" />
          </a>
        ) : (
          content.title
        )}
      </h3>
      <p className="paper-venue">
        <span />
        {content.venue}
      </p>
      <p className="paper-description">{content.desc}</p>
      <ul className="paper-tags">
        {content.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      {links.length > 0 && (
        <div className="paper-links">
          {links.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon size={15} />
              {label}
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          ))}
        </div>
      )}
      <span className="card-corner" aria-hidden="true" />
    </GlassSurface>
  );
}
