import React, { useEffect, useRef, useState } from 'react';

interface RevenueChartProps {
  labels: string[];
  values: number[];
  /** 'line' untuk nominal (omset), 'bar' untuk hitungan (pesanan, pengguna). */
  variant: 'line' | 'bar';
  formatValue: (n: number) => string;
  formatAxis: (n: number) => string;
  /** Teks ringkas untuk pembaca layar. */
  ariaLabel: string;
  height?: number;
}

const PAD = { top: 12, right: 12, bottom: 26, left: 52 };

/** Batas atas sumbu Y yang "bulat" (1, 2, 5 x 10^n). */
function niceMax(max: number): number {
  if (max <= 0) return 4;
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  const n = max / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}

/**
 * Grafik SVG ringan tanpa pustaka tambahan. Lebar mengikuti wadah,
 * ada tooltip saat disentuh/diarahkan, dan keadaan kosong yang jelas.
 */
export const RevenueChart: React.FC<RevenueChartProps> = ({
  labels,
  values,
  variant,
  formatValue,
  formatAxis,
  ariaLabel,
  height = 260,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setWidth(Math.max(280, el.clientWidth));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = values.length;
  const max = niceMax(Math.max(0, ...values));
  const innerW = width - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;
  const hasData = values.some((v) => v > 0);

  const xAt = (i: number) =>
    variant === 'bar'
      ? PAD.left + (innerW / n) * (i + 0.5)
      : PAD.left + (n === 1 ? innerW / 2 : (innerW / (n - 1)) * i);
  const yAt = (v: number) => PAD.top + innerH - (v / max) * innerH;

  const ticks = [0, 1, 2, 3, 4].map((t) => (max / 4) * t);
  const labelEvery = Math.ceil(n / (width < 420 ? 4 : 8));

  const linePath = values.map((v, i) => `${i === 0 ? 'M' : 'L'}${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(' ');
  const areaPath = n > 0 ? `${linePath} L${xAt(n - 1).toFixed(1)},${yAt(0)} L${xAt(0).toFixed(1)},${yAt(0)} Z` : '';

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < n; i++) {
      const d = Math.abs(xAt(i) - x);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    setHover(best);
  };

  const barW = Math.max(4, Math.min(28, (innerW / Math.max(n, 1)) * 0.6));
  const tipLeft = hover !== null ? Math.min(Math.max(xAt(hover), 70), width - 70) : 0;

  return (
    <div ref={wrapRef} className="relative w-full select-none" style={{ height }}>
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={ariaLabel}
        className="text-blue-600 overflow-visible touch-pan-y"
        onPointerMove={onMove}
        onPointerDown={onMove}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="rc-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={width - PAD.right} y1={yAt(t)} y2={yAt(t)} className="stroke-slate-200" strokeDasharray={t === 0 ? undefined : '3 4'} />
            <text x={PAD.left - 8} y={yAt(t) + 3.5} textAnchor="end" className="fill-slate-400" fontSize="10">
              {formatAxis(t)}
            </text>
          </g>
        ))}

        {labels.map((l, i) =>
          // Label terakhir selalu tampil; label reguler yang terlalu dekat dengannya disembunyikan agar tidak bertumpuk.
          i === n - 1 || (i % labelEvery === 0 && n - 1 - i >= Math.ceil(labelEvery / 2)) ? (
            <text key={i} x={xAt(i)} y={height - 8} textAnchor="middle" className="fill-slate-400" fontSize="10">
              {l}
            </text>
          ) : null
        )}

        {variant === 'line' ? (
          <>
            {hasData && <path d={areaPath} fill="url(#rc-fill)" />}
            <path d={linePath} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {n <= 31 &&
              values.map((v, i) => (
                <circle
                  key={i}
                  cx={xAt(i)}
                  cy={yAt(v)}
                  r={hover === i ? 5 : v > 0 ? 3 : 0}
                  className="fill-white"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              ))}
          </>
        ) : (
          values.map((v, i) => (
            <rect
              key={i}
              x={xAt(i) - barW / 2}
              y={yAt(v)}
              width={barW}
              height={Math.max(0, yAt(0) - yAt(v))}
              rx={4}
              fill="currentColor"
              opacity={hover === null || hover === i ? 1 : 0.45}
            />
          ))
        )}

        {hover !== null && (
          <line x1={xAt(hover)} x2={xAt(hover)} y1={PAD.top} y2={yAt(0)} className="stroke-slate-300" strokeDasharray="3 3" />
        )}
      </svg>

      {!hasData && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-xs font-semibold text-slate-400 bg-white/90 px-3 py-1.5 rounded-lg border border-slate-200">
            Belum ada data pada periode ini
          </p>
        </div>
      )}

      {hover !== null && (
        <div
          className="absolute -translate-x-1/2 pointer-events-none bg-slate-900 text-white rounded-lg px-2.5 py-1.5 shadow-lg whitespace-nowrap"
          style={{ left: tipLeft, top: Math.max(0, yAt(values[hover]) - 52) }}
        >
          <div className="text-[10px] text-slate-300">{labels[hover]}</div>
          <div className="text-xs font-bold">{formatValue(values[hover])}</div>
        </div>
      )}
    </div>
  );
};
