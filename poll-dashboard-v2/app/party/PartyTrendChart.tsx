'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { PartySurvey, PARTY_COLORS } from '@/lib/data';

export default function PartyTrendChart({ surveys }: { surveys: PartySurvey[] }) {
  const chartData = [...surveys].reverse().map((s) => ({
    date: s.endDate.slice(5),
    agency: s.agency,
    ...s.ratings,
  }));

  return (
    <div className="h-72 w-full md:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
          <XAxis dataKey="date" stroke="#78716c" fontSize={11} />
          <YAxis stroke="#78716c" fontSize={11} unit="%" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fafaf9',
              border: '1px solid #d6d3d1',
              borderRadius: 4,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} iconType="line" />
          {Object.keys(PARTY_COLORS)
            .filter((p) => p !== '무당층')
            .map((party) => (
              <Line
                key={party}
                type="monotone"
                dataKey={party}
                stroke={PARTY_COLORS[party]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
