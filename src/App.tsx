/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { PlayerStats, Region, General, SideQuest, HistoryRecord, FactionId } from './types';
import { GAME_CHAPTERS, GAME_SCENES } from './data/chapters';
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
import { sfx } from './utils/audio';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Skull, Sparkles, BookOpen, Map, Landmark, Users, 
  HelpCircle, Archive, RotateCcw, Save, ShieldCheck, 
  Trash2, Award, ShieldAlert, Swords, Quote, Calendar, Coins, Volume2, VolumeX, AlertCircle, Info, X
} from 'lucide-react';

const SAVE_KEY = 'three_kingdoms_retro_alt_save_v2';

export default function App() {
  // --- Game Session State ---
  const [gameState, setGameState] = useState<'INTRO' | 'STORY' | 'MAP' | 'ROSTER' | 'GOV' | 'DIPLOMACY' | 'RANDOM_EVENTS' | 'CIVILIAN_MODS' | 'SIDE_QUESTS' | 'ARCHIVE' | 'ENDING'>('INTRO');
  
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
  const [creationPoints, setCreationPoints] = useState<number>(30);
  const [builderStats, setBuilderStats] = useState({
    force: 60,
    intelligence: 60,
    leadership: 60,
    politics: 60,
    virtue: 60,
  });

  // --- Core Lists ---
  const [recruitedGenerals, setRecruitedGenerals] = useState<string[]>([]);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [activeQuests, setActiveQuests] = useState<string[]>([]);
  const [regions, setRegions] = useState<Region[]>(INITIAL_REGIONS);
  const [currentSceneId, setCurrentSceneId] = useState<string>('c1_0');
  const [currentCG, setCurrentCG] = useState<string | null>(null);

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
  const [soundOn, setSoundOn] = useState<boolean>(false);

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

  // --- Daily Quests Refresh Effect (And updates available quests of the date) ---
  useEffect(() => {
    const isNewDay = playerStats.day !== lastCheckedDate.day || 
                    playerStats.month !== lastCheckedDate.month || 
                    playerStats.year !== lastCheckedDate.year;

    if (isNewDay && playerStats.day > 0) {
      const REGION_IDS = ['zhuojun', 'beihai', 'yecheng', 'luoyang', 'changan', 'xiongnu', 'chengdu', 'xiangyang', 'jianye'];
      
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
      relations: diplomacyRelations,
      questsList,
      lastCheckedDate
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    showToast("【开库奏报】军情行纪已妥善封存入阁，可随时在主屏幕载入！");
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

  const loadGame = () => {
    const cached = localStorage.getItem(SAVE_KEY);
    if (!cached) {
      showToast("内廷尚无旧大业底案，快开启你的一世传奇吧！");
      return;
    }
    try {
      const data = JSON.parse(cached);
      setPlayerStats(data.stats);
      setRecruitedGenerals(data.recruitedGenerals || []);
      setCompletedQuests(data.completedQuests || []);
      setActiveQuests(data.activeQuests || []);
      setRegions(data.regions || INITIAL_REGIONS);
      setCurrentSceneId(data.currentSceneId || 'c1_0');
      setCurrentChapterId(data.currentChapterId || 'c1');
      setHistoryRecords(data.historyRecords || []);
      setTaxCooldown(data.taxCooldown !== undefined ? data.taxCooldown : false);
      setPlayerLocation(data.playerLocation || 'zhuojun');
      setExploredRegions(data.exploredRegions || ['zhuojun']);
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
      showToast("【旧案调阅】成功寻回原定乾坤行纪。主公，还请再度发敕！");
    } catch (e) {
      showToast("读取大业案底时发生绌，档案可能有所污损。");
    }
  };

  const clearSave = () => {
    setConfirmBox({
      message: "确定要烧毁在朝所有履历，彻底归野遁入虚无吗？此行将洗去所有大业细节。",
      onConfirm: () => {
        localStorage.removeItem(SAVE_KEY);
        // Reset State
        setGameState('INTRO');
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
        setCreationPoints(30);
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
        setRegions(INITIAL_REGIONS);
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
        showToast("📿 已烧毁在朝履历，尘埃落定归于江湖。");
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
    let startingTroops = 0;

    if (playerStats.difficulty === 'easy') {
      startingGold = 1000;
    } else if (playerStats.difficulty === 'hard') {
      startingGold = 250;
    }
    
    const initialStats: PlayerStats = {
      ...playerStats,
      force: builderStats.force,
      intelligence: builderStats.intelligence,
      leadership: builderStats.leadership,
      politics: builderStats.politics,
      virtue: builderStats.virtue,
      troops: startingTroops,
      gold: startingGold,
      prestige: 0,
      popularity: 100,
      year: 177,
      month: 1,
      day: 1,
      deviance: 0,
      title: '乡村义士首'
    };

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
      message: `🚩 乱世风雨急，主公 ${initialStats.name}（字 ${initialStats.courtesyName}）在涿郡结发募军，开启匡扶天下之路！【开局难度: ${
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
      isAltered: false
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
        const change = effect.statChanges[key];
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

  const handleProceedOutcome = () => {
    if (!lastOutcome) return;
    sfx.playClick();

    const nextId = lastOutcome.nextSceneId;
    const finalStats = lastOutcome.resultingStats;

    // 1. Commit player statistics changes
    setPlayerStats(finalStats);

    // 2. Archive history records if this was isAltered or significant
    const sceneData = GAME_SCENES[currentSceneId];
    if (sceneData) {
      // Find if we altered history
      const prevStats = lastOutcome.initialStats;
      const altered = finalStats.deviance > prevStats.deviance;
      
      const newRec: HistoryRecord = {
        id: `rec_${Date.now()}`,
        timestamp: `公元${finalStats.year}年${finalStats.month}月`,
        title: sceneData.title,
        brief: lastOutcome.narration,
        isAltered: altered
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
    
    setPlayerStats(prev => {
      const advanced = advanceTime(6, prev);
      return {
        ...prev,
        ...advanced,
        gold: Math.max(0, prev.gold - 25)
      };
    });
    
    const rName = regions.find(r => r.id === regionId)?.name || '';
    const dateStr = `公元${playerStats.year}年${playerStats.month}月${playerStats.day}日`;
    
    const travelLog = {
      id: `travel_${Date.now()}`,
      chapterId: currentChapterId,
      timestamp: dateStr,
      message: `🐎 【急行营军】主公率轻骑精兵急行军 6 日，进驻于地区【${rName}】。军饷调拨扣除 -25 黄金。`,
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
    setPlayerStats(prev => {
      const advanced = advanceTime(3, prev);
      return {
        ...prev,
        ...advanced,
        gold: prev.gold + totalGoldHarvested
      };
    });
    setTaxCooldown(true);
    
    const dateStr = `公元${playerStats.year}年${playerStats.month}月${playerStats.day}日`;
    const msg = {
      id: `tax_${Date.now()}`,
      chapterId: currentChapterId,
      timestamp: dateStr,
      message: `💰 【秋收征赋】合辖内各郡税司集征 3 日，一共秋收黄金粮款 +${totalGoldHarvested} 缴归司库！`,
      type: 'gain' as const
    };
    setBattleLogs(prev => [msg, ...prev]);
  };

  // --- Complete Quest status rewards ---
  const handleQuestComplete = (questId: string, status: 'COMPLETED' | 'FAILED', rewards?: any, lossTroops?: number) => {
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
      setPlayerStats(nextStats);

      // Faction capture on success
      const questData = questsList.find(q => q.id === questId);
      if (questData) {
        setRegions(prev => prev.map(r => r.id === questData.targetRegionId ? { ...r, faction: 'PLAYER' } : r));
      }
    } else {
      // Deduct troops casualty on fail
      if (lossTroops) {
        setPlayerStats(prev => ({
          ...prev,
          troops: Math.max(100, prev.troops - lossTroops)
        }));
      }
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

          <div className="text-right">
            <div className="text-sm md:text-2xl font-bold mb-1 font-serif text-artistic-charcoal">
              {gameState === 'INTRO' ? '汉光和元年' : `公元 ${playerStats.year}年${playerStats.month}月${playerStats.day}日`}
            </div>
            <div className="text-[10px] md:text-xs tracking-widest bg-artistic-charcoal text-artistic-bg px-2.5 py-1 inline-block select-none font-mono">
              {gameState === 'INTRO' ? '西元 177 年 · 涿郡' : `${activeChapter.num} · ${regions.find(r => r.id === playerLocation)?.name || '涿郡'}`}
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Game Core wrapper grid --- */}
      {gameState === 'INTRO' ? (
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

              {/* Character stats distributor */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold font-serif text-artistic-charcoal tracking-wide uppercase">
                    分配主公将星属性：
                  </h3>
                  <span className="text-xs bg-artistic-crimson/10 text-artistic-crimson font-bold font-mono px-2.5 py-0.5 border border-artistic-crimson/20">
                    可分配底子点数: {creationPoints}
                  </span>
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
              <div className="font-mono font-bold text-artistic-crimson text-lg flex items-center gap-1.5">
                <Users className="w-4 h-4 text-artistic-crimson" />
                {playerStats.troops.toLocaleString()}人
              </div>
            </div>

            {/* Gold node */}
            <div className="border-r border-artistic-charcoal/25 pr-2">
              <div className="font-serif text-[10.5px] text-artistic-charcoal/80 uppercase">库府钱粮储备：</div>
              <div className="font-mono font-bold text-artistic-ink text-lg flex items-center gap-1.5">
                <Coins className="w-4.5 h-4.5 text-artistic-charcoal/80" />
                {playerStats.gold.toLocaleString()}金
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
                    <div className="bg-artistic-cream/60 p-3 rounded-none border border-artistic-charcoal/20 text-[11.5px] text-artistic-charcoal opacity-95 font-serif leading-relaxed mb-6">
                      <strong className="text-artistic-crimson block mb-0.5 font-bold">【大青史同轨底案对比】</strong>
                      {activeScene.historicalFact}
                    </div>
                  </div>

                  {/* Operational Decision selection matrix */}
                  <div className="border-t border-artistic-charcoal pt-4">
                    <h4 className="text-xs font-serif font-bold text-artistic-crimson mb-3 tracking-widest uppercase">
                      ♟️ 主公，请即刻布发军策玺令对策：
                    </h4>
                    
                    {activeScene.options && activeScene.options.length > 0 ? (
                      <div className="space-y-3">
                        {activeScene.options.map((opt, oIdx) => {
                          const hasReq = opt.requirement !== undefined;
                          const symbols = ['甲', '乙', '丙', '丁', '戊', '己'];
                          const symbol = symbols[oIdx] || '癸';
                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleOptionSelect(opt)}
                              className="w-full text-left bg-artistic-bg border-2 border-artistic-charcoal hover:bg-[#ede0c5]/25 p-4 text-xs md:text-sm tracking-wide font-serif transition-all duration-200 flex items-center relative cursor-pointer"
                            >
                              <span className="w-8 h-8 border border-artistic-charcoal flex items-center justify-center mr-4 font-bold shrink-0 text-artistic-charcoal bg-artistic-bg">
                                {symbol}
                              </span>
                              <div className="flex-1 flex justify-between items-center pr-2">
                                <span className="font-bold text-artistic-ink leading-normal">
                                  {opt.text}
                                </span>
                                {hasReq && (
                                  <span className="text-[10px] text-artistic-crimson bg-artistic-crimson/10 border border-artistic-crimson/20 rounded px-1.5 py-0.5 shrink-0 font-bold ml-2">
                                    【判定】
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
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
                  <div className="bg-artistic-bg border-4 border-artistic-charcoal rounded-none p-5 shadow-sm flex flex-col justify-between min-h-[300px]">
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
                              "黄金趋势": runningGoldChange
                            };
                          });

                          // Ensure we have a default baseline if no logs
                          if (historyPoints.length === 0) {
                            return [
                              { name: "初始", "兵马趋势": 0, "黄金趋势": 500 }
                            ];
                          }
                          return historyPoints;
                        })();

                        return (
                          <div id="battle-attrition-summary" className="mt-3.5 pt-3.5 border-t border-dashed border-artistic-charcoal/30 text-left text-[10px] font-serif bg-artistic-cream/70 p-2.5 rounded-none shadow-xs">
                            <div className="font-bold border-b border-artistic-charcoal/20 pb-1 mb-1.5 text-stone-900 flex justify-between tracking-wide">
                              <span>📊 麾下本章损益与历史趋势 (Chapter Attrition & Trend)</span>
                              <span className="text-artistic-crimson font-black">时政盘点</span>
                            </div>
                            <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-stone-700">
                              <div className="flex justify-between items-center">
                                <span>💀 战场战损兵马:</span>
                                <span className="font-mono text-red-700 font-bold">-{troopsLost}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>💂‍♂️ 增纳补给兵士:</span>
                                <span className="font-mono text-emerald-700 font-bold">+{troopsGained}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>💸 军用学资黄金:</span>
                                <span className="font-mono text-stone-600 font-bold">-{goldSpent}</span>
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
                                      contentStyle={{ backgroundColor: '#fcfaf2', border: '1px solid #78716c', fontSize: '9px', padding: '4px' }}
                                      labelStyle={{ fontWeight: 'bold', color: '#5c0f11' }}
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
              />
            )}

            {gameState === 'ROSTER' && (
              <GeneralRoster
                recruitedIds={recruitedGenerals}
                playerStats={playerStats}
                onRecruitGeneral={handleRecruitGeneral}
                onTrainGeneral={handleTrainGeneral}
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

                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 scrollbar-ink">
                  {historyRecords.length > 0 ? (
                    historyRecords.map((rec) => {
                      const matchingScene = Object.values(GAME_SCENES).find(sc => sc.title === rec.title);
                      const originalFact = matchingScene
                        ? matchingScene.historicalFact
                        : (rec.id === 'intro_act'
                          ? '公元177年，大汉灵帝熹平之年，十常侍专权，民不聊生，黄巾起义暗流涌动。昭烈帝刘备此时仍蛰居于幽州涿县，奉母尽孝，以贩织草鞋、草席为业，潜志待时。'
                          : '大汉史册未尽详录，此演义奇事见证了主公踏入乱世，大展奇谋，逆改命轨之传奇篇章。');
                      const isFactExpanded = !!expandedHistoryFacts[rec.id];

                      return (
                        <div key={rec.id} className="bg-artistic-cream p-4 rounded-none border-l-4 border-artistic-crimson border-y border-r border-artistic-charcoal/40 shadow-sm transition-all text-left">
                          <div className="flex justify-between items-start mb-1 gap-2 flex-wrap">
                            <span className="text-xs font-mono font-bold text-artistic-bg bg-artistic-charcoal px-1.5 py-0.5">
                              {rec.timestamp}
                            </span>
                            <div className="flex items-center gap-2">
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
                      );
                    })
                  ) : (
                    <div className="py-12 text-center text-xs text-artistic-charcoal/60 italic font-serif">
                      编年简牍尚为空白。快去推进主线、平寇除凶、建立万世不易之勋吧！
                    </div>
                  )}
                </div>
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
                  <div className="flex justify-center gap-6 text-xs font-serif bg-artistic-bg p-3 border border-artistic-charcoal/40">
                    <div>
                      <div className="text-artistic-charcoal opacity-70">一世天命扭转值</div>
                      <div className="font-mono text-base font-bold text-artistic-crimson">{playerStats.deviance}%</div>
                    </div>
                    <div>
                      <div className="text-artistic-charcoal opacity-70">麾下名将英豪</div>
                      <div className="font-mono text-base font-bold text-artistic-charcoal">{recruitedGenerals.length}员</div>
                    </div>
                  </div>

                  <button
                    onClick={clearSave}
                    className="bg-artistic-charcoal hover:bg-artistic-crimson text-artistic-bg py-2 px-6 rounded-none font-serif font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    重新参悟天理 · 重置大业
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
                  className="w-full text-left bg-artistic-bg border border-artistic-charcoal hover:bg-[#ede0c5] p-3 text-xs md:text-sm font-serif transition duration-200 flex items-start gap-3 cursor-pointer"
                >
                  <span className="w-6 h-6 border border-artistic-charcoal flex items-center justify-center font-bold text-[10px] shrink-0 bg-artistic-cream">
                    {oIdx === 0 ? '壹' : '贰'}
                  </span>
                  <span className="font-bold text-stone-800 flex-1 leading-snug">{opt.text}</span>
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

      {/* Footer credits design pattern */}
      <footer className="py-4 text-center text-[10.5px] text-artistic-charcoal border-t border-artistic-charcoal/30 font-serif relative shrink-0">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#3d3228_1px,transparent_1px)] [background-size:12px_12px]"></div>
        <p className="tracking-wide">大漢建安歷 · 紙上書春秋三國志 · 逆改乾坤皆在主公一劍</p>
      </footer>
    </div>
  );
}
