/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { General } from '../types';

interface GeneralRadarChartProps {
  general: General;
  activeBonds: Array<{
    name: string;
    description: string;
    statBoost: {
      force?: number;
      intelligence?: number;
      leadership?: number;
      politics?: number;
      virtue?: number;
    };
  }>;
}

export default function GeneralRadarChart({ general, activeBonds }: GeneralRadarChartProps) {
  // Determine if there is a stat boost from the active bonds
  let forceBoost = 0;
  let intelBoost = 0;
  let leadBoost = 0;
  let polBoost = 0;
  let virtBoost = 0;

  activeBonds.forEach(bond => {
    // Check if the current general is part of this bond's requirement (only apply boost if general is in the bond, or let all recruited generals enjoy it)
    // To keep it simple and intuitive: apply the bond boost to the specific generals that belong to it!
    // Let's define which generals belong to which bond:
    const taoyuanList = ['liubei', 'guanyu', 'zhangfei'];
    const tigersList = ['guanyu', 'zhangfei', 'zhaoyun'];
    const weiList = ['caocao', 'guojia'];
    const shuguoList = ['zhugeliang', 'jiangwei'];

    if (bond.name.includes('桃园') && taoyuanList.includes(general.id)) {
      forceBoost += bond.statBoost.force || 0;
      leadBoost += bond.statBoost.leadership || 0;
      virtBoost += bond.statBoost.virtue || 0;
    }
    if (bond.name.includes('蜀汉虎将') && tigersList.includes(general.id)) {
      forceBoost += bond.statBoost.force || 0;
      leadBoost += bond.statBoost.leadership || 0;
    }
    if (bond.name.includes('魏佐') && weiList.includes(general.id)) {
      intelBoost += bond.statBoost.intelligence || 0;
      polBoost += bond.statBoost.politics || 0;
    }
    if (bond.name.includes('师徒') && shuguoList.includes(general.id)) {
      intelBoost += bond.statBoost.intelligence || 0;
      leadBoost += bond.statBoost.leadership || 0;
    }
  });

  const finalForce = Math.min(100, general.force + forceBoost);
  const finalIntel = Math.min(100, general.intelligence + intelBoost);
  const finalLead = Math.min(100, general.leadership + leadBoost);
  const finalPol = Math.min(100, general.politics + polBoost);
  const finalVirt = Math.min(100, general.virtue + virtBoost);

  // Stats configuration for radar axes (in order: Top, TopRight, BottomRight, BottomLeft, TopLeft)
  const features = [
    { label: '武力', key: 'force', base: general.force, final: finalForce, boost: forceBoost },
    { label: '智力', key: 'intelligence', base: general.intelligence, final: finalIntel, boost: intelBoost },
    { label: '统帅', key: 'leadership', base: general.leadership, final: finalLead, boost: leadBoost },
    { label: '政治', key: 'politics', base: general.politics, final: finalPol, boost: polBoost },
    { label: '德行', key: 'virtue', base: general.virtue, final: finalVirt, boost: virtBoost }
  ];

  const size = 180;
  const radius = 62;
  const center = size / 2;

  // Angles for pentagon ticks: starts straight up at -PI/2 (offset by -90 deg)
  const angleSlice = (Math.PI * 2) / 5;

  const getCoordinates = (index: number, value: number) => {
    const angle = angleSlice * index - Math.PI / 2;
    const distance = (value / 100) * radius;
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle)
    };
  };

  // Precalculate grid steps (levels of pentagon web: 20%, 40%, 60%, 80%, 100%)
  const gridLevels = [20, 40, 60, 80, 100];

  // Base polygon points
  const basePointsStr = features.map((f, i) => {
    const coords = getCoordinates(i, f.base);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  // Final / Buffed polygon points
  const buffPointsStr = features.map((f, i) => {
    const coords = getCoordinates(i, f.final);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  return (
    <div className="flex flex-col items-center bg-[#faf5ec] border border-artistic-charcoal/30 p-2 text-center rounded-none relative">
      <div className="text-[10px] uppercase tracking-wider font-black font-serif text-artistic-crimson border-b border-artistic-charcoal/25 pb-0.5 mb-1.5 w-full">
        🛡️ 玄武五维墨印 · 雷达
      </div>

      <svg width={size} height={size} className="overflow-visible select-none drop-shadow-sm">
        {/* Drawing custom watercolor gradients */}
        <defs>
          <radialGradient id="inkGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b0000" stopOpacity="0.2" />
            <stop offset="70%" stopColor="#3d3228" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#3d3228" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Center splash ink aura */}
        <circle cx={center} cy={center} r={radius} fill="url(#inkGlow)" />

        {/* Dynamic grid levels (pentagon webs) */}
        {gridLevels.map((lvl) => {
          const lvlPoints = [0, 1, 2, 3, 4].map((i) => {
            const coords = getCoordinates(i, lvl);
            return `${coords.x},${coords.y}`;
          }).join(' ');

          return (
            <polygon
              key={lvl}
              points={lvlPoints}
              fill="none"
              stroke="#e3d4bd"
              strokeWidth={1}
              strokeDasharray={lvl === 100 ? '0' : '2,2'}
            />
          );
        })}

        {/* Axis Lines connecting center to pentagon nodes */}
        {[0, 1, 2, 3, 4].map((i) => {
          const outerNode = getCoordinates(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={outerNode.x}
              y2={outerNode.y}
              stroke="#e2d3bc"
              strokeWidth={1}
            />
          );
        })}

        {/* Base attributes area polygon (Translucent deep charcoal shade) */}
        <polygon
          points={basePointsStr}
          fill="rgba(61, 50, 40, 0.25)"
          stroke="#413932"
          strokeWidth={1.5}
          className="transition-all duration-300"
        />

        {/* Buff/Final attributes area polygon (Glowing red border & transparent pink fill) */}
        {(forceBoost > 0 || intelBoost > 0 || leadBoost > 0 || polBoost > 0 || virtBoost > 0) && (
          <polygon
            points={buffPointsStr}
            fill="rgba(153, 27, 27, 0.18)"
            stroke="#991b1b"
            strokeWidth={2}
            strokeDasharray="4,2"
            className="transition-all duration-300 animate-pulse"
          />
        )}

        {/* Labels & Markers at vertices */}
        {features.map((f, i) => {
          const outerNode = getCoordinates(i, 100);
          const angle = angleSlice * i - Math.PI / 2;
          
          // Determine placement offsets to keep text outside
          const textOffsetDist = 14;
          const tx = outerNode.x + textOffsetDist * Math.cos(angle);
          const ty = outerNode.y + textOffsetDist * Math.sin(angle) + 3; // +3 for vertical centering alignment

          const nodeCoords = getCoordinates(i, f.final);

          return (
            <g key={f.label}>
              {/* Vertex little round dot */}
              <circle
                cx={nodeCoords.x}
                cy={nodeCoords.y}
                r={f.boost > 0 ? 4.5 : 3}
                fill={f.boost > 0 ? '#991b1b' : '#3d3228'}
                stroke="#fff"
                strokeWidth={1}
              />

              {/* Text label */}
              <text
                x={tx}
                y={ty}
                textAnchor="middle"
                className="font-serif text-[10.5px] font-black text-[#3d3228]"
              >
                {f.label}
              </text>

              {/* Attribute score display */}
              <text
                x={tx}
                y={ty + 10}
                textAnchor="middle"
                className={`font-mono text-[9px] font-bold ${f.boost > 0 ? 'text-red-700 font-extrabold' : 'text-stone-600'}`}
              >
                {f.final}{f.boost > 0 ? `(+${f.boost})` : ''}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
