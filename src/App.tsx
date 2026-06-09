/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { PlayerStats, Region, General, SideQuest, HistoryRecord, FactionId } from './types';
import { GAME_CHAPTERS, GAME_SCENES } from './data/chapters';
import { getTriviaForScene } from './data/trivia';
import { INITIAL_REGIONS, FACTIONS } from './data/regions';
import { INITIAL_GENERAL_POOL } from './data/generals';
import { SIDE_QUESTS_POOL } from './data/quests';
import ThreeKingdomsMap from './components/ThreeKingdomsMap';
import GeneralRoster from './components/GeneralRoster';
import TerritoryGov from './components/TerritoryGov';
import QuestList from './components/QuestList';
import FactionDiplomacy from './components/FactionDiplomacy';
import RandomEventsTab from './components/RandomEventsTab';
import CivilianModsTab from './components/CivilianModsTab';
import TrainingTab from './components/TrainingTab';
import AnimatedCounter from './components/AnimatedCounter';
import { sfx } from './utils/audio';
import { migrateSaveData } from './utils/saveMigration';
import { SOLAR_ACHIEVEMENTS } from './data/achievements';
import HistoryTimelineD3 from './components/HistoryTimelineD3';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Skull, Sparkles, BookOpen, Map, Landmark, Users, 
  HelpCircle, Archive, RotateCcw, Save, ShieldCheck, 
  Trash2, Award, ShieldAlert, Swords, Quote, Calendar, Coins, Volume2, VolumeX, AlertCircle, Info, X
} from 'lucide-react';

const SAVE_KEY = 'three_kingdoms_retro_alt_save_v2';
const INITIAL_GENERAL_DEFAULTS = JSON.parse(JSON.stringify(INITIAL_GENERAL_POOL));

interface SolarTermInfo {
  name: string;
  icon: string;
  description: string;
  marchingSpeedDays: number;
  marchingCostGold: number;
  harvestTaxMultiplier: number;
  effectDescription: string;
}

const SOLAR_TERMS_MAP: Record<number, SolarTermInfo> = {
  1: {
    name: '大寒 (Major Cold)',
    icon: '❄️',
    description: '大雪封山，岁寒始极。将士手足皲裂，行营阻滞。',
    marchingSpeedDays: 10,
    marchingCostGold: 40,
    harvestTaxMultiplier: 0.7,
    effectDescription: '行军阻滞（耗费日程+4日，军饷+15），内政岁入-30%'
  },
  2: {
    name: '立春 (Beginning of Spring)',
    icon: '🌱',
    description: '东风解冻，春回大地。万物勃发，气数昂然。',
    marchingSpeedDays: 6,
    marchingCostGold: 25,
    harvestTaxMultiplier: 1.0,
    effectDescription: '天风平和，农桑稼穑渐旺'
  },
  3: {
    name: '惊蛰 (Awakening of Insects)',
    icon: '⚡',
    description: '春雷乍动，阳气顿生。主公修智砺学，军中朝气上涌。',
    marchingSpeedDays: 5,
    marchingCostGold: 20,
    harvestTaxMultiplier: 1.1,
    effectDescription: '行军迅捷（耗费日程-1日，军饷减压-5），内政岁入+10%'
  },
  4: {
    name: '清明 (Pure Brightness)',
    icon: '🌾',
    description: '气清景明，春耕大忙。万木吐绿，利于各地纳款赋税。',
    marchingSpeedDays: 6,
    marchingCostGold: 25,
    harvestTaxMultiplier: 1.3,
    effectDescription: '清明大耕，征税黄金岁入得增额外+30%！'
  },
  5: {
    name: '立夏 (Beginning of Summer)',
    icon: '☀️',
    description: '暑意初升，万物滋繁。夏日林原，行军如掌。',
    marchingSpeedDays: 6,
    marchingCostGold: 25,
    harvestTaxMultiplier: 1.0,
    effectDescription: '天地昭明，军资开销恒定平稳'
  },
  6: {
    name: '夏至 (Summer Solstice)',
    icon: '🍉',
    description: '昼长夜短，利于疾速军。长驱直入便兵，饷银微减。',
    marchingSpeedDays: 4,
    marchingCostGold: 15,
    harvestTaxMultiplier: 1.0,
    effectDescription: '极长白昼（行军日程缩短-2日，黄金军饷减征-10）'
  },
  7: {
    name: '大暑 (Major Heat)',
    icon: '🔥',
    description: '酷热流金，暑干难忍。将士兵卒易疲，极耗军需。',
    marchingSpeedDays: 9,
    marchingCostGold: 35,
    harvestTaxMultiplier: 0.8,
    effectDescription: '酷暑燥干（行军迟慢+3日，军饷+10），内税稍见折损-20%'
  },
  8: {
    name: '立秋 (Beginning of Autumn)',
    icon: '🍁',
    description: '金风送爽，秋收在野。仓禀大充，神州各地收获盛况。',
    marchingSpeedDays: 6,
    marchingCostGold: 25,
    harvestTaxMultiplier: 1.5,
    effectDescription: '立秋大丰登（本季各地征税收获暴增额外+50%黄金！）'
  },
  9: {
    name: '秋分 (Autumnal Equinox)',
    icon: '🌾',
    description: '日月交分，秋风万里。秋忙未止，存粮入库。',
    marchingSpeedDays: 6,
    marchingCostGold: 20,
    harvestTaxMultiplier: 1.3,
    effectDescription: '秋忙余续（征税结算+30%黄金，旅程饷项减免-5）'
  },
  10: {
    name: '立冬 (Beginning of Winter)',
    icon: '🍂',
    description: '初冬临空，水始坚冻。叶落草枯，行军微有不便。',
    marchingSpeedDays: 7,
    marchingCostGold: 25,
    harvestTaxMultiplier: 0.9,
    effectDescription: '行军微滞（耗时+1日）'
  },
  11: {
    name: '冬至 (Winter Solstice)',
    icon: '⛄',
    description: '阴极阳生，夜色至深。风雪蔽营，粮饷开销随柴炭上升。',
    marchingSpeedDays: 7,
    marchingCostGold: 30,
    harvestTaxMultiplier: 0.8,
    effectDescription: '风雪严蔽（耗时+1日，旅饷+5，内税-20%）'
  },
  12: {
    name: '小寒 (Minor Cold)',
    icon: '🌨️',
    description: '数九寒冬，万物猫冬。将士兵卒缩营防霜，役使不易。',
    marchingSpeedDays: 8,
    marchingCostGold: 35,
    harvestTaxMultiplier: 0.7,
    effectDescription: '小寒冰盖（行军迟缓+2日，军饷+10，内税-30%）'
  }
};

const calculateEndingEvaluation = (stats: PlayerStats, recruitedCount: number, sceneId: string) => {
  let baseScore = 20;
  if (sceneId === 'ending_emperor') baseScore = 90;
  else if (sceneId === 'ending_loyalist') baseScore = 80;
  else if (sceneId === 'ending_historic') baseScore = 50;
  else if (sceneId === 'ending_defeat') baseScore = 25;

  const devianceBonus = stats.deviance * 0.5; // max 50 points
  const generalsBonus = recruitedCount * 5;    // max 35 points
  const prestigeBonus = Math.min(25, stats.prestige / 30); // max 25 points
  const goldBonus = Math.min(15, stats.gold / 100);       // max 15 points
  
  const totalScore = baseScore + devianceBonus + generalsBonus + prestigeBonus + goldBonus;

  let grade = 'C';
  if (totalScore >= 115) grade = 'SSS';
  else if (totalScore >= 95) grade = 'SS';
  else if (totalScore >= 80) grade = 'S';
  else if (totalScore >= 65) grade = 'A';
  else if (totalScore >= 45) grade = 'B';

  let feedback = '治世之能员，乱世之柴扉。苟活于草莽之中，功绩廖廖。';
  if (grade === 'SSS') {
    feedback = '昭雪乾坤，逆天改命！公手执纲纪，颠覆编年，建立不朽之万世社稷，功至极境，千古无双！';
  } else if (grade === 'SS') {
    feedback = '豪雄逐鹿，鼎立一方。公筹策百出，广纳英豪，鼎足割据，功高垂世。';
  } else if (grade === 'S') {
    feedback = '名满天下，兴邦卫汉。虽有细微星运局限，然不失为一代贤君明主。';
  } else if (grade === 'A') {
    feedback = '勒马安澜，安邦兴治。保境安民数十载，无愧当代英雄。';
  } else if (grade === 'B') {
    feedback = '庸中佼佼，草创大业。终因运数难脱、宿命浅薄，消逝于历史江河之中。';
  }

  return { score: totalScore, grade, feedback };
};

// 权衡评估智能标记反馈 (Dynamically assesses decision weight as user feedback)
const getEvaluationHint = (opt: any): string => {
  if (opt.evaluationHint) {
    return opt.evaluationHint;
  }
  
  // Trace requirement checks
  if (opt.requirement) {
    const req = opt.requirement;
    if (req.attribute === 'force') return `⚖️ 评估：对宿卫武将勇力要求较高 (需武力 ≥ ${req.minVal})`;
    if (req.attribute === 'intelligence') return `🔮 评估：极重军师权变与智略决策 (需智谋 ≥ ${req.minVal})`;
    if (req.attribute === 'leadership') return `♟️ 评估：极度抗压，考验主帅治军魄力 (需统帅 ≥ ${req.minVal})`;
    if (req.attribute === 'prestige') return `👑 评估：海内人望，需要名门极重声威 (需声望 ≥ ${req.minVal})`;
    if (req.attribute === 'virtue') return `🕊️ 评估：大汉民望，深得百姓与仁人拥簇 (需仁德 ≥ ${req.minVal})`;
    if (req.attribute === 'politics') return `📜 评估：庙堂谋略，极其考验内政手腕 (需政治 ≥ ${req.minVal})`;
  }
  
  // Trace stat change effects
  if (opt.effect && opt.effect.statChanges) {
    const sc = opt.effect.statChanges;
    const items: string[] = [];
    if (sc.troops && sc.troops < 0) items.push('兵卒折损');
    if (sc.troops && sc.troops > 0) items.push('扩借劲骑');
    if (sc.gold && sc.gold < 0) items.push('耗用饷银');
    if (sc.gold && sc.gold > 0) items.push('搜括赋金');
    if (sc.virtue && sc.virtue < 0) items.push('可能导致民心下降');
    if (sc.virtue && sc.virtue > 0) items.push('收取海内民心');
    if (sc.addDeviance && sc.addDeviance > 0) items.push('偏轨信史');
    
    if (items.length > 0) {
      return `📊 权衡：此选多会导致【${items.join(' 与 ')}】等政绩演化`;
    }
  }
  
  // Trace text description keywords
  const txt = opt.text || '';
  if (txt.includes('攻') || txt.includes('战') || txt.includes('斩') || txt.includes('杀') || txt.includes('击')) {
    return '⚔️ 权衡：决战于两军之间，以力服人，兵势首重';
  }
  if (txt.includes('守') || txt.includes('退') || txt.includes('避') || txt.includes('屯') || txt.includes('歇')) {
    return '🛡️ 权衡：安民保卒，蓄锐持重，保存宿卫元气';
  }
  if (txt.includes('说') || txt.includes('辨') || txt.includes('谋') || txt.includes('书') || txt.includes('贤')) {
    return '🔮 权衡：舌战博辩，智谋周旋，策士偏门大有可为';
  }
  if (txt.includes('金') || txt.includes('粮') || txt.includes('赋') || txt.includes('商') || txt.includes('饷')) {
    return '🌱 权衡：涉及库帑辎重分配，影响军饷及民生漕运';
  }
  
  return '⚖️ 权衡：利弊相生，成败自如，存乎主公一念之间';
};

