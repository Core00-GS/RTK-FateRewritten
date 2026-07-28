/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlayerStats } from '../types';
import { Sparkles, Dices, Award, Eye, Heart, Skull, Calendar } from 'lucide-react';

interface RandomEvent {
  id: string;
  title: string;
  description: string;
  options: Array<{
    text: string;
    action: (current: PlayerStats) => {
      updatedStats: PlayerStats;
      logMessage: string;
    };
  }>;
}

interface RandomEventsTabProps {
  playerStats: PlayerStats;
  setPlayerStats: React.Dispatch<React.SetStateAction<PlayerStats>>;
  showToast: (msg: string) => void;
  onAddBattleLog: (msg: string, type: 'action' | 'casualty' | 'gain' | 'random_event') => void;
}

export default function RandomEventsTab({
  playerStats,
  setPlayerStats,
  showToast,
  onAddBattleLog
}: RandomEventsTabProps) {
  const [activeEvent, setActiveEvent] = useState<RandomEvent | null>(null);
  const [resolvedMessage, setResolvedMessage] = useState<string | null>(null);
  const [solvedLogs, setSolvedLogs] = useState<Array<{ id: string; timestamp: string; title: string; result: string }>>([]);

  // Localized list of wonderful, highly detailed historical/mythical random events
  const eventPool: RandomEvent[] = [
    {
      id: 'bandit_raid',
      title: '⚠️ 盗民啸聚：黄巾流匪围攻粮秣',
      description: '大军扎营休整之夜，忽有小股散兵流匪纠合当地土匪，乘夜突击粮秣辎重，马厩附近火光冲天！',
      options: [
        {
          text: '【亲自披挂】引麾下宿卫武力迎战（考验：武力门槛 60）',
          action: (current: PlayerStats) => {
            if (current.force >= 60) {
              const updated = {
                ...current,
                troops: Math.min(50000, current.troops + 150),
                prestige: current.prestige + 10,
                popularity: current.popularity + 5
              };
              return {
                updatedStats: updated,
                logMessage: `⚔️ 【奇遇-盗民啸聚】主公亲自弯弓上马，阵斩流寇首领！流匪溃散。俘获其余党新卒 +150 骑，声望 +10，民声 +5。`
              };
            } else {
              const updated = {
                ...current,
                troops: Math.max(100, current.troops - 200),
                prestige: Math.max(0, current.prestige - 10)
              };
              return {
                updatedStats: updated,
                logMessage: `💀 【奇遇-盗民啸聚】主公武艺疏于磨炼，猝不及防下被流箭擦伤中军，三军失措，军旅折损 -200 骑，名声大跌 -10。`
              };
            }
          }
        },
        {
          text: '【弃辎而退】整军结阵，舍去部分柴木粮秣避战',
          action: (current: PlayerStats) => {
            const updated = {
              ...current,
              gold: Math.max(0, current.gold - 80),
              popularity: Math.max(0, current.popularity - 10)
            };
            return {
              updatedStats: updated,
              logMessage: `📦 【奇遇-盗民啸聚】主公选择稳妥结阵。悍匪乘机掠夺营外草秣，损失 -80 黄金。畏战避走，地方民声叹然 -10。`
            };
          }
        }
      ]
    },
    {
      id: 'merchant_meet',
      title: '🌾 塞外胡商：辽东奇贾求售骏马',
      description: '一名自称大宛名门之后的胡商引健骡十余匹求见，号称尽是西域汗血良驹，渴望换取太守路条并赞助大业。',
      options: [
        {
          text: '【重金购马】花费 120 黄金特购良驹（考验：黄金储备 120）',
          action: (current: PlayerStats) => {
            if (current.gold < 120) {
              return {
                updatedStats: current,
                logMessage: `⚠️ 【奇遇-塞外胡商】主公府库羞涩，无力购入。胡商长叹扼腕，拱手辞行。`
              };
            }
            const updated = {
              ...current,
              gold: current.gold - 120,
              troops: Math.min(50000, current.troops + 300),
              leadership: current.leadership + 2
            };
            return {
              updatedStats: updated,
              logMessage: `🐎 【奇遇-塞外胡商】主公豪掷 120 黄金。大宛骏马强健兵士，骑步军力提振 +300 骑，统帅大长 +2！`
            };
          }
        },
        {
          text: '【本分推却】两袖清风，婉言推避',
          action: (current: PlayerStats) => {
            const updated = {
              ...current,
              virtue: Math.min(100, current.virtue + 5)
            };
            return {
              updatedStats: updated,
              logMessage: `🍃 【奇遇-塞外胡商】主公一身清廉，两袖春风，婉言推却。行商叹服，德行属性 +5。`
            };
          }
        }
      ]
    },
    {
      id: 'poor_famine',
      title: '🍚 荒草赤地：流民乞食府衙',
      description: '北方关内连月大雪旱涝，数十户衣衫褴褛流民扶老抱幼，跪于营外凄风中哀哀啼哭讨粥活命。',
      options: [
        {
          text: '【慷慨放粮】调拨 100 黄金开库熬粥救助灾民',
          action: (current: PlayerStats) => {
            if (current.gold < 100) {
              const updated = {
                ...current,
                virtue: current.virtue + 3
              };
              return {
                updatedStats: updated,
                logMessage: `🍚 【奇遇-赈灾放粥】玩家库银见底，无金煮粥。灾民感佩太守大仁，无怨离去，德行值 +3。`
              };
            }
            const updated = {
              ...current,
              gold: current.gold - 100,
              virtue: Math.min(100, current.virtue + 15),
              prestige: current.prestige + 25,
              popularity: current.popularity + 30
            };
            return {
              updatedStats: updated,
              logMessage: `🍚 【奇遇-赈灾放粥】调出粮金 100 放米施麦。万民欢欣歌呼声动原野！德行 +15，声望+25，地方民心暴涨 +30！`
            };
          }
        },
        {
          text: '【严守重防】坚守寨门，不泄府库',
          action: (current: PlayerStats) => {
            const updated = {
              ...current,
              prestige: Math.max(0, current.prestige - 20),
              popularity: Math.max(0, current.popularity - 15)
            };
            return {
              updatedStats: updated,
              logMessage: `🔒 【奇遇-赈灾放粥】守将冷漠驱逐。流民泣别，主公仁德在民间遭受诽议，名声 -20，民心（民声）-15。`
            };
          }
        }
      ]
    },
    {
      id: 'old_scholar',
      title: '☯️ 茅庐仙长：古松树下遇名道',
      description: '太守春日微服出巡，偶见一古松底下，有一须发皆白、仙风道骨的闲道端坐弈棋，招手唤你同答纵横论：',
      options: [
        {
          text: '【纵横对辩】博古论今抗手对辩（考验：智力门槛 65）',
          action: (current: PlayerStats) => {
            if (current.intelligence >= 65) {
              const updated = {
                ...current,
                intelligence: current.intelligence + 2,
                politics: current.politics + 2
              };
              return {
                updatedStats: updated,
                logMessage: `✨ 【奇遇-茅庐仙长】主公神情自若，与仙道纵论尧舜乾坤，说罢仙道抚掌大笑化鹤而去！智力属性 +2，政治 +2。`
              };
            } else {
              const updated = {
                ...current,
                prestige: Math.max(0, current.prestige - 10)
              };
              return {
                updatedStats: updated,
                logMessage: `💨 【奇遇-茅庐仙长】主公言语支吾，难应其锋。仙人叹摇，拂袖飘去。玩家名望跌失 -10。`
              };
            }
          }
        },
        {
          text: '【谦退作礼】长揖请教，诚领其诲',
          action: (current: PlayerStats) => {
            const updated = {
              ...current,
              virtue: Math.min(100, current.virtue + 6)
            };
            return {
              updatedStats: updated,
              logMessage: `⭐ 【奇遇-茅庐仙长】主公虚怀若谷，诚意领诲。仙尊深以为重，点拨兵法，主公德行 +6。`
            };
          }
        }
      ]
    },
    {
      id: 'beauty_guan_yinping',
      title: '🌸 关氏娇女：校场巾帼英姿',
      description: '关羽之女关银屏手执三十余斤的重铁大刀在校场练习刀法，呼呼生风，汗珠打湿了额前的碎发。主公远远观瞧，她见你来，娇喝一声向你讨教：',
      options: [
        {
          text: '【切磋武艺】展现勇冠万夫的真武力（考验：武力门槛 75）',
          action: (current: PlayerStats) => {
            if (current.force >= 75) {
              const updated = {
                ...current,
                troops: Math.min(50000, current.troops + 200),
                force: current.force + 3
              };
              return {
                updatedStats: updated,
                logMessage: `⚔️ 【红颜-关银屏】主公以霸王卸甲之势格开其沉重大刀，关银屏美目闪动，惊呼叹服！全军振奋，折服关姬，并得其督训新卒 +200，武力 +3。`
              };
            } else {
              const updated = {
                ...current,
                troops: Math.max(100, current.troops - 100),
                prestige: Math.max(0, current.prestige - 10)
              };
              return {
                updatedStats: updated,
                logMessage: `💀 【红颜-关银屏】主公大意之下，被关银屏一招「青龙献爪」震落兵刃，闹得校场将佐大笑，主公脸上无光，损兵 -100，威名 -10。`
              };
            }
          }
        },
        {
          text: '【切磋兵理】教导闺中兵书韬略（考验：智力门槛 70）',
          action: (current: PlayerStats) => {
            if (current.intelligence >= 70) {
              const updated = {
                ...current,
                intelligence: current.intelligence + 4
              };
              return {
                updatedStats: updated,
                logMessage: `✨ 【红颜-关银屏】主公深入浅出剖析《春秋》与「围魏救赵」之计，关银屏恍然大悟，对主公博学极其尊崇，主公智力 +4。`
              };
            } else {
              const updated = {
                ...current,
                virtue: Math.min(100, current.virtue + 5)
              };
              return {
                updatedStats: updated,
                logMessage: `🌸 【红颜-关银屏】主公背诵兵书时略有卡顿，关银屏偷笑。但见主公诚恳，倒也觉得亲近。主公德行 +5。`
              };
            }
          }
        }
      ]
    },
    {
      id: 'beauty_guan_jinfeng',
      title: '🌹 关门虎女：名声震烈请缨',
      description: '关羽长女关金凤（又名关凤）一身金红锁子甲，手按青泥长剑，主动入账请缨，渴望率一旅偏师突击黄巾寇大营。',
      options: [
        {
          text: '【授以牙门将军】拨发 150 精兵壮其军势（需消耗 150 兵力）',
          action: (current: PlayerStats) => {
            if (current.troops < 150) {
              return {
                updatedStats: current,
                logMessage: `⚠️ 【红颜-关金凤】大军当前兵力不足 150 亲兵，关凤不忍抽调伤了主公根本，微带失望辞出。`
              };
            }
            const updated = {
              ...current,
              troops: current.troops - 150,
              prestige: current.prestige + 15,
              popularity: current.popularity + 15
            };
            return {
              updatedStats: updated,
              logMessage: `🌹 【红颜-关金凤】主公当即授以牙门令，拨予 150 精兵。关凤感激万分，立誓为主公分忧，主公威名 +15，地方民心（民声）+15。`
            };
          }
        },
        {
          text: '【亲自辅佐】亲自指点边防守备要务（考验：统帅门槛 72）',
          action: (current: PlayerStats) => {
            if (current.leadership >= 72) {
              const updated = {
                ...current,
                leadership: current.leadership + 3,
                troops: Math.min(50000, current.troops + 120)
              };
              return {
                updatedStats: updated,
                logMessage: `🛡️ 【红颜-关金凤】主公亲自展开行军图，沙盘推演边防，关凤受益匪浅。吸引幽燕义士闻风来投，精卒 +120，主公统帅 +3。`
              };
            } else {
              const updated = {
                ...current,
                gold: Math.max(0, current.gold - 50)
              };
              return {
                updatedStats: updated,
                logMessage: `⚠️ 【红颜-关金凤】主公大意讲解，漏了破绽。好在花费 50 黄金采购精美甲胄安抚其自尊心，金钱 -50。`
              };
            }
          }
        }
      ]
    },
    {
      id: 'beauty_da_qiao',
      title: '🍂 江东二乔：琴瑟和鸣避乱',
      description: '扬州一带烽烟骤起，大乔流落至北方幽州寄寓，其在水榭抚琴，曲调清越哀婉，见主公微服经过，她敛衽为礼，叹息乱世红颜之命。',
      options: [
        {
          text: '【拨发岁赋安置】慷慨赠予 100 黄金并在涿县定居（消耗：100 黄金）',
          action: (current: PlayerStats) => {
            if (current.gold < 100) {
              const updated = {
                ...current,
                intelligence: current.intelligence + 5
              };
              return {
                updatedStats: updated,
                logMessage: `🍂 【红颜-大乔】主公羞涩无金，只得陪坐闲谈，与其分析江南天下大势。谈吐得体，智力 +5。`
              };
            }
            const updated = {
              ...current,
              gold: current.gold - 100,
              virtue: Math.min(100, current.virtue + 18),
              popularity: current.popularity + 20
            };
            return {
              updatedStats: updated,
              logMessage: `🪙 【红颜-大乔】主公大度拨款 100 黄金安置流离红颜。大乔感激大德，大名满于涿郡！德行 +18，地方民声 +20。`
            };
          }
        },
        {
          text: '【吟诗唱和】以古乐府清词唱和琴声（考验：德行门槛 70）',
          action: (current: PlayerStats) => {
            if (current.virtue >= 70) {
              const updated = {
                ...current,
                virtue: Math.min(100, current.virtue + 5),
                prestige: current.prestige + 12
              };
              return {
                updatedStats: updated,
                logMessage: `🎵 【红颜-大乔】主公出口成章，词意高洁，大乔惊叹主公乃儒雅仁君，引为红颜知己，德行 +5，威名 +12。`
              };
            } else {
              const updated = {
                ...current,
                virtue: Math.max(0, current.virtue - 5)
              };
              return {
                updatedStats: updated,
                logMessage: `⚠️ 【红颜-大乔】词藻略显粗鄙生硬，大乔只得尴尬附和，场面有些冷清。德行 -5。`
              };
            }
          }
        }
      ]
    },
    {
      id: 'beauty_xiao_qiao',
      title: '🎐 绝代风华：桃源酒坊弄霓',
      description: '江东小乔性情天真烂漫，喜爱品茶斗酒。她在涿县桃源酒家设下一樽桃花佳酿，扬言涿郡豪杰虽多，若无惊天政治眼光者，不配饮此杯。',
      options: [
        {
          text: '【共饮论政】高瞻远瞩畅谈汉室天下（考验：政治门槛 70）',
          action: (current: PlayerStats) => {
            if (current.politics >= 70) {
              const updated = {
                ...current,
                politics: current.politics + 3,
                gold: current.gold + 150
              };
              return {
                updatedStats: updated,
                logMessage: `🎐 【红颜-小乔】主公痛饮桃花酿，剖析天下群雄割据与废史立牧之得失，小乔钦佩莫名，借用人脉暗中送来辎重支援，政治 +3，库银暴增 +150 黄金！`
              };
            } else {
              const updated = {
                ...current,
                gold: Math.max(0, current.gold - 30)
              };
              return {
                updatedStats: updated,
                logMessage: `🍷 【红颜-小乔】政治论述庸碌无奇，小乔微笑着敬了罚酒。主公大醉，买单耗去 30 黄金。`
              };
            }
          }
        },
        {
          text: '【买单赠宝】豪爽买下名贵佳酿赠予诸将（消耗：60 黄金）',
          action: (current: PlayerStats) => {
            if (current.gold < 60) {
              return {
                updatedStats: current,
                logMessage: `⚠️ 【红颜-小乔】主公摸遍身上，竟不足 60 黄金。小乔掩嘴嬉笑，气氛稍有尴尬。`
              };
            }
            const updated = {
              ...current,
              gold: current.gold - 60,
              prestige: current.prestige + 10
            };
            return {
              updatedStats: updated,
              logMessage: `🪙 【红颜-小乔】主公长笑买单，豪迈将名酝分赐诸将。豪爽重义之名远播，主公声誉 +10。`
            };
          }
        }
      ]
    },
    {
      id: 'beauty_diao_chan',
      title: '🌙 连环绝唱：月下焚香祈天',
      description: '月色如银，风卷桂香。司徒府貂蝉在月下亭中焚香，神情凄婉，默默为天下黎民祈福。她见到主公龙行虎步而来，敛容问道：“天下滔滔，不知主公之志在兴复汉室，还是割据裂土？”',
      options: [
        {
          text: '【弘图汉志】誓除暴乱，中兴大汉（考验：德行门槛 75）',
          action: (current: PlayerStats) => {
            if (current.virtue >= 75) {
              const updated = {
                ...current,
                virtue: Math.min(100, current.virtue + 20),
                prestige: current.prestige + 25
              };
              return {
                updatedStats: updated,
                logMessage: `🌙 【红颜-貂蝉】主公慷慨陈词，眼含悲戚。貂蝉深受感动，拜谢主公乃天下仁德之君！德行大涨 +20，威名大长 +25！`
              };
            } else {
              const updated = {
                ...current,
                popularity: Math.max(0, current.popularity - 15)
              };
              return {
                updatedStats: updated,
                logMessage: `⚠️ 【红颜-貂蝉】德行稍逊，辞不达意。貂蝉微微叹息。民间传闻主公志向浅薄，地方民心（民声）-15。`
              };
            }
          }
        },
        {
          text: '【雄霸天下】逐鹿中原，顺天改命（考验：智力与武力双门槛 70）',
          action: (current: PlayerStats) => {
            if (current.intelligence >= 70 && current.force >= 70) {
              const updated = {
                ...current,
                intelligence: current.intelligence + 4,
                force: current.force + 4,
                troops: Math.min(50000, current.troops + 250)
              };
              return {
                updatedStats: updated,
                logMessage: `⚔️ 【红颜-貂蝉】主公拔剑指天，豪气干云！貂蝉折服于主公的枭雄大略与惊世武艺，暗中号召群侠投奔，智力 +4，武力 +4，新兵精卒入营 +250 骑！`
              };
            } else {
              const updated = {
                ...current,
                gold: Math.max(0, current.gold - 80)
              };
              return {
                updatedStats: updated,
                logMessage: `⚠️ 【红颜-貂蝉】才具不足，谈吐空洞。貂蝉冷淡退下。主公惭愧，打赏门人 80 黄金作为掩饰，消耗黄金 -80。`
              };
            }
          }
        }
      ]
    }
  ];

  // Roll / Hunt an encounter
  const triggerRandomSeek = () => {
    setActiveEvent(null);
    setResolvedMessage(null);

    const cost = 15;
    if (playerStats.gold < cost) {
      showToast("探访机缘各道需打点干粮，缺少 15 黄金！");
      return;
    }

    // Spend 15 gold to seek
    setPlayerStats(prev => ({ ...prev, gold: Math.max(0, prev.gold - cost) }));

    const rIdx = Math.floor(Math.random() * eventPool.length);
    const rolled = eventPool[rIdx];
    setActiveEvent(rolled);
  };

  const handleResolveOption = (opt: typeof eventPool[0]['options'][0]) => {
    if (!activeEvent) return;
    
    const res = opt.action(playerStats);
    setPlayerStats(res.updatedStats);

    // Record list
    const timestampStr = `西元${playerStats.year}年${playerStats.month}月`;
    const record = {
      id: `seek_${Date.now()}`,
      timestamp: timestampStr,
      title: activeEvent.title,
      result: res.logMessage
    };

    setSolvedLogs(prev => [record, ...prev]);
    onAddBattleLog(res.logMessage, 'random_event');
    setResolvedMessage(res.logMessage);
    setActiveEvent(null);
  };

  return (
    <div id="random-encounters-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Action panel */}
      <div className="lg:col-span-2 bg-artistic-bg border-4 border-artistic-charcoal rounded-none p-5 shadow-sm flex flex-col justify-between min-h-[460px]">
        <div>
          <div className="border-b border-artistic-charcoal pb-3 mb-4">
            <h3 className="font-serif font-black text-lg text-artistic-charcoal flex items-center gap-1.5">
              <Dices className="w-5.5 h-5.5 text-artistic-crimson animate-spin" />
              寻访天下奇遇 (🎲 寻机缘)
            </h3>
            <p className="text-[10.5px] text-artistic-charcoal opacity-85 font-serif">
              “天命不定，道阻且长”。主公可微服游历大汉江山胜地，寻访遗贤古道、降服贼寇、兴修福德。
            </p>
          </div>

          {/* Active Event Rendering */}
          {activeEvent ? (
            <div className="bg-artistic-cream border-[3px] double border-artistic-charcoal p-5 rounded-none animate-scale-up text-left">
              <span className="text-[9px] bg-artistic-crimson text-[#f2e6d0] font-sans font-bold px-1.5 py-0.5 uppercase tracking-wider">
                天眷奇缘降临
              </span>
              <h4 className="font-serif font-black text-lg text-artistic-crimson mt-2 mb-2.5">
                {activeEvent.title}
              </h4>
              <p className="font-serif text-stone-800 text-xs md:text-sm leading-relaxed mb-6">
                {activeEvent.description}
              </p>

              <div className="flex flex-col gap-3">
                {activeEvent.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleResolveOption(opt)}
                    className="w-full text-left bg-artistic-bg hover:bg-stone-100 text-stone-900 border border-artistic-charcoal font-serif font-bold text-xs p-3 transition-colors cursor-pointer"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          ) : resolvedMessage ? (
            <div className="bg-emerald-50 border border-emerald-400 p-5 rounded-none text-left">
              <h4 className="font-serif font-black text-emerald-800 text-sm flex gap-1 items-center mb-2">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-bounce" />
                奇遇事毕 · 功德簿
              </h4>
              <p className="font-serif text-emerald-950 text-xs leading-relaxed">
                {resolvedMessage}
              </p>
              <button
                onClick={() => setResolvedMessage(null)}
                className="mt-4 bg-artistic-charcoal hover:bg-artistic-crimson text-[#f2e6d0] font-serif font-bold text-[10px] px-3 py-1.5 rounded-none cursor-pointer"
              >
                收纳简册
              </button>
            </div>
          ) : (
            <div className="text-center py-12 bg-artistic-cream border border-dashed border-artistic-charcoal/30">
              <div className="w-12 h-12 bg-artistic-charcoal/5 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-stone-400" />
              </div>
              <h4 className="font-serif font-black text-stone-800 text-sm">天下气运，莫不由心</h4>
              <p className="font-serif text-[11px] text-stone-500 max-w-sm mx-auto mt-2 leading-relaxed">
                花费 15 黄金可打点随从仆役，行舟仗马出游在诸郡野地之中，随即博得一桩历史异事、盗民或世家求援，增资固本。
              </p>
              <button
                onClick={triggerRandomSeek}
                className="mt-6 bg-artistic-charcoal hover:bg-artistic-crimson text-white font-serif font-black text-xs py-2.5 px-6 rounded-none transition-colors cursor-pointer shadow-[3px_3px_0px_rgba(61,50,40,0.3)]"
              >
                🧳 奉干粮 (15 黄金) · 启程行猎游历
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-artistic-charcoal/20 flex justify-between items-center text-xs text-artistic-charcoal/80 font-serif">
          <div>主公当前拥资：<span className="text-amber-950 font-bold">🌾 {playerStats.gold} 黄金</span></div>
          <div>大幕军校底蕴：<span className="text-artistic-crimson font-bold">🏛️ 德行 {playerStats.virtue} · 🧠 智力 {playerStats.intelligence}</span></div>
        </div>
      </div>

      {/* History log panel */}
      <div className="lg:col-span-1 bg-artistic-bg border-4 border-artistic-charcoal rounded-none p-5 shadow-sm max-h-[460px] flex flex-col justify-between">
        <div>
          <div className="border-b border-artistic-charcoal/30 pb-2 mb-3">
            <h4 className="font-serif font-black text-sm text-artistic-charcoal flex gap-1.5 items-center">
              <Calendar className="w-4 h-4 text-stone-500" />
              行纪奇遇谱
            </h4>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[340px] pr-1 scrollbar-ink">
            {solvedLogs.length > 0 ? (
              solvedLogs.map((log) => (
                <div key={log.id} className="p-2 bg-artistic-cream/70 border border-artistic-charcoal/30 rounded-none text-left">
                  <div className="flex justify-between items-center text-[8.5px] opacity-70 font-mono font-bold mb-1">
                    <span>{log.timestamp}</span>
                    <span>事毕归藏</span>
                  </div>
                  <h5 className="font-serif font-black text-stone-800 text-[10px]">{log.title}</h5>
                  <p className="text-[10px] text-stone-600 font-serif leading-snug mt-1 border-t border-artistic-charcoal/10 pt-1">
                    {log.result}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-xs text-stone-400 font-serif italic">
                尚无近期行游随笔事件。
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
