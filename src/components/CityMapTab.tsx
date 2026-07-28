/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PlayerStats } from '../types';
import { 
  Home, 
  Store, 
  Beer, 
  Award, 
  BookOpen, 
  Swords, 
  Sparkles, 
  Coins, 
  Shield, 
  Users, 
  Flame, 
  Coffee,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CityMapTabProps {
  playerStats: PlayerStats;
  setPlayerStats: React.Dispatch<React.SetStateAction<PlayerStats>>;
  onAddBattleLog: (msg: string, type: 'action' | 'casualty' | 'gain' | 'random_event') => void;
  showToast: (msg: string) => void;
  playDrum: () => void;
  playClick: () => void;
}

// 定义商店可购买神兵和道具
interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  effectDesc: string;
  purchased: boolean;
  onBuy: (stats: PlayerStats) => Partial<PlayerStats>;
}

// 传闻池，用于酒肆打听
const TAVERN_RUMORS = [
  "听说关羽关云长曾为了保护乡里杀死了豪强，一向嫉恶如仇，如今在涿郡卖绿豆，真是一条神龙伏在市井啊！",
  "张庄后园有一片极大的桃林，张飞张翼德常在那里宰猪卖肉，为人粗中有细，平生最爱结交豪杰！",
  "汉室宗亲刘备，如今正在当街贩卖草鞋与草席，他双耳垂肩、双手过膝，面露帝王慈和之气，定非凡人。",
  "黄巾军在张角三兄弟的率领下，在各州郡暗中招兵买马，自称『苍天已死，黄天当立』，天下风雨欲来啊！",
  "听说太守府近期正在招募剿匪义勇，邹靖校尉正为主力粮草发愁，主公若是有大量粮饷声望，定能受其重用！",
  "曹操曹孟德如今在洛阳担任典军校尉，手腕极其狠辣，曾设立五色棒惩治不法，洛阳豪强莫敢犯禁！",
  "董仲颖如今在西北边疆统帅西凉铁骑，此人骄横跋扈、豺狼野心，如今天下大乱将至，千万要小心此人！"
];

