/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PlayerStats } from '../types';
import { BookOpen, Swords, Sparkles, Trophy, Calendar, Award, BedDouble } from 'lucide-react';
import { motion } from 'motion/react';

interface TrainingTabProps {
  playerStats: PlayerStats;
  setPlayerStats: React.Dispatch<React.SetStateAction<PlayerStats>>;
  activeStance: 'BALANCED' | 'OFFENSIVE' | 'DEFENSIVE';
  setActiveStance: React.Dispatch<React.SetStateAction<'BALANCED' | 'OFFENSIVE' | 'DEFENSIVE'>>;
  onAddBattleLog: (msg: string, type: 'action' | 'casualty' | 'gain' | 'random_event') => void;
  showToast: (msg: string) => void;
  playDrum: () => void;
  playClick: () => void;
}

export default function TrainingTab({
  playerStats,
  setPlayerStats,
  activeStance,
  setActiveStance,
  onAddBattleLog,
  showToast,
  playDrum,
  playClick
}: TrainingTabProps) {
  const [drillLog, setDrillLog] = useState<string[]>([]);
  const [trainingStreak, setTrainingStreak] = useState<number>(0);
  const [focusGoal, setFocusGoal] = useState<'force' | 'intelligence' | 'leadership'>('force');

  // Sandtable Battle Tactical Simulation Interactive States
  const [simState, setSimState] = useState<'IDLE' | 'SIMULATING' | 'FINISHED'>('IDLE');
  const [simProgress, setSimProgress] = useState<number>(0);
  const [playerForceHp, setPlayerForceHp] = useState<number>(1000);
  const [enemyForceHp, setEnemyForceHp] = useState<number>(1000);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [hitTarget, setHitTarget] = useState<'player' | 'enemy' | null>(null);
  const [floatingText, setFloatingText] = useState<{ text: string; isPlayer: boolean } | null>(null);

  const runTacticalSimulation = () => {
    if (simState === 'SIMULATING') return;
    playDrum();
    setSimState('SIMULATING');
    setSimProgress(0);
    setPlayerForceHp(1000);
    setEnemyForceHp(1000);
    setSimLogs([`🚩 推演启程：天下局势在野。当前阵营大印：【${activeStance === 'OFFENSIVE' ? '锋矢阵·攻势' : activeStance === 'DEFENSIVE' ? '鹤翼阵·守势' : '方圆阵·均衡' }】。两校勇士即刻亮剑接敌！`]);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      const progressValue = step * 20; // 5 steps total
      setSimProgress(progressValue);

      if (step === 1) {
        if (activeStance === 'OFFENSIVE') {
          setSimLogs(prev => [...prev, "⚔️ 【战役拉开】锋矢强攻！我军突骑长枪贯透敌先锋防区 (-180 敌卒)！"]);
          setEnemyForceHp(prev => Math.max(0, prev - 180));
          setHitTarget('enemy');
          setFloatingText({ text: "💥 -180 敌兵", isPlayer: false });
        } else if (activeStance === 'DEFENSIVE') {
          setSimLogs(prev => [...prev, "🛡️ 【战役拉开】鹤翼两门齐张！我军巨盾严阵固防，敌矢打击尽数化于盾墙。我属零伤亡！"]);
          setHitTarget(null);
          setFloatingText(null);
        } else {
          setSimLogs(prev => [...prev, "⚖️ 【战役拉开】方圆之阵稳当。主力部属缓缓向前，平推攻心，中正接招。"]);
          setEnemyForceHp(prev => Math.max(0, prev - 80));
          setPlayerForceHp(prev => Math.max(0, prev - 40));
          setHitTarget('enemy');
          setFloatingText({ text: "⚔️ -80 敌卒 / -40 本兵", isPlayer: false });
        }
      } else if (step === 2) {
        if (activeStance === 'OFFENSIVE') {
          setSimLogs(prev => [...prev, "🏹 【突击代价】敌营万张劲弩乱射！因我军锋失追求突刺，防线拉直暴露，折损 -220 精步兵！"]);
          setPlayerForceHp(prev => Math.max(0, prev - 220));
          setHitTarget('player');
          setFloatingText({ text: "🏹 -220 兵卒", isPlayer: true });
        } else if (activeStance === 'DEFENSIVE') {
          setSimLogs(prev => [...prev, "🛡️ 【固若铠城】敌突袭纵队撞入重铠防线，大盾阻断巨烈冲杀！我军仅受极其细微震伤 (-30 守卒)。"]);
          setPlayerForceHp(prev => Math.max(0, prev - 30));
          setHitTarget('player');
          setFloatingText({ text: "-30 盾化", isPlayer: true });
        } else {
          setSimLogs(prev => [...prev, "⚔️ 【白刃接战】死力撕扯！短刀肉搏撞击，阵前火花漫溢，两翼交刃死战。"]);
          setEnemyForceHp(prev => Math.max(0, prev - 110));
          setPlayerForceHp(prev => Math.max(0, prev - 80));
          setHitTarget('enemy');
          setFloatingText({ text: "-110 敌 / -80 我", isPlayer: false });
        }
      } else if (step === 3) {
        if (activeStance === 'OFFENSIVE') {
          setSimLogs(prev => [...prev, "🔥 【破防刺胆】帅纛砍断！我攻坚尖兵长驱直入敌中军，生擒折杀敌裨将 (-380 敌骁卒)！敌营陷入狂恐。"]);
          setEnemyForceHp(prev => Math.max(0, prev - 380));
          setHitTarget('enemy');
          setFloatingText({ text: "💥💥 -380 敌溃败", isPlayer: false });
        } else if (activeStance === 'DEFENSIVE') {
          setSimLogs(prev => [...prev, "🏹 【两翼夹射】长弓齐拉！鹤翼合拢大剪围猎，两侧射死敌方绕袭轻骑 (-260 敌甲)！"]);
          setEnemyForceHp(prev => Math.max(0, prev - 260));
          setHitTarget('enemy');
          setFloatingText({ text: "🏹 -260 夹死", isPlayer: false });
        } else {
          setSimLogs(prev => [...prev, "⚔️ 【阵法绞杀】攻守相辅。全营紧凑，借高统帅战术，徐徐压制敌游击马队 (-150 敌精)。"]);
          setEnemyForceHp(prev => Math.max(0, prev - 150));
          setPlayerForceHp(prev => Math.max(0, prev - 90));
          setHitTarget('enemy');
          setFloatingText({ text: "-150 敌 / -90我", isPlayer: false });
        }
      } else if (step === 4) {
        if (activeStance === 'OFFENSIVE') {
          setSimLogs(prev => [...prev, "⚔️ 【舍命相搏】敌军在绝境下发动绝命互斩！我前军锋矢彻底碎裂，陷于浴血绝杀 (-160 兵员)。"]);
          setPlayerForceHp(prev => Math.max(0, prev - 160));
          setHitTarget('player');
          setFloatingText({ text: "-160 绝命肉搏", isPlayer: true });
        } else if (activeStance === 'DEFENSIVE') {
          setSimLogs(prev => [...prev, "🛡️ 【滴水不漏】坚收待平。鹤翼缩合为满地刺猬刺林。箭簇打地，固防毫发未伤 (-40 伤亡)。"]);
          setPlayerForceHp(prev => Math.max(0, prev - 40));
          setHitTarget('player');
          setFloatingText({ text: "-40 守卒", isPlayer: true });
        } else {
          setSimLogs(prev => [...prev, "⚖️ 【鸣金徐退】方国圆阵左右有序掩护，两连将士平稳合阵，缓缓退还中军营地。"]);
          setHitTarget(null);
          setFloatingText(null);
        }
      } else if (step === 5) {
        clearInterval(interval);
        setSimState('FINISHED');
        setHitTarget(null);
        setFloatingText(null);

        let evalResult = "";
        if (activeStance === 'OFFENSIVE') {
          evalResult = "🎉 【推演完结】锋矢一往无前：敌营总伤亡爆红达 -670，但我军突锋折损亦较高达 -380。此阵极契合敌弱我强，雷霆歼灭！";
        } else if (activeStance === 'DEFENSIVE') {
          evalResult = "🎉 【推演完结】鹤翼羽遮大安：阻守战成效惊艳，敌死伤 -260，我部盾墙防弹：损折仅 -70！宜用在危局劣势求存保种！";
        } else {
          evalResult = "🎉 【推演完结】方圆攻御和润：中正持久，累计破敌 -340，我部损挫 -210。应变周到，不畏伏兵暗袭。";
        }
        setSimLogs(prev => [...prev, evalResult]);
        showToast("📈 【沙盘中演】校场阵法交锋演练大捷！两军本纪已备案！");
      }
    }, 800);
  };

  // Tracking stats increment animation triggers
  const [prevForce, setPrevForce] = useState<number>(playerStats.force);
  const [prevIntel, setPrevIntel] = useState<number>(playerStats.intelligence);
  const [forceChanged, setForceChanged] = useState<boolean>(false);
  const [intelChanged, setIntelChanged] = useState<boolean>(false);
  const [forceDiff, setForceDiff] = useState<number>(0);
  const [intelDiff, setIntelDiff] = useState<number>(0);

  // Synchronise or trace Force stat changes
  useEffect(() => {
    if (playerStats.force > prevForce) {
      const diff = playerStats.force - prevForce;
      setForceDiff(diff);
      setForceChanged(true);
      const timer = setTimeout(() => setForceChanged(false), 2000);
      setPrevForce(playerStats.force);
      return () => clearTimeout(timer);
    } else {
      setPrevForce(playerStats.force);
    }
  }, [playerStats.force, prevForce]);

  // Synchronise or trace Intelligence stat changes
  useEffect(() => {
    if (playerStats.intelligence > prevIntel) {
      const diff = playerStats.intelligence - prevIntel;
      setIntelDiff(diff);
      setIntelChanged(true);
      const timer = setTimeout(() => setIntelChanged(false), 2000);
      setPrevIntel(playerStats.intelligence);
      return () => clearTimeout(timer);
    } else {
      setPrevIntel(playerStats.intelligence);
    }
  }, [playerStats.intelligence, prevIntel]);

  // Calendar day progression helper matching game-time logic
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

  const handleMilitaryDrill = () => {
    if (trainingStreak >= 3) {
      showToast("⚠️ 【主公体能亏虚】您已经连续演习3次！身形疲惫不堪，请先「宣诏歇息，休养生息」1日再行磨炼。");
      playClick();
      return;
    }

    playDrum();
    
    // Check preset goal triggers
    let pointsGained = 1;
    const isFocusBoost = focusGoal === 'force';
    const boostProb = isFocusBoost ? 0.65 : 0.30;
    if (Math.random() < boostProb) {
      pointsGained = 2;
    }

    // Joint leadership boost chance if focusing on leadership
    let leadershipBonus = 0;
    if (focusGoal === 'leadership' && Math.random() < 0.35) {
      leadershipBonus = 1;
    }
    
    setPlayerStats(prev => {
      const statsWithTime = advanceOneDay(prev);
      return {
        ...statsWithTime,
        force: prev.force + pointsGained,
        leadership: prev.leadership + leadershipBonus
      };
    });

    setTrainingStreak(prev => prev + 1);

    const dateStr = `公元${playerStats.year}年${playerStats.month}月${playerStats.day}日`;
    let message = `⚔️ 【校场习武】主公亲御战马，演习长枪刺击与战阵劈砍。在大校场流汗磨练，武力提升了 +${pointsGained} 点！耗时 1 日。`;
    if (leadershipBonus > 0) {
      message += ` 🌟 连带领悟：由于专注于兵策，您顺势体察军政部署，统帅亦提拔了 +1 点！`;
    }
    if (isFocusBoost && pointsGained === 2) {
      message += ` (🎯 命中专注增益 65% 暴击！)`;
    }
    
    onAddBattleLog(message, 'gain');
    setDrillLog(prev => [message, ...prev]);

    const finalToastText = leadershipBonus > 0 
      ? `🏋️ 演武校临大合！武力 +${pointsGained}，统帅 +1！(连续演训: ${trainingStreak + 1}/3)`
      : `🏋️ 演武大成！武力 +${pointsGained} (连续演训: ${trainingStreak + 1}/3)`;
    showToast(finalToastText);
  };

  const handleLiteratureRead = () => {
    if (trainingStreak >= 3) {
      showToast("⚠️ 【主公神思恍惚】您已连续伏案苦读3次！精神稍有衰竭，请先「宣诏歇息，歇宿休养」1日再行攻书。");
      playClick();
      return;
    }

    playClick();
    
    // Check preset goal triggers
    let pointsGained = 1;
    const isFocusBoost = focusGoal === 'intelligence';
    const boostProb = isFocusBoost ? 0.65 : 0.30;
    if (Math.random() < boostProb) {
      pointsGained = 2;
    }

    let leadershipBonus = 0;
    if (focusGoal === 'leadership' && Math.random() < 0.35) {
      leadershipBonus = 1;
    }
    
    setPlayerStats(prev => {
      const statsWithTime = advanceOneDay(prev);
      return {
        ...statsWithTime,
        intelligence: prev.intelligence + pointsGained,
        leadership: prev.leadership + leadershipBonus
      };
    });

    setTrainingStreak(prev => prev + 1);

    const dateStr = `公元${playerStats.year}年${playerStats.month}月${playerStats.day}日`;
    let message = `📖 【挑灯夜读】主公平旦临案，手捧《孙子兵法》与《五帝德纪》潜心研读。所得清越神思，智力提升了 +${pointsGained} 点！耗时 1 日。`;
    if (leadershipBonus > 0) {
      message += ` 🌟 连带领悟：心解阵图，您领悟到行军包抄纵深之术，统帅亦提升了 +1 点！`;
    }
    if (isFocusBoost && pointsGained === 2) {
      message += ` (🎯 命中专注增益 65% 暴击！)`;
    }
    
    onAddBattleLog(message, 'gain');
    setDrillLog(prev => [message, ...prev]);

    const finalToastText = leadershipBonus > 0 
      ? `📝 读书大成！智力 +${pointsGained}，统帅 +1！(连续演训: ${trainingStreak + 1}/3)`
      : `📝 读书大成！智力 +${pointsGained} (连续演训: ${trainingStreak + 1}/3)`;
    showToast(finalToastText);
  };

  const handleRestAndRecover = () => {
    playClick();
    
    setPlayerStats(prev => {
      return advanceOneDay(prev); // Advances clock 1 day
    });

    setTrainingStreak(0);

    const message = `💤 【鸣金休整】主公深体民瘼与劳损，宣谕校场今日不操、书台不拭。主公鸣呼休眠 1 日，昨日劳骨全然消释，精神焕然抖擞！`;
    onAddBattleLog(message, 'action');
    setDrillLog(prev => [message, ...prev]);
    showToast("💤 宣诏休整成功！主公疲态尽去，已扫空宿怨与连演劳度！");
  };

  return (
    <div id="training-center-frame" className="bg-[#fcfaf2] border-4 border-artistic-charcoal rounded-none p-6 shadow-md flex flex-col gap-6 animate-fade-in relative z-10">
      
      {/* Banner / Header Title */}
      <div className="border-b-2 border-artistic-charcoal pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="font-serif font-black text-2xl text-artistic-charcoal flex items-center gap-2">
            ⚔️ 修学武练营 & 书斋校场
          </h2>
          <p className="text-xs text-stone-600 font-serif mt-1">
            “天行健，君子以自强不息。” 在此消耗日程，亲自磨砺主公文武属性，锤炼天下无双之名。
          </p>
        </div>
        <div className="flex gap-1 bg-[#ede0c5] border border-stone-300 p-1 rounded-none font-mono text-[10.5px]">
          <span className="font-serif text-stone-700">当前岁月: </span>
          <span className="font-black text-[#5c0f11]">{playerStats.year}年{playerStats.month}月{playerStats.day}日</span>
        </div>
      </div>

      {/* Fatigue System Header Indicator */}
      <div className="bg-artistic-cream p-3 border border-artistic-charcoal/40 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2 text-left w-full sm:w-auto">
          <Calendar className="w-5 h-5 text-artistic-crimson shrink-0" />
          <div className="font-serif">
            <h4 className="text-xs font-black text-artistic-charcoal">🏋️ 连续磨炼负荷机制 (Fatigue Gauge)</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-stone-600">连续演训负荷: </span>
              <div className="flex gap-1">
                {[1, 2, 3].map((num) => (
                  <div 
                    key={num} 
                    className={`w-6 h-3.5 border border-artistic-charcoal transition-all ${
                      trainingStreak >= num 
                        ? 'bg-artistic-crimson text-white font-bold font-mono text-[9px] flex items-center justify-center' 
                        : 'bg-stone-200'
                    }`}
                  >
                    {trainingStreak >= num ? '🔥' : ''}
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-black text-stone-700 font-serif">
                ({trainingStreak}/3) {trainingStreak >= 3 ? "⚠️ 已陷入脱力极限！" : "轻度疲劳度"}
              </span>
            </div>
          </div>
        </div>

        {/* Action button for Rest */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95, boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.3)" }}
          onClick={handleRestAndRecover}
          className={`px-4 py-2 cursor-pointer font-serif font-black text-xs border-2 flex items-center gap-1.5 transition-all ${
            trainingStreak >= 3 
              ? 'bg-emerald-700 border-emerald-800 text-stone-50 animate-pulse' 
              : 'bg-stone-100 hover:bg-stone-200 text-[#3d3228] border-artistic-charcoal'
          }`}
        >
          <BedDouble className="w-4 h-4" />
          {trainingStreak >= 3 ? '💤 【宣诏歇息一宵】(解脱过度疲劳)' : '💤 休假放松 (进退时序1日)'}
        </motion.button>
      </div>

      {/* Battle Formation Selector */}
      <div className="bg-[#f2e6d0]/60 border-2 border-artistic-charcoal/80 p-5 rounded-none flex flex-col gap-4 text-left">
        <div className="border-b border-[#3d3228]/25 pb-2">
          <h3 className="font-serif font-black text-sm text-artistic-charcoal flex items-center gap-1.5">
            💂‍♂️ 孙子兵法：行军中军大阵印契 (Active Battle Formation & Troop Stance)
          </h3>
          <p className="text-[11px] text-stone-600 font-serif leading-relaxed mt-1">
            “兵无常势，水无常形。” 在此调配部骑三军大营阵姿。调换印契阵法将直接影响后续<b>剧情大战精骑生还存活率</b>、<b>内政策划岁效赋税征收额</b>、以及<b>奇遇试炼武略判定</b>：
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stance 1: Balanced */}
          <button
            type="button"
            onClick={() => {
              setActiveStance('BALANCED');
              playDrum();
              showToast("⚔️ 阵法已变换为「方圆阵·均衡势」！三军攻防齐备，行军安和。");
            }}
            className={`p-3.5 border-2 flex flex-col justify-between text-left cursor-pointer transition-all ${
              activeStance === 'BALANCED'
                ? 'border-artistic-crimson bg-[#5c0f11]/5 shadow-xs'
                : 'border-artistic-charcoal/30 bg-[#fbf9f4] hover:bg-stone-100'
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-serif font-black text-[12.5px] text-stone-900">🛡️ 方圆阵 (均衡势)</span>
                {activeStance === 'BALANCED' && <span className="text-[9px] bg-artistic-crimson text-white px-1.5 py-0.5 font-bold font-serif animate-pulse">当前大印</span>}
              </div>
              <p className="text-[10px] text-stone-600 font-serif leading-relaxed mb-2">
                行兵持重，两营中立。阴阳互表，攻防平稳。
              </p>
            </div>
            <div className="border-t border-stone-200/50 pt-2 mt-2 text-[9.5px] font-mono font-bold text-stone-500 font-serif">
              🛡️ 三军兵损：恒定 100%<br />
              🌾 税赋解漕：恒定 100%
            </div>
          </button>

          {/* Stance 2: Offensive */}
          <button
            type="button"
            onClick={() => {
              setActiveStance('OFFENSIVE');
              playDrum();
              showToast("🏹 阵法已变换为「锋矢阵·攻势」！刃口尖出，奇遇武功突战威力暴增！");
            }}
            className={`p-3.5 border-2 flex flex-col justify-between text-left cursor-pointer transition-all ${
              activeStance === 'OFFENSIVE'
                ? 'border-amber-700 bg-amber-500/5 shadow-xs'
                : 'border-artistic-charcoal/30 bg-[#fbf9f4] hover:bg-stone-100'
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-serif font-black text-[12.5px] text-stone-900">🏹 锋矢阵 (攻势)</span>
                {activeStance === 'OFFENSIVE' && <span className="text-[9px] bg-amber-700 text-white px-1.5 py-0.5 font-bold font-serif">当前大印</span>}
              </div>
              <p className="text-[10px] text-stone-600 font-serif leading-relaxed mb-2">
                突阵尖刀，三军向前。一鼓作气，刺斩万军。
              </p>
            </div>
            <div className="border-t border-stone-200/50 pt-2 mt-2 text-[9.5px] font-mono font-bold text-amber-800 font-serif">
              💪 边疆奇遇：武艺考核 +15 点 ⚔️<br />
              🔥 剧情兵损：额外增加 +15% 兵损
            </div>
          </button>

          {/* Stance 3: Defensive */}
          <button
            type="button"
            onClick={() => {
              setActiveStance('DEFENSIVE');
              playDrum();
              showToast("🦅 阵法已变换为「鹤翼阵·守势」！重铠壁合，防风稳合，大幅提高守卒在大役中的生存率！");
            }}
            className={`p-3.5 border-2 flex flex-col justify-between text-left cursor-pointer transition-all ${
              activeStance === 'DEFENSIVE'
                ? 'border-emerald-700 bg-emerald-500/5 shadow-xs'
                : 'border-artistic-charcoal/30 bg-[#fbf9f4] hover:bg-stone-100'
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-serif font-black text-[12.5px] text-stone-900">🦅 鹤翼阵 (守势)</span>
                {activeStance === 'DEFENSIVE' && <span className="text-[9px] bg-emerald-700 text-white px-1.5 py-0.5 font-bold font-serif animate-pulse">当前大印</span>}
              </div>
              <p className="text-[10px] text-stone-600 font-serif leading-relaxed mb-2">
                两翼齐护，盾堡如城。安然持守，退保不折兵卒。
              </p>
            </div>
            <div className="border-t border-stone-200/50 pt-2 mt-2 text-[9.5px] font-mono font-bold text-emerald-800 font-serif">
              ❤️ 剧情大役：兵损豁免 -30% 🛡️<br />
              🌾 税赋解钞：各地折损少解 -25%
            </div>
          </button>
        </div>
      </div>

      {/* Dynamic Battle Tactical Sandtable Simulation with Troop Strike Feedback */}
      <div className="border-4 border-artistic-charcoal bg-[#ebd9bc]/40 p-4 rounded-none relative text-left">
        <div className="absolute top-2 right-2 text-stone-400 opacity-20 pointer-events-none text-4xl">
          🎪
        </div>
        
        <div className="border-b border-[#3d3228]/25 pb-2 mb-4 flex justify-between items-center flex-wrap gap-2">
          <div>
            <h3 className="font-serif font-black text-[13.5px] text-[#5c0f11] flex items-center gap-1.5">
              🎪 军机阵眼大演习 (沙盘战阵拟合模拟与部位打击反馈)
            </h3>
            <p className="text-[10px] text-stone-600 font-serif leading-relaxed mt-0.5">
              将当前大印阵形 <b>{activeStance === 'OFFENSIVE' ? '【锋矢阵·攻势】' : activeStance === 'DEFENSIVE' ? '【鹤翼阵·守势】' : '【方圆阵·均衡】'}</b> 融入沙盘，与凉州叛胡劲骑推演阵法绞杀，观照受敌打击反馈及生存效能：
            </p>
          </div>
          
          <button
            type="button"
            onClick={runTacticalSimulation}
            disabled={simState === 'SIMULATING'}
            className={`font-serif font-black text-xs py-1.5 px-3.5 rounded-none shadow-sm transition-all cursor-pointer border ${
              simState === 'SIMULATING'
                ? 'bg-stone-300 text-stone-500 border-stone-400 cursor-not-allowed'
                : 'bg-artistic-crimson hover:bg-red-800 text-white border-stone-900'
            }`}
          >
            {simState === 'SIMULATING' ? '⚡ 推算兵旗演击中...' : '⚔️ 启动战前演武推演 (沙盘模拟/打击魂)'}
          </button>
        </div>

        {/* Visual Sandtable Arena */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-[#fcf8f2] border-2 border-artistic-charcoal p-4 rounded-none relative overflow-hidden">
          
          {/* Left Unit: 我军营垒 (Player) */}
          <div className="flex flex-col items-center p-3 border border-stone-250 bg-white relative h-full justify-between">
            <motion.div 
              className="text-center w-full"
              animate={hitTarget === 'player' ? {
                x: [-12, 12, -8, 8, -4, 4, 0],
                rotate: [-2, 2, -1, 1, 0],
                backgroundColor: ["#ffffff", "#fecaca", "#ffffff"]
              } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full border-2 border-blue-800 flex items-center justify-center font-serif text-2xl mx-auto shadow-sm select-none">
                💂‍♂️
              </div>
              <h4 className="font-serif font-black text-xs text-stone-900 mt-2">
                我大营护军营
              </h4>
              <span className="text-[9.5px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-none font-bold border border-blue-200 mt-1 inline-block font-serif">
                【{activeStance === 'OFFENSIVE' ? '锋矢攻' : activeStance === 'DEFENSIVE' ? '鹤翼守' : '方圆御'}】
              </span>
            </motion.div>

            {/* HP Bar */}
            <div className="w-full mt-3">
              <div className="flex justify-between text-[9px] font-mono text-stone-500 mb-0.5">
                <span>推拟存活战力</span>
                <span className="font-bold">{playerForceHp}/1000</span>
              </div>
              <div className="w-full bg-stone-100 h-2 border border-stone-300 relative overflow-hidden rounded-none">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${(playerForceHp / 1000) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Floating Damage Number */}
            {floatingText && floatingText.isPlayer && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.6 }}
                animate={{ opacity: [1, 1, 0], y: -35, scale: [1, 1.4, 1.1] }}
                transition={{ duration: 1.1 }}
                className="absolute font-mono font-black text-red-600 text-xs drop-shadow-[0_2px_4px_rgba(220,38,38,0.25)] pointer-events-none z-15"
                style={{ top: '35%', left: '35%' }}
              >
                {floatingText.text}
              </motion.div>
            )}
          </div>

          {/* Center Column: Combat simulation progress & strike actions */}
          <div className="flex flex-col items-center justify-center py-4 bg-stone-50/75 p-2.5 border-x border-dashed border-stone-300 h-full">
            <span className="text-[10px] text-stone-500 tracking-widest font-mono uppercase bg-stone-200 px-2 py-0.5 font-bold">
              {simState === 'IDLE' ? '参军待命 · 沙盘未启' : simState === 'SIMULATING' ? '⚔️ 乱斗推进中 ⚔️' : '📜 推演功成'}
            </span>
            
            {/* Simulation Progress bar */}
            <div className="w-full max-w-[170px] bg-stone-150 h-3.5 border border-stone-400 rounded-none overflow-hidden relative mt-2.5 flex items-center">
              <div 
                className="h-full bg-amber-600 transition-all duration-300 ease-out"
                style={{ width: `${simProgress}%` }}
              ></div>
              <span className="absolute right-1.5 text-[8px] font-mono font-black text-stone-800">
                {simProgress}%
              </span>
            </div>

            {simState === 'SIMULATING' && (
              <div className="text-[9.5px] font-serif text-amber-900 mt-2 flex items-center gap-1 animate-pulse">
                <span>天将推算段位: 第 {simProgress / 20}/5 战阵合击</span>
              </div>
            )}

            {simState === 'FINISHED' && (
              <button
                type="button"
                onClick={() => {
                  setSimState('IDLE');
                  setSimProgress(0);
                  setPlayerForceHp(1000);
                  setEnemyForceHp(1000);
                  setSimLogs([]);
                }}
                className="mt-3 text-[10px] font-serif font-black underline text-red-800 hover:text-red-700 cursor-pointer"
              >
                🔄 重新拟定大盘 (重算战况)
              </button>
            )}
          </div>

          {/* Right Unit: 敌统万户敌部 (Enemy) */}
          <div className="flex flex-col items-center p-3 border border-stone-250 bg-white relative h-full justify-between">
            <motion.div 
              className="text-center w-full"
              animate={hitTarget === 'enemy' ? {
                x: [-12, 12, -8, 8, -4, 4, 0],
                rotate: [-2, 2, -1, 1, 0],
                backgroundColor: ["#ffffff", "#fecaca", "#ffffff"]
              } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className="w-12 h-12 bg-red-100 rounded-full border-2 border-red-800 flex items-center justify-center font-serif text-2xl mx-auto shadow-sm select-none">
                👹
              </div>
              <h4 className="font-serif font-black text-xs text-stone-900 mt-2">
                凉州叛胡劲敌营
              </h4>
              <span className="text-[9.5px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded-none font-bold border border-red-200 mt-1 inline-block font-serif">
                【长蛇合击蛮势】
              </span>
            </motion.div>

            {/* HP Bar */}
            <div className="w-full mt-3">
              <div className="flex justify-between text-[9px] font-mono text-stone-500 mb-0.5">
                <span>叛贼估算战力</span>
                <span className="font-bold">{enemyForceHp}/1000</span>
              </div>
              <div className="w-full bg-stone-100 h-2 border border-stone-300 relative overflow-hidden rounded-none">
                <div 
                  className="h-full bg-red-600 transition-all duration-300"
                  style={{ width: `${(enemyForceHp / 1000) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Floating Damage Number */}
            {floatingText && !floatingText.isPlayer && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.6 }}
                animate={{ opacity: [1, 1, 0], y: -35, scale: [1, 1.4, 1.1] }}
                transition={{ duration: 1.1 }}
                className="absolute font-mono font-black text-red-600 text-xs drop-shadow-[0_2px_4px_rgba(220,38,38,0.25)] pointer-events-none z-15"
                style={{ top: '35%', left: '35%' }}
              >
                {floatingText.text}
              </motion.div>
            )}
          </div>

        </div>

        {/* Sandtable Process Log lists */}
        {simLogs.length > 0 && (
          <div className="mt-3 bg-[#f6f0e4] border border-stone-300/60 p-2.5 max-h-[140px] overflow-y-auto font-serif text-[10.5px] space-y-1.5 scrollbar-ink">
            {simLogs.map((log, lIdx) => (
              <div 
                key={lIdx} 
                className={`${
                  lIdx === simLogs.length - 1 
                    ? 'font-bold text-[#5c0f11] bg-amber-100/50 p-1.5 border-l-2 border-amber-800' 
                    : 'text-stone-700 border-b border-stone-200/50 pb-1'
                } leading-relaxed`}
              >
                {log}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preset target priorities selector dropdown */}
      <div className="bg-[#ede0c5]/40 border border-artistic-charcoal/30 p-4 flex flex-col md:flex-row gap-4 items-center justify-between rounded-none">
        <div className="text-left">
          <h4 className="text-xs font-serif font-black text-artistic-charcoal flex items-center gap-1">
            🎯 磨炼预设大纲目标 (Training Focus Priority Selector)
          </h4>
          <p className="text-[10.5px] text-stone-600 font-serif leading-relaxed mt-0.5">
            在此选择本月专注的主属性，后续的每次历练都将依据专注享有暴击加成或概率联动副增长。
          </p>
        </div>
        <select
          value={focusGoal}
          onChange={(e) => setFocusGoal(e.target.value as any)}
          className="bg-white border-2 border-artistic-charcoal text-xs px-3 py-1.5 font-serif focus:outline-none focus:border-artistic-crimson"
        >
          <option value="force">⚔️ 习武专注：武力 (Force) — 修行暴击几率 30% ➜ 65%</option>
          <option value="intelligence">📖 读经专注：智力 (Intelligence) — 顿悟暴击几率 30% ➜ 65%</option>
          <option value="leadership">🚩 演阵专注：统帅 (Leadership) — 历练有 35% 几率额外加 1 统帅</option>
        </select>
      </div>

      {/* Two cards split / Selector layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Drill Card (Military) */}
        <div className="bg-white border-2 border-artistic-charcoal p-5 rounded-none flex flex-col justify-between hover:scale-[1.01] transition-transform shadow-[3px_3px_0px_rgba(61,50,40,0.15)] relative">
          <div>
            <div className="flex justify-between items-center border-b border-stone-200 pb-2 mb-3">
              <span className="text-xs font-serif font-bold text-red-800 bg-red-100 px-2 py-0.5 border border-red-200 flex items-center gap-1 animate-pulse">
                <Swords className="w-3.5 h-3.5" /> 校场修文
              </span>
              <span className="text-[10.5px] text-stone-500 font-serif">属性：武力 (Force) - 影响斩敌率</span>
            </div>
            
            <div className="text-center py-6 flex flex-col items-center justify-center">
              <span className="text-4xl filter saturate-75 mb-1 select-none">🏋️</span>
              
              {/* Force Attribute Card WITH Group Interactive Tooltip */}
              <div className="relative group cursor-help px-4 py-1 border border-stone-100 hover:border-amber-500 hover:bg-amber-50/50 transition-all">
                <div className="text-[10px] text-stone-400 font-serif">主公当前武力 (武功资质)</div>
                
                {/* Dynamically Styled Animated Force Values */}
                <div id="force-display-value" className="relative flex justify-center items-center h-9">
                  <motion.span
                    animate={forceChanged ? {
                      scale: [1, 1.45, 1],
                      color: ["#1c1917", "#d97706", "#1c1917"],
                    } : {}}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="text-2xl font-sans font-black text-stone-900"
                  >
                    {playerStats.force}
                  </motion.span>
                  
                  {/* Floating Micro Particle Effects on Boost */}
                  {forceChanged && (
                    <>
                      {/* Floating Text Indicator */}
                      <motion.span
                        initial={{ opacity: 0, y: 15, scale: 0.6 }}
                        animate={{ opacity: [1, 1, 0], y: -40, scale: [1, 1.5, 1.1] }}
                        transition={{ duration: 1.8 }}
                        className="absolute font-sans font-black text-amber-600 text-sm pointer-events-none drop-shadow-[0_2px_4px_rgba(217,119,6,0.3)] z-20"
                        style={{ right: '-35px' }}
                      >
                        🗡️ +{forceDiff}
                      </motion.span>

                      {/* Concentric Golden Ring Expansion */}
                      <motion.div
                        initial={{ scale: 0.2, opacity: 0.9, border: '6px solid rgba(217,119,6,0.8)' }}
                        animate={{ scale: 2.2, opacity: 0, border: '1px solid rgba(217,119,6,0)' }}
                        transition={{ duration: 1.4, ease: 'easeOut' }}
                        className="absolute rounded-full pointer-events-none w-14 h-14"
                      />

                      {/* Golden Sparkles Sparking Radial */}
                      {[...Array(6)].map((_, i) => {
                        const angle = (i * 360) / 6;
                        const rad = (angle * Math.PI) / 180;
                        return (
                          <motion.div
                            key={i}
                            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                            animate={{
                              x: Math.cos(rad) * 45,
                              y: Math.sin(rad) * 45,
                              opacity: 0,
                              scale: 0.3
                            }}
                            transition={{ duration: 1.1, ease: 'easeOut' }}
                            className="absolute w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] pointer-events-none"
                          />
                        );
                      })}
                    </>
                  )}
                </div>

                {/* Hover Tooltip display */}
                <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-60 bg-stone-950 text-stone-100 text-[10.5px] p-3 border-2 border-amber-600 shadow-2xl z-40 font-serif rounded-none leading-relaxed pointer-events-none">
                  <div className="font-bold border-b border-stone-800 text-amber-500 pb-0.5 mb-1 flex justify-between">
                    <span>⚔️ 猛威「武力」天机底案:</span>
                    <span>{playerStats.force} / 100</span>
                  </div>
                  在史记主线及在野奇遇中，高武力极大强化您的**“两门对招”**、**“乱军溃围”**以及突破战局的单骑一击必杀胜率。
                </div>
              </div>

              <p className="text-xs text-stone-500 font-serif mt-4 text-center leading-relaxed">
                挥刀持槊演练，练习开弓射箭或跟军中健佐切磋，能在瞬间磨厉战力，让天下明主在面对名将斩关袭隘时毫无所惧。
              </p>
            </div>
          </div>

          {/* Training Action Button WITH Tooltip and Scale Anim */}
          <div className="border-t border-stone-100 pt-4 mt-2 relative group">
            {/* Hover Tooltip card */}
            <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-64 bg-stone-950 text-amber-50 text-[10px] p-2.5 border border-amber-650/80 shadow-2xl z-30 font-serif rounded-none leading-relaxed pointer-events-none text-left">
              <h5 className="font-bold text-amber-400 border-b border-stone-800 pb-1 mb-1">🏋️ 【演习战骑武防】研磨大要：</h5>
              <p>⏱️ **日程损耗**：1 日历程。</p>
              <p className="mt-1">📈 **底质成长**：**武力 (Force)** +1 或 +2 (专注将使暴击爆率提升至 65%)。</p>
              <p className="mt-1">🔰 **附加磨练**：若专注「统帅」，35% 几率同获 +1 统帅指挥天资。</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97, boxShadow: "inset 2px 2px 5px rgba(0,0,0,0.3)" }}
              onClick={handleMilitaryDrill}
              disabled={trainingStreak >= 3}
              className={`w-full py-2.5 px-3 rounded-none font-serif font-black text-xs tracking-widest uppercase transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2 ${
                trainingStreak >= 3
                  ? 'bg-stone-300 text-stone-500 border border-stone-400 cursor-not-allowed'
                  : 'bg-[#5c0f11] hover:bg-artistic-crimson text-[#fcfaf2] border border-stone-900'
              }`}
            >
              <Award className="w-4 h-4" />
              {trainingStreak >= 3 ? '❌ 主公陷入疲劳 (休整中)' : '亲自操练武艺 (消耗 1日)'}
            </motion.button>
            <p className="text-[9.5px] text-stone-500 font-serif text-center mt-1.5 italic">
              * 国术磨骨修行，每日精进。专注提升将高概率获取双点暴击！
            </p>
          </div>
        </div>

        {/* Right Study Card (Literature) */}
        <div className="bg-white border-2 border-artistic-charcoal p-5 rounded-none flex flex-col justify-between hover:scale-[1.01] transition-transform shadow-[3px_3px_0px_rgba(61,50,40,0.15)] relative">
          <div>
            <div className="flex justify-between items-center border-b border-stone-200 pb-2 mb-3">
              <span className="text-xs font-serif font-bold text-teal-800 bg-teal-50 px-2 py-0.5 border border-teal-100 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-teal-700" /> 挑灯精研
              </span>
              <span className="text-[10.5px] text-stone-500 font-serif">属性：智力 (Intelligence) - 决胜千里</span>
            </div>
            
            <div className="text-center py-6 flex flex-col items-center justify-center">
              <span className="text-4xl filter saturate-75 mb-1 select-none">📚</span>
              
              {/* Intelligence Attribute Card WITH Group Tooltip */}
              <div className="relative group cursor-help px-4 py-1 border border-stone-100 hover:border-teal-500 hover:bg-teal-50/50 transition-all">
                <div className="text-[10px] text-stone-400 font-serif">主公当前智力 (明辩才学)</div>
                
                {/* Dynamically Styled Animated Intel Values */}
                <div id="intel-display-value" className="relative flex justify-center items-center h-9">
                  <motion.span
                    animate={intelChanged ? {
                      scale: [1, 1.45, 1],
                      color: ["#1c1917", "#d97706", "#1c1917"],
                    } : {}}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="text-2xl font-sans font-black text-stone-900"
                  >
                    {playerStats.intelligence}
                  </motion.span>
                  
                  {/* Floating Micro Particle Effects on Boost */}
                  {intelChanged && (
                    <>
                      {/* Floating Text Indicator */}
                      <motion.span
                        initial={{ opacity: 0, y: 15, scale: 0.6 }}
                        animate={{ opacity: [1, 1, 0], y: -40, scale: [1, 1.5, 1.1] }}
                        transition={{ duration: 1.8 }}
                        className="absolute font-sans font-black text-amber-600 text-sm pointer-events-none drop-shadow-[0_2px_4px_rgba(217,119,6,0.3)] z-20"
                        style={{ right: '-35px' }}
                      >
                        📖 +{intelDiff}
                      </motion.span>

                      {/* Concentric Golden Ring Expansion */}
                      <motion.div
                        initial={{ scale: 0.2, opacity: 0.9, border: '6px solid rgba(217,119,6,0.8)' }}
                        animate={{ scale: 2.2, opacity: 0, border: '1px solid rgba(217,119,6,0)' }}
                        transition={{ duration: 1.4, ease: 'easeOut' }}
                        className="absolute rounded-full pointer-events-none w-14 h-14"
                      />

                      {/* Golden Sparkles Sparking Radial */}
                      {[...Array(6)].map((_, i) => {
                        const angle = (i * 360) / 6;
                        const rad = (angle * Math.PI) / 180;
                        return (
                          <motion.div
                            key={i}
                            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                            animate={{
                              x: Math.cos(rad) * 45,
                              y: Math.sin(rad) * 45,
                              opacity: 0,
                              scale: 0.3
                            }}
                            transition={{ duration: 1.1, ease: 'easeOut' }}
                            className="absolute w-2 h-2 rounded-full bg-[#3b82f6] shadow-[0_0_8px_#3b82f6] pointer-events-none"
                          />
                        );
                      })}
                    </>
                  )}
                </div>

                {/* Hover Tooltip display */}
                <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-60 bg-stone-950 text-stone-100 text-[10.5px] p-3 border-2 border-teal-600 shadow-2xl z-40 font-serif rounded-none leading-relaxed pointer-events-none">
                  <div className="font-bold border-b border-stone-800 text-teal-400 pb-0.5 mb-1 flex justify-between">
                    <span>📖 理政「智力」底案深远:</span>
                    <span>{playerStats.intelligence} / 100</span>
                  </div>
                  高智力可洞察在野隐士的高风亮节，识破敌军反间计和夜袭图谋，更在用谋用火火攻等军师策略中立下惊天奇效。
                </div>
              </div>

              <p className="text-xs text-stone-500 font-serif mt-4 text-center leading-relaxed">
                研读诸家经书、研析孙吴兵机，或向宿儒及高贤请益。掌握民政大计风骨，是运筹于帷幄之中、决胜在千里之外的底气。
              </p>
            </div>
          </div>

          {/* Training Action Button WITH Tooltip and Scale Anim */}
          <div className="border-t border-stone-100 pt-4 mt-2 relative group">
            {/* Hover Tooltip card */}
            <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-64 bg-stone-950 text-amber-50 text-[10px] p-2.5 border border-teal-650/80 shadow-2xl z-30 font-serif rounded-none leading-relaxed pointer-events-none text-left">
              <h5 className="font-bold text-teal-400 border-b border-stone-800 pb-1 mb-1">📖 【静思读书攻典】研磨大要：</h5>
              <p>⏱️ **日程损耗**：1 日历程。</p>
              <p className="mt-1">📈 **底质成长**：**智力 (Intelligence)** +1 或 +2 (若专注，顿悟几率提升至 65%)。</p>
              <p className="mt-1">🔰 **额外加成**：若设置在「统帅」专注目标，35% 几率顿悟军纪兵阵 +1 统帅。</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97, boxShadow: "inset 2px 2px 5px rgba(0,0,0,0.3)" }}
              onClick={handleLiteratureRead}
              disabled={trainingStreak >= 3}
              className={`w-full py-2.5 px-3 rounded-none font-serif font-black text-xs tracking-widest uppercase transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2 ${
                trainingStreak >= 3
                  ? 'bg-stone-300 text-stone-500 border border-stone-400 cursor-not-allowed'
                  : 'bg-teal-800 hover:bg-teal-700 text-white border border-stone-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {trainingStreak >= 3 ? '❌ 主公陷入疲劳 (休整中)' : '亲自校场读书 (消耗 1日)'}
            </motion.button>
            <p className="text-[9.5px] text-stone-500 font-serif text-center mt-1.5 italic">
              * 明烛清香伴书，学而不厌。修身立德，天下仁人智士尽归附！
            </p>
          </div>
        </div>

      </div>

      {/* Process list block */}
      <div className="bg-artistic-cream p-4 border-2 border-artistic-charcoal/20">
        <h3 className="text-xs font-serif font-bold text-artistic-charcoal mb-2 flex items-center gap-1.5 pb-1 border-b border-[#3d3228]/10">
          <Trophy className="w-4 h-4 text-[#5c0f11]" /> 修文演武成果记事板 (Log)
        </h3>
        
        {drillLog.length > 0 ? (
          <div className="max-h-[140px] overflow-y-auto space-y-1.5 font-serif text-[11px] pr-2 scrollbar-ink">
            {drillLog.map((logStr, lIdx) => (
              <div key={lIdx} className="bg-white/80 p-2 border border-stone-200/50 leading-relaxed text-[#2a2319] shadow-xs">
                {logStr}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-stone-400 italic font-serif">
            主公今日尚未在此挥汗或诵读。选择以上修文演武之令，即时获得谋智或猛烈体质提升。
          </div>
        )}
      </div>

    </div>
  );
}
