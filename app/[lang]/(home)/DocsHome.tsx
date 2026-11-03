'use client';

import Link from 'next/link';

const SITE = 'https://omniscout.xyz';

export default function DocsHome({ lang }: { lang: string }) {
  const docs = `/${lang}/docs`;
  return (
    <div className="[font-synthesis:none] wrap-anywhere w-full flex-1 flex flex-col items-center justify-center overflow-clip bg-cover bg-center antialiased text-xs/4 px-4 py-16" style={{ backgroundImage: 'url(https://app.paper.design/file-assets/01M16JXFD1XBQT682ENPKJENHD/01M34KPC6657ZFBK7FKJ91373X.png)' }}>
      <div className="flex flex-col items-center justify-center">
        <div className="text-[48px] md:text-[91px] [letter-spacing:-1.6px] leading-[98%] whitespace-nowrap font-['Inter',system-ui,sans-serif] font-medium text-[#282828] text-center">
          OmniScout Docs
        </div>
        <div className="items-center flex flex-wrap justify-center mt-8 gap-x-6 gap-y-4">
          <Link href={docs} className="flex">
            <div className="h-10 shrink-0 px-[18.62px] rounded-full relative">
              <div className="[right:-0.383px] [left:-0.383px] absolute rounded-full bg-[#181818] inset-y-0" />
              <div className="items-center flex justify-center gap-1.5 relative size-full">
                <div className="inline-block text-[14px] leading-[100%] w-max font-['Open_Sans',system-ui,sans-serif] font-medium text-white">
                  Documentation
                </div>
                <svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true" fontSize="14px" fontWeight="500" xmlns="http://www.w3.org/2000/svg" style={{ height: '18px', flexShrink: '0', width: '18px', overflow: 'clip' }}>
                  <path fillRule="evenodd" d="M18.707 12.707a1 1 0 0 0 0-1.414l-5-5a1 1 0 1 0-1.414 1.414L15.586 11H6a1 1 0 1 0 0 2h9.586l-3.293 3.293a1 1 0 0 0 1.414 1.414l5-5Z" clipRule="evenodd" fontSize="14px" fontWeight="500" fill="#FFFFFF" style={{ boxSizing: 'border-box', transformOrigin: '0px 0px' }} />
                </svg>
              </div>
            </div>
          </Link>
          <a href={SITE} target="_blank" rel="noopener" className="items-center flex [-webkit-text-decorations-in-effect:underline] gap-2">
            <div className="inline-block text-[15px] leading-[150%] font-['Open_Sans',system-ui,sans-serif] font-semibold underline-offset-4 [text-decoration:underline_1px] text-[#282828]">
              Visit the website
            </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fontSize="15px" fontWeight="600" style={{ height: '18px', flexShrink: '0', width: '18px', overflow: 'clip' }}>
              <path fillRule="evenodd" d="M18.707 12.707a1 1 0 0 0 0-1.414l-5-5a1 1 0 1 0-1.414 1.414L15.586 11H6a1 1 0 1 0 0 2h9.586l-3.293 3.293a1 1 0 0 0 1.414 1.414l5-5Z" clipRule="evenodd" fontSize="15px" fontWeight="600" fill="#282828" style={{ boxSizing: 'border-box', transformOrigin: '0px 0px' }} />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
