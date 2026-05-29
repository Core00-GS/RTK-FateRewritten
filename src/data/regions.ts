/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Region, FactionId } from '../types';

export interface FactionInfo {
  id: FactionId;
  name: string;
  color: string;
  bgClass: string;
  borderClass: string;
  badgeClass: string;
  leader: string;
  description: string;
}

export const FACTIONS: Record<FactionId, FactionInfo> = {
  PLAYER: {
    id: 'PLAYER',
    name: '玩家势力',
    color: '#D4AF37', // 黄金
    bgClass: 'bg-amber-950/40 text-amber-200',
    borderClass: 'border-amber-500/50',
    badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
    leader: '玩家(大将军)',
    description: '玩家招兵买马、纳贤兴市所建立的新生大业，志在匡扶汉室、拯救万民或改朝换代。',
  },
  HAN: {
    id: 'HAN',
    name: '大汉王朝',
    color: '#DC2626', // 朱红
    bgClass: 'bg-red-950/40 text-red-200',
    borderClass: 'border-red-500/50',
    badgeClass: 'bg-red-500/20 text-red-300 border border-red-500/40',
    leader: '汉室天子',
    description: '垂死挣扎的古老帝国。朝纲不振，宦官外戚弄权，群雄分崩离析，正处于分崩边缘。',
  },
  CAOCAO: {
    id: 'CAOCAO',
    name: '曹魏雄兵',
    color: '#2563EB', // 魏蓝
    bgClass: 'bg-blue-950/45 text-blue-200',
    borderClass: 'border-blue-500/50',
    badgeClass: 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
    leader: '曹操',
    description: '“宁教我负天下人，休教天下人负我”。挟天子以令诸侯，占据中原半壁，任人唯才，军制严明。',
  },
  LIUBEI: {
    id: 'LIUBEI',
    name: '蜀汉仁政',
    color: '#16A34A', // 蜀绿
    bgClass: 'bg-emerald-950/40 text-emerald-200',
    borderClass: 'border-emerald-500/50',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    leader: '刘备',
    description: '“惟贤惟德，能服于人”。高举仁义大旗，恢复汉室之名，据巴蜀险要，广得民心与卧龙诸葛亮支持。',
  },
  SUNQUAN: {
    id: 'SUNQUAN',
    name: '东吴大业',
    color: '#9333EA', // 吴紫
    bgClass: 'bg-purple-950/40 text-purple-200',
    borderClass: 'border-purple-500/50',
    badgeClass: 'bg-purple-500/20 text-purple-300 border border-purple-500/40',
    leader: '孙权',
    description: '“据江东之险，足以为帝”。自孙坚、孙策奠定三世基业，水军天下无双，得长江天险与群臣拥护。',
  },
  YELLOW_TURBAN: {
    id: 'YELLOW_TURBAN',
    name: '黄巾义军',
    color: '#EAB308', // 黄色
    bgClass: 'bg-yellow-950/40 text-yellow-200',
    borderClass: 'border-yellow-500/50',
    badgeClass: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40',
    leader: '张角(天公将军)',
    description: '“苍天已死，黄天当立，岁在甲子，天下大吉”。太平道百万人起事，誓要推翻残暴的大汉朝廷。',
  },
  DONGZHUO: {
    id: 'DONGZHUO',
    name: '西凉董卓',
    color: '#4B5563', // 灰黑 (魔王)
    bgClass: 'bg-zinc-950/40 text-zinc-200',
    borderClass: 'border-zinc-500/50',
    badgeClass: 'bg-zinc-500/20 text-zinc-300 border border-zinc-500/40',
    leader: '董卓',
    description: '霸占京师、凶暴专横的凉州悍将。拥有飞将吕布效命，火烧洛阳、挟持天子，为全国群雄声讨之敌。',
  },
  XIONGNU: {
    id: 'XIONGNU',
    name: '北方匈奴',
    color: '#B45309', // 褐色
    bgClass: 'bg-orange-950/40 text-orange-200',
    borderClass: 'border-orange-500/50',
    badgeClass: 'bg-orange-500/20 text-orange-300 border border-orange-500/40',
    leader: '羌渠单于',
    description: '在大汉虚弱混乱之时肆虐北疆边民的蛮族游牧铁骑。凶悍不羁，抢夺粮食生口，极度威胁中原。',
  },
  JIN: {
    id: 'JIN',
    name: '大晋王朝',
    color: '#06B6D4', // 天蓝/青
    bgClass: 'bg-cyan-950/40 text-cyan-200',
    borderClass: 'border-cyan-500/50',
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
    leader: '司马炎',
    description: '高平陵之变后，魏国的大权落入司马氏手中。改朝换代为大晋，拥兵雄霸，试图蚕食天下一统江山。',
  },
};

