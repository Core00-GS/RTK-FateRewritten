/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Region, FactionId, PlayerStats } from '../types';
import { FACTIONS } from '../data/regions';
import { Shield, Sparkles, Navigation, Info, TrendingUp, Users } from 'lucide-react';

interface MapProps {
  regions: Region[];
  playerLocation: string;
  onTravel: (regionId: string) => void;
  playerStats: PlayerStats;
  onGarrisonTransfer: (regionId: string, amount: number) => void;
  activeQuests: { targetRegionId: string; title: string }[];
  exploredRegions: string[];
}

export default function ThreeKingdomsMap({
  regions,
  playerLocation,
  onTravel,
  playerStats,
  onGarrisonTransfer,
  activeQuests,
  exploredRegions
}: MapProps) {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(
    regions.find((r) => r.id === playerLocation) || regions[0]
  );
  const [transferAmount, setTransferAmount] = useState<number>(1000);
  
  const [prevLocation, setPrevLocation] = useState<string>(playerLocation);
  const [marchAnim, setMarchAnim] = useState<{
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    active: boolean;
  } | null>(null);
  const [marchProgress, setMarchProgress] = useState<number>(0);

  useEffect(() => {
    if (playerLocation !== prevLocation) {
      const oldRegion = regions.find(r => r.id === prevLocation);
      const newRegion = regions.find(r => r.id === playerLocation);
      setPrevLocation(playerLocation);
      if (oldRegion && newRegion) {
        setMarchAnim({
          fromX: oldRegion.x,
          fromY: oldRegion.y,
          toX: newRegion.x,
          toY: newRegion.y,
          active: true
        });
        setMarchProgress(0);
        const progressTimer = setTimeout(() => {
          setMarchProgress(1);
        }, 50);

        const timer = setTimeout(() => {
          setMarchAnim(null);
        }, 1600);
        return () => {
          clearTimeout(progressTimer);
          clearTimeout(timer);
        };
      }
    }
  }, [playerLocation, prevLocation, regions]);

  const activeQuestRegions = new Set(activeQuests.map(q => q.targetRegionId));

  const isExplored = (regionId: string) => {
    return exploredRegions.includes(regionId) || 
           regions.find(r => r.id === regionId)?.faction === 'PLAYER' || 
           playerLocation === regionId;
  };

  const handleRegionClick = (region: Region) => {
    setSelectedRegion(region);
  };

  const handleTravelClick = () => {
    if (selectedRegion && selectedRegion.id !== playerLocation) {
      onTravel(selectedRegion.id);
    }
  };

  const currentRegion = regions.find((r) => r.id === playerLocation);

  const handleTransfer = () => {
    if (!selectedRegion) return;
    if (transferAmount > playerStats.troops) {
      alert("调兵数量不可超过玩家所持有的义勇兵力！");
      return;
    }
    if (selectedRegion.faction !== 'PLAYER') {
      alert("只能往自家控制的根据池派遣驻军！");
      return;
    }
    onGarrisonTransfer(selectedRegion.id, transferAmount);
    setTransferAmount(1000);
  };

  return (
    <div id="tk-map-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map visualization area */}
      <div id="map-visualizer" className="lg:col-span-2 bg-artistic-bg border-4 border-artistic-charcoal rounded-none p-5 shadow-md relative overflow-hidden min-h-[460px] flex flex-col justify-between">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#3d3228_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
        
        {/* Map calligraphy title */}
        <div className="flex justify-between items-center mb-2 z-10">
          <div className="border-l-4 border-artistic-crimson pl-3">
            <h3 className="font-serif font-black text-lg text-artistic-charcoal">天下大势舆图 (🌁 战时迷雾已启)</h3>
            <p className="text-[10px] text-artistic-charcoal opacity-80 font-serif">汉路接连 · 策马调遣 · 各据点军策细节需攻伐或游历派遣斥候探明</p>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            {Object.values(FACTIONS).slice(0, 5).map((f) => (
              <span key={f.id} className="text-[9.5px] px-1.5 py-0.5 rounded-none border border-artistic-charcoal/30 bg-artistic-cream flex items-center gap-1 font-serif">
                <span className="w-2.5 h-2.5 inline-block" style={{ backgroundColor: f.color }}></span>
                {f.name}
              </span>
            ))}
          </div>
        </div>

        {/* Dynamic SVG Canvas Map */}
        <div className="relative w-full aspect-[4/3] border-2 border-artistic-charcoal bg-artistic-cream rounded-none overflow-hidden my-auto shadow-inner">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Draw Roads/Connected nodes - Obscured under Fog Of War */}
            {regions.map((region) =>
              region.connected.map((connId) => {
                const connRegion = regions.find((r) => r.id === connId);
                if (connRegion && region.id < connId) {
                  const startRevealed = isExplored(region.id);
                  const endRevealed = isExplored(connId);
                  
                  // Hide completely if neither endpoint is explored
                  if (!startRevealed && !endRevealed) return null;

                  return (
                    <line
                      key={`${region.id}-${connId}`}
                      x1={region.x}
                      y1={region.y}
                      x2={connRegion.x}
                      y2={connRegion.y}
                      stroke={startRevealed && endRevealed ? "#3d3228" : "#8c7e6c"}
                      strokeWidth={startRevealed && endRevealed ? "0.8" : "0.5"}
                      strokeDasharray={startRevealed && endRevealed ? "2,2" : "1,3"}
                      opacity={startRevealed && endRevealed ? "0.6" : "0.25"}
                    />
                  );
                }
                return null;
              })
            )}

            {/* Travel march route dash animation line */}
            {marchAnim && (
              <line
                x1={marchAnim.fromX}
                y1={marchAnim.fromY}
                x2={marchAnim.toX}
                y2={marchAnim.toY}
                stroke="#8d1d1f"
                strokeWidth="2.5"
                strokeDasharray="4,4"
                className="animate-[pulse_1s_infinite]"
                opacity="0.9"
              />
            )}
          </svg>

          {/* Marching troop line/horse avatar overlay */}
          {marchAnim && (
            <div 
              className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-[1500ms] ease-linear pointer-events-none select-none flex flex-col items-center"
              style={{
                left: `${marchProgress === 1 ? marchAnim.toX : marchAnim.fromX}%`,
                top: `${marchProgress === 1 ? marchAnim.toY : marchAnim.fromY}%`
              }}
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl animate-bounce">🐎</span>
                <span className="bg-[#5c0f11] text-[#fcfaf2] text-[8px] font-serif border border-amber-300 px-1 py-0.5 rounded-none font-bold shadow-md whitespace-nowrap leading-none scale-90">
                  三军召急行军中...
                </span>
              </div>
            </div>
          )}

          {/* Render individual regions */}
          {regions.map((region) => {
            const isPlayerHere = playerLocation === region.id;
            const isSelected = selectedRegion?.id === region.id;
            const regionRevealed = isExplored(region.id);
            const faction = FACTIONS[region.faction] || FACTIONS.HAN;
            const hasQuest = activeQuestRegions.has(region.id);

            return (
              <button
                key={region.id}
                onClick={() => handleRegionClick(region)}
                className={`absolute group transform -translate-x-1/2 -translate-y-1/2 focus:outline-none transition-all duration-300 z-20`}
                style={{ left: `${region.x}%`, top: `${region.y}%` }}
              >
                {/* Visual marker ring */}
                <div className="relative flex items-center justify-center">
                  {/* Aura for player presence */}
                  {isPlayerHere && (
                    <span className="absolute inline-flex h-10 w-10 animate-ping rounded-full bg-amber-400 opacity-60"></span>
                  )}
                  {/* Live Quest Radar Indicator */}
                  {hasQuest && !isPlayerHere && regionRevealed && (
                    <span className="absolute inline-flex h-8 w-8 animate-ping rounded-full bg-red-400/50"></span>
                  )}

                  {/* Main Node Dot */}
                  <div
                    className={`w-5.5 h-5.5 rounded-none border-2 shadow-md flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? 'border-artistic-crimson scale-125 ring-2 ring-artistic-crimson/55 shadow-[0_0_15px_rgba(180,83,9,0.7)]'
                        : 'border-artistic-charcoal group-hover:scale-125 group-hover:border-amber-500 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.85)]'
                    }`}
                    style={{ backgroundColor: regionRevealed ? faction.color : '#78716c' }}
                  >
                    {isPlayerHere && (
                      <div className="w-2 h-2 bg-white rounded-none animate-pulse" />
                    )}
                    {!regionRevealed && (
                      <span className="text-[10px] text-stone-200 font-bold font-serif select-none">?</span>
                    )}
                  </div>

                  {/* Tiny floating troop count pill for revealed cities */}
                  {regionRevealed && (
                    <div className="absolute -top-[19px] left-1/2 -translate-x-1/2 whitespace-nowrap bg-stone-100 border border-artistic-charcoal text-[7.5px] px-1 py-0.5 rounded-none font-mono font-bold leading-none flex items-center gap-0.5 z-10 shadow-[1px_1px_0px_#3d3228]">
                      <span>💂</span>
                      <span>{(region.garrison / 1000).toFixed(1)}k</span>
                    </div>
                  )}

                  {/* Regional control indicator / Quest Indicator (only if revealed) */}
                  {hasQuest && regionRevealed && (
                    <span className="absolute -top-3 -right-3 bg-artistic-crimson text-[9px] text-artistic-bg px-1.5 py-0.5 border border-artistic-charcoal rounded-none font-serif font-bold animate-bounce z-30">
                      战
                    </span>
                  )}

                  {/* Standard Label & Garrison Strength Overlay */}
                  <div className={`absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-artistic-charcoal text-[#ede0c5] text-[9.5px] px-2 py-0.5 rounded-none border border-artistic-charcoal/80 transition-all z-20 flex flex-col items-center shadow-lg ${
                    isSelected ? 'opacity-100 ring-2 ring-amber-550 scale-105' : 'opacity-90 group-hover:opacity-100 group-hover:scale-105'
                  }`}>
                    <span className="font-serif font-black tracking-wide">
                      {regionRevealed ? region.name : `${region.name} (🌁)`}
                    </span>
                    {regionRevealed && (
                      <span className="text-[8px] font-mono font-bold text-amber-300 border-t border-[#ede0c5]/20 w-full mt-0.5 pt-0.5 text-center flex items-center justify-center gap-0.5">
                        💂 {region.garrison.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Enhanced Hover Tactical Tooltip Card */}
                  <div className="absolute top-11 left-1/2 -translate-x-1/2 bg-[#fcfaf2] text-[#2a2319] text-[9px] p-2 rounded-none border-2 border-artistic-charcoal shadow-2xl transition-all duration-150 z-30 pointer-events-none opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:visible group-hover:scale-100 min-w-[155px] font-serif text-left">
                    <div className="border-b border-[#5c0f11] pb-1 mb-1 flex justify-between items-center gap-2">
                      <strong className="text-xs text-[#5c0f11] font-serif font-black">{region.name}</strong>
                      <span className="text-[8px] bg-stone-200 border border-stone-400 text-stone-700 px-1 font-bold leading-none scale-90">
                        {regionRevealed ? faction.name : '未知宿守'}
                      </span>
                    </div>
                    {regionRevealed ? (
                      <div className="space-y-0.5 font-serif">
                        <div className="flex justify-between gap-1 text-stone-600">
                          <span>💂 军民防务:</span>
                          <span className="font-mono font-bold text-stone-900">{region.garrison.toLocaleString()}人</span>
                        </div>
                        <div className="flex justify-between gap-1 text-stone-600">
                          <span>🌾 季度税饷:</span>
                          <span className="font-mono font-bold text-emerald-850">+{region.revenue} 黄金</span>
                        </div>
                        <div className="flex justify-between gap-1 text-stone-600">
                          <span>🏗️ 属县开垦:</span>
                          <span className="font-mono font-bold text-amber-850">{region.development}%</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-stone-550 italic leading-snug">
                        战火浓重雾锁，据守、季度屯粮级别皆不可查。请移宿军旅，遣哨开拓！
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Footnote information */}
        <div className="mt-2 text-[10.5px] text-artistic-charcoal/80 text-right bg-artistic-cream p-1.5 rounded-none border border-artistic-charcoal/30 font-serif">
          大汉舆图：各据点道路连属。未插旗或未曾游历之地，受乱兵与厚雾掩护。策马而行探明全境地理后可开征赋税、整斥兵员。
        </div>
      </div>

      {/* Selected Region details panel */}
      <div id="region-detail-panel" className="flex flex-col gap-4">
        {selectedRegion ? (() => {
          const regionRevealed = isExplored(selectedRegion.id);
          const faction = FACTIONS[selectedRegion.faction] || FACTIONS.HAN;

          return (
            <div className="bg-[#fcfaf2] border-4 border-artistic-charcoal rounded-none p-5 shadow-md flex-1 flex flex-col justify-between">
              {/* Dynamic 2-column layout to separate Static Info vs Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Column 1: Static Info */}
                <div id="region-static-info" className="space-y-4">
                  <div>
                    <div className="flex justify-between items-start gap-2 flex-wrap mb-1.5">
                      <h4 className="font-serif font-black text-xl text-artistic-charcoal leading-none">
                        {regionRevealed ? selectedRegion.name : `${selectedRegion.name} (🌁 未探明)`}
                      </h4>
                      <span className={`text-[9px] px-2 py-0.5 font-serif font-bold border rounded-none leading-none scale-95 ${
                        regionRevealed ? faction.badgeClass : 'bg-stone-200 text-stone-600 border-stone-400'
                      }`}>
                        {regionRevealed ? faction.name : '未知驻守'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed italic font-serif">
                      {regionRevealed 
                        ? `“${selectedRegion.description}”`
                        : '“此城市仍笼罩于地方乱兵浓雾之中。派遣行马哨军出关游历，方可开辟根据。拓土可收取租金、召集流民，亦能查阅守备之虚实。”'
                      }
                    </p>
                  </div>

                  {/* Operational indicators / stats */}
                  <div className="space-y-2 border-t border-stone-200 pt-3">
                    <h5 className="text-[10px] font-bold font-serif text-stone-400 uppercase tracking-wider">据地建设与产出级别：</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="bg-[#faf5ec] p-2 border border-stone-300/40 font-serif">
                        <div className="text-[9px] text-[#5c0f11] font-bold flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-[#5c0f11]" />
                          <span>辖区耕地开发</span>
                        </div>
                        <div className="font-sans font-bold text-xs text-stone-800 mt-0.5">
                          {regionRevealed ? `${selectedRegion.development} / 100` : '?? / 100'}
                        </div>
                      </div>
                      <div className="bg-[#faf5ec] p-2 border border-stone-300/40 font-serif">
                        <div className="text-[9px] text-emerald-800 font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-700" />
                          <span>季度赋金增益</span>
                        </div>
                        <div className="font-sans font-bold text-xs text-stone-800 mt-0.5">
                          {regionRevealed ? `+${selectedRegion.revenue} 黄金 / 季` : '?? 黄金 / 季'}
                        </div>
                      </div>
                      <div className="bg-[#faf5ec] p-2 border border-stone-300/40 font-serif col-span-1 sm:col-span-2">
                        <div className="text-[9px] text-[#5c0f11] font-bold flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>辖地城内守兵</span>
                        </div>
                        <div className={`font-sans font-black text-sm mt-0.5 transition-all ${
                          regionRevealed && selectedRegion.garrison > 5000 
                            ? 'text-amber-700 animate-pulse font-black' 
                            : 'text-stone-900'
                        }`}>
                          {regionRevealed 
                            ? `${selectedRegion.garrison.toLocaleString()} 兵卒` 
                            : '???? 人驻守'
                          }
                          {regionRevealed && selectedRegion.garrison > 5000 && (
                            <span className="ml-1.5 text-[9px] bg-amber-100 text-amber-800 border border-amber-300 px-1 py-0.5 rounded-none font-serif tracking-widest font-bold">
                              🏰 雄关重镇
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Active Actions */}
                <div id="region-active-actions" className="space-y-4 border-t md:border-t-0 md:border-l border-stone-200 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between">
                  <div>
                    <h5 className="text-[10px] font-bold font-serif text-stone-400 uppercase tracking-wider mb-2">执行政军事令:</h5>
                    {selectedRegion.id === playerLocation ? (
                      <div className="bg-emerald-500/10 border-l-4 border-emerald-600 p-2.5 text-[11px] leading-relaxed flex gap-2">
                        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-800" />
                        <span className="text-emerald-950 font-serif">
                          大军目前驻防驻留于 <strong>{selectedRegion.name}</strong> 辖区。主公可于<b>“内政经营”</b>中治水兴修，或探索本地区侧翼奇闻演义。
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 items-center justify-start animate-fade-in">
                        <button
                          onClick={handleTravelClick}
                          className="flex-1 min-w-[200px] bg-[#5c0f11] hover:bg-artistic-crimson text-[#fcfaf2] py-2.5 px-3 rounded-none font-serif font-black text-xs tracking-widest uppercase transition-colors duration-200 cursor-pointer shadow-md text-center"
                        >
                          {regionRevealed 
                            ? `策马行军至 ${selectedRegion.name}` 
                            : `🔭 斥候哨骑开道：移驻 ${selectedRegion.name}`
                          }
                        </button>
                        <p className="w-full text-[9px] text-[#5c0f11] italic font-serif leading-none mt-1">
                          * 急行军消耗较轻：25 黄金军饷、6 日程。
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Local transfer: only if player controls region AND it is revealed */}
                  {selectedRegion.faction === 'PLAYER' && regionRevealed && (
                    <div className="bg-[#faf5ec] p-2.5 border border-stone-300/60 rounded-none shadow-xs">
                      <h6 className="text-[10px] font-serif font-bold text-artistic-crimson mb-2 flex items-center gap-1 border-b border-stone-200 pb-1 uppercase tracking-wide">
                        <Shield className="w-3.5 h-3.5" />
                        大将往该城要塞调防
                      </h6>
                      <div className="flex gap-2 items-center mb-1.5">
                        <input
                          type="range"
                          min="500"
                          max={Math.max(500, playerStats.troops)}
                          step="500"
                          value={transferAmount}
                          onChange={(e) => setTransferAmount(Number(e.target.value))}
                          className="flex-1 accent-artistic-crimson cursor-pointer"
                        />
                        <span className="text-[11px] font-bold text-stone-900 font-mono min-w-[50px] text-right shrink-0">
                          {transferAmount}人
                        </span>
                      </div>
                      <button
                        onClick={handleTransfer}
                        disabled={playerStats.troops < 500}
                        className="w-full bg-artistic-charcoal hover:bg-artistic-crimson disabled:bg-stone-300 disabled:text-stone-500 text-[#ede0c5] py-1.5 px-2 rounded-none text-[10.5px] font-serif font-black transition-colors cursor-pointer shadow-sm text-center"
                      >
                        确认部阵进屯守卫 ({playerStats.troops >= 500 ? "领兵发遣" : "兵力告竭"})
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Subtitle footer info bar */}
              <div className="border-t border-dashed border-stone-300 pt-2.5 mt-4 text-[9.5px] text-stone-500 font-serif flex justify-between items-center bg-stone-50/50 px-2 py-1 rounded-none select-none">
                <span>州郡要害地缘交错，握之则安，弃之则危。</span>
                <span>主公中营义勇行斥：{playerStats.troops.toLocaleString()} 兵卒</span>
              </div>
            </div>
          );
        })() : (
          <div className="bg-artistic-bg border-4 border-artistic-charcoal rounded-none p-5 shadow-md flex-1 flex items-center justify-center text-artistic-charcoal/80 italic text-xs font-serif">
            请点击大汉舆图任意据点查阅天时地势。
          </div>
        )}
      </div>
    </div>
  );
}