export default function CityMapTab({
  playerStats,
  setPlayerStats,
  onAddBattleLog,
  showToast,
  playDrum,
  playClick
}: CityMapTabProps) {
  // 核心子视图：'MAP' (平面图) | 'HOME' (自宅) | 'FORGE' (神兵阁/商店) | 'TAVERN' (酒肆) | 'OFFICE' (太守府)
  const [activeArea, setActiveArea] = useState<'MAP' | 'HOME' | 'FORGE' | 'TAVERN' | 'OFFICE'>('MAP');
  
  // 自宅：连续劳作与精力值系统 (疲劳度上限为3)
  const [homeFatigue, setHomeFatigue] = useState<number>(0);
  const [homeLogs, setHomeLogs] = useState<string[]>([]);

  // 传闻与酒肆状态
  const [currentRumor, setCurrentRumor] = useState<string>('');
  const [beerDrinkCount, setBeerDrinkCount] = useState<number>(0);

  // 商店已购买列表 (存储在 local 状态，防止重复购买神兵)
  const [boughtItems, setBoughtItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tk_purchased_shop_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 武器商店列表
  const shopItems: ShopItem[] = [
    {
      id: 'sh_shuanggu',
      name: '双股剑 (雌雄双股剑)',
      description: '汉室正统之重器，剑身双铸。雌雄相配，代表王道仁德与不挠气节。',
      cost: 350,
      effectDesc: '武力 +6，德行 +8，声誉 +15',
      purchased: boughtItems.includes('sh_shuanggu'),
      onBuy: (stats) => ({
        force: stats.force + 6,
        virtue: stats.virtue + 8,
        prestige: stats.prestige + 15
      })
    },
    {
      id: 'sh_qinglong',
      name: '青龙偃月刀',
      description: '重八十二斤，刀头如偃月，神龙吐瑞，青光凛冽。当世最绝之重兵器。',
      cost: 650,
      effectDesc: '武力 +16，声誉 +30',
      purchased: boughtItems.includes('sh_qinglong'),
      onBuy: (stats) => ({
        force: stats.force + 16,
        prestige: stats.prestige + 30
      })
    },
    {
      id: 'sh_shemao',
      name: '丈八蛇矛',
      description: '镔铁点钢所铸，长一丈八寸，刃如游蛇，锋芒毕露，气吞万里。',
      cost: 600,
      effectDesc: '武力 +14，统帅 +4',
      purchased: boughtItems.includes('sh_shemao'),
      onBuy: (stats) => ({
        force: stats.force + 14,
        leadership: stats.leadership + 4
      })
    },
    {
      id: 'sh_sunzibook',
      name: '《孙子兵法》古册',
      description: '兵家之鼻祖，十三篇阵势兵略。深解虚实、军争与奇正之变。',
      cost: 500,
      effectDesc: '智力 +12，统帅 +6',
      purchased: boughtItems.includes('sh_sunzibook'),
      onBuy: (stats) => ({
        intelligence: stats.intelligence + 12,
        leadership: stats.leadership + 6
      })
    },
    {
      id: 'sh_jinjia',
      name: '汉家龙纹锁子甲',
      description: '朝廷禁卫精造，千锤百炼细碎钢环紧密咬合，刀枪难入，统御万军威仪非凡。',
      cost: 450,
      effectDesc: '统帅 +10，政治 +4',
      purchased: boughtItems.includes('sh_jinjia'),
      onBuy: (stats) => ({
        leadership: stats.leadership + 10,
        politics: stats.politics + 4
      })
    },
    {
      id: 'sh_yuxi',
      name: '传国玉玺 (高仿)',
      description: '受命于天，既寿永昌。涿郡巧匠精心仿制的和氏璧雕刻玉玺，极具皇家声望。',
      cost: 800,
      effectDesc: '声誉 +120，德行 +10',
      purchased: boughtItems.includes('sh_yuxi'),
      onBuy: (stats) => ({
        prestige: stats.prestige + 120,
        virtue: stats.virtue + 10
      })
    }
  ];

  // 购买道具
  const buyItem = (item: ShopItem) => {
    if (playerStats.gold < item.cost) {
      showToast("❌ 库中储备的黄金钱粮见底，无法支付如此巨资！");
      return;
    }
    if (boughtItems.includes(item.id)) {
      showToast("⚠️ 您已拥有了这件绝世神兵/奇珍，切勿重复购置！");
      return;
    }
    
    playDrum();
    const updatedStats = item.onBuy(playerStats);
    setPlayerStats(prev => ({
      ...prev,
      ...updatedStats,
      gold: prev.gold - item.cost
    }));

    const newBought = [...boughtItems, item.id];
    setBoughtItems(newBought);
    localStorage.setItem('tk_purchased_shop_items', JSON.stringify(newBought));

    const dateStr = `公元${playerStats.year}年${playerStats.month}月${playerStats.day}日`;
    const message = `🛍️ 【神铁铺市易】主公于涿郡铁匠铺豪掷黄金 -${item.cost}，购得【${item.name}】！属性获得永久加成：${item.effectDesc}！`;
    onAddBattleLog(message, 'gain');

    showToast(`🎉 成功购得：${item.name}！属性获得大幅强化！`);
  };

  // 自自宅锻炼或学习时时间推演1天
  const advanceOneDay = (stats: PlayerStats) => {
    let d = stats.day + 1;
    let m = stats.month;
    let y = stats.year;
    if (d > 30) {
      d = 1;
      m += 1;
      if (m > 12) {
        m = 1;
        y += 1;
      }
    }
    return { ...stats, day: d, month: m, year: y };
  };

  // 自宅：习武 (武力)
  const handleHomeTrain = () => {
    if (homeFatigue >= 3) {
      showToast("⚠️ 【筋骨透支】您过度锤炼已精疲力竭！请点击「宣召休养生息」或「酣然入睡」休整1日。");
      return;
    }
    playDrum();
    const pts = Math.random() < 0.4 ? 2 : 1;
    setPlayerStats(prev => {
      const nextStats = advanceOneDay(prev);
      return {
        ...nextStats,
        force: prev.force + pts
      };
    });
    setHomeFatigue(prev => prev + 1);
    
    const log = `⚔️ 【自宅·庭院习武】主公于自宅庭院中挥舞佩剑、托举石锁。大汗淋漓之后，武力暴涨了 +${pts} 点！(耗时 1 日)`;
    setHomeLogs(prev => [log, ...prev]);
    onAddBattleLog(log, 'gain');
    showToast(`🏋️ 闭门习武成功！武力 +${pts} (今日疲劳度: ${homeFatigue + 1}/3)`);
  };

  // 自宅：攻书 (智力)
  const handleHomeStudy = () => {
    if (homeFatigue >= 3) {
      showToast("⚠️ 【精力透支】您连续苦读，神思早已疲惫！请点击「修养生息」缓和心神。");
      return;
    }
    playClick();
    const pts = Math.random() < 0.4 ? 2 : 1;
    setPlayerStats(prev => {
      const nextStats = advanceOneDay(prev);
      return {
        ...nextStats,
        intelligence: prev.intelligence + pts
      };
    });
    setHomeFatigue(prev => prev + 1);

    const log = `📖 【自宅·书斋夜读】主公于书房燃起红烛，苦读《六韬》与《竹书纪年》。心如止水，智力领悟提升了 +${pts} 点！(耗时 1 日)`;
    setHomeLogs(prev => [log, ...prev]);
    onAddBattleLog(log, 'gain');
    showToast(`📝 攻书明理！智力 +${pts} (今日疲劳度: ${homeFatigue + 1}/3)`);
  };

  // 自宅：歇息
  const handleHomeRest = () => {
    playClick();
    setPlayerStats(prev => advanceOneDay(prev));
    setHomeFatigue(0);

    const log = `💤 【自宅·宣召小憩】主公在卧房松开盔甲，酣然大睡1日。醒来只觉精神焕发，消解了全部疲劳！`;
    setHomeLogs(prev => [log, ...prev]);
    onAddBattleLog(log, 'action');
    showToast(`💤 舒心憩息，主公疲劳尽扫，神清气爽！`);
  };

  // 酒肆：打听传闻 (免费)
  const handleGetRumor = () => {
    playClick();
    const idx = Math.floor(Math.random() * TAVERN_RUMORS.length);
    const rumor = TAVERN_RUMORS[idx];
    setCurrentRumor(rumor);

    // 20% 概率触发江湖奇遇获得碎金
    if (Math.random() < 0.2) {
      setPlayerStats(prev => ({
        ...prev,
        gold: prev.gold + 25
      }));
      showToast("💰 【江湖奇遇】你跟酒客谈笑甚欢，对方看主公器宇轩昂，资助了黄金 +25 两！");
      onAddBattleLog(`🍻 【酒肆奇遇】主公在涿郡酒肆结识市井奇人，得到资助黄金 +25 两。`, 'gain');
    } else {
      showToast("🍻 打听到了一条重要的涿郡江湖传闻！");
    }
  };

  // 酒肆：大宴群豪 (消耗 150 黄金，换取声望和民望)
  const handleHostBanquet = () => {
    if (playerStats.gold < 150) {
      showToast("❌ 囊中羞涩，无法支付宴请群雄的酒水钱粮！");
      return;
    }
    playDrum();
    const prestigeGain = Math.floor(Math.random() * 15) + 20; // 20-34
    const popularityGain = Math.floor(Math.random() * 8) + 10; // 10-17

    setPlayerStats(prev => {
      const nextWithTime = advanceOneDay(prev);
      return {
        ...nextWithTime,
        gold: prev.gold - 150,
        prestige: prev.prestige + prestigeGain,
        popularity: Math.min(100, prev.popularity + popularityGain)
      };
    });

    const log = `🍻 【酒肆百人宴】主公于涿郡酒肆大摆筵席，好酒好肉慷慨犒赏往来黔首游侠。声望爆满提高 +${prestigeGain}，民望提升 +${popularityGain}！`;
    onAddBattleLog(log, 'gain');
    showToast(`🎉 宴请群雄！声望 +${prestigeGain}，民望 +${popularityGain} (消耗150金，历时1日)`);
  };

  // 太守府：捐纳纳粮 (买官职声望)
  const handleDonateOffice = () => {
    if (playerStats.gold < 500) {
      showToast("❌ 太守府从事冷笑：『区区碎银，也敢来太守府求赏？』(需要 500 黄金)");
      return;
    }
    playDrum();
    setPlayerStats(prev => {
      const nextWithTime = advanceOneDay(prev);
      return {
        ...nextWithTime,
        gold: prev.gold - 500,
        prestige: prev.prestige + 100,
        politics: prev.politics + 5,
        title: prev.politics + 5 >= 75 ? '涿县赞军校尉' : prev.title
      };
    });

    const log = `🏛️ 【太守府纳饷】主公向幽州官府捐献军饷五百两。太守刘焉大喜，称赞主公乃国之栋梁，声誉提高 +100，政治智慧大长 +5！`;
    onAddBattleLog(log, 'gain');
    showToast(`🏛️ 买赏成功！声望 +100，政治 +5，太守府官员对你态度大为改观！`);
  };

  // 太守府：请兵讨逆 (募兵 300)
  const handleRecruitTroops = () => {
    if (playerStats.gold < 120) {
      showToast("❌ 募兵钱粮不足！(需要 120 黄金用于安家置装)");
      return;
    }
    playDrum();
    const bonus = playerStats.leadership > 70 ? 350 : 250;
    setPlayerStats(prev => {
      const nextWithTime = advanceOneDay(prev);
      return {
        ...nextWithTime,
        gold: prev.gold - 120,
        troops: prev.troops + bonus,
        prestige: prev.prestige + 10
      };
    });

    const log = `🚩 【太守府募乡勇】主公于幽州府前开榜招贤，树立『讨贼』大纛。召募精壮士卒 +${bonus} 名投奔效命！(消耗黄金 120 两)`;
    onAddBattleLog(log, 'gain');
    showToast(`🚩 招募到 ${bonus} 名讨逆乡勇兵马！(统帅高额外获益)`);
  };

  return (
    <div id="city-layout-frame" className="bg-[#fcfaf2] border-4 border-artistic-charcoal rounded-none p-5 shadow-lg flex flex-col gap-6 animate-fade-in relative z-10 text-[#3d3228]">
      
      {/* 顶部标题栏 */}
      <div className="border-b-2 border-artistic-charcoal pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="font-serif font-black text-2xl text-[#5c0f11] flex items-center gap-2">
            🏙️ 涿郡名城 · 交互平面沙盘
          </h2>
          <p className="text-xs text-stone-600 font-serif mt-1">
            涿县城郭，市井繁华。玩家可点击平面图任意地点，前往<b>主公自宅</b>闭门修文习武，或在<b>神兵铺</b>购置传世兵器、在<b>酒肆</b>款待名主！
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex gap-1.5 bg-[#ede0c5] border border-stone-300 p-1 rounded-none font-mono text-xs font-bold">
            <span className="font-serif text-stone-700">岁次历：</span>
            <span className="text-[#5c0f11]">{playerStats.year}年{playerStats.month}月{playerStats.day}日</span>
          </div>
          <div className="text-[10px] text-stone-500 font-serif font-bold mt-1">
            🪙 府库黄金: <span className="text-amber-800 font-sans font-black">{playerStats.gold}</span> | 🚩 阵中兵卒: <span className="text-emerald-800 font-sans font-black">{playerStats.troops}</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ==================== 视图 1: 城市主平面图 ==================== */}
        {activeArea === 'MAP' && (
          <motion.div
            key="city-map-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex flex-col gap-4"
          >
            {/* 涿郡地图手绘风网格 */}
            <div className="relative w-full aspect-[16/9] md:aspect-[2.2/1] bg-[#e6dfcc] border-4 border-artistic-charcoal rounded-none overflow-hidden shadow-inner flex flex-col justify-between p-4">
              {/* 背景装饰线纹 */}
              <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[radial-gradient(#3d3228_2.5px,transparent_2.5px)] [background-size:24px_24px]"></div>
              
              {/* 四周城墙手绘标识 */}
              <div className="absolute top-0 left-0 right-0 bg-[#4e3c2f] text-[#ebd9bc] text-[9px] py-0.5 text-center font-serif font-black tracking-widest uppercase select-none opacity-50">
                ━ 涿县北城垣防御线 (North Wall) ━
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-[#4e3c2f] text-[#ebd9bc] text-[9px] py-0.5 text-center font-serif font-black tracking-widest uppercase select-none opacity-50">
                ━ 涿县南大门与拒马鹿角 (South Gate) ━
              </div>

              {/* 中轴大道 */}
              <div className="absolute inset-y-0 left-1/2 w-8 md:w-12 bg-[#dfd6be] border-x-2 border-dashed border-stone-400/40 -translate-x-1/2 opacity-70 pointer-events-none"></div>

              {/* 地点按钮阵列 */}
              <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto w-full my-auto z-10">
                
                {/* 1. 主公自宅 */}
                <button
                  onClick={() => { playClick(); setActiveArea('HOME'); }}
                  className="bg-[#f5ebd6] hover:bg-[#ebdcae] border-2 border-artistic-charcoal hover:border-[#5c0f11] p-4 text-left shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer relative"
                >
                  <div className="absolute top-3 right-3 text-stone-400 group-hover:text-[#5c0f11] transition-colors">
                    <Home className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <span className="text-[10px] bg-[#5c0f11] text-white px-2 py-0.5 font-bold font-serif uppercase tracking-widest shadow-xs">
                    主公别院
                  </span>
                  <h3 className="font-serif font-black text-base md:text-lg text-[#3d3228] mt-2 group-hover:text-[#5c0f11] transition-colors">
                    🏠 涿郡自宅
                  </h3>
                  <p className="text-[11px] text-stone-600 font-serif leading-relaxed mt-1">
                    修身齐家。可在此闭门研习《孙子兵法》提升智力，或练武强健体格，休养身心。
                  </p>
                  <div className="border-t border-dashed border-stone-300 pt-1.5 mt-2 text-[10px] text-stone-500 font-bold font-serif">
                    主要增益：⚔️ 武力、🧠 智力、🔋 恢复疲劳值
                  </div>
                </button>

                {/* 2. 神兵阁/铁匠铺 */}
                <button
                  onClick={() => { playClick(); setActiveArea('FORGE'); }}
                  className="bg-[#f5ebd6] hover:bg-[#ebdcae] border-2 border-artistic-charcoal hover:border-[#5c0f11] p-4 text-left shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer relative"
                >
                  <div className="absolute top-3 right-3 text-stone-400 group-hover:text-[#5c0f11] transition-colors">
                    <Store className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <span className="text-[10px] bg-amber-700 text-white px-2 py-0.5 font-bold font-serif uppercase tracking-widest shadow-xs">
                    神铁商贾
                  </span>
                  <h3 className="font-serif font-black text-base md:text-lg text-[#3d3228] mt-2 group-hover:text-[#5c0f11] transition-colors">
                    🛠️ 镔铁神兵铺
                  </h3>
                  <p className="text-[11px] text-stone-600 font-serif leading-relaxed mt-1">
                    千锤百炼。花费黄金购买双股剑、青龙刀、丈八蛇矛及古籍，获得永久逆天属性！
                  </p>
                  <div className="border-t border-dashed border-stone-300 pt-1.5 mt-2 text-[10px] text-stone-500 font-bold font-serif">
                    主要购买：👑 传世神兵、📖 绝世古册、🎖️ 龙鳞重铠
                  </div>
                </button>

                {/* 3. 涿郡酒肆 */}
                <button
                  onClick={() => { playClick(); setActiveArea('TAVERN'); }}
                  className="bg-[#f5ebd6] hover:bg-[#ebdcae] border-2 border-artistic-charcoal hover:border-[#5c0f11] p-4 text-left shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer relative"
                >
                  <div className="absolute top-3 right-3 text-stone-400 group-hover:text-[#5c0f11] transition-colors">
                    <Beer className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <span className="text-[10px] bg-indigo-700 text-white px-2 py-0.5 font-bold font-serif uppercase tracking-widest shadow-xs">
                    群英荟萃
                  </span>
                  <h3 className="font-serif font-black text-base md:text-lg text-[#3d3228] mt-2 group-hover:text-[#5c0f11] transition-colors">
                    🍻 涿郡大酒肆
                  </h3>
                  <p className="text-[11px] text-stone-600 font-serif leading-relaxed mt-1">
                    痛饮探虚。打听幽州风声与武将传闻，或者大摆宴席，广结天下豪杰与乡野名流！
                  </p>
                  <div className="border-t border-dashed border-stone-300 pt-1.5 mt-2 text-[10px] text-stone-500 font-bold font-serif">
                    主要作用：🌠 奇遇碎金、🌟 地方声誉、👪 民望人气
                  </div>
                </button>

                {/* 4. 太守府邸 */}
                <button
                  onClick={() => { playClick(); setActiveArea('OFFICE'); }}
                  className="bg-[#f5ebd6] hover:bg-[#ebdcae] border-2 border-artistic-charcoal hover:border-[#5c0f11] p-4 text-left shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer relative"
                >
                  <div className="absolute top-3 right-3 text-stone-400 group-hover:text-[#5c0f11] transition-colors">
                    <Award className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 font-bold font-serif uppercase tracking-widest shadow-xs">
                    州郡治所
                  </span>
                  <h3 className="font-serif font-black text-base md:text-lg text-[#3d3228] mt-2 group-hover:text-[#5c0f11] transition-colors">
                    🏛️ 太守府衙
                  </h3>
                  <p className="text-[11px] text-stone-600 font-serif leading-relaxed mt-1">
                    请兵捐饷。可以面见刘太守和邹校尉，捐献钱粮充军以买声望、招幕讨寇乡兵。
                  </p>
                  <div className="border-t border-dashed border-stone-300 pt-1.5 mt-2 text-[10px] text-stone-500 font-bold font-serif">
                    主要交互：🏛️ 官职声誉、🚩 募兵出征、👑 政治声望
                  </div>
                </button>

              </div>
            </div>
          </motion.div>
        )}

        {/* ==================== 视图 2: 自宅界面 ==================== */}
        {activeArea === 'HOME' && (
          <motion.div
            key="city-home-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6"
          >
            <div className="bg-[#fcfaf2] border-2 border-artistic-charcoal p-5 relative">
              <div className="absolute top-3 right-4">
                <button 
                  onClick={() => { playClick(); setActiveArea('MAP'); }}
                  className="border-2 border-artistic-charcoal bg-white px-3 py-1 text-xs font-serif font-bold hover:bg-[#5c0f11] hover:text-white transition-all cursor-pointer"
                >
                  返回涿郡地图 ➔
                </button>
              </div>

              <span className="text-xs bg-[#5c0f11] text-white px-2 py-0.5 font-serif font-bold">
                🏡 主公别庄自宅
              </span>
              <h3 className="font-serif font-black text-xl text-[#3d3228] mt-2">
                “修身齐家，闭关磨砺”
              </h3>
              <p className="text-xs text-stone-600 font-serif mt-1">
                此乃主公在涿郡的宅院。内设后院演武场、静心阁书台与歇息厢房。每次锻炼或读书均消耗1日，增加相应文武属性。
              </p>

              {/* 疲劳展示度 */}
              <div className="my-4 bg-artistic-cream p-3 border border-stone-300/60 flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#5c0f11]" />
                  <span className="font-serif text-xs font-bold">主公体能负荷 (Fatigue):</span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((num) => (
                      <div 
                        key={num} 
                        className={`w-5 h-3 border border-stone-600 transition-all ${
                          homeFatigue >= num ? 'bg-red-600' : 'bg-stone-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono font-bold">({homeFatigue}/3) {homeFatigue >= 3 ? "⚠️ 精力竭尽" : "精力充沛"}</span>
                </div>
                {homeFatigue >= 3 && (
                  <div className="text-[10px] bg-red-100 text-red-800 border border-red-300 px-2 py-0.5 font-serif font-bold">
                    主公体格力竭，请宣召「小憩歇息」！
                  </div>
                )}
              </div>

              {/* 动作区 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                
                {/* 1. 庭院习武 */}
                <button
                  onClick={handleHomeTrain}
                  className={`border-2 border-artistic-charcoal p-4 text-left transition-all ${
                    homeFatigue >= 3 
                      ? 'opacity-50 cursor-not-allowed bg-stone-100' 
                      : 'bg-[#f5ebd6] hover:bg-[#ebdcae] cursor-pointer'
                  }`}
                >
                  <Swords className="w-6 h-6 text-[#5c0f11] mb-2" />
                  <h4 className="font-serif font-black text-sm">⚔️ 庭院闭门演武</h4>
                  <p className="text-[11px] text-stone-600 font-serif mt-1 leading-relaxed">
                    苦练剑术及枪术，打磨筋肉。增加主公的<b>武力属性</b>。
                  </p>
                  <div className="mt-3 text-[10px] text-[#5c0f11] font-bold font-serif flex justify-between">
                    <span>⏳ 耗时: 1 日</span>
                    <span>📈 武力: +1 ~ +2 (随机)</span>
                  </div>
                </button>

                {/* 2. 阁中攻书 */}
                <button
                  onClick={handleHomeStudy}
                  className={`border-2 border-artistic-charcoal p-4 text-left transition-all ${
                    homeFatigue >= 3 
                      ? 'opacity-50 cursor-not-allowed bg-stone-100' 
                      : 'bg-[#f5ebd6] hover:bg-[#ebdcae] cursor-pointer'
                  }`}
                >
                  <BookOpen className="w-6 h-6 text-indigo-700 mb-2" />
                  <h4 className="font-serif font-black text-sm">📖 挑灯夜读兵法</h4>
                  <p className="text-[11px] text-stone-600 font-serif mt-1 leading-relaxed">
                    伏案精读古籍阵势，推演因果。增加主公的<b>智力属性</b>。
                  </p>
                  <div className="mt-3 text-[10px] text-indigo-700 font-bold font-serif flex justify-between">
                    <span>⏳ 耗时: 1 日</span>
                    <span>📈 智力: +1 ~ +2 (随机)</span>
                  </div>
                </button>

                {/* 3. 厢房歇息 */}
                <button
                  onClick={handleHomeRest}
                  className="bg-[#f5ebd6] hover:bg-[#ebdcae] border-2 border-artistic-charcoal p-4 text-left transition-all cursor-pointer"
                >
                  <Coffee className="w-6 h-6 text-emerald-700 mb-2" />
                  <h4 className="font-serif font-black text-sm">💤 卧房小憩歇息</h4>
                  <p className="text-[11px] text-stone-600 font-serif mt-1 leading-relaxed">
                    卸下甲胄，酣然入梦，修养血气神思。<b>彻底消除疲劳值</b>。
                  </p>
                  <div className="mt-3 text-[10px] text-emerald-800 font-bold font-serif flex justify-between">
                    <span>⏳ 耗时: 1 日</span>
                    <span>🔋 疲劳值: 清零 (完全恢复)</span>
                  </div>
                </button>

              </div>

              {/* 锻炼纪录 */}
              <div className="mt-4">
                <span className="text-[10px] font-mono font-bold uppercase block text-stone-500 mb-2">
                  🏡 自宅宿修本纪：
                </span>
                <div className="bg-[#fcfaf2] border border-stone-300 p-3 max-h-36 overflow-y-auto font-serif text-xs text-stone-700 space-y-1 text-left">
                  {homeLogs.length === 0 ? (
                    <span className="text-stone-400 italic">暂无自宅闭关修炼记录。主公，莫要荒废了文武大业啊！</span>
                  ) : (
                    homeLogs.map((l, i) => (
                      <div key={i} className="border-b border-stone-200/50 pb-1">
                        {l}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ==================== 视图 3: 神兵阁/商店 ==================== */}
        {activeArea === 'FORGE' && (
          <motion.div
            key="city-forge-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-4"
          >
            <div className="bg-[#fcfaf2] border-2 border-artistic-charcoal p-5 relative text-left">
              <div className="absolute top-3 right-4">
                <button 
                  onClick={() => { playClick(); setActiveArea('MAP'); }}
                  className="border-2 border-artistic-charcoal bg-white px-3 py-1 text-xs font-serif font-bold hover:bg-[#5c0f11] hover:text-white transition-all cursor-pointer"
                >
                  返回涿郡地图 ➔
                </button>
              </div>

              <span className="text-xs bg-amber-700 text-white px-2 py-0.5 font-serif font-bold">
                🛠️ 涿郡镔铁神兵阁 (Item & Armory Shop)
              </span>
              <h3 className="font-serif font-black text-xl text-[#3d3228] mt-2">
                “神铁聚首，良兵择主”
              </h3>
              <p className="text-xs text-stone-600 font-serif mt-1 mb-4">
                涿县首屈一指的神铁阁，汇聚着天下罕有的寒镔铁矿，可为天命之主打造无双神刃及购置护体龙甲、绝代天书。
              </p>

              {/* 货架商品列表 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shopItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={`border-2 p-4 flex flex-col justify-between ${
                      item.purchased 
                        ? 'border-stone-300 bg-stone-100 opacity-75' 
                        : 'border-artistic-charcoal bg-[#fbf9f4] hover:bg-[#ede0c5]/20'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif font-black text-[#5c0f11] text-sm md:text-base">
                          {item.name}
                        </h4>
                        {item.purchased ? (
                          <span className="text-[10px] bg-stone-500 text-white px-2 py-0.5 font-serif font-bold">
                            已购入宿卫
                          </span>
                        ) : (
                          <span className="text-xs text-amber-800 font-sans font-black flex items-center gap-1 bg-[#ede0c5] px-2 py-0.5 border border-stone-300">
                            <Coins className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            {item.cost} 黄金
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-600 font-serif mt-2 italic leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-dashed border-stone-300 flex justify-between items-center">
                      <div className="text-[10.5px] font-mono font-bold text-emerald-800">
                        ⚡ 永久加成：{item.effectDesc}
                      </div>
                      {!item.purchased ? (
                        <button
                          onClick={() => buyItem(item)}
                          className="bg-[#5c0f11] hover:bg-red-800 text-white font-serif font-bold text-xs py-1 px-3 border border-[#5c0f11] hover:border-black shadow-xs transition-all cursor-pointer"
                        >
                          花费金两购入 ➔
                        </button>
                      ) : (
                        <div className="text-[10px] text-stone-500 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-stone-400" />
                          天命神兵大成
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================== 视图 4: 酒肆 ==================== */}
        {activeArea === 'TAVERN' && (
          <motion.div
            key="city-tavern-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-4 text-left"
          >
            <div className="bg-[#fcfaf2] border-2 border-artistic-charcoal p-5 relative">
              <div className="absolute top-3 right-4">
                <button 
                  onClick={() => { playClick(); setActiveArea('MAP'); }}
                  className="border-2 border-artistic-charcoal bg-white px-3 py-1 text-xs font-serif font-bold hover:bg-[#5c0f11] hover:text-white transition-all cursor-pointer"
                >
                  返回涿郡地图 ➔
                </button>
              </div>

              <span className="text-xs bg-indigo-700 text-white px-2 py-0.5 font-serif font-bold">
                🍻 涿郡大酒肆 (The Tavern Sanctuary)
              </span>
              <h3 className="font-serif font-black text-xl text-[#3d3228] mt-2">
                “浊酒一杯歌一遍，英雄相逢一弹指”
              </h3>
              <p className="text-xs text-stone-600 font-serif mt-1 mb-4">
                游侠、散商与黔首在此畅饮谈欢。主公可在此打听最新的江湖情报探查天下局势，或慷慨解囊大摆群宴，广收人望名誉！
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. 探听传闻 */}
                <div className="bg-artistic-cream p-4 border border-stone-300 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-black text-indigo-900 text-sm flex items-center gap-1">
                      🗣️ 寻访探查江湖传闻
                    </h4>
                    <p className="text-[11px] text-stone-600 font-serif mt-1.5 leading-relaxed">
                      与市井酒徒、过往商贾拼桌痛饮。免费探听一条乱世机密或奇人隐事，还有一定几率获得意外的盘缠！
                    </p>

                    {currentRumor && (
                      <div className="mt-3 bg-white p-3 border border-stone-300 font-serif text-xs italic text-stone-800 leading-relaxed relative">
                        <div className="absolute top-1 right-2 text-[8px] text-stone-400 font-bold">涿郡客商传言</div>
                        <p className="indent-4 mt-1">『{currentRumor}』</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleGetRumor}
                    className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-serif font-bold text-xs py-2 mt-4 cursor-pointer"
                  >
                    🍻 拍案听风声 (免费探听)
                  </button>
                </div>

                {/* 2. 大宴豪杰 */}
                <div className="bg-artistic-cream p-4 border border-stone-300 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-black text-amber-900 text-sm flex items-center gap-1">
                      🎉 涿郡酒肆大宴豪杰
                    </h4>
                    <p className="text-[11px] text-stone-600 font-serif mt-1.5 leading-relaxed">
                      大摆宴席，广邀涿郡的豪侠、寒门义勇痛饮。主公的胸襟和慷慨将极大吸引各路奇侠瞩目，声誉民望爆满！
                    </p>

                    <div className="mt-4 border border-dashed border-stone-300 p-2.5 text-[10.5px] text-stone-500 font-serif font-bold leading-relaxed space-y-1">
                      <div>💰 宴请钱粮：<span className="text-red-700">150 黄金</span></div>
                      <div>⏳ 操办消耗：<span className="text-stone-700">1 日</span></div>
                      <div>📈 预期收益：声望 <span className="text-emerald-700 font-sans">+20~35</span>，民望 <span className="text-emerald-700 font-sans">+10~17</span></div>
                    </div>
                  </div>

                  <button
                    onClick={handleHostBanquet}
                    className="w-full bg-amber-800 hover:bg-amber-900 text-white font-serif font-bold text-xs py-2 mt-4 cursor-pointer"
                  >
                    🎉 慷慨备酒席 (大摆群宴)
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================== 视图 5: 太守府 ==================== */}
        {activeArea === 'OFFICE' && (
          <motion.div
            key="city-office-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-4 text-left"
          >
            <div className="bg-[#fcfaf2] border-2 border-artistic-charcoal p-5 relative">
              <div className="absolute top-3 right-4">
                <button 
                  onClick={() => { playClick(); setActiveArea('MAP'); }}
                  className="border-2 border-artistic-charcoal bg-white px-3 py-1 text-xs font-serif font-bold hover:bg-[#5c0f11] hover:text-white transition-all cursor-pointer"
                >
                  返回涿郡地图 ➔
                </button>
              </div>

              <span className="text-xs bg-emerald-700 text-white px-2 py-0.5 font-serif font-bold">
                🏛️ 太守府衙 (Prefecture Office)
              </span>
              <h3 className="font-serif font-black text-xl text-[#3d3228] mt-2">
                “请兵讨寇，捐输效命”
              </h3>
              <p className="text-xs text-stone-600 font-serif mt-1 mb-4">
                幽州太守府。在此，您可以协助邹靖校尉募兵或者捐献粮草给官府，用金银为抗贼大业奠定更深的政治根底。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. 请兵召募 */}
                <div className="bg-artistic-cream p-4 border border-stone-300 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-black text-emerald-950 text-sm">
                      🚩 幽州府前招贤募兵 (Recruit Militia)
                    </h4>
                    <p className="text-[11px] text-stone-600 font-serif mt-1.5 leading-relaxed">
                      花费黄金在府前张榜，树立抗击黄巾的大纛。招募乡壮义勇，统帅加成越高，愿意死随的义兵数量越多！
                    </p>

                    <div className="mt-4 border border-dashed border-stone-300 p-2.5 text-[10.5px] text-stone-500 font-serif font-bold leading-relaxed space-y-1">
                      <div>💰 营装钱粮：<span className="text-red-700">120 黄金</span></div>
                      <div>⏳ 时序推移：<span className="text-stone-700">1 日</span></div>
                      <div>📈 募得兵员：基础 <span className="text-emerald-700 font-sans">+250</span> 兵力 (主公统帅 &gt; 70 时，招募量提至 <span className="text-emerald-700 font-sans">+350</span> 员)</div>
                    </div>
                  </div>

                  <button
                    onClick={handleRecruitTroops}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-serif font-bold text-xs py-2 mt-4 cursor-pointer"
                  >
                    🚩 张挂招贤榜 (募义勇兵)
                  </button>
                </div>

                {/* 2. 捐钱粮官位 */}
                <div className="bg-artistic-cream p-4 border border-stone-300 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-black text-[#5c0f11] text-sm">
                      🏛️ 府库捐饷加赏
                    </h4>
                    <p className="text-[11px] text-stone-600 font-serif mt-1.5 leading-relaxed">
                      向幽州府纳贡黄金，以此帮助校尉邹靖平息各郡暴乱。作为对等奖励，朝廷会极力宣扬主公的忠义英名！
                    </p>

                    <div className="mt-4 border border-dashed border-stone-300 p-2.5 text-[10.5px] text-stone-500 font-serif font-bold leading-relaxed space-y-1">
                      <div>💰 捐纳黄金：<span className="text-red-700">500 黄金</span></div>
                      <div>⏳ 时序推移：<span className="text-stone-700">1 日</span></div>
                      <div>📈 回报神赐：声望 <span className="text-emerald-700 font-sans font-black">+100</span>，政治威仪 <span className="text-emerald-700 font-sans font-black">+5</span>！</div>
                    </div>
                  </div>

                  <button
                    onClick={handleDonateOffice}
                    className="w-full bg-[#5c0f11] hover:bg-red-800 text-white font-serif font-bold text-xs py-2 mt-4 cursor-pointer"
                  >
                    🏛️ 敬奉钱粮军饷 (捐饷买官)
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
