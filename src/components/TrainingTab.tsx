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
  onAddBattleLog: (msg: string, type: 'action' | 'casualty' | 'gain' | 'random_event') => void;
  showToast: (msg: string) => void;
  playDrum: () => void;
  playClick: () => void;
}

export default function TrainingTab({
  playerStats,
  setPlayerStats,
  onAddBattleLog,
  showToast,
  playDrum,
  playClick
}: TrainingTabProps) {
  const [drillLog, setDrillLog] = useState<string[]>([]);
  const [trainingStreak, setTrainingStreak] = useState<number>(0);
  const [focusGoal, setFocusGoal] = useState<'force' | 'intelligence' | 'leadership'>('force');

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
