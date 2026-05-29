/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 势力归属表示
export type FactionId = 'PLAYER' | 'HAN' | 'CAOCAO' | 'LIUBEI' | 'SUNQUAN' | 'YELLOW_TURBAN' | 'DONGZHUO' | 'XIONGNU' | 'JIN';

// 玩家基本属性
export interface PlayerStats {
  name: string;
  courtesyName: string; // 字
  title: string;        // 官职/称号 (如：义勇军小校、偏将军、汉中王、汉室天子)
  force: number;        // 武力
  intelligence: number; // 智力
  leadership: number;   // 统帅
  politics: number;     // 政治
  virtue: number;       // 德行
  troops: number;       // 兵力
  gold: number;         // 黄金钱粮
  prestige: number;     // 地方声望
  popularity: number;   // 地方民声 (民声)
  year: number;         // 游戏年份 (初始 177 年)
  month: number;        // 游戏月份 (1-12)
  day: number;          // 游戏日子 (1-30)
  difficulty: 'easy' | 'normal' | 'hard'; // 难度
  deviance: number;     // 历史扭转度 (%)
}

// 历史武将信息
export interface General {
  id: string;
  name: string;
  avatar: string;       // 头像拼音或简写
  force: number;        // 武力
  intelligence: number; // 智力
  leadership: number;   // 统帅
  politics: number;     // 政治
  virtue: number;       // 德行
  loyalty: number;      // 忠诚度 (0-100)
  level: number;        // 等级
  exp: number;          // 经验值
  skill: string;        // 特有技能/战法名称
  skillDesc: string;    // 战法描述
  biography: string;    // 传记
  status: 'GARRISON' | 'GUARD' | 'FREE'; // 状态
  recruitCost: number;  // 招募需要消耗的钱粮/声望
}

// 地区/据点信息
export interface Region {
  id: string;
  name: string;
  faction: FactionId;   // 当前占领势力
  x: number;            // SVG 地图 X 坐标 (百分比 0-100)
  y: number;            // SVG 地图 Y 坐标 (百分比 0-100)
  description: string;  // 城市简介
  development: number;  // 农业/商业开发度 (0-100)
  garrison: number;     // 驻守兵力
  revenue: number;      // 每回合钱粮产出
  connected: string[];  // 连接的其他城市 ID
}

// 剧情选项的效果定义
export interface OptionEffect {
  statChanges?: Partial<PlayerStats>; // 属性资源的变动
  addGeneral?: string;               // 获得武将 ID
  removeGeneral?: string;            // 失去武将 ID
  triggerQuest?: string;             // 触发支线任务 ID
  changeFaction?: {                  // 改变地区控制势力
    regionId: string;
    faction: FactionId;
  };
  addDeviance?: number;              // 增加历史扭转度
  title?: string;                    // 玩家官职/称号改动
  customLog?: string;                // 自定义历史演义文本记录
  nextSceneId?: string;              // 下一个情景的 ID (如果有定制分支)
}

// 剧情选项
export interface StoryOption {
  id: string;
  text: string;                      // 选项文字
  requirement?: {                    // 选择此选项的前置要求
    attribute?: keyof PlayerStats;
    minVal?: number;
    neededGeneral?: string;          // 必须拥有特定武将
    neededGold?: number;
    neededTroops?: number;
  };
  effect: OptionEffect;              // 选择后的影响
  nextSceneId: string;               // 默认关联的下一个情景 ID
}

// 剧情情景（节点）
export interface StoryScene {
  id: string;
  chapterId: string;
  title: string;                     // 节点大标题/小标
  year: number;                      // 对应发生年份
  narration: string;                 // 旁白/文本描述
  historicalFact: string;            // 历史原本的真实走向（给玩家对比用）
  options: StoryOption[];            // 可选方案
  backgroundImage?: string;          // 可选背景图
  cgImage?: string;                  // CG图片名称 (触发时自动播放带有CG名字的白色窗口，可点击关闭)
}

// 游戏主线章节
export interface Chapter {
  id: string;
  num: string;                       // 第几章
  title: string;                     // 章节名字
  period: string;                    // 时间跨度 (180-184等)
  startSceneId: string;              // 章节起始节点 ID
  desc: string;                      // 章节导语
}

// 支线任务
export interface SideQuest {
  id: string;
  title: string;
  description: string;
  hint: string;                      // 提示
  status: 'LOCKED' | 'AVAILABLE' | 'ACTIVE' | 'COMPLETED' | 'FAILED';
  targetRegionId: string;            // 任务发生的城市
  rewardDesc: string;                // 奖励描述
  requirement?: {
    force?: number;
    intelligence?: number;
    prestige?: number;
  };
  reward: {
    gold?: number;
    troops?: number;
    prestige?: number;
    deviance?: number;
    generalId?: string;              // 奖励武将
    intelligence?: number;           // 奖励智力属性
  };
  // 支线挑战的分支
  dialogue: {
    intro: string;
    challenge: string;
    choices: Array<{
      text: string;
      successRate: string; // 显示概率如 "80% (武力)" 或 "智力判定"
      checkType: 'force' | 'intelligence' | 'gold' | 'guaranteed';
      threshold?: number;
      success: {
        narration: string;
        rewardMultiplier: number; // 成功加成
      };
      failure: {
        narration: string;
        lossTroops?: number;
      };
    }>;
  };
}

// 历史大事记 / 更改的历史节点
export interface HistoryRecord {
  id: string;
  timestamp: string;  // 游戏内年份
  title: string;      // 事件名称
  brief: string;      // 怎么改变的历史，写下的志书
  isAltered: boolean; // 是否成功偏离了真实历史 (逆天改命)
}

// 存档结构
export interface SaveData {
  stats: PlayerStats;
  recruitedGenerals: string[];
  completedQuests: string[];
  activeQuests: string[];
  regions: Record<string, FactionId>;
  unlockedScenes: string[];
  currentSceneId: string;
  currentChapterId: string;
  historyRecords: HistoryRecord[];
}
