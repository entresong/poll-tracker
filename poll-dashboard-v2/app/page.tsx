import Link from 'next/link';
import { getRegions, PARTY_COLORS } from '@/lib/data';
import KoreaMap from '@/app/KoreaMap';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '2026 지방선거 17개 시도 후보 지지율 한눈에',
  description:
    '2026년 6월 3일 제9회 전국동시지방선거. 광역·기초자치단체장 후보별 지지율을 격자에서 한눈에 확인하세요.',
};

export default function Home() {
  const regions = getRegions();
  const surveyedCount = regions.filter((r) => r.surveys.length > 0).length;
  const candidatesPending = regions.filter(
    (r) => r.status === 'candidates_pending'
  ).length;

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b-2 border-stone-900 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
          <p className="font-serif text-xs tracking-[0.3em] text-stone-500">
            2026.06.03 · 제9회 전국동시지방선거
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight md:text-5xl">
            지방선거 광역단체장
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-stone-600 md:text-base">
            격자에서 지역을 클릭하면 광역단체장·기초자치단체장(일부 시군구
            샘플) 정보와 최신 지지율을 확인할 수 있습니다. 색상은 광역 1위
            후보의 정당입니다.
          </p>
          <p className="mt-2 text-xs text-stone-500">
            등록된 조사 {surveyedCount}곳 · 후보 확정 진행 중 {candidatesPending}곳 ·{' '}
            <Link href="/party" className="underline underline-offset-2">
              정당 지지율 보기 →
            </Link>
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <KoreaMap regions={regions} />

        {/* 지역별 리스트 (지도 아래) */}
        <section className="mt-12">
          <h2 className="mb-4 font-serif text-xl font-bold md:text-2xl">
            지역별 목록
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {regions.map((r) => {
              const latest = r.surveys[0];
              const top = latest
                ? [...latest.candidates].sort((a, b) => b.rating - a.rating)[0]
                : undefined;

              return (
                <Link
                  key={r.code}
                  href={`/local/${r.code}`}
                  className="group block rounded border border-stone-200 bg-white p-4 transition hover:border-stone-900 hover:shadow-md"
                >
                  <p className="font-serif text-base font-bold">{r.name}</p>
                  <p className="text-xs text-stone-500">{r.position}</p>
                  {r.municipalities.length > 0 && (
                    <p className="mt-1 text-[10px] text-stone-400">
                      기초자치단체 샘플 {r.municipalities.length}곳
                    </p>
                  )}

                  {top ? (
                    <div className="mt-3 border-t border-stone-100 pt-3">
                      <p
                        className="font-serif text-lg font-bold"
                        style={{ color: PARTY_COLORS[top.party] || '#1c1917' }}
                      >
                        {top.name}
                        <span className="ml-1 text-sm font-normal text-stone-600">
                          {top.rating}%
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-stone-500">
                        {latest.agency}
                      </p>
                    </div>
                  ) : r.statusMessage ? (
                    <div className="mt-3 border-t border-stone-100 pt-3">
                      <p className="text-xs font-medium text-stone-400">
                        {r.status === 'candidates_pending' ? '🗳' : '📭'}{' '}
                        {r.statusMessage}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-3 border-t border-stone-100 pt-3 text-xs text-stone-400">
                      등록된 조사 없음
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </section>

        {/* 데이터 안내 */}
        <div className="mt-10 rounded border border-stone-200 bg-white p-5 text-sm text-stone-600">
          <p className="font-medium text-stone-900">📌 데이터 출처</p>
          <p className="mt-2 leading-relaxed">
            한국갤럽(세계일보), 조원씨앤아이(스트레이트뉴스), 에이스리서치(부산일보·강원일보),
            여론조사꽃 등 2026년 4-5월 공표 조사 기준입니다.
            자세한 조사 개요는 중앙선거여론조사심의위원회(nesdc.go.kr)에서 확인할 수 있습니다.
          </p>
          <p className="mt-2 text-xs text-stone-500">
            ※ 후보 명단은 후보자 등록 마감일(2026년 5월 15일) 이후 변동될 수 있습니다.
          </p>
        </div>
      </div>
    </main>
  );
}
