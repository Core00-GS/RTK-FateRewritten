/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlayerStats, Region } from '../types';
import { FACTIONS } from '../data/regions';
import { Coins, UserPlus, Sprout, Landmark, Gift, Heart, Scale, ShieldAlert, Sun, CloudRain, Snowflake, Bug } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface Petition {
  id: string;
  petitioner: string;
  avatar: string;
  title: string;
  narrative: string;
  cost: number;
  gainVirtue: number;
  gainPrestige: number;
  gainTroops?: number;
  acceptedLog: string;
  declinedLog: string;
}

const PETITIONS_POOL: Petition[] = [
  {
    id: 'p1',
    petitioner: '老丈 纪高',
    avatar: '👴',
    title: '寒村饥荒 · 乞免税租',
    narrative: '涿郡南关暴雨导致麦地半死，寒冬将至，数百村民冬无御衣、口无余粮。村民推选老丈纪高前来叩关求见，含泪请愿豁免本期十税一之赋税，并拨发一笔急用麦粟度冬。',
    cost: 120,
    gainVirtue: 3,
    gainPrestige: 25,
    acceptedLog: '主公宅心仁厚！您下旨蠲免了涿郡等地的秋租，并当堂发放 120 黄金急赈，老汉跪哭叩首，口称“明主出世，玄德再来”！您的德行、声望大涨！',
    declinedLog: '主公婉言谢绝，言及行军打仗、军械急迫，国库亦不能开此先例。老丈连声叹息，佝偻着身躯退下了。'
  },
  {
    id: 'p2',
    petitioner: '方丈 慧通',
    avatar: '🧘',
    title: '名山古刹 · 佛堂倾圮',
    narrative: '常山深处古松名寺遭夏洪泥石冲刷，大雄宝殿山门倾覆，金身半露雨中。方丈慧通大师长途跋涉前来乞请府库拨赏松木、雇请泥水匠人重修寺院，以此清涤暴戾、护民安康。',
    cost: 150,
    gainVirtue: 2,
    gainPrestige: 35,
    acceptedLog: '主公佛心昭然！特拨 150 黄金召工重修佛堂金身。寺成之日，万民云集朝拜，皆传颂主公崇文礼佛之功。您的德行及势力威名皆有所成！',
    declinedLog: '主公叹曰：“今天下涂炭，千万百姓易子而食，泥塑木雕之菩萨岂能急救？”方丈合十叹息，唱念佛号离去。'
  },
  {
    id: 'p3',
    petitioner: '士子 荀华',
    avatar: '🎒',
    title: '寒门秀才 · 赶考资粮',
    narrative: '一自称颍川名士之后的青年荀华跪陈，其人一贫如洗但胸罗万卷，奈何京师道远，盘缠遭劫。其人求见乞请主公资助买马、雇车与路盘，并誓言一旦及第必图厚报。',
    cost: 100,
    gainVirtue: 2,
    gainPrestige: 20,
    acceptedLog: '主公不拘一格纳英贤！特赠 100 黄金并赐快马一匹。荀华喜极而泣，立誓学成必为幕府效犬马之劳！德行增加，威名远扬！',
    declinedLog: '主公见其言辞浮夸，真假难辨，命衙役赠与其糙米一斗，打发离去。'
  },
  {
    id: 'p4',
    petitioner: '医者 董奉',
    avatar: '🩹',
    title: '热疫流行 · 求散青黛',
    narrative: '城内因暴雨引发热症，大批穷苦民户高烧咳血，无钱就诊。杏林医者董奉前来陈情，自言已有对症灵方，唯官库垄断了青黛、黄芩等急需草药，乞请主公特恩开放药库，普济万民。',
    cost: 130,
    gainVirtue: 3,
    gainPrestige: 30,
    acceptedLog: '主公大慈大悲！不仅开拔药库，更垫付 130 黄金用于煎药施诊。几日后疫病顿消，阖城百姓家家悬挂主公长生牌位！德行大长！',
    declinedLog: '主公言草药为军用战备物资，关乎士卒生命，不敢轻率开仓，命其另寻他法。董奉扼腕长叹。'
  },
  {
    id: 'p5',
    petitioner: '会长 陆富贵',
    avatar: '🐫',
    title: '江防渡桥 · 冲毁再兴',
    narrative: '秋汛大潮冲垮了沟通边疆郡县的要道大木桥，导致通商马帮、运粮车队尽皆瘫痪。本郡商会陆富贵求见，望府衙能牵头出资 200 黄金招募石匠改建稳固石桥，以通商路。',
    cost: 200,
    gainVirtue: 2,
    gainPrestige: 50,
    acceptedLog: '主公通商惠工！拔 200 黄金督造磐石拱桥，桥成之日车水马龙，各地商帮无不盛赞主公气吞山河、德润民生。声誉暴增，德行提高！',
    declinedLog: '主公叹言大战在即，库金需要用来筹办铁骑箭矢，木桥倾圮可暂用竹排渡江，陆会长抱拳叹息告退。'
  },
  {
    id: 'p6',
    petitioner: '遗孀 柳氏',
    avatar: '👩',
    title: '阵亡士卒 · 遗孤请恤',
    narrative: '前番抵御流寇暴匪中不幸殉国阵亡的一位柳校尉之孀妇柳氏，今日带着三名嗷嗷待哺的幼童长跪官衙外，哭诉军中抚恤被贪墨克扣，孤儿寡母生计维艰、无衣过冬。',
    cost: 80,
    gainVirtue: 2,
    gainPrestige: 20,
    gainTroops: 150,
    acceptedLog: '主公抚按遗烈，大恸之下，当众责罚了贪墨小吏，特赐 80 黄金厚恤柳氏，并亲手抱其遗孤、安置其军屯营。三军士卒见者无不痛哭流涕，战意大长，额外感召 150 名豪杰归队效命！',
    declinedLog: '主公命军营查验档案，按例差拨糙米二担抚慰。柳氏含泪谢恩离去。'
  }
];

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
  activeStance?: 'OFFENSIVE' | 'DEFENSIVE';
  onUpdatePlayerStats?: React.Dispatch<React.SetStateAction<PlayerStats>>;
  tradeRoutes?: { id: string; from: string; to: string; active: boolean }[];
  onUpdateTradeRoutes?: (routes: { id: string; from: string; to: string; active: boolean }[]) => void;
}

