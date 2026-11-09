import { getPageImageUrl, source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const revalidate = false;

const ink = '#0a0f12';

// The logo is a padded 1024x1024 canvas with a white mark, so crop the viewBox to
// the mark's bounds and repaint it dark for the light background.
const markViewBox = '184 124 710 778';

async function getLogo() {
  const svg = await readFile(join(process.cwd(), 'public/omniscout.svg'), 'utf8');

  const mark = svg
    .replace('viewBox="0 0 1024 1024"', `viewBox="${markViewBox}"`)
    .replaceAll('rgb(255,255,255)', ink);

  return `data:image/svg+xml;base64,${Buffer.from(mark).toString('base64')}`;
}

async function getBackground() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="0.35">
      <stop offset="0" stop-color="#eafdfd"/>
      <stop offset="0.3" stop-color="#d3fafb"/>
      <stop offset="0.62" stop-color="#b0f0fd"/>
      <stop offset="0.85" stop-color="#6cdffb"/>
      <stop offset="1" stop-color="#34ccfa"/>
    </linearGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="26"/>
    </filter>
    <filter id="haze" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="70"/>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#sky)"/>
  <g filter="url(#soft)">
    <ellipse cx="620" cy="60" rx="620" ry="46" fill="#ffffff" opacity="0.5" transform="rotate(-5 620 60)"/>
    <ellipse cx="1180" cy="230" rx="560" ry="40" fill="#0fbdfa" opacity="0.35" transform="rotate(-11 1180 230)"/>
    <ellipse cx="1000" cy="170" rx="520" ry="24" fill="#ffffff" opacity="0.55" transform="rotate(-9 1000 170)"/>
    <ellipse cx="940" cy="300" rx="620" ry="22" fill="#ffffff" opacity="0.45" transform="rotate(-10 940 300)"/>
    <ellipse cx="1180" cy="410" rx="680" ry="30" fill="#ffffff" opacity="0.9" transform="rotate(-12 1180 410)"/>
    <ellipse cx="1050" cy="520" rx="620" ry="42" fill="#22cbfb" opacity="0.45" transform="rotate(-12 1050 520)"/>
  </g>
  <g filter="url(#haze)">
    <ellipse cx="200" cy="520" rx="560" ry="240" fill="#ffffff" opacity="0.75"/>
    <ellipse cx="120" cy="140" rx="360" ry="180" fill="#ffffff" opacity="0.5"/>
  </g>
</svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

function getTitleSize(title: string) {
  if (title.length > 34) return 68;
  if (title.length > 22) return 82;
  return 104;
}

function OgCard({ title, logo, background }: { title: string; logo: string; background: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        padding: '40px 56px 62px',
        backgroundColor: '#d9f7fc',
        color: ink,
      }}
    >
      <img
        src={background}
        alt=""
        width={1200}
        height={630}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src={logo} alt="" width={62} height={66} style={{ objectFit: 'contain' }} />
        <span style={{ fontSize: '58px', fontWeight: 800, letterSpacing: '-0.04em' }}>
          OmniScout Docs
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          marginTop: 'auto',
          fontSize: getTitleSize(title),
          fontWeight: 800,
          lineHeight: 1.02,
          letterSpacing: '-0.04em',
          paddingBottom: '8px',
          lineClamp: 3,
        }}
      >
        {title}
      </div>
    </div>
  );
}

export async function GET(_req: Request, { params }: RouteContext<'/og/docs/[...slug]'>) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  const [logo, background, font] = await Promise.all([
    getLogo(),
    getBackground(),
    readFile(join(process.cwd(), 'app/og/fonts/inter-800.woff')),
  ]);

  return new ImageResponse(
    <OgCard title={page.data.title} logo={logo} background={background} />,
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Inter', data: font, weight: 800, style: 'normal' }],
    },
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImageUrl(page).segments,
  }));
}
