/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlayerStats, FactionId } from '../types';
import { FACTIONS } from '../data/regions';
import { Gift, Heart, ShieldAlert, Award, TrendingUp, Sparkles, Swords, UserCheck } from 'lucide-react';

interface FactionDiplomacyProps {
  playerStats: PlayerStats;
  setPlayerStats: React.Dispatch<React.SetStateAction<PlayerStats>>;
  relations: Record<FactionId, number>;
  setRelations: React.Dispatch<React.SetStateAction<Record<FactionId, number>>>;
  showToast: (msg: string) => void;
  onAddBattleLog: (msg: string, type: 'action' | 'casualty' | 'gain' | 'random_event') => void;
}

export default function FactionDiplomacy({
  playerStats,
  setPlayerStats,
  relations,
  setRelations,
  showToast,
  onAddBattleLog
}: FactionDiplomacyProps) {
  const [selectedFactionId, setSelectedFactionId] = useState<FactionId>('CAOCAO');

  // Filter out PLAYER from external diplomatic targeting
  const externalFactions = Object.values(FACTIONS).filter(f => f.id !== 'PLAYER');
  
  const activeRelation = relations[selectedFactionId] ?? 0;
  const activeFaction = FACTIONS[selectedFactionId];

  // Map relationship index to vintage terms
  const getRelationTone = (val: number) => {
    if (val >= 80) return { text: '金石之盟 (极度友好联姻)', color: 'text-emerald-700 bg-emerald-100/50 border-emerald-400' };
    if (val >= 40) return { text: '同心协力 (亲密往来)', color: 'text-emerald-600 bg-emerald-50/50 border-emerald-300' };
    if (val >= 10) return { text: '修好往来 (和睦共处)', color: 'text-stone-700 bg-stone-100 border-stone-300' };
    if (val >= -10) return { text: '互不干涉 (冷淡中立)', color: 'text-stone-500 bg-stone-50 border-stone-200' };
    if (val >= -50) return { text: '关系紧张 (戒备敌视)', color: 'text-amber-700 bg-amber-50 border-amber-300' };
    if (val >= -80) return { text: '势同水火 (剑拔弩张)', color: 'text-red-700 bg-red-50 border-red-300' };
    return { text: '不死不休 (剿灭悬令)', color: 'text-red-900 bg-red-100/80 border-red-500 animate-pulse' };
  };

  const tone = getRelationTone(activeRelation);

  // Diplomatic Actions helper functions

  // 1. Offer Gold
  const giftGold = () => {
    const cost = 150;
    if (playerStats.gold < cost) {
      showToast("国库黄金钱粮不敷，无法遣使赠礼！最低需求 150 黄金。");
      return;
    }

    setPlayerStats(prev => ({
      ...prev,
      gold: prev.gold - cost,
      prestige: prev.prestige + 5,
      popularity: prev.popularity + 5
    }));

    setRelations(prev => {
      const currentVal = prev[selectedFactionId] ?? 0;
      return {
        ...prev,
        [selectedFactionId]: Math.min(100, currentVal + 15)
      };
    });

    const actionText = `🤝 【赐帛诸侯】主公慷慨解囊，遣使向【${activeFaction.name}】奉送了 $${cost} 黄金之修好厚礼！两方关系攀升至 ${Math.min(100, activeRelation + 15)} 响。主公声望+5，民心+5。`;
    onAddBattleLog(actionText, 'gain');
    showToast(`成功向【${activeFaction.name}】使臣交纳厚礼！两军修好大进！`);
  };

  // 2. Form Non-Aggression Pact
  const formPact = () => {
    const cost = 100;
    if (activeRelation < 10) {
      showToast(`【${activeFaction.name}】对主公意存警惕（关系需达 10 响以上），断然拒绝了合盟议论。`);
      return;
    }
    if (playerStats.gold < cost) {
      showToast("契约缔结仪式需祭天封印，缺少 100 黄金开销。");
      return;
    }

    setPlayerStats(prev => ({
      ...prev,
      gold: prev.gold - cost,
      prestige: prev.prestige + 15,
      popularity: prev.popularity + 10
    }));

    setRelations(prev => ({
      ...prev,
      [selectedFactionId]: Math.min(100, Math.max(prev[selectedFactionId] ?? 0, 40))
    }));

    const actionText = `📜 【和平盟约束】主公开置 100 黄金隆重誓盟，同【${activeFaction.name}】（领袖：${activeFaction.leader}）达成了军旅互不侵犯约定。山河互保，声望 +15，民声 +10。`;
    onAddBattleLog(actionText, 'gain');
    showToast(`盟约大成！成功同【${activeFaction.name}】设立和平默契。`);
  };

  // 3. Marriage Alliance
  const arrangeMarriage = () => {
    const cost = 300;
    if (activeRelation < 40) {
      showToast(`对方不允！（两家交谊须在 40 响以上），【${activeFaction.name}】高层婉拒了联姻之求。`);
      return;
    }
    if (playerStats.politics < 70) {
      showToast(`主公中枢内阁政治手腕不够（政治属性须 70 以上），难以说服游说各大家尊长。`);
      return;
    }
    if (playerStats.gold < cost) {
      showToast("聘礼与迎亲大礼缺少 300 黄金巨额开辟。");
      return;
    }

    setPlayerStats(prev => ({
      ...prev,
      gold: prev.gold - cost,
      prestige: prev.prestige + 30,
      popularity: prev.popularity + 20
    }));

    setRelations(prev => ({
      ...prev,
      [selectedFactionId]: 80
    }));

    const actionText = `❤️ 【秦晋联姻之禧】主公交割 300 黄金红妆，同【${activeFaction.name}】大族结为婚姻同盟！天下大贺，两方情谊提攀至 80（金石之盟）。声望 +30，民意人气大涨 +20！`;
    onAddBattleLog(actionText, 'gain');
    showToast(`喜结良缘！主公大军同【${activeFaction.name}】缔结了最牢靠的战时婚缘纽带！`);
  };

  // 4. Demanding Tribute
  const performDeterrence = () => {
    if (playerStats.force < 75 && playerStats.leadership < 70) {
      showToast("主公虎威不著（必须武力 >= 75 或 统率 >= 70），书信震慑力甚弱，为群雄所耻笑。");
      return;
    }

    setPlayerStats(prev => ({
      ...prev,
      popularity: Math.max(0, prev.popularity - 10) // Aggression values drops civil voice
    }));

    const rollChance = Math.random();
    if (rollChance < 0.70) {
      // Success! Extract resources
      setPlayerStats(prev => ({
        ...prev,
        gold: prev.gold + 100
      }));

      setRelations(prev => {
        const currentVal = prev[selectedFactionId] ?? 0;
        return {
          ...prev,
          [selectedFactionId]: Math.max(-100, currentVal - 30)
        };
      });

      const successText = `⚔️ 【修书威压成功】主公凭借虎威发出檄文，斥责【${activeFaction.name}】。对方震恐于天威，解送 100 黄金前来求和！两国关系恶化跌损 -30。玩家得此贡给，民度跌损 -10。`;
      onAddBattleLog(successText, 'gain');
      showToast(`威压成功！对方权衡利弊后乖乖向我解送了 100 黄金买路财。`);
    } else {
      // Failed! Enemy retaliates in border clash
      setPlayerStats(prev => ({
        ...prev,
        troops: Math.max(100, prev.troops - 200)
      }));

      setRelations(prev => ({
        ...prev,
        [selectedFactionId]: -80
      }));

      const failText = `💀 【威压惨遭拒抗】主公飞诏威慑【${activeFaction.name}】失败！对方将官勃然大怒破除使节，并在边塞发生大冲突，精兵战损跌失 -200 骑！两方关系跌入冰点 (-80)。`;
      onAddBattleLog(failText, 'casualty');
      showToast(`威吓失效！其将校拔营截杀我军边防，守卒遭遇严重折损！`);
    }
  };

  return (
    <div id="diplomacy-interface-panel" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Target Factions Select List */}
      <div className="lg:col-span-1 bg-artistic-bg border-4 border-artistic-charcoal rounded-none p-5 shadow-md flex flex-col justify-between">
        <div>
          <div className="border-b border-artistic-charcoal/40 pb-3 mb-4">
            <h3 className="font-serif font-black text-lg text-artistic-charcoal flex items-center gap-1.5">
              <Swords className="w-5 h-5 text-artistic-crimson" />
              诸州群雄谱
            </h3>
            <p className="text-[10.5px] text-artistic-charcoal/80 font-serif">天下诸侯逐鹿，需权衡利弊，结交制霸</p>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-ink">
            {externalFactions.map((f) => {
              const fRelation = relations[f.id] ?? 0;
              const fTone = getRelationTone(fRelation);
              const isSelected = selectedFactionId === f.id;

              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFactionId(f.id)}
                  className={`w-full text-left p-2.5 border rounded-none transition-all cursor-pointer block ${
                    isSelected
                      ? 'border-2 border-artistic-crimson bg-artistic-crimson/5 shadow-sm'
                      : 'border-artistic-charcoal/30 bg-artistic-cream hover:bg-stone-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-serif font-bold text-xs flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 inline-block" style={{ backgroundColor: f.color }} />
                      {f.name}
                    </span>
                    <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-none" style={{ backgroundColor: f.color + '20', color: f.color }}>
                      领袖: {f.leader}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] mt-2 font-serif">
                    <span className="opacity-75">修好评价:</span>
                    <span className={`font-bold px-1 border ${fTone.color.split(' ')[0]}`}>
                      {fRelation} 响 ({fTone.text.split(' ')[0]})
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-artistic-charcoal/20 text-[10px] text-artistic-charcoal/80 font-serif leading-relaxed">
          💂‍♂️ <b>名声 (声望)</b>、<b>民声 (民心)</b> 乃逐鹿皇图之宝器。赠宝与和平盟约将扩充民声与名声；霸道压榨则将受阻大众而受退民声。
        </div>
      </div>

      {/* Selected Faction Ministry Details and Actions Console */}
      <div className="lg:col-span-2 bg-artistic-bg border-4 border-artistic-charcoal rounded-none p-5 shadow-md flex flex-col justify-between">
        <div>
          {/* Header Title Information */}
          <div className="border-b-2 double border-artistic-charcoal pb-4 mb-4 flex justify-between items-start flex-wrap gap-2">
            <div>
              <span className="text-[10px] bg-artistic-charcoal text-artistic-bg px-2 py-0.5 font-bold rounded-none font-serif">
                诸郡节使使館阁
              </span>
              <h2 className="font-serif font-black text-2xl text-artistic-charcoal mt-1.5 flex items-center gap-2">
                <span className="w-4 h-4 inline-block" style={{ backgroundColor: activeFaction.color }} />
                联络与国：{activeFaction.name}
              </h2>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-artistic-charcoal/70 font-serif">本署外务尚书官印</div>
              <div className={`text-xs font-serif font-black px-3 py-1 border-[2px] mt-1 ${tone.color}`}>
                【{tone.text}】
              </div>
            </div>
          </div>

          {/* Faction Intro Details */}
          <div className="bg-artistic-cream p-4 border border-artistic-charcoal/30 mb-6 rounded-none">
            <div className="grid grid-cols-2 gap-2 text-xs font-serif text-stone-800 border-b border-artistic-charcoal/25 pb-2 mb-2 font-black">
              <div>领袖：<span className="text-artistic-crimson">{activeFaction.leader}</span></div>
              <div className="text-right">旗帜色：<span className="font-mono" style={{ color: activeFaction.color }}>{activeFaction.color}</span></div>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed font-serif text-left">
              {activeFaction.description}
            </p>
          </div>

          {/* Dynamic Interactive Diplomatic Commands Matrix */}
          <h3 className="font-serif font-black text-sm text-artistic-charcoal mb-3 border-l-4 border-artistic-crimson pl-2.5">
            外务军事令 (Diplomatic Commands)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Act 1: 遣使赠礼 */}
            <div className="bg-artistic-cream border border-artistic-charcoal/20 p-3.5 rounded-none flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <h4 className="font-serif font-black text-sm text-stone-900 flex gap-1 items-center">
                    <Gift className="w-4 h-4 text-emerald-700" />
                    赠予金帛
                  </h4>
                  <span className="text-[10px] bg-emerald-150 text-emerald-800 border border-emerald-400/20 px-1.5 py-0.5 font-bold">
                    🌾 150 黄金
                  </span>
                </div>
                <p className="text-[11px] text-stone-700 font-serif leading-relaxed mb-3">
                  向其权门贵戚投送黄金厚礼以消减芥蒂。两家修好积分<b>上升 +15 响</b>，主公<b>声望 (名声) +5</b>、<b>民心 (民声) +5</b>。
                </p>
              </div>
              <button
                onClick={giftGold}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-serif font-bold text-xs py-2 px-3 border border-emerald-950 transition-colors cursor-pointer"
              >
                执使礼奉交宝物
              </button>
            </div>

            {/* Act 2: 缔结和平约束 */}
            <div className="bg-artistic-cream border border-artistic-charcoal/20 p-3.5 rounded-none flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <h4 className="font-serif font-black text-sm text-stone-900 flex gap-1 items-center">
                    <UserCheck className="w-4 h-4 text-amber-700" />
                    修书息兵合约
                  </h4>
                  <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-400/20 px-1.5 py-0.5 font-bold">
                    🌾 100 黄金
                  </span>
                </div>
                <p className="text-[11px] text-stone-700 font-serif leading-relaxed mb-3">
                  在两家稍有信任（<b>关系 10 以上</b>）基础上盟誓立贴，互不来侵。<b>关系拉升至 40 响以上</b>，主公<b>声望 +15</b>、<b>民声 +10</b>。
                </p>
              </div>
              <button
                onClick={formPact}
                disabled={activeRelation < 10}
                className="w-full bg-artistic-charcoal hover:bg-artistic-crimson disabled:bg-stone-300 disabled:text-stone-500 disabled:border-stone-400 text-white font-serif font-bold text-xs py-2 px-3 border border-transparent transition-colors cursor-pointer"
              >
                {activeRelation < 10 ? "对方对你存有不信，拒绝息兵" : "誓血立言缔结和盟"}
              </button>
            </div>

            {/* Act 3: 秦晋联姻 */}
            <div className="bg-artistic-cream border border-artistic-charcoal/20 p-3.5 rounded-none flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <h4 className="font-serif font-black text-sm text-stone-900 flex gap-1 items-center">
                    <Heart className="w-4 h-4 text-rose-700" />
                    遣使联姻大好
                  </h4>
                  <span className="text-[10px] bg-rose-100 text-rose-800 border border-rose-400/20 px-1.5 py-0.5 font-bold">
                    🌾 300 黄金
                  </span>
                </div>
                <p className="text-[11px] text-stone-700 font-serif leading-relaxed mb-3">
                  迎娶其尊亲贵戚之娇女缔结政治姻亲。需<b>交谊 40 响以上计</b>且玩家<b>政治 ≥ 70</b>。<b>两家关系永固攀升至 80 强响并锁盟</b>。<b>声望 +30</b>，<b>民声 +20</b>。
                </p>
              </div>
              <button
                onClick={arrangeMarriage}
                disabled={activeRelation < 40 || playerStats.politics < 70}
                className="w-full bg-rose-800 hover:bg-rose-900 disabled:bg-stone-300 disabled:text-stone-500 disabled:border-stone-400 text-white font-serif font-bold text-xs py-2 px-3 border border-rose-950 transition-colors cursor-pointer"
              >
                {activeRelation < 40 
                  ? "交谊不厚对方谢绝提亲" 
                  : playerStats.politics < 70 
                    ? "主公内政斡旋手腕不足 (政治需70)" 
                    : "送上聘礼聘金缔结红妆姻亲"}
              </button>
            </div>

            {/* Act 4: 威压恐吓缴粮 */}
            <div className="bg-artistic-cream border border-artistic-charcoal/20 p-3.5 rounded-none flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <h4 className="font-serif font-black text-sm text-stone-900 flex gap-1 items-center">
                    <ShieldAlert className="w-4.5 h-4.5 text-artistic-crimson animate-pulse" />
                    修书威压勒索
                  </h4>
                  <span className="text-[10px] bg-stone-100 border border-stone-400/20 px-1.5 py-0.5 text-artistic-crimson font-bold">
                    需武力 75 / 统率 70
                  </span>
                </div>
                <p className="text-[11px] text-stone-700 font-serif leading-relaxed mb-3">
                  陈兵关卡向弱小诸侯勒贡黄金。有<b>70%概率成功窃取 100 黄金</b>，但关系会<b>急坠下降 -30 响</b>并<b>折降民声 -10</b>。若失败则引发边关喋血 clash 战。
                </p>
              </div>
              <button
                onClick={performDeterrence}
                disabled={playerStats.force < 75 && playerStats.leadership < 70}
                className="w-full bg-artistic-crimson hover:bg-stone-900 disabled:bg-stone-300 disabled:text-stone-500 disabled:border-stone-400 text-white font-serif font-bold text-xs py-2 px-3 border border-transparent transition-colors cursor-pointer"
              >
                {playerStats.force < 75 && playerStats.leadership < 70 ? "大将声威不足以服众" : "大发檄书威恐劫夺钱粮"}
              </button>
            </div>
          </div>
        </div>

        {/* Footnote status bar */}
        <div className="mt-6 pt-3.5 border-t border-artistic-charcoal/30 flex justify-between items-center text-xs text-artistic-charcoal font-serif font-black">
          <div>主公当前拥资：<span className="text-emerald-800">🌾 {playerStats.gold} 黄金</span></div>
          <div>大幕军校属性：<span className="text-artistic-crimson">💪 统率 {playerStats.leadership} · 🏛️ 政治 {playerStats.politics}</span></div>
        </div>
      </div>
    </div>
  );
}
