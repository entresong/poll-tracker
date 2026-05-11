import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '2026 지방선거 지지율 한눈에 | 폴트래커',
    template: '%s | 폴트래커',
  },
  description:
    '2026년 6월 3일 지방선거 17개 시도 광역단체장 후보 지지율을 지도에서 한눈에. 정당 지지율도 함께 확인하세요.',
  keywords: [
    '지방선거',
    '여론조사',
    '서울시장',
    '경기도지사',
    '광역단체장',
    '정당 지지율',
    '2026 지방선거',
  ],
  openGraph: {
    title: '2026 지방선거 지지율 한눈에',
    description:
      '17개 시도 광역단체장 후보 지지율을 지도에서 확인하세요',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <nav className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-serif text-lg font-bold tracking-tight">
              폴트래커
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/" className="text-stone-700 hover:text-stone-900">
                지방선거
              </Link>
              <Link href="/party" className="text-stone-700 hover:text-stone-900">
                정당 지지율
              </Link>
            </div>
          </div>
        </nav>
        {children}
        <footer className="border-t border-stone-200 bg-stone-50 py-8">
          <div className="mx-auto max-w-6xl px-4 text-xs leading-relaxed text-stone-500">
            <p>
              여론조사 데이터 출처: 중앙선거여론조사심의위원회(nesdc.go.kr) 등록 자료.
              자세한 조사 개요는 각 조사의 상세 정보를 참고하세요.
            </p>
            <p className="mt-2">
              본 사이트는 정보 제공 목적이며 특정 정당·후보를 지지하지 않습니다.
              공직선거법에 따라 선거 6일 전부터 선거일까지의 신규 조사 결과 공표는 제한됩니다.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
