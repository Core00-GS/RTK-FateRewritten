/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { PlayerStats, Region } from '../types';
import { FACTIONS } from '../data/regions';
import { Coins, UserPlus, Sprout, Landmark, Gift, Heart, Scale, ShieldAlert, Sun, CloudRain, Snowflake, Bug } from 'lucide-react';

interface TerritoryGovProps {
  playerStats: PlayerStats;
  regions: Region[];
  onGovAction: (
    actionType: 'RECRUIT' | 'TILLAGE' | 'RELIEF' | 'ARMAMENT',
    goldCost: number,
    statChanges: Partial<PlayerStats>,
    regionAffectedId?: string
  ) => void;
  onHarvestTaxes: (totalGoldHarvested: number) => void;
  taxCooldown: boolean;
  onResetTaxCooldown: () => void;
}

export default function TerritoryGov({
  playerStats,
  regions,
  onGovAction,
  onHarvestTaxes,
  taxCooldown,
  onResetTaxCooldown
}: TerritoryGovProps) {
  const [selectedRegionId, setSelectedRegionId] = useState<string>(
    regions.find((r) => r.faction === 'PLAYER')?.id || regions[0].id
  );

  const playerControlledRegions = regions.filter((r) => r.faction === 'PLAYER');
  const targetRegion = regions.find((r) => r.id === selectedRegionId) || regions[0];

  // Dynamic Seasonal & Weather Harvest calculations based on player month stats
  const m = playerStats.month;
  const weatherIndex = (playerStats.year * 13 + m) % 3;
  
  let seasonName = "春耕 (Spring)";
  let weatherName = "时雨连绵";
  let weatherDesc = "细雨润泽麦田，草木温润。农业岁入提升 +15%！";
  let harvestMultiplier = 1.15;

  if (m >= 1 && m <= 3) {
    seasonName = "春耕时期 (春季)";
    if (weatherIndex === 0) {
      weatherName = "🌧️ 时雨连绵";
      weatherDesc = "春雨细润，麦叶生青。农业岁入提升 +15%！";
      harvestMultiplier = 1.15;
    } else if (weatherIndex === 1) {
      weatherName = "❄️ 倒春寒潮";
      weatherDesc = "突降塞外霜土，冻死草苗。农业岁入下滑 -20%！";
      harvestMultiplier = 0.8;
    } else {
      weatherName = "🌤️ 和煦和风";
      weatherDesc = "春光普照，物候如常。岁获量平稳保底。";
      harvestMultiplier = 1.0;
    }
  } else if (m >= 4 && m <= 6) {
    seasonName = "夏耘稼穑 (夏季)";
    if (weatherIndex === 0) {
      weatherName = "☀️ 烈日当空";
      weatherDesc = "光合灌溉充溢，作物大长。农业岁入提振 +25%！";
      harvestMultiplier = 1.25;
    } else if (weatherIndex === 1) {
      weatherName = "🦗 飞蝗蔽日";
      weatherDesc = "历史灾旱：漫天飞蝗扫荡禾秆，岁入赋税减半 (-50%)！";
      harvestMultiplier = 0.5;
    } else {
      weatherName = "🌦️ 骤雨洗尘";
      weatherDesc = "雨润流足，沟洫充溢。岁产喜迎 +10% 顺延增发。";
      harvestMultiplier = 1.1;
    }
  } else if (m >= 7 && m <= 9) {
    seasonName = "秋收收获 (秋季)";
    if (weatherIndex === 0) {
      weatherName = "🎑 风调雨顺";
      weatherDesc = "农家麦浪滔野，大丰大宿。岁税征得保障暴增 +40%！";
      harvestMultiplier = 1.4;
    } else if (weatherIndex === 1) {
      weatherName = "🌾 亢阳大旱";
      weatherDesc = "赤地烈日炙晒，谷米少结。岁入蒙折 -25%。";
      harvestMultiplier = 0.75;
    } else {
      weatherName = "🍂 金风送爽";
      weatherDesc = "节序变迁，稻花麦香。丰产岁入顺利 +15%。";
      harvestMultiplier = 1.15;
    }
  } else {
    seasonName = "冬藏封储 (冬季)";
    if (weatherIndex === 0) {
      weatherName = "🌨️ 瑞雪兆丰";
      weatherDesc = "瑞雪压麦，冻死泥中百害虫。税产预丰小进 +10%。";
      harvestMultiplier = 1.1;
    } else if (weatherIndex === 1) {
      weatherName = "🥶 关河封冻";
      weatherDesc = "极寒呼号，运河冰锁。行商退避，税缴折损 -30%。";
      harvestMultiplier = 0.7;
    } else {
      weatherName = "🌤️ 寒云送煦";
      weatherDesc = "冬阳抚野，仓廪储蓄持平。税产正常运转。";
      harvestMultiplier = 1.0;
    }
  }

  // Find which weather class and icon fits the weatherIndex / weatherName
  let weatherBg = "bg-amber-50 border-amber-200 text-amber-900";
  let weatherIcon = <Sun className="w-10 h-10 text-amber-500 animate-pulse" />;

  if (weatherName.includes("雨") || weatherName.includes("时雨")) {
    weatherBg = "bg-blue-50/75 border-blue-200 text-blue-900";
    weatherIcon = <CloudRain className="w-10 h-10 text-blue-500 animate-pulse" />;
  } else if (weatherName.includes("雪") || weatherName.includes("寒潮") || weatherName.includes("冷") || weatherName.includes("寒") || weatherName.includes("冻")) {
    weatherBg = "bg-sky-50/75 border-sky-200 text-sky-900";
    weatherIcon = <Snowflake className="w-10 h-10 text-sky-400 animate-bounce" />;
  } else if (weatherName.includes("蝗")) {
    weatherBg = "bg-red-50/75 border-red-200 text-red-950";
    weatherIcon = <Bug className="w-10 h-10 text-orange-600 animate-pulse" />;
  } else if (weatherName.includes("日") || weatherName.includes("阳") || weatherName.includes("旱") || weatherName.includes("光") || weatherName.includes("和煦") || weatherName.includes("晴")) {
    weatherBg = "bg-yellow-50/75 border-yellow-200 text-yellow-950";
    weatherIcon = <Sun className="w-10 h-10 text-amber-500 animate-pulse" />;
  } else {
    weatherBg = "bg-stone-50/80 border-stone-200 text-stone-900";
    weatherIcon = <Sun className="w-10 h-10 text-stone-400 animate-pulse" />;
  }

  // Calculate total taxes player can collect under current crop/weather variation
  const baseTaxes = playerControlledRegions.reduce((accum, r) => accum + r.revenue, 100); // 100 is base court salary
  const totalTaxRevenue = Math.round(baseTaxes * harvestMultiplier);

  const handleRecruitAction = () => {
    const cost = 200;
    if (playerStats.gold < cost) {
      alert("国库钱粮空虚！招兵买马缺少 200 黄金储备。");
      return;
    }
    // Draft amount scales based on player's leadership level or count of controlled cities
    const draftAmount = 1000 + (playerStats.leadership * 5) + (playerControlledRegions.length * 200);
    onGovAction(
      'RECRUIT',
      cost,
      {
        troops: playerStats.troops + draftAmount,
        leadership: playerStats.leadership + 1
      }
    );
    alert(`【大肆募兵】你散发榜文招揽乡里义烈之士，征募得精干新卒 +${draftAmount} 骑，统帅大长！`);
  };

  const handleTillageAction = () => {
    const cost = 150;
    if (playerStats.gold < cost) {
      alert("黄金储备不足！发展屯田需 150 黄金。");
      return;
    }
    onGovAction(
      'TILLAGE',
      cost,
      {
        politics: playerStats.politics + 1
      },
      selectedRegionId
    );
    alert(`【屯田开荒】督发大批壮劳力在 ${targetRegion.name} 开荒种植，广修水利沟渠。该据点季度税得随之提高！政治属性上升！`);
  };

  const handleReliefAction = () => {
    const cost = 150;
    if (playerStats.gold < cost) {
      alert("黄金余额不够，无法筹买大米施粥！");
      return;
    }
    onGovAction(
      'RELIEF',
      cost,
      {
        virtue: playerStats.virtue + 1,
        prestige: playerStats.prestige + 45
      }
    );
    alert(`【施粥救灾】你搭建热棚施舍稠米大麦，四海流浪饥民欢欣歌呼。你的德行提高 +1，势力声望大涨 +45！`);
  };

  const handleArmamentAction = () => {
    const cost = 250;
    if (playerStats.gold < cost) {
      alert("无法秘造坚甲利刃！锻造精兵需要 250 黄金。");
      return;
    }
    onGovAction(
      'ARMAMENT',
      cost,
      {
        force: playerStats.force + 1,
        leadership: playerStats.leadership + 1,
        troops: playerStats.troops - 200 // Discard outdated soldiers to strengthen elites
      }
    );
    alert(`【修缮军甲】秘锻黑铁长矛、精铸玄铜护盾，你的军卒战意极其昂扬。武力上升 +1，统率上升 +1！`);
  };

  const handleTaxHarvest = () => {
    if (taxCooldown) {
      alert("据点官员正在盘查本季度账簿，各府开库征粮尚需稍候片刻（将在下次回合或选项决策后解封）。");
      return;
    }
    onHarvestTaxes(totalTaxRevenue);
    alert(`【季度征收 - ${seasonName}】主公下发玺文，各地府库开拔解送赋税利禄 +${totalTaxRevenue} 黄金入帐下！(当前天候: ${weatherName}，岁效乘数: x${harvestMultiplier.toFixed(2)})`);
  };

  return (
    <div id="tk-gov-wrapper" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Dynamic strategic governance actions list */}
      <div id="gov-command-panel" className="lg:col-span-2 bg-artistic-bg border-4 border-artistic-charcoal rounded-none p-5 shadow-md">
        <div className="border-b border-artistic-charcoal/40 pb-3 mb-4">
          <h3 className="font-serif font-black text-lg text-artistic-charcoal flex items-center gap-1.5">
            <Landmark className="w-5 h-5 text-artistic-crimson" />
            中枢幕府府衙 · 内政要务
          </h3>
          <p className="text-xs text-artistic-charcoal opacity-80 font-serif">安民如水，缮甲聚粮 · 仓廪实而国泰，兵革足而天下宁</p>
        </div>

        {/* Core Actions Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Action 1: Draft recruits */}
          <div className="bg-artistic-cream border border-artistic-charcoal/20 p-4 rounded-none flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="bg-artistic-crimson/15 text-artistic-crimson border border-artistic-crimson/30 text-[10.5px] px-2 py-0.5 rounded-none font-serif font-bold">
                  修缮大营
                </span>
                <span className="text-xs text-artistic-charcoal font-sans font-bold">🌾 200 黄金</span>
              </div>
              <h4 className="font-serif font-black text-artistic-ink text-sm flex gap-1 items-center">
                <UserPlus className="w-4 h-4 text-artistic-crimson" />
                张贴募兵 (积卒万千)
              </h4>
              <p className="text-xs text-[#2a2319] mt-1 leading-normal mb-3 font-serif">
                散发天命檄文召揽各路勇壮之士执戟，永久性地扩大玩家的大营义勇兵总力，长其武勋。
              </p>
            </div>
            <button
              onClick={handleRecruitAction}
              className="w-full bg-artistic-charcoal hover:bg-artistic-crimson text-artistic-bg py-2 px-3 rounded-none font-serif font-bold text-xs transition-colors cursor-pointer"
            >
              征募义勇民工士参阵
            </button>
          </div>

          {/* Action 2: Rice / Relief */}
          <div className="bg-artistic-cream border border-artistic-charcoal/20 p-4 rounded-none flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="bg-emerald-800/10 text-emerald-800 border border-emerald-800/20 text-[10.5px] px-2 py-0.5 rounded-none font-serif font-bold">
                  弘修大德
                </span>
                <span className="text-xs text-artistic-charcoal font-sans font-bold">🌾 150 黄金</span>
              </div>
              <h4 className="font-serif font-black text-artistic-ink text-sm flex gap-1 items-center">
                <Gift className="w-4.5 h-4.5 text-emerald-700" />
                施粥赈难 (大博善名)
              </h4>
              <p className="text-xs text-[#2a2319] mt-1 leading-normal mb-3 font-serif">
                开库熬取稠粥赠济边关苦命遗孤难民。可累积<b>德行</b>德行值，霸业<b>威望</b>大幅提振腾飞。
              </p>
            </div>
            <button
              onClick={handleReliefAction}
              className="w-full bg-artistic-charcoal hover:bg-artistic-crimson text-artistic-bg py-2 px-3 rounded-none font-serif font-bold text-xs transition-colors cursor-pointer"
            >
              设棚大度饥民积攒善资
            </button>
          </div>

          {/* Action 3: Farmland / Tillage */}
          <div className="bg-artistic-cream border border-artistic-charcoal/20 p-4 rounded-none flex flex-col justify-between shadow-sm col-span-1 md:col-span-2">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="bg-amber-800/10 text-amber-900 border border-amber-800/20 text-[10.5px] px-2 py-0.5 rounded-none font-serif font-bold">
                  庶务强基
                </span>
                <span className="text-xs text-artistic-charcoal font-sans font-bold">🌾 150 黄金</span>
              </div>
              <h4 className="font-serif font-black text-artistic-ink text-sm flex gap-1.5 items-center">
                <Sprout className="w-4.5 h-4.5 text-amber-900" />
                屯田垦荒物阜 (开辟垄亩)
              </h4>
              <p className="text-xs text-[#2a2319] mt-1 leading-normal mb-3 font-serif text-left">
                在任意玩家属城开展荒野开掘屯垦、广修水渠灌溉，增加地方纳粮量。<b>政治</b>政治值将大涨。
              </p>
              {/* Region selection drop folder */}
              <div className="flex gap-2 items-center mb-3">
                <label className="text-[10.5px] font-serif font-bold text-artistic-charcoal whitespace-nowrap">
                  目标城池地域：
                </label>
                <select
                  value={selectedRegionId}
                  onChange={(e) => setSelectedRegionId(e.target.value)}
                  className="bg-artistic-bg border border-artistic-charcoal/30 rounded-none text-xs px-2.5 py-1 text-artistic-charcoal font-serif focus:outline-none focus:border-artistic-crimson"
                >
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}（控制者: {FACTIONS[r.faction].name}）
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleTillageAction}
              disabled={targetRegion.development >= 100}
              className="w-full bg-artistic-charcoal hover:bg-artistic-crimson disabled:bg-stone-300 disabled:text-stone-500 text-artistic-bg py-2 px-3 rounded-none font-serif font-bold text-xs transition-colors cursor-pointer"
            >
              {targetRegion.development >= 100 ? "该据点开发度已上限" : `在 ${targetRegion.name} 组织大屯垦`}
            </button>
          </div>

          {/* Action 4: Steel Armaments */}
          <div className="bg-artistic-cream border border-artistic-charcoal/20 p-4 rounded-none flex flex-col justify-between shadow-sm col-span-1 md:col-span-2">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="bg-purple-800/10 text-purple-900 border border-purple-800/20 text-[10.5px] px-2 py-0.5 rounded-none font-serif font-bold">
                  军机秘甲
                </span>
                <span className="text-xs text-artistic-charcoal font-sans font-bold">🌾 250 黄金</span>
              </div>
              <h4 className="font-serif font-black text-artistic-ink text-sm flex gap-1.5 items-center">
                <Scale className="w-4.5 h-4.5 text-purple-900" />
                铸造利刃 · 玄铜配甲 (整军战意)
              </h4>
              <p className="text-xs text-[#2a2319] mt-1 leading-normal mb-3 font-serif">
                采购落日黑铁、精金配发将勋，极大地精炼队伍，裁其弱卒长其刃精。主公<b>武力</b>与<b>统率</b>因此大幅提升。
              </p>
            </div>
            <button
              onClick={handleArmamentAction}
              className="w-full bg-artistic-charcoal hover:bg-artistic-crimson text-artistic-bg py-2 px-3 rounded-none font-serif font-bold text-xs transition-colors cursor-pointer"
            >
              大肆兴造神兵铁刃
            </button>
          </div>
        </div>
      </div>

      {/* Taxation ledger panel */}
      <div id="gov-ledger-panel" className="flex flex-col gap-4">
        <div className="bg-artistic-bg border-4 border-artistic-charcoal rounded-none p-5 shadow-md flex-1 flex flex-col justify-between">
          <div>
            <div className="border-b border-artistic-charcoal pb-3 mb-4">
              <h3 className="font-serif font-black text-lg text-artistic-charcoal">地方仓廪税册</h3>
              <p className="text-[10.5px] text-artistic-charcoal/80 font-serif">大汉神州土地，尽按季度纳款</p>
            </div>

            {/* Seasonal Harvest Event Information card */}
            <div className={`border-2 p-3 rounded-none mb-3.5 text-left font-serif transition-all ${weatherBg}`}>
              <div className="flex items-center gap-3">
                {/* Weather icon effect frame */}
                <div className="p-2 border border-artistic-charcoal/30 bg-white/70 flex items-center justify-center shadow-xs">
                  {weatherIcon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center border-b border-artistic-charcoal/20 pb-1 mb-1 text-[11px] font-bold">
                    <span className="text-artistic-crimson font-serif font-black">{seasonName}</span>
                    <span className="bg-artistic-charcoal text-[#f2e6d0] px-1.5 py-0.5 text-[9px] font-serif leading-none">{weatherName}</span>
                  </div>
                  <p className="text-stone-800 text-[10.5px] leading-snug mb-1">{weatherDesc}</p>
                  <div className="text-[9.5px] text-stone-600 font-mono font-bold flex justify-between items-center">
                    <span>当季岁产变效比率:</span>
                    <span className={`text-[11.5px] font-black ${harvestMultiplier >= 1.0 ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}`}>
                      x{harvestMultiplier.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* List of player controlled cities with localized tax details */}
            <div className="space-y-2 max-h-[260px] overflow-y-auto mb-4 pr-1 scrollbar-ink">
              <div className="flex justify-between text-[11px] font-bold text-artistic-charcoal/60 border-b border-artistic-charcoal/20 pb-1 font-serif">
                <span>控制据点</span>
                <span>税入</span>
              </div>
              <div className="flex justify-between text-xs text-[#2a2319] font-serif p-1.5 bg-artistic-cream border border-artistic-charcoal/10 rounded-none">
                <span>皇汉奉薪 / 朝廷俸禄</span>
                <span className="font-sans font-bold text-emerald-800">+100 🌾</span>
              </div>
              {playerControlledRegions.length > 0 ? (
                playerControlledRegions.map((r) => (
                  <div key={r.id} className="flex justify-between text-xs text-[#2a2319] font-serif p-1.5 border-b border-artistic-charcoal/10">
                    <span>{r.name}（开发: {r.development}%）</span>
                    <span className="font-sans font-bold text-emerald-800">+{r.revenue} 🌾</span>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-artistic-charcoal/50 font-serif italic">
                  去占领北海、幽州诸重地，扩延季度产粮！
                </div>
              )}
            </div>

            {/* Sum taxation stats */}
            <div className="bg-artistic-cream p-3 rounded-none border border-artistic-charcoal/30 mb-4 flex justify-between items-center text-xs">
              <span className="font-serif font-black text-artistic-charcoal">本季总赋税黄金：</span>
              <span className="font-sans font-black text-emerald-800 text-sm">+{totalTaxRevenue} 黄金</span>
            </div>
          </div>

          <div>
            {/* Collect button */}
            <button
              onClick={handleTaxHarvest}
              disabled={taxCooldown}
              className={`w-full py-3 px-4 rounded-none font-serif font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                taxCooldown
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed border border-stone-400/40'
                  : 'bg-emerald-800 hover:bg-emerald-900 border border-emerald-950 text-artistic-bg'
              }`}
            >
              <Coins className="w-5 h-5" />
              开天下库征缴本季粮款 ({taxCooldown ? "本季赋税已储积" : "解送金纳粮"})
            </button>
            <p className="text-[10px] text-artistic-charcoal/80 text-center mt-2.5 font-serif italic">
              * 征税每季度将在选项决策、主奇演义后自动恢纳为可取敛状态。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
