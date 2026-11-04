import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { createI18nMiddleware } from 'fumadocs-core/i18n/middleware';
import { isMarkdownPreferred } from 'fumadocs-core/negotiation';
import { languageCodes } from '@/lib/i18n';
import { docsContentRoute } from '@/lib/shared';

const i18nMiddleware = createI18nMiddleware({
  defaultLanguage: 'en',
  languages: [...languageCodes],
});
const langPrefix = `(${languageCodes.join('|')})`;

export default async function proxy(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  // static assets pass through untouched
  if (/\.(svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?|ttf|eot|otf|pdf|xml|mp4|webm|map)$/i.test(pathname)) {
    return NextResponse.next();
  }

  // SEO metadata routes must never get a locale prefix
  if (pathname === '/robots.txt' || pathname === '/sitemap.xml') {
    return NextResponse.next();
  }

  // legacy: unprefixed docs URLs -> default locale
  if (pathname === '/docs' || pathname.startsWith('/docs/')) {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
  }

  // legacy: old docs URLs -> current locations (folders: search, automation)
  const moved: Record<string, string> = {
    // search group
    '/search': '/search/search',
    '/extraction': '/search/extraction',
    '/research': '/search/research',
    '/memory': '/search/memory',
    // automation group
    '/browser': '/automation/browser',
    '/computer': '/automation/computer',
    '/sessions': '/automation/sessions',
    '/workflows': '/automation/workflows',
    // removed page
    '/architecture': '/overview',
    // previously nested cloud URLs (briefly lived under /docs/cloud/*)
    '/cloud/authentication': '/authentication',
    '/cloud/billing': '/billing',
    '/cloud/endpoints': '/endpoints',
    '/cloud/errors': '/errors',
    '/cloud/rate-limits': '/rate-limits',
    '/cloud/sdks': '/sdks',
    '/cloud/quickstart': '/cloud-quickstart',
  };
  const legacyDocs = pathname.match(/^\/en(\/docs)?\/(cli|api|sdk)(\/.*)?$/);
  if (legacyDocs) {
    const [, , group, rest = ''] = legacyDocs;
    // normalize old section prefixes to flat names first
    let flat = rest;
    if (group === 'api') {
      if (!rest || rest === '/') flat = '/cloud';
      else if (rest === '/quickstart') flat = '/cloud-quickstart';
    } else if (group === 'cli') {
      if (!rest || rest === '/') flat = '/cli';
    }
    const target = moved[flat] ? `/en/docs${moved[flat]}` : `/en/docs${flat}`;
    const current = pathname.startsWith('/en/docs') ? pathname : null;
    if (current !== target) {
      return NextResponse.redirect(new URL(target, request.url));
    }
  }
  // direct hits on moved flat URLs (e.g. bookmarks from the flat layout)
  for (const [from, to] of Object.entries(moved)) {
    if (pathname === `/en/docs${from}` || pathname === `/en/docs${from}/`) {
      return NextResponse.redirect(new URL(`/en/docs${to}`, request.url));
    }
  }

  const res = await i18nMiddleware(request, event);
  if (res && res.headers.get('location')) return res;

  // per-page markdown: /{lang}/docs/...[.md] -> /llms.mdx/docs/.../content.md
  const localized = pathname.match(new RegExp(`^/${langPrefix}(/docs(|/.*))$`));
  if (localized) {
    const isMd = pathname.endsWith('.md');
    let slug = localized[2].replace(/^\/docs/, '').replace(/\/$/, '');
    if (isMd) slug = slug.replace(/\.md$/, '');
    const target = `${docsContentRoute}${slug}/content.md`;

    if (isMd) {
      return NextResponse.rewrite(new URL(target, request.url));
    }

    if (isMarkdownPreferred(request)) {
      return NextResponse.rewrite(new URL(target, request.url), {
        // this URL has two representations, selected by `Accept`
        headers: { Vary: 'Accept' },
      });
    }
  }

  // Point clients at the markdown twin of this page and at /llms.txt, so an
  // agent can discover both without guessing URLs.
  const response = res ?? NextResponse.next();
  if (/^\/[^/]+\/docs(\/|$)/.test(pathname)) {
    response.headers.set(
      'Link',
      `<${pathname}.md>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"`,
    );
  } else {
    response.headers.set('Link', '</llms.txt>; rel="describedby"');
  }
  return response;
}

export const config = {
  // skip API routes and generated text/image routes (static assets are handled in code)
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico|llms\\.txt|llms-full\\.txt|llms\\.mdx|og).*)'],
};
