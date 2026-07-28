/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface HistoryPoint {
  name: string;
  "兵马趋势": number;
  "黄金趋势": number;
  eventMsg: string;
  logType: string;
  timestamp: string;
}

interface D3AttritionChartProps {
  data: HistoryPoint[];
}

export default function D3AttritionChart({ data }: D3AttritionChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(320);
  const [selectedPoint, setSelectedPoint] = useState<HistoryPoint | null>(null);

  // Monitor container width to make the SVG responsive
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const height = 150;
  const padding = { top: 15, right: 20, bottom: 25, left: 35 };

  // Set default selected point if none
  useEffect(() => {
    if (data.length > 0 && !selectedPoint) {
      setSelectedPoint(data[data.length - 1]);
    }
  }, [data, selectedPoint]);

  // Compute Scales using D3
  const xDomain = d3.range(data.length);
  const xScale = d3.scaleLinear()
    .domain([0, Math.max(1, data.length - 1)])
    .range([padding.left, width - padding.right]);

  const maxTroops = d3.max(data, d => d["兵马趋势"]) || 1000;
  const minTroops = d3.min(data, d => d["兵马趋势"]) || 0;
  const yScaleTroops = d3.scaleLinear()
    .domain([Math.max(0, minTroops - 200), maxTroops + 200])
    .range([height - padding.bottom, padding.top]);

  const maxGold = d3.max(data, d => d["黄金趋势"]) || 500;
  const minGold = d3.min(data, d => d["黄金趋势"]) || 0;
  const yScaleGold = d3.scaleLinear()
    .domain([Math.max(0, minGold - 100), maxGold + 100])
    .range([height - padding.bottom, padding.top]);

  // Generators for Paths
  const lineTroopsGen = d3.line<HistoryPoint>()
    .x((_, i) => xScale(i))
    .y(d => yScaleTroops(d["兵马趋势"]))
    .curve(d3.curveMonotoneX);

  const lineGoldGen = d3.line<HistoryPoint>()
    .x((_, i) => xScale(i))
    .y(d => yScaleGold(d["黄金趋势"]))
    .curve(d3.curveMonotoneX);

  const troopsPath = lineTroopsGen(data) || '';
  const goldPath = lineGoldGen(data) || '';

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-3 font-serif">
      <div className="flex justify-between items-center text-[10px] text-stone-700 border-b border-stone-200 pb-1 font-bold">
        <span>📉 D3 军民与辎重实时演变盘 (D3 Attrition Monitor)</span>
        <span className="text-[8.5px] font-normal text-stone-500">点击趋势节点查看军令详情</span>
      </div>

      <div className="relative bg-white border border-stone-250 p-1.5 shadow-inner">
        <svg width={width} height={height} className="overflow-visible select-none">
          {/* Grid lines */}
          <g className="stroke-stone-200 stroke-1 stroke-dasharray-[3,3]">
            {yScaleTroops.ticks(4).map((tick, i) => {
              const y = yScaleTroops(tick);
              return (
                <line
                  key={`grid-y-${i}`}
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#e5e5e5"
                  strokeDasharray="2,3"
                />
              );
            })}
          </g>

          {/* Left Y Axis (Troops) */}
          <g>
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={height - padding.bottom}
              stroke="#3d3228"
              strokeWidth="1.5"
            />
            {yScaleTroops.ticks(4).map((tick, i) => (
              <text
                key={`tick-troops-${i}`}
                x={padding.left - 6}
                y={yScaleTroops(tick) + 3}
                fill="#8b0000"
                fontSize="8"
                fontFamily="monospace"
                textAnchor="end"
                fontWeight="bold"
              >
                {tick}
              </text>
            ))}
          </g>

          {/* Right Y Axis (Gold) */}
          <g>
            <line
              x1={width - padding.right}
              y1={padding.top}
              x2={width - padding.right}
              y2={height - padding.bottom}
              stroke="#3d3228"
              strokeWidth="1.5"
            />
            {yScaleGold.ticks(4).map((tick, i) => (
              <text
                key={`tick-gold-${i}`}
                x={width - padding.right + 6}
                y={yScaleGold(tick) + 3}
                fill="#d97706"
                fontSize="8"
                fontFamily="monospace"
                textAnchor="start"
                fontWeight="bold"
              >
                {tick}
              </text>
            ))}
          </g>

          {/* X Axis */}
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="#3d3228"
            strokeWidth="1.5"
          />

          {/* X Labels */}
          {data.map((point, i) => {
            if (data.length > 8 && i % Math.ceil(data.length / 5) !== 0 && i !== data.length - 1) return null;
            return (
              <text
                key={`x-lbl-${i}`}
                x={xScale(i)}
                y={height - padding.bottom + 12}
                fill="#3d3228"
                fontSize="8px"
                textAnchor="middle"
              >
                {point.name}
              </text>
            );
          })}

          {/* Trend lines */}
          <path
            d={troopsPath}
            fill="none"
            stroke="#8b0000"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d={goldPath}
            fill="none"
            stroke="#d97706"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Nodes for click events */}
          {data.map((point, i) => {
            const x = xScale(i);
            const yTroops = yScaleTroops(point["兵马趋势"]);
            const yGold = yScaleGold(point["黄金趋势"]);
            const isSelected = selectedPoint === point;

            return (
              <g key={`nodes-${i}`}>
                {/* Troops Node */}
                <circle
                  cx={x}
                  cy={yTroops}
                  r={isSelected ? 5 : 3.5}
                  fill="#8b0000"
                  stroke={isSelected ? '#fff' : '#8b0000'}
                  strokeWidth={isSelected ? 1.5 : 0}
                  className="cursor-pointer hover:r-[6px] transition-all duration-150"
                  onClick={() => setSelectedPoint(point)}
                />
                {/* Gold Node */}
                <circle
                  cx={x}
                  cy={yGold}
                  r={isSelected ? 5 : 3.5}
                  fill="#d97706"
                  stroke={isSelected ? '#fff' : '#d97706'}
                  strokeWidth={isSelected ? 1.5 : 0}
                  className="cursor-pointer hover:r-[6px] transition-all duration-150"
                  onClick={() => setSelectedPoint(point)}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Legends */}
        <div className="absolute top-1.5 left-10 flex gap-4 text-[7.5px] font-bold">
          <span className="flex items-center gap-1 text-artistic-crimson">
            <span className="w-2.5 h-1.5 bg-artistic-crimson inline-block"></span> 💂 兵卒趋势 (左轴)
          </span>
          <span className="flex items-center gap-1 text-amber-700">
            <span className="w-2.5 h-1.5 bg-amber-600 inline-block"></span> 💰 黄金储备 (右轴)
          </span>
        </div>
      </div>

      {/* Military Order Details Popup below the chart */}
      {selectedPoint && (
        <div className="bg-[#fdfcf7] border-2 border-stone-300 p-2.5 rounded-none text-left animate-fade-in text-[10.5px]">
          <div className="flex justify-between items-center border-b border-dashed border-stone-200 pb-1 mb-1.5">
            <span className="font-bold text-artistic-crimson font-serif text-[11px] flex items-center gap-1">
              📜 幕府军令详文 ({selectedPoint.name})
            </span>
            <span className="text-[9px] text-stone-500 font-mono">{selectedPoint.timestamp}</span>
          </div>
          <p className="text-stone-700 leading-relaxed italic pl-1 mb-1.5">
            “{selectedPoint.eventMsg}”
          </p>
          <div className="flex gap-4 text-[9px] font-mono font-bold bg-[#ede0c5]/40 p-1 pl-2">
            <span>📉 兵马状态: <strong className="text-artistic-crimson">{selectedPoint["兵马趋势"]}人</strong></span>
            <span>🪙 库府黄金: <strong className="text-amber-800">{selectedPoint["黄金趋势"]}金</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
