/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Chapter, StoryScene } from '../types';

export const GAME_CHAPTERS: Chapter[] = [
  {
    id: 'c1',
    num: '第一章',
    title: '世外批命，桃园结盟',
    period: '公元177年 - 184年',
    startSceneId: 'c1_0',
    desc: '世外高人批算天命，山寇突袭村庄。幽州桃树繁盛，豪杰于市井之中角力相争，命运轨迹自此全盘重构。'
  },
  {
    id: 'c2',
    num: '第二章',
    title: '平定北海，北击匈奴',
    period: '公元185年 - 189年',
    startSceneId: 'c2_1',
    desc: '黄巾初歇，烽烟又起。青州北海孔融求救，雁门外胡马匈奴乘虚犯境。天下英雄并立，当立盖世奇功！'
  },
  {
    id: 'c3',
    num: '第三章',
    title: '董卓乱政，群雄讨董',
    period: '公元190年 - 192年',
    startSceneId: 'c3_1',
    desc: '西凉魔王董卓强夺朝政，毒杀少帝，火烧洛阳。十八路诸侯歃血为盟，剑指雄关。神将吕布跃马于前，谁敢争锋？'
  },
  {
    id: 'c4',
    num: '第四章',
    title: '江山入鼎，群雄争辉',
    period: '公元193年 - 200年',
    startSceneId: 'c4_1',
    desc: '中原大战，江山四分。曹操、刘备、孙策割据四方。于夹缝中求生者，是顺应大势依附霸主，还是自立中原图霸天下？'
  },
  {
    id: 'c5',
    num: '第五章',
    title: '赤壁狂澜，借风火攻',
    period: '公元201年 - 208年',
    startSceneId: 'c5_1',
    desc: '曹公铁骑滚滚南下，旌旗蔽空，战船锁大江。东吴柴桑计定火攻。烈火红岩之上，天下三分，抑或一统？'
  },
  {
    id: 'c6',
    num: '第六章',
    title: '回天有术，解危续命',
    period: '公元209年 - 225年',
    startSceneId: 'c6_1',
    desc: '群英凋零，岁月摧人心。关云长麦城受困生死一线；诸葛武侯五丈原星明难续，逆转历史之悲剧，唯赖改命人！'
  },
  {
    id: 'c7',
    num: '第七章',
    title: '万世合流，三国归一',
    period: '公元226年 - 280年',
    startSceneId: 'c7_1',
    desc: '乱世百年，百骨露野。司马氏江山代换，天下一统狂潮不可阻挡。天道轮回，一洗悲歌，终结百载战乱！'
  }
];

