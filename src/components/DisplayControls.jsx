import { Monitor, Moon, Pause, Play, Sun } from "lucide-react";
import GlassSurface from "./GlassSurface";

export default function DisplayControls({
  themePreference,
  setThemePreference,
  motionPaused,
  setMotionPaused,
  reducedMotion,
  motion,
  copy,
}) {
  return (
    <GlassSurface
      className="display-dock"
      role="group"
      aria-label={copy.display}
      motion={motion}
    >
      <div
        className="theme-segments"
        style={{
          "--selected": ["light", "dark", "system"].indexOf(themePreference),
        }}
      >
        <span className="liquid-selection" aria-hidden="true" />
        {[
          ["light", Sun, copy.light],
          ["dark", Moon, copy.dark],
          ["system", Monitor, copy.system],
        ].map(([value, Icon, label]) => (
          <button
            key={value}
            aria-pressed={themePreference === value}
            onClick={() => setThemePreference(value)}
            title={label}
          >
            <Icon size={15} />
            <span>{label}</span>
          </button>
        ))}
      </div>
      <span className="dock-divider" />
      <button
        className="motion-toggle"
        aria-label={
          reducedMotion ? copy.reduced : motionPaused ? copy.play : copy.pause
        }
        title={
          reducedMotion ? copy.reduced : motionPaused ? copy.play : copy.pause
        }
        disabled={reducedMotion}
        aria-pressed={motionPaused || reducedMotion}
        onClick={() => setMotionPaused(!motionPaused)}
      >
        {motionPaused || reducedMotion ? (
          <Play size={15} />
        ) : (
          <Pause size={15} />
        )}
      </button>
    </GlassSurface>
  );
}
