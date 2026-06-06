/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { General, PlayerStats } from '../types';
import { INITIAL_GENERAL_POOL } from '../data/generals';
import { Swords, Star, Award, ShieldAlert, Heart, Trophy, BookOpen, X } from 'lucide-react';
import GeneralAttributesChart from './GeneralAttributesChart';
import GeneralRadarChart from './GeneralRadarChart';

interface Bond {
  id: string;
  name: string;
  idsRequired: string[];
  description: string;
  statBoost: {
    force?: number;
    intelligence?: number;
    leadership?: number;
    politics?: number;
    virtue?: number;
  };
}

const GENERAL_BONDS: Bond[] = [
  {
    id: 'taoyuan',
    name: '👑 桃园结义 (Peach Garden Oath)',
    idsRequired: ['liubei', 'guanyu', 'zhangfei'],
    description: '刘、关、张同袍誓死，合心克敌。全军五维修行增益大进 (武力+10, 统帅+10, 仁德+15)！',
    statBoost: { force: 10, leadership: 10, virtue: 15 }
  },
  {
    id: 'wuhujiang',
    name: '🐯 蜀汉虎将 (Shu Tiger generals)',
    idsRequired: ['guanyu', 'zhangfei', 'zhaoyun'],
    description: '关、张、赵猛虎陷敌，神力难当。冲锋阵斩效力暴进 (武力+15, 统帅+10)！',
    statBoost: { force: 15, leadership: 10 }
  },
  {
    id: 'weishi_zhi',
    name: '🦅 魏佐雄途 (Wei Pillars of Council)',
    idsRequired: ['caocao', 'guojia'],
    description: '孟德、奉孝主辅知默，算无遗漏。计策成效极速提升 (智力+15, 政治+10)！',
    statBoost: { intelligence: 15, politics: 10 }
  },
  {
    id: 'wuhou_chuan',
    name: '💡 师徒承灯 (Master & Apprentice)',
    idsRequired: ['zhugeliang', 'jiangwei'],
    description: '诸葛亮对姜维衣钵倾囊相授。幼麒演兵，妙理通神 (智力+12, 统帅+10)！',
    statBoost: { intelligence: 12, leadership: 10 }
  }
];

interface GeneralRosterProps {
  recruitedIds: string[];
  playerStats: PlayerStats;
  onRecruitGeneral: (generalId: string) => void;
  onTrainGeneral: (generalId: string, goldCost: number, statGained: 'force' | 'intelligence' | 'leadership' | 'politics' | 'virtue', amount: number) => void;
}

// Detailed histories for major generals to display in the detailed biography overlay
const DETAILED_BIOGRAPHIES: Record<string, { title: string; chapters: string[] }> = {
  liubei: {
    title: '蜀汉先主昭烈帝 · 刘玄德',
    chapters: [
      '【桃园兴兵】刘备，字玄德，幽州涿郡涿县人。西汉中山靖王刘胜之后。先主少孤，与母贩屦织席为业。少时与同郡简雍等知交。及黄巾贼寇突起，幽州刺史刘焉檄召义军，先主与关羽、张飞于涿郡桃园歃血结义，誓同清剿黄巾、匡扶汉室政统！',
      '【流离中原】先主首战功封安喜县尉，后遭督邮无理，张飞鞭笞督邮，遂挂印投奔下邳。后漂泊四方，依附公孙瓒、陶谦、曹操、袁绍、刘表，虽屡战屡败、寄人篱下，其百折不挠之枭雄气概，及仁义忠恕之天下美德，依然吸引海内英杰誓死追随（如赵云、诸葛亮等）。',
      '【鼎足天下】赤壁战后，先主乘势收复江南诸郡，后夺取西川巴蜀，于公元221年在成都称帝，建国号为汉。其一生以复兴汉室为己任，矢志不渝，与曹操霸道并称双璧，为华夏历史上『仁政义气』之不朽丰碑。'
    ]
  },
  guanyu: {
    title: '忠义盖世五虎之首 · 关云长',
    chapters: [
      '【解良豪侠】关羽，字云长，司隶河东郡解良人。亡命奔涿郡，与先主及张飞相遇，情深同胞，寝则同室，恩若兄弟。手挽八十二斤青龙偃月刀，跨下赤兔马，威震宇内。',
      '【名扬天下】下邳兵败后，为保先主甘就曹营，解白马之围，于万军之中斩颜良、诛文丑，封汉寿亭侯。后闻先主下落，印绶悬梁，单骑千里送嫂，横跨五关斩六将，忠义之声，感动天下。',
      '【威震华夏】镇守荆州，兴兵北伐樊城，水淹七军，擒于禁、斩庞德，中原为之震动，曹操甚至意欲迁都以避其锐芒。后因东吴背盟、白衣渡江而兵败麦城。本史诗中，若大军极速救援，云长圣手得生，将助主公改天换地、扫平群雄。'
    ]
  },
  zhangfei: {
    title: '万人之敌猛勇虎臣 · 张翼德',
    chapters: [
      '【涿郡名豪】张飞，字翼德，幽州涿郡人。少曾读书，擅长书画，家资殷实。与关羽俱事先主，羽年长数岁，飞兄事之。手持丈八大蛇矛，性刚烈火暴。',
      '【断桥退敌】先主败退当阳，飞以数十骑在长坂坡据水断桥，横矛立马于桥头，厉声大喝：“我乃燕人张翼德，谁敢与我决一死战！”曹操诸将畏惧不敢近，先主遂安全脱身。',
      '【治军义烈】飞虽性格暴躁、鞭挞部下，但重义敬贤，曾义释巴郡严颜，江州归心。其战法势如排山倒海，乃扫平障碍之无上神锋。'
    ]
  },
  zhaoyun: {
    title: '一身是胆常胜将军 · 赵子龙',
    chapters: [
      '【常山儒将】赵云，字子龙，冀州常山郡真定人。姿颜雄伟，生性极其深明大义。初从公孙瓒，期间结识刘备，深为其仁德打动，誓言追随，终生不渝。',
      '【孤胆救主】当阳长坂坡乱军中，云怀抱幼主阿斗，于曹操百万乱军中七进七出，斩杀曹营名将五十余员，夺取青釭宝剑，毫发无伤救出阿斗，先主抛扇掷地，叹曰：“子龙一身都是胆也！”',
      '【国士无双】云一生深得朝野敬重，作风廉洁清正，力劝先主休田分地于民，不夺民利。为人堂堂正正，谋定后动，乃不折不扣的完美将军典范。'
    ]
  },
  zhugeliang: {
    title: '千古贤相万世军师 · 诸葛孔明',
    chapters: [
      '【卧龙隐逸】诸葛亮，字孔明，琅琊阳都人。少年丧父，避乱荆州，躬耕于隆中，好为《梁父吟》，自比管仲、乐毅。当时名流崔州平、徐庶皆与善交，谓之“卧龙”。',
      '【草庐定盟】大业流离，先主三顾臣于草庐之中。孔明未出茅庐，而已定下“三分天下、克复中原”之万世对策。联吴抗曹，借东风火烧赤壁，谈笑间樯橹灰飞烟灭。',
      '【鞠躬尽瘁】主政蜀国，赏罚严明，五出祁山，至死不渝。五丈原上星宿陨落，为华夏历史上大无畏、极智慧代表的象征。本历程中，主公以秘丹续灯，令武侯重焕生机，定当一统乾坤。'
    ]
  },
  taishici: {
    title: '神射天心信义义士 · 太史子义',
    chapters: [
      '【东莱天骄】太史慈，字子义，东莱黄县人。猿臂善射，弦不虚发。少时为州郡直言，避乱辽东。母受北海太守孔融之恩，慈奉母命，匹马单枪，冲入黄巾万围救助孔融。',
      '【信义突围】守城绝境，慈怀揣求救表章，孤身纵马冲阵箭无虚发，请得刘备三千精锐解围北海之困。后归江东，与孙策神亭岭酣战数百合不分胜负，孙策被其信义折服纳之。',
      '【英气长存】子义为人磊落赤诚，大信于天下。其神箭天威能在极远距离直接射透守关敌将，是沙场一招制胜的关键支柱。'
    ]
  },
  guojia: {
    title: '算无遗策神火鬼才 · 郭奉孝',
    chapters: [
      '【颍川隐秘】郭嘉，字奉孝，颍川阳翟人。少有远谋，不与俗交，隐居避世。初见袁绍知非明主，后经荀彧引荐面见曹操，两人讨论局势，曹操大乐：“使我办大业者，唯此人也！”',
      '【十胜十败】于官渡前夕撰写著名的《十胜十败论》，从道、义、治、度、谋等十个维度透彻剖析曹胜袁败的天轨，大定曹魏军心。算定孙策、算定乌桓，算无不中，鬼仙降世。',
      '【天妒英才】征乌桓病逝，年仅三十八。曹操于赤壁战败后大哭：“若奉孝在，孤何至有此大败！”本演义中，因与主公知交，奉孝投奔麾下，鬼谷谋略底定中原。'
    ]
  },
  jiangwei: {
    title: '西凉幼麒悲壮北伐 · 姜伯约',
    chapters: [
      '【天水麒麟】姜维，字伯约，天水冀县人。儒雅博学，通晓兵法。母在天水，维入仕曹魏任天水参军。诸葛亮一出祁山时，维以智克孔明，孔明惊为神人，设计收降，纳为最得意弟子。',
      '【传灯行纪】诸葛亮病逝后，维接下复兴大汉天命大纛。只身支撑蜀中危局，九伐中原。后蜀主出降，维仍不死心，试图煽动钟会复国，功败衰成壮烈就义。',
      '【终消悲歌】伯约一生忠义悍勇，竭尽了最后一滴心血。在本演义中由于主公雄图大振，伯约早早归于账下，定当洗去那抹悲歌长空，一扫关中！'
    ]
  },
  caocao: {
    title: '治世能臣乱世枭雄 · 曹孟德',
    chapters: [
      '【乱世奸雄】曹操，字孟德，沛国谯县人。太尉曹嵩之子。少时侠放，乔玄大异之，曰：“天下将乱，非命世之才不能济也。能安之者，其在君乎！”',
      '【霸道权柄】操文武全才，行宪治军极其果断。破黄巾、迎天子以令诸侯，官渡荡平袁绍，平定北方。挟霸主之姿独行王道与霸道，华夏史上无出其右的政治家与军事家。',
      '【一统天下】其兵法卓越，注有《孙子略解》。为人求贤若渴、招纳天下名宿。若主公能将其彻底降服于麾下，定能以其霸道无匹手段推行大同！'
    ]
  },
  luxun: {
    title: '儒雅奇才江东重臣 · 陆伯言',
    chapters: [
      '【陆氏栋梁】陆逊，字伯言，吴郡吴县人。少时沉稳寡言，谋略深藏。娶孙策之女，常为江东平定山越，出谋画策极其周密。',
      '【一战倾天】逊巧施骄兵之计，助吕蒙袭荆州夺关羽命；其后刘备称帝发倾国之兵复仇，逊临危受命担任大都督，于夷陵巧妙火烧连营七百里，令蜀军几乎全军覆没。',
      '【高雅治邦】为人出将入相，深具清正儒者之风。战场之上一挥纸扇、满江烈火，是无可比拟的数据克敌奇葩。'
    ]
  }
};