export const INITIAL_REGIONS: Region[] = [
  {
    id: 'zhuojun',
    name: '涿郡(幽州)',
    faction: 'YELLOW_TURBAN',
    x: 75,
    y: 22,
    description: '幽州重镇，桃园结义的发生地。处于北方边地，黄巾军刘石、张牛角等在此啸聚肆虐。',
    development: 20,
    garrison: 8000,
    revenue: 150,
    connected: ['beihai', 'yecheng']
  },
  {
    id: 'beihai',
    name: '北海(青州)',
    faction: 'HAN',
    x: 82,
    y: 35,
    description: '孔融任太守之所，文化底蕴深厚。常受黄巾军残部管亥围攻，需要外部急救救援。',
    development: 30,
    garrison: 5000,
    revenue: 250,
    connected: ['zhuojun', 'yecheng', 'jianye']
  },
  {
    id: 'yecheng',
    name: '邺城(冀州)',
    faction: 'HAN',
    x: 65,
    y: 34,
    description: '冀州的核心重城，商业与屯田之宝地。富庶之乡，后来袁绍与曹操争夺北方的北方中枢。',
    development: 45,
    garrison: 12000,
    revenue: 400,
    connected: ['zhuojun', 'beihai', 'luoyang']
  },
  {
    id: 'luoyang',
    name: '洛阳(司州)',
    faction: 'HAN',
    x: 52,
    y: 43,
    description: '东汉帝国的雄伟首都。宫殿连绵，富丽堂皇。然而朝中倾轧，危机四伏，董卓劫掠的阴影笼罩其上。',
    development: 80,
    garrison: 20000,
    revenue: 600,
    connected: ['yecheng', 'changan', 'xiangyang']
  },
  {
    id: 'changan',
    name: '长安(雍州)',
    faction: 'DONGZHUO',
    x: 38,
    y: 45,
    description: '汉代旧都，西京雄关。依山带河，易守难攻，秦川之宝地。是魔王董卓与西凉铁骑的重要大本营。',
    development: 60,
    garrison: 18000,
    revenue: 450,
    connected: ['luoyang', 'chengdu', 'xiongnu']
  },
  {
    id: 'xiongnu',
    name: '雁门/匈奴境',
    faction: 'XIONGNU',
    x: 48,
    y: 15,
    description: '塞外荒漠、阴山之麓。匈奴部族各路单于铁骑肆虐呼啸之处，是大汉北境百余年来的战栗之源。',
    development: 10,
    garrison: 15000,
    revenue: 80,
    connected: ['changan', 'yecheng']
  },
  {
    id: 'chengdu',
    name: '成都(益州)',
    faction: 'HAN',
    x: 22,
    y: 72,
    description: '天府之国，沃野千里，四塞以为固。水利兴旺，不经战乱侵袭，自古便是偏安王道与建功立业之所。',
    development: 65,
    garrison: 10000,
    revenue: 500,
    connected: ['changan', 'xiangyang']
  },
  {
    id: 'xiangyang',
    name: '襄阳(荆州)',
    faction: 'HAN',
    x: 53,
    y: 60,
    description: '荆襄九郡大动脉，兵家必争之地。刘表拥兵据于此，文教繁茂，贤才云集（司马徽、徐庶、隆中诸葛）。',
    development: 50,
    garrison: 11000,
    revenue: 350,
    connected: ['luoyang', 'chengdu', 'jianye']
  },
  {
    id: 'jianye',
    name: '建业(扬州)',
    faction: 'HAN',
    x: 75,
    y: 64,
    description: '江东核心军事商业据点，背倚长江。山明水秀，水利灌溉极其便利，是江东猛虎三世争天下的重镇。',
    development: 40,
    garrison: 8000,
    revenue: 300,
    connected: ['beihai', 'xiangyang']
  }
];