export const GAME_SCENES: Record<string, StoryScene> = {
  // ------------ CHAPTER 1 PREQUEL SCENES ------------
  'c1_0': {
    id: 'c1_0',
    chapterId: 'c1',
    title: '世外高人，卦演天机',
    year: 177,
    narration: '公元177年（汉熹平六年）暮春，你于幽州涿郡界内的大荒山中游历。忽见竹林深处，一位道人乘白鹿迎风而至，须发皆白、超逸绝尘。道人凝视你良久，抚掌大笑道：『异曜临凡，命星错落。贫道南华，看你骨骼内藏吞吐寰宇之气，却居于草野。今日贫道便为你破例批算一卦。若许你执掌乾坤，主公欲以何种道法匡扶大汉社稷？』',
    historicalFact: '公元177年，汉室熹平年间。真实历史中，此时宦官党争酷烈，张角已在北方借“太平道”施符治病广收信徒。南华老仙或世外高人批算在野英雄，皆属演义浪漫笔触。',
    options: [
      {
        id: 'c1_0_opt1',
        text: '【安民济鼎】四海多艰，愿求仁德法政，拯救天下黎民苍生。',
        effect: {
          statChanges: { virtue: 15, politics: 10 },
          customLog: '你表明心迹：大乱将至，当施仁爱法度以抚民心。南华道人点头赞许。'
        },
        nextSceneId: 'c1_0_anmin'
      },
      {
        id: 'c1_0_opt2',
        text: '【逐鹿枭途】成王败寇，唯有掌握盖世兵权与雷霆手段，方能重肃万里乾坤。',
        effect: {
          statChanges: { force: 10, intelligence: 15 },
          customLog: '你坦言志向：乱世当用霸道。成王败寇，唯有强兵暴权方能止乱。道人长叹：『真枭桀也！』'
        },
        nextSceneId: 'c1_0_zhulu'
      },
      {
        id: 'c1_0_opt3',
        text: '【赤心忠烈】誓死捍卫汉室宗庙，粉身碎骨，以匡扶天地纲常。',
        effect: {
          statChanges: { force: 15, leadership: 10 },
          customLog: '你慨然宣誓：身为汉臣，当死社稷！赤胆昭雪，不可背纲倒常。'
        },
        nextSceneId: 'c1_0_shouwei'
      },
      {
        id: 'c1_0_opt4',
        text: '【逆天改命】知乾坤将倾、名将夭亡，誓要逆转悲剧星轨，另辟盛世！',
        effect: {
          statChanges: { intelligence: 10, politics: 15, deviance: 10 },
          customLog: '你直言不讳：天下将有宿命悲情（如关云长败麦城、武侯星坠五丈原），吾既来此，誓要逆天改命，一洗青史！'
        },
        nextSceneId: 'c1_0_wankuang'
      }
    ]
  },
  'c1_0_anmin': {
    id: 'c1_0_anmin',
    chapterId: 'c1',
    title: '安民批言：择何重器',
    year: 177,
    narration: '南华老仙合拢掌上铜书，拂尘轻挥道：『安民者，需有大毅力。明主既动大慈，这三卷天机批言，主公当取何等雅号为重？』',
    historicalFact: '古人极为重视称号与明君官声。自陈胜、刘邦起，“受命于天”的尊称称号是建立地方割据、笼络人心之必要精神枢纽。',
    options: [
      {
        id: 'c1_0_anmin_opt1',
        text: '“誓作治世之英杰名臣。” —— 加冕称号【治世之能臣】。',
        effect: {
          statChanges: { politics: 12, virtue: 12 },
          title: '治世之能臣',
          customLog: '南华批语：『公之高才，乃治世之能臣也！』你自领该称号，深受大汉保皇人士敬仰。'
        },
        nextSceneId: 'c1_0_village_raid'
      },
      {
        id: 'c1_0_anmin_opt2',
        text: '“以盖世之德，为百家之明主。” —— 加冕称号【中兴之圣王】。',
        effect: {
          statChanges: { virtue: 25, prestige: 50 },
          title: '中兴之圣王',
          customLog: '南华批语：『怀圣王大德，德行普照宇内。』你自领此号，起始大名威武，声望威名高企。'
        },
        nextSceneId: 'c1_0_village_raid'
      },
      {
        id: 'c1_0_anmin_opt3',
        text: '“倾尽心血以护黎民骨肉。” —— 加冕称号【仁义之乾坤君】。',
        effect: {
          statChanges: { virtue: 20, leadership: 10 },
          title: '仁义之乾坤君',
          customLog: '南华唏嘘：『以仁义为乾坤。百姓幸甚！』你自领其称号，对基层将士与难民极具吸引力。'
        },
        nextSceneId: 'c1_0_village_raid'
      }
    ]
  },
  'c1_0_zhulu': {
    id: 'c1_0_zhulu',
    chapterId: 'c1',
    title: '枭霸抉择：权谋并立',
    year: 177,
    narration: '南华老仙眼透电光，哂笑道：『逐鹿者以万民为刍狗，神州为棋盘。如此，你当以何等枭雄冷血兵法自立？』',
    historicalFact: '乱世唯重实力。汉末群雄如董卓、袁绍、曹操，其争夺天下所依靠的都是对兵权、谋统的极度尊尚。',
    options: [
      {
        id: 'c1_0_zhulu_opt1',
        text: '“制变百官，宁我负人。” —— 加冕称号【乱世之枭雄】。',
        effect: {
          statChanges: { intelligence: 15, leadership: 10, deviance: 15 },
          title: '乱世之枭雄',
          customLog: '南华狂笑：『真一代乱世枭雄耳！』你领得此号，心智权谋冠绝，行事果断暴烈，青史偏轨迹大大摇晃。'
        },
        nextSceneId: 'c1_0_village_raid'
      },
      {
        id: 'c1_0_zhulu_opt2',
        text: '“以万里吞吐八荒之势自霸。” —— 加冕称号【吞吐八荒之霸主】。',
        effect: {
          statChanges: { leadership: 20, force: 10 },
          title: '吞吐八荒之霸主',
          customLog: '道人警诫：『野心破天，须防兵骄。』你自领雄主大纛，起始全军统率才质大涨。'
        },
        nextSceneId: 'c1_0_village_raid'
      },
      {
        id: 'c1_0_zhulu_opt3',
        text: '“算尽天机，不避鬼神之谋。” —— 加冕称号【绝代之策神】。',
        effect: {
          statChanges: { intelligence: 25, politics: 5 },
          title: '绝代之策神',
          customLog: '南华叹息：『多智如神，算无遗漏。』你自命策神，凡施诡计之策或山河军功无往不利。'
        },
        nextSceneId: 'c1_0_village_raid'
      }
    ]
  },
  'c1_0_shouwei': {
    id: 'c1_0_shouwei',
    chapterId: 'c1',
    title: '忠肝批命：汉祚赤胆',
    year: 177,
    narration: '南华老仙慨叹：『大汉气数本已在枯竭边角，天意难违。公一腔忠义，欲如何将身躯化作擎天之柱？』',
    historicalFact: '汉末如文聘、卢植、皇甫嵩等名将，虽知汉室风雨飘摇，仍舍身捍卫赤帝神威，极得后世史评推崇。',
    options: [
      {
        id: 'c1_0_shouwei_opt1',
        text: '“鞠躬尽瘁，宁为皇室内廷死节。” —— 加冕称号【汉室中流之赤臣】。',
        effect: {
          statChanges: { politics: 15, virtue: 15 },
          title: '汉室中流之赤臣',
          customLog: '道人折腰作礼：『公乃社稷中流一柱！』你戴封此称，朝堂重臣、名流汉裔莫不上门拜交。'
        },
        nextSceneId: 'c1_0_village_raid'
      },
      {
        id: 'c1_0_shouwei_opt2',
        text: '“一人一坐骑，万将避易！” —— 加冕称号【万人之敌烈武神】。',
        effect: {
          statChanges: { force: 25, troops: 200 },
          title: '万人之敌烈武神',
          customLog: '南华拊髀：『杀气腾天，战力凌尘。』你领下武神钢魂，长枪一出，力折关张，勇压群雄！'
        },
        nextSceneId: 'c1_0_village_raid'
      },
      {
        id: 'c1_0_shouwei_opt3',
        text: '“肝胆赤烈，愿作明主开山宿宿将。” —— 加冕称号【忠肝义胆之骁将】。',
        effect: {
          statChanges: { force: 15, virtue: 10, prestige: 30 },
          title: '忠肝义胆之骁将',
          customLog: '道人敬服。你自命虎臣，忠诚度极佳，校场练兵士气昂扬，阵斩贼首百死不悔。'
        },
        nextSceneId: 'c1_0_village_raid'
      }
    ]
  },
  'c1_0_wankuang': {
    id: 'c1_0_wankuang',
    chapterId: 'c1',
    title: '逆天批语：昭雪乾坤',
    year: 177,
    narration: '南华老仙拂袖，双眸透五彩云霞：『奇人也！知造化之险阻而逆行，大青史因你大面积扭转崩碎。你要手执何等昭雪之大权？』',
    historicalFact: '历史上许多英豪如黄忠早夭、周瑜寿短、关云长走麦城神人共泣。逆转此类悲情历史，是“昭雪史册”之核心魅力所在。',
    options: [
      {
        id: 'c1_0_wankuang_opt1',
        text: '“以博古之学术，化解尘寰多余灾殃。” —— 加冕称号【万黎庇护之圣儒】。',
        effect: {
          statChanges: { politics: 20, virtue: 10, gold: 300 },
          title: '万黎庇护之圣儒',
          customLog: '道人赐天理：『开棚医饥，德披寰宇。』你领受号，城池内政富饶、岁贡黄金丰厚。'
        },
        nextSceneId: 'c1_0_village_raid'
      },
      {
        id: 'c1_0_wankuang_opt2',
        text: '“逆历史悲吟，挽狂澜改写星图。” —— 加冕称号【逆天改命之昭雪宿】。',
        effect: {
          statChanges: { deviance: 30, intelligence: 10, prestige: 60 },
          title: '逆天改命之昭雪宿',
          customLog: '老仙化风离去，唯留余音：『史官之笔，正因足下而发抖！』你加冕此冠称，初始偏轨进度大爆，命运完全进入未知疆域！'
        },
        nextSceneId: 'c1_0_village_raid'
      },
      {
        id: 'c1_0_wankuang_opt3',
        text: '“统汉师，封狼居胥，彻底底荡平胡虏大祸。” —— 加冕称号【封狼居胥之神武帅】。',
        effect: {
          statChanges: { leadership: 20, force: 10, troops: 500 },
          title: '封狼居胥之神武帅',
          customLog: '空中鹤鸣。你自冠武帅之称，初始军旅兵力极其强猛，乃不世兵略战神也！'
        },
        nextSceneId: 'c1_0_village_raid'
      }
    ]
  },
  'c1_0_village_raid': {
    id: 'c1_0_village_raid',
    chapterId: 'c1',
    title: '暮晚盗匪，火侵寒村',
    year: 183,
    narration: '得到高人批命数载，你于涿郡安居筑庄，私蓄实力。公元183年寒冬，黄巾乱军爆发前夜，天下早已盗匪纵横。深夜，你庄外的山坳突狼火连天！一伙凶恶的流匪山贼（数百余骑）乘着黑影破墙而入，哭喊连片，刀索如雨。你身旁的村长和数千村民仓惶跪叩，哭求你执兵迎敌！',
    historicalFact: '黄巾起义前数年，华北各地因天灾连连、宦官搜刮，大量饥民归逃为寇盗（如黑山、白波流寇），行劫庄舍、屠略乡曲，朝廷官厅根本无力绥靖。',
    options: [
      {
        id: 'c1_village_opt1',
        text: '【武胆冲锋】持寒锋一跃出战，单骑挑杀山贼首领 (需要武力 65)',
        requirement: { attribute: 'force', minVal: 65 },
        effect: {
          statChanges: { force: 2, prestige: 35, troops: 200 },
          customLog: '你长啸突锋，银枪一扫崩碎两面顽盾。只一掌便将叫阵山贼首挑爆阵前！余寇肝胆碎裂败散而去。村民狂呼，大批壮勇投诚效忠（兵员+200）。'
        },
        nextSceneId: 'c1_village_force_success'
      },
      {
        id: 'c1_village_opt2',
        text: '【弱武强攻】武功未竞大成，强行血拼寇匪 (武力 65 以下)',
        effect: {
          statChanges: { gold: -50, troops: -100 },
          customLog: '你一身孤勇突阵，不慎陷入合围。虽苦战折损数十贼军，但右股中流箭创伤，终仅勉强击离。庄中家财库饷多遭抢夺，庄兵折损严重（黄金-50，折兵-100）。'
        },
        nextSceneId: 'c1_village_force_fail'
      },
      {
        id: 'c1_village_opt3',
        text: '【奇谋纵火】庄门假意敞开，引贼兵没入后村枯草死林，顺劲风狂烧之！ (需要智力 65)',
        requirement: { attribute: 'intelligence', minVal: 65 },
        effect: {
          statChanges: { intelligence: 2, prestige: 30, gold: 150 },
          customLog: '你布设口袋，诱贼深侵。顺西北大风一把烈火祭起！红焰席地，寇匪烧焦烧伤无数，贼首坠马俯首请降。你收缴敌资，斩匪大获全胜（黄金+150）。'
        },
        nextSceneId: 'c1_village_intel_success'
      },
      {
        id: 'c1_village_opt4',
        text: '【凡策迎敌】战略有失，排兵御敌疏漏，损兵丢谷 (智力 65 以下)',
        effect: {
          statChanges: { gold: -80, troops: -150 },
          customLog: '你虽然试图伏兵，无奈部下传令走漏，致使反遭狡诈山贼抄掠了仓库与老弱。虽苦战将敌逐走，庄舍受损糜烂。（黄金-80，兵员-150）。'
        },
        nextSceneId: 'c1_village_intel_fail'
      }
    ]
  },
  'c1_village_force_success': {
    id: 'c1_village_force_success',
    chapterId: 'c1',
    title: '银枪平寇，万世先声',
    year: 183,
    narration: '你长驱突入敌阵，匹马救火，银枪如飞龙探海，将贼首挑飞数丈。那一幕深受庄中群豪惊敬。翌日清晨，大风止息，全村推举你为渠帅大兄，拥奉你去涿县招兵备战！',
    historicalFact: '乱世中草创义军，多赖首领个人之悍勇。如太史慈、赵子龙皆因单骑解郡县之急，名扬幽冀。',
    options: [
      {
        id: 'c1_v_fs_opt1',
        text: '整装上马，带乡勇连夜开赴县城。',
        effect: {
          statChanges: { prestige: 10, deviance: 5 }
        },
        nextSceneId: 'c1_town_gateway'
      }
    ]
  },
  'c1_village_force_fail': {
    id: 'c1_village_force_fail',
    chapterId: 'c1',
    title: '残垣止痛，翌晨复仇',
    year: 183,
    narration: '庄容损毁，你咬牙敷裹箭伤，连夜重整士卒。虽然首战争胜艰难，但村民见你赤胆，反激起了护庄大斗志。翌晨，北风止哭。你率重整精血前行前往涿县修补物资。',
    historicalFact: '刘备首战平北沙贼人，也曾遭流箭重创，假死掩护卧草，方逃得大难。英雄百折方能不挠。',
    options: [
      {
        id: 'c1_v_ff_opt1',
        text: '虽败不馁，徐徐收拾刀盾辎重，前往县城。',
        effect: {
          statChanges: { virtue: 5 }
        },
        nextSceneId: 'c1_town_gateway'
      }
    ]
  },
  'c1_village_intel_success': {
    id: 'c1_village_intel_success',
    chapterId: 'c1',
    title: '焦土葬虎，奇智扬威',
    year: 183,
    narration: '大火把黑夜烧得形同白日。贼兵狼奔豕突，余火焦味飘香数里。你用草料在关隘缴获了大批骏马金匹。你一战得名，翌晨神采飞扬，率军开拔幽州县城！',
    historicalFact: '三国奇智用火极多。从博望坡到赤壁、夷陵。大火不仅销金蚀铁，更是智者逆袭宿命的最利国刃。',
    options: [
      {
        id: 'c1_v_is_opt1',
        text: '策马前行。得火攻马匹骏马，雄赳赳前往县城。',
        effect: {
          statChanges: { prestige: 15 }
        },
        nextSceneId: 'c1_town_gateway'
      }
    ]
  },
  'c1_village_intel_fail': {
    id: 'c1_village_intel_fail',
    chapterId: 'c1',
    title: '漏计遭焚，扼腕叹息',
    year: 183,
    narration: '你在校算合上有所差谬，未能锁死贼马，导致西庄化作瓦砾。幸亏你用重石连弩扼制咽喉。翌晨寇走，你望着破残焦土暗立誓誓：未来定当熟演阵图、一血此耻！',
    historicalFact: '智谋不仅是兵书，更是血洗挫败换来的战场直觉。曹大帝一生遭火烧（濮阳、赤壁），亦终成不世奇主。',
    options: [
      {
        id: 'c1_v_if_opt1',
        text: '痛定思痛。带走残存老卒，前去城中进补给养。',
        effect: {
          statChanges: { intelligence: 3 }
        },
        nextSceneId: 'c1_town_gateway'
      }
    ]
  },
  'c1_town_gateway': {
    id: 'c1_town_gateway',
    chapterId: 'c1',
    title: '涿郡城门口，皇榜前之长叹',
    year: 184,
    narration: '公元184年（光和七年）正月，朝廷针对“黄巾妖道猖狂”贴出幽州招募义兵皇榜。你行至涿郡城门口，买回杂货农具。公告栏前百姓哀鸣，正围观谈论。身旁有一人身长七尺五寸，双手过膝，面如冠玉，长叹汉室陵迟。此人正是中原鼎镬主宰天命子——刘玄德！你欲如何上前与其应对？',
    historicalFact: '《三国演义》：玄德看毕招兵公告，见上有国家多难，不觉闭目长叹。此时张飞在后厉声喝止。而若有穿越时局之第四人上前干预，一世因果将完全不同。',
    options: [
      {
        id: 'c1_town_opt1',
        text: '【躬身上前】长揖相问：『看公气度轩昂非比凡俗，黄巾既乱，大丈夫何故不立，反在此嗟伤长叹？』',
        effect: {
          statChanges: { virtue: 15, prestige: 10 },
          customLog: '你上前躬身，言辞中规温厚，深受重仁厚礼之刘备青睐。刘备心中微震，顿然一洗凄凉。'
        },
        nextSceneId: 'c1_town_ask_unison'
      },
      {
        id: 'c1_town_opt2',
        text: '【置若罔闻】买上自家农具、辎重与战备战马（消耗 10 黄金），无视叹气之辈。',
        effect: {
          statChanges: { gold: -10, force: 2, intelligence: 2 },
          customLog: '你买了黄金辎重庄具。刘、关、张自行结交，你对这无伞孤寒客全无心结。你走上了独行于世的历史自立大道。'
        },
        nextSceneId: 'c1_no_relation_path'
      },
      {
        id: 'c1_town_opt3',
        text: '【粗声喝训】喝斥刘备：『堂堂昂藏男儿不求杀敌塞外，在此皇榜下妇人般凄吁长叹，何其怯也！』',
        effect: {
          statChanges: { force: 5, virtue: -10, deviance: 10 },
          customLog: '你当街大张喝斥，刘备汗涔垂脸，在旁摆鞋之官吏多有白眼。你也因此失去了与刘玄德一结宿世血义的最佳切口。'
        },
        nextSceneId: 'c1_town_reprimand'
      }
    ]
  },
  'c1_town_ask_unison': {
    id: 'c1_town_ask_unison',
    chapterId: 'c1',
    title: '异口同叹，雷霆震耳',
    year: 184,
    narration: '你刚揖礼询问玄德，只听身后斜里突然炸裂出一声巨暴喝：『堂堂大丈夫，不与国家出力，专在此长叹，是何道理？』雷言字句、音节与你同声高低、如出一路！你诧异望去，一豹头大汉（张飞）大步行来。张飞见你身躯强壮、英英勃勃，竟大乐拍掌：『哎呀！这两位好汉所叹竟与俺屠户不差分毫！俺庄上张酒极热，欲邀你二位去肆共饮结友，足下可愿同行？』',
    historicalFact: '历史上张飞庄产极富，当街大吼刘备，两人因义相识。现今加上你的干涉，桃园之会已至四人交口相合。',
    options: [
      {
        id: 'c1_t_au_opt1',
        text: '【大笑允诺】『天下好汉共饮，正合我辈之孤傲！走，共赴桃园庄共浮大白！』',
        effect: {
          statChanges: { virtue: 10, prestige: 15 },
          customLog: '你畅笑允诺伙伴 invitation。刘、关、张三人对你之雄迈大笑豪爽极感相惜。'
        },
        nextSceneId: 'c1_with_zhangfei_path'
      },
      {
        id: 'c1_t_au_opt2',
        text: '【托托独行】谢过好意，言称庄务尚忙要先行置办铁锁刀刃。随后再来赴桃香。',
        effect: {
          statChanges: { gold: -10, force: 1, intelligence: 1 },
          customLog: '你婉约拒绝了急聘行。独自在夜市采购。这使得关张刘独自游行，而你将在后街目睹惊天打架风波！'
        },
        nextSceneId: 'c1_buy_tools_path'
      }
    ]
  },
  'c1_with_zhangfei_path': {
    id: 'c1_with_zhangfei_path',
    chapterId: 'c1',
    title: '巨磨压井，关公神力托石',
    year: 184,
    narration: '你同刘备、张飞齐步行过县后老街。忽然看见一口深井井口，给一副沉重如山的千斤石磨盘严实死死盖住。盘上留有黑漆：『肉在井冷，凡能挪此磨搬盖者，切肉自取食之！』街尾有一红脸长须、身长九尺、威毅堂堂的好汉（关羽）正推车卖豆。见围拥难搬，大汉呵呵朗笑，挽袖上前，一掌抵住盘角，憋劲狂啸——『嘿！』千斤巨石磨竟如草芥般平平端起！你、备、飞当即振臂狂欢！',
    historicalFact: '演义评书细节：张飞有意试探关羽，肉藏井底，重石压之，关羽单臂托石分肉，以此立威。关张二人自此结下雄魂死仇与天交。',
    options: [
      {
        id: 'c1_w_zf_opt1',
        text: '【大喜相邀】上前拱手：『真好汉也！吾等三人正要去张庄桃园饮大酒，英雄必往同聚！』',
        effect: {
          statChanges: { virtue: 15, leadership: 5 },
          customLog: '你上前施礼、礼聘英雄下推车。关公大喜，自赞相见恨晚。四人同赴张庄后园。桃香怒放。'
        },
        nextSceneId: 'c1_1'
      }
    ]
  },
  'c1_buy_tools_path': {
    id: 'c1_buy_tools_path',
    chapterId: 'c1',
    title: '市井飞砂，红黑双雄当街揪打',
    year: 184,
    narration: '你独自采购铁镢、强弩，折返回涿县西街集市。忽听得前街吼声震天，人肉逃跑乱撞，店家锅釜尽倒。百姓惊骇呼叫：『不好了！张屠户和那个推车卖豆的红脸恶大汉在对撕扭打呀！』你抢前一步推看过去，只见雷天震碎，一黑一红纠合搏击，飞砖走瓦，两方铁拳快如旋流，围卫军汉手执刀器无一敢近！你欲如何化解战局？',
    historicalFact: '此乃关羽、张飞在涿县最初相识的斗殴。两家因挪磨肉物结梁，两虎相恶私斗。最终系刘备在市中将其双臂揪扯荡开，惊服四海游侠。',
    options: [
      {
        id: 'c1_bt_opt1',
        text: '【神力插架】踏地大喝，神拳左右开弓，以两手肉掌死死钳住两头虎兽的拳臂！ (需要武力 75)',
        requirement: { attribute: 'force', minVal: 75 },
        effect: {
          statChanges: { force: 2, prestige: 50 },
          customLog: '你强力破阵。双臂似有千钧。关羽、张飞两拳撞入你手！你竟然生生将二人狂流彻底扯开！二人大惊大服，当街跪拱称兄。'
        },
        nextSceneId: 'c1_stop_fight_success'
      },
      {
        id: 'c1_bt_opt2',
        text: '【单刀碎劝】武力不迨，强行隔开致身形多遭重击 (武力 75 以下)',
        effect: {
          statChanges: { virtue: 5, troops: -10 },
          customLog: '你拼一腔侠豪，用强抱隔战。被关张泄露的狂暴一腿微创，退后了数阶。所幸玄德公急奔而出，两手扯开双将，四将终同去后桃。'
        },
        nextSceneId: 'c1_stop_fight_fail'
      },
      {
        id: 'c1_bt_opt3',
        text: '【大智化解】雷呼：『幽州官兵执金吾来抓当私械斗砍头者也！』并抛乱石荡开二人 (需要智力 70)',
        requirement: { attribute: 'intelligence', minVal: 70 },
        effect: {
          statChanges: { intelligence: 2, prestige: 30 },
          customLog: '你妙吼吓贼。两汉私斗本亏律令，你大步上前用大义剖分英雄报国理，使关张羞涩收拳。大义昭昭，深受折佩！'
        },
        nextSceneId: 'c1_stop_fight_intel_success'
      },
      {
        id: 'c1_bt_opt4',
        text: '【隔火观之】冷艳旁观市角，等刘备上前荡开劝局。',
        effect: {
          statChanges: { politics: 2 }
        },
        nextSceneId: 'c1_liubei_resolves'
      }
    ]
  },
  'c1_stop_fight_success': {
    id: 'c1_stop_fight_success',
    chapterId: 'c1',
    title: '力伏红黑，英雄大相惜',
    year: 184,
    narration: '关羽、张飞同时收回青紫拳头，心骇折服望着你，极赞阁下神勇。你在当街展现惊天战战能。一旁的刘玄德看入眼中，激荡起伏。四豪杰大誓相遇。张飞拍手大骂叫快，大步邀你们同携手赶赴自家桃花后庄！',
    historicalFact: '演义上只刘备拉开二人，现由你施神勇平伏二豪。在幽州游侠圈，阁下大名盖世。',
    options: [
      {
        id: 'c1_sfs_opt1',
        text: '乘兴拉着关张两巨熊，一席乘风赶赴桃园宿契。',
        effect: {},
        nextSceneId: 'c1_1'
      }
    ]
  },
  'c1_stop_fight_intel_success': {
    id: 'c1_stop_fight_intel_success',
    chapterId: 'c1',
    title: '大义止戈，智伏猛将',
    year: 184,
    narration: '你剖理大骂：『黄巾百万，黎庶将死。二位空有盖世伟力，不思扫平国逆、立功不世，在这臭水井口市井私怨，不可耻乎？』。关羽抚长须大叹折服，张飞面红道歉。刘备在一旁含泪施礼极赞。四人同向张庄走马而去！',
    historicalFact: '儒雅多才者，以理折人。关公读《春秋》，最喜春秋大义，你之理大合其魂。',
    options: [
      {
        id: 'c1_sfis_opt1',
        text: '四将在涿酒芬芳中开步，赶往大桃园。',
        effect: {},
        nextSceneId: 'c1_1'
      }
    ]
  },
  'c1_stop_fight_fail': {
    id: 'c1_stop_fight_fail',
    chapterId: 'c1',
    title: '拳风震荡，二英收执',
    year: 184,
    narration: '多方推开后人。虽然你身躯血气微损，但在双将暴杀锋芒中挺胸，亦展现了绝凡傲胆！刘玄德乘势上前规劝，红黑豪杰最终悔去，邀你同往桃园共创大业。',
    historicalFact: '刘关张虽然神勇，亦是极重胆魄之辈。无畏挺身死劝，足能收买英雄心骨。',
    options: [
      {
        id: 'c1_sff_opt1',
        text: '虽骨骼微疼，也大笑抹干，同去饮酒结交。',
        effect: {},
        nextSceneId: 'c1_1'
      }
    ]
  },
  'c1_liubei_resolves': {
    id: 'c1_liubei_resolves',
    chapterId: 'c1',
    title: '玄德荡架，四侠齐赴庄园',
    year: 184,
    narration: '你在一旁神态悠闲，眼看刘备纵马狂跳入局。刘玄德双臂异能大开揪开两凶。关张二人因玄德贵族大汉长子姿仪顿然收势停手。四人交好大笑，同拉着你去后园深树。',
    historicalFact: '大势按常推展。刘备的统驭威摄正在默默成型。你未立大功，但同席能人已聚。',
    options: [
      {
        id: 'c1_lr_opt1',
        text: '跟随桃香步武，一同涉足张庄后园。',
        effect: {},
        nextSceneId: 'c1_1'
      }
    ]
  },
  'c1_no_relation_path': {
    id: 'c1_no_relation_path',
    chapterId: 'c1',
    title: '独辟大旗，誓为自立雄主',
    year: 184,
    narration: '你冷视了公告牌，不愿参与桃香。刘、关、张白眼叹息走回，在后庄结盟成为生生死结。而你在涿郡中独自招贤。由于你武烈或大富，自主募得了首批大军。黄巾兵潮，当面杀来！这世间天命是否也有不靠刘备亦能荡平黄巾之法？',
    historicalFact: '历史上有孔融、公孙瓒、曹操。他们都与结义兄弟无关。在偏离大势的独行自立大道上，大旗任你挥舞！',
    options: [
      {
        id: 'c1_nr_opt1',
        text: '【我当争霸】磨刀霍霍。统领精兵开拔前线迎击程远志！',
        effect: {
          statChanges: { troops: 500, gold: 100 }
        },
        nextSceneId: 'c1_fight'
      }
    ]
  },

  'c1_fight': {
    id: 'c1_fight',
    chapterId: 'c1',
    title: '青牛一啸，首战黄巾',
    year: 184,
    narration: '公元184年，黄巾军大将程远志率领五万之众，浩浩荡荡杀向涿郡界首。幽州太守刘焉派别部司马校尉抗敌，战鼓连天，杀敌前线。对方人马如潮，贼将程远志跃马扬鞭，叫阵斗将。这是你成名天下的第一战，你打算采取何种军略？',
    historicalFact: '历史上刘备率义勇军首次迎战黄巾军，关羽斩程远志于马下，张飞刺死副将邓茂，黄巾军大败，刘备义军初试啼声。',
    options: [
      {
        id: 'c1_f_opt1',
        text: '【单刀赴会】亲自跃马出阵，迎战程远志将其斩落马下！',
        requirement: { attribute: 'force', minVal: 75 },
        effect: {
          statChanges: { force: 4, prestige: 80, troops: -100, gold: 200 },
          customLog: '你一跃而出，青蛇长枪卷起寒芒。只一合，程远志措手不及，当场被你刺死！敌军群龙无首，一触即溃。'
        },
        nextSceneId: 'c2_start'
      },
      {
        id: 'c1_f_opt2',
        text: '【神出鬼没】派关羽与张飞左右夹击，主力在山谷设伏，聚歼来敌！',
        requirement: { attribute: 'intelligence', minVal: 70 },
        effect: {
          statChanges: { intelligence: 4, leadership: 4, troops: -50, prestige: 60, gold: 300 },
          customLog: '你布下口袋阵，关、张二将飞骑斜刺里杀出，切断敌军粮道。你率主力两面夹攻，斩首数千，大胜而归。'
        },
        nextSceneId: 'c2_start'
      },
      {
        id: 'c1_f_opt3',
        text: '【求稳用兵】令手下士卒结成坚固盾阵，靠人数优势徐徐消耗汉贼。',
        effect: {
          statChanges: { leadership: 5, troops: -600, gold: 100, prestige: 30 },
          customLog: '大军结成圆阵，稳扎稳打。虽全歼乱兵，但义军死伤颇多，所幸获得部分降兵充实行伍。'
        },
        nextSceneId: 'c2_start'
      }
    ]
  },

  // ------------ CHAPTER 2 ------------
  'c2_start': {
    id: 'c2_start',
    chapterId: 'c2',
    title: '北海告急，匈奴扣关',
    year: 185,
    narration: '公元185年，第一阶段黄巾平定，你得朝廷封赏升为别部司马。然而，北方塞外匈奴部族见朝廷空虚，勾结叛将大举犯境侵略雁门关，边疆血流成河；与此同时，百里之外的青州北海郡，黄巾骁将管亥率数万精锐合围名儒孔融，孔太守连夜发信求援。军力有限，不克多线出击，你该当如何抉择？',
    historicalFact: '历史上，北海孔融求救，玄德遣太史慈突围借兵，最终派三千兵协助平定黄巾。至于塞外匈奴，此时汉军无暇北伐，边地人民颠沛流离。',
    options: [
      {
        id: 'c2_s_opt1',
        text: '【平定北海】驰援孔公！北海乃齐鲁命脉，斩管亥重夺青州威信！',
        effect: {
          statChanges: { virtue: 10, prestige: 120, gold: -200 },
          addGeneral: 'taishici',
          addDeviance: 10,
          changeFaction: { regionId: 'beihai', faction: 'PLAYER' },
          customLog: '大军连夜突击青州，你大败黄巾将管亥。在战场上结交了突围求兵的盖世神射手太史慈，占领北海，天下声振！'
        },
        nextSceneId: 'c2_north_follow'
      },
      {
        id: 'c2_s_opt2',
        text: '【灭匈奴】出雁门关！北击游牧游骑，封狼居胥，平定北疆叛乱！',
        effect: {
          statChanges: { force: 10, leadership: 10, troops: -1000, prestige: 250, deviance: 15 },
          changeFaction: { regionId: 'xiongnu', faction: 'PLAYER' },
          customLog: '汉土岂容胡虏踏足！你率铁骑奔袭雁门关，塞外风飞沙，大破匈奴各部，擒拿叛部羌渠单于，迫其纳款，收复北疆荒野！'
        },
        nextSceneId: 'c2_east_follow'
      },
      {
        id: 'c2_s_opt3',
        text: '两害相权取其轻，我们按兵不动，深挖城壕，在关内屯田。',
        effect: {
          statChanges: { politics: 12, gold: 800, troops: 1500 },
          customLog: '兵力不足，你决定不出风头。你在城内广行水利，大量购入钱粮，虽然受到外间士子“不仁不忠”的清议，却囤积了雄厚的实力。'
        },
        nextSceneId: 'c3_start'
      }
    ]
  },
  'c2_north_follow': {
    id: 'c2_north_follow',
    chapterId: 'c2',
    title: '乘势北伐，剿抚雁门',
    year: 188,
    narration: '大定北海、收太史慈后，兵不旋踵，北方也传来捷报——大汉北境因你前期派关张侧击骚扰，匈奴军心动摇。你现在实力雄厚，是否要顺手将残存的匈奴骑兵也一网打尽，巩固北方基业？',
    historicalFact: '历史大局中，塞北多属流寇和游牧散落状态，无力形成大规模抗汉统一阵线，但也无朝廷名将彻底扫平。',
    options: [
      {
        id: 'c2_nf_opt1',
        text: '【顺手灭匈奴】携北海大胜之势，挥师北上，直扑雁门，彻底荡平匈奴！',
        requirement: { attribute: 'leadership', minVal: 75 },
        effect: {
          statChanges: { force: 6, leadership: 6, troops: -800, deviance: 15 },
          changeFaction: { regionId: 'xiongnu', faction: 'PLAYER' },
          customLog: '你挥师北上，与匈奴主力在荒原展开骑兵对决。你英勇突阵，大胜单于主力，斩首万余级，北疆彻底收归治下！'
        },
        nextSceneId: 'c3_start'
      },
      {
        id: 'c2_nf_opt2',
        text: '安于青州，与孔融、士子每日清谈政事，安抚难民。',
        effect: {
          statChanges: { politics: 10, virtue: 8, gold: 400 },
          customLog: '你未再去管塞外之事。你留在北海致力于恢复民生，深得儒生拥护，治所政治局面一片向好。'
        },
        nextSceneId: 'c3_start'
      }
    ]
  },
  'c2_east_follow': {
    id: 'c2_east_follow',
    chapterId: 'c2',
    title: '回马东征，收复北海',
    year: 188,
    narration: '雁门一战令匈奴大部落彻底臣服！而此时，被包围数年、苟延残喘的青州北海太守孔融再次以生命发帖：黄巾管亥余部因听说你覆灭匈奴之威，畏惧而将发起最后的疯狂屠城猛射。你该不该引得胜塞外之铁骑，横扫齐鲁大地？',
    historicalFact: '孔融因治郡儒雅而军事孱弱，在管亥数万信徒的围攻中痛苦求援。',
    options: [
      {
        id: 'c2_ef_opt1',
        text: '【平定北海】挥塞外野马，顺风驰野，荡平北海黄巾！',
        requirement: { attribute: 'troops', minVal: 1200 },
        effect: {
          statChanges: { virtue: 10, prestige: 100, deviance: 10, troops: -400 },
          addGeneral: 'taishici',
          changeFaction: { regionId: 'beihai', faction: 'PLAYER' },
          customLog: '虎狼铁骑直下黄河。管亥大军措手不及，被你用塞北骑兵彻底战术包夹。你解救了北海，太史慈被你的盖世奇功感动投奔！'
        },
        nextSceneId: 'c3_start'
      },
      {
        id: 'c2_ef_opt2',
        text: '派遣属下诸将带部分军队协防，自己经营雁门关防守工事。',
        effect: {
          statChanges: { leadership: 6, gold: 300, prestige: 40 },
          customLog: '你未亲自出征。虽解了北海燃眉，但未能彻底折服当地大将，仅在青州和并州各处落得些许义烈之名。'
        },
        nextSceneId: 'c3_start'
      }
    ]
  },

  // ------------ CHAPTER 3 ------------
  'c3_start': {
    id: 'c3_start',
    chapterId: 'c3',
    title: '会盟酸枣，讨伐董卓',
    year: 190,
    narration: '公元190年，凉州刺史董卓带凉羽甲兵擅闯洛阳，废汉帝，鸩杀鸩害，更纵火火烧两百年洛阳宫阙，挟帝西逃长安。关东袁绍、曹操起十八路讨董义军，你携“扫荡匈奴”或“平定北海”的当世雄主威仪，也被列为主要大路诸侯！两军阵前，温侯吕布头戴三叉束发紫金冠，持画戟、纵赤兔大呼：“谁敢与我决一死战！”盟主袁绍战栗不安。你会如何抉择？',
    historicalFact: '历史上，公孙瓒部、刘备等曾参与诸侯同盟，发生华雄、吕布等关前乱战。曹操随后孤军追击被徐荣打败，孙坚独破洛阳，群雄由于勾心斗角不攻自退。',
    options: [
      {
        id: 'c3_s_opt1',
        text: '【单斗吕布】身先士卒！率身边刘关张（或麾下虎将）四英战吕布！',
        requirement: { attribute: 'force', minVal: 80 },
        effect: {
          statChanges: { force: 6, prestige: 200, deviance: 20, troops: -300 },
          customLog: '你飞马大声长喝，抢在刘关张之前与吕布大战二十合！四人铁围环绕，吕布遮拦不住，虚刺一枪荡开阵脚逃回关内！天下豪杰莫不叹服！'
        },
        nextSceneId: 'c3_pursuit'
      },
      {
        id: 'c3_s_opt2',
        text: '【奇袭洛阳】不事虚斗，趁董卓纵火尚未完全席卷时，连夜直趋城池抢救百姓与皇家藏书！',
        requirement: { attribute: 'intelligence', minVal: 78 },
        effect: {
          statChanges: { virtue: 15, intelligence: 8, gold: 600, prestige: 100 },
          changeFaction: { regionId: 'luoyang', faction: 'PLAYER' },
          customLog: '在虎牢关大战之时，你早已秘潜小道绕关直破洛阳。带领义勇灭除了部分宫中火势，救出难民和先朝石经、图书藏册，被天下公认为大汉贤良！'
        },
        nextSceneId: 'c4_start'
      },
      {
        id: 'c3_s_opt3',
        text: '【西取长安】借群雄在前打掩护，绕道凉州，奇袭董卓大本营长安！',
        requirement: { attribute: 'leadership', minVal: 85, neededGold: 200 },
        effect: {
          statChanges: { leadership: 10, troops: -1200, deviance: 30 },
          changeFaction: { regionId: 'changan', faction: 'PLAYER' },
          customLog: '你完成了惊人奇谋！趁董家主力全部在洛阳防线，你带轻骑军出其不意，横斜关隘，直破长安，击溃守将，将尚在长安的汉皇天子护于自己阵营之中！'
        },
        nextSceneId: 'c4_emperor_route'
      }
    ]
  },
  'c3_pursuit': {
    id: 'c3_pursuit',
    chapterId: 'c3',
    title: '曹公纵横，汴水之盟',
    year: 191,
    narration: '大破吕布、董卓西奔之后，袁绍等联军一味设宴、歌舞升平。曹操见群雄不思进取，怒斥群英：“今日首谋大义，奈何止步不前！”随起本部兵火速追击，恐其遇袭。你面对大义，是否应派奇骑突击支援曹公？',
    historicalFact: '曹操独自引兵西进被董卓部将徐荣暗伏于荥阳汴水，曹操死拼受伤，得堂弟曹洪献马救回，叹息而归。',
    options: [
      {
        id: 'c3_p_opt1',
        text: '派大军追击合流，于汴水前逆袭徐荣，救下曹操并夺得西凉败退物资！',
        effect: {
          statChanges: { politics: 5, gold: 500, prestige: 120 },
          customLog: '汴水河畔，徐荣铁骑合击曹操。正值千钧一发，你的黑甲奇兵突然从横刺里杀出！你斩杀徐荣，使曹操免于狼狈，曹操紧握你手指，誓同你定海内天下。'
        },
        nextSceneId: 'c4_start'
      },
      {
        id: 'c3_p_opt2',
        text: '在洛阳城废墟中探查“国宝之谜”，未参与追击。',
        effect: {
          statChanges: { gold: 1000, intelligence: 5 },
          customLog: '你在宫阙废墟下搜求多日，居然在一个死去的宫女怀中找到盛有五彩雕琢、传国玉玺的朱漆匣！大军悄摸私藏玉玺，雄心底定。'
        },
        nextSceneId: 'c4_start'
      }
    ]
  },

  // ------------ CHAPTER 4 ------------
  'c4_start': {
    id: 'c4_start',
    chapterId: 'c4',
    title: '大浪淘沙，重理大鼎',
    year: 196,
    narration: '至公元196年，讨董联盟彻底星散成灰。袁绍雄据河北，曹操挟汉帝迁于许昌，名重天下。如今天下无主，群雄割据，你的地盘在乱世挤压中已不容迟疑，要么大张旗鼓自成一方诸侯，要么投靠强敌辅政大业。你该如何确立你的天下战略？',
    historicalFact: '曹操于九六年挟天子以令诸侯，占据大义；刘皇叔四处漂泊无固定根据地。天下中原彻底进入战国博弈。',
    options: [
      {
        id: 'c4_s_opt1',
        text: '【自立门户】创立第四势力！正式竖大夏军旗，广纳降兵，宣布争天天下！',
        requirement: { attribute: 'prestige', minVal: 300, neededGold: 400 },
        effect: {
          statChanges: { politics: 10, leadership: 10, troops: 4000, deviance: 25 },
          customLog: '你不愿充当他人门下之客，正式发布檄文自立大明战旗！宣誓既不顺袁绍亦不纳曹氏，天下一震，第四股巨无霸大势力应运而出！'
        },
        nextSceneId: 'c5_start'
      },
      {
        id: 'c4_s_opt2',
        text: '【尊王攘夷】寻找刘备玄德，同盟保卫汉室，去荆州依附并探寻人才。',
        effect: {
          statChanges: { virtue: 18, prestige: 80 },
          addGeneral: 'zhaoyun',
          customLog: '你选择投向同盟在外的刘备，结伴南下。在途中以你的豪杰风仪感化白马银枪大将赵云，将其保入麾下！'
        },
        nextSceneId: 'c5_start'
      },
      {
        id: 'c4_s_opt3',
        text: '【大汉权臣】带兵效忠天子，托身于曹操大营，辅魏政朝。',
        effect: {
          statChanges: { politics: 15, gold: 1500, intelligence: 10 },
          addGeneral: 'guojia',
          customLog: '你接受曹操的册封为副统帅。在他的太守会馆，你与鬼才郭嘉终日讨论局势。郭嘉大觉你的胸怀如龙，成了你可以策动的亲密密谋！'
        },
        nextSceneId: 'c5_start'
      }
    ]
  },
  'c4_emperor_route': {
    id: 'c4_emperor_route',
    chapterId: 'c4',
    title: '天子临关，霸道大权',
    year: 196,
    narration: '在长安，你完成了绝世奇谋——在其余诸侯毫不知情下强行救出并把持了大汉天子刘协！现在，你是天下唯一实际垄断汉家天宪的人。曹操极恨，袁绍自责。你要拿天子执行什么政策？',
    historicalFact: '本是曹操挟天子迁许，从此独家使用皇帝名牌。',
    options: [
      {
        id: 'c4_er_opt1',
        text: '【挟天子以令诸侯】强诏曹操等，勒令裁并军备，索要魏军的并州土地！',
        effect: {
          statChanges: { politics: 15, prestige: 300, gold: 1000, deviance: 30 },
          changeFaction: { regionId: 'yecheng', faction: 'PLAYER' },
          customLog: '天子玉玺盖印，诏命通行宇内！百官听命于你，你调兵割取冀州邺城重镇，曹操、袁绍震怒却不得不屈尊奉表。'
        },
        nextSceneId: 'c5_start'
      },
      {
        id: 'c4_er_opt2',
        text: '【奉天子以从民望】将大权分予刘备并与大贤结社，宣布天下同讨魏贼、东吴等。',
        effect: {
          statChanges: { virtue: 25, prestige: 200, troops: 3000 },
          addGeneral: 'liubei',
          customLog: '你将部分军中最高权限交予刘备皇叔，两人同在殿中执手大哭，天下皆知你在复兴正轨大汉，志气一呼百诺，无数大好忠臣名将从魏、吴叛逃归顺。'
        },
        nextSceneId: 'c5_start'
      }
    ]
  },

  // ------------ CHAPTER 5 ------------
  'c5_start': {
    id: 'c5_start',
    chapterId: 'c5',
    title: '赤壁狂波，风雷大战',
    year: 208,
    narration: '公元208年，汉朝大权底定。魏公曹操扫平中原，挥师八十万南下，大江锁于连环战船上，扬言旦夕铲平刘备、吞并东吴。在荆州大江南岸，蜀汉军、孙吴军正在柴桑紧急排兵。这场大战将绝对决定华夏百年的未来，此时你在江北、江南岸各握奇谋，你要扮演什么决定大江走向的角色？',
    historicalFact: '诸葛亮出使东吴、巧借东风，江南用火攻。周瑜火烧赤壁大破曹操联环，使得大势稳入魏蜀吴三足鼎立。',
    options: [
      {
        id: 'c5_s_opt1',
        text: '【烈火赤壁】暗中与周瑜孔明达成同盟，不顾曹操，突袭邺城，在曹魏空虚后方直捣大本营！',
        requirement: { attribute: 'intelligence', minVal: 80, neededGold: 300 },
        effect: {
          statChanges: { intelligence: 10, prestige: 350, troops: -2000, deviance: 30 },
          changeFaction: { regionId: 'yecheng', faction: 'PLAYER' },
          customLog: '红岩烈火冲天，曹军大败。你神兵偏遣，带领早已枕戈待旦的骑军袭击邺城，一举斩断曹操在中原的大手，从此北海、邺城、长江两岸皆为你控制！'
        },
        nextSceneId: 'c6_start'
      },
      {
        id: 'c5_s_opt2',
        text: '【定计卧龙】将帅之诚！不惜代价，在乱军中重金保护并感召孔明，邀请他出仕担任你的大元帅！',
        requirement: { attribute: 'virtue', minVal: 85, neededGold: 500 },
        effect: {
          statChanges: { virtue: 10, intelligence: 15, prestige: 400 },
          addGeneral: 'zhugeliang',
          customLog: '你得知江南火攻底定，乘一叶孤舟，在赵云神威拦截东吴追兵前接走诸葛亮。诸葛武侯观你雄图不凡，大赞此生得明主，手摇羽扇，自此归于你的同盟！'
        },
        nextSceneId: 'c6_start'
      },
      {
        id: 'c5_s_opt3',
        text: '【平定江东】倒向曹魏！将孔明火攻之秘提前出卖给曹氏，并反用连环计全歼东吴水军！',
        effect: {
          statChanges: { politics: 12, force: 10, gold: 2500, deviance: 35 },
          changeFaction: { regionId: 'jianye', faction: 'CAOCAO' },
          customLog: '历史偏轨了！因为你的告密，曹操解开战船。风急火起之时，他抢占徐徐江湾，反以伏兵将放火的江南水军彻底斩尽杀绝。周瑜战死，东吴陆地城池尽数被屠平！'
        },
        nextSceneId: 'c6_changan_war'
      }
    ]
  },

  // ------------ CHAPTER 6 ------------
  'c6_start': {
    id: 'c6_start',
    chapterId: 'c6',
    title: '麦城星落，逆转双亡',
    year: 219,
    narration: '公元219年。赤壁之后群英角逐，眼见大业就要初成。然而天道不常，蜀汉宿将关羽孤军北伐被困麦城，前有曹军阻击，后有孙权盟友卑鄙偷袭割首；而几年后，五丈原荒山冷风，丞相孔明殚精竭虑、天数难违，续命之灯被魏兵打破，生命已入死路。这两曲在百年来令无数后人心碎的历史悲歌，就在你的大军一念之间，要如何逆转？',
    historicalFact: '历史上吕蒙白衣渡江背叛刘备，关羽由于缺乏后方援助导致父子二人兵败麦城，壮烈就义首级被送交于曹。其后诸葛孔明六出祁山在五丈原累倒过世，蜀汉从此走入下限悲风。',
    options: [
      {
        id: 'c6_s_opt1',
        text: '【解麦城之围】领长戟精军、急行军八百里，杀吕蒙救回武圣关羽！并横扫东吴门户！',
        requirement: { attribute: 'leadership', minVal: 80, neededTroops: 3000 },
        effect: {
          statChanges: { virtue: 15, force: 5, troops: -1000, deviance: 25 },
          addGeneral: 'guanyu',
          changeFaction: { regionId: 'jianye', faction: 'PLAYER' },
          customLog: '雷电交加，麦城守关者绝望中。只听战场尽头传来金鼓！你引大军破重围，一枪挑飞吕蒙！关云长得脱。他单膝下跪，自此青龙长刀，只为了你的旗帜而舞！'
        },
        nextSceneId: 'c7_start'
      },
      {
        id: 'c6_s_opt2',
        text: '【延寿卧龙】访西域雪原与仙人药草，拼却己身修行，在五丈原替孔明改命延寿！',
        requirement: { attribute: 'intelligence', minVal: 85, neededGold: 800 },
        effect: {
          statChanges: { intelligence: 15, virtue: 10, prestige: 500, deviance: 20 },
          customLog: '五丈原天雷阵。诸葛孔明绝望等死之时，你推账而入，辅以神功，终于燃亮七星重灯，替师续命十二载！武侯自此红光满面，出祁山，大破群魏大营，光耀九州！'
        },
        nextSceneId: 'c7_start'
      },
      {
        id: 'c6_s_opt3',
        text: '不理会残兵朽将，乘各大阵营元气大伤，主力进军巴蜀成都夺取天下粮仓！',
        effect: {
          statChanges: { troops: 8000, politics: 15, gold: 3000 },
          addGeneral: 'jiangwei',
          changeFaction: { regionId: 'chengdu', faction: 'PLAYER' },
          customLog: '你选择抛弃情谊。在大乱大变中，你一举翻破剑阁之险，兵入成都，刘禅率蜀汉臣服。你在锦官城里大阅新兵，招得少年名将姜维，声威夺顶！'
        },
        nextSceneId: 'c7_start'
      }
    ]
  },
  'c6_changan_war': {
    id: 'c6_changan_war',
    chapterId: 'c6',
    title: '曹魏之盾，西凉异变',
    year: 220,
    narration: '在因为你的密谋使曹操成功全吞江南后，曹大公在洛阳一病不起。其世子曹丕有夺天改地之意，开始在汉朝废禅、建立曹魏。你身怀救天之计或篡朝之野，身在前线，你要采取如何行动？',
    historicalFact: '曹丕于公元220年胁迫皇帝退位建国。',
    options: [
      {
        id: 'c6_cw_opt1',
        text: '与徐庶等联合宣布曹丕为汉贼，在成都拥兵讨魏，并大扩北防兵员！',
        effect: {
          statChanges: { virtue: 15, troops: 5000, prestige: 300 },
          addGeneral: 'jiangwei',
          customLog: '你在南方大竖汉朝正统圣大义，宣布曹魏倒悬汉土。北方少年姜维听闻，连夜跨马穿越秦岭来奔，自此你在江南川蜀拥有大势！'
        },
        nextSceneId: 'c7_start'
      },
      {
        id: 'c6_cw_opt2',
        text: '默认现状，在封王后趁曹丕立足未稳，大行渗透，将魏国内部要员倒勾效忠！',
        requirement: { attribute: 'politics', minVal: 85 },
        effect: {
          statChanges: { intelligence: 10, politics: 15, gold: 2000 },
          customLog: '不露痕迹。你收买人心数载，魏国上层重臣及诸将中有逾半数与你遥奉天诏，西凉的大门已被你悄悄摸入。'
        },
        nextSceneId: 'c7_start'
      }
    ]
  },

  // ------------ CHAPTER 7 ------------
  'c7_start': {
    id: 'c7_start',
    chapterId: 'c7',
    title: '大风起兮，天下归一',
    year: 263,
    narration: '公元263年至280年，这是三国长歌的最后大决战。历史上，汉、吴皆已败落，司马懿之孙司马炎代魏立晋，发战船直捣石头城，三国彻底合归大晋。然而，在你逆天改命十余载后，当前的各大城池和名臣悍将大半已被你囊括，你有极高的名望和铁血雄兵。百年乱局，黎明百姓的绝望哭嚎，即将在一战中底定！你要如何走上属于你的天阶？',
    historicalFact: '公元281年，晋武帝司马炎王濬楼船下益州，东吴降，完成了晋一统乱局，但由于宗室混战，数十年后引发魏晋南北朝之更大的浩劫灾难。',
    options: [
      {
        id: 'c7_s_opt1',
        text: '【称帝一统】在泰山封禅！誓除篡权逆晋（司马炎），建立大华万世霸业！',
        requirement: { attribute: 'deviance', minVal: 50 },
        effect: {
          statChanges: { prestige: 1000 },
          customLog: '终极一战打响！你带关张赵云或卧龙军师，决战于五丈原黄河口。司马炎被射杀于帅旗之下，晋家军队全数降服，你于泰山筑坛行禅，一统华夏！'
        },
        nextSceneId: 'ending_emperor'
      },
      {
        id: 'c7_s_opt2',
        text: '【汉室大定】保全刘禅，拥护汉皇传世血脉，重登洛阳大宝、匡扶汉朝天下！',
        effect: {
          statChanges: { virtue: 50, prestige: 800 },
          customLog: '战火熄。你以盖世无双的威仪，扶携懦弱惶恐的刘玄德血裔。众臣在洛阳太极殿朝拜天子。天子尊你为一世尚父相国。君臣和美，百年汉廷威仪大复兴！'
        },
        nextSceneId: 'ending_loyalist'
      },
      {
        id: 'c7_s_opt3',
        text: '【历史宿命】兵连祸结，战事崩溃不决。历史的车轮依旧倒向分崩与司马晋归。',
        effect: {
          customLog: '大势难夺！大军由于多次不理民力，部下叛乱，司马朝重装北伐攻破营垒。最后，车驾崩损，你于乱世孤苦中看着洛阳的大街小巷，挂上了晋之蓝旗。'
        },
        nextSceneId: 'ending_historic'
      }
    ]
  },

  // ------------ ENDING NODES ------------
  'ending_emperor': {
    id: 'ending_emperor',
    chapterId: 'c7',
    title: '至尊结局：千秋大华，万世太平',
    year: 280,
    narration: '太极殿上，香烟缭绕，金炉吐瑞。你身披九章大裘，戴十二旒飞冕。台下，曾经的强敌如曹公后裔、孙家子孙、司马余党，皆肃然顿首。刘关张如仙人并立两侧，武侯诸葛亮捧起一统山河图俯首叩见。历史被你偏转逆天大成，封建百国，永消百年战乱。万民饱足，歌舞天下！这，便是你书写的无疆青史大格局！',
    historicalFact: '恭喜！解锁了【逆天改命 · 人形天道】终极皇帝大帝主宰称雄结局！你拯救了所有的名将（关羽、卧龙等），歼灭了侵袭，并以大智慧合并多途！',
    options: []
  },
  'ending_loyalist': {
    id: 'ending_loyalist',
    chapterId: 'c7',
    title: '魏巍汉风结局：汉室复兴，相国功勋',
    year: 280,
    narration: '汉室的钟声重在长安和洛阳大殿中荡开。你在刘禅面前跪下，解授大将军印，表示天下已定、胡人远播，自己甘愿退隐涿县竹林，深藏大名。天下官员百姓无不朝北哭祭你的仁厚与大义，立长生祠千万，你的名字伴随着大汉的大字，照耀万载汉风史书！',
    historicalFact: '恭喜！解锁了【大贤纯臣 · 汉家丰碑】结局！你不取大位，却真正成就了不世出的忠义和拯救，历史彻底摆脱了悲壮的轮回。',
    options: []
  },
  'ending_historic': {
    id: 'ending_historic',
    chapterId: 'c7',
    title: '悲秋史册：车轮宿命，青史空留余叹',
    year: 280,
    narration: '你最终无力在大河改命大浪中支撑到最后。或者是兵力在长久远征中消耗殆尽，或者失却了良将的信任。公元280年，司马氏的晋朝天下正式到来。你站在北邙山麓，眼见满原荒草，叹息一江春水向东。大梦一场，英雄尽归于青史，只留渔樵唱晚，伴着说书者的长叹而随。',
    historicalFact: '解锁【历史宿命 · 凡民长叹】结局。历史有其无情的韧性，偏轨再次跌回了晋室一统的走向，但你在这一生所作出的努力，也足以彪炳乱世孤影。',
    options: []
  }
};