interface LegendAchievement {
  legendTitle: string;
  legendContent: string;
  achievements: {
    name: string;
    key: string;
    targetDesc: string;
    formula: (g: General, isRecruited: boolean) => { progress: number; achieved: boolean };
  }[];
}

const GENERAL_LEGENDS_ACHIEVEMENTS: Record<string, LegendAchievement> = {
  liubei: {
    legendTitle: '【双手过膝 & 髀肉复生】',
    legendContent: '据正史《三国志·先主传》载，刘备双手过膝，顾自见其耳。寄于荆州刘表账下数年，一日入厕因见髀里肉生，流涕悲叹。叹息日月如流，老将至而功未立，大志不灭之姿跃然流光。',
    achievements: [
      { name: '大汉帝裔', key: 'recruit', targetDesc: '先主刘玄德归降并名列麾下 (已招募)', formula: (g, isRec) => ({ progress: isRec ? 100 : 0, achieved: isRec }) },
      { name: '昭烈雄阶', key: 'level', targetDesc: '先主修行等级达到 LV.4 以上', formula: (g) => ({ progress: Math.min(100, Math.round((g.level / 4) * 100)), achieved: g.level >= 4 }) },
      { name: '德服天下', key: 'virtue', targetDesc: '先主德行孕育提升到 85 点以上', formula: (g) => ({ progress: Math.min(100, Math.round((g.virtue / 85) * 100)), achieved: g.virtue >= 85 }) }
    ]
  },
  guanyu: {
    legendTitle: '【刮骨疗毒 & 单刀五关】',
    legendContent: '云长曾于前线为毒矢所中，毒入右臂骨。神医切开皮肉刮骨沙沙有声，羽却饮酒弈棋，言笑自若！及后千里寻主，单刀赴江东鲁肃之会，大义凛然折服名士。',
    achievements: [
      { name: '云长归汉', key: 'recruit', targetDesc: '汉寿亭侯关云长听宣入幕 (已招募)', formula: (g, isRec) => ({ progress: isRec ? 100 : 0, achieved: isRec }) },
      { name: '武圣狂澜', key: 'force', targetDesc: '关羽武力修行点数达到 100 点巅峰', formula: (g) => ({ progress: Math.min(100, Math.round((g.force / 100) * 100)), achieved: g.force >= 100 }) },
      { name: '大信誓言', key: 'loyalty', targetDesc: '关羽对幕府忠诚度达到 100 满额', formula: (g) => ({ progress: Math.min(100, Math.round((g.loyalty / 100) * 100)), achieved: g.loyalty >= 100 }) }
    ]
  },
  zhangfei: {
    legendTitle: '【当阳断桥 & 义释严颜】',
    legendContent: '长坡当阳，张翼德横矛立马于水桥，怒目大喝“我乃燕人张翼德”，曹营万马畏而退。平定巴蜀大郡时，设计擒拿白发严颜，被其宁死不降的气节打动，亲自解缚纳为上宾，亦粗有儒雅文墨之能。',
    achievements: [
      { name: '长坂横槊', key: 'recruit', targetDesc: '猛张飞入账听调共参政纪 (已招募)', formula: (g, isRec) => ({ progress: isRec ? 100 : 0, achieved: isRec }) },
      { name: '铁面书墨', key: 'intel', targetDesc: '张翼德文华智力属性修行突破 84 点', formula: (g) => ({ progress: Math.min(100, Math.round((g.intelligence / 84) * 100)), achieved: g.intelligence >= 84 }) },
      { name: '燕歌突振', key: 'level', targetDesc: '张翼德行军等阶达到 LV.4 以上', formula: (g) => ({ progress: Math.min(100, Math.round((g.level / 4) * 100)), achieved: g.level >= 4 }) }
    ]
  },
  zhaoyun: {
    legendTitle: '【七进七出 & 子龙一身胆】',
    legendContent: '子龙于长坂乱线孤胆搜寻主母，突围夺得曹操宝剑，怀抱少主阿斗杀透重围，斩五十余将。先主摔子而泣，高呼：“子龙一身都是胆也！”一生行事大义，无愧真君子之风。',
    achievements: [
      { name: '常山神胆', key: 'recruit', targetDesc: '赵子龙战马白甲誓约效效忠 (已招募)', formula: (g, isRec) => ({ progress: isRec ? 100 : 0, achieved: isRec }) },
      { name: '长枪白虹', key: 'force', targetDesc: '赵子龙武力历练值增至 98 点以上', formula: (g) => ({ progress: Math.min(100, Math.round((g.force / 98) * 100)), achieved: g.force >= 98 }) },
      { name: '行军破千', key: 'level', targetDesc: '赵子龙督校修行等级达 LV.4 阶级', formula: (g) => ({ progress: Math.min(100, Math.round((g.level / 4) * 100)), achieved: g.level >= 4 }) }
    ]
  },
  zhugeliang: {
    legendTitle: '【借来东风 & 抚琴空城】',
    legendContent: '孔明神机夺天机，筑七星台借来东南烈风，火焚八十万曹军！及后街亭有折，其弹琴城楼闲适作歌，司马十五万大军莫敢近窥，心多狐疑遂败退。鞠躬以死大汉社稷。',
    achievements: [
      { name: '草庐卧龙', key: 'recruit', targetDesc: '诸葛孔明躬亲辅翼王道 (已招募)', formula: (g, isRec) => ({ progress: isRec ? 100 : 0, achieved: isRec }) },
      { name: '太极奇阵', key: 'intel', targetDesc: '孔明智谋点数达到极峰 100 点', formula: (g) => ({ progress: Math.min(100, Math.round((g.intelligence / 100) * 100)), achieved: g.intelligence >= 100 }) },
      { name: '五丈灯继', key: 'level', targetDesc: '卧龙军师等阶修行达到 LV.4 绝位', formula: (g) => ({ progress: Math.min(100, Math.round((g.level / 4) * 100)), achieved: g.level >= 4 }) }
    ]
  },
  taishici: {
    legendTitle: '【大信义神射 & 龙虎神亭】',
    legendContent: '太史子义于神亭岗决斗孙策。孙策夺得其手戟，其亦取去孙策兜鍪。北海之绝境，子义怀揣血信单马突射，弦不虚发。其神矢威行，能在极百步开外直接贯透关隘守卒之腕，真烈士也。',
    achievements: [
      { name: '东莱名义', key: 'recruit', targetDesc: '太史子义将军受拜入幕 (已招募)', formula: (g, isRec) => ({ progress: isRec ? 100 : 0, achieved: isRec }) },
      { name: '流星坠月', key: 'force', targetDesc: '太史慈武力修为磨合暴涨至 95 点', formula: (g) => ({ progress: Math.min(100, Math.round((g.force / 95) * 100)), achieved: g.force >= 95 }) },
      { name: '一言重千', key: 'loyalty', targetDesc: '太史慈忠心誓约提升达 100 满格', formula: (g) => ({ progress: Math.min(100, Math.round((g.loyalty / 100) * 100)), achieved: g.loyalty >= 100 }) }
    ]
  },
  guojia: {
    legendTitle: '【十胜十败 & 遗计斩袁】',
    legendContent: '奉孝在官渡战前一气写下十德胜败之说，厘清宿愿胜败之机，大定曹魏士气。临川兵亡前料定大漠公孙定斩降逃袁尚而献其首，遗计不血刃底定河北，算尽乾坤。',
    achievements: [
      { name: '颍川谋首', key: 'recruit', targetDesc: '鬼才郭奉孝谋策加盟听封 (已招募)', formula: (g, isRec) => ({ progress: isRec ? 100 : 0, achieved: isRec }) },
      { name: '妙理天干', key: 'intel', targetDesc: '郭嘉神测智力磨炼突破 99 大格', formula: (g) => ({ progress: Math.min(100, Math.round((g.intelligence / 99) * 100)), achieved: g.intelligence >= 99 }) },
      { name: '参谋不老', key: 'level', targetDesc: '郭奉孝在校场等阶修养达成 LV.4', formula: (g) => ({ progress: Math.min(100, Math.round((g.level / 4) * 100)), achieved: g.level >= 4 }) }
    ]
  },
  jiangwei: {
    legendTitle: '【孤臣中纛 & 剖胆大如鸡】',
    legendContent: '维嗣诸葛孔明未尽之业，单膝跪受帅纛，以一己孤军支撑西秦剑门天堑。蜀主称降大呼，伯约暗中设间，计反钟会，死前自刎，死后被刮剖，视之其“胆大如鸡子墨斗”，悲壮亘古未见。',
    achievements: [
      { name: '西凉麒麟', key: 'recruit', targetDesc: '姜伯约忠臣名列宿卫名册 (已招募)', formula: (g, isRec) => ({ progress: isRec ? 100 : 0, achieved: isRec }) },
      { name: '文武继统', key: 'combined', targetDesc: '姜伯约武力、智略两项同修达 90+', formula: (g) => ({ progress: Math.min(100, Math.round(((g.force + g.intelligence) / 180) * 100)), achieved: g.force >= 90 && g.intelligence >= 90 }) },
      { name: '剑关撑旗', key: 'level', targetDesc: '姜维修行等阶臻至 LV.4 以上', formula: (g) => ({ progress: Math.min(100, Math.round((g.level / 4) * 100)), achieved: g.level >= 4 }) }
    ]
  },
  caocao: {
    legendTitle: '【断发御兵 & 魏武横槊】',
    legendContent: '曹操经麦田令：踏麦踩秧者斩，其座骑惊。执剑自裁下，谋臣力阻，操断己长发落于麦土，令代首示军，军法为之一振！举酒赤壁执铁槊横长天，一代英雄豪气。',
    achievements: [
      { name: '唯才是举', key: 'recruit', targetDesc: '曹操曹孟德霸道元帅列入幕府 (已招募)', formula: (g, isRec) => ({ progress: isRec ? 100 : 0, achieved: isRec }) },
      { name: '霸业封神', key: 'politics', targetDesc: '曹操政治权谋修行极至 100 点级别', formula: (g) => ({ progress: Math.min(100, Math.round((g.politics / 100) * 100)), achieved: g.politics >= 100 }) },
      { name: '魏武扬鞭', key: 'level', targetDesc: '曹操修行主公御下等阶到 LV.5', formula: (g) => ({ progress: Math.min(100, Math.round((g.level / 5) * 100)), achieved: g.level >= 5 }) }
    ]
  },
  luxun: {
    legendTitle: '【狂飙烈火夷陵 & 社稷柱国】',
    legendContent: '逊儒雅如生书生，任东吴都督，上书极尽虚美示弱麻痹刘备，引蜀军林中扎营下。巧趁热暑之夏，手执火符风卷连营，两岸火海，社稷于危巢一朝全而固。',
    achievements: [
      { name: '社稷重臣', key: 'recruit', targetDesc: '儒将陆伯言入听调令列麾下 (已招募)', formula: (g, isRec) => ({ progress: isRec ? 100 : 0, achieved: isRec }) },
      { name: '烈火八营', key: 'intel', targetDesc: '陆逊智策属性值研习达成 98 点', formula: (g) => ({ progress: Math.min(100, Math.round((g.intelligence / 98) * 100)), achieved: g.intelligence >= 98 }) },
      { name: '出将入相', key: 'level', targetDesc: '陆都督修行等阶高晋至 LV.4 等级', formula: (g) => ({ progress: Math.min(100, Math.round((g.level / 4) * 100)), achieved: g.level >= 4 }) }
    ]
  }
};

