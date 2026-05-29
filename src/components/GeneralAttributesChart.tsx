/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface HistoryPoint {
  step: number;
  level: number;
  force: number;
  intelligence: number;
  leadership: number;
  politics: number;
  virtue: number;
  date: string;
}

interface GeneralAttributesChartProps {
  history: HistoryPoint[];
  generalName: string;
}

export default function GeneralAttributesChart({ history, generalName }: GeneralAttributesChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);

  useEffect(() => {
    if (!svgRef.current || !history || history.length === 0) return;

    // Clear previous drawing
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Get current container width for responsive resizing
    const containerWidth = containerRef.current?.getBoundingClientRect().width || 320;
    const width = containerWidth;
    const height = 180;

    const margin = { top: 15, right: 15, bottom: 25, left: 30 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X scale (steps of training)
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(history, d => d.step) || 1])
      .range([0, chartWidth]);

    // Y scale (attributes 30 - 100 for higher sensitivity showing increments)
    const minAttrVal = Math.max(0, (d3.min(history, d => Math.min(d.force, d.intelligence, d.leadership, d.politics, d.virtue)) || 30) - 5);
    const maxAttrVal = Math.min(100, (d3.max(history, d => Math.max(d.force, d.intelligence, d.leadership, d.politics, d.virtue)) || 100) + 2);
    
    const yScale = d3.scaleLinear()
      .domain([Math.max(10, minAttrVal), maxAttrVal])
      .range([chartHeight, 0]);

    // Add subtle dashed horizontal grids
    const yTicks = yScale.ticks(5);
    g.selectAll('.grid-line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('y1', d => yScale(d))
      .attr('x2', chartWidth)
      .attr('y2', d => yScale(d))
      .attr('stroke', '#e4d6bf')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');

    // Axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(Math.min(history.length, 5))
      .tickFormat(d => `第${d}训`);
      
    const yAxis = d3.axisLeft(yScale).ticks(5);

    // Draw X Axis
    g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(xAxis)
      .attr('color', '#332a20')
      .selectAll('text')
      .attr('class', 'font-serif text-[9px] font-bold text-stone-700');

    // Draw Y Axis
    g.append('g')
      .call(yAxis)
      .attr('color', '#332a20')
      .selectAll('text')
      .attr('class', 'font-sans text-[9px] font-bold text-stone-700');

    // Attribute lines configuration
    const attributes = [
      { key: 'force', name: '武力', color: '#b91c1c' },
      { key: 'intelligence', name: '智力', color: '#1d4ed8' },
      { key: 'leadership', name: '统帅', color: '#047857' },
      { key: 'politics', name: '政治', color: '#b45309' },
      { key: 'virtue', name: '德行', color: '#6d28d9' },
    ];

    // Tooltip trigger transparent voronoi or hover rects/circles
    attributes.forEach(attr => {
      // Line generator
      const lineGen = d3.line<HistoryPoint>()
        .x(d => xScale(d.step))
        .y(d => yScale((d as any)[attr.key]))
        .curve(d3.curveMonotoneX);

      // Draw path line
      g.append('path')
        .datum(history)
        .attr('fill', 'none')
        .attr('stroke', attr.color)
        .attr('stroke-width', 2)
        .attr('d', lineGen);

      // Draw peak values animation halos (when any attribute achieves 90 or 100)
      history.forEach(d => {
        const val = (d as any)[attr.key];
        if (val >= 90) {
          // Inner glowing pulsing animation ring
          g.append('circle')
            .attr('cx', xScale(d.step))
            .attr('cy', yScale(val))
            .attr('r', 5)
            .attr('fill', 'none')
            .attr('stroke', attr.color)
            .attr('stroke-width', 1.5)
            .attr('opacity', 0.8)
            .style('pointer-events', 'none')
            .append('animate')
            .attr('attributeName', 'r')
            .attr('values', '4;10;4')
            .attr('dur', '2s')
            .attr('repeatCount', 'indefinite');

          // Outer radiating glow wave
          g.append('circle')
            .attr('cx', xScale(d.step))
            .attr('cy', yScale(val))
            .attr('r', 5)
            .attr('fill', 'none')
            .attr('stroke', '#d4af37') // Gold outer radiation
            .attr('stroke-width', 1)
            .attr('opacity', 0.6)
            .style('pointer-events', 'none')
            .append('animate')
            .attr('attributeName', 'opacity')
            .attr('values', '0.6;0;0.6')
            .attr('dur', '2s')
            .attr('repeatCount', 'indefinite');

          // Special Peak Star above 100 status
          if (val === 100) {
            g.append('text')
              .attr('x', xScale(d.step))
              .attr('y', yScale(val) - 7)
              .attr('text-anchor', 'middle')
              .attr('fill', '#d4af37')
              .attr('font-size', '10px')
              .style('pointer-events', 'none')
              .text('★')
              .append('animate')
              .attr('attributeName', 'opacity')
              .attr('values', '0.3;1;0.3')
              .attr('dur', '1.2s')
              .attr('repeatCount', 'indefinite');
          }
        }
      });

      // Draw dots at point
      g.selectAll(`.dot-${attr.key}`)
        .data(history)
        .enter()
        .append('circle')
        .attr('class', `dot-${attr.key}`)
        .attr('cx', d => xScale(d.step))
        .attr('cy', d => yScale((d as any)[attr.key]))
        .attr('r', d => ((d as any)[attr.key] >= 90 ? 4 : 3)) // slightly bigger for peak elements
        .attr('fill', attr.color)
        .attr('stroke', d => ((d as any)[attr.key] >= 90 ? '#d4af37' : '#fff')) // Gold border for peak stats
        .attr('stroke-width', d => ((d as any)[attr.key] >= 90 ? 1.5 : 0.75))
        .style('cursor', 'pointer')
        .on('mouseover', (event, d) => {
          setHoveredPoint({
            x: event.clientX,
            y: event.clientY,
            date: d.date,
            step: d.step,
            level: d.level,
            name: attr.name,
            value: (d as any)[attr.key],
            color: attr.color,
            allStats: d
          });
        })
        .on('mouseout', () => {
          setHoveredPoint(null);
        });
    });

  }, [history]);

  // Self-contained high resolution canvas reports exporter
  const handleExportReport = () => {
    if (!history || history.length === 0) return;
    const finalPoint = history[history.length - 1];

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 460;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Elegant retro parchment layout styling
    ctx.fillStyle = '#fbf7ee';
    ctx.fillRect(0, 0, 600, 460);

    // Ink borders
    ctx.strokeStyle = '#3a3024';
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, 576, 436);
    ctx.strokeStyle = '#991b1b'; // Crimson double-border inner framing
    ctx.lineWidth = 1;
    ctx.strokeRect(18, 18, 564, 424);

    // Banner label title "《三国逆变录》麾下名将修行大成状"
    ctx.fillStyle = '#991b1b';
    ctx.font = 'bold 20px "Source Han Serif SC", "SimSun", "STSong", "serif"';
    ctx.textAlign = 'center';
    ctx.fillText('《三国逆变录》麾下名将五维修行大成谱', 300, 52);

    // Accent separation lines
    ctx.strokeStyle = '#3a3024';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(120, 68);
    ctx.lineTo(480, 68);
    ctx.stroke();

    // General Sub-header
    ctx.fillStyle = '#292524';
    ctx.font = 'bold 18px "Source Han Serif SC", "SimSun", "STSong", "serif"';
    ctx.fillText(`大将：【 ${generalName} 】`, 300, 102);

    ctx.font = '12px "Source Han Serif SC", "SimSun", "STSong", "serif"';
    ctx.fillStyle = '#57534e';
    ctx.fillText(`历经校兵校演督训: ${history.length - 2 > 0 ? history.length - 2 : 0} 次 | 境界高度：千古良臣名将`, 300, 125);

    // Final Stats Showcase Board
    ctx.fillStyle = '#f5ebd0';
    ctx.fillRect(40, 142, 520, 64);
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 142, 520, 64);

    const metrics = [
      { name: '武力', key: 'force', color: '#b91c1c' },
      { name: '智力', key: 'intelligence', color: '#1d4ed8' },
      { name: '统帅', key: 'leadership', color: '#047857' },
      { name: '政治', key: 'politics', color: '#b45309' },
      { name: '德行', key: 'virtue', color: '#6d28d9' },
    ];

    ctx.textAlign = 'left';
    metrics.forEach((m, idx) => {
      const val = (finalPoint as any)[m.key] || 0;
      const xPos = 65 + idx * 102;

      // Draw color anchor
      ctx.fillStyle = m.color;
      ctx.beginPath();
      ctx.arc(xPos, 172, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Draw tag name
      ctx.fillStyle = '#1c1917';
      ctx.font = 'bold 12px "Source Han Serif SC", "SimSun", "STSong", "serif"';
      ctx.fillText(m.name, xPos + 8, 170);

      // Draw final property number value (highlights peak attributes in gold or bold red)
      ctx.font = 'bold 16px "Courier New", monospace';
      ctx.fillStyle = val >= 90 ? '#d4af37' : m.color;
      ctx.fillText(val.toString(), xPos + 8, 192);

      // Display peak status message if val >= 90
      if (val >= 90) {
        ctx.font = '9px "Source Han Serif SC", "SimSun", "STSong", "serif"';
        ctx.fillStyle = '#b45309';
        ctx.fillText('⭐ 巅峰', xPos + 38, 190);
      }
    });

    // Draw progression chart grid on Canvas
    const cX = 64;
    const cY = 228;
    const cW = 472;
    const cH = 160;

    // Chart panel background
    ctx.fillStyle = '#faf8f2';
    ctx.fillRect(cX, cY, cW, cH);
    ctx.strokeStyle = '#78716c';
    ctx.lineWidth = 1;
    ctx.strokeRect(cX, cY, cW, cH);

    // Dynamic scale bounds (sensitive attribute limits)
    const maxStep = Math.max(1, d3.max(history, d => d.step) || 1);
    const minVal = Math.max(0, (d3.min(history, d => Math.min(d.force, d.intelligence, d.leadership, d.politics, d.virtue)) || 30) - 5);
    const maxVal = Math.min(100, (d3.max(history, d => Math.max(d.force, d.intelligence, d.leadership, d.politics, d.virtue)) || 100) + 2);

    const getX = (step: number) => cX + (step / maxStep) * cW;
    const getY = (val: number) => {
      const ratio = (val - minVal) / (maxVal - minVal || 1);
      return cY + cH - ratio * cH;
    };

    // Horizontal helper grid lines
    ctx.strokeStyle = '#e7e5e4';
    ctx.lineWidth = 0.5;
    for (let i = 1; i < 5; i++) {
      const yVal = minVal + (i / 5) * (maxVal - minVal);
      const py = getY(yVal);
      ctx.beginPath();
      ctx.moveTo(cX, py);
      ctx.lineTo(cX + cW, py);
      ctx.stroke();

      // Tick labels on canvas side
      ctx.fillStyle = '#78716c';
      ctx.font = '9px "Courier New", monospace';
      ctx.fillText(Math.round(yVal).toString(), cX - 25, py + 3);
    }

    // Horizontal training steps labels
    history.forEach((pt) => {
      const px = getX(pt.step);
      ctx.beginPath();
      ctx.strokeStyle = '#e7e5e4';
      ctx.moveTo(px, cY);
      ctx.lineTo(px, cY + cH);
      ctx.stroke();

      ctx.fillStyle = '#57534e';
      ctx.font = '8px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`第${pt.step}训`, px, cY + cH + 12);
    });

    // Draw paths for stats
    metrics.forEach((m) => {
      ctx.strokeStyle = m.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      history.forEach((pt, pIdx) => {
        const px = getX(pt.step);
        const py = getY((pt as any)[m.key]);
        if (pIdx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Draw points with star peaks indicator
      history.forEach((pt) => {
        const val = (pt as any)[m.key];
        const px = getX(pt.step);
        const py = getY(val);

        ctx.fillStyle = m.color;
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Highlight peaks on canvas report
        if (val >= 90) {
          ctx.strokeStyle = '#d4af37'; // gold
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
    });

    // Footer copyright label "三国逆变录 编纂司"
    ctx.fillStyle = '#78716c';
    ctx.font = 'italic 10px "Source Han Serif SC", "SimSun", "STSong", "serif"';
    ctx.textAlign = 'right';
    ctx.fillText('《三国逆变录》编纂司 昭雪乾坤印存', 560, 422);

    // Trigger download
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${generalName.split(' ')[0]}_修行成长谱.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
      alert('导出报告图片失败，请重试！');
    }
  };

  return (
    <div ref={containerRef} className="w-full relative bg-[#faf5ec]/90 border border-artistic-charcoal/30 p-2 text-left font-serif">
      <div className="flex justify-between items-center mb-1 border-b border-artistic-charcoal/20 pb-1">
        <span className="text-[10px] font-black text-artistic-crimson">📈 将帅成长五维属性升变折线图</span>
        <span className="text-[8px] text-stone-500 font-serif">划过圆点可析成长</span>
      </div>

      <svg ref={svgRef} className="w-full h-[180px] overflow-visible"></svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-2.5 justify-center mt-1 pt-1.5 border-t border-dashed border-artistic-charcoal/20 text-[9px] font-bold">
        <span className="flex items-center gap-1 text-[#b91c1c]">
          <span className="w-2 h-2 bg-[#b91c1c] rounded-full"></span>武力
        </span>
        <span className="flex items-center gap-1 text-[#1d4ed8]">
          <span className="w-2 h-2 bg-[#1d4ed8] rounded-full"></span>智力
        </span>
        <span className="flex items-center gap-1 text-[#047857]">
          <span className="w-2 h-2 bg-[#047857] rounded-full"></span>统帅
        </span>
        <span className="flex items-center gap-1 text-[#b45309]">
          <span className="w-2 h-2 bg-[#b45309] rounded-full"></span>政治
        </span>
        <span className="flex items-center gap-1 text-[#6d28d9]">
          <span className="w-2 h-2 bg-[#6d28d9] rounded-full"></span>德行
        </span>
      </div>

      {/* Exporter Button Trigger */}
      <div className="mt-2 text-right">
        <button
          type="button"
          onClick={handleExportReport}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1 bg-amber-500 hover:bg-amber-600 text-stone-950 font-serif font-black text-[9.5px] px-2.5 py-1.5 border border-amber-700/40 transition-all cursor-pointer shadow-xs rounded-none hover:shadow-xs active:scale-98"
          title="将当前大将的所有修行成长数据、曲线合并绘制成绝美报告长卷，一键保存至本地"
        >
          <span>📥 导出绘制将领修行五维大成谱 (PNG 图)</span>
        </button>
      </div>

      {/* Embedded tooltip to prevent breaking sandbox boundaries */}
      {hoveredPoint && (
        <div 
          className="absolute z-[190] bg-stone-900 text-stone-100 p-2 shadow-lg border border-[#d4af37] text-[10px] font-serif pointer-events-none rounded-none leading-normal w-40"
          style={{
            top: '25px',
            right: '10px'
          }}
        >
          <div className="font-serif border-b border-stone-700 pb-1 mb-1 text-amber-400 font-extrabold flex justify-between">
            <span>{generalName.split(' ')[0]} (第{hoveredPoint.step}言)</span>
            <span>LV.{hoveredPoint.level}</span>
          </div>
          <div>时刻: <span className="text-white">{hoveredPoint.date}</span></div>
          <div className="mt-1 font-bold flex justify-between border-t border-stone-800 pt-1">
            <span style={{ color: hoveredPoint.color }}>● {hoveredPoint.name}:</span>
            <span className="text-white text-[11px] font-mono font-black">{hoveredPoint.value}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-1 text-[8.5px] text-stone-400 border-t border-stone-800 mt-1 pt-1">
            <div>武力: {hoveredPoint.allStats.force}</div>
            <div>智力: {hoveredPoint.allStats.intelligence}</div>
            <div>统帅: {hoveredPoint.allStats.leadership}</div>
            <div>政治: {hoveredPoint.allStats.politics}</div>
          </div>
        </div>
      )}
    </div>
  );
}
