'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Region, PARTY_COLORS, formatMethod } from '@/lib/data';

const GRID_ROWS = 6;
const GRID_COLS = 7;
const NO_SURVEY_BG = '#d6d3d1';
const MOBILE_DEFAULT_CODE = 'seoul';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return isMobile;
}

function useRegionIndex(regions: Region[]) {
  return useMemo(() => {
    const map = new Map<string, Region>();
    regions.forEach((r) => map.set(r.code, r));
    return map;
  }, [regions]);
}

function getTopCandidate(region: Region) {
  const latest = region.surveys[0] ?? null;
  if (!latest) return { latest: null as Region['surveys'][0] | null, top: null };
  const top = [...latest.candidates].sort((a, b) => b.rating - a.rating)[0];
  return { latest, top };
}

export default function KoreaMap({ regions }: { regions: Region[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile && selected === null) {
      setSelected(MOBILE_DEFAULT_CODE);
    }
  }, [isMobile, selected]);

  const byCode = useRegionIndex(regions);

  const selectedData = selected ? byCode.get(selected) : undefined;
  const selectedPayload = selectedData
    ? (() => {
        const { latest, top } = getTopCandidate(selectedData);
        return { region: selectedData, latest, top };
      })()
    : null;

  return (
    <section className="flex flex-col gap-3 max-md:max-h-[calc(100dvh-10.5rem)] max-md:min-h-0 max-md:overflow-hidden lg:max-h-none lg:overflow-visible">
      <div className="grid min-h-0 gap-3 max-md:flex max-md:flex-1 max-md:flex-col lg:grid-cols-5 lg:gap-6">
        {/* 좌(모바일: 상단): 격자 + 범례 */}
        <div className="flex min-h-0 flex-col gap-2 max-md:flex-1 max-md:min-h-0 lg:col-span-3">
          <div className="flex min-h-0 w-full items-center justify-center max-md:flex-1 max-md:min-h-0">
            <RegionGrid
              regions={regions}
              selected={selected}
              onSelect={setSelected}
            />
          </div>
          <Legend />

          {/* 모바일: 하단 후보 카드 (같은 컬럼) */}
          <div className="min-h-0 shrink-0 lg:hidden">
            {selectedPayload ? (
              <MobileDetailPanel data={selectedPayload} />
            ) : null}
          </div>
        </div>

        {/* 데스크탑: 우측 sticky */}
        <div className="hidden min-h-0 lg:col-span-2 lg:block">
          {selectedPayload ? (
            <DesktopDetailPanel
              data={selectedPayload}
              onClose={() => setSelected(null)}
            />
          ) : (
            <EmptyPanel />
          )}
        </div>
      </div>
    </section>
  );
}

