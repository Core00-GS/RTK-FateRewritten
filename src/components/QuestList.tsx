/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { SideQuest, PlayerStats, Region } from '../types';
import { Swords, Compass, CompassIcon, Dice6, CheckCircle, AlertTriangle, Coins, Users, Award, ShieldClose } from 'lucide-react';

interface QuestListProps {
  quests: SideQuest[];
  playerStats: PlayerStats;
  playerLocation: string;
  regions: Region[];
  onQuestUpdate: (questId: string, status: 'ACTIVE' | 'COMPLETED' | 'FAILED', rewards?: any, lossTroops?: number) => void;
  onSetLocation: (regionId: string) => void;
}

export default function QuestList({
  quests,
  playerStats,
  playerLocation,
  regions,
  onQuestUpdate,
  onSetLocation
}: QuestListProps) {
  const [activeQuest, setActiveQuest] = useState<SideQuest | null>(null);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [rollResult, setRollResult] = useState<{
    rolledValue: number;
    playerBonus: number;
    neededValue: number;
    isSuccess: boolean;
    narration: string;
  } | null>(null);

  const getRegionName = (id: string) => {
    return regions.find((r) => r.id === id)?.name || '未知地域';
  };

  const handleStartQuest = (q: SideQuest) => {
    if (playerLocation !== q.targetRegionId) {
      alert(`行军路漫！你必须要先在“天下大势版图”中策马或调遣游历至 ${getRegionName(q.targetRegionId)}，方可着手平息这桩纷扰奇遇。`);
      return;
    }
    setActiveQuest(q);
    setSelectedChoiceIdx(null);
    setRollResult(null);
  };

  const handleChoiceSelect = (choiceIdx: number) => {
    if (!activeQuest) return;
    const choice = activeQuest.dialogue.choices[choiceIdx];

    // Check optional requirements
    if (choice.checkType === 'gold') {
      const thresholdVal = choice.threshold || 0;
      if (playerStats.gold < thresholdVal) {
        alert("国库现银不够打发这笔开支！");
        return;
      }
    }

    setSelectedChoiceIdx(choiceIdx);
    setRollResult(null);
  };

  const handleRollDice = () => {
    if (!activeQuest || selectedChoiceIdx === null) return;
    const choice = activeQuest.dialogue.choices[selectedChoiceIdx];

    let playerBonus = 0;
    let attributeVal = 50;

    if (choice.checkType === 'force') {
      attributeVal = playerStats.force;
      playerBonus = Math.floor(attributeVal / 3);
    } else if (choice.checkType === 'intelligence') {
      attributeVal = playerStats.intelligence;
      playerBonus = Math.floor(attributeVal / 3);
    }

    // Roll standard D100 (1 to 100)
    const rolledValue = Math.floor(Math.random() * 60) + 41; // 41 - 100
    const neededThreshold = choice.threshold || 65;

    // Successful if rolledValue + playerBonus >= neededThreshold
    let isSuccess = false;
    if (choice.checkType === 'guaranteed' || choice.checkType === 'gold') {
      isSuccess = true;
    } else {
      isSuccess = (rolledValue + playerBonus) >= neededThreshold;
    }

    const narration = isSuccess ? choice.success.narration : choice.failure.narration;
    const lossTroops = isSuccess ? 0 : (choice.failure.lossTroops || 0);

    setRollResult({
      rolledValue,
      playerBonus,
      neededValue: neededThreshold,
      isSuccess,
      narration
    });

    // Fire state update to master App state
    const goldSpent = choice.checkType === 'gold' ? (choice.threshold || 0) : 0;
    const computedReward = { ...activeQuest.reward };
    
    if (isSuccess) {
      // Scale reward based on success multiplier
      if (computedReward.gold) computedReward.gold = Math.floor(computedReward.gold * choice.success.rewardMultiplier);
      if (computedReward.troops) computedReward.troops = Math.floor(computedReward.troops * choice.success.rewardMultiplier);
      if (computedReward.prestige) computedReward.prestige = Math.floor(computedReward.prestige * choice.success.rewardMultiplier);
      if (computedReward.deviance) computedReward.deviance = Math.floor(computedReward.deviance * choice.success.rewardMultiplier);
      if (goldSpent > 0) {
        computedReward.gold = (computedReward.gold || 0) - goldSpent;
      }
    } else {
      // Failure yields nothing, might lose troops or prestige
      computedReward.gold = goldSpent > 0 ? -goldSpent : 0;
      computedReward.troops = 0;
      computedReward.prestige = 0;
      computedReward.deviance = 0;
    }

    onQuestUpdate(
      activeQuest.id,
      isSuccess ? 'COMPLETED' : 'FAILED',
      computedReward,
      lossTroops
    );
  };

  const handleExitQuest = () => {
    setActiveQuest(null);
    setSelectedChoiceIdx(null);
    setRollResult(null);
  };

  return (
    <div id="side-quest-main-container">
      {!activeQuest ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quests.map((q) => {
            const isHere = playerLocation === q.targetRegionId;
            const isCompleted = q.status === 'COMPLETED';
            const isFailed = q.status === 'FAILED';
            const isLocked = q.status === 'LOCKED';

            return (
              <div
                key={q.id}
                className={`bg-artistic-bg border-4 border-artistic-charcoal rounded-none p-5 shadow-md flex flex-col justify-between transition-all relative ${
                  isCompleted ? 'opacity-70 bg-stone-100 !border-stone-400' : ''
                }`}
              >
                {/* Completed Stamp overlay */}
                {isCompleted && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-emerald-800 text-emerald-800 font-serif font-black tracking-widest text-lg uppercase rounded-none px-4 py-1.5 rotate-12 scale-125 select-none pointer-events-none bg-artistic-bg/95 z-10">
                    功勋奏凯
                  </div>
                )}
                {isFailed && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-artistic-crimson text-artistic-crimson font-serif font-black tracking-widest text-lg uppercase rounded-none px-4 py-1.5 rotate-12 scale-125 select-none pointer-events-none bg-artistic-bg/95 z-10">
                    大败痛失
                  </div>
                )}

                <div>
                  {/* Quest Title Header */}
                  <div className="flex justify-between items-start mb-2 border-b border-artistic-charcoal/20 pb-2">
                    <h4 className="font-serif font-black text-artistic-charcoal text-base">{q.title}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-none font-serif font-black border ${
                      isHere 
                        ? 'bg-artistic-crimson/10 text-artistic-crimson border-artistic-crimson' 
                        : 'bg-artistic-cream text-artistic-charcoal/70 border-artistic-charcoal/30'
                    }`}>
                      {getRegionName(q.targetRegionId)}
                    </span>
                  </div>

                  {/* Quest body details */}
                  <p className="text-xs text-[#2a2319] leading-relaxed mb-3 font-serif">
                    {q.description}
                  </p>
                  
                  <div className="bg-artistic-cream p-2 rounded-none text-[10.5px] border border-artistic-charcoal/20 font-serif text-[#2a2319] leading-normal mb-4">
                    <strong>任务奖励：</strong>{q.rewardDesc}
                  </div>
                </div>

                {/* Engagement Control Action Buttons */}
                <div>
                  {isLocked ? (
                    <button
                      disabled
                      className="w-full bg-stone-200 text-stone-500 py-2 rounded-none font-serif font-bold text-xs cursor-not-allowed border-2 border-stone-300"
                    >
                      根据地声威不足，尚未揭榜
                    </button>
                  ) : isCompleted || isFailed ? (
                    <div className="text-center text-[10.5px] text-artistic-charcoal/70 font-serif italic py-1 border-t border-artistic-charcoal/20 pt-2">
                      {isCompleted ? "该演义野事已定，美名播于百姓。" : "你已在此遭遇败战。胜败兵家常事。"}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartQuest(q)}
                      className={`w-full py-2.5 rounded-none font-serif font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer ${
                        isHere
                          ? 'bg-artistic-crimson hover:bg-red-800 text-artistic-bg'
                          : 'bg-artistic-charcoal hover:bg-artistic-crimson text-artistic-bg'
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                      {isHere ? "揭榜接事：开启奇遇" : `前往 ${getRegionName(q.targetRegionId)} 解决`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Dialogue / Challenge Scroll Overlay */
        <div id="quest-active-scroll" className="bg-artistic-bg border-8 border-double border-artistic-charcoal rounded-none p-6 md:p-8 shadow-xl max-w-2xl mx-auto transition-all animate-fade-in relative overflow-hidden">
          <div className="absolute inset-0 opacity-1 pointer-events-none bg-[radial-gradient(#2a2319_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
          
          <div className="border-b-4 border-double border-artistic-charcoal/60 pb-4 mb-5 text-center relative z-10">
            <h3 className="font-serif font-black text-2xl text-artistic-charcoal tracking-wide">
              {activeQuest.title}
            </h3>
            <p className="text-[11px] text-artistic-charcoal opacity-70 font-serif mt-1">
              地点：{getRegionName(activeQuest.targetRegionId)} · 乱世行军演义
            </p>
          </div>

          {/* Narrative step 1: Intro */}
          <div className="bg-artistic-cream border-2 border-artistic-charcoal/30 p-4 rounded-none text-[#2a2319] text-xs md:text-sm leading-relaxed mb-6 font-serif relative z-10">
            <p className="indent-6">{activeQuest.dialogue.intro}</p>
            <p className="indent-6 mt-3 font-black text-artistic-charcoal">{activeQuest.dialogue.challenge}</p>
          </div>

          {/* Dialog options selectors */}
          {rollResult === null ? (
            <div className="space-y-3 relative z-10 mb-6 font-serif">
              {activeQuest.dialogue.choices.map((c, idx) => {
                const isSelected = selectedChoiceIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleChoiceSelect(idx)}
                    className={`w-full p-3 text-left rounded-none text-xs md:text-sm border-2 transition-all block cursor-pointer ${
                      isSelected
                        ? 'bg-[#ffe4e1] border-artistic-crimson'
                        : 'bg-artistic-cream border-artistic-charcoal/40 hover:border-artistic-charcoal'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-serif font-bold text-artistic-charcoal leading-normal flex-1">
                        {idx + 1}. {c.text}
                      </span>
                      <span className="text-[10px] text-artistic-crimson font-serif font-bold shrink-0 ml-2 bg-artistic-bg border border-artistic-charcoal/30 px-1.5 py-0.5">
                        概率: {c.successRate}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : null}

          {/* Dice launch trigger / Result details */}
          <div className="relative z-10 flex flex-col items-center">
            {selectedChoiceIdx !== null && rollResult === null ? (
              <button
                onClick={handleRollDice}
                className="bg-artistic-crimson hover:bg-red-800 text-artistic-bg py-3 px-8 rounded-none font-serif font-black text-sm tracking-widest shadow-md flex items-center gap-2 cursor-pointer animate-pulse"
              >
                <Dice6 className="w-5 h-5 animate-spin" />
                秉天起卦：定夺天数
              </button>
            ) : null}

            {/* If Rolled, show outcome */}
            {rollResult !== null ? (
              <div className="w-full text-center space-y-4">
                {/* Roll metrics banner */}
                <div className="inline-flex items-center gap-3 bg-artistic-cream border border-artistic-charcoal/40 px-5 py-2.5 rounded-none shadow-sm">
                  <Dice6 className="w-6 h-6 text-artistic-crimson animate-bounce" />
                  <div className="text-left font-serif text-artistic-charcoal">
                    <span className="text-xs text-artistic-charcoal/60">天命运势结果：</span>
                    <span className="font-bold text-xs block">
                      底子骰 {rollResult.rolledValue} + 将领名儒加量 {rollResult.playerBonus} = 合数 {rollResult.rolledValue + rollResult.playerBonus}
                    </span>
                    <span className="text-xs text-artistic-charcoal/60">
                      (目标界限: {rollResult.neededValue})
                    </span>
                  </div>
                </div>

                {/* Seal Success indicator */}
                <div className="flex flex-col items-center">
                  {rollResult.isSuccess ? (
                    <div className="flex items-center gap-1 bg-emerald-800/10 border border-emerald-500/30 text-emerald-800 font-serif font-bold text-sm px-4 py-1.5 rounded-none shadow-inner">
                      <CheckCircle className="w-4 h-4 text-emerald-800" />
                      天星高照 · 大获全胜
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 bg-artistic-crimson/10 border border-artistic-crimson/30 text-artistic-crimson font-serif font-bold text-sm px-4 py-1.5 rounded-none shadow-inner">
                      <AlertTriangle className="w-4 h-4 text-artistic-crimson" />
                      天道偏差 · 行止受绌
                    </div>
                  )}
                </div>

                {/* Final outcome text */}
                <div className="bg-artistic-cream p-4 rounded-none border-t-2 border-artistic-charcoal max-h-[160px] overflow-y-auto leading-relaxed text-xs md:text-sm text-[#2a2319] font-serif text-left scrollbar-ink">
                  <p className="indent-6">{rollResult.narration}</p>
                </div>

                {/* Rewards / casualty summary indicators */}
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto font-serif">
                  {rollResult.isSuccess ? (
                    <>
                      {activeQuest.reward.gold && (
                        <div className="bg-artistic-bg border border-artistic-charcoal/30 p-2 rounded-none flex items-center gap-2 text-artistic-charcoal text-xs">
                          <Coins className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>纳金 +{Math.floor(activeQuest.reward.gold * activeQuest.dialogue.choices[selectedChoiceIdx].success.rewardMultiplier)}</span>
                        </div>
                      )}
                      {activeQuest.reward.troops && (
                        <div className="bg-artistic-bg border border-artistic-charcoal/30 p-2 rounded-none flex items-center gap-2 text-artistic-charcoal text-xs">
                          <Users className="w-4 h-4 text-emerald-800 shrink-0" />
                          <span>合部 +{Math.floor(activeQuest.reward.troops * activeQuest.dialogue.choices[selectedChoiceIdx].success.rewardMultiplier)}</span>
                        </div>
                      )}
                      {activeQuest.reward.prestige && (
                        <div className="bg-artistic-bg border border-artistic-charcoal/30 p-2 rounded-none flex items-center gap-2 text-artistic-charcoal text-xs col-span-2">
                          <Award className="w-4 h-4 text-blue-900 shrink-0" />
                          <span>天下声誉 +{Math.floor(activeQuest.reward.prestige * activeQuest.dialogue.choices[selectedChoiceIdx].success.rewardMultiplier)}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    activeQuest.dialogue.choices[selectedChoiceIdx].failure.lossTroops && (
                      <div className="bg-artistic-crimson/10 border border-artistic-crimson/25 p-2 rounded-none flex items-center justify-center gap-2 text-artistic-crimson text-xs col-span-2">
                        <Users className="w-4 h-4 text-artistic-crimson shrink-0" />
                        <span>遭受大意战损：-{activeQuest.dialogue.choices[selectedChoiceIdx].failure.lossTroops} 兵卒</span>
                      </div>
                    )
                  )}
                </div>

                {/* Leaving click */}
                <button
                  onClick={handleExitQuest}
                  className="bg-artistic-charcoal hover:bg-artistic-crimson text-artistic-bg py-2 px-6 rounded-none font-serif font-black text-xs cursor-pointer"
                >
                  回师中军大帐
                </button>
              </div>
            ) : null}
          </div>

          {/* Abort button strictly safe if result not generated */}
          {rollResult === null ? (
            <button
              onClick={handleExitQuest}
              className="absolute top-4 right-4 text-artistic-charcoal/40 hover:text-artistic-crimson transition"
            >
              <ShieldClose className="w-6 h-6 shrink-0" />
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
