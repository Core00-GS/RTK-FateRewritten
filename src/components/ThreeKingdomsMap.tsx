/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
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
          </svg>

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
                  {/* Pulse for side quests (only trigger if revealed) */}
                  {hasQuest && !isPlayerHere && regionRevealed && (
                    <span className="absolute inline-flex h-8 w-8 animate-ping rounded-full bg-red-400 opacity-40"></span>
                  )}

                  {/* Main Node Dot */}
                  <div
                    className={`w-5 h-5 rounded-none border-2 shadow-md flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-artistic-crimson scale-125 ring-2 ring-artistic-crimson/55'
                        : 'border-artistic-charcoal group-hover:scale-110'
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

                  {/* Hover tooltips/Label */}
                  <div className={`absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-artistic-charcoal text-artistic-bg text-[10.5px] px-2.5 py-1 rounded-none border border-artistic-charcoal transition-all z-20 ${
                    isSelected ? 'opacity-100' : 'opacity-85 group-hover:opacity-100'
                  }`}>
                    <span className="font-serif font-bold">
                      {regionRevealed ? region.name : `${region.name} (🌁 雾锁)`}
                    </span>
                    {regionRevealed && region.garrison > 0 && (
                      <span className="ml-1 text-[9px] text-[#ede0c5]">
                        ({(region.garrison / 1000).toFixed(1)}k)
                      </span>
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
            <div className="bg-artistic-bg border-4 border-artistic-charcoal rounded-none p-5 shadow-md flex-1 flex flex-col justify-between">
              <div>
                {/* Header Info */}
                <div className="border-b border-artistic-charcoal pb-3 mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-serif font-black text-2xl text-artistic-charcoal">
                      {regionRevealed ? selectedRegion.name : `${selectedRegion.name} (🌁 未探明)`}
                    </h3>
                    <span className={`text-[10px] px-2.5 py-1 font-serif font-bold border rounded-none ${
                      regionRevealed ? faction.badgeClass : 'bg-stone-200 text-stone-600 border-stone-400/40'
                    }`}>
                      {regionRevealed ? faction.name : '未知驻军势力'}
                    </span>
                  </div>
                  <p className="text-xs text-artistic-ink leading-relaxed mt-1 italic font-serif opacity-90">
                    {regionRevealed 
                      ? `“${selectedRegion.description}”`
                      : '“此地区笼罩在沙场传令不通之浓重迷雾下。你目前未占领此处，亦未派遣人马移守、巡查，城中守将、屯田规模及商业产出一律不明。”'
                    }
                  </p>
                </div>

                {/* Parameters metrics list */}
                <div className="grid grid-cols-2 gap-3.5 text-xs text-artistic-ink mb-5">
                  <div className="bg-artistic-cream p-2.5 rounded-none border border-artistic-charcoal/20 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-800" />
                    <div>
                      <div className="text-[9px] text-artistic-charcoal opacity-70">地方开发度</div>
                      <div className="font-bold">{regionRevealed ? `${selectedRegion.development} / 100` : '?? / 100'}</div>
                    </div>
                  </div>
                  <div className="bg-artistic-cream p-2.5 rounded-none border border-artistic-charcoal/20 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-800" />
                    <div>
                      <div className="text-[9px] text-artistic-charcoal opacity-70">每季税粮产出</div>
                      <div className="font-bold">{regionRevealed ? `+${selectedRegion.revenue} 黄金` : '?? 黄金'}</div>
                    </div>
                  </div>
                  <div className="bg-artistic-cream p-2.5 rounded-none border border-artistic-charcoal/20 col-span-2 flex items-center gap-3">
                    <Users className="w-4.5 h-4.5 text-artistic-crimson" />
                    <div>
                      <div className="text-[9px] text-artistic-charcoal opacity-70">据守屯田守军</div>
                      <div className="font-bold text-sm">
                        {regionRevealed 
                          ? `${selectedRegion.garrison.toLocaleString()} 义勇军` 
                          : '???? 人驻屯'
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick interactive actions based on selection */}
                <div className="border-t border-artistic-charcoal/25 pt-4">
                  {selectedRegion.id === playerLocation ? (
                    <div className="bg-emerald-500/10 border-l-4 border-emerald-600 p-3 rounded-none text-xs leading-relaxed flex gap-2">
                      <Info className="w-4 h-4 shrink-0 mt-0.5 text-emerald-800" />
                      <span className="text-emerald-950 font-serif">
                        当前正率军伫留在 <strong>{selectedRegion.name}</strong> 驻守。可在<b>“内政经营”</b>中修缮开发此大据点，或在<b>“奇遇演义”</b>栏目触发该城奇遇章。
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={handleTravelClick}
                        className="w-full bg-artistic-charcoal hover:bg-artistic-crimson text-artistic-bg py-2.5 px-4 rounded-none font-serif font-bold text-xs tracking-widest uppercase transition-colors duration-200 cursor-pointer shadow-sm animate-fade-in"
                      >
                        {regionRevealed ? `策马游历至 ${selectedRegion.name} (小耗25金)` : `🔭 遣哨侦收兵并移驻 ${selectedRegion.name} (开辟迷雾，耗25金)`}
                      </button>
                      <p className="text-[10px] text-artistic-charcoal opacity-75 text-center italic font-serif">
                        * 移驻需耗费少许车马军费与 6 日程。可驱逐当地天灾流匪迷雾并将其永久探明。
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Faction deployment: only if player controls region AND it's explored */}
              {selectedRegion.faction === 'PLAYER' && regionRevealed && (
                <div className="border-t border-artistic-charcoal/30 pt-4 mt-4">
                  <h4 className="text-xs font-serif font-bold text-artistic-crimson mb-2 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-artistic-crimson" />
                    往根据地大举调兵屯守
                  </h4>
                  <div className="flex gap-2 items-center">
                    <input
                      type="range"
                      min="500"
                      max={Math.max(500, playerStats.troops)}
                      step="500"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(Number(e.target.value))}
                      className="flex-1 accent-artistic-crimson"
                    />
                    <span className="text-xs font-bold text-artistic-charcoal min-w-[50px] text-right">
                      {transferAmount}人
                    </span>
                  </div>
                  <button
                    onClick={handleTransfer}
                    disabled={playerStats.troops < 500}
                    className="w-full mt-2.5 bg-artistic-charcoal hover:bg-artistic-crimson disabled:bg-stone-300 disabled:text-stone-500 text-artistic-bg py-2 px-3 rounded-none text-xs font-serif font-extrabold transition-colors cursor-pointer shadow-sm text-center block uppercase tracking-wider"
                  >
                    确认调遣大将驻防此地
                  </button>
                </div>
              )}
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
