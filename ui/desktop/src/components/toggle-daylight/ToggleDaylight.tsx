import React, { useEffect, useRef } from 'react';
import './toggle-daylight.css';
import { mountToggleDaylight, type ToggleDaylightHandle } from './mountToggleDaylight';

export interface ToggleDaylightProps {
  night: boolean;
  onNightChange?: (night: boolean) => void;
  className?: string;
}

const ToggleDaylight: React.FC<ToggleDaylightProps> = ({ night, onNightChange, className = '' }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<ToggleDaylightHandle | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const handle = mountToggleDaylight(root);
    handleRef.current = handle;

    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<{ night: boolean }>).detail;
      onNightChange?.(detail.night);
    };
    root.addEventListener('daylight:change', onChange);

    return () => {
      root.removeEventListener('daylight:change', onChange);
      handle.destroy();
      handleRef.current = null;
    };
  }, [onNightChange]);

  useEffect(() => {
    handleRef.current?.setNight(night);
  }, [night]);

  return (
    <div
      ref={rootRef}
      data-ld-part="toggle-daylight"
      lang="ja"
      className={className}
      style={
        {
          '--ld-bg': 'var(--color-background-secondary)',
          '--ld-surface': 'var(--color-background-tertiary)',
          '--ld-fg': 'var(--color-text-primary)',
          '--ld-muted': 'var(--color-text-secondary)',
          '--ld-accent': 'var(--color-text-warning)',
          '--ld-font': 'var(--font-sans)',
          '--ld-radius': 'var(--border-radius-full)',
          '--ld-space': '8px',
          '--ld-shadow': 'var(--shadow-lg)',
        } as React.CSSProperties
      }
    >
      <canvas className="scene" aria-hidden="true" />
      <button className="hit" type="button" role="switch" aria-checked={night} aria-label={night ? '夜' : '昼'} />
      <span className="vh" role="status" aria-live="polite" data-status />
      <span className="probe" aria-hidden="true" />
    </div>
  );
};

export default ToggleDaylight;
