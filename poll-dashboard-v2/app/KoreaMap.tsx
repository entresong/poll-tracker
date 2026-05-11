'use client';

import { useState } from 'react';
import Link from 'next/link';
import svgData from '@/data/korea-svg-paths.json';
import { Region, PARTY_COLORS, formatMethod } from '@/lib/data';

export default function KoreaMap({ regions }: { regions: Region[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  // region code → 최신 조사 + 1위 후보
  const regionData = new Map<
    string,
    {
      region: Region;
      latest: Region['surveys'][0] | null;
      top: { name: string; party: string; rating: number } | null;
    }
  >();
  regions.forEach((r) => {
    const latest = r.surveys[0] ?? null;
    const top = latest
      ? [...latest.candidates].sort((a, b) => b.rating - a.rating)[0]
      : null;
    regionData.set(r.code, { region: r, latest, top });
  });

  const selectedData = selected ? regionData.get(selected) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* 지도 (왼쪽 3열) */}
      <div className="lg:col-span-3">
        <div className="rounded-lg border-2 border-stone-300 bg-white p-2 md:p-4">
          <svg
            viewBox={`0 0 ${svgData.width} ${svgData.height}`}
            className="h-auto w-full"
          >
            {/* 영역 path - 서울은 마지막에 (다른 지역 위에 보이도록) */}
            {[...svgData.paths]
              .sort((a, b) => (a.code === 'seoul' ? 1 : b.code === 'seoul' ? -1 : 0))
              .map((p) => {
              const d = regionData.get(p.code);
              const top = d?.top;
              const isSelected = selected === p.code;
              const isHovered = hovered === p.code;
              const fillColor = top
                ? PARTY_COLORS[top.party] || '#9CA3AF'
                : '#E7E5E4';
              const isSeoul = p.code === 'seoul';

              return (
                <g
                  key={p.code}
                  onMouseEnter={() => setHovered(p.code)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(p.code)}
                  style={{ cursor: 'pointer' }}
                >
                  <path
                    d={p.d}
                    fill={fillColor}
                    stroke={isSelected ? '#1c1917' : isSeoul ? '#1c1917' : '#525252'}
                    strokeWidth={isSelected ? 3 : isHovered ? 2 : isSeoul ? 2 : 1.2}
                    opacity={top ? 1 : 0.5}
                    style={{ transition: 'all 0.15s' }}
                  />
                </g>
              );
            })}

            {/* 라벨 */}
            {svgData.paths.map((p) => {
              const d = regionData.get(p.code);
              const top = d?.top;
              const region = d?.region;
              const [cx, cy] = p.centroid;
              const shortName = region?.shortName || '';

              return (
                <text
                  key={`label-${p.code}`}
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={12}
                  fontWeight={700}
                  fill={top ? '#ffffff' : '#57534e'}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                  stroke={top ? 'rgba(0,0,0,0.3)' : 'none'}
                  strokeWidth={top ? 0.5 : 0}
                  paintOrder="stroke"
                >
                  {shortName}
                </text>
              );
            })}
          </svg>
        </div>

        {/* 범례 */}
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-stone-600">
          {Object.entries(PARTY_COLORS)
            .filter(([p]) => p !== '무당층' && p !== '진보당')
            .map(([party, color]) => (
              <div key={party} className="flex items-center gap-1.5">
                <span
                  className="inline-block h-3 w-3 rounded-sm border border-stone-300"
                  style={{ backgroundColor: color }}
                />
                <span>{party}</span>
              </div>
            ))}
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-sm border border-stone-300"
              style={{ backgroundColor: '#E7E5E4' }}
            />
            <span>조사 없음</span>
          </div>
        </div>
      </div>

      {/* 우측 상세 패널 (오른쪽 2열) */}
      <div className="lg:col-span-2">
        {selectedData ? (
          <DetailPanel data={selectedData} onClose={() => setSelected(null)} />
        ) : (
          <EmptyPanel />
        )}
      </div>
    </div>
  );
}

