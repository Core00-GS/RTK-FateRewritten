/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { HistoryRecord } from '../types';

interface HistoryTimelineD3Props {
  records: HistoryRecord[];
}

export default function HistoryTimelineD3({ records }: HistoryTimelineD3Props) {
  const d3ContainerRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!d3ContainerRef.current) return;

    // Clear previous drawing
    const svgElement = d3.select(d3ContainerRef.current);
    svgElement.selectAll('*').remove();

    // Default empty state or fallback data
    const list = [...records].reverse(); // Oldest first
    if (list.length === 0) {
      list.push({
        id: 'init_timeline_fact',
        timestamp: '公元177年',
        title: '涿县游侠起行',
        brief: '主公于幽州涿县贩织草履，志存高远，命轨于此肇始。',
        isAltered: false
      });
    }

    const margin = { top: 40, right: 180, bottom: 40, left: 160 };
    const nodeHeight = 70;
    const width = 640;
    const height = list.length * nodeHeight + margin.top + margin.bottom;

    // Update SVG attributes
    svgElement
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Filter list to keep a clean linear/branched structure
    const g = svgElement.append('g').attr('transform', `translate(0, 0)`);

    // Define gradients
    const defs = svgElement.append('defs');
    
    // Orthodoxy glow
    const shadowFilter = defs.append('filter')
      .attr('id', 'neon-glow-orthodox')
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%');
    shadowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '2')
      .attr('result', 'blur');
    shadowFilter.append('feComposite')
      .attr('in', 'SourceGraphic');

    // Alteration pulse glow
    const branchFilter = defs.append('filter')
      .attr('id', 'neon-glow-altered');
    branchFilter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'blur');
    branchFilter.append('feComposite')
      .attr('in', 'SourceGraphic');

    // Define colors
    const colorOrthodox = '#78716c'; // Stone
    const colorAltered = '#8d1d1f';   // Crimson
    const lineX = width / 2;

    // Draw central main timeline stream (orthodox path)
    g.append('line')
      .attr('x1', lineX)
      .attr('y1', margin.top)
      .attr('x2', lineX)
      .attr('y2', height - margin.bottom)
      .attr('stroke', colorOrthodox)
      .attr('stroke-width', 4)
      .attr('opacity', 0.6)
      .attr('stroke-dasharray', 'none');

    // Draw nodes
    list.forEach((rec, idx) => {
      const y = margin.top + idx * nodeHeight;
      const isAltered = rec.isAltered;

      // Draw branching line if altered
      if (isAltered) {
        // Draw path branching to the right representing the new branch universe
        const branchX = lineX + 60;
        
        // Curve indicator path from lineX (at node y-20) to branchX (at node y)
        const curvePath = d3.path();
        curvePath.moveTo(lineX, y - 40);
        curvePath.bezierCurveTo(lineX + 20, y - 25, branchX - 25, y - 10, branchX, y);

        g.append('path')
          .attr('d', curvePath.toString())
          .attr('fill', 'none')
          .attr('stroke', colorAltered)
          .attr('stroke-width', 2.5)
          .attr('stroke-dasharray', '3,3')
          .attr('opacity', 0.85);

        // Branch Node dot
        g.append('circle')
          .attr('cx', branchX)
          .attr('cy', y)
          .attr('r', 8)
          .attr('fill', '#fcfaf2')
          .attr('stroke', colorAltered)
          .attr('stroke-width', 3)
          .style('cursor', 'help')
          .on('mouseover', function(event) {
            d3.select(this)
              .transition()
              .duration(150)
              .attr('r', 11)
              .attr('fill', colorAltered);
          })
          .on('mouseout', function(event) {
            d3.select(this)
              .transition()
              .duration(150)
              .attr('r', 8)
              .attr('fill', '#fcfaf2');
          });

        // Add a pulsing feedback ring
        g.append('circle')
          .attr('cx', branchX)
          .attr('cy', y)
          .attr('r', 15)
          .attr('fill', 'none')
          .attr('stroke', colorAltered)
          .attr('stroke-width', 1)
          .attr('opacity', 0.45)
          .append('animate')
          .attr('attributeName', 'r')
          .attr('values', '10;22')
          .attr('dur', '1.8s')
          .attr('repeatCount', 'indefinite');

        // Draw node title text to the right
        g.append('text')
          .attr('x', branchX + 16)
          .attr('y', y + 3)
          .attr('fill', colorAltered)
          .attr('font-size', '11.5px')
          .attr('font-family', 'Georgia, serif')
          .attr('font-weight', '900')
          .text(rec.title);

        // State label
        g.append('text')
          .attr('x', branchX + 16)
          .attr('y', y + 15)
          .attr('fill', '#b45309')
          .attr('font-size', '8.5px')
          .attr('font-family', 'sans-serif')
          .attr('font-weight', '700')
          .text('⚡ 逆天改命 · 极速偏离中');

        // Time tag to the left
        g.append('rect')
          .attr('x', lineX - 110)
          .attr('y', y - 9)
          .attr('width', 75)
          .attr('height', 16)
          .attr('fill', colorAltered)
          .attr('opacity', 0.08)
          .attr('stroke', colorAltered)
          .attr('stroke-width', 0.5);

        g.append('text')
          .attr('x', lineX - 72.5)
          .attr('y', y + 3)
          .attr('fill', colorAltered)
          .attr('font-size', '9.5px')
          .attr('font-family', 'monospace')
          .attr('font-weight', 'bold')
          .attr('text-anchor', 'middle')
          .text(rec.timestamp);

        // Description underneath the branch node title
        g.append('text')
          .attr('x', branchX + 16)
          .attr('y', y - 10)
          .attr('fill', '#57534e')
          .attr('font-size', '8px')
          .attr('font-family', 'serif')
          .text(rec.brief.length > 25 ? rec.brief.substring(0, 25) + '...' : rec.brief);

      } else {
        // Standard Orthodox Node on the central line
        g.append('circle')
          .attr('cx', lineX)
          .attr('cy', y)
          .attr('r', 6)
          .attr('fill', '#78716c')
          .attr('stroke', '#ede0c5')
          .attr('stroke-width', 2);

        // Standard event title to the right
        g.append('text')
          .attr('x', lineX + 16)
          .attr('y', y + 3)
          .attr('fill', '#292524')
          .attr('font-size', '11px')
          .attr('font-family', 'serif')
          .attr('font-weight', 'bold')
          .text(rec.title);

        // Normal tag text to the right
        g.append('text')
          .attr('x', lineX + 16)
          .attr('y', y + 14)
          .attr('fill', '#78716c')
          .attr('font-size', '8px')
          .attr('font-family', 'sans-serif')
          .text('📜 顺天应时 · 符正史印记');

        // Time tag to the left
        g.append('text')
          .attr('x', lineX - 16)
          .attr('y', y + 3)
          .attr('fill', '#44403c')
          .attr('font-size', '9.5px')
          .attr('font-family', 'monospace')
          .attr('text-anchor', 'end')
          .text(rec.timestamp);
      }
    });

  }, [records]);

  return (
    <div className="w-full bg-[#fdfbf7] border-2 border-stone-800 p-4 relative antialiased shadow-inner overflow-x-auto">
      <div className="absolute top-2 right-2 flex gap-1.5 items-center bg-[#ede0c5] border border-stone-300 px-2 py-0.5 text-[8.5px] font-serif font-bold text-stone-700">
        <span className="w-2 h-2 rounded-full bg-[#8d1d1f] animate-ping" />
        <span>星象图说：天机改轨谱</span>
      </div>
      <div className="text-center font-serif text-[11px] text-stone-605 mb-4 border-b border-dashed border-stone-200 pb-1 mr-12 text-left">
        <strong>🗺️ 逆天维度因果偏离谱 (D3-rendered timelines of Fate)</strong>:
        <br />
        下方罗盘由 D3.js 动态投影，左侧为大汉纪年，右侧为并列改命分歧流。红点表示您的圣令颠覆了真实历史轨线！
      </div>

      <div className="flex justify-center">
        <svg ref={d3ContainerRef} className="max-w-full w-full select-none" />
      </div>

      <div className="mt-4 pt-2 border-t border-dashed border-stone-200 text-[9.5px] italic font-serif text-stone-500 text-center">
        💡 提示：点击或抚摸大事记中的各个记录卡，可以对比原本汉史并查看长卷。
      </div>
    </div>
  );
}
