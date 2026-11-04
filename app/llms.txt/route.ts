import { getLLMText, source } from '@/lib/source';

export const revalidate = false;

const INSTALLATION_SLUG = 'installation';
const BASE_URL = 'https://docs.omniscout.xyz';

type Page = (typeof source)['$inferPage'];

/**
 * Processed markdown replaces local images with `__img0`, `__img1` placeholders.
 * Swap them back for absolute URLs so the file is readable outside the site.
 */
function withImageUrls(text: string, urls: string[]) {
  return text.replace(/__img(\d+)/g, (placeholder, index) => {
    const url = urls[Number(index)];
    if (!url) return placeholder;

    return url.startsWith('/') ? `${BASE_URL}${url}` : url;
  });
}

/**
 * Turn MDX-only syntax into plain Markdown: JSX components, heading anchors,
 * and the extra blank lines left behind by stripped imports.
 */
function toMarkdown(text: string) {
  return text
    .replace(/<img\b[^>]*\balt="([^"]*)"[^>]*\bsrc="([^"]*)"[^>]*\/>/g, '![$1]($2)')
    .replace(/<iframe\b[^>]*\bsrc="([^"]*)"[^>]*\/>/g, (_match, src: string) => {
      const video = src.replace('/embed/', '/watch?v=');

      return `[Watch the video](${video})`;
    })
    .replace(/^(#{1,6} .+?) \[#[^\]]+\]$/gm, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function getInstallationMarkdown(page: Page) {
  const [text, raw] = await Promise.all([getLLMText(page), page.data.getText('raw')]);
  const imageUrls = Array.from(raw.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g), (match) => match[1]);

  return toMarkdown(withImageUrls(text, imageUrls));
}

export async function GET() {
  const page = source
    .getPages()
    .find((item) => item.locale === 'en' && item.slugs.join('/') === INSTALLATION_SLUG);

  if (!page) {
    return new Response('# Installation\n\nPage not found.', { status: 404 });
  }

  return new Response(await getInstallationMarkdown(page), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
