'use client';

import { useState } from 'react';
import { PartySurvey, LocalSurvey, formatMethod } from '@/lib/data';

type AnySurvey = PartySurvey | LocalSurvey;

export default function SurveyDetail({ survey }: { survey: AnySurvey }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-3 text-xs text-stone-500 underline underline-offset-4 hover:text-stone-900"
      >
        조사 개요 (표본수 · 표본오차 · 응답률)
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/50 p-0 md:items-center md:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white p-5 shadow-xl md:rounded md:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 font-serif text-lg font-bold md:text-xl">조사 개요</h3>
            <dl className="space-y-0 text-sm">
              <Row label="조사기관" value={survey.agency} />
              <Row label="의뢰처" value={survey.client || '-'} />
              <Row
                label="조사기간"
                value={`${survey.startDate} ~ ${survey.endDate}`}
              />
              <Row
                label="표본수"
                value={`${survey.sampleSize.toLocaleString()}명`}
              />
              <Row
                label="응답률"
                value={survey.responseRate ? `${survey.responseRate}%` : '-'}
              />
              <Row
                label="표본오차"
                value={`±${survey.marginOfError}%p (95% 신뢰수준)`}
              />
              <Row label="조사방법" value={formatMethod(survey.method)} />
            </dl>
            {survey.sourceUrl && (
              <a
                href={survey.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm text-stone-700 underline underline-offset-2"
              >
                원본 보기 →
              </a>
            )}
            <p className="mt-5 text-xs leading-relaxed text-stone-500">
              자세한 사항은 중앙선거여론조사심의위원회(nesdc.go.kr)에서 확인할 수 있습니다.
            </p>
            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full border border-stone-300 py-2 text-sm hover:bg-stone-50"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-stone-100 py-2">
      <dt className="text-stone-500">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
