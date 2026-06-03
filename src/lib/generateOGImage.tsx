import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';

export type OGSection = 'home' | 'blog' | 'til' | 'works' | 'careers';

const ACCENT: Record<OGSection, string> = {
  home: '#2563eb',
  blog: '#2563eb',
  til: '#10b981',
  works: '#7c3aed',
  careers: '#d97706',
};

const SECTION_LABEL: Record<OGSection, string> = {
  home: 'gitsunmin.github.io',
  blog: 'Blog',
  til: 'TIL',
  works: 'Works',
  careers: 'Careers',
};

const BG = '#060d1f';
const TEXT_PRIMARY = '#f1f5f9';
const TEXT_MUTED = '#94a3b8';

export interface OGImageOptions {
  title: string;
  description?: string;
  tags?: string[];
  section: OGSection;
  subtitle?: string;
}

let _fontBold: ArrayBuffer | null = null;
let _fontRegular: ArrayBuffer | null = null;

function getFontBold(): ArrayBuffer {
  if (_fontBold) return _fontBold;
  _fontBold = readFileSync(resolve(process.cwd(), 'node_modules/pretendard/dist/public/static/alternative/Pretendard-Bold.ttf')).buffer as ArrayBuffer;
  return _fontBold;
}

function getFontRegular(): ArrayBuffer {
  if (_fontRegular) return _fontRegular;
  _fontRegular = readFileSync(resolve(process.cwd(), 'node_modules/pretendard/dist/public/static/alternative/Pretendard-Regular.ttf')).buffer as ArrayBuffer;
  return _fontRegular;
}

export async function generateOGImage(options: OGImageOptions): Promise<Uint8Array<ArrayBuffer>> {
  const { title, description, tags = [], section, subtitle } = options;
  const accent = ACCENT[section];
  const sectionLabel = SECTION_LABEL[section];
  const displayTags = tags.slice(0, 3);

  const svg = await satori(
    <div
      style={{
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: BG,
        fontFamily: 'Pretendard',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '5px',
          backgroundColor: accent,
        }}
      />
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
        }}
      />
      {/* Content area */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '64px 72px',
          flex: 1,
          gap: '0px',
        }}
      >
        {/* Section badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <div style={{ width: '6px', height: '24px', backgroundColor: accent, borderRadius: '3px' }} />
          <span
            style={{
              fontSize: '20px',
              color: accent,
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {sectionLabel}
          </span>
        </div>
        {/* Title */}
        <div
          style={{
            fontSize: title.length > 30 ? '46px' : '56px',
            fontWeight: 700,
            color: TEXT_PRIMARY,
            lineHeight: 1.25,
            marginBottom: '20px',
            maxWidth: '900px',
          }}
        >
          {title}
        </div>
        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              fontSize: '28px',
              color: accent,
              fontWeight: 600,
              marginBottom: '16px',
            }}
          >
            {subtitle}
          </div>
        )}
        {/* Description */}
        {description && (
          <div
            style={{
              fontSize: '24px',
              color: TEXT_MUTED,
              lineHeight: 1.5,
              maxWidth: '900px',
              marginBottom: '28px',
            }}
          >
            {description}
          </div>
        )}
        {/* Tags */}
        {displayTags.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', flexWrap: 'wrap' }}>
            {displayTags.map((tag) => (
              <div
                key={tag}
                style={{
                  padding: '6px 16px',
                  borderRadius: '999px',
                  border: `1.5px solid ${accent}66`,
                  backgroundColor: `${accent}18`,
                  fontSize: '18px',
                  color: accent,
                  fontWeight: 600,
                }}
              >
                {`#${tag}`}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Bottom branding bar */}
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          padding: '20px 72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #1e2d4a',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 700,
              color: '#fff',
            }}
          >
            G
          </div>
          <span style={{ fontSize: '18px', color: TEXT_MUTED, fontWeight: 400 }}>
            gitsunmin.github.io
          </span>
        </div>
        <span style={{ fontSize: '16px', color: `${accent}99`, fontWeight: 400 }}>Sunmin Kim</span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Pretendard', data: getFontBold(), weight: 700, style: 'normal' },
        { name: 'Pretendard', data: getFontRegular(), weight: 400, style: 'normal' },
      ],
    },
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  // asPng() returns Uint8Array<ArrayBufferLike>; copy into a plain ArrayBuffer for Response compatibility
  return new Uint8Array(resvg.render().asPng());
}