function RegionGrid({
  regions,
  selected,
  onSelect,
}: {
  regions: Region[];
  selected: string | null;
  onSelect: (code: string) => void;
}) {
  const cellMap = useMemo(() => {
    const m = new Map<string, Region>();
    regions.forEach((r) => {
      m.set(`${r.row}-${r.col}`, r);
    });
    return m;
  }, [regions]);

  const cells: { key: string; region: Region | null }[] = [];
  for (let row = 1; row <= GRID_ROWS; row += 1) {
    for (let col = 1; col <= GRID_COLS; col += 1) {
      cells.push({
        key: `${row}-${col}`,
        region: cellMap.get(`${row}-${col}`) ?? null,
      });
    }
  }

  return (
    <div
      className="grid aspect-[7/6] h-full max-h-full w-full max-w-full grid-cols-7 grid-rows-6 gap-1 rounded-lg border-2 border-stone-300 bg-stone-100/80 p-1 transition-[max-height,width,filter] duration-300 ease-out max-md:min-h-0 md:h-auto md:max-h-none md:gap-1.5 md:p-1.5"
      style={{ gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))` }}
    >
      {cells.map(({ key, region }) =>
        region ? (
          <RegionTile
            key={key}
            region={region}
            isSelected={selected === region.code}
            onSelect={() => onSelect(region.code)}
          />
        ) : (
          <div
            key={key}
            className="min-h-0 min-w-0 rounded-md bg-transparent"
            aria-hidden
          />
        )
      )}
    </div>
  );
}

function RegionTile({
  region,
  isSelected,
  onSelect,
}: {
  region: Region;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { top } = getTopCandidate(region);
  const fill = top ? PARTY_COLORS[top.party] || '#78716c' : NO_SURVEY_BG;
  const textClass = top ? 'text-white' : 'text-[#57534e]';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex min-h-0 min-w-0 items-center justify-center rounded-md text-center text-[clamp(0.55rem,2.1vw,0.95rem)] font-bold leading-tight transition-[background-color,filter,transform,outline-color] duration-200 ease-out hover:brightness-110 active:scale-[0.98] md:text-sm ${
        isSelected ? 'z-[1] outline outline-2 outline-offset-[-2px] outline-stone-900' : 'outline-none'
      } ${textClass}`}
      style={{ backgroundColor: fill }}
      aria-pressed={isSelected}
      aria-label={`${region.name} 선택`}
    >
      <span className="px-0.5">{region.shortName}</span>
    </button>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-stone-600 max-md:leading-tight md:text-xs">
      {Object.entries(PARTY_COLORS)
        .filter(([p]) => p !== '무당층' && p !== '진보당')
        .map(([party, color]) => (
          <div key={party} className="flex items-center gap-1">
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm border border-stone-300 md:h-3 md:w-3"
              style={{ backgroundColor: color }}
            />
            <span>{party}</span>
          </div>
        ))}
      <div className="flex items-center gap-1">
        <span
          className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm border border-stone-300 md:h-3 md:w-3"
          style={{ backgroundColor: NO_SURVEY_BG }}
        />
        <span>조사 없음</span>
      </div>
    </div>
  );
}

function CandidateStrip({
  name,
  party,
  rating,
}: {
  name: string;
  party: string;
  rating: number;
}) {
  const border = PARTY_COLORS[party] || '#9CA3AF';
  return (
    <div
      className="flex min-h-0 min-w-0 items-baseline gap-2 rounded-md bg-[#f5f5f4] py-1.5 pl-2 pr-2 text-left transition-opacity duration-200"
      style={{ borderLeftWidth: 3, borderLeftStyle: 'solid', borderLeftColor: border }}
    >
      <span className="shrink-0 truncate font-serif text-sm font-bold text-stone-900 max-md:text-xs">
        {name}
      </span>
      <span className="min-w-0 flex-1 truncate text-xs text-stone-600 max-md:text-[11px]">
        {party}
      </span>
      <span className="shrink-0 font-serif text-sm font-bold tabular-nums text-stone-900 max-md:text-xs">
        {rating}
        <span className="font-normal text-stone-500">%</span>
      </span>
    </div>
  );
}

function EmptyPanel() {
  return (
    <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-300 bg-white p-6 text-center transition-opacity duration-300">
      <p className="font-serif text-lg font-bold text-stone-900">지역을 선택하세요</p>
      <p className="mt-2 text-sm text-stone-500">
        격자에서 지역을 클릭하면
        <br />
        해당 지역의 모든 후보 지지율과
        <br />
        조사 정보를 볼 수 있습니다.
      </p>
    </div>
  );
}

