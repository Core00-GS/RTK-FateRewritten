/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GameAchievement {
  id: string;
  month: number;
  termIcon: string;
  termName: string;
  title: string;
  description: string;
  conditionDesc: string;
  secretHint?: string;
}

export const SOLAR_ACHIEVEMENTS: GameAchievement[] = [
  {
    id: 'ach_major_cold',
    month: 1,
    termIcon: '❄️',
    termName: '大寒 (Major Cold)',
    title: '傲雪凌霜',
    description: '岁寒最极，朔风凛冽，大营粮尽将疲之时，仍百折不挠、坚守汉中。',
    conditionDesc: '于「大寒」一月，在义勇兵力不足 1,500 人时顽强生存。'
  },
  {
    id: 'ach_spring_beginning',
    month: 2,
    termIcon: '🌱',
    termName: '立春 (Beginning of Spring)',
    title: '春回大地',
    description: '春雷萌动，东风解冻，天下耕耘大发，主公抚民有方，引天下百姓影从。',
    conditionDesc: '于「立春」二月，地方民声（Popularity）积累至 85 点以上。'
  },
  {
    id: 'ach_insects_awakening',
    month: 3,
    termIcon: '⚡',
    termName: '惊蛰 (Awakening of Insects)',
    title: '惊雷大智',
    description: '阳气大起，春雷震物。主公在此醒悟大道、修智砺学。',
    conditionDesc: '于「惊蛰」三月，智力值（Intelligence）达到 90 点以上。'
  },
  {
    id: 'ach_pure_brightness',
    month: 4,
    termIcon: '🌾',
    termName: '清明 (Pure Brightness)',
    title: '清明开垦',
    description: '万木吐绿，农桑大兴。主公精理水土、修屯守险，开垦沃野千里。',
    conditionDesc: '于「清明」四月，大兴屯垦（单次黄金储备大于 450 点）。'
  },
  {
    id: 'ach_summer_beginning',
    month: 5,
    termIcon: '☀️',
    termName: '天光耀武',
    title: '执戈卫汉',
    description: '火令当权，暑热初升。主公亲自披甲上阵，神武莫测。',
    conditionDesc: '于「立夏」五月，武力值（Force）达到 90 点以上。'
  },
  {
    id: 'ach_summer_solstice',
    month: 6,
    termIcon: '🍉',
    termName: '夏至 (Summer Solstice)',
    title: '长驱白昼',
    description: '长庚之至，昼极星明。三军急行千里，风驰电掣。',
    conditionDesc: '于「夏至」六月，执策派遣哨兵，在大舆图上成功开垦/移防新城。'
  },
  {
    id: 'ach_major_heat',
    month: 7,
    termIcon: '🔥',
    termName: '大暑 (Major Heat)',
    title: '三军振旅',
    description: '金石流沙，大暑酷干。三军避暑缩营，仍有严整武防。',
    conditionDesc: '于「大暑」七月，麾下中营义勇兵卒规模突破 12,000 人大关。'
  },
  {
    id: 'ach_autumn_beginning',
    month: 8,
    termIcon: '🍁',
    termName: '金风大捷',
    title: '仓廪丰实',
    description: '秋高气爽，五谷熟成。主公深荷万民之望，国库大充。',
    conditionDesc: '于「立秋」八月，单季各地税饷黄金产出（Revenue）突破 250 点。'
  },
  {
    id: 'ach_autumn_equinox',
    month: 9,
    termIcon: '🌾',
    termName: '秋分 (Autumnal Equinox)',
    title: '得道多助',
    description: '秋分万里，天平在野。贤臣能将不远千里前来投效。',
    conditionDesc: '于「秋分」九月，麾下招募的将领人数大于等于 4 人。'
  },
  {
    id: 'ach_winter_beginning',
    month: 10,
    termIcon: '🍂',
    termName: '立冬 (Beginning of Winter)',
    title: '高义冠世',
    description: '露结为霜，草木折枯。乱世横流，唯德行不灭。',
    conditionDesc: '于「立冬」十月，主公德行（Virtue）累积突破 85 点。'
  },
  {
    id: 'ach_winter_solstice',
    month: 11,
    termIcon: '⛄',
    termName: '冬至 (Winter Solstice)',
    title: '乾坤改判',
    description: '孤阴至深，阳气萌生。玩家起兵倒戈，逆转宿命，改写正史。',
    conditionDesc: '于「冬至」十一月，玩家德行及武将忠诚信赖突破防守（历史扭转偏离度大于 50%）。'
  },
  {
    id: 'ach_minor_cold',
    month: 12,
    termIcon: '🌨️',
    termName: '大器晚成',
    title: '天下称贤',
    description: '小寒彻骨，傲雪苍竹。在最终岁末之时，主公修明内政，得享百官朝贡。',
    conditionDesc: '于「小寒」十二月，地方声望（Prestige）突破 85 点。'
  }
];
