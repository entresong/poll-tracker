import Link from 'next/link';
import { getPartySurveys, getRegions, PARTY_COLORS } from '@/lib/data';
import PartyTrendChart from './PartyTrendChart';
import SurveyDetail from '@/app/SurveyDetail';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '정당 지지율',
  description:
    '한국 정당 지지율을 한곳에서 확인하세요. 더불어민주당, 국민의힘, 조국혁신당, 개혁신당 등 주요 정당의 최신 여론조사 결과.',
};

export default function Home() {
  const surveys = getPartySurveys();
  const latest = surveys[0];
  const sortedParties = latest
    ? Object.entries(latest.ratings).sort((a, b) => b[1] - a[1])
    : [];
  const regions = getRegions();

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b-2 border-stone-900 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
          <p className="font-serif text-xs tracking-[0.3em] text-stone-500">
            POLL TRACKER · 한국 여론조사
          </p>
          <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight md:text-5xl">
            정당 지지율
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-stone-600 md:text-base">
            중앙선거여론조사심의위원회에 등록된 여론조사 결과를 정리합니다.
            지방선거 후보 지지율은{' '}
            <Link href="/local" className="underline underline-offset-2">
              지방선거 페이지
            </Link>
            에서 확인하세요.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* 최신 결과 */}
        <section className="mb-12">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-serif text-xl font-bold md:text-2xl">최신 조사</h2>
            <p className="text-xs text-stone-500 md:text-sm">
              {latest.agency} · {latest.startDate} ~ {latest.endDate}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
            {sortedParties.map(([party, rating]) => (
              <div
                key={party}
                className="border-l-4 bg-white p-3 shadow-sm md:p-4"
                style={{ borderColor: PARTY_COLORS[party] || '#9CA3AF' }}
              >
                <p className="text-xs font-medium text-stone-600">{party}</p>
                <p className="mt-1 font-serif text-2xl font-bold md:text-3xl">
                  {rating}
                  <span className="text-sm font-normal text-stone-500">%</span>
                </p>
              </div>
            ))}
          </div>

          <SurveyDetail survey={latest} />
        </section>

        {/* 추이 차트 */}
        <section className="mb-12 rounded bg-white p-4 shadow-sm md:p-6">
          <h2 className="mb-4 font-serif text-xl font-bold md:text-2xl">지지율 추이</h2>
          <PartyTrendChart surveys={surveys} />
        </section>

        {/* 지방선거 빠른 진입 */}
        <section className="mb-12 rounded border border-stone-900 bg-stone-900 p-6 text-white">
          <p className="font-serif text-xs tracking-[0.3em] text-stone-400">
            2026.06.03 지방선거
          </p>
          <h2 className="mt-2 font-serif text-xl font-bold md:text-2xl">
            17개 시도 광역단체장 후보 지지율
          </h2>
          <p className="mt-2 text-sm text-stone-300">
            전국 광역단체장 선거 후보별 여론조사를 지역별로 모았습니다.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-2 md:grid-cols-6">
            {regions.map((r) => (
              <Link
                key={r.code}
                href={`/local/${r.code}`}
                className="border border-stone-700 px-3 py-2 text-center text-xs transition hover:border-white hover:bg-stone-800 md:text-sm"
              >
                {r.shortName}
              </Link>
            ))}
          </div>
          <Link
            href="/local"
            className="mt-6 inline-block text-sm underline underline-offset-4"
          >
            전체 지방선거 보기 →
          </Link>
        </section>

        {/* 조사 목록 */}
        <section>
          <h2 className="mb-4 font-serif text-xl font-bold md:text-2xl">조사 목록</h2>
          <div className="overflow-x-auto rounded bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-stone-300 text-left">
                <tr>
                  <th className="px-3 py-3 font-medium md:px-4">조사일</th>
                  <th className="px-3 py-3 font-medium md:px-4">기관</th>
                  <th className="hidden px-3 py-3 font-medium md:table-cell md:px-4">
                    표본수
                  </th>
                  <th className="hidden px-3 py-3 font-medium md:table-cell md:px-4">
                    방법
                  </th>
                  <th className="px-3 py-3 font-medium md:px-4">민주</th>
                  <th className="px-3 py-3 font-medium md:px-4">국힘</th>
                </tr>
              </thead>
              <tbody>
                {surveys.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-stone-100 hover:bg-stone-50"
                  >
                    <td className="px-3 py-3 text-xs md:px-4 md:text-sm">{s.endDate}</td>
                    <td className="px-3 py-3 font-medium md:px-4">{s.agency}</td>
                    <td className="hidden px-3 py-3 md:table-cell md:px-4">
                      {s.sampleSize.toLocaleString()}
                    </td>
                    <td className="hidden px-3 py-3 md:table-cell md:px-4">
                      {s.method === 'CATI' ? '전화면접' : s.method}
                    </td>
                    <td className="px-3 py-3 font-medium md:px-4" style={{ color: PARTY_COLORS['더불어민주당'] }}>
                      {s.ratings['더불어민주당']}%
                    </td>
                    <td className="px-3 py-3 font-medium md:px-4" style={{ color: PARTY_COLORS['국민의힘'] }}>
                      {s.ratings['국민의힘']}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