function MobileDetailPanel({
  data,
}: {
  data: {
    region: Region;
    latest: Region['surveys'][0] | null;
    top: { name: string; party: string; rating: number } | null;
  };
}) {
  const { region, latest } = data;

  return (
    <div className="flex min-h-0 flex-col gap-1.5 rounded-lg border-2 border-stone-300 bg-white p-2 transition-opacity duration-300 ease-out max-md:overflow-hidden">
      <div className="shrink-0 border-b border-stone-200 pb-1.5">
        <p className="text-[10px] text-stone-500">{region.position}</p>
        <h3 className="font-serif text-base font-bold leading-tight text-stone-900">
          {region.name}
        </h3>
      </div>

      <div className="min-h-0 flex-1 space-y-1 overflow-hidden">
        {!latest ? (
          <NoSurveyBlock region={region} compact />
        ) : (
          <>
            <p className="truncate text-[10px] text-stone-500">
              {latest.agency}
              {latest.client && ` · ${latest.client}`} · {latest.startDate} ~ {latest.endDate}
            </p>
            <div className="flex flex-col gap-1">
              {[...latest.candidates]
                .sort((a, b) => b.rating - a.rating)
                .map((c) => (
                  <CandidateStrip
                    key={c.name}
                    name={c.name}
                    party={c.party}
                    rating={c.rating}
                  />
                ))}
            </div>
            <Link
              href={`/local/${region.code}`}
              className="mt-1 block rounded border border-stone-900 bg-stone-900 py-1.5 text-center text-xs text-white transition-colors hover:bg-stone-800"
            >
              자세히 보기 →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function DesktopDetailPanel({
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
    <div className="sticky top-20 rounded-lg border-2 border-stone-300 bg-white transition-opacity duration-300 ease-out">
      <div className="flex items-start justify-between border-b border-stone-200 p-4">
        <div>
          <p className="font-serif text-xs text-stone-500">{region.position}</p>
          <h3 className="mt-1 font-serif text-xl font-bold">{region.name}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-stone-400 transition-colors hover:text-stone-900"
          aria-label="닫기"
        >
          ✕
        </button>
      </div>

      <div className="p-4">
        {!latest ? (
          <NoSurveyBlock region={region} />
        ) : (
          <>
            <p className="mb-3 text-xs text-stone-500">
              {latest.agency}
              {latest.client && ` · ${latest.client}`} · {latest.startDate} ~ {latest.endDate}
            </p>

            <div className="flex flex-col gap-2">
              {[...latest.candidates]
                .sort((a, b) => b.rating - a.rating)
                .map((c) => (
                  <CandidateStrip
                    key={c.name}
                    name={c.name}
                    party={c.party}
                    rating={c.rating}
                  />
                ))}
            </div>

            <details className="mt-4 text-xs text-stone-600">
              <summary className="cursor-pointer text-stone-500 underline underline-offset-2">
                조사 개요
              </summary>
              <dl className="mt-2 space-y-1">
                <Row label="표본수" value={`${latest.sampleSize.toLocaleString()}명`} />
                {latest.responseRate != null && (
                  <Row label="응답률" value={`${latest.responseRate}%`} />
                )}
                <Row
                  label="표본오차"
                  value={`±${latest.marginOfError}%p (95% 신뢰수준)`}
                />
                <Row label="조사방법" value={formatMethod(latest.method)} />
              </dl>
            </details>

            <Link
              href={`/local/${region.code}`}
              className="mt-4 block w-full rounded border border-stone-900 bg-stone-900 px-4 py-2 text-center text-sm text-white transition-colors hover:bg-stone-800"
            >
              자세히 보기 →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function NoSurveyBlock({ region, compact }: { region: Region; compact?: boolean }) {
  return (
    <div className={compact ? 'py-1' : 'py-6'}>
      {region.statusMessage ? (
        <div className="rounded border border-stone-200 bg-stone-50 p-3 md:p-4">
          <p className="text-[10px] font-medium text-stone-500 md:text-xs">
            {region.status === 'candidates_pending'
              ? '🗳 후보 확정 진행 중'
              : '📭 조사 등록 대기'}
          </p>
          <p className="mt-1 text-sm font-medium text-stone-900">{region.statusMessage}</p>
          {region.statusDetail && (
            <p className="mt-1 text-[10px] leading-snug text-stone-600 md:text-xs">
              {region.statusDetail}
            </p>
          )}
        </div>
      ) : (
        <p className="text-center text-sm text-stone-500">등록된 조사 없음</p>
      )}
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