export default function GeneralRoster({
  recruitedIds,
  playerStats,
  onRecruitGeneral,
  onTrainGeneral
}: GeneralRosterProps) {
  const [activeTab, setActiveTab] = useState<'MY_GENERALS' | 'RECRUIT_POOL'>('MY_GENERALS');
  const [selectedGeneral, setSelectedGeneral] = useState<General | null>(null);
  const [trainingLog, setTrainingLog] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'WARRIOR' | 'STRATEGIST' | 'GOVERNOR'>('ALL');

  // Sorting & Compare & Biography state variables
  const [sortBy, setSortBy] = useState<'default' | 'force' | 'intelligence' | 'leadership' | 'politics' | 'virtue' | 'loyalty'>('default');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [showComparePopup, setShowComparePopup] = useState<boolean>(false);
  const [showBioOverlay, setShowBioOverlay] = useState<boolean>(false);
  
  // Local storage backed training history list (stores last 5 military trials)
  const [trainingHistory, setTrainingHistory] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem('tk_training_history');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  // Local storage backed cumulative attribute training history for each general
  const [progressionHistory, setProgressionHistory] = useState<Record<string, any[]>>(() => {
    try {
      const cached = localStorage.getItem('tk_general_progression_history');
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });

  // Local storage backed training focus
  const [generalFocus, setGeneralFocus] = useState<Record<string, string>>(() => {
    try {
      const cached = localStorage.getItem('tk_general_training_focus_v1');
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });

  const getGeneralHistory = (gId: string, currentGen: General) => {
    let hist = progressionHistory[gId];
    if (!hist || hist.length === 0) {
      // Seed with 2 points so D3 lines will draw nicely out of the box!
      const step0Level = Math.max(1, currentGen.level - 1);
      const step0 = {
        step: 0,
        level: step0Level,
        force: Math.max(10, currentGen.force - (currentGen.level > 1 ? 2 : 3)),
        intelligence: Math.max(10, currentGen.intelligence - (currentGen.level > 1 ? 1 : 2)),
        leadership: Math.max(10, currentGen.leadership - (currentGen.level > 1 ? 2 : 2)),
        politics: Math.max(10, currentGen.politics - (currentGen.level > 1 ? 1 : 3)),
        virtue: Math.max(10, currentGen.virtue - (currentGen.level > 1 ? 0 : 1)),
        date: '沙场点将'
      };
      const step1 = {
        step: 1,
        level: currentGen.level,
        force: currentGen.force,
        intelligence: currentGen.intelligence,
        leadership: currentGen.leadership,
        politics: currentGen.politics,
        virtue: currentGen.virtue,
        date: '本朝点录'
      };
      hist = [step0, step1];
    }
    return hist;
  };

  const recruitedSet = new Set(recruitedIds);

  // Filter and search generals based on recruitment status
  const filterAndSearch = (list: General[]) => {
    let result = list;
    if (categoryFilter !== 'ALL') {
      result = result.filter(g => {
        const maxVal = Math.max(g.force, g.intelligence, g.leadership, g.politics, g.virtue);
        if (categoryFilter === 'WARRIOR') {
          // Warrior: highest is force OR force >= 85
          return maxVal === g.force || g.force >= 85;
        }
        if (categoryFilter === 'STRATEGIST') {
          // Strategist: highest is intelligence OR intelligence >= 85
          return maxVal === g.intelligence || g.intelligence >= 85;
        }
        if (categoryFilter === 'GOVERNOR') {
          // Governor: highest is politics, leadership or virtue OR politics >= 80 OR virtue >= 80
          return maxVal === g.politics || maxVal === g.virtue || g.politics >= 80 || g.virtue >= 80;
        }
        return true;
      });
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(g => 
        g.name.toLowerCase().includes(query) || 
        g.biography.toLowerCase().includes(query) || 
        g.skill.toLowerCase().includes(query)
      );
    }
    return result;
  };

  const originalMyGenerals = filterAndSearch(Object.values(INITIAL_GENERAL_POOL).filter((g) => recruitedSet.has(g.id)));
  const originalRecruitPool = filterAndSearch(Object.values(INITIAL_GENERAL_POOL).filter((g) => !recruitedSet.has(g.id)));

  // Sort generals helper
  const sortGenerals = (list: General[]) => {
    if (sortBy === 'default') return list;
    return [...list].sort((a, b) => {
      if (sortBy === 'force') return b.force - a.force;
      if (sortBy === 'intelligence') return b.intelligence - a.intelligence;
      if (sortBy === 'leadership') return b.leadership - a.leadership;
      if (sortBy === 'politics') return b.politics - a.politics;
      if (sortBy === 'virtue') return b.virtue - a.virtue;
      if (sortBy === 'loyalty') return b.loyalty - a.loyalty;
      return 0;
    });
  };

  const myGenerals = sortGenerals(originalMyGenerals);
  const recruitPool = sortGenerals(originalRecruitPool);

  const handleSelectGeneral = (g: General) => {
    if (compareMode) {
      setSelectedCompareIds((prev) => {
        if (prev.includes(g.id)) {
          return prev.filter(id => id !== g.id);
        } else {
          if (prev.length >= 2) {
            alert('最多只能勾选两个武将进行比对！');
            return prev;
          }
          return [...prev, g.id];
        }
      });
    } else {
      setSelectedGeneral(g);
      setTrainingLog(null);
    }
  };

  const handleRecruit = (g: General) => {
    if (playerStats.gold < g.recruitCost) {
      alert(`招兵买马还缺粮草！招揽此人需要 黄金 ${g.recruitCost}，当前只有 ${playerStats.gold}。`);
      return;
    }
    if (playerStats.prestige < g.recruitCost / 3) {
      alert(`威望不足！天下英豪不肯屈就，需要声望 ${(g.recruitCost / 3).toFixed(0)}。可通过剧情或施粥救灾积攒。`);
      return;
    }
    onRecruitGeneral(g.id);
    setSelectedGeneral(g);
    alert(`【贤才来投】你备下重礼，亲自登门，大动三军之义。${g.name} 被你的赤诚打动，发誓效忠麾下！`);
  };

  const handleTrain = (g: General) => {
    const goldCost = 150;
    if (playerStats.gold < goldCost) {
      alert(`内帑黄金余额不足 150，无法组织军校训练！`);
      return;
    }

    const stats: Array<'force' | 'intelligence' | 'leadership' | 'politics' | 'virtue'> = [
      'force',
      'intelligence',
      'leadership',
      'politics',
      'virtue'
    ];
    // Heavily weight towards upgrading their signature properties
    if (g.force > 85) stats.push('force', 'force');
    if (g.intelligence > 85) stats.push('intelligence', 'intelligence');
    if (g.leadership > 85) stats.push('leadership', 'leadership');

    // Inject heavy weights for custom-focused subject to significantly boost priority
    const focus = generalFocus[g.id] || 'none';
    if (focus !== 'none') {
      const fAttr = focus as 'force' | 'intelligence' | 'leadership' | 'politics' | 'virtue';
      for (let i = 0; i < 12; i++) {
        stats.push(fAttr);
      }
    }

    const statToGain = stats[Math.floor(Math.random() * stats.length)];
    const gainValue = Math.floor(Math.random() * 2) + 1; // 1 or 2 points

    const statNames: Record<string, string> = {
      force: '武力',
      intelligence: '智力',
      leadership: '统帅',
      politics: '政治',
      virtue: '德行'
    };

    // Calculate updated values (since internal values represent AFTER state in next render)
    const nextForce = Math.min(100, g.force + (statToGain === 'force' ? gainValue : 0));
    const nextIntelligence = Math.min(100, g.intelligence + (statToGain === 'intelligence' ? gainValue : 0));
    const nextLeadership = Math.min(100, g.leadership + (statToGain === 'leadership' ? gainValue : 0));
    const nextPolitics = Math.min(100, g.politics + (statToGain === 'politics' ? gainValue : 0));
    const nextVirtue = Math.min(100, g.virtue + (statToGain === 'virtue' ? gainValue : 0));
    const nextLevel = g.level + 1;

    // Save general progression history
    const currentHist = getGeneralHistory(g.id, g);
    const newPoint = {
      step: currentHist.length,
      level: nextLevel,
      force: nextForce,
      intelligence: nextIntelligence,
      leadership: nextLeadership,
      politics: nextPolitics,
      virtue: nextVirtue,
      date: `督训【${statNames[statToGain]}】`
    };
    const updatedProgList = [...currentHist, newPoint];
    const newHistMap = {
      ...progressionHistory,
      [g.id]: updatedProgList
    };
    setProgressionHistory(newHistMap);
    localStorage.setItem('tk_general_progression_history', JSON.stringify(newHistMap));

    onTrainGeneral(g.id, goldCost, statToGain, gainValue);

    const newLog = `🎯 统率督导！你拨付 150 黄金大振三军，亲自陪同 ${g.name} 在校场切磋兵书武艺。${g.name} 茅塞顿开，经验值增加，并使其【${statNames[statToGain]}】属性永久提升了 +${gainValue} 点！`;
    setTrainingLog(newLog);

    // Save history record of the training (max 5)
    const newRecord = {
      id: `train_rec_${Date.now()}`,
      name: g.name,
      avatar: g.avatar,
      statName: statNames[statToGain],
      gainValue,
      goldCost
    };
    const updatedHistory = [newRecord, ...trainingHistory].slice(0, 5);
    setTrainingHistory(updatedHistory);
    localStorage.setItem('tk_training_history', JSON.stringify(updatedHistory));
  };

  const displayGeneral = selectedGeneral || myGenerals[0] || recruitPool[0];

  // Calculated bonds
  const activeBondsList = GENERAL_BONDS.filter(bond =>
    bond.idsRequired.every(id => recruitedIds.includes(id))
  );

  const generalBondsList = displayGeneral ? activeBondsList.filter(bond =>
    bond.idsRequired.includes(displayGeneral.id)
  ) : [];

  let forceBonus = 0;
  let intelBonus = 0;
  let leadBonus = 0;
  let polBonus = 0;
  let virtBonus = 0;

  if (displayGeneral) {
    generalBondsList.forEach(bond => {
      forceBonus += bond.statBoost.force || 0;
      intelBonus += bond.statBoost.intelligence || 0;
      leadBonus += bond.statBoost.leadership || 0;
      polBonus += bond.statBoost.politics || 0;
      virtBonus += bond.statBoost.virtue || 0;
    });
  }

  // SVG Radar Chart math solvers
  const getCoordinates = (value: number, axisIndex: number, cx: number, cy: number, maxR: number) => {
    const angle = -Math.PI / 2 + (axisIndex * 2 * Math.PI) / 5;
    const r = (value / 100) * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    };
  };

  const drawRing = (value: number, cx: number, cy: number, maxR: number) => {
    const points = [];
    for (let i = 0; i < 5; i++) {
      const coord = getCoordinates(value, i, cx, cy, maxR);
      points.push(`${coord.x},${coord.y}`);
    }
    return points.join(' ');
  };

  const drawSpoke = (axisIndex: number, cx: number, cy: number, maxR: number) => {
    const outerCoord = getCoordinates(100, axisIndex, cx, cy, maxR);
    return `M ${cx} ${cy} L ${outerCoord.x} ${outerCoord.y}`;
  };

  const getLabelPosition = (axisIndex: number, cx: number, cy: number, maxR: number) => {
    const angle = -Math.PI / 2 + (axisIndex * 2 * Math.PI) / 5;
    const r = maxR + 22; // Offset outwards
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    };
  };

  return (
    <div id="tk-roster-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
      {/* Generals selectors tabs */}
      <div id="roster-left-side" className="lg:col-span-2 bg-artistic-bg border-4 border-artistic-charcoal rounded-none p-5 shadow-md flex flex-col justify-between">
        <div>
          {/* Main selection Tab bar */}
          <div className="flex border-b border-artistic-charcoal/40 pb-2 mb-4">
            <button
              onClick={() => {
                setActiveTab('MY_GENERALS');
                setSelectedCompareIds([]);
              }}
              className={`flex-1 py-2 font-serif font-black text-center border-b-2 transition-all cursor-pointer text-xs md:text-sm ${
                activeTab === 'MY_GENERALS'
                  ? 'border-artistic-crimson text-artistic-crimson'
                  : 'border-transparent text-artistic-charcoal opacity-75 hover:opacity-100'
              }`}
            >
              幕府麾下将领 ({myGenerals.length}员)
            </button>
            <button
              onClick={() => {
                setActiveTab('RECRUIT_POOL');
                setSelectedCompareIds([]);
              }}
              className={`flex-1 py-2 font-serif font-black text-center border-b-2 transition-all cursor-pointer text-xs md:text-sm ${
                activeTab === 'RECRUIT_POOL'
                  ? 'border-artistic-crimson text-artistic-crimson'
                  : 'border-transparent text-artistic-charcoal opacity-75 hover:opacity-100'
              }`}
            >
              在野贤士馆 ({recruitPool.length}员)
            </button>
          </div>

          {/* Quick-Access Category Filters */}
          <div className="flex flex-wrap gap-2 mb-3 bg-artistic-cream p-2.5 border border-artistic-charcoal/20">
            <span className="text-xs font-serif font-black text-artistic-charcoal/80 self-center mr-1">才俊分类 (Filters):</span>
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1 text-[10.5px] font-serif font-bold transition-all cursor-pointer border ${
                categoryFilter === 'ALL'
                  ? 'bg-artistic-charcoal text-[#ede0c5] border-artistic-charcoal font-black'
                  : 'bg-[#fcfaf2] text-artistic-charcoal border-stone-300 hover:border-artistic-charcoal'
              }`}
            >
              全部 (ALL)
            </button>
            <button
              onClick={() => setCategoryFilter('WARRIOR')}
              className={`px-3 py-1 text-[10.5px] font-serif font-bold transition-all cursor-pointer border ${
                categoryFilter === 'WARRIOR'
                  ? 'bg-[#5c0f11] text-[#ede0c5] border-[#5c0f11] font-black'
                  : 'bg-[#fcfaf2] text-[#5c0f11] border-[#ffe4e1] hover:border-[#5c0f11]'
              }`}
            >
              ⚔️ 勇武神将 (Warrior)
            </button>
            <button
              onClick={() => setCategoryFilter('STRATEGIST')}
              className={`px-3 py-1 text-[10.5px] font-serif font-bold transition-all cursor-pointer border ${
                categoryFilter === 'STRATEGIST'
                  ? 'bg-blue-800 text-white border-blue-800 font-black'
                  : 'bg-[#fcfaf2] text-blue-800 border-blue-100 hover:border-blue-800'
              }`}
            >
              💡 智谋军师 (Strategist)
            </button>
            <button
              onClick={() => setCategoryFilter('GOVERNOR')}
              className={`px-3 py-1 text-[10.5px] font-serif font-bold transition-all cursor-pointer border ${
                categoryFilter === 'GOVERNOR'
                  ? 'bg-emerald-800 text-white border-emerald-800 font-black'
                  : 'bg-[#fcfaf2] text-emerald-800 border-emerald-100 hover:border-emerald-800'
              }`}
            >
              🏗️ 治国能臣 (Governor)
            </button>
          </div>

          {/* Sorting and Compare Selection Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pb-3 mb-3 border-b border-artistic-charcoal/20">
            {/* Sorting and Search Controls */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif font-black text-artistic-charcoal/80 shrink-0">武职排布:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-artistic-cream border-2 border-artistic-charcoal text-[11px] p-1 font-serif outline-none cursor-pointer focus:border-artistic-crimson"
                >
                  <option value="default">默认排布 (自然生平)</option>
                  <option value="force">按【武力值】降序</option>
                  <option value="intelligence">按【智力值】降序</option>
                  <option value="leadership">按【统帅值】降序</option>
                  <option value="politics">按【政治值】降序</option>
                  <option value="virtue">按【德行值】降序</option>
                  <option value="loyalty">按【忠诚度】降序</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-serif font-black text-artistic-charcoal/80 shrink-0">检索将佐:</span>
                <input
                  type="text"
                  placeholder="检索姓名、技能或事迹..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-artistic-cream border-2 border-artistic-charcoal text-[11px] px-2 py-0.5 w-40 font-serif outline-none focus:border-artistic-crimson"
                />
              </div>
            </div>

            {/* Compare Mode Toggle */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  setCompareMode(!compareMode);
                  setSelectedCompareIds([]);
                }}
                className={`px-3 py-1 text-xs font-serif font-black transition-all border-2 cursor-pointer ${
                  compareMode
                    ? 'bg-artistic-crimson text-artistic-bg border-artistic-crimson hover:bg-red-800'
                    : 'bg-artistic-cream text-artistic-charcoal border-artistic-charcoal hover:bg-artistic-charcoal hover:text-artistic-bg'
                }`}
              >
                {compareMode ? '退出对比' : '⚖️ 开启勾选属性对比'}
              </button>
            </div>
          </div>

          {/* Floating compare banner */}
          {compareMode && selectedCompareIds.length === 2 && (
            <div className="mb-4 bg-sky-50 border-2 border-sky-600 p-2.5 flex justify-between items-center rounded-none shadow-sm animate-pulse">
              <div className="text-xs font-serif font-bold text-sky-900">
                ⚖️ 已勾选两员大将：
                <span className="text-artistic-crimson ml-1 font-black">
                  {INITIAL_GENERAL_POOL[selectedCompareIds[0]]?.name.split(' ')[0]}
                </span> 
                与 
                <span className="text-blue-800 ml-1 font-black">
                  {INITIAL_GENERAL_POOL[selectedCompareIds[1]]?.name.split(' ')[0]}
                </span>
              </div>
              <button
                onClick={() => setShowComparePopup(true)}
                className="bg-sky-700 hover:bg-sky-800 text-white text-[11px] font-serif font-black px-3 py-1.5 border border-sky-800 cursor-pointer shadow transition-all"
              >
                📊 立即绘制雷达图比对
              </button>
            </div>
          )}

          {/* Cards Display Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-ink">
            {activeTab === 'MY_GENERALS' ? (
              myGenerals.length > 0 ? (
                myGenerals.map((g) => {
                  const isCompareSelected = selectedCompareIds.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      onClick={() => handleSelectGeneral(g)}
                      className={`p-3 rounded-none border-2 text-left transition-all cursor-pointer relative overflow-hidden ${
                        compareMode
                          ? isCompareSelected
                            ? 'bg-sky-100 border-sky-600 shadow-md ring-2 ring-sky-500/20'
                            : 'bg-artistic-cream border-artistic-charcoal/30 hover:border-artistic-charcoal opacity-90'
                          : displayGeneral?.id === g.id
                            ? 'bg-[#ffe4e1] border-artistic-crimson'
                            : 'bg-artistic-cream border-artistic-charcoal/30 hover:border-artistic-charcoal'
                      }`}
                    >
                      {/* Checkbox badge overlay in compare mode */}
                      {compareMode && (
                        <div className="absolute top-2 right-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[10px] ${
                            isCompareSelected 
                              ? 'bg-sky-600 border-sky-600 text-white font-bold' 
                              : 'border-artistic-charcoal/40 bg-white'
                          }`}>
                            {isCompareSelected ? '✓' : ''}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-8 h-8 rounded-none bg-artistic-crimson/15 text-artistic-crimson border-2 border-artistic-crimson flex items-center justify-center font-bold font-serif text-sm shadow-sm shrink-0">
                          {g.avatar}
                        </div>
                        <div className="truncate">
                          <div className="font-serif font-black text-artistic-charcoal text-xs truncate">{g.name}</div>
                          <div className="text-[9px] text-artistic-charcoal/70 font-serif">等阶: 偏将 LV.{g.level}</div>
                        </div>
                      </div>
                      {/* Compact core stats display */}
                      <div className="grid grid-cols-2 gap-1 text-[9.5px] text-artistic-ink border-t border-artistic-charcoal/20 pt-1 font-serif">
                        <div>武力: <span className="font-bold text-artistic-crimson">{g.force}</span></div>
                        <div>智力: <span className="font-bold text-blue-800">{g.intelligence}</span></div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="col-span-full py-12 text-center text-xs text-artistic-charcoal/60 font-serif italic">
                  幕府空虚，尚无追随的武臣。快去“在野贤士馆”纳贤吧！
                </div>
              )
            ) : recruitPool.length > 0 ? (
              recruitPool.map((g) => {
                const isCompareSelected = selectedCompareIds.includes(g.id);
                return (
                  <button
                    key={g.id}
                    onClick={() => handleSelectGeneral(g)}
                    className={`p-3 rounded-none border-2 text-left transition-all cursor-pointer relative overflow-hidden ${
                      compareMode
                        ? isCompareSelected
                          ? 'bg-sky-100 border-sky-600 shadow-md ring-2 ring-sky-500/20'
                          : 'bg-artistic-cream border-artistic-charcoal/30 hover:border-artistic-charcoal opacity-90'
                        : displayGeneral?.id === g.id
                          ? 'bg-[#ffe4e1] border-artistic-crimson'
                          : 'bg-artistic-cream border-artistic-charcoal/30 hover:border-artistic-charcoal'
                    }`}
                  >
                    {/* Checkbox badge overlay in compare mode */}
                    {compareMode && (
                      <div className="absolute top-2 right-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[10px] ${
                          isCompareSelected 
                            ? 'bg-sky-600 border-sky-600 text-white font-bold' 
                            : 'border-artistic-charcoal/40 bg-white'
                        }`}>
                          {isCompareSelected ? '✓' : ''}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-8 h-8 rounded-none bg-artistic-charcoal/10 text-artistic-charcoal border border-artistic-charcoal/40 flex items-center justify-center font-bold font-serif text-sm shrink-0">
                        {g.avatar}
                      </div>
                      <div className="truncate">
                        <div className="font-serif font-black text-artistic-charcoal text-xs truncate">{g.name.split(' ')[0]}</div>
                        <div className="text-[9.5px] text-artistic-crimson font-serif font-bold">🌾 黄金 {g.recruitCost}</div>
                      </div>
                    </div>
                    <div className="text-[9.5px] text-artistic-charcoal opacity-80 truncate mt-1 border-t border-artistic-charcoal/20 pt-1 font-serif">
                      战法: {g.skill}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center text-xs text-artistic-charcoal/60 font-serif italic">
                天下名臣尽入大营！四海之内再无在野明宿。
              </div>
            )}
          </div>
        </div>

        {/* Informational help note */}
        <div className="mt-4 text-[10.5px] text-artistic-charcoal/70 text-right bg-artistic-cream p-1.5 rounded-none border border-artistic-charcoal/30 font-serif">
          谋臣大将，各藏奇谋。在主线纠葛、点兵论武、奇遇演义中，麾下英豪能极大解开困难结局，通天达地。
        </div>
      </div>

      {/* Selected General profile inspect board */}
      <div id="roster-right-side" className="flex flex-col gap-4">
        {displayGeneral ? (
          <div className="bg-artistic-bg border-4 border-artistic-charcoal rounded-none p-5 shadow-md flex-1 flex flex-col justify-between">
              <div>
                {/* Card visual showcase */}
                <div className="border-b border-artistic-charcoal pb-3 mb-4 text-center">
                  <div className="w-16 h-16 rounded-none bg-artistic-crimson/5 text-artistic-crimson border-4 border-artistic-crimson flex items-center justify-center font-bold font-serif text-2xl mx-auto mb-2 shadow-sm font-calligraphy">
                    {displayGeneral.avatar}
                  </div>
                  <h3 className="font-serif font-black text-xl text-artistic-charcoal">
                    {displayGeneral.name}
                  </h3>
                  <div className="text-[10.5px] text-artistic-charcoal/90 font-serif flex justify-center gap-2 mt-1">
                    <span>阶级: 偏将虎臣</span>
                    <span>|</span>
                    <span>成长等级: LV.{displayGeneral.level}</span>
                  </div>
                </div>

                {/* Radar Chart & Bonds side by side layout */}
                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch">
                  {/* Radar Chart (D3 SVG Pentagonal Grid) */}
                  <GeneralRadarChart general={displayGeneral} activeBonds={activeBondsList} />

                  {/* Bonds Detail Column */}
                  <div className="bg-[#faf5ec] border border-artistic-charcoal/30 p-2.5 flex flex-col justify-between rounded-none font-serif text-left">
                    <div>
                      <h5 className="text-[10.5px] font-black text-artistic-crimson border-b border-artistic-charcoal/20 pb-1 mb-1.5 flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5" />
                        宿世麾下羁绊 (Bonds)
                      </h5>
                      
                      {generalBondsList.length > 0 ? (
                        <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                          {generalBondsList.map(bond => (
                            <div key={bond.id} className="p-1.5 bg-[#f5ebd0]/80 border border-amber-800/20 rounded-none text-[9.5px] leading-relaxed">
                              <div className="font-bold text-amber-950 flex justify-between items-center mb-0.5">
                                <span>{bond.name.split(' (')[0]}</span>
                                <span className="bg-red-700 text-white text-[8px] px-1 scale-90">生效中</span>
                              </div>
                              <p className="text-stone-700 text-[9px] leading-snug">{bond.description}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-4 text-center">
                          <span className="text-[18px] opacity-40">🤝</span>
                          <p className="text-[9.5px] text-stone-500 max-w-[150px] leading-relaxed mt-1 italic">
                            孤军征战。同时招募渊源英杰（如刘关张、曹操郭嘉、诸葛姜维）可唤醒专属宿命羁绊！
                          </p>
                        </div>
                      )}
                    </div>

                    {generalBondsList.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-dashed border-artistic-charcoal/20 text-[9px] font-bold text-red-850 bg-red-50/50 p-1">
                        <div>🔥 羁绊额外属性成长加成中:</div>
                        <div className="grid grid-cols-2 gap-x-1 mt-0.5 text-[8px] font-mono">
                          {forceBonus > 0 && <div className="text-red-750">・武力 +{forceBonus}</div>}
                          {intelBonus > 0 && <div className="text-blue-750">・智力 +{intelBonus}</div>}
                          {leadBonus > 0 && <div className="text-emerald-750">・统帅 +{leadBonus}</div>}
                          {polBonus > 0 && <div className="text-amber-750">・政治 +{polBonus}</div>}
                          {virtBonus > 0 && <div className="text-purple-750">・德行 +{virtBonus}</div>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Core attributes grids with indicators */}
                <div className="mb-4">
                  <h4 className="text-xs font-serif font-black text-artistic-crimson mb-2">【幕府武职底案】</h4>
                  <div className="space-y-2 text-xs">
                    {/* Force */}
                    <div>
                      <div className="flex justify-between text-[10px] text-artistic-charcoal/90 font-serif mb-0.5">
                        <span>武力 (阵斩斗将)</span>
                        <span className="font-bold flex items-center gap-1">
                          {displayGeneral.force} 
                          {forceBonus > 0 && <span className="text-red-700 text-[9px] font-black">(+{forceBonus} 羁绊)</span>}
                        </span>
                      </div>
                      <div className="w-full bg-artistic-cream h-2 rounded-none border border-artistic-charcoal/35 overflow-hidden">
                        <div className="bg-artistic-crimson h-full transition-all duration-300" style={{ width: `${Math.min(100, displayGeneral.force + forceBonus)}%` }}></div>
                      </div>
                    </div>

                    {/* Intelligence */}
                    <div>
                      <div className="flex justify-between text-[10px] text-artistic-charcoal/90 font-serif mb-0.5">
                        <span>智力 (奇谋施策)</span>
                        <span className="font-bold flex items-center gap-1">
                          {displayGeneral.intelligence}
                          {intelBonus > 0 && <span className="text-blue-800 text-[9px] font-black">(+{intelBonus} 羁绊)</span>}
                        </span>
                      </div>
                      <div className="w-full bg-[#f0f4f8] h-2 rounded-none border border-artistic-charcoal/35 overflow-hidden">
                        <div className="bg-blue-800 h-full transition-all duration-300" style={{ width: `${Math.min(100, displayGeneral.intelligence + intelBonus)}%` }}></div>
                      </div>
                    </div>

                    {/* Leadership */}
                    <div>
                      <div className="flex justify-between text-[10px] text-artistic-charcoal/90 font-serif mb-0.5">
                        <span>统帅 (排兵布阵)</span>
                        <span className="font-bold flex items-center gap-1">
                          {displayGeneral.leadership}
                          {leadBonus > 0 && <span className="text-emerald-800 text-[9px] font-black">(+{leadBonus} 羁绊)</span>}
                        </span>
                      </div>
                      <div className="w-full bg-[#ecf7ed] h-2 rounded-none border border-artistic-charcoal/35 overflow-hidden">
                        <div className="bg-emerald-800 h-full transition-all duration-300" style={{ width: `${Math.min(100, displayGeneral.leadership + leadBonus)}%` }}></div>
                      </div>
                    </div>

                    {/* Politics */}
                    <div>
                      <div className="flex justify-between text-[10px] text-artistic-charcoal/90 font-serif mb-0.5">
                        <span>政治 (修缮吏治)</span>
                        <span className="font-bold flex items-center gap-1">
                          {displayGeneral.politics}
                          {polBonus > 0 && <span className="text-amber-800 text-[9px] font-black">(+{polBonus} 羁绊)</span>}
                        </span>
                      </div>
                      <div className="w-full bg-[#fffcf3] h-2 rounded-none border border-artistic-charcoal/35 overflow-hidden">
                        <div className="bg-amber-700 h-full transition-all duration-300" style={{ width: `${Math.min(100, displayGeneral.politics + polBonus)}%` }}></div>
                      </div>
                    </div>

                    {/* Virtue */}
                    <div>
                      <div className="flex justify-between text-[10px] text-artistic-charcoal/90 font-serif mb-0.5">
                        <span>德行 (亲贤礼下)</span>
                        <span className="font-bold flex items-center gap-1">
                          {displayGeneral.virtue}
                          {virtBonus > 0 && <span className="text-purple-750 text-[9px] font-black">(+{virtBonus} 羁绊)</span>}
                        </span>
                      </div>
                      <div className="w-full bg-[#faf5ff] h-2 rounded-none border border-artistic-charcoal/35 overflow-hidden">
                        <div className="bg-purple-700 h-full transition-all duration-300" style={{ width: `${Math.min(100, displayGeneral.virtue + virtBonus)}%` }}></div>
                      </div>
                    </div>

                    {/* Loyalty / Relation */}
                    {recruitedSet.has(displayGeneral.id) && (
                      <div className="flex items-center gap-2 pt-1.5 border-t border-artistic-charcoal/20 mt-1">
                        <Heart className="w-4 h-4 text-artistic-crimson fill-artistic-crimson" />
                        <div className="flex-1">
                          <div className="flex justify-between text-[10px] font-bold text-artistic-ink">
                            <span>军心忠诚度</span>
                            <span>{displayGeneral.loyalty} / 100</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>


              {/* General Special Combat Ruse */}
              <div className="bg-artistic-cream border border-artistic-crimson/30 p-2.5 rounded-none text-xs leading-normal mb-4">
                <div className="font-serif font-black text-artistic-crimson mb-0.5 flex items-center gap-1">
                  <Swords className="w-3.5 h-3.5" />
                  特有战法技能：{displayGeneral.skill}
                </div>
                <p className="text-[11px] text-[#2a2319] leading-relaxed">{displayGeneral.skillDesc}</p>
              </div>

              {/* Short Calligraphy biography text with Detail Button Overlay */}
              <div className="border border-artistic-charcoal/20 bg-artistic-cream/40 p-2.5 rounded-none text-[11px] text-stone-800 leading-normal mb-4">
                <div className="flex gap-1 items-start mb-2">
                  <BookOpen className="w-3.5 h-3.5 mt-0.5 text-artistic-charcoal opacity-70 shrink-0" />
                  <p className="font-serif italic text-[#2a2319]">
                    “{displayGeneral.biography}”
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBioOverlay(true)}
                  className="w-full bg-artistic-cream hover:bg-stone-100 text-stone-700 border border-stone-400 py-1 font-serif font-bold text-[10px] text-center transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3 h-3 text-stone-500" />
                  查看详细传记 (英雄列传史实)
                </button>
              </div>
            </div>

            {/* Dynamics Actions block: Recruit or Train */}
            <div className="border-t border-artistic-charcoal/35 pt-4">
              {recruitedSet.has(displayGeneral.id) ? (
                <div className="space-y-3">
                  {/* Focus training select dropdown */}
                  <div className="bg-[#fcfaf2] border-2 border-dashed border-amber-800/20 p-2.5 rounded-none flex flex-col gap-1.5 shadow-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black text-amber-900 font-serif flex items-center gap-1">
                        🎯 重点督导科目：
                      </span>
                      <span className="text-[9px] text-[#2a2319]/70 font-mono font-bold">
                        (该科目加成概率极大幅度增加)
                      </span>
                    </div>
                    <select
                      value={generalFocus[displayGeneral.id] || 'none'}
                      onChange={(e) => {
                        const updatedFocus = { ...generalFocus, [displayGeneral.id]: e.target.value };
                        setGeneralFocus(updatedFocus);
                        localStorage.setItem('tk_general_training_focus_v1', JSON.stringify(updatedFocus));
                      }}
                      className="w-full bg-white text-stone-900 border border-artistic-charcoal py-1.5 px-2 text-xs font-serif font-black outline-none rounded-none focus:border-artistic-crimson"
                    >
                      <option value="none">均衡培养 (五维平均修行)</option>
                      <option value="force">武力专修 (修习马弓枪术 - 武力)</option>
                      <option value="intelligence">智计攻书 (研读战阵奇谋 - 智力)</option>
                      <option value="leadership">统御三军 (演练铁壁八阵 - 统帅)</option>
                      <option value="politics">理政吏治 (修缮农桑民生 - 政治)</option>
                      <option value="virtue">修身立德 (亲贤礼下不坠 - 德行)</option>
                    </select>
                  </div>

                  {/* Supervise Training action button */}
                  <button
                    onClick={() => handleTrain(displayGeneral)}
                    className="w-full bg-artistic-charcoal hover:bg-artistic-crimson text-artistic-bg hover:text-white py-2 px-3 rounded-none font-serif font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    督导训练 (消耗 150 黄金)
                  </button>
                  {trainingLog && (
                    <div className="bg-artistic-cream p-2.5 rounded-none text-[10.5px] text-artistic-ink border border-artistic-charcoal/40 leading-relaxed font-serif relative">
                      {trainingLog}
                    </div>
                  )}

                  {/* Growth Attributes progression chart (D3 line chart) */}
                  <div className="my-3">
                    <GeneralAttributesChart 
                      history={getGeneralHistory(displayGeneral.id, displayGeneral)} 
                      generalName={displayGeneral.name} 
                    />
                  </div>

                  {/* RECENT TRAINING HISTORY LOGS LIST PANEL (SHOWS LAST 5 ACTIONS) */}
                  <div className="mt-3 border-t border-stone-300 pt-3">
                    <div className="flex justify-between items-center mb-1.5">
                      <h5 className="text-[10px] font-serif font-black text-artistic-crimson tracking-wider flex items-center gap-1">
                        📜 历次军纪校练手记 (最近5次)
                      </h5>
                      {trainingHistory.length > 0 && (
                        <button
                          onClick={() => {
                            setTrainingHistory([]);
                            localStorage.removeItem('tk_training_history');
                          }}
                          className="text-[9.5px] text-stone-400 hover:text-artistic-crimson transition-all cursor-pointer"
                        >
                          清除记录
                        </button>
                      )}
                    </div>
                    {trainingHistory.length > 0 ? (
                      <div className="space-y-1 bg-artistic-cream/60 p-2 border border-stone-200">
                        {trainingHistory.map((rec, rIdx) => (
                          <div key={rec.id || rIdx} className="text-[10px] font-serif font-bold text-stone-800 flex justify-between items-center border-b border-dashed border-stone-200 last:border-0 pb-0.5 last:pb-0">
                            <span className="flex items-center gap-1 truncate max-w-[100px]">
                              <span className="text-[8px] bg-artistic-charcoal/10 text-artistic-ink px-1">{rec.avatar}</span>
                              <span className="truncate">{rec.name.split(' ')[0]}</span>
                            </span>
                            <span className="text-emerald-700 font-extrabold font-serif">属性【{rec.statName}】+{rec.gainValue}</span>
                            <span className="text-amber-800 text-[9px] font-mono">🪙 -{rec.goldCost}金</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-3 bg-artistic-cream/20 border border-dashed border-stone-300 text-[10px] text-stone-400 font-serif italic">
                        尚无校场练兵演武纪要。
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between text-[10.5px] font-serif bg-artistic-crimson/5 p-2 rounded-none border border-artistic-crimson/30 text-artistic-crimson">
                    <span>纳贤筹币: 🌾 {displayGeneral.recruitCost} 金</span>
                    <span>最低霸略声望: 👑 {(displayGeneral.recruitCost / 3).toFixed(0)}</span>
                  </div>
                  <button
                    onClick={() => handleRecruit(displayGeneral)}
                    className="w-full bg-artistic-crimson hover:bg-red-800 text-artistic-bg py-2.5 px-3 rounded-none font-serif font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-300" />
                    备礼礼贤拜访：纳为此将
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-artistic-bg border-4 border-artistic-charcoal rounded-none p-5 shadow-sm flex-1 flex items-center justify-center text-artistic-charcoal/70 italic text-xs font-serif">
            请在左侧将臣簿中选择武将，阅览生平与属性。
          </div>
        )}
      </div>

      {/* DETAILED BIOGRAPHY PARCHMENT OVERLAY MODAL */}
      {showBioOverlay && displayGeneral && (
        <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#fcf8f2] border-4 border-artistic-charcoal max-w-2xl w-full p-6 md:p-8 shadow-2xl relative animate-scale-up border-double max-h-[90vh] overflow-y-auto scrollbar-ink text-left">
            {/* Ink drop corner design */}
            <div className="absolute top-0 right-0 p-3 opacity-15 text-stone-700 pointer-events-none text-6xl font-serif">
              📜
            </div>

            <button
              onClick={() => setShowBioOverlay(false)}
              className="absolute top-4 right-4 p-1.5 border-2 border-artistic-charcoal bg-artistic-cream text-artistic-charcoal hover:bg-artistic-crimson hover:text-white transition-all cursor-pointer rounded-none"
              title="归本（关闭）"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b-2 border-artistic-charcoal/60 pb-3 mb-4">
              <span className="text-[10px] uppercase font-mono tracking-widest bg-artistic-charcoal text-[#fcf8f2] px-2 py-0.5 font-bold">
                大汉名将列传 · 史册档案
              </span>
              <h3 className="font-serif font-black text-2xl text-artistic-crimson mt-2 font-calligraphy">
                {DETAILED_BIOGRAPHIES[displayGeneral.id]?.title || `汉末名臣 · ${displayGeneral.name}`}
              </h3>
            </div>

            {/* Part 1: Life Biography */}
            <div className="mb-6">
              <h4 className="font-serif font-black text-xs text-amber-950 bg-amber-100/60 border border-amber-800/20 py-1 px-2.5 mb-2.5 flex items-center gap-1">
                📖 生平起居注 (Life Biography)
              </h4>
              <div className="space-y-3.5 text-stone-800 text-[12px] md:text-sm font-serif leading-relaxed">
                {DETAILED_BIOGRAPHIES[displayGeneral.id] ? (
                  DETAILED_BIOGRAPHIES[displayGeneral.id].chapters.map((paragraph, pIdx) => (
                    <p key={pIdx} className="indent-6 text-justify">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <>
                    <p className="indent-6 text-justify">
                      【野纪生平】{displayGeneral.name}，字号生平如其名，在三国动乱史实中威扬名重。特有兵形战法：『{displayGeneral.skill}』。拥有极高战术潜力。
                    </p>
                    <p className="indent-6 text-justify">
                      “{displayGeneral.biography}” 传记记载简约，但其行事克己忠义，能在校场及战策抉择中为主公力挽狂澜。
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Part 2: Historical Legends (历史典故) */}
            {(() => {
              const la = GENERAL_LEGENDS_ACHIEVEMENTS[displayGeneral.id];
              if (!la) return null;
              return (
                <div className="mb-6 bg-amber-50/50 border-y border-amber-900/30 p-3">
                  <h4 className="font-serif font-black text-xs text-amber-900 mb-1.5 flex items-center gap-1">
                    🌟 历史传世典故 (Legends & Tales)
                  </h4>
                  <span className="font-serif font-extrabold text-amber-950 text-xs block mb-1">
                    {la.legendTitle}
                  </span>
                  <p className="text-stone-700 text-[11.5px] leading-relaxed font-serif italic indent-4">
                    {la.legendContent}
                  </p>
                </div>
              );
            })()}

            {/* Part 3: SSS Interactive Exclusive Achievements (专属成就进度) */}
            {(() => {
              const la = GENERAL_LEGENDS_ACHIEVEMENTS[displayGeneral.id];
              if (!la) return null;
              return (
                <div className="mb-6 bg-stone-50 border border-stone-200 p-3.5 rounded-none">
                  <h4 className="font-serif font-black text-xs text-stone-900 mb-2.5 flex items-center justify-between">
                    <span>🏆 主公互动 · 专属将星成就进度 (Interactive Achievements)</span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      (与玩家互动或督导等阶决定达成度)
                    </span>
                  </h4>
                  <div className="space-y-3">
                    {la.achievements.map((ach, idx) => {
                      const statsInfo = ach.formula(displayGeneral, recruitedSet.has(displayGeneral.id));
                      return (
                        <div key={idx} className="bg-white border border-stone-250 p-2.5 rounded-none flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-serif font-black text-stone-900 text-xs flex gap-1.5 items-center">
                                <span className="text-sm">{statsInfo.achieved ? '🥇' : '🔒'}</span>
                                {ach.name}
                              </span>
                              <span className="text-[10.5px] font-bold text-stone-500 font-serif">
                                【指标：{ach.targetDesc}】
                              </span>
                            </div>
                            {/* Visual Progress Bar indicator */}
                            <div className="w-full bg-stone-100 h-2.5 border border-stone-300 overflow-hidden flex relative items-center">
                              <div 
                                className={`h-full transition-all duration-500 ${statsInfo.achieved ? 'bg-amber-600' : 'bg-stone-500'}`}
                                style={{ width: `${statsInfo.progress}%` }}
                              ></div>
                              <span className="absolute right-1 text-[8px] font-mono leading-none font-extrabold text-stone-700">
                                {statsInfo.progress}%
                              </span>
                            </div>
                          </div>
                          {/* Crown or check icon for completed */}
                          <div className="shrink-0">
                            {statsInfo.achieved ? (
                              <span className="bg-amber-500 text-amber-950 font-bold font-serif text-[10px] px-2 py-1 border border-amber-600 shadow-sm">
                                已达标
                              </span>
                            ) : (
                              <span className="bg-stone-100 text-stone-400 font-bold font-serif text-[10px] px-2 py-1 border border-stone-300">
                                磨炼中
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            <div className="border-t border-stone-300 pt-4 flex gap-4 items-center">
              <div className="w-10 h-10 bg-artistic-crimson/10 border border-artistic-crimson flex items-center justify-center font-serif font-black text-artistic-crimson shrink-0">
                {displayGeneral.avatar}
              </div>
              <div className="text-[11px] font-serif text-stone-600">
                <div className="font-black text-stone-800">将星寄语</div>
                “主公厚德贤明，末将愿执鞍前马后，誓平乱党，匡救万民安康！”
              </div>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setShowBioOverlay(false)}
                className="bg-artistic-charcoal hover:bg-artistic-crimson text-artistic-bg px-4 py-1.5 font-serif font-bold text-xs cursor-pointer shadow transition-all border border-stone-800"
              >
                合上竹简（关闭）
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DUAL GENERAL FIVE-DIMENSIONAL RADAR CHART COMPARISON OVERLAY */}
      {showComparePopup && selectedCompareIds.length === 2 && (() => {
        const gen1 = INITIAL_GENERAL_POOL[selectedCompareIds[0]];
        const gen2 = INITIAL_GENERAL_POOL[selectedCompareIds[1]];
        if (!gen1 || !gen2) return null;

        return (
          <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#fcf8f2] border-4 border-artistic-charcoal max-w-2xl w-full p-5 md:p-7 shadow-2xl relative animate-scale-up rounded-none border-double max-h-[95vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowComparePopup(false);
                  setCompareMode(false);
                  setSelectedCompareIds([]);
                }}
                className="absolute top-4 right-4 p-1.5 border-2 border-artistic-charcoal bg-artistic-cream text-artistic-charcoal hover:bg-artistic-crimson hover:text-white transition-all cursor-pointer rounded-none"
                title="关闭"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title Section */}
              <div className="border-b-2 border-artistic-charcoal pb-3 mb-5 text-center">
                <h3 className="font-serif font-black text-lg md:text-xl text-artistic-charcoal flex justify-center items-center gap-1.5 font-calligraphy">
                  ⚔️ 幕府双雄 · 五维属性大策比对
                </h3>
                <p className="text-[10px] text-stone-600 font-serif mt-0.5">
                  通过校对大将五维度神策分布，以助主公做出准确的校军资源投放与军事部署
                </p>
              </div>

              {/* Comparative Layout Grid */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center mb-5">
                {/* General 1 Column */}
                <div className="md:col-span-2 text-center bg-red-50 border border-red-200 p-3 flex flex-col items-center justify-between h-full">
                  <div>
                    <div className="w-12 h-12 rounded-none bg-artistic-crimson text-white border-2 border-artistic-charcoal flex items-center justify-center font-bold font-serif text-lg mb-2 shadow">
                      {gen1.avatar}
                    </div>
                    <h4 className="font-serif font-black text-sm text-artistic-crimson">{gen1.name.split(' ')[0]}</h4>
                    <span className="text-[9px] bg-artistic-crimson/10 text-artistic-crimson px-1.5 py-0.5 font-serif font-bold inline-block mt-1">
                      等阶: LV.{gen1.level} 虎臣
                    </span>
                  </div>
                  {/* Stats list */}
                  <div className="space-y-1 w-full text-[10.5px] font-serif font-bold text-stone-700 mt-3 text-left border-t border-red-200/60 pt-2">
                    <div className="flex justify-between"><span>武力:</span><span className="text-artistic-crimson">{gen1.force}</span></div>
                    <div className="flex justify-between"><span>智力:</span><span>{gen1.intelligence}</span></div>
                    <div className="flex justify-between"><span>统帅:</span><span>{gen1.leadership}</span></div>
                    <div className="flex justify-between"><span>政治:</span><span>{gen1.politics}</span></div>
                    <div className="flex justify-between"><span>德行:</span><span>{gen1.virtue}</span></div>
                    <div className="flex justify-between border-t border-red-200/60 pt-1 mt-1 text-[10px]">
                      <span>忠诚: 💖 {gen1.loyalty}</span>
                    </div>
                  </div>
                </div>

                {/* MIDDLE: RADAR CHART AREA */}
                <div className="md:col-span-3 flex flex-col items-center justify-center py-2">
                  <svg viewBox="0 0 300 300" className="w-[230px] h-[230px] md:w-[250px] md:h-[250px] mx-auto">
                    {/* Ring polygons */}
                    <polygon points={drawRing(100, 150, 150, 90)} fill="none" stroke="#555" strokeWidth="1" opacity="0.4" />
                    <polygon points={drawRing(75, 150, 150, 90)} fill="none" stroke="#777" strokeWidth="0.75" strokeDasharray="3,3" opacity="0.3" />
                    <polygon points={drawRing(50, 150, 150, 90)} fill="none" stroke="#777" strokeWidth="0.75" strokeDasharray="3,3" opacity="0.3" />
                    <polygon points={drawRing(25, 150, 150, 90)} fill="none" stroke="#777" strokeWidth="0.75" strokeDasharray="3,3" opacity="0.3" />

                    {/* Axle Lines */}
                    <path d={drawSpoke(0, 150, 150, 90)} stroke="#222" strokeWidth="0.75" opacity="0.25" />
                    <path d={drawSpoke(1, 150, 150, 90)} stroke="#222" strokeWidth="0.75" opacity="0.25" />
                    <path d={drawSpoke(2, 150, 150, 90)} stroke="#222" strokeWidth="0.75" opacity="0.25" />
                    <path d={drawSpoke(3, 150, 150, 90)} stroke="#222" strokeWidth="0.75" opacity="0.25" />
                    <path d={drawSpoke(4, 150, 150, 90)} stroke="#222" strokeWidth="0.75" opacity="0.25" />

                    {/* Axis Labels */}
                    {(() => {
                      const labels = ['武力', '智力', '统帅', '政治', '德行'];
                      return labels.map((label, idx) => {
                        const pos = getLabelPosition(idx, 150, 150, 90);
                        return (
                          <text
                            key={idx}
                            x={pos.x}
                            y={pos.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-[11px] font-serif font-black fill-stone-800"
                          >
                            {label}
                          </text>
                        );
                      });
                    })()}

                    {/* Polygon 1 (Crimson / Gen1) */}
                    <polygon
                      points={(() => {
                        const pts = [
                          getCoordinates(gen1.force, 0, 150, 150, 90),
                          getCoordinates(gen1.intelligence, 1, 150, 150, 90),
                          getCoordinates(gen1.leadership, 2, 150, 150, 90),
                          getCoordinates(gen1.politics, 3, 150, 150, 90),
                          getCoordinates(gen1.virtue, 4, 150, 150, 90)
                        ];
                        return pts.map(p => `${p.x},${p.y}`).join(' ');
                      })()}
                      fill="rgba(185, 28, 28, 0.35)"
                      stroke="#b91c1c"
                      strokeWidth="2.5"
                    />

                    {/* Polygon 2 (Blue / Gen2) */}
                    <polygon
                      points={(() => {
                        const pts = [
                          getCoordinates(gen2.force, 0, 150, 150, 90),
                          getCoordinates(gen2.intelligence, 1, 150, 150, 90),
                          getCoordinates(gen2.leadership, 2, 150, 150, 90),
                          getCoordinates(gen2.politics, 3, 150, 150, 90),
                          getCoordinates(gen2.virtue, 4, 150, 150, 90)
                        ];
                        return pts.map(p => `${p.x},${p.y}`).join(' ');
                      })()}
                      fill="rgba(29, 78, 216, 0.35)"
                      stroke="#1d4ed8"
                      strokeWidth="2.5"
                    />

                    {/* G1 Vertices Dots */}
                    {[gen1.force, gen1.intelligence, gen1.leadership, gen1.politics, gen1.virtue].map((v, i) => {
                      const pts = getCoordinates(v, i, 150, 150, 90);
                      return <circle key={'dot1-'+i} cx={pts.x} cy={pts.y} r="3" fill="#b91c1c" stroke="#fff" strokeWidth="0.75" />;
                    })}

                    {/* G2 Vertices Dots */}
                    {[gen2.force, gen2.intelligence, gen2.leadership, gen2.politics, gen2.virtue].map((v, i) => {
                      const pts = getCoordinates(v, i, 150, 150, 90);
                      return <circle key={'dot2-'+i} cx={pts.x} cy={pts.y} r="3" fill="#1d4ed8" stroke="#fff" strokeWidth="0.75" />;
                    })}
                  </svg>

                  {/* Tiny Legend */}
                  <div className="flex gap-4 text-[10px] font-serif font-black mt-2">
                    <span className="flex items-center gap-1.5 text-artistic-crimson">
                      <span className="w-3 h-1.5 bg-[#b91c1c] inline-block opacity-80"></span>
                      {gen1.name.split(' ')[0]} (主战)
                    </span>
                    <span className="flex items-center gap-1.5 text-blue-700">
                      <span className="w-3 h-1.5 bg-[#1d4ed8] inline-block opacity-80"></span>
                      {gen2.name.split(' ')[0]} (辅翼)
                    </span>
                  </div>
                </div>

                {/* General 2 Column */}
                <div className="md:col-span-2 text-center bg-blue-50 border border-blue-200 p-3 flex flex-col items-center justify-between h-full">
                  <div>
                    <div className="w-12 h-12 rounded-none bg-blue-700 text-white border-2 border-artistic-charcoal flex items-center justify-center font-bold font-serif text-lg mb-2 shadow">
                      {gen2.avatar}
                    </div>
                    <h4 className="font-serif font-black text-sm text-blue-800">{gen2.name.split(' ')[0]}</h4>
                    <span className="text-[9px] bg-blue-700/10 text-blue-700 px-1.5 py-0.5 font-serif font-bold inline-block mt-1">
                      等阶: LV.{gen2.level} 虎臣
                    </span>
                  </div>
                  {/* Stats list */}
                  <div className="space-y-1 w-full text-[10.5px] font-serif font-bold text-stone-700 mt-3 text-left border-t border-blue-200/60 pt-2">
                    <div className="flex justify-between"><span>武力:</span><span>{gen2.force}</span></div>
                    <div className="flex justify-between"><span>智力:</span><span className="text-blue-800">{gen2.intelligence}</span></div>
                    <div className="flex justify-between"><span>统帅:</span><span>{gen2.leadership}</span></div>
                    <div className="flex justify-between"><span>政治:</span><span>{gen2.politics}</span></div>
                    <div className="flex justify-between"><span>德行:</span><span>{gen2.virtue}</span></div>
                    <div className="flex justify-between border-t border-blue-200/60 pt-1 mt-1 text-[10px]">
                      <span>忠诚: 💖 {gen2.loyalty}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills and Combat Comparison Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-stone-300 pt-4 mb-5">
                <div className="bg-red-50/50 p-2 border border-red-200 text-[11px] font-serif leading-normal">
                  <span className="font-extrabold text-artistic-crimson block mb-0.5">⚔️ {gen1.name.split(' ')[0]} · 独门战法 [{gen1.skill}]</span>
                  <p className="text-stone-700">{gen1.skillDesc}</p>
                </div>
                <div className="bg-blue-50/50 p-2 border border-blue-200 text-[11px] font-serif leading-normal">
                  <span className="font-extrabold text-blue-800 block mb-0.5">⚔️ {gen2.name.split(' ')[0]} · 独门战法 [{gen2.skill}]</span>
                  <p className="text-stone-700">{gen2.skillDesc}</p>
                </div>
              </div>

              {/* Actions panel */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowComparePopup(false);
                    setCompareMode(false);
                    setSelectedCompareIds([]);
                  }}
                  className="bg-artistic-charcoal hover:bg-stone-800 text-artistic-bg px-4 py-2 font-serif font-black text-xs cursor-pointer shadow-md transition-all border border-stone-900"
                >
                  合册罢兵 (关闭对比)
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
