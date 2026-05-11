import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRegion, getRegions, PARTY_COLORS } from '@/lib/data';
import SurveyDetail from '@/app/SurveyDetail';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return getRegions().map((r) => ({ code: r.code }));
}

export async function generateMetadata({
  params,
}: {
  params: { code: string };
}): Promise<Metadata> {
  const region = getRegion(params.code);
  if (!region) return {};
  return {
    title: `${region.position} 후보 지지율`,
    description: `2026년 6월 3일 지방선거 ${region.name} ${region.position} 후보별 여론조사 결과`,
  };
}

export default function RegionPage({ params }: { params: { code: string } }) {
  const region = getRegion(params.code);
  if (!region) notFound();

  const latest = region.surveys[0];

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b-2 border-stone-900 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
          <Link
            href="/local"
            className="font-serif text-xs text-stone-500 hover:text-stone-900"
          >
            ← 17개 시도 전체
          </Link>
          <p className="mt-3 font-serif text-xs tracking-[0.3em] text-stone-500">
            2026.06.03 지방선거
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight md:text-5xl">
            {region.position}
          </h1>
          <p className="mt-2 text-sm text-stone-600">{region.name}</p>
          {region.note && (
            <p className="mt-3 inline-block rounded bg-amber-50 px-3 py-1 text-xs text-amber-900">
              ⓘ {region.note}
            </p>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {region.surveys.length === 0 ? (
          <div className="rounded border border-stone-200 bg-white p-8 md:p-10">
            {region.statusMessage ? (
              <>
                <p className="font-serif text-xs tracking-[0.2em] text-stone-500">
                  {region.status === 'candidates_pending'
                    ? '🗳 후보 확정 진행 중'
                    : '📭 조사 등록 대기'}
                </p>
                <p className="mt-3 font-serif text-xl font-bold md:text-2xl">
                  {region.statusMessage}
                </p>
                {region.statusDetail && (
                  <p className="mt-4 text-sm leading-relaxed text-stone-600">
                    {region.statusDetail}
                  </p>
                )}
                <p className="mt-6 text-xs text-stone-500">
                  새로운 조사가 NESDC에 등록되면 업데이트됩니다.
                </p>
              </>
            ) : (
              <div className="text-center">
                <p className="font-serif text-lg font-bold">아직 등록된 조사가 없습니다</p>
                <p className="mt-2 text-sm text-stone-600">
                  후보군이 확정되지 않았거나 공표된 여론조사가 없는 지역입니다.
                </p>
              </div>
            )}
            <Link
              href="/"
              className="mt-6 inline-block border border-stone-900 px-4 py-2 text-sm hover:bg-stone-900 hover:text-white"
            >
              지도에서 다른 지역 보기
            </Link>
          </div>
        ) : (
          <>
            {/* 최신 결과 */}
            <section className="mb-10">
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-serif text-xl font-bold md:text-2xl">최신 조사</h2>
                <p className="text-xs text-stone-500 md:text-sm">
                  {latest.agency}
                  {latest.client && ` · ${latest.client}`} · {latest.startDate} ~{' '}
                  {latest.endDate}
                </p>
              </div>

              <div className="space-y-2">
                {[...latest.candidates]
                  .sort((a, b) => b.rating - a.rating)
                  .map((c, i) => {
                    const max = Math.max(...latest.candidates.map((x) => x.rating));
                    const color = PARTY_COLORS[c.party] || '#9CA3AF';
                    return (
                      <div
                        key={`${c.name}-${i}`}
                        className="rounded border border-stone-200 bg-white p-4"
                      >
                        <div className="flex items-baseline justify-between">
                          <div>
                            <p className="font-serif text-xl font-bold">{c.name}</p>
                            <p
                              className="text-xs font-medium"
                              style={{ color }}
                            >
                              {c.party}
                            </p>
                          </div>
                          <p className="font-serif text-3xl font-bold">
                            {c.rating}
                            <span className="text-base font-normal text-stone-500">
                              %
                            </span>
                          </p>
                        </div>
                        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-stone-100">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${(c.rating / max) * 100}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>

              <SurveyDetail survey={latest} />
            </section>

            {/* 전체 조사 목록 */}
            {region.surveys.length > 1 && (
              <section>
                <h2 className="mb-4 font-serif text-xl font-bold md:text-2xl">
                  이전 조사
                </h2>
                <div className="space-y-3">
                  {region.surveys.slice(1).map((s) => (
                    <div
                      key={s.id}
                      className="rounded border border-stone-200 bg-white p-4"
                    >
                      <div className="flex items-baseline justify-between">
                        <p className="text-sm font-medium">{s.agency}</p>
                        <p className="text-xs text-stone-500">
                          {s.startDate} ~ {s.endDate}
                        </p>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {s.candidates.map((c) => (
                          <div
                            key={c.name}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span
                              className="inline-block h-2 w-2 rounded-full"
                              style={{
                                backgroundColor: PARTY_COLORS[c.party] || '#9CA3AF',
                              }}
                            />
                            <span className="font-medium">{c.name}</span>
                            <span className="text-stone-600">{c.rating}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
