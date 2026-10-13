import React from 'react';
import { WorkshopProfile } from '../../types';

export interface AppLogoProps {
  /** Optional profile to derive dynamic store name and initials */
  profile?: WorkshopProfile;
  /** Explicit business / store name */
  name?: string;
  /** Explicit preset to set logo initials directly: 'BengkelQu' | 'KedaiQu' | 'RitelQu' | 'KlinikQu' | 'TitipQu' */
  preset?: string;
  /** Explicit initials (e.g. 'UQ', 'BQ', 'KQ', 'RQ', 'KlQ', 'TQ') */
  initials?: string;
  /** Variant preset when initials cannot be determined */
  variant?: 'UQ' | 'BQ' | 'KQ' | 'RQ' | 'KlQ' | 'TQ' | 'auto';
  /** Visual shape: 'circle' (round) or 'rounded' (squircle / rounded card) */
  shape?: 'circle' | 'rounded';
  /** Size dimension presets */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Show version badge underneath or adjacent */
  showVersionBadge?: boolean;
  /** Version text */
  versionText?: string;
  /** Invert colors (e.g. White card with green text for headers) */
  inverted?: boolean;
  /** Additional custom class names */
  className?: string;
}

/**
 * Extracts clean, punchy initials from a store or business name
 */
export function getBusinessInitials(name?: string, fallback: string = 'UQ'): string {
  if (!name || !name.trim()) return fallback;

  const clean = name.trim();

  // Ecosystem presets detection
  if (/^bengkel\s*qu/i.test(clean) || /bengkel/i.test(clean)) return 'BQ';
  if (/^kedai\s*qu/i.test(clean) || /kedai/i.test(clean) || /cafe/i.test(clean) || /kopi/i.test(clean)) return 'KQ';
  if (/^ritel\s*qu/i.test(clean) || /ritel/i.test(clean) || /toko/i.test(clean) || /mart/i.test(clean)) return 'RQ';
  if (/^klinik\s*qu/i.test(clean) || /klinik/i.test(clean) || /apotek/i.test(clean) || /medika/i.test(clean)) return 'KlQ';
  if (/^titip\s*qu/i.test(clean) || /titip/i.test(clean) || /konsinyasi/i.test(clean)) return 'TQ';
  if (/^usaha\s*qu/i.test(clean) || /usaha/i.test(clean)) return 'UQ';

  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    const first = words[0].charAt(0).toUpperCase();
    const second = words[1].charAt(0).toUpperCase();
    return `${first}${second}`;
  }

  if (words.length === 1 && words[0].length >= 2) {
    return words[0].substring(0, 2).toUpperCase();
  }

  return fallback;
}

/**
 * Maps a preset string to its signature initials badge
 */
export function getPresetBadge(preset?: string | null): string {
  if (!preset) return 'BQ';
  const clean = preset.toLowerCase();
  if (clean.includes('kedai')) return 'KQ';
  if (clean.includes('ritel') || clean.includes('retail') || clean.includes('toko')) return 'RQ';
  if (clean.includes('klinik') || clean.includes('medika') || clean.includes('apotek')) return 'KlQ';
  if (clean.includes('titip') || clean.includes('konsinyasi')) return 'TQ';
  return 'BQ';
}

export const AppLogo: React.FC<AppLogoProps> = ({
  profile,
  name,
  preset,
  initials,
  variant = 'auto',
  shape = 'rounded',
  size = 'md',
  showVersionBadge = false,
  versionText = 'v1.61',
  inverted = false,
  className = ''
}) => {
  // Resolve business name dynamically from profile or fallback
  const storeName = name || profile?.workshopName || 'UsahaQu Bengkel';

  // Resolve dynamic initials from preset, explicit prop, or storeName
  const activePresetKey = preset || profile?.selectedPreset;
  const displayInitials = initials || (
    activePresetKey ? getPresetBadge(activePresetKey) :
    variant !== 'auto' && variant !== 'UQ' ? variant :
    getBusinessInitials(storeName, variant === 'UQ' ? 'UQ' : 'BQ')
  );

  // Size styling maps
  const sizeClasses = {
    xs: 'w-7 h-7 text-[11px]',
    sm: 'w-9 h-9 text-xs',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-20 h-20 text-2xl',
    '2xl': 'w-24 h-24 text-3xl'
  };

  const roundedClasses = {
    circle: 'rounded-full',
    rounded: size === 'xs' || size === 'sm' ? 'rounded-xl' : size === 'md' ? 'rounded-2xl' : 'rounded-3xl'
  };

  // Color schemes: standard solid green with crisp white text, or inverted (white card, green text)
  const colorClasses = inverted
    ? 'bg-white text-[#008952] shadow-md ring-2 ring-emerald-300/40'
    : 'bg-gradient-to-br from-[#00965a] to-[#007847] text-white shadow-lg shadow-emerald-950/20 ring-4 ring-emerald-500/20';

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {/* Aesthetic Logo Container */}
      <div
        className={`
          ${sizeClasses[size]}
          ${roundedClasses[shape]}
          ${colorClasses}
          flex items-center justify-center font-black tracking-tight select-none
          transition-transform duration-200
        `}
      >
        <span className="leading-none drop-shadow-xs">{displayInitials}</span>
      </div>

      {/* Optional version badge */}
      {showVersionBadge && (
        <span className="absolute -bottom-1 -right-1 bg-white text-[#008952] text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs border border-emerald-200">
          {versionText}
        </span>
      )}
    </div>
  );
};
