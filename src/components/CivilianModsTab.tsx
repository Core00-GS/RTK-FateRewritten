/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlayerStats, FactionId, Region } from '../types';
import { Sparkles, ToyBrick, Check, Plus, Trash2, Sliders, ShieldCheck } from 'lucide-react';

interface CivilianModsTabProps {
  playerStats: PlayerStats;
  setPlayerStats: React.Dispatch<React.SetStateAction<PlayerStats>>;
  regions: Region[];
  setRegions: React.Dispatch<React.SetStateAction<Region[]>>;
  relations: Record<FactionId, number>;
  setRelations: React.Dispatch<React.SetStateAction<Record<FactionId, number>>>;
  onExploredAll: () => void;
  showToast: (msg: string) => void;
  onAddBattleLog: (msg: string, type: 'action' | 'casualty' | 'gain' | 'random_event') => void;
}

interface Mod {
  id: string;
  name: string;
  author: string;
  desc: string;
  applied: boolean;
  onApply: () => void;
}

export default function CivilianModsTab({
  playerStats,
  setPlayerStats,
  regions,
  setRegions,
  relations,
  setRelations,
  onExploredAll,
  showToast,
  onAddBattleLog
}: CivilianModsTabProps) {
  // Built-in Civilian Mods
  const [mods, setMods] = useState<Mod[]>([
    {
      id: 'harvest_blessing',
      name: '【五谷丰登】神农物产增盈模组',
      author: '荆襄隐士白羽',
      desc: '激活此模组，乾坤播撒物物，太守常备大本营立即解算新增 +1000 黄金开局福利，名气大幅增肥！',
      applied: false,
      onApply: () => {
        setPlayerStats(prev => ({
          ...prev,
          gold: prev.gold + 1000,
          prestige: prev.prestige + 50
        }));
        onAddBattleLog("🔌 【民间模组-五谷丰登】已成功装载到本朝内阁！奉赐太守黄金 +1000，地方声望 +50。", "gain");
      }
    },
    {
      id: 'unfog_war',
      name: '【山河无极】天眼迷雾全开模组',
      author: '太史局极客校郎',
      desc: '解除大汉神州所有郡城关卡附近的战争厚雾！所有据点在天下大势舆图上直接现眼，免除多余打探开销。',
      applied: false,
      onApply: () => {
        onExploredAll();
        onAddBattleLog("🔌 【民间模组-山河无极】已被学者编译装载。全神州疆域测绘图均已澄净明彻（迷雾全解）！", "gain");
      }
    },
    {
      id: 'world_harmony',
      name: '【大同天下】群雄金石之盟模组',
      author: '东吴大都督爱乐',
      desc: '通过诸侯使节言语感化，遣派万金币，直接将曹操、刘备等群雄外务交谊度提升至黄金 +90 友好度！',
      applied: false,
      onApply: () => {
        setRelations(prev => ({
          ...prev,
          CAOCAO: 90,
          LIUBEI: 90,
          SUNQUAN: 90,
          HAN: 90
        }));
        onAddBattleLog("🔌 【民间模组-大同天下】大成装载！曹魏、蜀汉、东吴等天下霸业豪强对你赞不绝口，修好大值激涨至 90。", "gain");
      }
    },
    {
      id: 'god_armor',
      name: '【神御利兵】大营禁卫军爆兵模组',
      author: '陇西精骑大尉',
      desc: '激活太守虎卫兵大符印！召唤大汉旧边陲披甲精步骑兵 +5000 众直入大营大校场，并扩增政治与统率 +10！',
      applied: false,
      onApply: () => {
        setPlayerStats(prev => ({
          ...prev,
          troops: prev.troops + 5000,
          leadership: prev.leadership + 10,
          politics: prev.politics + 10
        }));
        onAddBattleLog("🔌 【民间模组-神御利兵】玄兵符印编译调来！禁营增加精兵防线 +5000，主公统率政治双升 +10。", "gain");
      }
    }
  ]);

  // Self Created Mods
  const [customName, setCustomName] = useState<string>('');
  const [customDesc, setCustomDesc] = useState<string>('');
  const [customGold, setCustomGold] = useState<number>(0);
  const [customTroops, setCustomTroops] = useState<number>(0);

  const toggleMod = (modId: string) => {
    const matched = mods.find(m => m.id === modId);
    if (!matched) return;

    if (matched.applied) {
      showToast("民间模组不逆向降级：此模组效果已被固化编纂历史。");
      return;
    }

    // Apply
    matched.onApply();
    
    setMods(prev => prev.map(m => m.id === modId ? { ...m, applied: true } : m));
    showToast(`民间模组【${matched.name}】编译并装载成功！`);
  };

  const createCustomMod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) {
      showToast("请输入民间模组之招牌案名！");
      return;
    }

    const newModId = `custom_${Date.now()}`;
    const newModName = `【自建】${customName}`;
    const newModDesc = customDesc || `主公精心撰写的战术册策：增补 ${customGold} 黄金，募集 ${customTroops} 精铁义兵入校。`;
    
    const newModInstance: Mod = {
      id: newModId,
      name: newModName,
      author: '明公心血手札',
      desc: newModDesc,
      applied: false,
      onApply: () => {
        setPlayerStats(prev => ({
          ...prev,
          gold: prev.gold + customGold,
          troops: prev.troops + customTroops
        }));
        onAddBattleLog(`🔌 【民间模组-${customName}】已被主公御笔亲自解封并启动！收获岁赋黄金 +${customGold}，义兵精锐 +${customTroops}。`, "gain");
      }
    };

    setMods(prev => [...prev, newModInstance]);
    
    // Reset Form
    setCustomName('');
    setCustomDesc('');
    setCustomGold(0);
    setCustomTroops(0);

    showToast(`成功创造并挂载了全新自定义民间模组【${customName}】，可以在上方列表随时点击部署解禁入库！`);
  };

  return (
    <div id="civilian-mods-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Installed list panel */}
      <div className="lg:col-span-2 bg-artistic-bg border-4 border-artistic-charcoal rounded-none p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="border-b border-artistic-charcoal pb-3 mb-4">
            <h3 className="font-serif font-black text-lg text-artistic-charcoal flex items-center gap-1.5">
              <ToyBrick className="w-5.5 h-5.5 text-artistic-crimson" />
              集贤阁民間模组管理仓
            </h3>
            <p className="text-[10.5px] text-artistic-charcoal opacity-85 font-serif">
              民间匠人与学者对大业历史简牍作出的同人扩延编纂，一键载入改写势力初始物资与地图天眼
            </p>
          </div>

          <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1 scrollbar-ink">
            {mods.map((mod) => (
              <div
                key={mod.id}
                className={`p-3 border-2 text-left rounded-none relative transition-all ${
                  mod.applied
                    ? 'border-emerald-700 bg-emerald-50/10'
                    : 'border-artistic-charcoal/40 bg-artistic-cream hover:bg-stone-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-serif font-black text-sm text-stone-900">{mod.name}</h4>
                    <span className="text-[9px] text-[#8b0000] font-serif opacity-80 bg-red-50 px-1 border border-red-200">
                      原作者: {mod.author}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleMod(mod.id)}
                    disabled={mod.applied}
                    className={`px-3 py-1 font-serif text-[10px] font-bold rounded-none transition-all cursor-pointer ${
                      mod.applied
                        ? 'bg-emerald-800 text-stone-100 cursor-default border border-transparent'
                        : 'bg-artistic-charcoal hover:bg-artistic-crimson text-white border border-transparent'
                    }`}
                  >
                    {mod.applied ? '✓ 已装载入阁' : '⚡ 挂载部署'}
                  </button>
                </div>
                <p className="text-xs text-stone-700 font-serif leading-relaxed pr-2">
                  {mod.desc}
                </p>
                {mod.applied && (
                  <div className="absolute bottom-2 right-2 scale-75 opacity-40">
                    <ShieldCheck className="w-12 h-12 text-emerald-800" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-artistic-charcoal/20 flex justify-between items-center text-xs text-artistic-charcoal font-serif">
          <div>主公当前状态：<span className="text-emerald-800 font-bold">🌾 {playerStats.gold} 黄金</span></div>
          <div>雄师总力：<span className="text-artistic-crimson font-bold">💂‍♂️ {playerStats.troops} 义兵</span></div>
        </div>
      </div>

      {/* Editor / Forge custom mod panel */}
      <div className="lg:col-span-1 bg-artistic-bg border-4 border-artistic-charcoal rounded-none p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="border-b border-artistic-charcoal/35 pb-2.5 mb-4">
            <h4 className="font-serif font-black text-sm text-artistic-charcoal flex gap-1.5 items-center">
              <Sliders className="w-4 h-4 text-stone-500 animate-pulse" />
              自研民间模组炉 (Forge Custom Mod)
            </h4>
          </div>

          <form onSubmit={createCustomMod} className="space-y-3.5 text-left">
            <div>
              <label className="block text-[11px] font-bold text-stone-800 mb-1 font-serif">模组名称 (Mod Name):</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="例如: 【神将降世】重振昭雪"
                className="w-full bg-artistic-cream border border-artistic-charcoal/30 px-2 py-1.5 text-xs font-serif text-stone-900 rounded-none focus:outline-none focus:border-artistic-crimson"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-800 mb-1 font-serif">模组功效简述 (Mod Description):</label>
              <textarea
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                placeholder="在此记述本民间模组的创意和对大业故事数值的修改效果..."
                rows={2}
                className="w-full bg-artistic-cream border border-artistic-charcoal/30 px-2 py-1.5 text-xs font-serif text-stone-900 rounded-none focus:outline-none focus:border-artistic-crimson resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9.5px] font-bold text-stone-800 mb-1 font-serif">赠赐黄金 (Gold):</label>
                <input
                  type="number"
                  value={customGold}
                  onChange={(e) => setCustomGold(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-artistic-cream border border-artistic-charcoal/30 px-2 py-1.5 text-xs font-mono text-stone-900 rounded-none focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[9.5px] font-bold text-stone-800 mb-1 font-serif">降临精兵 (Troops):</label>
                <input
                  type="number"
                  value={customTroops}
                  onChange={(e) => setCustomTroops(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-artistic-cream border border-artistic-charcoal/30 px-2 py-1.5 text-xs font-mono text-stone-900 rounded-none focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-artistic-crimson hover:bg-stone-900 text-white font-serif font-black text-xs py-2 px-3 transition-colors cursor-pointer flex justify-center items-center gap-1.5 shadow-[2px_2px_0px_#3d3228]"
            >
              <Plus className="w-4 h-4" />
              编译并挂载民间模组
            </button>
          </form>
        </div>

        <div className="mt-4 pt-3.5 border-t border-artistic-charcoal/20 text-[10px] text-stone-500 font-serif leading-relaxed text-left">
          * 自建的民间模组将会存放在集贤阁，你可以制作多组不同配给的补丁进行挂载调试。
        </div>
      </div>
    </div>
  );
}