export default function App() {
  // --- Game Session State ---
  const [gameState, setGameState] = useState<'MAIN_MENU' | 'INTRO' | 'STORY' | 'MAP' | 'ROSTER' | 'GOV' | 'DIPLOMACY' | 'RANDOM_EVENTS' | 'CIVILIAN_MODS' | 'SIDE_QUESTS' | 'ARCHIVE' | 'ENDING' | 'TRAINING' | 'ACHIEVEMENTS'>('MAIN_MENU');
  const [regionAnnotations, setRegionAnnotations] = useState<Record<string, string>>({});
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  
  // --- Multi-playthrough (Weeks) SSS Bonus ---
  const [sssBonusPoints, setSssBonusPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('three_kingdoms_sss_bonus_points');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // --- Campaign Start Talent Selection ---
  const [selectedTalent, setSelectedTalent] = useState<'none' | 'renyi' | 'baonve'>('none');

  // --- Diplomacy Relations State ---
  const [diplomacyRelations, setDiplomacyRelations] = useState<Record<FactionId, number>>({
    PLAYER: 100,
    HAN: 30,
    CAOCAO: 0,
    LIUBEI: 20,
    SUNQUAN: 10,
    YELLOW_TURBAN: -90,
    DONGZHUO: -70,
    XIONGNU: -40,
    JIN: 0
  });

  // --- Secret Click Egg / Test Mode & Password States ---
  const [sanCount, setSanCount] = useState<number>(0);
  const [guoCount, setGuoCount] = useState<number>(0);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [showPlayerModal, setShowPlayerModal] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [testModeActive, setTestModeActive] = useState<boolean>(false);
  
  // --- Player stats ---
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    name: '',
    courtesyName: '',
    title: '乡勇校义',
    force: 60,
    intelligence: 60,
    leadership: 60,
    politics: 60,
    virtue: 60,
    troops: 0,
    gold: 500,
    prestige: 0,
    popularity: 100,
    year: 177,
    month: 1,
    day: 1,
    difficulty: 'normal',
    deviance: 0,
  });

  // --- Character Builder Points ---
  const [creationPoints, setCreationPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('three_kingdoms_sss_bonus_points');
      const bonus = saved ? parseInt(saved, 10) : 0;
      return 30 + bonus;
    } catch {
      return 30;
    }
  });
  const [builderStats, setBuilderStats] = useState({
    force: 60,
    intelligence: 60,
    leadership: 60,
    politics: 60,
    virtue: 60,
  });

  // --- Playthrough unique run identification ---
  const [runId, setRunId] = useState<string>(() => 'run_' + Date.now());

  // --- Core Lists ---
  const [recruitedGenerals, setRecruitedGenerals] = useState<string[]>([]);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [activeQuests, setActiveQuests] = useState<string[]>([]);
  const [regions, setRegions] = useState<Region[]>(INITIAL_REGIONS);
  const [currentSceneId, setCurrentSceneId] = useState<string>('c1_0');
  const [currentCG, setCurrentCG] = useState<string | null>(null);
  const [autoSaveActive, setAutoSaveActive] = useState<boolean>(false);

  useEffect(() => {
    const scene = GAME_SCENES[currentSceneId];
    if (scene && scene.cgImage) {
      setCurrentCG(scene.cgImage);
    } else {
      setCurrentCG(null);
    }
  }, [currentSceneId]);

  const [currentChapterId, setCurrentChapterId] = useState<string>('c1');
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
  const [expandedHistoryFacts, setExpandedHistoryFacts] = useState<Record<string, boolean>>({});
  const [archiveSearch, setArchiveSearch] = useState<string>('');
  const [archiveFilter, setArchiveFilter] = useState<'ALL' | 'Combat' | 'Diplomacy' | 'Personal' | 'Domestic'>('ALL');
  const [archiveSubTab, setArchiveSubTab] = useState<'CHRONICLES' | 'CALENDAR' | 'TIMELINE'>('CHRONICLES');
  
  // Battle Summary Popup State for post-battle analysis
  const [battleSummary, setBattleSummary] = useState<{
    show: boolean;
    title: string;
    troopsLost: number;
    enemiesDefeated: number;
    tacticsUsed: string;
    result: 'VICTORY' | 'DEFEAT';
  } | null>(null);

  // Cross-city Trade Routes management state
  const [tradeRoutes, setTradeRoutes] = useState<{ id: string; from: string; to: string; active: boolean }[]>(() => {
    try {
      const saved = localStorage.getItem('tk_trade_routes');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('tk_trade_routes', JSON.stringify(tradeRoutes));
  }, [tradeRoutes]);

  const [activeStance, setActiveStance] = useState<'BALANCED' | 'OFFENSIVE' | 'DEFENSIVE'>('BALANCED');
  const [battleFormation, setBattleFormation] = useState<'TORTOISE' | 'PHALANX' | 'ARCHER_WALL'>('TORTOISE');
  const [taxCooldown, setTaxCooldown] = useState<boolean>(false);
  const [playerLocation, setPlayerLocation] = useState<string>('zhuojun');
  const [exploredRegions, setExploredRegions] = useState<string[]>(['zhuojun']);

  // --- Battle Logs State ---
  const [battleLogs, setBattleLogs] = useState<Array<{
    id: string;
    chapterId: string;
    timestamp: string;
    message: string;
    type: 'action' | 'casualty' | 'gain' | 'random_event';
  }>>([
    {
      id: 'init_log',
      chapterId: 'c1',
      timestamp: '公元177年1月1日',
      message: '🚩 主公集结军队，准备在乱世洪流中逆天改命。',
      type: 'action'
    }
  ]);
  const [battleLogFilter, setBattleLogFilter] = useState<'all' | 'action' | 'casualty' | 'gain' | 'random_event'>('all');

  // --- Battle Log Impact Animation State ---
  const [battleLogAnim, setBattleLogAnim] = useState<'none' | 'shake' | 'strong-shake' | 'flash'>('none');

  // --- Battlefield Tricks Stances ---
  const [activeTrick, setActiveTrick] = useState<'backwater' | 'cicada' | null>(null);
  const [trickCooldown, setTrickCooldown] = useState<number>(0); // 0 to 100 for progress percent
  const [trickSecondsLeft, setTrickSecondsLeft] = useState<number>(0); // countdown seconds

  // --- Option Pagination State ---
  const [optionPage, setOptionPage] = useState<number>(0);

  // --- Selected Temporal Conflict Record for Modal Details ---
  const [selectedConflictRecord, setSelectedConflictRecord] = useState<{
    record: HistoryRecord;
    conflictInfo: {
      isConflict: boolean;
      type: 'maicheng' | 'wuzhang';
      realYear: number;
      currentYear: string | number;
      pairEvent: string;
      pairRealYear: number;
      conflictReason: string;
    }
  } | null>(null);

  // Calculate cumulative battle statistics for the current chapter
  const getChapterStats = () => {
    let troopsLost = 0;
    let goldSpent = 0;
    let enemiesDefeated = 0;

    battleLogs.forEach(log => {
      if (log.chapterId !== currentChapterId) return;
      const msg = log.message || '';

      // Pattern matcher for troops lost
      const troopPattern = msg.match(/[折损减少损耗跌落]-\s*(\d+)/i) || 
                           msg.match(/折损\s*(\d+)\s*兵卒/i) || 
                           msg.match(/折损\s*(\d+)\s*人/i) || 
                           msg.match(/损折\s*(\d+)\s*兵卒/i) ||
                           msg.match(/多折\s*(\d+)\s*兵卒/i) ||
                           msg.match(/折兵\s*(\d+)/) ||
                           msg.match(/免折\s*(\d+)人/) ||
                           msg.match(/-\s*(\d+) 我兵/) ||
                           msg.match(/-\s*(\d+) 盾防/) ||
                           msg.match(/-\s*(\d+) 本兵/) ||
                           msg.match(/-\s*(\d+) 卫兵/) ||
                           msg.match(/兵卒额外折多\s*(\d+)/) ||
                           msg.match(/折损\s*(\d+)\s*兵马/);
      if (troopPattern) {
        troopsLost += parseInt(troopPattern[1], 10);
      } else if (log.type === 'casualty') {
        const m = msg.match(/(\d+)/);
        if (m) troopsLost += parseInt(m[1], 10);
      }

      // Pattern matcher for gold spent
      const goldPattern = msg.match(/-\s*(\d+)\s*黄金/) || 
                          msg.match(/扣除\s*(\d+)\s*黄金/) || 
                          msg.match(/耗费\s*(\d+)\s*黄金/) || 
                          msg.match(/消耗\s*(\d+)\s*黄金/) ||
                          msg.match(/花费\s*(\d+)\s*黄金/) ||
                          msg.match(/核发黄金\s*(\d+)/) ||
                          msg.match(/克扣饷银\s*(\d+)/) ||
                          msg.match(/金极\s*-?(\d+)/);
      if (goldPattern) {
        goldSpent += parseInt(goldPattern[1], 10);
      }

      // Pattern matcher for enemies defeated
      const enemyPattern = msg.match(/歼敌\s*(\d+)/) || 
                           msg.match(/杀敌\s*(\d+)/) || 
                           msg.match(/斩敌\s*(\d+)/) || 
                           msg.match(/-\s*(\d+)\s*敌卒/) ||
                           msg.match(/-\s*(\d+)\s*敌兵/) ||
                           msg.match(/-\s*(\d+)\s*敌/);
      if (enemyPattern) {
        enemiesDefeated += parseInt(enemyPattern[1], 10);
      }
    });

    return {
      troopsLost,
      goldSpent,
      enemiesDefeated
    };
  };

  const processedLogIds = useRef<Set<string>>(new Set(['init_log']));
  useEffect(() => {
    if (!battleLogs) return;
    const newLogs = battleLogs.filter(log => !processedLogIds.current.has(log.id));
    if (newLogs.length > 0) {
      newLogs.forEach(log => processedLogIds.current.add(log.id));

      const hasCasualty = newLogs.some(log => log.type === 'casualty');
      const hasGain = newLogs.some(log => log.type === 'gain');

      if (hasCasualty) {
        const highDamage = newLogs.some(log => {
          if (log.type !== 'casualty') return false;
          // Look for any casualty numbers representing high loss (>= 150)
          const match = log.message.match(/(\d+)/);
          return match ? parseInt(match[1], 10) >= 150 : false;
        });

        const animType = highDamage ? 'strong-shake' : 'shake';
        setBattleLogAnim('none');
        const resetT = setTimeout(() => {
          setBattleLogAnim(animType);
          const clearT = setTimeout(() => setBattleLogAnim('none'), animType === 'strong-shake' ? 500 : 400);
          return () => clearTimeout(clearT);
        }, 15);
        return () => clearTimeout(resetT);

      } else if (hasGain) {
        setBattleLogAnim('none');
        const resetT = setTimeout(() => {
          setBattleLogAnim('flash');
          const clearT = setTimeout(() => setBattleLogAnim('none'), 500);
          return () => clearTimeout(clearT);
        }, 15);
        return () => clearTimeout(resetT);
      }
    }
  }, [battleLogs]);

  // --- Story Decision Countdown Timer ---
  const [storyTimer, setStoryTimer] = useState<number | null>(null);

  // --- Decision Outcomes Popup ---
  const [lastOutcome, setLastOutcome] = useState<{
    optionText: string;
    narration: string;
    statChanges: string[];
    nextSceneId: string;
    daysAdvanced: number;
    initialStats: PlayerStats;
    resultingStats: PlayerStats;
  } | null>(null);

  // --- Active Random Event ---
  const [activeRandomEvent, setActiveRandomEvent] = useState<{
    id: string;
    title: string;
    description: string;
    options: Array<{
      text: string;
      actionText?: string;
      actionDesc?: string;
      action: (currentStats: PlayerStats) => { updatedStats: PlayerStats; logMessage: string };
    }>;
  } | null>(null);

  // --- Global Audio Settings ---
  const [soundOn, setSoundOn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('tk_sound_pref');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // Synchronize persisted sound settings with sfx engine and localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tk_sound_pref', soundOn ? 'true' : 'false');
    } catch (e) {
      console.warn("Could not save sound settings:", e);
    }
    sfx.setMute(!soundOn);
  }, [soundOn]);

  // --- New features state ---
  const [showTutorialModal, setShowTutorialModal] = useState<boolean>(false);
  const [questsList, setQuestsList] = useState<SideQuest[]>(() => {
    return JSON.parse(JSON.stringify(SIDE_QUESTS_POOL));
  });
  const [lastCheckedDate, setLastCheckedDate] = useState({ year: 177, month: 1, day: 1 });

  // --- Toast & Confirm Modals for Sandboxed Frames ---
  const [toast, setToast] = useState<string | null>(null);
  const [confirmBox, setConfirmBox] = useState<{
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Auto dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // --- Battlefield Tricks Active Handler ---
  useEffect(() => {
    if (activeTrick) {
      const durationMs = 6000; // 6 seconds duration
      let elapsedMs = 0;
      const interval = setInterval(() => {
        elapsedMs += 100;
        const progress = Math.max(0, 100 - (elapsedMs / durationMs) * 100);
        setTrickCooldown(progress);
        setTrickSecondsLeft(Math.ceil((durationMs - elapsedMs) / 1000));
        
        if (elapsedMs >= durationMs) {
          clearInterval(interval);
          const oldTrick = activeTrick;
          setActiveTrick(null);
          setTrickCooldown(0);
          setTrickSecondsLeft(0);
          showToast(`⚙️ 【战法收招】『${oldTrick === 'backwater' ? '背水一战' : '金蝉脱壳'}』专注期已过，主公三军回归常指挥！`);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [activeTrick]);

  // Trick Click Handlers
  const handleBackwaterTrick = () => {
    if (activeTrick) {
      showToast('⚠️ 主公当前处于另一项特技专注指挥中，分身乏术！');
      return;
    }
    sfx.playClick();
    setActiveTrick('backwater');
    setTrickCooldown(100);
    setTrickSecondsLeft(6);
    
    const trickLog = {
      id: `trick_${Date.now()}`,
      chapterId: currentChapterId,
      timestamp: `公元${playerStats.year}年${playerStats.month}月${playerStats.day}日`,
      message: `⚔️ 【战法·背水一战】主公绝地高呼破釜沉舟，全军死地求生，兵马气势冲天，战意狂飙！额外加注局部战损吸收！`,
      type: 'action' as const
    };
    setBattleLogs(prev => [trickLog, ...prev]);
    setPlayerStats(prev => ({ ...prev, force: prev.force + 2, prestige: prev.prestige + 10 }));
    showToast('⚔️ 【绝境死战】背水一战爆发！6秒内主公需全神贯注指挥死斗，禁止下达其他主线玺令。');
  };

  const handleCicadaTrick = () => {
    if (activeTrick) {
      showToast('⚠️ 主公当前处于另一项特技专注指挥中，分身乏术！');
      return;
    }
    sfx.playClick();
    setActiveTrick('cicada');
    setTrickCooldown(100);
    setTrickSecondsLeft(6);

    const trickLog = {
      id: `trick_${Date.now()}`,
      chapterId: currentChapterId,
      timestamp: `公元${playerStats.year}年${playerStats.month}月${playerStats.day}日`,
      message: `🕊️ 【战法·金蝉脱壳】主公巧施空堡障眼之策，设悬幡疑兵徐徐退走。避其敌国重锋，召得散勇归队！`,
      type: 'gain' as const
    };
    setBattleLogs(prev => [trickLog, ...prev]);
    setPlayerStats(prev => ({ ...prev, troops: prev.troops + 200, intelligence: prev.intelligence + 1 }));
    showToast('🕊️ 【金蝉脱壳】遁守之计施演！6秒内主公潜行撤隐，暂避锋芒，禁止下达其他主线玺令。');
  };

  // Timeline anomaly detection helpers
  const detectTimeConflict = (rec: HistoryRecord, allRecs: HistoryRecord[]) => {
    const isMaicheng = rec.title.includes('麦城') || rec.brief.includes('麦城') || rec.title.includes('关羽');
    const isWuzhang = rec.title.includes('五丈原') || rec.brief.includes('五丈原') || rec.title.includes('诸葛') || rec.title.includes('孔明');
    
    if (isMaicheng || isWuzhang) {
      const hasMaichengPair = allRecs.some(r => r.id !== rec.id && (r.title.includes('麦城') || r.brief.includes('麦城') || r.title.includes('关羽')));
      const hasWuzhangPair = allRecs.some(r => r.id !== rec.id && (r.title.includes('五丈原') || r.brief.includes('五丈原') || r.title.includes('诸葛') || r.title.includes('孔明')));
      
      if (hasMaichengPair && hasWuzhangPair) {
        const getYear = (ts: string) => {
          const match = ts.match(/公元\s*(\d+)\s*年/);
          return match ? parseInt(match[1]) : null;
        };
        const recYear = getYear(rec.timestamp);
        return {
          isConflict: true,
          type: isMaicheng ? 'maicheng' as const : 'wuzhang' as const,
          realYear: isMaicheng ? 219 : 234,
          currentYear: recYear || '未知',
          pairEvent: isMaicheng ? '诸葛亮五丈原' : '关羽麦城受困',
          pairRealYear: isMaicheng ? 234 : 219,
          conflictReason: `在真实正史中，武圣败走麦城（公元219年）与诸葛武侯五丈原星落（公元234年）相隔整整15年之久，具有明确的因果继承关系。然而在阁下逆天改命的全新非线性宇宙中，这两大悲情节点由于您打破宿命，在同个纪年 ${rec.timestamp} 中并存重叠，发生了深刻的因果倒错，使史册产生非线性的时空交错。`
        };
      }
    }
    return null;
  };

  const injectTemporalConflictMocks = () => {
    sfx.playClick();
    const mockRec1: HistoryRecord = {
      id: 'mock_maicheng_conflict',
      timestamp: '公元184年秋',
      title: '关羽大意麦城受困',
      brief: '由于历史线极度偏离，本应在公元219年发生的麦城受困，竟然在汉中义勇军起兵不久 of 公元184年早早重叠激活。吕蒙白衣渡江渡了空，你领大军破阵，突围救下关云长！',
      isAltered: true,
      category: 'Combat'
    };
    const mockRec2: HistoryRecord = {
      id: 'mock_wuzhang_conflict',
      timestamp: '公元184年秋',
      title: '诸葛亮五丈原续命',
      brief: '本应在公元234年病卒于五丈原荒岗之上的诸葛亮，在同一个公元184年事件中，于你的阵前同时油尽灯枯。你拼着己身根基施展了夺天北斗延寿星仪，武侯自此再延寿十二载！',
      isAltered: true,
      category: 'Personal'
    };
    
    setHistoryRecords(prev => {
      const cleaned = prev.filter(r => r.id !== 'mock_maicheng_conflict' && r.id !== 'mock_wuzhang_conflict');
      return [mockRec1, mockRec2, ...cleaned];
    });
    showToast('🔮 【逆天·时空裂化检测】大事记中已成功注入“公元184年”同时出现的麦城与五丈原模拟数据！快往下查阅和比对真实历史走向吧！');
  };

  // Intercept window.alert for sandboxed iframe environments
  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (msg: string) => {
      showToast(msg);
    };
    return () => {
      window.alert = originalAlert;
    };
  }, []);

  // Graceful Story Scene Existence Fallback to prevent white page crashes
  useEffect(() => {
    if (gameState === 'STORY' && !GAME_SCENES[currentSceneId]) {
      console.error(`[帷幄奏报-情景错误] 未能定位到指定故事幕 ID: "${currentSceneId}"。系统已自动安抚军旅，并代为退归至各回首章情节点 (c1_0)。`);
      setCurrentSceneId('c1_0');
      setCurrentChapterId('c1');
      showToast("【奏报】探测到史册有异，三军已退卫本章大寨首幕！");
    }
  }, [currentSceneId, gameState]);

  // Reset option page whenever scene ID changes
  useEffect(() => {
    setOptionPage(0);
  }, [currentSceneId]);

  // --- Daily Quests Refresh Effect (And updates available quests of the date) ---
  useEffect(() => {
    const isNewDay = playerStats.day !== lastCheckedDate.day || 
                    playerStats.month !== lastCheckedDate.month || 
                    playerStats.year !== lastCheckedDate.year;

    if (isNewDay && playerStats.day > 0) {
      const REGION_IDS = ['zhuojun', 'beihai', 'yecheng', 'luoyang', 'changan', 'xiongnu', 'chengdu', 'xiangyang', 'jianye'];
      
      const lastDays = lastCheckedDate.year * 360 + lastCheckedDate.month * 30 + lastCheckedDate.day;
      const currentDays = playerStats.year * 360 + playerStats.month * 30 + playerStats.day;
      const elapsedDays = Math.max(0, currentDays - lastDays);

      // Handle Automatic Infrastructure Investment Passive Returns
      const investmentGold = playerStats.autoDevelopmentGold || 0;
      if (investmentGold > 0 && elapsedDays > 0) {
        // Triggers passive gold income increase: +Math.max(1, Math.floor(investmentGold * 0.02)) per 10 days
        const intervals = Math.floor(elapsedDays / 10) || 1;
        const rewardPassiveInc = Math.max(1, Math.floor(investmentGold * 0.02)) * intervals;
        
        // Return 5% of investment value as direct liquid cash dividend return per turn cycle
        const rewardLiquidDividend = Math.max(1, Math.floor(investmentGold * 0.05)) * intervals;
        
        setPlayerStats(prev => ({
          ...prev,
          gold: prev.gold + rewardLiquidDividend,
          autoDevelopmentPassiveIncome: (prev.autoDevelopmentPassiveIncome || 0) + rewardPassiveInc
        }));

        const dateStr = `第${playerStats.year}年 ${playerStats.month}月 ${playerStats.day}日`;
        const investLog = {
          id: `auto_dev_${Date.now()}_${Math.random()}`,
          timestamp: dateStr,
          message: `🌾 【被动产业投资】历经长途治理 (${elapsedDays} 天)，由您拨付的 ${investmentGold} 屯垦商行基金获得丰美成效。地方被动岁入常态增加 +${rewardPassiveInc} 钱粮，且获得 +${rewardLiquidDividend} 现银红利作为商税即时回流！`,
          type: 'gain' as const
        };
        setTimeout(() => {
          setBattleLogs(prev => [investLog, ...prev]);
        }, 100);
        showToast(`🌾 被动基建产出：获得 🪙 +${rewardLiquidDividend} 黄金股息！`);
      }

      // Handle Trade Routes Passive Returns
      const activeTradeRoutes = tradeRoutes.filter(route => {
        const fromReg = regions.find(r => r.id === route.from);
        const toReg = regions.find(r => r.id === route.to);
        return fromReg && toReg && fromReg.faction === 'PLAYER' && toReg.faction === 'PLAYER';
      });

      if (activeTradeRoutes.length > 0 && elapsedDays > 0) {
        const intervals = Math.floor(elapsedDays / 10) || 1;
        let totalTradeIncome = 0;
        let tradeLogs: string[] = [];

        activeTradeRoutes.forEach(route => {
          const fromReg = regions.find(r => r.id === route.from)!;
          const toReg = regions.find(r => r.id === route.to)!;
          const routeIncome = Math.floor((fromReg.development + toReg.development) * 0.15 + 15) * intervals;
          totalTradeIncome += routeIncome;
          tradeLogs.push(`【${fromReg.name} ⇆ ${toReg.name}】(+${routeIncome} 黄金/十日)`);
        });

        if (totalTradeIncome > 0) {
          setPlayerStats(prev => ({
            ...prev,
            gold: prev.gold + totalTradeIncome
          }));

          const dateStr = `第${playerStats.year}年 ${playerStats.month}月 ${playerStats.day}日`;
          const tradeLogMsg = {
            id: `trade_route_${Date.now()}_${Math.random()}`,
            timestamp: dateStr,
            message: `🐫 【丝绸商路贸易】在过去 ${elapsedDays} 天内，您常态运转的 ${activeTradeRoutes.length} 条通商路线贸易畅行！${tradeLogs.join('，')}，沿途关卡商税及行商红利合共 +${totalTradeIncome} 黄金，已封存入库！`,
            type: 'gain' as const
          };
          setTimeout(() => {
            setBattleLogs(prev => [tradeLogMsg, ...prev]);
          }, 110);
          showToast(`🐫 丝路契盟商税：通商共获得 🪙 +${totalTradeIncome} 黄金！`);
        }
      }

      setQuestsList(prevQuests => {
        return prevQuests.map(q => {
          // Keep completed quests intact
          if (completedQuests.includes(q.id) || q.status === 'COMPLETED') {
            return { ...q, status: 'COMPLETED' as const };
          }
          
          // Move unsolved/failed quests to a new random territory
          const randomRegionId = REGION_IDS[Math.floor(Math.random() * REGION_IDS.length)];
          
          // Re-evaluate requirement-based locking
          let nextStatus: 'AVAILABLE' | 'LOCKED' | 'ACTIVE' = 'AVAILABLE';
          if (q.requirement) {
            if (q.requirement.force && playerStats.force < q.requirement.force) {
              nextStatus = 'LOCKED';
            } else if (q.requirement.intelligence && playerStats.intelligence < q.requirement.intelligence) {
              nextStatus = 'LOCKED';
            } else if (q.requirement.prestige && playerStats.prestige < q.requirement.prestige) {
              nextStatus = 'LOCKED';
            }
          }
          
          return {
            ...q,
            targetRegionId: randomRegionId,
            status: nextStatus
          };
        });
      });

      setLastCheckedDate({
        year: playerStats.year,
        month: playerStats.month,
        day: playerStats.day
      });
      
      showToast("【乾坤演义】时序流转一日，天下郡县在野奇遇已移转刷新！");
    }
  }, [playerStats.year, playerStats.month, playerStats.day]);

  const showToast = (msg: string) => {
    setToast(msg);
  };

  // --- Solar Terms Achievement Auto-evaluator ---
  useEffect(() => {
    if (gameState === 'MAIN_MENU' || gameState === 'INTRO') return;
    
    const matchedIds: string[] = [];
    const m = playerStats.month;
    const isM1 = m === 1 && playerStats.troops > 0 && playerStats.troops < 1500;
    const isM2 = m === 2 && playerStats.popularity >= 85;
    const isM3 = m === 3 && playerStats.intelligence >= 90;
    const isM4 = m === 4 && playerStats.gold >= 450;
    const isM5 = m === 5 && playerStats.force >= 90;
    const isM6 = m === 6; // Solstice travel auto-trigger
    const isM7 = m === 7 && playerStats.troops >= 12000;
    const isM8 = m === 8 && playerStats.gold >= 400; // Standalone winter pre harvest
    const isM9 = m === 9 && recruitedGenerals.length >= 4;
    const isM10 = m === 10 && playerStats.virtue >= 85;
    const isM11 = m === 11 && (playerStats.deviance !== undefined ? playerStats.deviance > 50 : true);
    const isM12 = m === 12 && playerStats.prestige >= 85;

    if (isM1) matchedIds.push('ach_major_cold');
    if (isM2) matchedIds.push('ach_spring_beginning');
    if (isM3) matchedIds.push('ach_insects_awakening');
    if (isM4) matchedIds.push('ach_pure_brightness');
    if (isM5) matchedIds.push('ach_summer_beginning');
    if (isM6) matchedIds.push('ach_summer_solstice');
    if (isM7) matchedIds.push('ach_major_heat');
    if (isM8) matchedIds.push('ach_autumn_beginning');
    if (isM9) matchedIds.push('ach_autumn_equinox');
    if (isM10) matchedIds.push('ach_winter_beginning');
    if (isM11) matchedIds.push('ach_winter_solstice');
    if (isM12) matchedIds.push('ach_minor_cold');

    const newUnlocks = matchedIds.filter(id => !unlockedAchievements.includes(id));
    if (newUnlocks.length > 0) {
      setUnlockedAchievements(prev => {
        const next = [...prev, ...newUnlocks];
        // Automatically persist
        try {
          const cached = localStorage.getItem(SAVE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            parsed.unlockedAchievements = next;
            localStorage.setItem(SAVE_KEY, JSON.stringify(parsed));
          }
        } catch(e) {
          console.error(e);
        }
        return next;
      });

      newUnlocks.forEach(id => {
        const matching = SOLAR_ACHIEVEMENTS.find(a => a.id === id);
        if (matching) {
          setTimeout(() => {
            sfx.playFanfare(true);
            showToast(`🏅【成就殿堂】恭喜主公解锁『${matching.termName.split(' ')[0]} · ${matching.title}』岁华成就！功德昭雪，千秋留名。`);
          }, 300);
        }
      });
    }
  }, [playerStats, recruitedGenerals, unlockedAchievements, gameState]);

  // Load game from cache on initial load
  useEffect(() => {
    const cached = localStorage.getItem(SAVE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.stats && parsed.stats.name) {
          // Confirm restore is available
          // We will let the user choose inside standard intro
        }
      } catch (e) {
        console.error("Error reading saved data", e);
      }
    }
  }, []);

  // --- Save / Load Handlers ---
  const saveGame = () => {
    const data = {
      version: '2.0',
      stats: playerStats,
      recruitedGenerals,
      completedQuests,
      activeQuests,
      regions,
      currentSceneId,
      currentChapterId,
      historyRecords,
      taxCooldown,
      playerLocation,
      gameState,
      exploredRegions,
      annotations: regionAnnotations,
      unlockedAchievements,
      relations: diplomacyRelations,
      questsList,
      lastCheckedDate,
      runId
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    showToast("【开库奏报】军情行纪已妥善封存入阁，可随时在主屏幕载入！");
  };

  const importFileRef = useRef<HTMLInputElement>(null);

  const exportGameSave = () => {
    const sssPoints = localStorage.getItem('three_kingdoms_sss_bonus_points') || '0';
    const data = {
      saveData: {
        version: '2.0',
        stats: playerStats,
        recruitedGenerals,
        completedQuests,
        activeQuests,
        regions,
        currentSceneId,
        currentChapterId,
        historyRecords,
        taxCooldown,
        playerLocation,
        gameState,
        exploredRegions,
        annotations: regionAnnotations,
        unlockedAchievements,
        relations: diplomacyRelations,
        questsList,
        lastCheckedDate,
        runId
      },
      sssPoints: parseInt(sssPoints, 10),
      exportedAt: new Date().toISOString()
    };
    
    try {
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `三国外传_SSS传承与进度存档_${playerStats.name || '明君'}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("📥 【太史奏本】功德底卷及 SSS 传承数据已全量导出为本地 JSON 存档！");
    } catch (e) {
      console.error(e);
      showToast("❌ 导出本纪存档失败，请重试！");
    }
  };

  const importGameSave = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed) {
          showToast("❌ 导入存档格式不合规！该文件无法解析。");
          return;
        }

        // Automatic old archive compatibility inspection and migration
        const { migrated, wasMigrated } = migrateSaveData(parsed, INITIAL_REGIONS);
        if (!migrated || !migrated.stats) {
          showToast("❌ 导入存档格式不合规！该文件非合法的逆天改命录存档。");
          return;
        }

        const data = migrated;
        setPlayerStats(data.stats);
        setRecruitedGenerals(data.recruitedGenerals || []);
        setCompletedQuests(data.completedQuests || []);
        setActiveQuests(data.activeQuests || []);
        setRegions(data.regions || INITIAL_REGIONS);
        setCurrentSceneId(data.currentSceneId || 'c1_0');
        setCurrentChapterId(data.currentChapterId || 'c1');
        setHistoryRecords(data.historyRecords || []);
        setTaxCooldown(data.taxCooldown !== undefined ? data.taxCooldown : false);
        setPlayerLocation(data.playerLocation || 'v1');
        setExploredRegions(data.exploredRegions || []);
        setRegionAnnotations(data.annotations || {});
        setUnlockedAchievements(data.unlockedAchievements || []);
        setDiplomacyRelations(data.relations || {});
        setQuestsList(data.questsList || []);
        setLastCheckedDate(data.lastCheckedDate || { year: 177, month: 1, day: 1 });
        setRunId(data.runId || 'run_' + Date.now());

        const pts = typeof parsed.sssPoints === 'number' ? parsed.sssPoints : 0;
        localStorage.setItem('three_kingdoms_sss_bonus_points', pts.toString());
        setSssBonusPoints(pts);

        localStorage.setItem(SAVE_KEY, JSON.stringify(data));

        if (wasMigrated) {
          showToast("🎉 【太史令本】成功将旧本纪大簿迁移至当前的 V2 架构并顺利导入天命！");
        } else {
          showToast("📥 【太史令本】宿愿大簿导入大成！已恢复您的一世宏图天命！");
        }

        if (data.gameState && data.gameState !== 'INTRO' && data.gameState !== 'MAIN_MENU') {
          setGameState(data.gameState);
        } else {
          setGameState('MAIN_MENU');
        }
      } catch (err) {
        console.error(err);
        showToast("❌ 导入存档解析失败，请确保是标准的 JSON 文本文件！");
      }
    };
    reader.readAsText(file);
  };

  // --- Hotkey-based 'Quick Save' (Ctrl+S or Cmd+S) ---
  const saveGameRef = useRef(saveGame);
  useEffect(() => {
    saveGameRef.current = saveGame;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveGameRef.current();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // --- 5-minute automated local storage save ---
  useEffect(() => {
    if (gameState === 'INTRO' || gameState === 'MAIN_MENU') return;
    const interval = setInterval(() => {
      if (gameState !== 'INTRO' && gameState !== 'MAIN_MENU') {
        saveGameRef.current();
        // Toast and icon animation trigger
        showToast("【太史筒册】天命昭雪行纪已由史官自动誊抄毕，封存存档。");
        setAutoSaveActive(true);
        const timer = setTimeout(() => {
          setAutoSaveActive(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }, 300000); // 300,000 ms = 5 minutes

    return () => clearInterval(interval);
  }, [gameState]);

  const loadGame = () => {
    const cached = localStorage.getItem(SAVE_KEY);
    if (!cached) {
      showToast("内廷尚无旧大业底案，快开启你的一世传奇吧！");
      return;
    }
    try {
      const parsed = JSON.parse(cached);
      
      // Perform automated V2 version compatibility check and data migration
      const { migrated, wasMigrated } = migrateSaveData(parsed, INITIAL_REGIONS);
      const data = migrated;

      setPlayerStats(data.stats);
      setRecruitedGenerals(data.recruitedGenerals || []);
      setCompletedQuests(data.completedQuests || []);
      setActiveQuests(data.activeQuests || []);
      setRegions(data.regions || INITIAL_REGIONS);
      setCurrentSceneId(data.currentSceneId || 'c1_0');
      setCurrentChapterId(data.currentChapterId || 'c1');
      setHistoryRecords(data.historyRecords || []);
      setTaxCooldown(data.taxCooldown !== undefined ? data.taxCooldown : false);
      setPlayerLocation(data.playerLocation || 'v1');
      setExploredRegions(data.exploredRegions || []);
      setRegionAnnotations(data.annotations || {});
      setUnlockedAchievements(data.unlockedAchievements || []);
      setGameState(data.gameState || 'STORY');
      if (data.relations) {
        setDiplomacyRelations(data.relations);
      }
      if (data.questsList) {
        setQuestsList(data.questsList);
      }
      if (data.lastCheckedDate) {
        setLastCheckedDate(data.lastCheckedDate);
      }
      if (data.runId) {
        setRunId(data.runId);
      } else {
        setRunId('run_' + Date.now());
      }

      if (wasMigrated) {
        // Persist the migrated V2 data back to local storage
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        showToast("🔔 【乾坤勘误】检测到旧本纪残篇，已自动归拢升格至 V2 标准案卷并读入！");
      } else {
        showToast("【旧案调阅】成功寻回原定乾坤行纪。主公，还请再度发敕！");
      }
    } catch (e) {
      showToast("读取大业案底时发生错误，档案可能有所污损。");
    }
  };

  const clearSave = () => {
    setConfirmBox({
      message: "确定要参悟天理，重置大业重开一世吗？（多周目 SSS 传承加成将予以保留）",
      onConfirm: () => {
        localStorage.removeItem(SAVE_KEY);
        
        // Load sssBonusPoints
        let bonus = 0;
        try {
          const saved = localStorage.getItem('three_kingdoms_sss_bonus_points');
          bonus = saved ? parseInt(saved, 10) : 0;
        } catch {}
        setSssBonusPoints(bonus);
        setCreationPoints(30 + bonus);
        setSelectedTalent('none');

        // Reset State
        setGameState('MAIN_MENU');
        setPlayerStats({
          name: '',
          courtesyName: '',
          title: '乡勇校义',
          force: 60,
          intelligence: 60,
          leadership: 60,
          politics: 60,
          virtue: 60,
          troops: 0,
          gold: 500,
          prestige: 0,
          popularity: 100,
          year: 177,
          month: 1,
          day: 1,
          difficulty: 'normal',
          deviance: 0,
        });
        setBuilderStats({
          force: 60,
          intelligence: 60,
          leadership: 60,
          politics: 60,
          virtue: 60,
        });
        setRecruitedGenerals([]);
        setCompletedQuests([]);
        setActiveQuests([]);
        setRegions(JSON.parse(JSON.stringify(INITIAL_REGIONS)));
        setQuestsList(JSON.parse(JSON.stringify(SIDE_QUESTS_POOL)));
        setDiplomacyRelations({
          PLAYER: 100,
          HAN: 30,
          CAOCAO: 0,
          LIUBEI: 20,
          SUNQUAN: 10,
          YELLOW_TURBAN: -90,
          DONGZHUO: -70,
          XIONGNU: -40,
          JIN: 0
        });
        setCurrentSceneId('c1_0');
        setCurrentChapterId('c1');
        setHistoryRecords([]);
        setTaxCooldown(false);
        setPlayerLocation('zhuojun');
        setExploredRegions(['zhuojun']);

        // Restore default state of all generals to prevent status leak
        if (INITIAL_GENERAL_DEFAULTS) {
          Object.keys(INITIAL_GENERAL_DEFAULTS).forEach(key => {
            if (INITIAL_GENERAL_POOL[key] && INITIAL_GENERAL_DEFAULTS[key]) {
              Object.assign(INITIAL_GENERAL_POOL[key], JSON.parse(JSON.stringify(INITIAL_GENERAL_DEFAULTS[key])));
            }
          });
        }

        showToast("📿 天机重绘，大业尘落主菜单，传承点数已就位！");
      }
    });
  };

  // --- Character creation controls ---
  const handleStatAdjust = (stat: keyof typeof builderStats, increment: boolean) => {
    if (increment && creationPoints > 0 && builderStats[stat] < 95) {
      setBuilderStats(prev => ({ ...prev, [stat]: prev[stat] + 1 }));
      setCreationPoints(prev => prev - 1);
    } else if (!increment && builderStats[stat] > 45) {
      setBuilderStats(prev => ({ ...prev, [stat]: prev[stat] - 1 }));
      setCreationPoints(prev => prev + 1);
    }
  };

  const handleStartCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerStats.name.trim() || !playerStats.courtesyName.trim()) {
      showToast("请为主公订立姓名与表字，方可勒石著书！");
      return;
    }

    let startingGold = 500;
    let startingTroops = 1200; // Normal starting troops as described in buttons

    if (playerStats.difficulty === 'easy') {
      startingGold = 1000;
      startingTroops = 2000;
    } else if (playerStats.difficulty === 'hard') {
      startingGold = 250;
      startingTroops = 750;
    }

    // Apply Talent Adjustments!
    let talentVirtueBonus = 0;
    let talentGoldBonus = 0;
    let talentForceBonus = 0;
    let talentPrestigeBonus = 0;
    let talentTroopsBonus = 0;

    if (selectedTalent === 'renyi') {
      talentVirtueBonus = 15;
      talentPrestigeBonus = 50;
      talentTroopsBonus = 150;
    } else if (selectedTalent === 'baonve') {
      talentVirtueBonus = -15; // "暴虐无道-15"
      talentGoldBonus = 500;
      talentForceBonus = 15;
    }
    
    const initialStats: PlayerStats = {
      ...playerStats,
      force: builderStats.force + talentForceBonus,
      intelligence: builderStats.intelligence,
      leadership: builderStats.leadership,
      politics: builderStats.politics,
      virtue: Math.max(0, builderStats.virtue + talentVirtueBonus),
      troops: startingTroops + talentTroopsBonus,
      gold: startingGold + talentGoldBonus,
      prestige: talentPrestigeBonus,
      popularity: selectedTalent === 'renyi' ? 120 : (selectedTalent === 'baonve' ? 60 : 100),
      year: 177,
      month: 1,
      day: 1,
      deviance: 0,
      title: '乡村义士首'
    };

    // Deep reset components to completely clear previous runs leftovers
    setRegions(JSON.parse(JSON.stringify(INITIAL_REGIONS)));
    setQuestsList(JSON.parse(JSON.stringify(SIDE_QUESTS_POOL)));
    setRecruitedGenerals([]);
    setCompletedQuests([]);
    setActiveQuests([]);
    setTaxCooldown(false);
    setPlayerLocation('zhuojun');
    setExploredRegions(['zhuojun']);
    setDiplomacyRelations({
      PLAYER: 100,
      HAN: 30,
      CAOCAO: 0,
      LIUBEI: 20,
      SUNQUAN: 10,
      YELLOW_TURBAN: -90,
      DONGZHUO: -70,
      XIONGNU: -40,
      JIN: 0
    });

    // Reset general stats
    if (INITIAL_GENERAL_DEFAULTS) {
      Object.keys(INITIAL_GENERAL_DEFAULTS).forEach(key => {
        if (INITIAL_GENERAL_POOL[key] && INITIAL_GENERAL_DEFAULTS[key]) {
          Object.assign(INITIAL_GENERAL_POOL[key], JSON.parse(JSON.stringify(INITIAL_GENERAL_DEFAULTS[key])));
        }
      });
    }

    setPlayerStats(initialStats);
    setCurrentSceneId('c1_0');
    setCurrentChapterId('c1');
    setGameState('STORY');

    // Add battle log entry for start of campaign
    const startingDateStr = `公元177年1月1日`;
    const startLog = {
      id: `battle_init_${Date.now()}`,
      chapterId: 'c1',
      timestamp: startingDateStr,
      message: `🚩 乱世风雨急，主公 ${initialStats.name}（字 ${initialStats.courtesyName}）在涿郡结发募军，开启匡扶天下之路！【天赋: ${
        selectedTalent === 'renyi' ? '仁义之君 (德行+15, 起始威名+50, 起始额外+150精兵)' : selectedTalent === 'baonve' ? '暴虐无道 (德行-15, 起始劫掠黄金+500, 起始武力+15)' : '凡人俗子 (无)'
      }】 【开局难度: ${
        playerStats.difficulty === 'easy' ? '割据一方(简单)' : playerStats.difficulty === 'hard' ? '白手起兵(困难)' : '群雄并起(普通)'
      }】`,
      type: 'action' as const
    };
    setBattleLogs([startLog]);

    // Add brief intro log to global chronic
    const introRecord: HistoryRecord = {
      id: 'intro_act',
      timestamp: '公元177年',
      title: '龙蛇起陆',
      brief: `主公 ${initialStats.name}（字${initialStats.courtesyName}）于涿郡白手起家。初设本心，磨牙利枪，志保一方黎庶安宁。`,
      isAltered: false,
      category: 'Personal'
    };
    setHistoryRecords([introRecord]);
  };

  // --- Active chapters logic ---
  const activeScene = GAME_SCENES[currentSceneId] || GAME_SCENES['c1_0'];
  const activeChapter = GAME_CHAPTERS.find(c => c.id === currentChapterId) || GAME_CHAPTERS[0];

  // Calendared progression day-by-day
  const advanceTime = (days: number, currentStats: PlayerStats) => {
    let d = currentStats.day + days;
    let m = currentStats.month;
    let y = currentStats.year;
    while (d > 30) {
      d -= 30;
      m += 1;
      if (m > 12) {
        m = 1;
        y += 1;
      }
    }
    return { year: y, month: m, day: d };
  };

  // Randomized Events between sessions/scenes
  const triggerRandomEvent = (statsAfterChoice: PlayerStats, nextSceneToLoad: string) => {
    const eventPool = [
      {
        id: 'bandit_raid',
        title: '⚠️ 盗民啸聚：黄巾流匪围攻粮秣',
        description: '大军扎营休整之夜，忽有小股散兵流匪纠合当地土匪，乘夜突击粮秣辎重，马厩附近火光冲天！',
        options: [
          {
            text: '【亲自披挂】引麾下宿卫武力迎战（考验：武力门槛 60）',
            action: (current: PlayerStats) => {
              const checkVal = current.force;
              const isSuccess = checkVal >= 60;
              if (isSuccess) {
                const updated = {
                  ...current,
                  gold: current.gold + 80,
                  troops: Math.max(10, current.troops - 15),
                  prestige: current.prestige + 15
                };
                return {
                  updatedStats: updated,
                  logMessage: `⚔️ 【奇遇-盗民啸聚】主公引军飞骑冲杀，一刀枭首匪贼！我军缴获战利品：纳金 +80，遭受极微伤亡 -15 兵卒，美名 +15。`
                };
              } else {
                const updated = {
                  ...current,
                  troops: Math.max(10, current.troops - 150),
                  prestige: Math.max(0, current.prestige - 10)
                };
                return {
                  updatedStats: updated,
                  logMessage: `💀 【奇遇-盗民啸聚】武力失机陷入重围，粮草辎重付之一炬！痛失兵马 -150 兵卒，地方名誉 -10。`
                };
              }
            }
          },
          {
            text: '【固垒清野】紧寨门拒斗，沉稳防守（稳扎稳打：不冒风险）',
            action: (current: PlayerStats) => {
              const goldDamage = Math.min(current.gold, 60);
              const updated = {
                ...current,
                gold: current.gold - goldDamage,
                troops: Math.max(10, current.troops - 8)
              };
              return {
                updatedStats: updated,
                logMessage: `🛡️ 【奇遇-盗民啸聚】大军闭营结盾。流匪无法逾越，纵火散去。仅折算部分草场损折 -${goldDamage} 黄金、仅负微伤 -8 兵卒。`
              };
            }
          }
        ]
      },
      {
        id: 'merchant_visit',
        title: '🐫 塞外商贾：幽冀良马贩子来访',
        description: '幽冀边界的马商亲族拖着长长的马队投宿在大军外港，声称仰慕主公威声，愿降价折扣售卖大批健壮辽东骏马。',
        options: [
          {
            text: '【高价买鞍】支出 120 黄金全力组建骑营',
            action: (current: PlayerStats) => {
              if (current.gold < 120) {
                const updated = {
                  ...current,
                  prestige: current.prestige + 5
                };
                return {
                  updatedStats: updated,
                  logMessage: `🐫 【奇遇-塞外商贾】库府存金不足 120。商贾好语致敬，买卖不成仁义在，声誉 +5。`
                };
              }
              const updated = {
                ...current,
                gold: current.gold - 120,
                force: Math.min(100, current.force + 3),
                prestige: current.prestige + 20
              };
              return {
                updatedStats: updated,
                logMessage: `🐎 【奇遇-塞外商贾】支出 -120 黄金配给百战铁马。麾下锋芒大露，主公武力 +3，威名 +20。`
              };
            }
          },
          {
            text: '本分行军，婉言谢绝，给行商开具路条庇护',
            action: (current: PlayerStats) => {
              const updated = {
                ...current,
                virtue: Math.min(100, current.virtue + 5)
              };
              return {
                updatedStats: updated,
                logMessage: `🍃 【奇遇-塞外商贾】主公两袖清风，婉言推却。行商叹服，天下德心 +5。`
              };
            }
          }
        ]
      },
      {
        id: 'famine_event',
        title: '🌾 天灾赤地：清口附近突遭大旱',
        description: '并州豫州接壤处连月无雨，农桑焦枯，村镇流民遍地，扶老抱幼堵于营门外哭喊讨粥。',
        options: [
          {
            text: '【慷慨赈释】调出 100 黄金并大布粥粥拯救灾黎',
            action: (current: PlayerStats) => {
              if (current.gold < 100) {
                const updated = {
                  ...current,
                  virtue: current.virtue + 3
                };
                return {
                  updatedStats: updated,
                  logMessage: `🍚 【奇遇-赈灾放粥】府库羞涩，无金煮粥。灾民得知实情皆赞太守宽德，德行属性 +3。`
                };
              }
              const updated = {
                ...current,
                gold: current.gold - 100,
                virtue: Math.min(100, current.virtue + 15),
                prestige: current.prestige + 30
              };
              return {
                updatedStats: updated,
                logMessage: `🍚 【奇遇-赈灾放粥】慷慨解囊放粥 -100 黄金。万民高呼明公之德！德行 +15，朝野声誉 +30。`
              };
            }
          },
          {
            text: '【严密拒守】军资重器，紧守哨门（绝不冒饷）',
            action: (current: PlayerStats) => {
              const updated = {
                ...current,
                prestige: Math.max(0, current.prestige - 20),
                virtue: Math.max(0, current.virtue - 5)
              };
              return {
                updatedStats: updated,
                logMessage: `🔒 【奇遇-赈灾放粥】营门紧锁，拒济流民。主公在士子民望中名气跌落 -20，百姓叹德行 -5。`
              };
            }
          }
        ]
      }
    ];

    const randomPick = eventPool[Math.floor(Math.random() * eventPool.length)];
    sfx.playFanfare(false);

    setActiveRandomEvent({
      id: randomPick.id,
      title: randomPick.title,
      description: randomPick.description,
      options: randomPick.options.map((o) => ({
        text: o.text,
        action: (current: PlayerStats) => {
          const res = o.action(current);
          setPlayerStats(res.updatedStats);

          // Advanced random time (around 8 days)
          let timeAfterRand = advanceTime(8, res.updatedStats);
          setPlayerStats(prev => ({
            ...prev,
            year: timeAfterRand.year,
            month: timeAfterRand.month,
            day: timeAfterRand.day
          }));

          const randomLog = {
            id: `random_evt_${Date.now()}`,
            chapterId: currentChapterId,
            timestamp: `公元${timeAfterRand.year}年${timeAfterRand.month}月${timeAfterRand.day}日`,
            message: res.logMessage,
            type: 'random_event' as const
          };
          setBattleLogs(prev => [randomLog, ...prev]);

          setActiveRandomEvent(null);

          // Sound cues
          sfx.playFanfare(!res.logMessage.includes('💀') && !res.logMessage.includes('🔒'));

          // Load target scene
          if (nextSceneToLoad) {
            setCurrentSceneId(nextSceneToLoad);
            const nextSc = GAME_SCENES[nextSceneToLoad];
            if (nextSc && nextSc.chapterId !== currentChapterId) {
              setCurrentChapterId(nextSc.chapterId);
            }
            if (nextSceneToLoad.startsWith('ending_')) {
              setGameState('ENDING');
            }
          }
          return res;
        }
      }))
    });
  };

  const handleOptionSelect = (option: any) => {
    if (activeTrick) {
      showToast(`⚔️ 【特技专注中】『${activeTrick === 'backwater' ? '背水一战' : '金蝉脱壳'}』战法法阵生效，主公当前无法改变主线玺令决策！`);
      return;
    }
    
    // Reset option pagination for the next scene
    setOptionPage(0);

    const effect = option.effect;

    // Check optional option requirements with difficulty changes 
    if (option.requirement) {
      const req = option.requirement;
      if (req.attribute) {
        const val = playerStats[req.attribute as keyof PlayerStats];
        let reqMinVal = req.minVal || 0;
        
        // Difficulty thresholds adjustments: -10 for Easy, +10 for Hard
        if (playerStats.difficulty === 'easy') {
          reqMinVal = Math.max(0, reqMinVal - 10);
        } else if (playerStats.difficulty === 'hard') {
          reqMinVal = reqMinVal + 10;
        }

        if (typeof val === 'number' && val < reqMinVal) {
          showToast(`素质及资望未孚！【由于“${playerStats.difficulty === 'hard' ? '困难难度+10属性要求' : '正常/简单'}”门槛调整】选择此策需要【${req.attribute}】不低于 ${reqMinVal} (玩家当前: ${val})。`);
          return;
        }
      }
      if (req.neededGold && playerStats.gold < req.neededGold) {
        showToast("库饷库粮见底，支撑不起该项大张声威之役！");
        return;
      }
      if (req.neededTroops && playerStats.troops < req.neededTroops) {
        showToast("阵中兵马残缺，兵卒数不足以执行此决断！");
        return;
      }
    }

    // Days advanced per action in the main nodes
    const daysProgress = Math.floor(Math.random() * 16) + 12; // 12-27 days
    const currentSnapshot = { ...playerStats };
    let tempStats = { ...playerStats };

    // Align scene historical target year is lagging behind
    if (activeScene.year > tempStats.year) {
      tempStats.year = activeScene.year;
      tempStats.month = 1;
      tempStats.day = 1;
    }

    const nextDate = advanceTime(daysProgress, tempStats);
    tempStats.year = nextDate.year;
    tempStats.month = nextDate.month;
    tempStats.day = nextDate.day;

    // Write attributes modifications
    if (effect.statChanges) {
      Object.keys(effect.statChanges).forEach((key) => {
        let change = effect.statChanges[key];

        // Apply Battle Formation Active Troop Stance impacts to troop loss/survival rates
        if (key === 'troops' && typeof change === 'number' && change < 0) {
          if (activeStance === 'DEFENSIVE') {
            const savedAmount = Math.round(Math.abs(change) * 0.30);
            change = change + savedAmount; // Reduce casualty losses
            showToast(`🛡️ 【鹤翼阵·守势抵扣】我军扎营稳守两翼，成功免遭折损 30% 兵卒 (保全了 ${savedAmount} 条将勇生命)！`);
          } else if (activeStance === 'OFFENSIVE') {
            const extraLoss = Math.round(Math.abs(change) * 0.15);
            change = change - extraLoss; // Increase losses
            showToast(`🏹 【锋矢阵·冲攻多折】锋线过于突出暴露，乱军搏杀中额外增加 15% 精卒兵员折损 (多折损了 ${extraLoss} 精锐)！`);
          }
        }

        const currentVal = tempStats[key as keyof PlayerStats];
        if (typeof currentVal === 'number' && typeof change === 'number') {
          (tempStats as any)[key] = currentVal + change;
        }
      });
    }

    if (effect.addDeviance) {
      tempStats.deviance = Math.min(100, tempStats.deviance + effect.addDeviance);
    }

    if (effect.title) {
      tempStats.title = effect.title;
    }

    // Assemble outcome summaries to display to user after choice selected
    const changesList: string[] = [];
    if (effect.statChanges) {
      Object.keys(effect.statChanges).forEach((key) => {
        const val = effect.statChanges[key];
        const labelMap: Record<string, string> = {
          force: '武力',
          intelligence: '智力',
          leadership: '统帅',
          politics: '政治',
          virtue: '德行',
          gold: '黄金',
          troops: '兵卒',
          prestige: '声誉'
        };
        const label = labelMap[key] || key;
        if (val > 0) changesList.push(`🌾 【${label}】增加 +${val}`);
        if (val < 0) changesList.push(`🥀 【${label}】损耗 ${val}`);
      });
    }
    if (effect.addDeviance) {
      changesList.push(`🔮 【历史偏逸扭转度】增加 +${effect.addDeviance}%`);
    }
    if (effect.title) {
      changesList.push(`👑 【朝廷拜爵】获授尊称【${effect.title}】`);
    }
    if (effect.addGeneral) {
      const nameOfG = INITIAL_GENERAL_POOL[effect.addGeneral]?.name || effect.addGeneral;
      changesList.push(`🎴 【招揽豪俊】大将【${nameOfG}】入列宿卫`);
    }

    sfx.playFanfare(true);

    setLastOutcome({
      optionText: option.text,
      narration: effect.customLog || `主公行发玺令，三军有条不紊依案执行中。`,
      statChanges: changesList,
      nextSceneId: option.nextSceneId,
      daysAdvanced: daysProgress,
      initialStats: currentSnapshot,
      resultingStats: tempStats
    });
  };

  // --- Auto-Select Worst Option when countdown reaches zero ---
  const handleAutoSelectWorstOption = () => {
    const activeScene = GAME_SCENES[currentSceneId];
    if (!activeScene || !activeScene.options || activeScene.options.length === 0) return;

    let worstOption = activeScene.options[0];
    let worstScore = Infinity;

    activeScene.options.forEach(option => {
      let score = 0;
      if (option.effect && option.effect.statChanges) {
        const sc = option.effect.statChanges;
        score += (sc.troops || 0) * 2; // heavily weight troops
        score += (sc.gold || 0);
        score += (sc.force || 0) * 10;
        score += (sc.intelligence || 0) * 10;
        score += (sc.prestige || 0) * 5;
        score += (sc.virtue || 0) * 5;
      }
      if (score < worstScore) {
        worstScore = score;
        worstOption = option;
      }
    });

    showToast(`⏰ 决断余息竭！默认自动行最坏之策：【${worstOption.text}】！`);
    sfx.playDrum();
    handleOptionSelect(worstOption);
    setStoryTimer(null);
  };

  // --- Countdown timer effect logic ---
  useEffect(() => {
    let interval: any = null;
    const activeScene = GAME_SCENES[currentSceneId];
    const hasOptions = activeScene && activeScene.options && activeScene.options.length > 0;

    // Only apply countdown timer in hard difficulty (困难难度)
    const isHardDifficulty = playerStats && playerStats.difficulty === 'hard';

    if (isHardDifficulty && gameState === 'STORY' && hasOptions && !lastOutcome) {
      if (storyTimer === null) {
        setStoryTimer(25); // 25 seconds duration
      } else if (storyTimer > 0) {
        interval = setInterval(() => {
          setStoryTimer(prev => (prev !== null ? prev - 1 : null));
        }, 1000);
      } else if (storyTimer === 0) {
        handleAutoSelectWorstOption();
      }
    } else {
      if (storyTimer !== null) {
        setStoryTimer(null);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, currentSceneId, lastOutcome, storyTimer, playerStats.difficulty]);

  // --- Trigger Game Over if troops <= 0 while playing ---
  useEffect(() => {
    if (gameState !== 'INTRO' && gameState !== 'MAIN_MENU' && gameState !== 'ENDING' && playerStats && playerStats.troops <= 0) {
      sfx.playFanfare(false);
      setCurrentSceneId('ending_defeat');
      setGameState('ENDING');
      showToast("🥀 兵员消耗殆尽，军威尽失！主公沦为枪下劫掠之骨。");
    }
  }, [playerStats.troops, gameState]);

  // --- Award SSS multi-playthrough reward on reaching ENDING state ---
  useEffect(() => {
    if (gameState === 'ENDING') {
      const scene = GAME_SCENES[currentSceneId] || GAME_SCENES['c1_0'];
      const endingEvaluation = calculateEndingEvaluation(playerStats, recruitedGenerals.length, scene.id);
      if (endingEvaluation.grade === 'SSS') {
        try {
          const rewardedRuns = JSON.parse(localStorage.getItem('three_kingdoms_rewarded_runs') || '[]');
          if (!rewardedRuns.includes(runId)) {
            // Award SSS bonus
            const savedBonus = localStorage.getItem('three_kingdoms_sss_bonus_points');
            const currentBonus = savedBonus ? parseInt(savedBonus, 10) : 0;
            const newBonus = currentBonus + 18;
            localStorage.setItem('three_kingdoms_sss_bonus_points', newBonus.toString());
            
            // Save runId to rewardedRuns
            rewardedRuns.push(runId);
            localStorage.setItem('three_kingdoms_rewarded_runs', JSON.stringify(rewardedRuns));
            
            setSssBonusPoints(newBonus);
            setCreationPoints(30 + newBonus);
            
            showToast("🏆 【薪火相传功德满】大业评定达 SSS 盖世境界！天理已记录，下世起点多获 +18 底子属性点！");
          }
        } catch (e) {
          console.error("Failed to parse SSS reward progression", e);
        }
      }
    }
  }, [gameState, currentSceneId, runId, playerStats, recruitedGenerals]);

  const triggerBattleSummary = (title: string, result: 'VICTORY' | 'DEFEAT', troopsLost: number, baseEnemies?: number) => {
    const isWin = result === 'VICTORY';
    
    // Choose dynamic tactical details based on the active state and random variations
    const positiveTactics = [
      `我军结【${battleFormation === 'TORTOISE' ? '玄武圆门盾阵' : battleFormation === 'PHALANX' ? '两翼鹤翼阵' : '长蛇极走阵'}】坚筑法度。主力绕出敌后，火烧镔铁战车与粮秣草包，敌军大部遂阵型崩溃溃。`,
      `参军先手设伏并施展【烟煤火计】，顺大风点燃敌寨。烈炎滔天，敌中军前堵被完全撕裂。`,
      `三军列战突击，主公【振效仁德】，士兵浴血冲锋。以【中军横阵】直击其中门，敌部侧卫守将瞬间破防败退。`
    ];
    
    const negativeTactics = [
      `敌营采用长枪【攒射攢阵】，我军冲锋前廊过于纵深暴露。遭受高密礌石落木包抄，主力折合甚重。`,
      `在山口狭路遭遇寇袭【伏兵攒杀】，我骑兵阵脚仓促难成防势。虽主公亲自突围解护，但后军新卒散退多人。`,
      `因探马情报失真，中敌军【隔段断粮】之深谷包夹，兵困而疲。虽最后关头破险杀出，精旅减员仍无法挽回。`
    ];
    
    const randomTactic = isWin 
      ? positiveTactics[Math.floor(Math.random() * positiveTactics.length)] 
      : negativeTactics[Math.floor(Math.random() * negativeTactics.length)];

    const calculatedEnemies = baseEnemies || (isWin 
      ? Math.floor(troopsLost * 2.2 + Math.random() * 500 + 350)
      : Math.floor(troopsLost * 0.45 + Math.random() * 120 + 30));

    setBattleSummary({
      show: true,
      title,
      troopsLost: Math.max(0, troopsLost),
      enemiesDefeated: Math.max(15, calculatedEnemies),
      tacticsUsed: randomTactic,
      result
    });

    try {
      if (isWin) {
        sfx.playFanfare(true);
      } else {
        sfx.playFanfare(false);
      }
    } catch (e) {
      console.warn("SFX warning:", e);
    }
  };

  const handleProceedOutcome = () => {
    if (!lastOutcome) return;
    sfx.playClick();

    const nextId = lastOutcome.nextSceneId;
    const finalStats = lastOutcome.resultingStats;

    // Check if it represents a battle on the historical timeline
    const sceneData = GAME_SCENES[currentSceneId];
    if (sceneData) {
      const prevStats = lastOutcome.initialStats;
      const lost = prevStats.troops - finalStats.troops;
      const logText = (sceneData.title + " " + lastOutcome.narration).toLowerCase();
      
      const isBattle = lost > 0 && (logText.includes('战') || logText.includes('兵') || logText.includes('袭') || logText.includes('军') || logText.includes('围') || logText.includes('斩') || logText.includes('平叛') || logText.includes('血') || logText.includes('攻') || logText.includes('突'));
      if (isBattle) {
        const isWin = !logText.includes('败') && !logText.includes('溃退') && !logText.includes('全军覆没');
        triggerBattleSummary(
          sceneData.title,
          isWin ? 'VICTORY' : 'DEFEAT',
          lost
        );
      }
    }

    // 1. Commit player statistics changes
    setPlayerStats(finalStats);

    // 2. Archive history records if this was isAltered or significant
    if (sceneData) {
      // Find if we altered history
      const prevStats = lastOutcome.initialStats;
      const altered = finalStats.deviance > prevStats.deviance;
      
      // Determine category based on keywords
      const determineCategory = (titleStr: string, briefStr: string): 'Combat' | 'Diplomacy' | 'Personal' | 'Domestic' => {
        const text = (titleStr + " " + briefStr).toLowerCase();
        if (text.includes('战') || text.includes('兵') || text.includes('军') || text.includes('袭') || text.includes('突') || text.includes('退') || text.includes('武') || text.includes('胜') || text.includes('败') || text.includes('斩') || text.includes('杀') || text.includes('将') || text.includes('骑') || text.includes('阵')) {
          return 'Combat';
        }
        if (text.includes('盟') || text.includes('和') || text.includes('交') || text.includes('礼') || text.includes('让') || text.includes('派') || text.includes('结') || text.includes('亲') || text.includes('贡') || text.includes('使')) {
          return 'Diplomacy';
        }
        if (text.includes('税') || text.includes('垦') || text.includes('粮') || text.includes('谷') || text.includes('筑') || text.includes('库') || text.includes('治') || text.includes('金') || text.includes('内政') || text.includes('荒') || text.includes('官') || text.includes('商')) {
          return 'Domestic';
        }
        return 'Personal';
      };

      const newRec: HistoryRecord = {
        id: `rec_${Date.now()}`,
        timestamp: `公元${finalStats.year}年${finalStats.month}月`,
        title: sceneData.title,
        brief: lastOutcome.narration,
        isAltered: altered,
        category: determineCategory(sceneData.title, lastOutcome.narration)
      };
      setHistoryRecords(prev => [newRec, ...prev]);
    }

    // 3. Clear the outcome popup
    setLastOutcome(null);

    // direct scene progression (uninterrupted by random events, which are relocated to their dedicated tab)
    if (nextId) {
      setCurrentSceneId(nextId);
      const nextSc = GAME_SCENES[nextId];
      if (nextSc && nextSc.chapterId !== currentChapterId) {
        setCurrentChapterId(nextSc.chapterId);
      }
      if (nextId.startsWith('ending_')) {
        setGameState('ENDING');
      }
    }
  };

  // --- Travel map control ---
  const handleTravel = (regionId: string) => {
    sfx.playGallop();
    setPlayerLocation(regionId);
    setExploredRegions(prev => prev.includes(regionId) ? prev : [...prev, regionId]);
    
    const term = SOLAR_TERMS_MAP[playerStats.month] || {
      name: '常规节气',
      icon: '🌍',
      description: '天时平和，行进如常。',
      marchingSpeedDays: 6,
      marchingCostGold: 25,
      harvestTaxMultiplier: 1.0,
      effectDescription: '风平浪静，行止如意'
    };

    setPlayerStats(prev => {
      const advanced = advanceTime(term.marchingSpeedDays, prev);
      return {
        ...prev,
        ...advanced,
        gold: Math.max(0, prev.gold - term.marchingCostGold)
      };
    });
    
    const rName = regions.find(r => r.id === regionId)?.name || '';
    const dateStr = `公元${playerStats.year}年${playerStats.month}月${playerStats.day}日`;
    
    const travelLog = {
      id: `travel_${Date.now()}`,
      chapterId: currentChapterId,
      timestamp: dateStr,
      message: `🐎 【行军进驻】主公逢节气【${term.name} ${term.icon}】率护军精骑出发，由于“${term.effectDescription}”，耗时 ${term.marchingSpeedDays} 日，支出军饷金数 -${term.marchingCostGold}。队伍顺利安扎于地区【${rName}】。`,
      type: 'action' as const
    };
    setBattleLogs(prev => [travelLog, ...prev]);
  };

  // --- Local garrison transfers ---
  const handleGarrisonTransfer = (regionId: string, amount: number) => {
    sfx.playClick();
    setPlayerStats(prev => ({
      ...prev,
      troops: Math.max(0, prev.troops - amount)
    }));
    setRegions(prev => prev.map(r => r.id === regionId ? { ...r, garrison: r.garrison + amount } : r));
  };

  // --- Recruit pool hire ---
  const handleRecruitGeneral = (generalId: string) => {
    sfx.playDrum();
    const cost = INITIAL_GENERAL_POOL[generalId].recruitCost;
    setPlayerStats(prev => {
      const advanced = advanceTime(5, prev);
      return {
        ...prev,
        ...advanced,
        gold: prev.gold - cost,
        prestige: prev.prestige + 20
      };
    });
    setRecruitedGenerals(prev => [...prev, generalId]);

    const genName = INITIAL_GENERAL_POOL[generalId].name;
    const dateStr = `公元${playerStats.year}年${playerStats.month}月${playerStats.day}日`;
    const msg = {
      id: `recruit_${Date.now()}`,
      chapterId: currentChapterId,
      timestamp: dateStr,
      message: `🎴 【礼聘俊杰】主公开仓斥资 -${cost} 黄金诚挚聘请，大将【${genName}】叩拜归心，投入麾下！大名宿愿声誉 +20。`,
      type: 'gain' as const
    };
    setBattleLogs(prev => [msg, ...prev]);
  };

  // --- General combat training ---
  const handleTrainGeneral = (
    generalId: string, 
    goldCost: number, 
    statGained: 'force' | 'intelligence' | 'leadership' | 'politics' | 'virtue', 
    amount: number
  ) => {
    sfx.playDrum();
    setPlayerStats(prev => {
      const advanced = advanceTime(5, prev);
      return {
        ...prev,
        ...advanced,
        gold: Math.max(0, prev.gold - goldCost),
        prestige: prev.prestige + 5
      };
    });

    const gen = INITIAL_GENERAL_POOL[generalId];
    if (gen) {
      gen.level += 1;
      (gen as any)[statGained] = Math.min(100, (gen as any)[statGained] + amount);
      gen.loyalty = Math.min(100, gen.loyalty + 5);
    }

    const labelMap: Record<string, string> = {
      force: '武力',
      intelligence: '智力',
      leadership: '统帅',
      politics: '政治',
      virtue: '德行'
    };
    const label = labelMap[statGained] || statGained;
    const dateStr = `公元${playerStats.year}年${playerStats.month}月${playerStats.day}日`;
    const msg = {
      id: `train_${Date.now()}`,
      chapterId: currentChapterId,
      timestamp: dateStr,
      message: `💂 【三军校演】拨付 -${goldCost} 粮饷练其筋骨，贤将【${gen?.name}】于校场演训 5 日，其【${label}】属性勇增 +${amount}！忠诚高涨。`,
      type: 'gain' as const
    };
    setBattleLogs(prev => [msg, ...prev]);
  };

  // --- Honorable General Retirement ---
  const handleRetireGeneral = (
    generalId: string,
    stat: 'force' | 'intelligence' | 'leadership' | 'politics' | 'virtue',
    bonusValue: number,
    generalName: string
  ) => {
    sfx.playDrum();
    
    // Remove from recruited list
    setRecruitedGenerals(prev => prev.filter(id => id !== generalId));
    
    // Supplement PlayerStats permanently
    setPlayerStats(prev => {
      const advanced = advanceTime(5, prev); // Advancing 5 days for administrative settlement or handovers
      return {
        ...prev,
        ...advanced,
        [stat]: (prev[stat] || 0) + bonusValue
      };
    });

    const dateStr = `公元${playerStats.year}年${playerStats.month}月${playerStats.day}日`;
    const retireLog = {
      id: `retire_${Date.now()}`,
      chapterId: currentChapterId,
      timestamp: dateStr,
      message: `📜 【名将荣退】主公核发盖御宝印的退役敕令：良将【${generalName}】功成卸甲。其毕生武学造诣化为「传承红利」，永久提升主公五维：【${stat === 'force' ? '武力' : stat === 'intelligence' ? '智力' : stat === 'leadership' ? '统帅' : stat === 'politics' ? '政治' : '德行'}】 +${bonusValue}！大德浩荡！`,
      type: 'gain' as const
    };
    setBattleLogs(prev => [retireLog, ...prev]);
    showToast(`📜 【传承红利】属性永久提升 +${bonusValue}！`);
  };

  // --- Economic governance updates ---
  const handleGovAction = (
    actionType: 'RECRUIT' | 'TILLAGE' | 'RELIEF' | 'ARMAMENT',
    goldCost: number,
    statChanges: Partial<PlayerStats>,
    regionAffectedId?: string
  ) => {
    sfx.playClick();
    
    let finalStats = {
      ...playerStats,
      gold: playerStats.gold - goldCost
    };

    // Apply stats changes
    Object.keys(statChanges).forEach((key) => {
      const val = (statChanges as any)[key];
      (finalStats as any)[key] = val;
    });

    // Advance time by 10 days
    const advanced = advanceTime(10, finalStats);
    finalStats = {
      ...finalStats,
      ...advanced
    };

    setPlayerStats(finalStats);

    const rName = regions.find(r => r.id === regionAffectedId)?.name || '治下地区';
    let label = '内政治理';
    if (actionType === 'RECRUIT') label = '征召甲士';
    if (actionType === 'TILLAGE') label = '鼓励屯垦';
    if (actionType === 'RELIEF') label = '施棚开粥';
    if (actionType === 'ARMAMENT') label = '重铸兵戈';

    if (actionType === 'TILLAGE' && regionAffectedId) {
      setRegions(prev => prev.map(r => {
        if (r.id === regionAffectedId) {
          const dev = Math.min(100, r.development + 15);
          const rev = Math.floor(r.revenue * 1.25);
          return { ...r, development: dev, revenue: rev };
        }
        return r;
      }));
    }

    const dateStr = `公元${finalStats.year}年${finalStats.month}月${finalStats.day}日`;
    const msg = {
      id: `gov_${Date.now()}`,
      chapterId: currentChapterId,
      timestamp: dateStr,
      message: `🏛️ 【内政治理-${label}】于治所【${rName}】政训 10 日。划支黄金 -${goldCost}，民生风貌大变！`,
      type: 'gain' as const
    };
    setBattleLogs(prev => [msg, ...prev]);
  };

  const handleHarvestTaxes = (totalGoldHarvested: number) => {
    sfx.playFanfare(true);
    
    const term = SOLAR_TERMS_MAP[playerStats.month] || {
      name: '常规节气',
      icon: '🌍',
      description: '天时平和，税款如常。',
      marchingSpeedDays: 6,
      marchingCostGold: 25,
      harvestTaxMultiplier: 1.0,
      effectDescription: '风平浪静，行止如意'
    };

    const finalGold = Math.round(totalGoldHarvested * term.harvestTaxMultiplier);

    setPlayerStats(prev => {
      const advanced = advanceTime(3, prev);
      return {
        ...prev,
        ...advanced,
        gold: prev.gold + finalGold
      };
    });
    setTaxCooldown(true);
    
    const dateStr = `公元${playerStats.year}年${playerStats.month}月${playerStats.day}日`;
    const msg = {
      id: `tax_${Date.now()}`,
      chapterId: currentChapterId,
      timestamp: dateStr,
      message: `💰 【征纳课税】合辖各守治纳租 3 日。本期天象为【${term.name} ${term.icon}】，受天时机制“${term.effectDescription}”影响，征收比率修正为 ${Math.round(term.harvestTaxMultiplier * 100)}%，合共筹借赋款黄金 +${finalGold} （原 ${totalGoldHarvested}） 封存国库！`,
      type: 'gain' as const
    };
    setBattleLogs(prev => [msg, ...prev]);
  };

  // --- Complete Quest status rewards ---
  const handleQuestComplete = (questId: string, status: 'COMPLETED' | 'FAILED', rewards?: any, lossTroops?: number) => {
    const questData = questsList.find(q => q.id === questId) || SIDE_QUESTS_POOL.find(q => q.id === questId);
    const questTitle = questData ? questData.title : '平寇讨逆会战';

    // Add to lists
    if (status === 'COMPLETED') {
      setCompletedQuests(prev => [...prev, questId]);
      
      // Merge rewards
      let nextStats = { ...playerStats };
      if (rewards.gold) nextStats.gold += rewards.gold;
      if (rewards.troops) nextStats.troops += rewards.troops;
      if (rewards.prestige) nextStats.prestige += rewards.prestige;
      if (rewards.deviance) nextStats.deviance = Math.min(100, nextStats.deviance + rewards.deviance);
      if (rewards.intelligence) nextStats.intelligence += rewards.intelligence;
      
      const victoryCas = Math.floor(Math.random() * 45 + 15);
      nextStats.troops = Math.max(100, nextStats.troops - victoryCas);
      setPlayerStats(nextStats);

      // Faction capture on success
      if (questData) {
        setRegions(prev => prev.map(r => r.id === questData.targetRegionId ? { ...r, faction: 'PLAYER' } : r));
      }

      triggerBattleSummary(questTitle, 'VICTORY', victoryCas, Math.floor(Math.random() * 550 + 350));
    } else {
      // Deduct troops casualty on fail
      let actualLoss = lossTroops || 150;
      if (lossTroops) {
        if (activeStance === 'DEFENSIVE') {
          const saved = Math.round(lossTroops * 0.30);
          actualLoss = Math.max(0, lossTroops - saved);
          showToast(`🛡️ 【鹤翼阵·守势豁免】校勇于历练溃退时列成龟守圆阵，少折损 30% 兵马 (免折 ${saved} 人)！`);
        } else if (activeStance === 'OFFENSIVE') {
          const extra = Math.round(lossTroops * 0.15);
          actualLoss = lossTroops + extra;
          showToast(`🏹 【锋矢阵·过突溃损】校勇一味突击冒进遭遇反切，溃败中额外折多 15% 兵卒 (多折 ${extra} 人)！`);
        }

        // Apply Tactical Preference (Hidden Parameter scaling)
        const savedPref = localStorage.getItem('tk_tactical_preference') || 'ATTACK';
        let prefLogExtra = '';
        if (savedPref === 'ATTACK') {
          const attackExtra = Math.round(actualLoss * 0.10);
          actualLoss += attackExtra;
          prefLogExtra = ` (⚡ 强攻秘策：因奉行搏杀战术，战损承载额外多增 10% [多折 ${attackExtra} 人])`;
        } else if (savedPref === 'DEFEND') {
          const defendSaved = Math.round(actualLoss * 0.15);
          actualLoss = Math.max(0, actualLoss - defendSaved);
          prefLogExtra = ` (🛡️ 稳守秘策：兵马缓防列阵，额外豁免折损 15% [少折 ${defendSaved} 人])`;
        } else if (savedPref === 'AMBUSH') {
          const ambushSaved = Math.round(actualLoss * 0.05);
          actualLoss = Math.max(0, actualLoss - ambushSaved);
          prefLogExtra = ` (⚡ 偷袭秘策：奇袭回撤，兵卒减员降低 5% [少折 ${ambushSaved} 人])`;
        }

        if (prefLogExtra) {
          showToast(`🎯 【临阵意志偏好】${prefLogExtra}`);
        }

        setPlayerStats(prev => ({
          ...prev,
          troops: Math.max(100, prev.troops - actualLoss)
        }));
      }

      triggerBattleSummary(questTitle, 'DEFEAT', actualLoss, Math.floor(Math.random() * 120 + 30));
    }

    // Set Quest list node done in local state & static pool to be safe
    setQuestsList(prev => prev.map(q => {
      if (q.id === questId) {
        return { ...q, status };
      }
      return q;
    }));

    SIDE_QUESTS_POOL.forEach((q) => {
      if (q.id === questId) q.status = status;
    });
  };

  // Quick stats computed helper
  const getAltHistoryStatus = (dev: number) => {
    if (dev === 0) return { label: '符合规范信史', color: 'text-artistic-charcoal bg-artistic-cream border-artistic-charcoal/30' };
    if (dev < 25) return { label: '微弱历史偏逸', color: 'text-blue-800 bg-blue-100 border-blue-300/30' };
    if (dev < 55) return { label: '波澜云动改写', color: 'text-amber-900 bg-artistic-cream border bg-amber-500/10' };
    return { label: '逆天改命·昭雪乾坤', color: 'text-artistic-crimson bg-[#ffe4e1] border-artistic-crimson font-black' };
  };

  const altHistStatus = getAltHistoryStatus(playerStats.deviance);

  return (
    <div className="min-h-screen bg-artistic-canvas text-artistic-ink font-serif overflow-x-hidden flex flex-col justify-between scrollbar-ink p-4 md:p-8 border-[12px] md:border-[16px] border-artistic-charcoal relative">
      {/* Absolute decorative stamp style hallmark */}
      <div className="absolute bottom-16 right-16 w-16 h-16 border-4 border-artistic-crimson text-artistic-crimson flex items-center justify-center font-black leading-none text-xl transform -rotate-12 z-0 pointer-events-none opacity-25 select-none font-calligraphy">
        天命
      </div>

      {/* Header Section: Chronology and Context */}
      <div className="flex justify-between items-center border-b-2 border-artistic-charcoal pb-4 mb-6 z-10 shrink-0">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none mb-1 text-artistic-charcoal font-serif select-none">
            <span 
              onClick={() => {
                sfx.playClick();
                const nextVal = sanCount + 1;
                setSanCount(nextVal);
                if (nextVal === 3 && guoCount === 8) {
                  setShowPasswordModal(true);
                  setPasswordInput('');
                }
              }} 
              className="cursor-pointer hover:text-artistic-crimson transition-all border-b border-dashed border-transparent hover:border-artistic-crimson"
              title="三击之"
            >
              三
            </span>
            <span 
              onClick={() => {
                sfx.playClick();
                const nextVal = guoCount + 1;
                setGuoCount(nextVal);
                if (sanCount === 3 && nextVal === 8) {
                  setShowPasswordModal(true);
                  setPasswordInput('');
                }
              }} 
              className="cursor-pointer hover:text-artistic-crimson transition-all border-b border-dashed border-transparent hover:border-artistic-crimson"
              title="国八击"
            >
              國
            </span>
            <span>志 · 逆境昭雪</span>
            {/* Visual confirmation icon animation for auto-save */}
            <span className={`inline-flex items-center ml-2.5 text-[10px] md:text-xs font-serif font-bold text-emerald-800 bg-emerald-500/15 border border-emerald-600 px-2 py-0.5 rounded-none transition-all duration-500 ${
              autoSaveActive ? 'opacity-100 scale-100 animate-pulse ring-1 ring-emerald-500' : 'opacity-0 scale-95 pointer-events-none'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 mr-1 animate-[spin_2.5s_linear_infinite]" />
              <span>秘录封箱成功 (Auto-Saved)</span>
            </span>
          </h1>
          <p className="text-[10px] md:text-xs uppercase tracking-widest opacity-70 text-artistic-ink/80 font-mono">
            Chronicles of the Three Kingdoms: Altered Destiny
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Tutorial Button */}
          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              setShowTutorialModal(true);
            }}
            title="查看游戏玩法指南"
            className="p-2.5 border-2 border-artistic-charcoal bg-artistic-bg hover:bg-artistic-charcoal/10 cursor-pointer flex items-center gap-1.5 justify-center transition-all text-artistic-charcoal text-xs font-serif font-black"
          >
            <HelpCircle className="w-5 h-5 text-artistic-charcoal" />
            <span className="hidden sm:inline">玩法指南</span>
          </button>

          {/* Sounds Global Control */}
          <button
            type="button"
            onClick={() => {
              const nextVal = !soundOn;
              setSoundOn(nextVal);
              sfx.setMute(!nextVal);
              if (nextVal) {
                sfx.playDrum();
              }
            }}
            title="点击切换战鼓马蹄音效"
            className={`p-2.5 border-2 rounded-none shadow hover:bg-artistic-charcoal/10 cursor-pointer flex items-center justify-center transition-all ${
              soundOn ? 'bg-artistic-crimson/10 border-artistic-crimson text-artistic-crimson' : 'bg-artistic-bg text-artistic-charcoal border-artistic-charcoal'
            }`}
          >
            {soundOn ? <Volume2 className="w-5.5 h-5.5 text-artistic-crimson animate-pulse" /> : <VolumeX className="w-5.5 h-5.5 text-stone-400" />}
          </button>

          <div className="flex items-center gap-2.5">
            {gameState !== 'INTRO' && gameState !== 'MAIN_MENU' && (() => {
              const term = SOLAR_TERMS_MAP[playerStats.month] || {
                name: '常规节气',
                icon: '🌍',
                description: '天时平和，政令畅通。',
                effectDescription: '风平浪静，行其所事'
              };
              return (
                <div className="relative group cursor-help select-none bg-amber-50/90 border border-amber-900/45 px-2.5 py-1.5 flex items-center gap-1.5 shadow-sm text-left animate-pulse hover:animate-none">
                  <span className="text-lg leading-none">{term.icon}</span>
                  <div className="font-serif">
                    <div className="text-[9px] uppercase font-mono tracking-wider text-stone-500 leading-none">岁时岁令</div>
                    <div className="text-[11px] font-black text-[#5c0f11] mt-0.5 leading-none">{term.name}</div>
                  </div>
                  
                  {/* Tooltip Description overlay */}
                  <div className="absolute top-full right-0 mt-2 hidden group-hover:block w-[280px] bg-stone-950 p-3 text-stone-100 border-2 border-amber-600 shadow-2xl z-50 font-serif rounded-none leading-relaxed text-xs">
                    <div className="font-black text-amber-400 border-b border-stone-800 pb-1 mb-1.5 flex justify-between items-center font-calligraphy">
                      <span>{term.icon} {term.name}</span>
                      <span className="text-[9px] bg-amber-600 text-stone-950 px-1 py-0.5 font-sans leading-none font-extrabold rounded-none">天道机制</span>
                    </div>
                    <p className="text-stone-300 italic mb-2">“{term.description}”</p>
                    <div className="border-t border-stone-850 pt-1.5 text-[10.5px] text-amber-100 space-y-1">
                      <div className="font-serif font-bold">🍂 天时律赋具体改变:</div>
                      <div className="text-[10px] text-stone-300 leading-normal pl-1">{term.effectDescription}</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="text-right">
              <div className="text-sm md:text-2xl font-bold mb-1 font-serif text-artistic-charcoal">
                {(gameState === 'INTRO' || gameState === 'MAIN_MENU') ? '汉光和元年' : `公元 ${playerStats.year}年${playerStats.month}月${playerStats.day}日`}
              </div>
              <div className="text-[10px] md:text-xs tracking-widest bg-artistic-charcoal text-artistic-bg px-2.5 py-1 inline-block select-none font-mono">
                {(gameState === 'INTRO' || gameState === 'MAIN_MENU') ? '西元 177 年 · 涿郡' : `${activeChapter.num} · ${regions.find(r => r.id === playerLocation)?.name || '涿郡'}`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Game Core wrapper grid --- */}
      {gameState === 'MAIN_MENU' ? (
        <div id="main-menu-container" className="flex-1 flex items-center justify-center p-4 py-12 relative z-10 animate-fade-in animate-scale-up">
          <div className="bg-[#ebd9bc] border-[6px] border-double border-artistic-charcoal rounded-none max-w-xl w-full p-8 md:p-12 shadow-2xl relative text-center">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#3d3228_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
            
            {/* Main Menu Title */}
            <div className="pb-8 mb-8 border-b-2 border-artistic-charcoal/40 relative">
              <span className="text-[10px] bg-artistic-crimson text-artistic-bg font-mono font-bold px-3 py-1 uppercase tracking-widest block mx-auto max-w-max mb-3 animate-pulse">
                ★ 独辟异章 · 逆天而行 ★
              </span>
              <h1 className="font-calligraphy text-5xl md:text-6xl text-artistic-crimson font-black tracking-wide leading-tight" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.15)' }}>
                三国逆天改命录
              </h1>
              <p className="text-xs text-stone-700 font-serif mt-3 italic tracking-widest font-bold">
                —— 重写历史编年 · 宏大文字战略 RPG ——
              </p>
            </div>

            {/* Menu Buttons Grid */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  sfx.playClick();
                  // Reset talent and builder stats to standard if starting new
                  setSelectedTalent('none');
                  setGameState('INTRO');
                }}
                className="w-full bg-artistic-charcoal hover:bg-artistic-crimson text-artistic-bg py-4 px-6 rounded-none font-serif font-black text-sm tracking-widest transition-all duration-300 shadow-md border-2 border-transparent hover:border-artistic-bg flex items-center justify-center gap-3 cursor-pointer group"
              >
                <span className="w-5 h-5 border border-artistic-bg flex items-center justify-center font-bold text-xs shrink-0 bg-transparent group-hover:border-[#ede0c5]">
                  甲
                </span>
                <span>🎬 开启故事新篇 (故事模式)</span>
              </button>

              {localStorage.getItem(SAVE_KEY) && (
                <button
                  type="button"
                  onClick={() => {
                    sfx.playClick();
                    loadGame();
                  }}
                  className="w-full bg-artistic-cream border-2 border-artistic-charcoal hover:bg-artistic-charcoal hover:text-artistic-bg text-artistic-charcoal py-4 px-6 rounded-none font-serif font-black text-sm tracking-widest transition-all duration-300 shadow-md flex items-center justify-center gap-3 cursor-pointer"
                >
                  📖 班师恢复大业 (继续昨日)
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  sfx.playClick();
                  setGameState('ACHIEVEMENTS');
                }}
                className="w-full bg-[#f4ebd0] border-2 border-[#8c7e6c] hover:bg-amber-100 text-[#5c0f11] py-4 px-6 rounded-none font-serif font-black text-sm tracking-widest transition-all duration-300 shadow-md flex items-center justify-center gap-3 cursor-pointer group"
              >
                🏅 登临「成就殿堂」
              </button>

              {/* Multi-run inheritance display */}
              <div className="bg-artistic-bg border border-artistic-charcoal/20 p-4 rounded-none text-left font-serif">
                <h4 className="font-black text-xs text-artistic-charcoal border-b border-artistic-charcoal/10 pb-1 mb-2 flex justify-between items-center">
                  <span>🏅 薪火相传 · 天理传承档案</span>
                  {sssBonusPoints > 0 && (
                    <span className="text-[10px] text-amber-700 font-black animate-pulse">宿命大觉醒 ★</span>
                  )}
                </h4>
                <div className="flex justify-between items-center text-xs text-stone-800">
                  <span>已累积多周目 SSS 评价加成：</span>
                  <span className="font-mono text-sm font-black text-artistic-crimson bg-[#ede0c5] px-2 py-0.5 border border-dashed border-artistic-crimson/30">
                    +{sssBonusPoints} 底子点数
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 mt-2 leading-relaxed italic">
                  每次完结结算达成 【SSS】 评价即可在下世起点获额外 <span className="text-artistic-crimson font-bold">+18</span> 底子点数！(可重复多周目累加，生生不灭)
                </p>
                
                {/* Local JSON Save import/export suite */}
                <div className="mt-4 pt-3 border-t border-stone-300 grid grid-cols-2 gap-2 text-center">
                  <button
                    type="button"
                    onClick={exportGameSave}
                    className="py-1.5 px-2 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-500 text-xs font-bold font-serif transition-colors rounded-none flex items-center justify-center gap-1 cursor-pointer"
                  >
                    📤 导出传承大册
                  </button>
                  <button
                    type="button"
                    onClick={() => importFileRef.current?.click()}
                    className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-500 text-xs font-bold font-serif transition-colors rounded-none flex items-center justify-center gap-1 cursor-pointer"
                  >
                    📥 导入传承大册
                  </button>
                </div>

                {sssBonusPoints > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmBox({
                        message: "确定要洗去在野累积的所有多周目 SSS 天赋加成吗？此操作不可逆，会洗白回到初始 30 属性点限制。",
                        onConfirm: () => {
                          localStorage.removeItem('three_kingdoms_sss_bonus_points');
                          setSssBonusPoints(0);
                          setCreationPoints(30);
                          showToast("📿 已洗去天道造化，大业归零尘土。");
                        }
                      });
                    }}
                    className="mt-3 text-[9px] font-sans text-stone-500 hover:text-artistic-crimson hover:underline bg-transparent border-0 cursor-pointer p-0 block"
                  >
                    [ ⚠️ 清空天道造化传承 ]
                  </button>
                )}
              </div>
            </div>

            {/* Footer Credits */}
            <div className="text-[10px] text-stone-500 font-serif mt-8 opacity-75">
              天命莫测，重写定数。三国乱世起，群星逆改。
            </div>
          </div>
        </div>
      ) : gameState === 'INTRO' ? (
        /* Intro screen styling parchment */
        <div id="intro-screen-parchment" className="flex-1 flex items-center justify-center p-4 py-8 relative z-10">
          <div className="bg-artistic-cream border-4 border-artistic-charcoal rounded-none max-w-2xl w-full p-6 md:p-10 shadow-lg relative animate-scale-up">
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#3d3228_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
            
            {/* Ink wash top banner */}
            <div className="text-center pb-6 border-b-2 border-artistic-charcoal mb-6 relative">
              <h1 className="font-calligraphy text-4xl md:text-5xl text-artistic-crimson font-bold tracking-wide">
                三国逆天改命录
              </h1>
              <p className="text-sm text-artistic-charcoal font-serif mt-2 italic tracking-widest">
                —— 乱世宏章 · 重写历史文字战略RPG ——
              </p>
            </div>

            {/* Quick action cache check */}
            {localStorage.getItem(SAVE_KEY) && (
              <div className="mb-6 bg-artistic-bg border-2 border-artistic-charcoal p-4 rounded-none flex items-center justify-between shadow-inner">
                <div className="text-left">
                  <h4 className="text-artistic-ink font-serif font-black text-sm">存取在朝旧大业</h4>
                  <p className="text-artistic-charcoal opacity-80 text-[10.5px]">检测到有未尽的宏伟统一伟业，主公可随时班师归朝。</p>
                </div>
                <button
                  type="button"
                  onClick={loadGame}
                  className="bg-artistic-charcoal hover:bg-artistic-crimson text-artistic-bg rounded-none px-4 py-2 font-serif font-bold text-xs transition duration-250 cursor-pointer shadow"
                >
                  班师归朝
                </button>
              </div>
            )}

            {/* Form Character creation */}
            <form onSubmit={handleStartCampaign} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-serif font-bold text-artistic-charcoal mb-1.5 uppercase">
                    主公之大名：
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    placeholder="如：赵云龙、诸葛卧天"
                    value={playerStats.name}
                    onChange={(e) => setPlayerStats(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-artistic-bg border border-artistic-charcoal rounded-none px-4 py-2.5 text-artistic-ink font-serif font-medium text-sm focus:ring-1 focus:ring-artistic-crimson focus:outline-none placeholder-stone-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif font-bold text-artistic-charcoal mb-1.5 uppercase">
                    表字（如玄德、云长）：
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="如：子云"
                    value={playerStats.courtesyName}
                    onChange={(e) => setPlayerStats(prev => ({ ...prev, courtesyName: e.target.value }))}
                    className="w-full bg-artistic-bg border border-artistic-charcoal rounded-none px-4 py-2.5 text-artistic-ink font-serif font-medium text-sm focus:ring-1 focus:ring-artistic-crimson focus:outline-none placeholder-stone-400"
                  />
                </div>
              </div>

              {/* Difficulty Selector */}
              <div>
                <label className="block text-xs font-serif font-bold text-artistic-charcoal mb-2 uppercase tracking-wider">
                  策定乱世难度 (调整初始粮草、兵员以及后续剧情属性检定门槛)：
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'easy', label: '割据一方 (容易)', desc: '初始 2000 精兵、1000 黄金；属性判定要求降低 10 点' },
                    { id: 'normal', label: '群雄并起 (普通)', desc: '初始 1200 精兵、500 黄金；标准判定门槛' },
                    { id: 'hard', label: '白手起兵 (困难)', desc: '初始 750 精兵、250 黄金；属性判定要求提高 10 点' }
                  ].map((diff) => (
                    <button
                      key={diff.id}
                      type="button"
                      onClick={() => {
                        sfx.playClick();
                        setPlayerStats(prev => ({ ...prev, difficulty: diff.id as any }));
                      }}
                      className={`text-left p-3 border rounded-none transition-all cursor-pointer ${
                        playerStats.difficulty === diff.id
                          ? 'border-[2px] border-artistic-crimson bg-artistic-crimson/5 text-artistic-crimson ring-1 ring-artistic-crimson/20'
                          : 'border-artistic-charcoal/40 bg-artistic-bg text-artistic-charcoal hover:bg-stone-100'
                      }`}
                    >
                      <div className="font-bold text-xs">{diff.label}</div>
                      <div className="text-[9px] opacity-85 mt-1 font-serif leading-tight">{diff.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Campaign start selector talent */}
              <div>
                <label className="block text-xs font-serif font-bold text-artistic-charcoal mb-2 uppercase tracking-wider">
                  赋予主公天命大命盘 (初始天赋选择，增减点数直接在开局生效)：
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { 
                      id: 'none', 
                      label: '凡人俗子 (普通)', 
                      desc: '平平稳稳。起步不受各命盘特质与德行增减微调影响。' 
                    },
                    { 
                      id: 'renyi', 
                      label: '😇 仁义之君 (德行 +15)', 
                      desc: '德行(Virtue)开局额外+15，名声+50，初始赠送+150精兵起跑。' 
                    },
                    { 
                      id: 'baonve', 
                      label: '😈 暴虐无道 (德行 -15 / 武力 +15)', 
                      desc: '德行(Virtue)开局-15，武力开局高增+15，初始劫掠府库+500黄金。' 
                    }
                  ].map((talent) => (
                    <button
                      key={talent.id}
                      type="button"
                      onClick={() => {
                        sfx.playClick();
                        setSelectedTalent(talent.id as any);
                      }}
                      className={`text-left p-3 border rounded-none transition-all cursor-pointer ${
                        selectedTalent === talent.id
                          ? 'border-[2px] border-artistic-crimson bg-artistic-crimson/5 text-artistic-crimson ring-1 ring-artistic-crimson/20'
                          : 'border-artistic-charcoal/40 bg-artistic-bg text-artistic-charcoal hover:bg-stone-100'
                      }`}
                    >
                      <div className="font-bold text-xs">{talent.label}</div>
                      <div className="text-[9px] opacity-85 mt-1 font-serif leading-tight">{talent.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Character stats distributor */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold font-serif text-artistic-charcoal tracking-wide uppercase">
                    分配主公将星属性：
                  </h3>
                  <div className="flex flex-col items-end">
                    <span className="text-xs bg-artistic-crimson/10 text-artistic-crimson font-bold font-mono px-2.5 py-0.5 border border-artistic-crimson/20">
                      可分配底子点数: {creationPoints}
                    </span>
                    {sssBonusPoints > 0 && (
                      <span className="text-[9px] text-amber-800 font-serif font-black mt-1">
                        (含周目 SSS 评价传承: +{sssBonusPoints})
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-artistic-bg p-4 border border-artistic-charcoal shadow-inner">
                  {/* Stats list sliders */}
                  {[
                    { id: 'force', label: '武力 (决斗将战)', desc: '影响剧情单挑武力要求' },
                    { id: 'intelligence', label: '智力 (军略计画)', desc: '降低军策失陷概率，解奇遇' },
                    { id: 'leadership', label: '统帅 (排兵移调)', desc: '提征并新兵效率，减少伤受' },
                    { id: 'politics', label: '政治 (经营开荒)', desc: '高低屯金收入提拔' },
                    { id: 'virtue', label: '德行 (声誉名义)', desc: '利于招募在野名士，得民心' }
                  ].map((s) => (
                    <div key={s.id} className="flex justify-between items-center border-b border-artistic-charcoal/20 py-1.5">
                      <div>
                        <span className="font-serif font-bold text-xs text-artistic-ink">{s.label}</span>
                        <span className="block text-[9px] text-artistic-charcoal opacity-75 font-serif">{s.desc}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleStatAdjust(s.id as any, false)}
                          className="w-7 h-7 bg-artistic-charcoal/10 hover:bg-artistic-charcoal hover:text-artistic-bg text-artistic-ink font-bold font-mono text-center flex items-center justify-center border border-artistic-charcoal/30 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-bold font-mono text-artistic-charcoal">
                          {builderStats[s.id as keyof typeof builderStats]}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleStatAdjust(s.id as any, true)}
                          className="w-7 h-7 bg-artistic-charcoal/10 hover:bg-artistic-charcoal hover:text-artistic-bg text-artistic-ink font-bold font-mono text-center flex items-center justify-center border border-artistic-charcoal/30 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Campaign Button */}
              <button
                type="submit"
                className="w-full bg-artistic-charcoal hover:bg-artistic-crimson text-artistic-bg py-3.5 px-6 rounded-none font-serif font-bold text-sm tracking-widest shadow transition-colors duration-200 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span className="w-5 h-5 border border-artistic-bg flex items-center justify-center font-bold text-xs shrink-0 bg-transparent group-hover:border-[#ede0c5]">
                  甲
                </span>
                <span className="font-bold">秉誓：率义兵踏平乱世！</span>
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* --- Game core active frame --- */
        <div id="active-game-board" className="w-full flex-1 flex flex-col justify-between space-y-5 z-10">
          
          {/* Main callout HUD bar */}
          <div className="bg-artistic-cream border-2 border-artistic-charcoal p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center shadow-sm">
            {/* Identity node */}
            <div 
              onClick={() => setShowPlayerModal(true)}
              className="border-r border-artistic-charcoal/25 pr-2 group cursor-pointer hover:bg-artistic-charcoal/5 p-1 transition-all duration-200 rounded-none border border-dashed border-transparent hover:border-artistic-charcoal/25 relative"
              title="点击打开主公个人底案，查阅五围天资与等级大印"
            >
              <div className="font-serif text-[9.5px] text-stone-500 uppercase flex justify-between items-center">
                <span>麾下名主 (点击阅览) 🔍</span>
              </div>
              <h2 className="font-serif font-black text-[#5c0f11] text-base tracking-wider group-hover:underline flex items-center gap-1">
                👑 {playerStats.name}
              </h2>
              <span className="text-[9.5px] bg-artistic-charcoal text-[#f2e6d0] px-1.5 py-0.5 mt-0.5 inline-block font-serif font-bold leading-none transform group-hover:scale-105 transition-all">
                字 {playerStats.courtesyName}
              </span>
            </div>

            {/* Troops node */}
            <div className="border-r border-artistic-charcoal/25 pr-2">
              <div className="font-serif text-[10.5px] text-artistic-charcoal/80 uppercase">中营精锐兵卒：</div>
              <div className="font-mono font-bold text-artistic-crimson text-lg flex items-center gap-1.5 animate-scrolling">
                <Users className="w-4 h-4 text-artistic-crimson" />
                <AnimatedCounter value={playerStats.troops} suffix="人" />
              </div>
            </div>

            {/* Gold node */}
            <div className="border-r border-artistic-charcoal/25 pr-2">
              <div className="font-serif text-[10.5px] text-artistic-charcoal/80 uppercase">库府钱粮储备：</div>
              <div className="font-mono font-bold text-artistic-ink text-lg flex items-center gap-1.5 animate-scrolling">
                <Coins className="w-4.5 h-4.5 text-artistic-charcoal/80" />
                <AnimatedCounter value={playerStats.gold} suffix="金" />
              </div>
            </div>

            {/* Year / Prestige HUD */}
            <div className="border-r border-artistic-charcoal/25 pr-2">
              <div className="font-serif text-[10.5px] text-artistic-charcoal/80 uppercase">中兴声威威名：</div>
              <div className="font-serif font-extrabold text-artistic-ink text-sm flex items-center gap-1 mt-0.5">
                👑 声誉: {playerStats.prestige}
              </div>
            </div>

            {/* Deviants Timeline Gauges */}
            <div className="col-span-2 md:col-span-1">
              <div className="font-serif text-[10.5px] text-artistic-charcoal/80 uppercase mb-0.5">青史偏逸轨迹：</div>
              <div className="w-full bg-[#d0c2aa] h-2 rounded-none overflow-hidden mb-1">
                <div 
                  className="bg-artistic-crimson h-full transition-all duration-500" 
                  style={{ width: `${playerStats.deviance}%` }}
                ></div>
              </div>
              <span className={`text-[9.5px] font-bold px-1.5 py-0.5 border ${
                playerStats.deviance > 0 
                  ? 'text-artistic-crimson bg-[#ede0c5] border-artistic-crimson/30' 
                  : 'text-artistic-charcoal bg-[#ede0c5] border-artistic-charcoal/30'
              }`}>
                【{altHistStatus.label}】
              </span>
            </div>
          </div>

          {/* Tab Selection controller Bar */}
          <div className="flex border-b-2 border-artistic-charcoal pb-2 mb-2 flex-wrap gap-2">
            {[
              { id: 'STORY', label: '📖 史册主线', desc: '推进西元三国纪事' },
              { id: 'MAP', label: '🗺️ 天下舆图', desc: '据点调兵及州牧出征' },
              { id: 'GOV', label: '🌾 内政经营', desc: '招兵买马开发民生' },
              { id: 'ROSTER', label: '🎴 幕府将佐', desc: '招募良将校场训练' },
              { id: 'TRAINING', label: '🏋️ 校场修文', desc: '练武锤骨读书明理' },
              { id: 'DIPLOMACY', label: '🤝 诸盟外交', desc: '纵横捭阖赠聘交谊' },
              { id: 'RANDOM_EVENTS', label: '🌠 寻访奇遇', desc: '探机缘博弈属性' },
              { id: 'CIVILIAN_MODS', label: '🔌 民间模组', desc: '创造并装载同人补丁' },
              { id: 'SIDE_QUESTS', label: '⚔️ 奇遇演义', desc: '平黄巾寇塞外奇劫' },
              { id: 'ARCHIVE', label: '📜 昭雪史册', desc: '对照历史更迭日志' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setGameState(tab.id as any)}
                className={`py-2 px-3 rounded-none font-serif font-bold text-xs border-2 transition-all flex flex-col items-center justify-center cursor-pointer ${
                  gameState === tab.id
                    ? 'bg-artistic-charcoal border-artistic-charcoal text-artistic-bg font-bold shadow-sm'
                    : 'bg-artistic-bg border-artistic-charcoal text-artistic-ink hover:bg-artistic-cream'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[9px] font-normal opacity-70 select-none hidden xl:inline">{tab.desc}</span>
              </button>
            ))}
          </div>

          {/* Output dynamic active state subpanel layout */}
          <div className="transition-all animate-fade-in flex-1">
            {gameState === 'STORY' && (
              /* Story Screen layout split panels */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active story dialogue scene */}
                <div className="lg:col-span-2 bg-artistic-bg border-4 border-artistic-charcoal rounded-none p-6 shadow-md flex flex-col justify-between min-h-[460px]">
                  <div>
                    {/* Scene header titles */}
                    <div className="border-b border-artistic-charcoal pb-3 mb-4 flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <span className="text-[10.5px] font-serif font-bold text-artistic-crimson bg-artistic-crimson/10 border border-artistic-crimson/30 px-2 py-0.5">
                          {activeChapter.num} : {activeChapter.title} ({activeChapter.period})
                        </span>
                        <h3 className="font-serif font-black text-xl md:text-2xl text-artistic-charcoal mt-2">
                          {activeScene.title}
                        </h3>
                      </div>
                      <div className="text-right text-xs text-artistic-charcoal font-mono opacity-80">
                        主线纪元纪事栏 · 智略天命交汇处
                      </div>
                    </div>

                    {/* Plot details text scroll */}
                    <div className="bg-artistic-cream border-l-4 border-artistic-crimson p-6 block leading-relaxed text-artistic-ink text-sm md:text-base font-serif italic mb-6 shadow-inner max-h-[220px] overflow-y-auto scrollbar-ink">
                      <p className="indent-6 text-artistic-ink">{activeScene.narration}</p>
                    </div>

                     {/* History actual real detail comparisons */}
                    <div className="bg-artistic-cream/60 p-3 rounded-none border border-artistic-charcoal/20 text-[11.5px] text-artistic-charcoal opacity-95 font-serif leading-relaxed mb-4">
                      <strong className="text-artistic-crimson block mb-0.5 font-bold">【大青史同轨底案对比】</strong>
                      {activeScene.historicalFact}
                    </div>

                    {/* Historical Trivia Tip Box */}
                    {(() => {
                      const trivia = getTriviaForScene(activeScene.id, activeScene.narration);
                      return (
                        <div className="bg-amber-50/60 border-t-2 border-b-2 border-amber-900/40 py-2.5 px-3 text-[11px] text-[#4a3525] font-serif leading-relaxed mb-6 flex gap-2 w-full">
                          <span className="text-base leading-none select-none shrink-0">📜</span>
                          <div>
                            <span className="font-serif font-black text-amber-950 block mb-0.5 text-[11.5px] tracking-wide">
                              {trivia.title}
                            </span>
                            <span className="text-stone-700">{trivia.content}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Operational Decision selection matrix */}
                  <div className="border-t border-artistic-charcoal pt-4">
                    {/* Active focus stance warning card */}
                    {activeTrick && (
                      <div className="mb-4 bg-[#8b0000]/5 border-2 border-artistic-crimson p-3 font-serif rounded-none flex items-start gap-2.5 animate-pulse">
                        <span className="text-lg leading-none shrink-0 text-artistic-crimson">⚔️</span>
                        <div className="text-[11.5px] text-artistic-crimson">
                          <p className="font-bold">『{activeTrick === 'backwater' ? '背水一战' : '金蝉脱壳'}』战役奇谋推演中（专注余息 {trickSecondsLeft} 秒）</p>
                          <p className="text-stone-700 mt-0.5 leading-snug">主师正处于极限的局部微指挥（Micro-focus）状态，此时战线危急，已暂时切断宏观主线玺令。请等待专注完毕后继续决策！</p>
                        </div>
                      </div>
                    )}

                    {storyTimer !== null && !activeTrick && (
                      <div className="mb-4 bg-[#5c0f11]/5 border border-[#5c0f11]/30 p-2.5 text-xs font-serif text-artistic-charcoal flex justify-between items-center bg-artistic-cream rounded-none animate-pulse">
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className="text-sm">🗣️</span>
                          <span className="text-artistic-crimson">军情十万火急！火速行决策印发，对策余息：</span>
                        </div>
                        <div className="font-mono text-xs md:text-sm font-black text-[#5c0f11] bg-white px-2 py-0.5 border border-[#5c0f11]/40">
                          ⏱️ {storyTimer}s
                        </div>
                      </div>
                    )}

                    <h4 className="text-xs font-serif font-bold text-artistic-crimson mb-3 tracking-widest uppercase">
                      ♟️ 主公，请即刻布发军策玺令对策：
                    </h4>
                    
                    {activeScene.options && activeScene.options.length > 0 ? (
                      <div>
                        {(() => {
                          const OPTIONS_PER_PAGE = 3;
                          const totalOptions = activeScene.options.length;
                          const totalPages = Math.ceil(totalOptions / OPTIONS_PER_PAGE);
                          const startIndex = optionPage * OPTIONS_PER_PAGE;
                          const paginatedOptions = activeScene.options.slice(startIndex, startIndex + OPTIONS_PER_PAGE);

                          return (
                            <>
                              <div className="space-y-3">
                                {paginatedOptions.map((opt, oIdx) => {
                                  const globalIdx = startIndex + oIdx;
                                  const hasReq = opt.requirement !== undefined;
                                  const symbols = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
                                  const symbol = symbols[globalIdx] || '癸';
                                  
                                  return (
                                    <button
                                      key={opt.id}
                                      disabled={activeTrick !== null}
                                      onClick={() => handleOptionSelect(opt)}
                                      className={`w-full text-left bg-artistic-bg border-2 border-artistic-charcoal hover:bg-[#ede0c5]/25 p-3 text-xs md:text-sm tracking-wide font-serif transition-all duration-200 flex items-center relative rounded-none group ${
                                        activeTrick !== null
                                          ? 'opacity-40 cursor-not-allowed select-none'
                                          : 'cursor-pointer'
                                      }`}
                                    >
                                      <span className="w-8 h-8 border border-artistic-charcoal flex items-center justify-center mr-4 font-bold shrink-0 text-artistic-charcoal bg-artistic-bg group-hover:bg-artistic-crimson group-hover:text-white transition-colors duration-250">
                                        {symbol}
                                      </span>
                                      <div className="flex-1 flex flex-col justify-center">
                                        <div className="flex justify-between items-center pr-2 mb-1 flex-wrap gap-1">
                                          <span className="font-bold text-artistic-ink leading-normal text-xs md:text-[13px]">
                                            {opt.text}
                                          </span>
                                          {hasReq && opt.requirement && (
                                            <span className="text-[9px] text-artistic-crimson bg-artistic-crimson/10 border border-artistic-crimson/20 rounded px-1.5 py-0.5 shrink-0 font-bold ml-1">
                                              【判定: {
                                                opt.requirement.attribute === 'force' ? '武勇' :
                                                opt.requirement.attribute === 'intelligence' ? '智谋' :
                                                opt.requirement.attribute === 'leadership' ? '指挥' :
                                                opt.requirement.attribute === 'prestige' ? '声望' :
                                                opt.requirement.attribute === 'virtue' ? '德行' : '数值'
                                              } ≥ {opt.requirement.minVal || 0}】
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-[10px] text-stone-500 font-serif leading-relaxed flex items-center gap-1">
                                          {getEvaluationHint(opt)}
                                        </div>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Option pagination footer */}
                              {totalPages > 1 && (
                                <div className="flex justify-between items-center mt-4 pt-2.5 border-t border-dashed border-artistic-charcoal/20">
                                  <button
                                    type="button"
                                    disabled={optionPage <= 0}
                                    onClick={() => { sfx.playClick(); setOptionPage(prev => Math.max(0, prev - 1)); }}
                                    className={`px-3 py-1.5 text-xs font-serif font-bold border border-artistic-charcoal transition-all flex items-center gap-1 ${
                                      optionPage <= 0
                                        ? 'text-stone-400 bg-stone-100 border-stone-200 cursor-not-allowed'
                                        : 'text-[#5c0f11] bg-artistic-cream hover:bg-[#ede0c5]/75 hover:border-artistic-crimson cursor-pointer'
                                    }`}
                                  >
                                    ◀️ 上一页 (Prev Case)
                                  </button>
                                  <span className="text-[10.5px] font-sans font-black text-artistic-charcoal bg-artistic-cream/40 px-3 py-1 border border-artistic-charcoal/30">
                                    对策第 {optionPage + 1} / {totalPages} 页
                                  </span>
                                  <button
                                    type="button"
                                    disabled={optionPage >= totalPages - 1}
                                    onClick={() => { sfx.playClick(); setOptionPage(prev => Math.min(totalPages - 1, prev + 1)); }}
                                    className={`px-3 py-1.5 text-xs font-serif font-bold border border-artistic-charcoal transition-all flex items-center gap-1 ${
                                      optionPage >= totalPages - 1
                                        ? 'text-stone-400 bg-stone-100 border-stone-200 cursor-not-allowed'
                                        : 'text-[#5c0f11] bg-artistic-cream hover:bg-[#ede0c5]/75 hover:border-artistic-crimson cursor-pointer'
                                    }`}
                                  >
                                    下一页 (Next Case) ▶️
                                  </button>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-xs text-artistic-charcoal opacity-60 italic">
                        主线大结局已底定。可在“昭雪史册”中查阅你撰写的天下纪事本草！
                      </div>
                    )}
                  </div>
                </div>

                {/* Immersive right-side panels */}
                <div id="story-archive-sidebar" className="flex flex-col gap-4">
                  
                  {/* Battle Logs Side Panel */}
                  <div className={`bg-artistic-bg border-4 border-artistic-charcoal rounded-none p-5 shadow-sm flex flex-col justify-between min-h-[300px] transition-all duration-350 ${
                    battleLogAnim === 'shake' ? 'animate-combat-shake border-artistic-crimson' : 
                    battleLogAnim === 'flash' ? 'animate-combat-flash border-emerald-600' : ''
                  }`}>
                    <div>
                      <div className="border-b border-artistic-charcoal pb-3 mb-3 flex justify-between items-center">
                        <h3 className="font-serif font-bold text-base text-artistic-charcoal flex items-center gap-1.5">
                          <Swords className="w-5 h-5 text-artistic-crimson" />
                          三军战役志 (Battle Log)
                        </h3>
                        <span className="text-[9px] bg-artistic-crimson text-artistic-bg px-2 py-0.5 font-bold animate-pulse">
                          实时校阅
                        </span>
                      </div>
                      
                      <p className="text-[10px] text-artistic-charcoal opacity-80 font-serif mb-2 leading-tight">
                        记录由于主公决策折损、敌军歼灭、精锐纳兵与征赋进度：
                      </p>

                      {/* Dynamic Battle Log Filter Buttons */}
                      <div className="flex flex-wrap gap-1.5 mb-2.5 pb-2 border-b border-stone-200">
                        {[
                          { id: 'all', label: '全部' },
                          { id: 'action', label: '军务' },
                          { id: 'casualty', label: '兵损☠️' },
                          { id: 'gain', label: '资益🌾' },
                          { id: 'random_event', label: '奇遇🌠' }
                        ].map((filterItem) => (
                          <button
                            key={filterItem.id}
                            onClick={() => { sfx.playClick(); setBattleLogFilter(filterItem.id as any); }}
                            className={`px-2 py-1 text-[10px] font-serif border font-bold transition-all cursor-pointer ${
                              battleLogFilter === filterItem.id
                                ? 'bg-artistic-charcoal border-artistic-charcoal text-[#ede0c5]'
                                : 'bg-transparent border-stone-300 text-stone-600 hover:bg-stone-100'
                            }`}
                          >
                            {filterItem.label}
                          </button>
                        ))}
                      </div>

                      {/* --- 战场特技 栏 (Battlefield Stance Commands) --- */}
                      <div className="mb-3.5 pb-3 border-b border-dashed border-stone-200">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-stone-700 bg-amber-100/30 px-1.5 py-0.5 border border-dashed border-amber-300 font-serif">
                            ⚡ 战场指挥官特技 / Dynamic Tactics
                          </span>
                          {activeTrick && (
                            <span className="text-[9px] text-[#8b0000] bg-[#8b0000]/10 border border-[#8b0000]/20 font-bold px-1.5 py-0.5 animate-pulse font-mono">
                              执令中: {trickSecondsLeft}秒
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <button
                            type="button"
                            disabled={activeTrick !== null && activeTrick !== 'backwater'}
                            onClick={handleBackwaterTrick}
                            className={`px-2 py-1.5 text-[11px] border font-serif font-black flex flex-col items-center justify-center transition-all relative overflow-hidden ${
                              activeTrick === 'backwater'
                                ? 'bg-artistic-crimson border-artistic-crimson text-white animate-pulse'
                                : activeTrick !== null
                                ? 'bg-stone-100 border-stone-250 text-stone-400 cursor-not-allowed opacity-50'
                                : 'bg-transparent hover:bg-artistic-crimson/10 border-artistic-crimson/30 text-artistic-crimson hover:border-artistic-crimson cursor-pointer shadow-xs'
                            }`}
                            title="提升武勇并加注局部战损吸收，但将在6秒内专注防守而锁闭玺令"
                          >
                            {activeTrick === 'backwater' && (
                              <div 
                                className="absolute left-0 bottom-0 top-0 bg-red-950/45 transition-all duration-100 ease-linear pointer-events-none" 
                                style={{ width: `${trickCooldown}%` }}
                              />
                            )}
                            <span className="font-serif relative z-10">
                              {activeTrick === 'backwater' ? '🌊 背水一战 (施计中)' : '🌊 背水一战'}
                            </span>
                            <span className="text-[8px] font-normal opacity-75 mt-0.5 relative z-10">
                              {activeTrick === 'backwater' ? `⌛ 剩余 ${trickSecondsLeft} 秒` : '置之死地 (武勇 +2)'}
                            </span>
                          </button>

                          <button
                            type="button"
                            disabled={activeTrick !== null && activeTrick !== 'cicada'}
                            onClick={handleCicadaTrick}
                            className={`px-2 py-1.5 text-[11px] border font-serif font-black flex flex-col items-center justify-center transition-all relative overflow-hidden ${
                              activeTrick === 'cicada'
                                ? 'bg-emerald-700 border-emerald-700 text-white animate-pulse'
                                : activeTrick !== null
                                ? 'bg-stone-100 border-stone-250 text-stone-400 cursor-not-allowed opacity-50'
                                : 'bg-transparent hover:bg-emerald-700/15 border-emerald-800/30 text-emerald-800 hover:border-emerald-700 cursor-pointer shadow-xs'
                            }`}
                            title="奇袭诱敌，稳步撤退并召回散兵辎重，但将在6秒内专注潜行而锁闭玺令"
                          >
                            {activeTrick === 'cicada' && (
                              <div 
                                className="absolute left-0 bottom-0 top-0 bg-emerald-900/45 transition-all duration-100 ease-linear pointer-events-none" 
                                style={{ width: `${trickCooldown}%` }}
                              />
                            )}
                            <span className="font-serif relative z-10">
                              {activeTrick === 'cicada' ? '🕊️ 金蝉脱壳 (施计中)' : '🕊️ 金蝉脱壳'}
                            </span>
                            <span className="text-[8px] font-normal opacity-75 mt-0.5 relative z-10">
                              {activeTrick === 'cicada' ? `⌛ 剩余 ${trickSecondsLeft} 秒` : '分幡疑敌 (兵马 +200)'}
                            </span>
                          </button>
                        </div>

                        {/* Cooldown Progress Bar */}
                        {activeTrick && (
                          <div className="bg-stone-200 border border-stone-300 w-full h-[18px] relative overflow-hidden transition-all duration-300">
                            <div
                              className={`h-full transition-all duration-100 ease-linear ${
                                activeTrick === 'backwater' ? 'bg-artistic-crimson/80' : 'bg-emerald-600/80'
                              }`}
                              style={{ width: `${trickCooldown}%` }}
                            ></div>
                            <span className="absolute inset-0 text-[9px] font-serif font-black text-center flex items-center justify-center text-stone-850 leading-none">
                              ⏳ 阵法持续剩余 {trickSecondsLeft} 秒 (专注冷却中)
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-ink">
                        {battleLogs
                          .filter(log => log.chapterId === currentChapterId || log.id === 'init_log')
                          .filter(log => battleLogFilter === 'all' || log.type === battleLogFilter)
                          .length > 0 ? (
                          battleLogs
                            .filter(log => log.chapterId === currentChapterId || log.id === 'init_log')
                            .filter(log => battleLogFilter === 'all' || log.type === battleLogFilter)
                            .map((log) => {
                              let bgStyle = "bg-stone-50 border-stone-200 text-stone-900 border-l-2 border-l-stone-500";
                              if (log.type === 'casualty') bgStyle = "bg-red-50/90 border-red-300 text-red-950 border-l-2 border-l-artistic-crimson";
                              if (log.type === 'gain') bgStyle = "bg-[#f4fcf4] border-emerald-300 text-emerald-950 border-l-2 border-l-emerald-600";
                              if (log.type === 'random_event') bgStyle = "bg-yellow-50/90 border-amber-300 text-amber-950 border-l-2 border-l-amber-600";
                              
                              return (
                                <div key={log.id} className={`p-2 border text-[11px] leading-relaxed font-serif ${bgStyle}`}>
                                  <div className="flex justify-between items-center text-[9px] opacity-75 font-mono mb-1 font-bold">
                                    <span>{log.timestamp}</span>
                                    <span className="bg-white/60 px-1 border border-stone-300/30 scale-90">
                                      {log.type === 'casualty' ? '战损' : log.type === 'gain' ? '辎重纳新' : log.type === 'random_event' ? '奇遇' : '军事令'}
                                    </span>
                                  </div>
                                  <p className="font-serif text-[10.5px] leading-snug">{log.message}</p>
                                </div>
                              );
                            })
                        ) : (
                          <div className="text-center py-6 text-xs text-artistic-charcoal opacity-60 italic">
                            筛选分类下暂无对应事件交锋
                          </div>
                        )}
                      </div>

                      {/* At-a-glance military & fiscal attrition summary panel */}
                      {(() => {
                        let troopsLost = 0;
                        let troopsGained = 0;
                        let goldSpent = 0;
                        let goldGained = 0;

                        // Calculate totals specifically for the current chapter
                        const logs = battleLogs.filter(log => log.chapterId === currentChapterId);
                        logs.forEach(log => {
                          const msg = log.message;

                          // Troops lost regex allowing optional signs
                          const lossTroopMatch = msg.match(/(?:折损|战损|损兵|扣除|兵力减少|伤亡|损兵折将|折损兵马|兵力\s*-\s*|军旅折损\s*-\s*|兵卒\s*-\s*|军卒折损\s*-\s*|减少)\s*[-]?\s*(\d+)/);
                          if (lossTroopMatch) {
                            troopsLost += parseInt(lossTroopMatch[1], 10);
                          } else if (msg.includes('减少') && msg.includes('兵')) {
                            const match = msg.match(/(\d+)\s*兵/);
                            if (match) troopsLost += parseInt(match[1], 10);
                          }

                          // Troops gained regex allowing optional signs
                          const gainTroopMatch = msg.match(/(?:募集|征募|吸纳|俘获|新卒|大军增配|募得新卒|招募|招兵|兵马增加|新增|新卒\s*\+\s*|兵卒\s*\+\s*|兵力\s*\+\s*)\s*[\+]?\s*(\d+)/);
                          if (gainTroopMatch) {
                            troopsGained += parseInt(gainTroopMatch[1], 10);
                          }

                          // Gold spent (loss) regex allowing optional signs
                          const lossGoldMatch = msg.match(/(?:消耗|扣除|花费|支付|流失|黄金\s*-\s*|扣除黄金|黄金跌落\s*-\s*|放粥\s*-\s*|损失\s*-\s*|损失)\s*[-]?\s*(\d+)/);
                          if (lossGoldMatch) {
                            goldSpent += parseInt(lossGoldMatch[1], 10);
                          }

                          // Gold gained regex allowing optional signs
                          const gainGoldMatch = msg.match(/(?:博得|岁入|黄金增加|获得|俸禄\s*\+\s*|征得|赋税\s*\+\s*|税款\s*\+\s*|黄金\s*\+\s*|征收|秋收|缴得|黄金\s*.*\+\s*)\s*[\+]?\s*(\d+)/);
                          if (gainGoldMatch) {
                            goldGained += parseInt(gainGoldMatch[1], 10);
                          }
                        });

                        // Prepare recharts dynamic trend data for military and fiscal assets
                        const chartData = (() => {
                          let runningTroopsChange = 1000; // start with a relative baseline
                          let runningGoldChange = 500;
                          
                          // Chronological history of events in the current chapter
                          const historyPoints = logs.map((log, index) => {
                            const msg = log.message;

                            // Analyze troops changes
                            let troopChange = 0;
                            const lossTr = msg.match(/(?:折损|战损|损兵|扣除|兵力减少|伤亡|损兵折将|折损兵马|兵力\s*-\s*|军旅折损\s*-\s*|兵卒\s*-\s*|军卒折损\s*-\s*|减少)\s*[-]?\s*(\d+)/);
                            const gainTr = msg.match(/(?:募集|征募|吸纳|俘获|新卒|大军增配|募得新卒|招募|招兵|兵马增加|新增|新卒\s*\+\s*|兵卒\s*\+\s*|兵力\s*\+\s*)\s*[\+]?\s*(\d+)/);
                            if (lossTr) {
                              troopChange = -parseInt(lossTr[1], 10);
                            } else if (gainTr) {
                              troopChange = parseInt(gainTr[1], 10);
                            } else if (msg.includes('减少') && msg.includes('兵')) {
                              const match = msg.match(/(\d+)\s*兵/);
                              if (match) troopChange = -parseInt(match[1], 10);
                            }

                            // Analyze gold changes
                            let goldChange = 0;
                            const lossG = msg.match(/(?:消耗|扣除|花费|支付|流失|黄金\s*-\s*|扣除黄金|黄金跌落\s*-\s*|放粥\s*-\s*|损失\s*-\s*|损失)\s*[-]?\s*(\d+)/);
                            const gainG = msg.match(/(?:博得|岁入|黄金增加|获得|俸禄\s*\+\s*|征得|赋税\s*\+\s*|税款\s*\+\s*|黄金\s*\+\s*|征收|秋收|缴得|黄金\s*.*\+\s*)\s*[\+]?\s*(\d+)/);
                            if (lossG) {
                              goldChange = -parseInt(lossG[1], 10);
                            } else if (gainG) {
                              goldChange = parseInt(gainG[1], 10);
                            }

                            runningTroopsChange += troopChange;
                            runningGoldChange += goldChange;

                            return {
                              name: `${index + 1}幕`,
                              "兵马趋势": runningTroopsChange,
                              "黄金趋势": runningGoldChange,
                              eventMsg: msg,
                              logType: log.type,
                              timestamp: log.timestamp
                            };
                          });

                          // Ensure we have a default baseline if no logs
                          if (historyPoints.length === 0) {
                            return [
                              { name: "初始", "兵马趋势": 1000, "黄金趋势": 500, eventMsg: "三军未动，粮草先行", logType: 'action' as const, timestamp: '建安初年' }
                            ];
                          }
                          return historyPoints;
                        })();

                        return (
                          <div id="battle-attrition-summary" className="mt-3.5 pt-3.5 border-t border-dashed border-artistic-charcoal/30 text-left text-[10px] font-serif bg-artistic-cream/70 p-2.5 rounded-none shadow-xs">
                            <div className="font-bold border-b border-artistic-charcoal/20 pb-1 mb-2 text-stone-900 flex justify-between tracking-wide">
                              <span>📊 战役志累计统计面板 (Chapter Stats Summary)</span>
                              <span className="text-artistic-crimson font-black animate-pulse">实时本册</span>
                            </div>

                            {/* Cumulative Stats Grid */}
                            <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                              <div className="bg-red-500/5 p-1.5 border border-red-900/10 text-center">
                                <div className="text-[8.5px] text-[#5c0f11] font-bold font-serif mb-0.5">📉 累计损兵</div>
                                <span className="font-mono text-xs font-black text-red-700">-{troopsLost}</span>
                              </div>
                              <div className="bg-amber-500/5 p-1.5 border border-amber-900/10 text-center">
                                <div className="text-[8.5px] text-amber-950 font-bold font-serif mb-0.5">🪙 耗费黄金</div>
                                <span className="font-mono text-xs font-black text-amber-800">-{goldSpent}</span>
                              </div>
                              <div className="bg-emerald-500/5 p-1.5 border border-emerald-950/10 text-center">
                                <div className="text-[8.5px] text-emerald-950 font-bold font-serif mb-0.5">⚔️ 歼灭敌寇</div>
                                <span className="font-mono text-xs font-black text-emerald-700">+{goldGained * 12 + 480}</span>
                              </div>
                            </div>

                            {/* Decision cost performance evaluation */}
                            {(() => {
                              const enemiesDefeatedVal = goldGained * 12 + 480;
                              const costRatio = Math.round((enemiesDefeatedVal / (troopsLost || 1)) * 10) / 10;
                              let ratingText = " 敌顽强缠斗，主公策略需克制变阵，宜进入「修习防卫鹤翼之姿」或「稳守战意偏好」以降低折损比！";
                              if (costRatio >= 2.5) {
                                ratingText = " 军略性价比极高！主公如武侯附身，神采飞扬，歼击犀利而损耗极低！";
                              } else if (costRatio >= 1.5) {
                                ratingText = " 指挥稳健，攻防互表。大军以稳妥消耗敌军，得失适中。";
                              }
                              return (
                                <div className="bg-amber-100/40 p-2 border border-amber-700/20 text-[9.5px] leading-relaxed text-[#5c0f11] font-serif mb-2.5">
                                  🚩 <b>【当前决策性价比评估】</b>：极火歼敌与兵损比为 <span className="font-mono font-black text-red-700">{costRatio}x</span>。{ratingText}
                                </div>
                              );
                            })()}

                            <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-stone-700 border-t border-dashed border-stone-200 pt-2 font-serif text-[9.5px]">
                              <div className="flex justify-between items-center">
                                <span>💂‍♂️ 增纳补给兵士:</span>
                                <span className="font-mono text-emerald-700 font-bold">+{troopsGained}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>💰 收获税粮岁入:</span>
                                <span className="font-mono text-emerald-700 font-bold">+{goldGained}</span>
                              </div>
                            </div>

                            {/* Recharts trend visualization inside the block */}
                            <div className="mt-3 pt-2.5 border-t border-stone-300">
                              <div className="w-full h-[120px] bg-white border border-stone-200/60 p-1 rounded-none shadow-inner">
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                    <defs>
                                      <linearGradient id="troopsGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8d1d1f" stopOpacity={0.16}/>
                                        <stop offset="95%" stopColor="#8d1d1f" stopOpacity={0}/>
                                      </linearGradient>
                                      <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d97706" stopOpacity={0.16}/>
                                        <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid stroke="#f1e0c6" strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" stroke="#78716c" fontSize={8} tickLine={false} />
                                    <YAxis stroke="#78716c" fontSize={8} tickLine={false} />
                                    <Tooltip
                                      content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                          const data = payload[0].payload;
                                          const eventDesc = data.eventMsg || "无重大特技或折损交锋";
                                          return (
                                            <div className="bg-[#fcfaf2] border-2 border-[#5c0f11] p-2.5 shadow-lg max-w-[220px] rounded-none font-serif text-[10.5px] text-stone-900 border-l-4 border-l-artistic-crimson transition-all duration-150">
                                              <div className="font-extrabold text-[#5c0f11] border-b border-stone-300 pb-1 mb-1.5 flex justify-between gap-1 items-center">
                                                <span>📋 {label} (战役交冲)</span>
                                                <span className="text-[8px] bg-artistic-charcoal text-white px-1 leading-normal scale-90 shrink-0 font-mono">{data.timestamp || '建安中'}</span>
                                              </div>
                                              <p className="font-bold text-[#8d1d1f] mb-1 flex justify-between">
                                                <span>💂‍♂️ 驻营收纳兵马:</span>
                                                <span className="font-mono text-xs">{data["兵马趋势"]} 人</span>
                                              </p>
                                              <p className="font-bold text-amber-805 mb-1 flex justify-between">
                                                <span>🪙 军屯辎重储备:</span>
                                                <span className="font-mono text-xs">{data["黄金趋势"]} 金</span>
                                              </p>
                                              <div className="border-t border-dashed border-stone-300 mt-1.5 pt-1.5">
                                                <span className="text-[8.5px] font-black text-stone-600 bg-amber-100/40 px-1 py-0.2 rounded-sm border inline-block mb-1">关键交锋事件志:</span>
                                                <p className="text-[9.5px] text-stone-750 font-serif leading-relaxed italic bg-[#fcfaf2] p-1.5 border border-stone-250">
                                                  {eventDesc.length > 55 ? eventDesc.substring(0, 55) + '...' : eventDesc}
                                                </p>
                                              </div>
                                            </div>
                                          );
                                        }
                                        return null;
                                      }}
                                    />
                                    <Area type="monotone" dataKey="兵马趋势" stroke="#8d1d1f" strokeWidth={1.2} fillOpacity={1} fill="url(#troopsGrad)" name="兵数趋势" />
                                    <Area type="monotone" dataKey="黄金趋势" stroke="#d97706" strokeWidth={1.2} fillOpacity={1} fill="url(#goldGrad)" name="黄金趋势" />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Garrison Defensive Readiness Summary Panel */}
                  {(() => {
                    const playerControlled = regions.filter(r => r.faction === 'PLAYER');
                    const totalGarrisonCount = playerControlled.reduce((acc, curr) => acc + curr.garrison, 0);

                    // Defensive readiness commentary
                    let statusText = "⚠️ 兵微将寡，守御空虚！快在“内政经营”中募兵防守！";
                    let statusColors = "text-red-700 bg-red-50 border-red-200";
                    if (totalGarrisonCount >= 3000) {
                      statusText = "🏯 重兵扼守，金汤铁壁！足以御乱，防守严密。";
                      statusColors = "text-emerald-800 bg-emerald-50 border-emerald-200";
                    } else if (totalGarrisonCount >= 1000) {
                      statusText = "🛡️ 本境戒备，基本守裕。仍需强化险要节点。";
                      statusColors = "text-amber-800 bg-amber-50 border-amber-200";
                    }

                    return (
                      <div id="tk-defense-readiness-sidebar" className="bg-artistic-bg border-4 border-artistic-charcoal rounded-none p-5 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="border-b border-artistic-charcoal pb-3 mb-3 flex justify-between items-center">
                            <h3 className="font-serif font-bold text-sm text-artistic-charcoal flex items-center gap-1.5 font-calligraphy">
                              <ShieldCheck className="w-4.5 h-4.5 text-emerald-700" />
                              诸郡要塞防备哨 (Defense Readiness)
                            </h3>
                            <span className="text-[10.5px] bg-emerald-700 text-emerald-50 px-2 py-0.5 font-black font-serif">
                              {totalGarrisonCount.toLocaleString()} 兵卒
                            </span>
                          </div>

                          {/* Readiness Level Status Tag */}
                          <div className={`p-2 border text-[10.5px] leading-relaxed font-serif mb-3 ${statusColors}`}>
                            <div className="font-bold flex items-center gap-1">
                              <span>🛡️ 防务备战水准:</span>
                              <span>{totalGarrisonCount < 1000 ? '极高危设防' : totalGarrisonCount < 3000 ? '中度警戒' : '天险固若金汤'}</span>
                            </div>
                            <p className="opacity-95 text-[10px] whitespace-normal">{statusText}</p>
                          </div>

                          {/* Garrisons list */}
                          <div className="font-serif text-[10px] font-black text-artistic-charcoal/80 mb-1.5 uppercase tracking-wide">
                            🚩 麾下守兵奏议 (Garrison breakdown)：
                          </div>
                          <div className="space-y-1 max-h-[100px] overflow-y-auto pr-1 scrollbar-ink">
                            {playerControlled.length > 0 ? (
                              playerControlled.map((r) => (
                                <div key={r.id} className="flex justify-between items-center text-[10.5px] py-1 px-1.5 bg-artistic-cream border border-artistic-charcoal/20">
                                  <span className="font-serif font-black text-stone-800 truncate">{r.name}</span>
                                  <span className="font-mono text-emerald-800 font-extrabold flex items-center gap-1 bg-white px-1 border border-emerald-600/20">
                                    💂 {r.garrison.toLocaleString()}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-2 bg-red-50/40 border border-dashed border-red-300 text-[10px] text-stone-400 font-serif italic">
                                麾下无受控要隘，社稷沦丧！
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Territory ownership controls panel */}
                  <div className="bg-artistic-bg border-4 border-artistic-charcoal rounded-none p-5 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="border-b border-artistic-charcoal pb-3 mb-4 flex justify-between items-center">
                        <h3 className="font-serif font-bold text-sm text-artistic-charcoal">山河图控制 (Territories)</h3>
                        <span className="text-[10px] bg-artistic-charcoal text-artistic-bg px-2 py-0.5 font-bold">
                          {regions.filter(r => r.faction === 'PLAYER').length} 郡控制
                        </span>
                      </div>

                      {/* Small map indicator list */}
                      <div className="grid grid-cols-2 gap-1.5 mb-2 max-h-[140px] overflow-y-auto pr-1 scrollbar-ink">
                        {regions.map((r) => {
                          const f = FACTIONS[r.faction] || FACTIONS.HAN;
                          return (
                            <div key={r.id} className="flex justify-between items-center text-[10.5px] p-1 bg-artistic-cream/70 border border-artistic-charcoal/30">
                              <span className="font-serif font-bold text-artistic-ink truncate">{r.name} {r.id === playerLocation ? '📍' : ''}</span>
                              <span className="text-[8px] font-mono px-1 rounded scale-90" style={{ backgroundColor: `${f.color}20`, color: f.color }}>
                                {f.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border-t border-artistic-charcoal/20 pt-2 text-[10px] text-artistic-charcoal opacity-90 leading-relaxed font-serif">
                      * 主线进程中，请经常在其他页面进行<b>内政屯兵、派遣和训练将佐</b>，以此打下高武高统，保障重大选项数值判定时不被卡退！
                    </div>
                  </div>
                </div>
              </div>
            )}

            {gameState === 'MAP' && (
              <ThreeKingdomsMap
                regions={regions}
                playerLocation={playerLocation}
                onTravel={handleTravel}
                playerStats={playerStats}
                onGarrisonTransfer={handleGarrisonTransfer}
                activeQuests={questsList.filter((q) => q.status === 'AVAILABLE' || q.status === 'ACTIVE').map(q => ({ targetRegionId: q.targetRegionId, title: q.title }))}
                exploredRegions={exploredRegions}
              />
            )}

            {gameState === 'GOV' && (
              <TerritoryGov
                playerStats={playerStats}
                regions={regions}
                onGovAction={handleGovAction}
                onHarvestTaxes={handleHarvestTaxes}
                taxCooldown={taxCooldown}
                onResetTaxCooldown={() => setTaxCooldown(false)}
                onUpdatePlayerStats={setPlayerStats}
                tradeRoutes={tradeRoutes}
                onUpdateTradeRoutes={setTradeRoutes}
              />
            )}

            {gameState === 'ROSTER' && (
              <GeneralRoster
                recruitedIds={recruitedGenerals}
                playerStats={playerStats}
                onRecruitGeneral={handleRecruitGeneral}
                onTrainGeneral={handleTrainGeneral}
                onRetireGeneral={handleRetireGeneral}
              />
            )}

            {gameState === 'TRAINING' && (
              <TrainingTab
                playerStats={playerStats}
                setPlayerStats={setPlayerStats}
                activeStance={activeStance}
                setActiveStance={setActiveStance}
                battleFormation={battleFormation}
                onSetBattleFormation={setBattleFormation}
                onAddBattleLog={(msg, type) => setBattleLogs(prev => [
                  { 
                    id: 'trn_' + Date.now(), 
                    chapterId: currentChapterId, 
                    timestamp: `公元${playerStats.year}年${playerStats.month}月${playerStats.day}日`, 
                    message: msg, 
                    type 
                  }, 
                  ...prev
                ])}
                showToast={showToast}
                playDrum={() => sfx.playDrum()}
                playClick={() => sfx.playClick()}
              />
            )}

            {gameState === 'DIPLOMACY' && (
              <FactionDiplomacy
                playerStats={playerStats}
                setPlayerStats={setPlayerStats}
                relations={diplomacyRelations}
                setRelations={setDiplomacyRelations}
                showToast={showToast}
                onAddBattleLog={(msg, type) => setBattleLogs(prev => [
                  { 
                    id: 'act_' + Date.now(), 
                    chapterId: currentChapterId, 
                    timestamp: `公元${playerStats.year}年${playerStats.month}月${playerStats.day}日`, 
                    message: msg, 
                    type 
                  }, 
                  ...prev
                ])}
              />
            )}

            {gameState === 'RANDOM_EVENTS' && (
              <RandomEventsTab
                playerStats={playerStats}
                setPlayerStats={setPlayerStats}
                showToast={showToast}
                onAddBattleLog={(msg, type) => setBattleLogs(prev => [
                  { 
                    id: 'act_' + Date.now(), 
                    chapterId: currentChapterId, 
                    timestamp: `公元${playerStats.year}年${playerStats.month}月${playerStats.day}日`, 
                    message: msg, 
                    type 
                  }, 
                  ...prev
                ])}
              />
            )}

            {gameState === 'CIVILIAN_MODS' && (
              <CivilianModsTab
                playerStats={playerStats}
                setPlayerStats={setPlayerStats}
                regions={regions}
                setRegions={setRegions}
                relations={diplomacyRelations}
                setRelations={setDiplomacyRelations}
                onExploredAll={() => setExploredRegions(regions.map(r => r.id))}
                showToast={showToast}
                onAddBattleLog={(msg, type) => setBattleLogs(prev => [
                  { 
                    id: 'act_' + Date.now(), 
                    chapterId: currentChapterId, 
                    timestamp: `公元${playerStats.year}年${playerStats.month}月${playerStats.day}日`, 
                    message: msg, 
                    type 
                  }, 
                  ...prev
                ])}
              />
            )}

            {gameState === 'SIDE_QUESTS' && (
              <QuestList
                quests={questsList}
                playerStats={playerStats}
                playerLocation={playerLocation}
                regions={regions}
                onQuestUpdate={handleQuestComplete}
                onSetLocation={setPlayerLocation}
              />
            )}

            {gameState === 'ACHIEVEMENTS' && (
              <div id="achievement-hall-view" className="bg-[#ebd9bc] border-[6px] border-double border-artistic-charcoal rounded-none max-w-4xl mx-auto p-8 shadow-2xl relative text-center animate-fade-in">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#3d3228_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
                
                {/* Header Calligraphy */}
                <div className="pb-6 mb-6 border-b-2 border-artistic-charcoal/40 relative">
                  <span className="text-[10px] bg-artistic-crimson text-artistic-bg font-mono font-bold px-3 py-1 uppercase tracking-widest block mx-auto max-w-max mb-3 shadow-[1px_1px_0px_#000]">
                    🏆 二十四节气 · 岁华功勋 🏆
                  </span>
                  <h3 className="font-serif font-black text-3xl text-artistic-crimson flex justify-center items-center gap-2">
                    <Award className="w-8 h-8 text-artistic-crimson animate-bounce" />
                    古今功德成就殿堂
                  </h3>
                  <p className="text-xs text-stone-700 font-serif mt-2 italic max-w-xl mx-auto leading-relaxed">
                    夫为将领军、治国御下者，察天时而乘大势也。殿中岁华罗列二十四气之气数玄机，静候主公达成天命异象。
                  </p>
                </div>

                {/* Achievement Statistics */}
                <div className="grid grid-cols-3 gap-4 mb-6 bg-artistic-cream p-4 border border-artistic-charcoal/30 font-serif text-sm">
                  <div className="text-center">
                    <div className="text-[10px] text-stone-500 font-bold uppercase">已奉天管辖</div>
                    <div className="text-2xl font-black text-artistic-crimson font-sans mt-0.5">
                      {unlockedAchievements.length} <span className="text-xs">/ 12</span>
                    </div>
                  </div>
                  <div className="text-center border-x border-artistic-charcoal/20">
                    <div className="text-[10px] text-stone-500 font-bold uppercase">大殿气数圆满</div>
                    <div className="text-2xl font-black text-amber-700 font-sans mt-0.5">
                      {Math.round((unlockedAchievements.length / 12) * 100)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-stone-500 font-bold uppercase">当前时令节气</div>
                    <div className="text-sm font-black text-emerald-800 mt-1 flex items-center justify-center gap-1">
                      <span>{SOLAR_TERMS_MAP[playerStats.month]?.icon}</span>
                      <span>{SOLAR_TERMS_MAP[playerStats.month]?.name.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Achievements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-2 scrollbar-ink mb-6 text-left">
                  {SOLAR_ACHIEVEMENTS.map((ach) => {
                    const isUnlocked = unlockedAchievements.includes(ach.id);
                    return (
                      <div 
                        key={ach.id} 
                        className={`p-4 border-2 flex gap-3 relative overflow-hidden transition-all duration-300 ${
                          isUnlocked 
                            ? 'bg-[#fcfaf2] border-amber-600/70 shadow-md transform hover:-translate-y-0.5' 
                            : 'bg-stone-100/60 border-stone-300 opacity-60'
                        }`}
                      >
                        {/* Status Stamp */}
                        <div className="absolute top-0 right-0">
                          {isUnlocked ? (
                            <span className="text-[8px] bg-amber-500 font-black text-white px-2 py-0.5 uppercase tracking-wider block rounded-bl-sm">
                              已达成 🌟
                            </span>
                          ) : (
                            <span className="text-[8px] bg-stone-300 font-black text-stone-600 px-2 py-0.5 uppercase tracking-wider block rounded-bl-sm">
                              未昭雪 🔒
                            </span>
                          )}
                        </div>

                        {/* Term Badge Big */}
                        <div className={`w-12 h-12 flex flex-col items-center justify-center border font-serif text-center shrink-0 ${
                          isUnlocked ? 'bg-amber-100 border-amber-400 text-amber-900' : 'bg-stone-200 border-stone-300 text-stone-500'
                        }`}>
                          <span className="text-xl leading-none">{ach.termIcon}</span>
                          <span className="text-[8px] font-bold mt-1 scale-90 leading-none">{ach.termName.split(' ')[0]}</span>
                        </div>

                        {/* Title and descriptions */}
                        <div className="flex-1 min-w-0 font-serif">
                          <h4 className={`text-sm font-black tracking-wide flex items-center gap-1.5 ${
                            isUnlocked ? 'text-[#5c0f11]' : 'text-stone-500'
                          }`}>
                            <span>{ach.title}</span>
                          </h4>
                          <p className="text-[10px] text-stone-500 leading-normal mt-1 italic">
                            “{isUnlocked ? ach.description : '修明内政隐于乾坤，待主公于本气数时节下达成特定伟绩时天命得释。'}”
                          </p>
                          <div className="border-t border-dashed border-stone-200 mt-2 pt-1.5 flex justify-between items-center text-[8.5px]">
                            <span className="font-bold text-stone-600">🎯 释出条件：</span>
                            <span className={`${isUnlocked ? 'text-amber-800' : 'text-stone-500 bg-stone-200/50 px-1 py-0.5 border border-stone-300/30'}`}>
                              {ach.conditionDesc}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Back to main menu footer command */}
                <div className="flex justify-center border-t border-artistic-charcoal/20 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      sfx.playClick();
                      setGameState('MAIN_MENU');
                    }}
                    className="bg-artistic-charcoal hover:bg-artistic-crimson text-artistic-bg py-2.5 px-8 border-2 border-transparent hover:border-artistic-bg text-xs tracking-widest font-serif font-black transition-colors rounded-none shadow-md cursor-pointer uppercase flex items-center gap-1.5 animate-pulse"
                  >
                    <span>🚪 回到在野大门 (Main Menu)</span>
                  </button>
                </div>
              </div>
            )}

            {gameState === 'ARCHIVE' && (
              /* Alt Chronicles list */
              <div className="bg-artistic-bg border-4 border-artistic-charcoal rounded-none p-6 shadow-md max-w-4xl mx-auto">
                <div className="border-b border-artistic-charcoal pb-3 mb-6 text-center">
                  <h3 className="font-serif font-black text-2xl text-artistic-charcoal flex justify-center items-center gap-2">
                    <Archive className="w-6 h-6 text-artistic-crimson" />
                    青史昭雪 · 改写编年史
                  </h3>
                  <p className="text-xs text-artistic-charcoal opacity-85 font-serif mt-1">
                    以下为你踏平乱世、改写将官生命、力保苍生的 alternate-history 编年竹简
                  </p>
                </div>

                {/* Sub-tab Switcher: Chronicles vs Historical Calendar */}
                <div className="flex border-b border-artistic-charcoal/30 mb-5 font-serif text-xs flex-wrap">
                  <button
                    onClick={() => { setArchiveSubTab('CHRONICLES'); sfx.playClick(); }}
                    className={`flex-1 min-w-[120px] py-2 text-center font-bold relative transition-all ${
                      archiveSubTab === 'CHRONICLES'
                        ? 'text-artistic-crimson border-b-2 border-artistic-crimson bg-artistic-cream/30 font-black'
                        : 'text-artistic-charcoal hover:text-artistic-crimson hover:bg-stone-100/35'
                    }`}
                  >
                    📜 已改写的编年简牍
                  </button>
                  <button
                    onClick={() => { setArchiveSubTab('TIMELINE'); sfx.playClick(); }}
                    className={`flex-1 min-w-[120px] py-2 text-center font-bold relative transition-all ${
                      archiveSubTab === 'TIMELINE'
                        ? 'text-artistic-crimson border-b-2 border-artistic-crimson bg-artistic-cream/30 font-black'
                        : 'text-artistic-charcoal hover:text-artistic-crimson hover:bg-stone-100/35'
                    }`}
                  >
                    🔮 史实与偏离度可视化 (D3)
                  </button>
                  <button
                    onClick={() => { setArchiveSubTab('CALENDAR'); sfx.playClick(); }}
                    className={`flex-1 min-w-[120px] py-2 text-center font-bold relative transition-all ${
                      archiveSubTab === 'CALENDAR'
                        ? 'text-artistic-crimson border-b-2 border-artistic-crimson bg-artistic-cream/30 font-black'
                        : 'text-artistic-charcoal hover:text-artistic-crimson hover:bg-stone-100/35'
                    }`}
                  >
                    📅 时代演变大事记
                  </button>
                </div>

                {(() => {
                  if (archiveSubTab === 'CALENDAR') {
                    const currentTotalDays = playerStats.year * 360 + playerStats.month * 30 + playerStats.day;
                    const HISTORICAL_MILESTONES = [
                      {
                        title: "黄巾之乱爆发 (Outbreak of the Yellow Turban Rebellion)",
                        year: 184,
                        month: 3,
                        day: 1,
                        description: "大贤良师张角纠合天下信徒，口号『苍天已死，黄天当立』，起兵造反，黄巾席卷天下大郡！",
                        historicalSignificance: "点燃了大汉帝国崩塌的烽火，群雄割据分裂神州。"
                      },
                      {
                        title: "董卓废帝专权 (Dong Zhuo Seizes Power)",
                        year: 189,
                        month: 9,
                        day: 1,
                        description: "西凉刺史董卓引兵入京，废少帝，立献帝，收吕布，霍乱朝纲，天下郡国合盟征讨讨董！",
                        historicalSignificance: "汉廷政柄彻底荡然无存，英雄并起吞并天下的格局成形。"
                      },
                      {
                        title: "曹袁官渡会战 (Battle of Guandu)",
                        year: 200,
                        month: 2,
                        day: 1,
                        description: "曹操与袁绍尽起海内精锐，于关东官渡决战。曹操火烧乌巢，大挫袁军，威震黄河北岸！",
                        historicalSignificance: "奠定了曹操统一北方、建魏称雄的霸业基石。"
                      },
                      {
                        title: "隆中草庐对 (Three Visits to the Thatch Cottage)",
                        year: 207,
                        month: 11,
                        day: 1,
                        description: "刘备蛰居新野小城，不辞大雪，三次亲往隆中卧龙岗，求贤若渴躬迎孔明先生出阁掌三军羽扇。",
                        historicalSignificance: "擘画了鼎足三分之天图，确立了蜀汉跨有荆益之霸道宏图。"
                      },
                      {
                        title: "赤壁鏖兵决胜 (The Battle of Red Cliffs)",
                        year: 208,
                        month: 11,
                        day: 1,
                        description: "曹操号称百万大军饮马长江。刘备结盟东吴，孔明借东风、周瑜火烧连环铁船，曹操败逃华容道！",
                        historicalSignificance: "粉碎了曹操鲸吞海内的野望，三国鼎立局势从此铸成。"
                      },
                      {
                        title: "刘备Mian阳称王 (Liu Bei Declares Himself King of Hanzhong)",
                        year: 219,
                        month: 7,
                        day: 1,
                        description: "汉中鏖兵定军山。大将黄忠力斩夏侯渊。刘备克定汉中天险，登坛受玺受册为汉中王！",
                        historicalSignificance: "刘备声名声威在汉朝后世达到绝顶。但也埋下关羽失荆州的巅峰前兆麦城悬案。"
                      },
                      {
                        title: "曹丕禅位立魏 (Cao Pi Usurps the Han Throne)",
                        year: 220,
                        month: 10,
                        day: 1,
                        description: "魏王曹丕废弃大汉天子，逼退汉献帝，自受玺授登基建魏。四百年汉家宗庙帝统至此宣告谢幕。",
                        historicalSignificance: "东汉皇祚寿终正寝，三国正式纪元降临。"
                      }
                    ];

                    return (
                      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-ink">
                        <div className="bg-artistic-cream border border-artistic-charcoal/20 p-3 mb-2 text-xs font-serif text-artistic-charcoal leading-relaxed text-left">
                          📢 <span className="font-bold text-artistic-crimson">编年大事纪说</span>：神州天地之命轨波折前行，每个重大的历史篇章和节点都将带给天下剧烈的演变。由于您改变天时，您当前的日历是 <span className="font-bold underline text-stone-900 font-mono">公元{playerStats.year}年{playerStats.month}月{playerStats.day}日</span>。关注与各个关键史实大事记的相对间距，感受命运的磅礴呼吸吧！
                        </div>

                        {HISTORICAL_MILESTONES.map((m, index) => {
                          const eventTotalDays = m.year * 360 + m.month * 30 + m.day;
                          const daysRemaining = eventTotalDays - currentTotalDays;
                          const isUpcoming = daysRemaining > 0;

                          return (
                            <div 
                              key={index} 
                              className={`p-3 border text-left flex flex-col justify-between transition-all duration-300 ${
                                isUpcoming
                                  ? 'bg-artistic-cream border-amber-800/40 border-l-4 border-l-emerald-600 shadow-sm'
                                  : 'bg-stone-200/50 border-stone-300 border-l-4 border-l-stone-550 opacity-80'
                              }`}
                            >
                              <div className="flex justify-between items-start gap-1.5 flex-wrap">
                                <h4 className={`font-serif font-black text-xs ${isUpcoming ? 'text-stone-900 font-serif' : 'text-stone-500 font-serif line-through'}`}>
                                  {index + 1}. {m.title}
                                </h4>
                                <span className={`text-[9px] font-mono font-bold px-1.5 rounded-none border ${
                                  isUpcoming
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : 'bg-stone-100 text-stone-650 border-stone-300'
                                }`}>
                                  目标时日: 公元 {m.year} 年 {m.month} 月
                                </span>
                              </div>

                              <p className="text-[11px] text-stone-700 font-serif leading-relaxed mt-1.5 italic">
                                “ {m.description} ”
                              </p>

                              <div className="mt-2 pt-2 border-t border-dashed border-stone-300 flex justify-between items-center text-[10px] font-serif">
                                <span className="text-stone-500 truncate">
                                  历史影响: {m.historicalSignificance}
                                </span>
                                
                                <span className={`font-mono font-black shrink-0 ml-3 text-[11px] ${
                                  isUpcoming 
                                    ? 'text-emerald-700 bg-emerald-50/50 px-1.5 py-0.5 border border-emerald-250 animate-pulse' 
                                    : 'text-stone-500 bg-stone-100 px-1.5 py-0.5 border border-stone-250'
                                }`}>
                                  {isUpcoming 
                                    ? `⏳ 还剩 ${daysRemaining} 天` 
                                    : `✅ 史料已过该史实点 (${Math.abs(daysRemaining)} 天前)`
                                  }
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }

                  if (archiveSubTab === 'TIMELINE') {
                    return (
                      <div className="bg-[#faf5ec] p-6 border-2 border-artistic-charcoal rounded-none shadow-md animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none bg-[radial-gradient(#3d3228_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
                        <div className="border-b border-[#5c0f11] pb-3 mb-4 text-left">
                          <h4 className="font-serif font-black text-lg text-[#5c0f11] flex items-center gap-1.5">
                            <span>🔮</span> 昭雪天命 · 历史走向分支沙盘
                          </h4>
                          <p className="text-[10px] text-stone-600 font-serif leading-relaxed mt-1">
                            下方为由 D3.js 动态绘制的气数演化时间线。<b>灰色细线轴</b>为正史本色（Orthodox Mainline），<b>红线闪烁分支节点</b>为因主公在逆天抉择中所带来的破局偏离节点（Altered Alternate History），将悬浮触点展开其史实底色与今朝变革！
                          </p>
                        </div>
                        <div className="border-2 border-[#3d3228]/20 bg-[#fbf9f3] p-1 shadow-inner relative flex justify-center overflow-x-auto">
                          <HistoryTimelineD3 records={historyRecords} />
                        </div>
                        <div className="mt-3 text-[10px] text-stone-500 font-serif leading-relaxed italic text-right">
                          * 偏离历史的选择越多，时间重叠及破局张力越大。青史有知，笔著千秋。
                        </div>
                      </div>
                    );
                  }

                  const query = archiveSearch.toLowerCase();
                  const filtered = historyRecords.filter((rec) => {
                    const recCat = rec.category || 'Personal';
                    if (archiveFilter !== 'ALL' && recCat !== archiveFilter) return false;
                    if (!archiveSearch) return true;
                    
                    const matchesBattle = query === 'battle' && (rec.title.includes('战') || rec.brief.includes('战') || rec.brief.includes('军') || rec.brief.includes('兵'));
                    const matchesEvent = query === 'event' && (rec.title.includes('事') || rec.brief.includes('事') || rec.brief.includes('盟') || rec.brief.includes('遇'));
                    const matchesDecision = query === 'decision' && (rec.title.includes('策') || rec.brief.includes('策') || rec.brief.includes('政') || rec.brief.includes('决'));
                    
                    return (
                      rec.title.toLowerCase().includes(query) ||
                      rec.brief.toLowerCase().includes(query) ||
                      rec.timestamp.toLowerCase().includes(query) ||
                      matchesBattle ||
                      matchesEvent ||
                      matchesDecision
                    );
                  });

                  const CATEGORY_MAP: Record<string, { label: string; color: string }> = {
                    Combat: { label: '⚔️ 战事', color: 'bg-red-100 text-red-900 border-red-300' },
                    Diplomacy: { label: '🤝 外交', color: 'bg-blue-100 text-blue-900 border-blue-300' },
                    Domestic: { label: '👑 内政', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
                    Personal: { label: '👤 秘闻', color: 'bg-amber-100 text-amber-900 border-amber-300' },
                  };

                  return (
                    <>
                      {/* Simulation Temporal Anomaly Injector Controller */}
                      <div className="mb-4 bg-[#8b0000]/5 border border-[#8b0000]/30 p-2.5 text-left flex justify-between items-center bg-artistic-cream rounded-none">
                        <div className="text-[10px] font-serif leading-snug text-stone-800 pr-3.5">
                          💡 <b>【天意模拟 · 非线性因果对冲】</b>：在真实三国正史中，武圣败走麦城（公元219年）与武侯魂断五丈原（公元234年）相距15载。若在主公逆改天运后的同一纪年中相会触发，将被天书判为因果相冲：
                        </div>
                        <button
                          type="button"
                          onClick={injectTemporalConflictMocks}
                          className="px-3 py-1.5 text-[10px] font-serif font-black bg-artistic-crimson text-white hover:bg-artistic-crimson/85 border border-artistic-charcoal shadow-xs whitespace-nowrap cursor-pointer transition-all shrink-0"
                        >
                          🔮 触发时空分裂检测模拟
                        </button>
                      </div>

                      {/* Category Filter Buttons */}
                      <div className="mb-3.5 flex flex-wrap gap-1.5 justify-start items-center text-xs font-serif bg-[#f5efdf] p-2.5 border border-artistic-charcoal/20">
                        <span className="text-stone-700 font-black mr-1 flex items-center gap-1">
                          <span>📂</span> 历史大事纪分类：
                        </span>
                        {[
                          { id: 'ALL', label: '全部' },
                          { id: 'Combat', label: '⚔️ 战事 (Combat)' },
                          { id: 'Diplomacy', label: '🤝 外交 (Diplomacy)' },
                          { id: 'Domestic', label: '👑 内政 (Domestic)' },
                          { id: 'Personal', label: '👤 秘闻 (Personal)' }
                        ].map((btn) => (
                          <button
                            key={btn.id}
                            type="button"
                            onClick={() => { sfx.playClick(); setArchiveFilter(btn.id as any); }}
                            className={`px-3 py-1 border font-bold cursor-pointer transition-all duration-150 text-[10.5px] ${
                              archiveFilter === btn.id
                                ? 'bg-artistic-crimson text-[#fdfceb] border-[#5c0f11] shadow-inner font-black'
                                : 'bg-[#faf9f0] text-stone-800 border-stone-400/60 hover:text-artistic-crimson hover:bg-white'
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>

                      <div className="mb-5 flex gap-2 items-center">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={archiveSearch}
                            onChange={(e) => setArchiveSearch(e.target.value)}
                            placeholder="🔍 按关键词筛选编年简牍（支持中英文，如：battle、event、decision、战、对策、桃园...）"
                            className="w-full bg-artistic-cream border-2 border-artistic-charcoal/80 text-xs px-3.5 py-2 font-serif text-artistic-ink rounded-none placeholder-artistic-charcoal/50 focus:outline-none focus:border-artistic-crimson transition-all"
                          />
                          {archiveSearch && (
                            <button
                              onClick={() => setArchiveSearch('')}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-artistic-charcoal hover:text-artistic-crimson transition-all cursor-pointer font-sans"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        {(archiveSearch || archiveFilter !== 'ALL') && (
                          <span className="text-[10px] font-serif font-bold text-artistic-crimson bg-artistic-crimson/5 border border-artistic-crimson/20 px-2.5 py-2 whitespace-nowrap">
                            找到 {filtered.length} 篇相关记载
                          </span>
                        )}
                      </div>

                      <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 scrollbar-ink">
                        {filtered.length > 0 ? (
                          filtered.map((rec) => {
                            const matchingScene = Object.values(GAME_SCENES).find(sc => sc.title === rec.title);
                            const originalFact = matchingScene
                              ? matchingScene.historicalFact
                              : (rec.id === 'intro_act'
                                ? '公元177年，大汉灵帝熹平之年，十常侍专权，民不料民，黄巾起义暗流涌动。昭烈帝刘备此时仍蛰居于幽州涿县，奉母尽孝，以贩织草鞋、草席为业，潜志待时。'
                                : '大汉史册未尽详录，此演义奇事见证了主公踏入乱世，大展奇谋，逆改命轨之传奇篇章。');
                            const isFactExpanded = !!expandedHistoryFacts[rec.id];
                            
                            // Scan for potential non-linear chronological timeline conflicts
                            const conflict = detectTimeConflict(rec, historyRecords);
                            const recCat = rec.category || 'Personal';
                            const catStyle = CATEGORY_MAP[recCat] || CATEGORY_MAP.Personal;

                            return (
                              <div key={rec.id} className="relative group/history-record">
                                {/* Historical Notes Banner Alert */}
                                {conflict && (
                                  <div className="bg-[#8b0000]/5 border-2 border-dashed border-artistic-crimson/60 p-3 mb-2.5 font-serif text-left relative overflow-hidden flex flex-col gap-1.5 animate-fade-in">
                                    <div className="absolute top-0 right-0 bg-[#8b0000] text-white text-[7.5px] px-2 py-0.5 uppercase tracking-widest font-black [writing-mode:vertical-rl] leading-none select-none opacity-80 h-full flex items-center justify-center">
                                      时空裂痕
                                    </div>
                                    <div className="flex items-center gap-1.5 text-artistic-crimson text-[11px] font-sans font-black">
                                      <span className="text-sm font-sans">📜</span>
                                      <span>史料注记（非线性重叠警示）</span>
                                    </div>
                                    <p className="text-[10px] text-stone-850 leading-relaxed pr-6">
                                      检测到因果交织重叠！该节点 <b>{rec.title} ({rec.timestamp})</b> 与 <b>{conflict.pairEvent}</b> 在本宇宙同年同分并存发生。原正史因果年份不符，属逆天改命导致的非线性编年裂隙！
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() => { sfx.playFanfare(true); setSelectedConflictRecord(conflict); }}
                                      className="bg-[#5c0f11] hover:bg-artistic-crimson text-[#f2e6d0] hover:text-white text-[10px] font-serif font-black py-1 px-3 border border-artistic-charcoal cursor-pointer self-start transition-all duration-150"
                                    >
                                      🔍 展开正史真实年份对比详情
                                    </button>
                                  </div>
                                )}

                                <div 
                                  onClick={() => {
                                    if (conflict) {
                                      sfx.playFanfare(true);
                                      setSelectedConflictRecord(conflict);
                                    } else {
                                      setExpandedHistoryFacts(prev => ({ ...prev, [rec.id]: !prev[rec.id] }));
                                    }
                                  }}
                                  className={`bg-artistic-cream p-4 rounded-none border-l-4 ${
                                    conflict 
                                      ? 'border-l-[#5c0f11] bg-red-50/20 hover:bg-red-50/40 border-y border-r border-[#5c0f11]/40' 
                                      : 'border-l-artistic-crimson border-y border-r border-artistic-charcoal/40'
                                  } shadow-sm transition-all text-left cursor-pointer hover:bg-stone-50/80`}
                                >
                                  <div className="flex justify-between items-start mb-1 gap-2 flex-wrap">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-mono font-bold text-artistic-bg bg-artistic-charcoal px-1.5 py-0.5">
                                        {rec.timestamp}
                                      </span>
                                      {/* Category Badge Tag to meet requested spec */}
                                      <span className={`text-[9px] font-serif font-black px-1.5 py-0.5 border ${catStyle.color}`}>
                                        {catStyle.label}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                      <button
                                        type="button"
                                        onClick={() => setExpandedHistoryFacts(prev => ({ ...prev, [rec.id]: !prev[rec.id] }))}
                                        className="inline-flex items-center gap-1 text-[10px] font-serif font-black text-amber-900 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-600/30 px-2 py-0.5 transition-all cursor-pointer shadow-xs rounded-none"
                                        title="查看该事件对应的真实历史记载"
                                      >
                                        <Info className="w-3 h-3 text-amber-700 shrink-0" />
                                        <span>对比真实史实 ({isFactExpanded ? '收起' : '展开'})</span>
                                      </button>
                                      <span className={`text-[10px] font-serif font-bold px-2 py-0.5 border ${
                                        rec.isAltered 
                                          ? 'bg-artistic-crimson/10 text-artistic-crimson border-artistic-crimson/30' 
                                          : 'bg-artistic-charcoal/10 text-artistic-charcoal border-artistic-charcoal/30'
                                      }`}>
                                        {rec.isAltered ? '【逆天改命】' : '【符合记实】'}
                                      </span>
                                    </div>
                                  </div>
                                  <h4 className="font-serif font-black text-artistic-ink text-sm mb-1">{rec.title}</h4>
                                  <p className="text-xs text-artistic-ink/90 font-serif leading-relaxed italic">
                                    “{rec.brief}”
                                  </p>

                                  {/* Historical outcome comparison banner */}
                                  {isFactExpanded && (
                                    <div className="mt-2.5 bg-[#f5ebd0]/80 border-t border-dashed border-amber-800/30 pt-2 pb-1 px-1 text-xs text-amber-950 font-serif leading-relaxed animate-fade-in">
                                      <div className="font-black text-amber-900 flex items-center gap-1.5 mb-1 text-[11px]">
                                        <BookOpen className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                                        历史原本走向（真实陈述）：
                                      </div>
                                      <p className="pl-5 text-stone-800 italic">{originalFact}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="py-12 text-center text-xs text-artistic-charcoal/60 italic font-serif">
                            {archiveSearch ? '🔍 未找到包含该关键词的编年竹简。' : '编年简牍尚为空白。快去推进主线、平寇除凶、建立万世不易之勋吧！'}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {gameState === 'ENDING' && (
              /* Ending Parchment Scroll layout */
              <div className="bg-artistic-cream border-4 border-artistic-charcoal rounded-none max-w-2xl mx-auto p-6 md:p-10 shadow-lg relative text-center animate-scale-up">
                <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#3d3228_2px,transparent_2px)] [background-size:24px_24px]"></div>
                
                <div className="pb-4 mb-6 border-b-2 border-artistic-charcoal">
                  <span className="text-xs bg-artistic-crimson/15 text-artistic-crimson border border-artistic-crimson/30 px-3 py-1 font-serif font-bold">
                    大局已定 · 百年终篇
                  </span>
                  <h1 className="font-calligraphy text-3xl md:text-4xl text-artistic-crimson font-bold mt-3">
                    {activeScene.title}
                  </h1>
                </div>

                {/* Plot text output */}
                <div className="bg-artistic-bg border-2 border-artistic-charcoal/30 p-5 rounded-none block text-[#2a2319] text-xs md:text-sm leading-relaxed font-serif text-left italic mb-6 shadow-inner max-h-[300px] overflow-y-auto">
                  <p className="indent-6">{activeScene.narration}</p>
                </div>

                <div className="bg-artistic-crimson/5 border-2 border-artistic-crimson/30 p-3 rounded-none text-[11px] text-artistic-ink font-serif leading-relaxed mb-6 text-left">
                  <strong className="text-artistic-crimson block font-serif font-extrabold">【大青史结局批注】</strong>
                  {activeScene.historicalFact}
                </div>

                {/* Final Score and actions */}
                <div className="space-y-4">
                  {/* Real evaluation analysis block */}
                  {(() => {
                    const evalResult = calculateEndingEvaluation(playerStats, recruitedGenerals.length, activeScene.id);
                    return (
                      <div className="bg-[#ede0c5] border border-dashed border-artistic-charcoal/40 p-4 rounded-none text-left font-serif mb-4 shadow-inner">
                        <div className="flex justify-between items-center border-b border-artistic-charcoal/20 pb-2 mb-2">
                          <span className="font-bold text-xs text-artistic-charcoal">⚖️ 后汉史官评鉴大本纪 (Chronicle Evaluation)</span>
                          <span className={`text-xl font-mono font-black border-2 px-3 py-0.5 rounded-none ${
                            evalResult.grade === 'SSS' ? 'text-artistic-crimson border-artistic-crimson bg-artistic-crimson/10 font-bold animate-pulse' : 'text-amber-800 border-amber-800 bg-amber-50'
                          }`}>
                            {evalResult.grade} 级
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-3 text-stone-800">
                          <div>
                            <span className="text-stone-500">天命扭转度:</span>{' '}
                            <span className="font-mono font-bold text-artistic-crimson">{playerStats.deviance}%</span>
                          </div>
                          <div>
                            <span className="text-stone-500">麾下英豪员:</span>{' '}
                            <span className="font-mono font-bold">{recruitedGenerals.length} 员</span>
                          </div>
                          <div>
                            <span className="text-stone-500">德行昭雪:</span>{' '}
                            <span className="font-mono font-bold">{playerStats.virtue} 点</span>
                          </div>
                          <div>
                            <span className="text-stone-500">军威精兵:</span>{' '}
                            <span className="font-mono font-bold">{playerStats.troops} 部</span>
                          </div>
                        </div>
                        <div className="text-xs text-stone-700 leading-relaxed italic bg-white/40 p-2.5 border border-stone-300">
                          <strong className="text-artistic-charcoal not-italic block font-serif font-black mb-1">【史臣评批】</strong>
                          “ {evalResult.feedback} ”
                        </div>
                        {evalResult.grade === 'SSS' && (
                          <div className="text-[10px] text-emerald-800 font-bold mt-2 bg-emerald-500/10 border border-emerald-600/25 p-1.5 flex items-center gap-1">
                            <span>🌟 达成 SSS 极境宏图！下一周目底子天赋点加 18 点。（可在此刻或重置后永久生效）</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <button
                    onClick={clearSave}
                    className="w-full bg-artistic-charcoal hover:bg-artistic-crimson text-artistic-bg py-3 px-6 rounded-none font-serif font-black text-xs shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-artistic-bg block"
                  >
                    👑 重新参悟天理 · 重置大业重开一世
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Utility floating bar (Save/Load/Reset actions) */}
          <div className="flex justify-between items-center bg-artistic-cream border-2 border-artistic-charcoal p-3 rounded-none text-xs font-serif flex-wrap gap-3">
            <span className="text-artistic-charcoal opacity-90 flex items-center gap-1.5 leading-none">
              <ShieldCheck className="w-4.5 h-4.5 text-artistic-crimson shrink-0" />
              统一征程：大业自动存于浏览器中。亦可按下侧大印手动加印封存。
            </span>
            <div className="flex gap-2.5 items-center flex-wrap">
              {/* Hidden file input for save game importing */}
              <input 
                type="file" 
                ref={importFileRef} 
                onChange={importGameSave} 
                className="hidden" 
                accept=".json" 
              />
              
              <button
                onClick={saveGame}
                className="bg-artistic-bg hover:bg-artistic-cream text-artistic-crimson rounded-none border border-artistic-crimson px-3 py-1 font-bold text-[11px] transition-all flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                军务编档
              </button>
              <button
                onClick={loadGame}
                className="bg-artistic-bg hover:bg-artistic-cream text-artistic-charcoal rounded-none border border-artistic-charcoal px-3 py-1 font-bold text-[11px] transition-all flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                调阅旧案
              </button>
              <button
                onClick={exportGameSave}
                title="导出当前的SSS传承数据以及进度为本地JSON档案"
                className="bg-amber-50 hover:bg-amber-100 text-[#5c0f11] rounded-none border border-amber-600 px-3 py-1 font-bold text-[11px] transition-all flex items-center gap-1 shadow-sm cursor-pointer"
              >
                📤 导出本纪
              </button>
              <button
                onClick={() => importFileRef.current?.click()}
                title="导入本地JSON进度或传承档案以恢复天命"
                className="bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-none border border-blue-600 px-3 py-1 font-bold text-[11px] transition-all flex items-center gap-1 shadow-sm cursor-pointer"
              >
                📥 导入神册
              </button>
              <button
                onClick={clearSave}
                className="bg-[#ffe4e1] hover:bg-[#fadadd] text-artistic-crimson rounded-none border border-artistic-crimson/40 px-3 py-1 text-[11px] transition-all flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                焚毁大业
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Choice Results narrative popup overlay */}
      {lastOutcome && (
        <div className="fixed inset-0 bg-artistic-charcoal/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-artistic-cream border-[6px] double border-artistic-charcoal max-w-lg w-full p-6 shadow-2xl relative animate-scale-up">
            <div className="absolute top-2 right-2 w-12 h-12 text-artistic-crimson border border-artistic-crimson/20 rounded-full flex items-center justify-center font-calligraphy text-xl opacity-35 select-none font-bold">
              昭雪
            </div>
            
            <h3 className="font-calligraphy font-black text-2xl text-artistic-crimson border-b border-artistic-charcoal pb-2.5 mb-4">
              🎯 军策玺令对策结果
            </h3>
            
            <div className="mb-4 bg-artistic-bg p-3 border border-artistic-charcoal">
              <span className="text-[10px] font-mono font-bold text-artistic-crimson uppercase block mb-1">
                主公起案密策：
              </span>
              <p className="font-serif text-sm font-bold text-artistic-ink">
                {lastOutcome.optionText}
              </p>
            </div>

            <div className="mb-5 text-sm font-serif italic text-stone-800 leading-relaxed bg-[radial-gradient(#eed9be_1px,transparent_1px)] [background-size:16px_16px] p-4 border border-artistic-charcoal/20">
              <span className="text-[10px] font-mono opacity-80 block mb-1">
                【天命变革演义叙述】
              </span>
              <p className="indent-6">{lastOutcome.narration}</p>
            </div>

            {/* Results breakdown changes box */}
            {lastOutcome.statChanges.length > 0 && (
              <div className="mb-5">
                <span className="text-[10px] text-artistic-charcoal block mb-1.5 font-bold">国帑与将官属性增删变化：</span>
                <div className="grid grid-cols-2 gap-2 bg-artistic-bg p-3 border border-dashed border-artistic-charcoal">
                  {lastOutcome.statChanges.map((change, cIdx) => (
                    <div key={cIdx} className="text-xs font-serif font-bold text-stone-800 flex items-center gap-1">
                      {change}
                    </div>
                  ))}
                  <div className="text-xs font-serif font-bold text-stone-800 col-span-2 border-t border-stone-200 pt-1 mt-1 flex justify-between">
                    <span>⏳ 治所操办历时：</span>
                    <span className="text-artistic-crimson">{lastOutcome.daysAdvanced} 天/日</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleProceedOutcome}
              className="w-full bg-artistic-charcoal hover:bg-artistic-crimson text-artistic-bg py-2.5 px-4 rounded-none font-serif font-bold text-xs tracking-wider cursor-pointer shadow transition-all flex items-center justify-center gap-1.5"
            >
              <span>奉旨推演，摆驾下一幕征程 ➔</span>
            </button>
          </div>
        </div>
      )}

      {/* Ambient Random Event popup overlay */}
      {activeRandomEvent && (
        <div className="fixed inset-0 bg-artistic-charcoal/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-artistic-cream border-[6px] border-artistic-charcoal max-w-lg w-full p-6 shadow-2xl relative animate-scale-up">
            <div className="absolute top-2 right-4 w-12 h-12 text-artistic-crimson border-2 border-artistic-crimson/20 flex items-center justify-center font-calligraphy text-2xl opacity-20 select-none font-bold transform rotate-6">
              突发
            </div>
            
            <span className="text-[10px] font-mono font-bold text-artistic-crimson uppercase tracking-widest bg-artistic-crimson/10 border border-artistic-crimson/30 px-2 py-0.5 inline-block mb-3 animate-bounce">
              ⚡ 乱世征途星夜奇遇 (Random Event)
            </span>

            <h3 className="font-serif font-black text-xl text-artistic-ink mb-3 leading-snug">
              {activeRandomEvent.title}
            </h3>

            <div className="mb-5 text-sm font-serif text-stone-700 leading-relaxed bg-[#fbf6ec] border border-artistic-charcoal/30 p-4 shadow-inner">
              <p className="indent-6 italic">{activeRandomEvent.description}</p>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] text-artistic-charcoal font-bold block mb-1">
                请主公度审长略，权变安政：
              </span>
              {activeRandomEvent.options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => {
                    sfx.playClick();
                    opt.action(playerStats);
                  }}
                  className="w-full text-left bg-artistic-bg border border-artistic-charcoal hover:bg-[#ede0c5] p-3 text-xs md:text-sm font-serif transition duration-200 flex items-start gap-3 cursor-pointer rounded-none"
                >
                  <span className="w-6 h-6 border border-artistic-charcoal flex items-center justify-center font-bold text-[10px] shrink-0 bg-artistic-cream mt-0.5">
                    {oIdx === 0 ? '壹' : '贰'}
                  </span>
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="font-bold text-stone-800 leading-snug text-xs md:text-[13px] mb-1">
                      {opt.text}
                    </span>
                    <div className="text-[10px] text-stone-500 font-serif leading-none">
                      {getEvaluationHint(opt)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom Retro Toast Overlay */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-fade-in pointer-events-none max-w-sm w-full px-4">
          <div className="bg-[#ede0c5] border-2 border-artistic-crimson shadow-xl p-3.5 flex items-center gap-3 relative rounded-none [box-shadow:4px_4px_0px_#8b0000]">
            <div className="shrink-0 w-8 h-8 rounded-full bg-artistic-crimson/10 flex items-center justify-center border border-artistic-crimson/30">
              <Sparkles className="w-4.5 h-4.5 text-artistic-crimson" />
            </div>
            <div className="flex-1 font-serif text-[11.5px] font-bold text-stone-900 leading-snug">
              {toast}
            </div>
          </div>
        </div>
      )}

      {/* Custom Vintage Confirmation Modal */}
      {confirmBox && (
        <div className="fixed inset-0 bg-artistic-charcoal/70 backdrop-blur-xs flex items-center justify-center p-4 z-[110] animate-fade-in">
          <div className="bg-[#f0e4cf] border-[5px] double border-artistic-charcoal max-w-sm w-full p-6 shadow-2xl relative animate-scale-up">
            <h4 className="font-calligraphy font-black text-xl text-artistic-crimson border-b border-artistic-charcoal pb-2 mb-3">
              征图玺令决策确认
            </h4>
            <p className="font-serif text-xs md:text-sm text-stone-800 leading-relaxed mb-6">
              {confirmBox.message}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  sfx.playClick();
                  const onConfirm = confirmBox.onConfirm;
                  setConfirmBox(null);
                  onConfirm();
                }}
                className="flex-1 bg-artistic-charcoal hover:bg-artistic-crimson text-[#f2e6d0] text-xs font-serif font-bold py-2 px-3 border border-transparent rounded-none transition-all cursor-pointer text-center"
              >
                确认执槌
              </button>
              <button
                type="button"
                onClick={() => {
                  sfx.playClick();
                  setConfirmBox(null);
                }}
                className="flex-grow bg-transparent hover:bg-artistic-charcoal/10 text-artistic-charcoal text-xs font-serif font-bold py-2 px-3 border border-artistic-charcoal rounded-none transition-all cursor-pointer text-center"
              >
                罢其议
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Sovereign Player Profile Modal */}
      {showPlayerModal && (() => {
        const playerTotalStats = playerStats.force + playerStats.intelligence + playerStats.leadership + playerStats.politics + playerStats.virtue;
        const playerLevel = Math.max(1, Math.floor((playerTotalStats - 160) / 8));
        const nextLevelStatsNeeded = 160 + (playerLevel * 8);
        const prevLevelStatsNeeded = 160 + ((playerLevel - 1) * 8);
        const xpProgress = Math.min(8, Math.max(0, playerTotalStats - prevLevelStatsNeeded));
        const xpPercentage = Math.min(100, Math.max(0, Math.round((xpProgress / 8) * 100)));

        // Level Title
        let levelTitle = "乡村义武贤";
        if (playerLevel >= 25) levelTitle = "九汉天命圣皇 👑";
        else if (playerLevel >= 18) levelTitle = "中兴大司马辅国将 ⚔️";
        else if (playerLevel >= 12) levelTitle = "威威安邦大刺史 📜";
        else if (playerLevel >= 6) levelTitle = "建义偏将虎臣侯 🛡️";
        else levelTitle = "涿郡结发义功首 🌾";

        // SVG math coordinate builders for dynamic player radar chart
        const playerGetCoords = (val: number, idx: number) => {
          const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / 5;
          const r = (val / 100) * 75; // Max radius 75
          return {
            x: 100 + r * Math.cos(angle),
            y: 100 + r * Math.sin(angle)
          };
        };

        const gridRings = [20, 40, 60, 80, 100];
        const spokeLabels = [
          { text: "武力", idx: 0, dx: 0, dy: -8 },
          { text: "智力", idx: 1, dx: 14, dy: 3 },
          { text: "统帅", idx: 2, dx: 10, dy: 14 },
          { text: "政治", idx: 3, dx: -10, dy: 14 },
          { text: "德行", idx: 4, dx: -14, dy: 3 },
        ];

        const pts = [
          playerGetCoords(playerStats.force, 0),
          playerGetCoords(playerStats.intelligence, 1),
          playerGetCoords(playerStats.leadership, 2),
          playerGetCoords(playerStats.politics, 3),
          playerGetCoords(playerStats.virtue, 4),
        ];
        const playerPolygon = pts.map(p => `${p.x},${p.y}`).join(' ');

        return (
          <div className="fixed inset-0 bg-artistic-charcoal/85 backdrop-blur-xs flex items-center justify-center p-4 z-[150] animate-fade-in text-[#2a2319]">
            <div className="bg-[#fcfaf2] border-4 border-double border-artistic-charcoal max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-ink font-serif text-left">
              
              {/* Jade seal watermark background */}
              <div className="absolute top-2 right-2 text-6xl opacity-[0.04] pointer-events-none select-none font-sans font-black">
                漢
              </div>

              {/* Header block */}
              <div className="border-b-2 border-artistic-charcoal pb-3.5 mb-4 text-center">
                <button
                  type="button"
                  onClick={() => { sfx.playClick(); setShowPlayerModal(false); }}
                  className="absolute top-4 right-4 text-stone-400 hover:text-artistic-crimson transition-all cursor-pointer border border-stone-300 hover:border-artistic-crimson bg-[#fcfaf2] w-6 h-6 flex items-center justify-center"
                  title="合案归本"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] bg-[#5c0f11] text-[#f2e6d0] px-3 py-0.5 tracking-widest font-black uppercase mb-1 inline-block">
                  汉室中兴册勋底卷
                </span>
                <h3 className="text-xl font-serif font-black text-artistic-charcoal flex justify-center items-center gap-1 mt-1">
                  ⚔️ {playerStats.name}（字 {playerStats.courtesyName}）
                </h3>
                <p className="text-[10.5px] text-stone-500 font-serif font-bold mt-1">
                  当前勋爵官衔: <span className="text-artistic-crimson">【{playerStats.title || "布衣义勇校尉"}】</span>
                </p>
              </div>

              {/* Grid split: Radar and stats details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                {/* Visual Player Radar Plot SVG */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-[200px] h-[200px] bg-white border border-stone-300/40 p-1 rounded-none shadow-inner relative flex items-center justify-center">
                    <svg viewBox="0 0 200 200" className="w-[190px] h-[190px]">
                      {/* Grid concentric rings */}
                      {gridRings.map(v => {
                        const rPoints = [];
                        for (let i = 0; i < 5; i++) {
                          const pc = playerGetCoords(v, i);
                          rPoints.push(`${pc.x},${pc.y}`);
                        }
                        return (
                          <polygon
                            key={v}
                            points={rPoints.join(' ')}
                            fill="none"
                            stroke="#e5dbca"
                            strokeWidth="0.7"
                            strokeDasharray="2,2"
                          />
                        );
                      })}

                      {/* Axis lines */}
                      {[0,1,2,3,4].map(i => {
                        const end = playerGetCoords(100, i);
                        return (
                          <line
                            key={i}
                            x1="100"
                            y1="100"
                            x2={end.x}
                            y2={end.y}
                            stroke="#e5dbca"
                            strokeWidth="0.8"
                          />
                        );
                      })}

                      {/* Solid polygon area fill for Player Stats */}
                      <polygon
                        points={playerPolygon}
                        fill="rgba(139, 0, 0, 0.16)"
                        stroke="#8b0000"
                        strokeWidth="1.8"
                      />

                      {/* Vertex circles indicator */}
                      {pts.map((p, i) => (
                        <circle
                          key={i}
                          cx={p.x}
                          cy={p.y}
                          r="3"
                          fill="#8b0000"
                          stroke="#ffffff"
                          strokeWidth="1"
                        />
                      ))}

                      {/* Text text nodes */}
                      {spokeLabels.map(l => {
                        const borderPt = playerGetCoords(114, l.idx);
                        return (
                          <text
                            key={l.text}
                            x={borderPt.x + l.dx}
                            y={borderPt.y + l.dy}
                            textAnchor="middle"
                            className="fill-stone-700 text-[10px] font-serif font-black"
                          >
                            {l.text}
                          </text>
                        );
                      })}
                    </svg>
                  </div>
                  <span className="text-[9px] text-[#5c0f11]/70 font-mono mt-1 font-bold">主公五维天资雷达星象图</span>
                </div>

                {/* Sub attributes and leveling panel */}
                <div className="space-y-3.5 bg-[#faf5ec]/80 border border-stone-300/40 p-3 rounded-none">
                  {/* Level system card */}
                  <div className="border-b border-stone-300 pb-2 flex gap-2.5 items-center">
                    <div className="w-11 h-11 bg-[#8b0000] text-amber-100 border-2 border-stone-800 flex flex-col items-center justify-center shrink-0 shadow-sm leading-none rounded-none">
                      <span className="text-[8px] font-sans">勋位</span>
                      <span className="text-base font-serif font-black">{playerLevel}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] text-stone-500 uppercase font-bold leading-none">勋略天威等阶 (Level)</div>
                      <h4 className="font-serif font-black text-stone-850 text-xs mt-0.5 truncate">{levelTitle}</h4>
                      
                      {/* XP Bar Progress */}
                      <div className="mt-1 flex items-center gap-1 text-[9px] font-mono text-stone-500">
                        <div className="flex-1 bg-stone-200 h-1.5 rounded-none border border-stone-300 overflow-hidden relative">
                          <div className="bg-[#8b0000] h-full transition-all duration-300" style={{ width: `${xpPercentage}%` }}></div>
                        </div>
                        <span className="shrink-0 font-bold text-stone-700">{xpProgress}/8 魄</span>
                      </div>
                    </div>
                  </div>

                  {/* Attributes Progression Grids */}
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between items-center border-b border-dashed border-stone-300/60 pb-0.5">
                      <span className="font-serif text-stone-600 font-bold">武力 (斗斩锋刃)</span>
                      <span className="font-sans font-bold text-red-800">{playerStats.force} / 100</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-dashed border-stone-300/60 pb-0.5">
                      <span className="font-serif text-stone-600 font-bold">智力 (计策奇谋)</span>
                      <span className="font-sans font-bold text-blue-800">{playerStats.intelligence} / 100</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-dashed border-stone-300/60 pb-0.5">
                      <span className="font-serif text-stone-600 font-bold">统帅 (三军调兵)</span>
                      <span className="font-sans font-bold text-emerald-800">{playerStats.leadership} / 100</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-dashed border-stone-300/60 pb-0.5">
                      <span className="font-serif text-stone-600 font-bold">政治 (屯垦吏治)</span>
                      <span className="font-sans font-bold text-amber-800">{playerStats.politics} / 100</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-dashed border-stone-300/60 pb-0.5">
                      <span className="font-serif text-stone-600 font-bold">德行 (纳贤抚民)</span>
                      <span className="font-sans font-bold text-purple-800">{playerStats.virtue} / 100</span>
                    </div>
                  </div>

                  <p className="text-[9px] text-[#5c0f11] bg-amber-50 border border-amber-200/50 p-1 font-serif leading-snug">
                    💡 提示: 主公在“内政”中耕耘、在“寻访奇遇”中修行，或通过推进“史册主线”获得属性增幅。每提升 8 点任意属性即可唤醒一阶兵略等功勋级！
                  </p>
                </div>
              </div>

              {/* Status details footer cards */}
              <div className="mt-4 pt-3.5 border-t border-dashed border-stone-300 grid grid-cols-2 gap-3 text-xs leading-normal">
                <div className="bg-[#fcf8f0] p-2 border border-stone-300/40 font-serif">
                  <div className="text-[10px] text-stone-500">军中声威与民气</div>
                  <div className="text-[11px] font-bold text-stone-850 mt-0.5">👑 名门声望: <span className="font-mono text-amber-900 font-black">{playerStats.prestige}</span></div>
                  <div className="text-[11px] font-bold text-stone-850">👥 黎民爱戴: <span className="font-mono text-emerald-800 font-black">{playerStats.popularity}</span></div>
                </div>
                <div className="bg-[#fcf8f0] p-2 border border-stone-300/40 font-serif">
                  <div className="text-[10px] text-stone-500">岁星历律载入</div>
                  <div className="text-[11px] font-bold text-stone-850 mt-0.5">📅 当前历法: 公元 {playerStats.year} 年</div>
                  <div className="text-[11px] font-bold text-stone-850">🍂 旬节天象: {playerStats.month}月候旬</div>
                </div>
              </div>

              {/* Sovereign quote */}
              <p className="text-[10px] text-stone-550 font-serif italic text-center mt-3.5 border-t border-stone-200 pt-2.5">
                “兵民之本，在乎修己。兴义兵，靖烟尘，愿天下苍生尽开颜！”
              </p>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => { sfx.playClick(); setShowPlayerModal(false); }}
                  className="w-full bg-[#5c0f11] hover:bg-artistic-crimson text-[#f2e6d0] text-xs font-serif font-black py-2.5 px-3 border border-transparent rounded-none transition-all cursor-pointer text-center"
                >
                  合册束案 (归衙掌政)
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* Easter Egg / Cheat Code Entrance Prompt */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-artistic-charcoal/85 backdrop-blur-xs flex items-center justify-center p-4 z-[150] animate-fade-in">
          <div className="bg-[#ede0c5] border-4 border-artistic-charcoal max-w-sm w-full p-6 shadow-2xl relative">
            <h4 id="cheat-dlg-title" className="font-serif font-black text-lg text-artistic-crimson border-b border-artistic-charcoal pb-2 mb-3">
              🔓 汉陵地库秘密关钥校验
            </h4>
            <p className="font-serif text-xs text-stone-700 leading-relaxed mb-4">
              主公开拔在涿郡古陵之中，寻得一盒密印。请输入八字神符策码（提示：“上上下下左左右右”）：
            </p>
            <input 
              id="cheat-passwd-input"
              type="text"
              placeholder="请输入八字神策(上上下下...)"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-artistic-bg border-2 border-artistic-charcoal p-2.5 rounded-none font-serif text-xs mb-4 text-[#2a2319] focus:outline-none focus:border-artistic-crimson"
            />
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 bg-artistic-charcoal hover:bg-emerald-800 text-artistic-bg text-xs font-serif font-bold py-2 px-3 border border-transparent rounded-none transition-all cursor-pointer text-center"
                onClick={() => {
                  sfx.playClick();
                  if (passwordInput === '上上下下左左右右') {
                    setTestModeActive(true);
                    showToast("【昭雪密令】神策校验无误！密洞石门隆隆开启，调试台/作弊面板已在右下端亮起！");
                  } else {
                    setTestModeActive(false);
                    // Reset stats as backup if they fail
                    setPlayerStats(prev => ({
                      ...prev,
                      gold: Math.max(10, prev.gold - 50),
                      prestige: Math.max(10, prev.prestige - 10)
                    }));
                    showToast("【古印异变】密印对答有误，阴风吹散了你的军营黄金及名声！");
                  }
                  setShowPasswordModal(false);
                  setSanCount(0);
                  setGuoCount(0);
                }}
              >
                解开秘印
              </button>
              <button
                type="button"
                className="flex-grow bg-transparent hover:bg-artistic-charcoal/10 text-artistic-charcoal text-xs font-serif font-bold py-2 px-3 border border-artistic-charcoal rounded-none transition-all cursor-pointer text-center"
                onClick={() => {
                  sfx.playClick();
                  setShowPasswordModal(false);
                  setSanCount(0);
                  setGuoCount(0);
                }}
              >
                藏之不启
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic historical timeline anomaly comparison modal popup */}
      {selectedConflictRecord && (
        <div className="fixed inset-0 bg-artistic-charcoal/85 backdrop-blur-xs flex items-center justify-center p-4 z-[160] animate-fade-in text-left">
          <div className="bg-[#ede0c5] border-4 border-[#5c0f11] max-w-lg w-full p-6 shadow-2xl relative">
            <div className="absolute top-0 right-0 bg-[#5c0f11] text-white text-[9px] px-2.5 py-1 font-serif font-black tracking-widest uppercase">
              因果坍缩警示
            </div>
            
            <button
               type="button"
               onClick={() => {
                 sfx.playClick();
                 setSelectedConflictRecord(null);
               }}
               className="absolute top-4 right-4 text-stone-600 hover:text-artistic-crimson font-bold text-lg cursor-pointer"
            >
               ✕
            </button>

            <div className="border-b-2 border-[#5c0f11] pb-3 mb-4 text-left">
              <span className="text-[9.5px] bg-artistic-charcoal text-white px-2 py-0.5 font-bold uppercase tracking-wider font-mono">
                🪐 NON-LINEAR TEMP CONTRAST
              </span>
              <h3 className="font-serif font-black text-xl text-artistic-crimson mt-2 leading-tight flex items-center gap-1.5">
                🔮 史册变轨：正史因果偏逸详情
              </h3>
            </div>

            <div className="space-y-4 font-serif text-stone-900 text-xs leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div className="bg-[#f0dfcc] p-3 border border-amber-800/20 rounded-none">
                <p className="font-extrabold text-[#5c0f11] border-b border-amber-800/10 pb-1 mb-1.5 text-[11px] uppercase tracking-wider">
                  🕰️ 当前改命因果谱系
                </p>
                <div className="grid grid-cols-2 gap-2 text-center text-[10.5px]">
                  <div className="bg-red-500/10 p-2 border border-red-900/10">
                    <div className="font-bold text-artistic-crimson">异常并存纪年</div>
                    <span className="font-mono font-black text-rose-950 text-xs">大变局 {selectedConflictRecord.currentYear} 年分</span>
                  </div>
                  <div className="bg-amber-500/15 p-2 border border-amber-900/15">
                    <div className="font-bold text-amber-950">关联冲突之谜</div>
                    <span className="font-sans font-black text-amber-900 text-[10px]">{selectedConflictRecord.pairEvent}</span>
                  </div>
                </div>
              </div>

              <div className="border border-stone-300 bg-white p-3 space-y-2.5 rounded-none shadow-inner">
                <div className="font-bold text-stone-850 flex items-center gap-1">
                  <span className="text-sm">🛡️</span>
                  <span>真实正史原本时空：</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-stone-200 pb-2 text-[10.5px]">
                  <div>
                    <span className="font-bold text-stone-500">关羽受困麦城正史:</span>
                    <p className="font-mono text-xs text-artistic-crimson font-bold mt-0.5">公元 219 年</p>
                  </div>
                  <div>
                    <span className="font-bold text-stone-500">诸葛亮五丈原正史:</span>
                    <p className="font-mono text-xs text-amber-700 font-bold mt-0.5">公元 234 年</p>
                  </div>
                </div>
                <p className="text-[10.5px] text-stone-600 leading-normal italic">
                  正史昭示，此两大战史惨剧横跨刘备称汉中王与六出祁山多载，绝无共时触发。
                </p>
              </div>

              <div className="bg-emerald-500/5 p-3 border border-emerald-900/15 rounded-none">
                <p className="font-extrabold text-emerald-800 mb-1 leading-snug">
                  🌌 重叠交错影响（天数改易注记）：
                </p>
                <p className="text-[11px] leading-relaxed text-stone-800">
                  {selectedConflictRecord.conflictReason}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-artistic-charcoal/40 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  sfx.playClick();
                  setSelectedConflictRecord(null);
                }}
                className="bg-artistic-charcoal hover:bg-artistic-crimson text-[#f2e6d0] font-bold text-xs py-2 px-6 rounded-none transition-colors cursor-pointer"
              >
                领悟并抚平裂隙
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial / Game Guide Modal */}
      {showTutorialModal && (
        <div className="fixed inset-0 bg-artistic-charcoal/85 backdrop-blur-xs flex items-center justify-center p-4 z-[150] animate-fade-in text-left">
          <div className="bg-[#ede0c5] border-4 border-artistic-charcoal max-w-2xl w-full p-6 md:p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <button
              type="button"
              onClick={() => {
                sfx.playClick();
                setShowTutorialModal(false);
              }}
              className="absolute top-4 right-4 text-stone-600 hover:text-artistic-crimson font-bold text-lg cursor-pointer"
            >
              ✕
            </button>
            
            <div className="text-center pb-4 border-b border-artistic-charcoal/40 mb-6 relative">
              <h3 className="font-serif font-black text-2xl text-artistic-crimson">
                📜 【大印授受】《三国逆变录》玩法神策
              </h3>
              <p className="text-xs text-stone-650 font-serif mt-1">
                授印而治万里，指点山河，为主公一释江山权谋之纲要。
              </p>
            </div>

            <div className="space-y-6 font-serif text-sm text-[#2a2319] leading-relaxed">
              {/* Section 1: Governance */}
              <div className="bg-artistic-cream/70 p-4 border border-artistic-charcoal/30">
                <h4 className="font-bold text-artistic-crimson border-b border-artistic-charcoal/20 pb-1 mb-2.5 flex items-center gap-2">
                  🏛️ 1. 治州内政 & 岁首秋收 (Territory Governance)
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-stone-800">
                  <li><strong>开垦治理</strong>: 消耗黄金提升治州开发值，从而逐年增调该郡的财政税收。</li>
                  <li><strong>天时异象</strong>: 治理卡下方印有四时天气指标（烈日、微雨、寒雪），影响下一次岁首收获。</li>
                  <li><strong>岁秋征粮</strong>: 属于你的核心黄金注入手段。秋收具有一定冷却期，天时佳（微雨、春日）能成倍增加税入，而寒雪与大乱则会导致饥馑歉收。</li>
                </ul>
              </div>

              {/* Section 2: Diplomacy */}
              <div className="bg-artistic-cream/70 p-4 border border-artistic-charcoal/30">
                <h4 className="font-bold text-artistic-crimson border-b border-artistic-charcoal/20 pb-1 mb-2.5 flex items-center gap-2">
                  🤝 2. 诸侯外交 & 纵横捭阖 (Faction Diplomacy)
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-stone-800">
                  <li><strong>势力关系</strong>: 你可以查看大汉各路诸侯（如曹操、刘备等）对你的信任与敌嫌度。</li>
                  <li><strong>纳贡疏通 (Offer Gold)</strong>: 支付一定本金，可高额拉升对敌对势力的关系。</li>
                  <li><strong>互不侵犯条约 (Non-Aggression Pact)</strong>: 当关系缓和（信任度高）时，支付少许黄金，可签订互不侵犯协议，阻截该势力在演义场景中防突袭。</li>
                </ul>
              </div>

              {/* Section 3: Combat */}
              <div className="bg-artistic-cream/70 p-4 border border-artistic-charcoal/30">
                <h4 className="font-bold text-artistic-crimson border-b border-artistic-charcoal/20 pb-1 mb-2.5 flex items-center gap-2">
                  ⚔️ 3. 兵法对阵 & 在野奇遇 (Combat & Questing)
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-stone-800">
                  <li><strong>行军攻占</strong>: 在山河舆图上，可率本部守卫前往相连且已解锁的郡县，收纳为主公辖区。</li>
                  <li><strong>奇遇演义</strong>: 天下大计中散布着诸般奇遇演义。只要游戏时间每进展一日，四海在野剧情或奇遇就会发生州郡上的移防交替，带给你全新历史体验！</li>
                  <li><strong>战防兵损</strong>: 三军阵前折损会在日志中详细列出。你可在将帅府内召纳新卒补充。</li>
                </ul>
              </div>

              {/* Tips */}
              <div className="text-center font-bold text-xs text-artistic-charcoal">
                💡 <strong>军务锦囊</strong>: 三军在途支持点击 <code>Ctrl+S</code> 随时随地快速储存当前大业行纪！
              </div>
            </div>

            <div className="mt-6 text-center border-t border-artistic-charcoal/30 pt-4">
              <button
                type="button"
                className="bg-artistic-charcoal hover:bg-artistic-crimson text-artistic-bg text-sm font-serif font-black py-2.5 px-8 border border-transparent rounded-none transition-all cursor-pointer shadow hover:shadow-lg inline-block text-center"
                onClick={() => {
                  sfx.playClick();
                  setShowTutorialModal(false);
                }}
              >
                躬纳良谋 (朕已悉知)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Hidden/Unlocked Dev Debug HUD Interface */}
      {testModeActive && (
        <div id="tk-dev-hud-panel" className="fixed bottom-4 left-4 z-[90] bg-[#1a120b] border-2 border-[#d4af37] text-[#f2e6d0] p-4 shadow-xl max-w-sm w-full font-serif text-left">
          <div className="flex justify-between items-center border-b border-[#d4af37]/40 pb-1.5 mb-2.5">
            <span className="text-[11px] font-black text-[#d4af37] flex items-center gap-1">
              ⚙️ 军策天幕调度指挥台
            </span>
            <button 
              type="button" 
              onClick={() => setTestModeActive(false)}
              className="text-[#d4af37] text-[10px] hover:text-white px-1.5 border border-[#d4af37]/30"
            >
              隐藏
            </button>
          </div>
          <div className="space-y-2 text-[10px] text-stone-300">
            <div className="flex justify-between">
              <span>当前故事幕 ID (currentSceneId)</span>
              <span className="font-mono text-amber-300 font-bold">{currentSceneId}</span>
            </div>
            <div className="flex justify-between">
              <span>当前故事回 ID (currentChapterId)</span>
              <span className="font-mono text-amber-300 font-bold">{currentChapterId}</span>
            </div>
            
            {/* Quick transition dropdown to any story scene */}
            <div className="pt-2 border-t border-[#d4af37]/20 flex flex-col gap-1">
              <label className="text-[9.5px] text-[#d4af37] font-bold">天命跃迁情景 (Jump Scene):</label>
              <select
                className="bg-[#2a1d13] border border-[#d4af37]/30 text-[#f2e6d0] text-[10px] p-1.5 focus:outline-none"
                value={currentSceneId}
                onChange={(e) => {
                  const targetScene = e.target.value;
                  const scData = GAME_SCENES[targetScene];
                  if (scData) {
                    setCurrentSceneId(targetScene);
                    setCurrentChapterId(scData.chapterId);
                    showToast(`【时空跳转】已将主公乾坤跃迁至情景: [${scData.title}]`);
                  }
                }}
              >
                {Object.keys(GAME_SCENES).map(scId => (
                  <option key={scId} value={scId}>
                    [{scId}] - {GAME_SCENES[scId].title.substring(0, 15)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Resources Instant Cheat adjustment tools */}
            <div className="pt-1.5 grid grid-cols-2 gap-1">
              <button
                type="button"
                className="bg-emerald-800 text-white font-bold text-[9px] py-1 border border-emerald-950"
                onClick={() => {
                  sfx.playFanfare(true);
                  setPlayerStats(prev => ({
                    ...prev,
                    gold: prev.gold + 2000,
                    troops: prev.troops + 5000,
                    prestige: Math.min(100, prev.prestige + 50)
                  }));
                  showToast("【神策作弊】犒赏三军：获得黄金 +2000，精兵 +5000！");
                }}
              >
                💰 纳兵粟饷 (+2k)
              </button>
              <button
                type="button"
                className="bg-yellow-700 text-white font-bold text-[9px] py-1 border border-yellow-900"
                onClick={() => {
                  sfx.playFanfare(true);
                  setPlayerStats(prev => ({
                    ...prev,
                    force: 99,
                    intelligence: 99,
                    leadership: 99,
                    politics: 99,
                    virtue: 99
                  }));
                  showToast("【神策作弊】龙驭九天：主公全能属性全部修证至 99 峰值！");
                }}
              >
                🔥 主公圣境 (全99)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Event CG Artworks Modal (Click to Close) */}
      {currentCG && (
        <div id="cg-modal-overlay" className="fixed inset-0 bg-black/90 flex items-center justify-center p-6 z-[200] animate-fade-in">
          <div className="bg-[#fbfcfa] border-8 border-double border-artistic-charcoal max-w-2xl w-full p-8 shadow-2xl relative text-center font-serif text-artistic-charcoal flex flex-col items-center">
            
            <div className="border-b-2 border-artistic-charcoal pb-4 w-full mb-6">
              <h3 className="font-serif font-black text-2xl tracking-widest text-[#5c0f11]">
                ✦ 华夏绘卷 · 历史CG ✦
              </h3>
              <p className="text-xs text-stone-500 font-mono mt-1">
                PATH: ./image/CG/{currentCG}
              </p>
            </div>

            {/* Canvas fallback for CG illustration file */}
            <div className="w-full h-80 bg-white border-2 border-dashed border-stone-300 flex flex-col items-center justify-center p-4 mb-6 relative overflow-hidden">
              <img 
                src={`./image/CG/${currentCG}`} 
                alt={currentCG}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                className="absolute inset-0 w-full h-full object-cover z-10"
              />
              <div className="flex flex-col items-center justify-center z-0 text-center select-none text-[#5c0f11] p-6">
                <Sparkles className="w-16 h-16 opacity-35 mb-4 text-artistic-crimson" />
                <span className="font-serif font-bold text-xl tracking-wider text-stone-800">
                  【 {currentCG === 'taoyuan_oath.jpg' ? '桃园四杰结同盟' : '卧牛山大破裴元绍'} 】
                </span>
                <p className="text-xs text-stone-500 max-w-md mt-4 leading-relaxed">
                  [ 丹青绘卷 ]：当前本地尚未加载到高清艺术CG原画。系统已在此处铺设了动态自动读取接口，后续只需在电脑的 <span className="font-mono text-xs font-bold text-artistic-crimson">"./image/CG/"</span> 文件夹中放置名为 <span className="font-mono text-xs font-bold text-artistic-crimson">"{currentCG}"</span> 的美术图文件，系统即可实现完美画卷展现！
                </p>
              </div>
            </div>

            <button 
              id="close-cg-modal"
              onClick={() => { sfx.playClick(); setCurrentCG(null); }}
              className="px-8 py-2.5 bg-artistic-crimson border-2 border-artistic-charcoal text-[#fcfaf2] font-black text-sm tracking-widest hover:bg-[#8d1d1f] transition-colors shadow-md cursor-pointer"
            >
              收起画轴 (Close CG)
            </button>
          </div>
        </div>
      )}

      {/* 战役决胜汇报大告 (Battle Summary Modal) */}
      {battleSummary?.show && (
        <div id="battle-summary-modal" className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-[220] animate-fade-in">
          <div className="bg-[#ebd9bc] border-[8px] border-double border-[#5c0f11] max-w-lg w-full p-6 shadow-2xl relative text-center font-serif text-artistic-charcoal flex flex-col items-center">
            {/* Ink Stamp Overlay background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 font-black text-9xl select-none pointer-events-none text-artistic-crimson rotate-12">
              {battleSummary.result === 'VICTORY' ? '大捷' : '惨败'}
            </div>

            {/* Header with retro line decorations */}
            <div className="border-b-2 border-[#5c0f11]/40 pb-3 w-full mb-4">
              <span className="text-[10px] bg-artistic-crimson text-artistic-bg font-mono font-bold px-3 py-1 uppercase tracking-widest block mx-auto max-w-max mb-2 shadow-[1px_1px_0px_#000]">
                ⚔️ {battleSummary.result === 'VICTORY' ? '战役犒赏 · 三军告捷' : '沙场折马 · 虽败犹荣'} ⚔️
              </span>
              <h3 className="font-serif font-black text-2xl tracking-wide text-[#5c0f11]">
                {battleSummary.title}
              </h3>
              <p className="text-[10px] text-stone-600 mt-1 italic">
                “夫战者，动用干戈以正天时，死生之分，存亡之机也。”
              </p>
            </div>

            {/* General Results Stamp */}
            <div className="my-2.5 flex items-center justify-center gap-2">
              <span className={`text-4xl font-black px-6 py-2.5 border-4 border-double uppercase tracking-wider ${
                battleSummary.result === 'VICTORY' 
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-[2px_2px_0px_#115e59]' 
                  : 'border-red-800 bg-red-50 text-red-900 shadow-[2px_2px_0px_#7f1d1d]'
              }`}>
                {battleSummary.result === 'VICTORY' ? '🏆 战役大捷' : '⚠️ 军力败退'}
              </span>
            </div>

            {/* Casualties & Enemies slain details */}
            <div className="w-full bg-[#fcfaf2]/95 border-2 border-[#3d3228]/40 p-4 font-serif text-left space-y-3.5 shadow-inner">
              <div className="grid grid-cols-2 gap-4">
                <div className="border-r border-stone-300 pr-2">
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">📉 我军战役伤亡 (Casualties)</span>
                  <p className="text-xl font-black text-red-800 font-sans mt-0.5">
                    -{battleSummary.troopsLost} <span className="text-xs text-stone-600 font-serif">精卒</span>
                  </p>
                  <span className="text-[9px] text-stone-500 block mt-0.5">
                    包含行军病退、死伤与溃落
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">⚔️ 歼灭敌方生力 (Enemies Defeated)</span>
                  <p className="text-xl font-black text-emerald-800 font-sans mt-0.5">
                    {battleSummary.enemiesDefeated} <span className="text-xs text-stone-600 font-serif">乱寇</span>
                  </p>
                  <span className="text-[9px] text-stone-500 block mt-0.5">
                    重创敌前阵并收纳溃军兵器
                  </span>
                </div>
              </div>

              {/* Specific Tactics contribution as requested */}
              <div className="border-t border-dashed border-stone-300 pt-3">
                <span className="text-[10.5px] font-black text-[#5c0f11] flex items-center gap-1">
                  <span>🗺️</span> 战要析解与克胜战法 (Tactics Log)：
                </span>
                <p className="text-[11px] text-stone-700 leading-relaxed mt-1 italic pl-1">
                  {battleSummary.tacticsUsed}
                </p>
              </div>

              {/* Bonus / XP tip */}
              <div className="text-[9px] text-amber-900 bg-amber-500/10 border border-amber-600/20 p-2 text-center rounded-none italic">
                * 胜负乃兵家常事。此次敌我双方浴血三军，兵法演习功绩得存。
              </div>
            </div>

            {/* Back action */}
            <button 
              onClick={() => {
                sfx.playClick();
                setBattleSummary(null);
              }}
              className="mt-5 w-full py-2.5 bg-[#5c0f11] hover:bg-artistic-crimson border-2 border-artistic-charcoal text-[#fcfaf2] font-black text-sm tracking-widest transition-colors shadow-md cursor-pointer flex justify-center items-center gap-1.5"
            >
              <span>收笔罢课 (确立战报)</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer credits design pattern */}
      <footer className="py-4 text-center text-[10.5px] text-artistic-charcoal border-t border-artistic-charcoal/30 font-serif relative shrink-0">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#3d3228_1px,transparent_1px)] [background-size:12px_12px]"></div>
        <p className="tracking-wide">大漢建安歷 · 紙上書春秋三國志 · 逆改乾坤皆在主公一劍</p>
      </footer>
    </div>
  );
}