function EmptyPanel() {
  return (
    <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-300 bg-white p-6 text-center">
      <p className="font-serif text-lg font-bold text-stone-900">
        지역을 선택하세요
      </p>
      <p className="mt-2 text-sm text-stone-500">
        지도에서 지역을 클릭하면<br />
        해당 지역의 모든 후보 지지율과<br />
        조사 정보를 볼 수 있습니다.
      </p>
    </div>
  );
}

function DetailPanel({
  data,
  onClose,
}: {
  data: {
    region: Region;
    latest: Region['surveys'][0] | null;
    top: { name: string; party: string; rating: number } | null;
  };
  onClose: () => void;
}) {
  const { region, latest } = data;

  return (
    <div className="sticky top-20 rounded-lg border-2 border-stone-300 bg-white">
      {/* 헤더 */}
      <div className="flex items-start justify-between border-b border-stone-200 p-4">
        <div>
          <p className="font-serif text-xs text-stone-500">{region.position}</p>
          <h3 className="mt-1 font-serif text-xl font-bold">{region.name}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-stone-900"
          aria-label="닫기"
        >
          ✕
        </button>
      </div>

      {/* 본문 */}
      <div className="p-4">
        {!latest ? (
          <div className="py-6">
            {region.statusMessage ? (
              <div className="rounded border border-stone-200 bg-stone-50 p-4">
                <p className="text-xs font-medium text-stone-500">
                  {region.status === 'candidates_pending'
                    ? '🗳 후보 확정 진행 중'
                    : '📭 조사 등록 대기'}
                </p>
                <p className="mt-2 font-medium text-stone-900">
                  {region.statusMessage}
                </p>
                {region.statusDetail && (
                  <p className="mt-2 text-xs leading-relaxed text-stone-600">
                    {region.statusDetail}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-center text-stone-500">등록된 조사 없음</p>
            )}
          </div>
        ) : (
          <>
            <p className="mb-3 text-xs text-stone-500">
              {latest.agency}
              {latest.client && ` · ${latest.client}`} · {latest.startDate} ~{' '}
              {latest.endDate}
            </p>

            <div className="space-y-2">
              {[...latest.candidates]
                .sort((a, b) => b.rating - a.rating)
                .map((c) => {
                  const max = Math.max(...latest.candidates.map((x) => x.rating));
                  const color = PARTY_COLORS[c.party] || '#9CA3AF';
                  return (
                    <div key={c.name} className="rounded border border-stone-200 p-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <p className="font-serif text-base font-bold">
                            {c.name}
                          </p>
                          <p
                            className="text-xs font-medium"
                            style={{ color }}
                          >
                            {c.party}
                          </p>
                        </div>
                        <p className="font-serif text-2xl font-bold">
                          {c.rating}
                          <span className="text-sm font-normal text-stone-500">
                            %
                          </span>
                        </p>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(c.rating / max) * 100}%`,
                            backgroundColor: color,
                            transition: 'width 0.3s',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* 조사 개요 */}
            <details className="mt-4 text-xs text-stone-600">
              <summary className="cursor-pointer text-stone-500 underline underline-offset-2">
                조사 개요
              </summary>
              <dl className="mt-2 space-y-1">
                <Row label="표본수" value={`${latest.sampleSize.toLocaleString()}명`} />
                {latest.responseRate && (
                  <Row label="응답률" value={`${latest.responseRate}%`} />
                )}
                <Row
                  label="표본오차"
                  value={`±${latest.marginOfError}%p (95% 신뢰수준)`}
                />
                <Row label="조사방법" value={formatMethod(latest.method)} />
              </dl>
            </details>

            {/* 자세히 보기 */}
            <Link
              href={`/local/${region.code}`}
              className="mt-4 block w-full rounded border border-stone-900 bg-stone-900 px-4 py-2 text-center text-sm text-white hover:bg-stone-800"
            >
              자세히 보기 →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-stone-100 py-1">
      <dt className="text-stone-500">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
