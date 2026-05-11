import partySurveys from '@/data/party-surveys.json';
import localElections from '@/data/local-elections.json';

export type PartySurvey = {
  id: string;
  agency: string;
  client?: string;
  startDate: string;
  endDate: string;
  sampleSize: number;
  responseRate?: number;
  marginOfError: number;
  method: string;
  sourceUrl?: string;
  ratings: Record<string, number>;
};

export type Candidate = {
  name: string;
  party: string;
  rating: number;
};

export type LocalSurvey = {
  id: string;
  agency: string;
  client?: string;
  startDate: string;
  endDate: string;
  sampleSize: number;
  responseRate?: number;
  marginOfError: number;
  method: string;
  sourceUrl?: string;
  candidates: Candidate[];
};

export type Region = {
  code: string;
  name: string;
  shortName: string;
  position: string;
  /** 4×6 격자 배치 (1-based, 한반도 대략 위치) */
  row: number;
  col: number;
  note?: string;
  status?: 'candidates_pending' | 'data_pending';
  statusMessage?: string;
  statusDetail?: string;
  surveys: LocalSurvey[];
};

export const PARTY_COLORS: Record<string, string> = {
  더불어민주당: '#004EA2',
  국민의힘: '#E61E2B',
  조국혁신당: '#06A8E0',
  개혁신당: '#FF7920',
  진보당: '#D6001C',
  무당층: '#9CA3AF',
};

export function getPartySurveys(): PartySurvey[] {
  return (partySurveys.surveys as PartySurvey[]).sort(
    (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
  );
}

export function getRegions(): Region[] {
  return localElections.regions as Region[];
}

export function getRegion(code: string): Region | undefined {
  return getRegions().find((r) => r.code === code);
}

export function formatMethod(method: string): string {
  if (method === 'CATI') return '전화면접';
  if (method === 'ARS') return 'ARS';
  if (method === 'MIXED') return '혼합';
  return method;
}