export default function TerritoryGov({
  playerStats,
  regions,
  onGovAction,
  onHarvestTaxes,
  taxCooldown,
  onResetTaxCooldown,
  activeStance = 'DEFENSIVE',
  onUpdatePlayerStats,
  tradeRoutes = [],
  onUpdateTradeRoutes
}: TerritoryGovProps) {
  const [selectedRegionId, setSelectedRegionId] = useState<string>(
    regions.find((r) => r.faction === 'PLAYER')?.id || regions[0].id
  );

  const [currentPetitionIndex, setCurrentPetitionIndex] = useState<number>(0);
  const [petitionOutcome, setPetitionOutcome] = useState<{ accepted: boolean; log: string } | null>(null);

  const playerControlledRegions = regions.filter((r) => r.faction === 'PLAYER');

  // Trade Route Setup Local select state trackers
  const [tradeSourceId, setTradeSourceId] = useState<string>('');
  const [tradeDestId, setTradeDestId] = useState<string>('');

  const initialSource = tradeSourceId || (playerControlledRegions[0]?.id || '');
  const initialDest = tradeDestId || (playerControlledRegions[1]?.id || '');

  const handleCreateTradeRoute = () => {
    if (!onUpdateTradeRoutes) return;
    if (playerStats.politics < 70) {
      alert("主公政治资质不足 70 点，暂时无法开展远途通商大策！");
      return;
    }
    const sourceReg = regions.find(r => r.id === initialSource);
    const destReg = regions.find(r => r.id === initialDest);
    
    if (!sourceReg || !destReg || sourceReg.id === destReg.id) {
      alert("请选择两个不同且已被我军全权控制的城池作为商线两翼！");
      return;
    }
    
    if (sourceReg.faction !== 'PLAYER' || destReg.faction !== 'PLAYER') {
      alert("通商两端城池必须皆属于我军控制区域！");
      return;
    }

    const alreadyExists = tradeRoutes.some(r => 
      (r.from === sourceReg.id && r.to === destReg.id) ||
      (r.from === destReg.id && r.to === sourceReg.id)
    );
    if (alreadyExists) {
      alert("商道早已开凿并常态运转中，无须重复架设协议！");
      return;
    }

    const fee = 120;
    if (playerStats.gold < fee) {
      alert(`开辟丝路、征纳护路卒需要统配 ${fee} 黄金，您的国库余额不足！`);
      return;
    }

    // Deduct gold and add route
    if (onUpdatePlayerStats) {
      onUpdatePlayerStats(prev => ({ ...prev, gold: prev.gold - fee }));
    }

    const newRoute = {
      id: `route_${Date.now()}`,
      from: sourceReg.id,
      to: destReg.id,
      active: true
    };

    onUpdateTradeRoutes([...tradeRoutes, newRoute]);
    alert(`【商榷成功】您拨付 ${fee} 黄金雇请驼队，正式确立【${sourceReg.name} ⇆ ${destReg.name}】的行商路线！通商运转后，每日时序轮转均将带给势力丰厚被动商得。`);
  };

  // Compute geopolitical distribution for the Pie Chart representation
  const factionCounts: Record<string, { name: string; count: number; color: string }> = {};
  regions.forEach((r) => {
    const factionId = r.faction || 'HAN';
    const factionInfo = FACTIONS[factionId] || { name: '其他', color: '#888888' };
    if (!factionCounts[factionId]) {
      factionCounts[factionId] = {
        name: factionInfo.name,
        count: 0,
        color: factionInfo.color || '#888888'
      };
    }
    factionCounts[factionId].count++;
  });

  const pieData = Object.keys(factionCounts).map((key) => ({
    name: factionCounts[key].name,
    value: factionCounts[key].count,
    color: factionCounts[key].color
  })).sort((a, b) => b.value - a.value);
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
  let weatherIcon = <Sun className="w-10 h-10 text-amber-500" />;

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

  // Dynamic Seasonal UI Styles
  let seasonBg = "bg-artistic-bg shadow-[inset_0_0_15px_rgba(0,0,0,0.03)]"; // Default
  let seasonCreamBg = "bg-[#ede0c5]";
  let seasonThemeBorder = "border-[#3d3228]/40";
  let seasonTitleColor = "text-artistic-charcoal";
  let seasonTextColor = "text-artistic-charcoal opacity-85";
  let seasonButtonClass = "bg-artistic-charcoal hover:bg-artistic-crimson text-artistic-bg";
  let seasonBorderClass = "border-4 border-double border-artistic-charcoal";

  if (m >= 1 && m <= 3) { // Spring (Jade Green / Emerald Calligraphy)
    seasonBg = "bg-emerald-50/95 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]";
    seasonCreamBg = "bg-emerald-100/50 border border-emerald-200/40";
    seasonThemeBorder = "border-emerald-800/30";
    seasonTitleColor = "text-emerald-950 font-black";
    seasonTextColor = "text-emerald-900";
    seasonButtonClass = "bg-emerald-800 hover:bg-emerald-900 text-white";
    seasonBorderClass = "border-4 border-double border-emerald-800/90";
  } else if (m >= 4 && m <= 6) { // Summer (Crimson Fire / Amber Red)
    seasonBg = "bg-red-50/95 shadow-[inset_0_0_20px_rgba(239,68,68,0.05)]";
    seasonCreamBg = "bg-red-100/50 border border-red-200/40";
    seasonThemeBorder = "border-red-800/30";
    seasonTitleColor = "text-red-950 font-black";
    seasonTextColor = "text-red-900";
    seasonButtonClass = "bg-red-800 hover:bg-red-900 text-white";
    seasonBorderClass = "border-4 border-dashed border-red-700/90 [animation-duration:3s]";
  } else if (m >= 7 && m <= 9) { // Autumn (Ochre Harvest / Warm Amber - Corrected index to include Month 9)
    seasonBg = "bg-amber-50/95 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]";
    seasonCreamBg = "bg-amber-100/50 border border-amber-200/40";
    seasonThemeBorder = "border-amber-700/30";
    seasonTitleColor = "text-amber-950 font-black";
    seasonTextColor = "text-amber-900";
    seasonButtonClass = "bg-amber-700 hover:bg-amber-800 text-white";
    seasonBorderClass = "border-4 border-solid border-amber-700/95";
  } else { // Winter (Snow Silver / Ice Slate - Month 10, 11, 12)
    seasonBg = "bg-slate-50/95 shadow-[inset_0_0_20px_rgba(148,163,184,0.05)]";
    seasonCreamBg = "bg-slate-100/50 border border-slate-200/40";
    seasonThemeBorder = "border-slate-400/30";
    seasonTitleColor = "text-slate-950 font-black";
    seasonTextColor = "text-slate-900";
    seasonButtonClass = "bg-slate-700 hover:bg-slate-800 text-white";
    seasonBorderClass = "border-8 border-double border-slate-500/90";
  }

  // Calculate total taxes player can collect under current crop/weather variation
  const passiveInc = playerStats.autoDevelopmentPassiveIncome || 0;
  const baseTaxes = playerControlledRegions.reduce((accum, r) => accum + r.revenue, 100) + passiveInc; // 105 is base court salary and passive increments
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

  const scaleTaxRevenue = activeStance === 'DEFENSIVE' ? Math.round(totalTaxRevenue * 0.75) : totalTaxRevenue;

  const handleTaxHarvest = () => {
    if (taxCooldown) {
      alert("据点官员正在盘查本季度账簿，各府开库征粮尚需稍候片刻（将在下次回合或选项决策后解封）。");
      return;
    }
    onHarvestTaxes(scaleTaxRevenue);
    alert(`【季度征收 - ${seasonName}】主公下发玺文，各地府库开拔解送赋税利禄！${activeStance === 'DEFENSIVE' ? '当前处于「守势 (Defensive)」印契，征赋折缴减税分派 25%。' : ''}各地黄金粮款共计 +${scaleTaxRevenue} 黄金解运入藏！(当前天候: ${weatherName}，岁效乘数: x${harvestMultiplier.toFixed(2)})`);
  };

  return (
    <div id="tk-gov-wrapper" className="grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-500 relative z-10">
      {/* Dynamic strategic governance actions list */}
      <div id="gov-command-panel" className={`lg:col-span-2 rounded-none p-5 shadow-md transition-all duration-500 ${seasonBg} ${seasonBorderClass}`}>
        <div className={`border-b ${seasonThemeBorder} pb-3 mb-4`}>
          <h3 className={`font-serif font-black text-lg flex items-center gap-1.5 ${seasonTitleColor}`}>
            <Landmark className="w-5 h-5 text-artistic-crimson animate-pulse" />
            中枢幕府府衙 · 内政要务 ({seasonName.split('(')[0].trim()})
          </h3>
          <p className={`text-xs font-serif ${seasonTextColor}`}>安民如水，缮甲聚粮 · 仓廪实而国泰，兵革足而天下宁</p>
        </div>

        {/* Core Actions Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Action 1: Draft recruits WITH Tooltip */}
          <div className={`${seasonCreamBg} border ${seasonThemeBorder} p-4 rounded-none flex flex-col justify-between shadow-sm transition-all duration-500 relative group`}>
            {/* Hover Tooltip Card */}
            <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-3.5 w-60 bg-stone-950 text-stone-100 text-[10.5px] p-3 border border-amber-600 shadow-2xl z-40 font-serif rounded-none leading-relaxed pointer-events-none text-left">
              <h5 className="font-bold text-amber-400 border-b border-stone-850 pb-0.5 mb-1">💂 张贴招募 (Draft) 裨益：</h5>
              <p className="text-stone-300">⏱️ **行动耗费**：10 日历程</p>
              <p className="text-stone-300">🌾 **国库消耗**：200 黄金饷米</p>
              <div className="mt-1 pb-1 border-t border-stone-800">
                <p className="text-emerald-400 font-bold">📈 属性 & 军事实录成长：</p>
                <p>• 中营精锐兵卒: <span className="font-mono text-emerald-300 font-bold">+{1000 + (playerStats.leadership * 5) + (playerControlledRegions.length * 200)}</span> 卒</p>
                <p>• 主公「<b>统帅 (Leadership)</b>」: <span className="font-mono text-emerald-300">+1</span></p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="bg-artistic-crimson/15 text-artistic-crimson border border-artistic-crimson/30 text-[10.5px] px-2 py-0.5 rounded-none font-serif font-bold">
                  修缮大营
                </span>
                <span className={`text-xs font-sans font-bold ${seasonTitleColor}`}>🌾 200 黄金</span>
              </div>
              <h4 className={`font-serif font-black text-sm flex gap-1 items-center ${seasonTitleColor}`}>
                <UserPlus className="w-4 h-4 text-artistic-crimson animate-pulse" />
                张贴募兵 (积卒万千)
              </h4>
              <p className={`text-xs mt-1 leading-normal mb-3 font-serif ${seasonTextColor}`}>
                散发天命檄文召揽各路勇壮之士执戟，永久性地扩大玩家的大营义勇兵总力，长其武勋。
              </p>
            </div>
            <button
              onClick={handleRecruitAction}
              className={`w-full ${seasonButtonClass} py-2 px-3 rounded-none font-serif font-bold text-xs transition-colors cursor-pointer shadow-sm`}
            >
              征募义勇民工士参阵
            </button>
          </div>

          {/* Action 2: Rice / Relief WITH Tooltip */}
          <div className={`${seasonCreamBg} border ${seasonThemeBorder} p-4 rounded-none flex flex-col justify-between shadow-sm transition-all duration-500 relative group`}>
            {/* Hover Tooltip Card */}
            <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-3.5 w-60 bg-stone-950 text-stone-100 text-[10.5px] p-3 border border-emerald-500 shadow-2xl z-40 font-serif rounded-none leading-relaxed pointer-events-none text-left">
              <h5 className="font-bold text-emerald-400 border-b border-stone-850 pb-0.5 mb-1">🎁 施粥赈难 (Relief) 裨益：</h5>
              <p className="text-stone-300">⏱️ **行动耗费**：10 日历程</p>
              <p className="text-stone-300">🌾 **国库消耗**：150 黄金米粟</p>
              <div className="mt-1 pb-1 border-t border-stone-800">
                <p className="text-emerald-400 font-bold">📈 属性 & 势力声望成长：</p>
                <p>• 声威威名: <span className="font-mono text-emerald-300 font-bold">+45</span></p>
                <p>• 主公「<b>德行 (Virtue)</b>」: <span className="font-mono text-emerald-300">+1</span></p>
                <p className="text-[9.5px] text-stone-400 mt-1">💡 提示: 极高德行是在主线中感召赵云、徐庶等极品文武自动来投的先提要案！</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="bg-emerald-850/10 text-emerald-800 border border-emerald-800/20 text-[10.5px] px-2 py-0.5 rounded-none font-serif font-bold">
                  弘修大德
                </span>
                <span className={`text-xs font-sans font-bold ${seasonTitleColor}`}>🌾 150 黄金</span>
              </div>
              <h4 className={`font-serif font-black text-sm flex gap-1 items-center ${seasonTitleColor}`}>
                <Gift className="w-4.5 h-4.5 text-emerald-700" />
                施粥赈难 (大博善名)
              </h4>
              <p className={`text-xs mt-1 leading-normal mb-3 font-serif ${seasonTextColor}`}>
                开库熬取稠粥赠济边关苦命难民。可累积主公<b>德行</b>，势力名主<b>声望</b>大长暴增。
              </p>
            </div>
            <button
              onClick={handleReliefAction}
              className={`w-full ${seasonButtonClass} py-2 px-3 rounded-none font-serif font-bold text-xs transition-colors cursor-pointer shadow-sm`}
            >
              设棚大度饥民积攒善资
            </button>
          </div>

          {/* Action 3: Farmland / Tillage WITH Tooltip */}
          <div className={`${seasonCreamBg} border ${seasonThemeBorder} p-4 rounded-none flex flex-col justify-between shadow-sm col-span-1 md:col-span-2 transition-all duration-500 relative group`}>
            {/* Hover Tooltip Card */}
            <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-3.5 w-64 bg-stone-950 text-stone-100 text-[10.5px] p-3 border border-yellow-600 shadow-2xl z-40 font-serif rounded-none leading-relaxed pointer-events-none text-left">
              <h5 className="font-bold text-yellow-400 border-b border-stone-850 pb-0.5 mb-1">🌾 屯田垦荒 (Tillage) 裨益：</h5>
              <p className="text-stone-300">⏱️ **行动耗费**：10 日历程</p>
              <p className="text-stone-300">🌾 **国库消耗**：150 黄金</p>
              <div className="mt-1 pb-1 border-t border-stone-800">
                <p className="text-amber-400 font-bold">📈 各地据点与领主属性暴增：</p>
                <p>• 选定据点开发度: <span className="font-mono text-emerald-300 font-bold">+15%</span> (最高100%)</p>
                <p>• 选定据点季度税得: <span className="font-mono text-emerald-300 font-bold">+25%</span></p>
                <p>• 主公「<b>政治 (Politics)</b>」: <span className="font-mono text-emerald-300">+1</span></p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="bg-amber-800/10 text-amber-900 border border-amber-800/20 text-[10.5px] px-2 py-0.5 rounded-none font-serif font-bold">
                  庶务强基
                </span>
                <span className={`text-xs font-sans font-bold ${seasonTitleColor}`}>🌾 150 黄金</span>
              </div>
              <h4 className={`font-serif font-black text-sm flex gap-1.5 items-center ${seasonTitleColor}`}>
                <Sprout className="w-4.5 h-4.5 text-amber-950 animate-bounce" />
                屯田垦荒物阜 (开辟垄亩)
              </h4>
              <p className={`text-xs mt-1 leading-normal mb-3 font-serif text-left ${seasonTextColor}`}>
                在任意玩家属城开展荒野开掘屯垦、广修水渠灌溉，增加地方纳粮量。主公<b>政治</b>值将增加。
              </p>
              {/* Region selection drop folder */}
              <div className="flex gap-2 items-center mb-3">
                <label className={`text-[10.5px] font-serif font-bold whitespace-nowrap ${seasonTitleColor}`}>
                  目标城池地域：
                </label>
                <select
                  value={selectedRegionId}
                  onChange={(e) => setSelectedRegionId(e.target.value)}
                  className="bg-white border border-stone-300 rounded-none text-xs px-2.5 py-1 text-stone-800 font-serif focus:outline-none focus:border-emerald-600"
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
              className={`w-full ${seasonButtonClass} disabled:bg-stone-300 disabled:text-stone-500 py-2 px-3 rounded-none font-serif font-bold text-xs transition-colors cursor-pointer shadow-sm`}
            >
              {targetRegion.development >= 100 ? "该据点开发度已上限" : `在 ${targetRegion.name} 组织大屯垦`}
            </button>
          </div>

          {/* Action 4: Steel Armaments WITH Tooltip */}
          <div className={`${seasonCreamBg} border ${seasonThemeBorder} p-4 rounded-none flex flex-col justify-between shadow-sm col-span-1 md:col-span-2 transition-all duration-500 relative group`}>
            {/* Hover Tooltip Card */}
            <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-3.5 w-64 bg-stone-950 text-stone-100 text-[10.5px] p-3 border border-purple-600 shadow-2xl z-40 font-serif rounded-none leading-relaxed pointer-events-none text-left">
              <h5 className="font-bold text-purple-400 border-b border-stone-850 pb-0.5 mb-1">⚔️ 精铸甲兵 (Armaments) 裨益：</h5>
              <p className="text-stone-300">⏱️ **行动耗费**：10 日历程</p>
              <p className="text-stone-300">🌾 **国库消耗**：250 黄金精铜</p>
              <div className="mt-1 pb-1 border-t border-stone-800">
                <p className="text-purple-400 font-bold">📈 玄德统御属性双极磨炼：</p>
                <p>• 裁汰疲碎弱卒: <span className="font-mono text-red-400 font-bold">-200</span> 人（以精练宿卫虎贲）</p>
                <p>• 主公「<b>武力 (Force)</b>」天资: <span className="font-mono text-emerald-300 font-bold">+1</span></p>
                <p>• 主公「<b>统帅 (Leadership)</b>」天资: <span className="font-mono text-emerald-300 font-bold">+1</span></p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="bg-purple-800/10 text-purple-900 border border-purple-800/20 text-[10.5px] px-2 py-0.5 rounded-none font-serif font-bold">
                  军机秘甲
                </span>
                <span className={`text-xs font-sans font-bold ${seasonTitleColor}`}>🌾 250 黄金</span>
              </div>
              <h4 className={`font-serif font-black text-sm flex gap-1.5 items-center ${seasonTitleColor}`}>
                <Scale className="w-4.5 h-4.5 text-purple-950" />
                铸造利刃 · 玄铜配甲 (整军战意)
              </h4>
              <p className={`text-xs mt-1 leading-normal mb-3 font-serif ${seasonTextColor}`}>
                采购落日黑铁、精金配发将勋，极大地精炼队伍，裁其弱卒长其刃精。主公<b>武力</b>与<b>统率</b>因此提升。
              </p>
            </div>
            <button
              onClick={handleArmamentAction}
              className={`w-full ${seasonButtonClass} py-2 px-3 rounded-none font-serif font-bold text-xs transition-colors cursor-pointer shadow-sm`}
            >
              大肆兴造神兵铁刃
            </button>
          </div>
        </div>

        {/* Automatic Development Investment Panel */}
        <div id="automatic-development-panel" className={`mt-6 border-t ${seasonThemeBorder} pt-4`}>
          <h4 className={`font-serif font-black text-sm flex gap-1.5 items-center mb-1 ${seasonTitleColor}`}>
            <Landmark className="w-4.5 h-4.5 text-emerald-800" />
            🌾 自动屯垦基建投资 (Automatic Infrastructure Development Engine)
          </h4>
          <p className={`text-[11px] mb-3 font-serif ${seasonTextColor}`}>
            将您的储备黄金本金派驻投入地方商会与农政设施。每当您在剧情中做出决策或进行太守要务使时序轮转，均会常态且永久累积式地增加 <b>常态被动折税总增量</b>，并反哺大笔现钱红利股息，助推长线宏观大业！
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`p-3 rounded-none border ${seasonThemeBorder} ${seasonCreamBg} flex flex-col justify-between`}>
              <div>
                <div className="text-[10px] uppercase tracking-wide opacity-75 font-mono">当前配置投资本金</div>
                <div className="text-xl font-sans font-black text-stone-900 mt-1">🪙 {playerStats.autoDevelopmentGold || 0} <span className="text-xs font-serif opacity-75">黄金</span></div>
              </div>
              <p className="text-[10px] text-stone-550 mt-2 font-serif italic">
                安全寄存至各郡县内政商肆，随时可以解调召回！
              </p>
            </div>

            <div className={`p-3 rounded-none border ${seasonThemeBorder} ${seasonCreamBg} flex flex-col justify-between`}>
              <div>
                <div className="text-[10px] uppercase tracking-wide opacity-75 font-mono">常态岁入永久增幅</div>
                <div className="text-xl font-sans font-black text-emerald-800 mt-1">🌾 +{playerStats.autoDevelopmentPassiveIncome || 0} <span className="text-xs font-serif opacity-75">黄金/期</span></div>
              </div>
              <p className="text-[10px] text-stone-550 mt-2 font-serif italic">
                基建投产后，历经时节推移时，永久增税自动落地成长！
              </p>
            </div>

            <div className={`p-3 rounded-none border border-dashed ${seasonThemeBorder} flex flex-col justify-between`}>
              <div className="text-stone-850 text-[10px] font-serif leading-relaxed">
                📢 <span className="font-bold text-artistic-crimson">官营互惠法案</span>：每投 <span className="font-bold">100</span> 两，使累积岁入增加 <span className="font-bold text-emerald-800 font-black">+2</span>，且即时返还 <span className="font-bold text-emerald-800 font-black">+5 现银</span> 商业红利。
              </div>

              {/* Withdraw Button */}
              {(playerStats.autoDevelopmentGold || 0) > 0 && (
                <button
                  onClick={() => {
                    if (onUpdatePlayerStats) {
                      const amount = playerStats.autoDevelopmentGold || 0;
                      onUpdatePlayerStats(prev => ({
                        ...prev,
                        gold: prev.gold + amount,
                        autoDevelopmentGold: 0
                      }));
                      alert(`【基建撤款】主公签发调度玺绶，安全召回派驻各郡县商肆投资基金合计 +${amount} 黄金。`);
                    }
                  }}
                  className="mt-2 text-[10px] text-red-800 underline font-serif font-black text-left hover:text-red-950 cursor-pointer"
                >
                  ↩️ 拔款解调，全额撤回资金
                </button>
              )}
            </div>
          </div>

          <div className="mt-3.5 flex flex-wrap gap-2">
            <button
              onClick={() => {
                const cost = 200;
                if (playerStats.gold < cost) {
                  alert("地方富户告急！起投金数需要 200 黄金。");
                  return;
                }
                if (onUpdatePlayerStats) {
                  onUpdatePlayerStats(prev => ({
                    ...prev,
                    gold: prev.gold - cost,
                    autoDevelopmentGold: (prev.autoDevelopmentGold || 0) + cost
                  }));
                  alert(`【产业投资】主公拨发 200 黄金汇解各郡，张罗购买桑麻种子、引渠灌溉。`);
                }
              }}
              className="px-2.5 py-1.5 bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-100 text-[10px] font-serif font-bold cursor-pointer transition-all"
            >
              🪙 小试牛刀：追加 200 黄金
            </button>

            <button
              onClick={() => {
                const cost = 500;
                if (playerStats.gold < cost) {
                  alert("地方富户告急！需要 500 黄金。");
                  return;
                }
                if (onUpdatePlayerStats) {
                  onUpdatePlayerStats(prev => ({
                    ...prev,
                    gold: prev.gold - cost,
                    autoDevelopmentGold: (prev.autoDevelopmentGold || 0) + cost
                  }));
                  alert(`【产业投资】主公下发 500 黄金设立州级大型桑庄，平籴购粮入廪。`);
                }
              }}
              className="px-2.5 py-1.5 bg-emerald-850/90 hover:bg-emerald-900 text-stone-100 border border-emerald-800 text-[10px] font-serif font-bold cursor-pointer transition-all"
            >
              🪙 支柱基建：追加 500 黄金
            </button>

            <button
              onClick={() => {
                const cost = 1000;
                if (playerStats.gold < cost) {
                  alert("对不起，主公国库空虚，不足 1000 黄金！");
                  return;
                }
                if (onUpdatePlayerStats) {
                  onUpdatePlayerStats(prev => ({
                    ...prev,
                    gold: prev.gold - cost,
                    autoDevelopmentGold: (prev.autoDevelopmentGold || 0) + cost
                  }));
                  alert(`【产业投资】神州巨响！主公签发 1000 黄金特等国债级基建宏图，全线修复运河渡口、设市纳客！`);
                }
              }}
              className="px-2.5 py-1.5 bg-artistic-crimson hover:bg-red-800 text-stone-100 border border-red-900 text-[10px] font-serif font-bold cursor-pointer transition-all"
            >
              🪙 巨擘蓝图：追加 1000 黄金
            </button>
          </div>
        </div>

        {/* West Kingdom & Cross-City Trade Routes Panel */}
        <div id="trade-routes-panel" className={`mt-6 border-t ${seasonThemeBorder} pt-4`}>
          <h4 className={`font-serif font-black text-sm flex gap-1.5 items-center mb-1 ${seasonTitleColor}`}>
            <Coins className="w-4.5 h-4.5 text-amber-700 animate-spin-slow" />
            🐫 西域互市 · 跨城商路契盟 (Cross-City Silk Trade Protocols)
          </h4>
          <p className={`text-[11px] mb-3 font-serif ${seasonTextColor}`}>
            主公开通城与城之间的商道协议，可令辖地互通有无、常态互市产油。<b>开设需求主公政治达到 70 点以上</b>。每日时序轮转，依起止双城「开发度」高低奉纳大笔被动钱粮商税！
          </p>

          {playerStats.politics < 70 ? (
            <div className="bg-red-500/5 border border-red-900/10 p-3 text-red-900 text-xs font-serif leading-relaxed">
              🔒 <b>丝路商纲受阻</b>：主公当前政治修为仅为 <span className="font-sans font-extrabold">{playerStats.politics} / 70</span>。缺少长效经纶政纲，商帮难于险路中确立契券，请先通过<b>【屯田垦荒】</b>等要务修业政治属性！
            </div>
          ) : (
            <div className="space-y-4">
              {/* Construction Form */}
              <div className={`p-3 border ${seasonThemeBorder} ${seasonCreamBg} grid grid-cols-1 md:grid-cols-3 gap-3 items-end`}>
                <div>
                  <label className="text-[10px] font-mono font-bold block mb-1">起运商邑 (Origin)</label>
                  <select
                    value={initialSource}
                    onChange={(e) => setTradeSourceId(e.target.value)}
                    className="w-full bg-white border border-stone-300 text-xs px-2 py-1 text-stone-800 font-serif focus:outline-none"
                  >
                    {playerControlledRegions.map(r => (
                      <option key={r.id} value={r.id}>{r.name} (开发 {r.development}%)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold block mb-1">抵界商邑 (Destination)</label>
                  <select
                    value={initialDest}
                    onChange={(e) => setTradeDestId(e.target.value)}
                    className="w-full bg-white border border-stone-300 text-xs px-2 py-1 text-stone-800 font-serif focus:outline-none"
                  >
                    {playerControlledRegions.map(r => (
                      <option key={r.id} value={r.id}>{r.name} (开发 {r.development}%)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <button
                    onClick={handleCreateTradeRoute}
                    className="w-full py-1.5 bg-amber-705 hover:bg-amber-800 bg-[#7c2d12] hover:bg-[#9a3412] text-[#fcfaf2] font-black text-xs font-serif transition-colors cursor-pointer border border-[#431407] shadow-sm"
                  >
                    🤝 确立商约（耗金 120 两）
                  </button>
                </div>
              </div>

              {/* Existing Routes List */}
              <div className="space-y-2">
                <h5 className="text-[10px] uppercase font-mono font-bold text-stone-500">
                  ⛺ 已开设互市契约路网 (Active Trade Routes)
                </h5>
                {tradeRoutes && tradeRoutes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {tradeRoutes.map(route => {
                      const fromReg = regions.find(r => r.id === route.from);
                      const toReg = regions.find(r => r.id === route.to);
                      if (!fromReg || !toReg) return null;
                      
                      const singleIncome = Math.floor((fromReg.development + toReg.development) * 0.15 + 15);
                      const isBroken = fromReg.faction !== 'PLAYER' || toReg.faction !== 'PLAYER';

                      return (
                        <div key={route.id} className={`p-2.5 border text-xs font-serif flex flex-col justify-between ${
                          isBroken ? 'bg-red-50/70 border-red-200 opacity-60 text-stone-400 line-through' : 'bg-white border-stone-250 hover:shadow-xs'
                        }`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold flex items-center gap-1">
                              🐫 {fromReg.name} ⇆ {toReg.name}
                            </span>
                            <span className={`text-[9px] px-1 py-0.2 rounded-none font-bold ${
                              isBroken ? 'bg-stone-300 text-stone-600' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {isBroken ? '🚨 沦陷废弛' : '🟢 常态行商'}
                            </span>
                          </div>
                          
                          <div className="text-[10px] text-stone-500 flex justify-between items-center mt-1">
                            <span>
                              双城开发: {fromReg.development}% | {toReg.development}%
                            </span>
                            <span className="font-bold text-emerald-700 font-sans">
                              +{singleIncome} 🪙/十日
                            </span>
                          </div>

                          <div className="border-t border-stone-100 mt-2 pt-1.5 text-right">
                            <button
                              onClick={() => {
                                if (onUpdateTradeRoutes) {
                                  onUpdateTradeRoutes(tradeRoutes.filter(r => r.id !== route.id));
                                  alert(`【废弛商路】大营取消了【${fromReg.name} ⇆ ${toReg.name}】的互市契据，各商契护卫宣告复员。`);
                                }
                              }}
                              className="text-[9px] text-red-700 hover:underline cursor-pointer"
                            >
                              ✕ 宣告作废此约
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-4 text-center border-2 border-dashed border-stone-200 text-xs text-stone-400 font-serif italic">
                    暂无活跃商帮。请选择主军所辖城邑行商联接，建立您的互市网络！
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Court Petitions Feature Block */}
        <div id="court-petitions-section" className={`mt-6 border-t ${seasonThemeBorder} pt-4`}>
          <div className="flex justify-between items-center mb-2">
            <h4 className={`font-serif font-black text-sm flex gap-1.5 items-center ${seasonTitleColor}`}>
              <Scale className="w-4.5 h-4.5 text-artistic-crimson animate-pulse" />
              📜 朝廷陈情与民间请愿 (Folk Petitions & Court Pleadings)
            </h4>
            <span className="text-[9px] bg-artistic-crimson text-artistic-bg px-1.5 py-0.5 font-mono rounded-none scale-95 select-none animate-pulse">
              ★ 广纳贤德 ★
            </span>
          </div>
          <p className={`text-[11px] mb-3 font-serif ${seasonTextColor}`}>
            神州动荡，各郡县名宿、寒门儒生与战死士卒遗孤，常有陈情表奏。主公可拨付黄金开仓抚民，极大增加您的 <b>德行 (Virtue)</b> 与 <b>声望 (Prestige)</b>！
          </p>

          {(() => {
            const petition = PETITIONS_POOL[currentPetitionIndex];
            if (!petition) return null;

            return (
              <div className="border border-stone-300 bg-[#ebd9bc]/60 p-4 relative overflow-hidden shadow-xs text-left">
                {/* Decorative parchment background texture */}
                <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#3d3228_1.5px,transparent_1.5px)] [background-size:12px_12px]"></div>

                {petitionOutcome ? (
                  <div className="animate-fade-in text-center py-2">
                    <div className="text-2xl mb-1.5">
                      {petitionOutcome.accepted ? '🟢 广行仁义' : '🔴 婉言回绝'}
                    </div>
                    <p className="text-xs text-stone-800 font-serif leading-relaxed italic border-b border-dashed border-stone-300 pb-3 mb-3.5 px-2">
                      “ {petitionOutcome.log} ”
                    </p>
                    <button
                      onClick={() => {
                        // Roll another petition randomly, different from current
                        let nextIdx = currentPetitionIndex;
                        while (nextIdx === currentPetitionIndex) {
                          nextIdx = Math.floor(Math.random() * PETITIONS_POOL.length);
                        }
                        setCurrentPetitionIndex(nextIdx);
                        setPetitionOutcome(null);
                      }}
                      className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-100 border border-stone-700 text-xs font-serif font-bold cursor-pointer transition-all"
                    >
                      🗣️ 传下一位陈情使者入殿
                    </button>
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <div className="flex justify-between items-center border-b border-stone-300 pb-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl shrink-0 bg-white/50 border border-stone-350 p-1 select-none">
                          {petition.avatar}
                        </span>
                        <div>
                          <div className="text-[10px] text-stone-500 font-mono font-bold leading-none">请愿呈表人: {petition.petitioner}</div>
                          <h5 className="text-xs font-serif font-black text-stone-900 mt-1">{petition.title}</h5>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-red-900 font-serif font-bold bg-red-100 border border-red-200 px-1.5 py-0.5">
                          🌾 需黄金: {petition.cost} 两
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-850 font-serif leading-relaxed italic bg-white/40 p-2.5 border border-dashed border-stone-300/60 mb-3.5">
                      “ {petition.narrative} ”
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        onClick={() => {
                          if (playerStats.gold < petition.cost) {
                            alert("主公库府库粮不足，无法拨付此项救灾黄金！");
                            return;
                          }
                          // Apply effects
                          if (onUpdatePlayerStats) {
                            onUpdatePlayerStats(prev => ({
                              ...prev,
                              gold: prev.gold - petition.cost,
                              virtue: prev.virtue + petition.gainVirtue,
                              prestige: prev.prestige + petition.gainPrestige,
                              troops: petition.gainTroops ? prev.troops + petition.gainTroops : prev.troops
                            }));
                          }
                          setPetitionOutcome({ accepted: true, log: petition.acceptedLog });
                        }}
                        className="py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white border border-emerald-900 text-xs font-serif font-bold transition-all cursor-pointer flex flex-col items-center justify-center shadow-xs"
                      >
                        <span className="font-extrabold text-xs">🟢 应允呈表，广施仁德</span>
                        <span className="text-[9px] opacity-90 font-mono mt-0.5">
                          (扣黄金 {petition.cost} | 德行 +{petition.gainVirtue} | 威望 +{petition.gainPrestige}
                          {petition.gainTroops ? ` | 卒 +${petition.gainTroops}` : ''})
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setPetitionOutcome({ accepted: false, log: petition.declinedLog });
                        }}
                        className="py-2 px-3 bg-stone-150 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-serif font-bold transition-all cursor-pointer flex flex-col items-center justify-center"
                      >
                        <span className="font-extrabold text-xs">🔴 婉言回退，财赋维艰</span>
                        <span className="text-[9px] text-stone-500 font-mono mt-0.5">(库银宝贵，暂不予解囊)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Taxation ledger panel */}
      <div id="gov-ledger-panel" className="flex flex-col gap-4">
        <div className={`rounded-none p-5 shadow-md flex-1 flex flex-col justify-between transition-all duration-500 ${seasonBg} ${seasonBorderClass}`}>
          <div>
            <div className={`border-b ${seasonThemeBorder} pb-3 mb-4`}>
              <h3 className={`font-serif font-black text-lg ${seasonTitleColor}`}>地方仓廪税册</h3>
              <p className={`text-[10.5px] font-serif ${seasonTextColor}`}>大汉神州土地，尽按季度纳款</p>
            </div>

            {/* Seasonal Harvest Event Information card */}
            <div className={`border-2 p-3 rounded-none mb-3.5 text-left font-serif transition-all ${weatherBg}`}>
              <div className="flex items-center gap-3">
                {/* Weather icon effect frame */}
                <div className="p-2 border border-artistic-charcoal/30 bg-white/70 flex items-center justify-center shadow-xs select-none">
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
                    <span className={`text-[11.5px] font-black ${harvestMultiplier >= 1.0 ? 'text-emerald-700' : 'text-red-700'}`}>
                      x{harvestMultiplier.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* List of player controlled cities with localized tax details */}
            <div className="space-y-2 max-h-[200px] overflow-y-auto mb-4 pr-1 scrollbar-ink">
              <div className={`flex justify-between text-[11px] font-bold border-b pb-1 font-serif ${seasonTitleColor} ${seasonThemeBorder}`}>
                <span>控制据点</span>
                <span>税入</span>
              </div>
              <div className={`flex justify-between text-xs font-serif p-1.5 ${seasonCreamBg} border ${seasonThemeBorder} rounded-none`}>
                <span>皇汉奉薪 / 朝廷俸禄</span>
                <span className="font-sans font-black text-emerald-800 font-extrabold">+100 🌾</span>
              </div>
              {passiveInc > 0 && (
                <div className={`flex justify-between text-xs font-serif p-1.5 ${seasonCreamBg} border border-dashed border-emerald-500 rounded-none`}>
                  <span>🌾 自动屯垦基建收益</span>
                  <span className="font-sans font-black text-emerald-800 font-extrabold">+{passiveInc} 🌾</span>
                </div>
              )}
              {playerControlledRegions.length > 0 ? (
                playerControlledRegions.map((r) => (
                  <div key={r.id} className={`flex justify-between text-xs font-serif p-1.5 border-b ${seasonThemeBorder} ${seasonTextColor}`}>
                    <span>{r.name}（开发: {r.development}%）</span>
                    <span className="font-sans font-black text-emerald-800 font-extrabold">+{r.revenue} 🌾</span>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-artistic-charcoal/50 font-serif italic">
                  去占领北海、幽州诸重地，扩延季度产粮！
                </div>
              )}
            </div>

            {/* Sum taxation stats */}
            <div className={`p-3 rounded-none border ${seasonThemeBorder} mb-4 flex justify-between items-center text-xs ${seasonCreamBg}`}>
              <span className={`font-serif font-black ${seasonTitleColor}`}>本季总赋税粮款：</span>
              <span className="font-sans font-black text-emerald-800 text-sm">
                +{scaleTaxRevenue} 黄金 
                {activeStance === 'DEFENSIVE' && <span className="text-[10px] text-red-700 font-bold ml-1">(守势折扣-25%)</span>}
              </span>
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
                  : `${seasonButtonClass} border-2 border-stone-800/10`
              }`}
            >
              <Coins className="w-5 h-5 animate-bounce" />
              开天下库征缴本季粮款 ({taxCooldown ? "本季解税已储积" : "解送金粮大纳款"})
            </button>
            <p className={`text-[10px] text-center mt-2.5 font-serif italic ${seasonTextColor}`}>
              * 征税每季度将在选项决策、主奇演义后自动恢纳为可取敛状态。
            </p>
          </div>
        </div>

        {/* Geopolitical Situation Pie Chart */}
        <div id="geopolitical-dist-card" className={`rounded-none p-5 shadow-md flex flex-col justify-between transition-all duration-500 ${seasonBg} ${seasonBorderClass}`}>
          <div>
            <div className={`border-b ${seasonThemeBorder} pb-3 mb-3`}>
              <h3 className={`font-serif font-black text-sm ${seasonTitleColor}`}>神州大势：各方势力割据占比</h3>
              <p className={`text-[10px] font-serif ${seasonTextColor}`}>大汉十三州地缘控制比率</p>
            </div>
            
            <div className="h-[140px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={46}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const percentage = ((data.value / regions.length) * 100).toFixed(1);
                        return (
                          <div className="bg-[#ede0c5] border-2 border-artistic-charcoal p-2 text-[10px] font-serif shadow-md select-none">
                            <p className="font-bold text-[#5c0f11]">{data.name}</p>
                            <p className="text-stone-800">占领据点: {data.value} 个 ({percentage}%)</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center select-none pointer-events-none text-center">
                <span className="text-[9px] font-serif font-bold text-stone-500 leading-none">据点数</span>
                <span className="text-xs font-sans font-black text-stone-900 leading-none mt-1">{regions.length}</span>
              </div>
            </div>

            {/* Faction Legends list */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] font-serif font-bold border-t border-stone-250 pt-2.5">
              {pieData.slice(0, 6).map((d, i) => (
                <div key={i} className="flex items-center gap-1.5 truncate">
                  <div className="w-2.5 h-2.5 shrink-0 border border-stone-800/10" style={{ backgroundColor: d.color }} />
                  <span className={`${seasonTextColor} truncate`}>{d.name}: {d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
