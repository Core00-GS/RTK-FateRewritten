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
  },
  {
    id: 'c8',
    num: '第八章',
    title: '虎牢关前，三英战吕布',
    period: '公元190年',
    startSceneId: 'c8_start',
    desc: '董卓乱京，十八路诸侯并起讨董。神将吕布跃马拉弓阻于关下，刘关张冲天豪气，虎牢关前谱写盖世侠义千古绝唱！'
  },
  {
    id: 'c9',
    num: '第九章',
    title: '青梅置酒，煮酒论英雄',
    period: '公元199年',
    startSceneId: 'c9_start',
    desc: '寄人篱下，韬光养晦于菜园。曹操突召置酒，谈笑天下评点乾坤。金蝉脱壳逃脱龙潭，命运由你决裁！'
  },
  {
    id: 'c10',
    num: '第十章',
    title: '挂印封金，千里走单骑',
    period: '公元200年',
    startSceneId: 'c10_start',
    desc: '徐州战败弟兄离散，云长封金挂印，保皇嫂千里寻兄。神挡杀神过五关斩六将，忠义赤胆万世流传！'
  },
  {
    id: 'c11',
    num: '第十一章',
    title: '洛水惊鸿，七步成诗',
    period: '公元220年',
    startSceneId: 'c11_start',
    desc: '魏帝曹丕嫉恨同胞，于朝堂威逼曹植“七步成诗”，否则斩之。文采傲骨与洛水神女之叹，在此青史低吟。'
  },
  {
    id: 'c12',
    num: '第十二章',
    title: '大魏求贤，奉策投效',
    period: '公元210年 - 217年',
    startSceneId: 'c12_start',
    desc: '曹操打破士族垄断，以“求贤令”唯才是举。作为在野名士投效曹营，呈上囊括八荒之权略，助其安邦建庙。'
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
          statChanges: { force: 2, prestige: 35, troops: 150 }
        },
        nextSceneId: 'c1_village_force_success'
      },
      {
        id: 'c1_village_opt2',
        text: '【巧设火攻】诱敌深入，将贼军引入隘口纵火焚敌 (需要智力 65)',
        requirement: { attribute: 'intelligence', minVal: 65 },
        effect: {
          statChanges: { intelligence: 2, prestige: 35 }
        },
        nextSceneId: 'c1_village_intel_success'
      },
      {
        id: 'c1_village_opt3',
        text: '【以弱示敌】假装不敌诱敌，徐退诱其入关伏击 (需要统帅 60)',
        requirement: { attribute: 'leadership', minVal: 60 },
        effect: {
          statChanges: { leadership: 2, prestige: 30 }
        },
        nextSceneId: 'c1_village_intel_success'
      }
    ]
  },

  'c1_village_force_success': {
    id: 'c1_village_force_success',
    chapterId: 'c1',
    title: '生擒贼魁，威风一凛',
    year: 183,
    narration: '你长笑一声挺枪跃马而出，于万军之中一梭取直，长枪点中寇贼首领咽喉。众贼兵见寇魁束手，吓得魂飞魄散、四下丢弃大索逃散！你收编余众，获得当地村民的万世仰承！',
    historicalFact: '万军阵中取上将首级，乃古代无双猛士之盖世风华。此战罢后，涿县壮士无不望风归附。',
    options: [
      {
        id: 'c1_v_fs_opt1',
        text: '犒劳庄客村民，将俘虏收入行伍，开拨县城。',
        effect: {
          statChanges: { troops: 350, gold: 100 }
        },
        nextSceneId: 'c1_town_gateway'
      }
    ]
  },

  'c1_village_force_fail': {
    id: 'c1_village_force_fail',
    chapterId: 'c1',
    title: '力竭负伤，败走残障',
    year: 183,
    narration: '你虽有一腔热血，但双拳难敌四手。在乱军攒刺中，你力竭受创，幸得庄客死命保护，才从火光熊熊的村庄突围。但也曾遭流箭重创，假死掩护卧草，方逃得大难。英雄百折方能不挠。',
    historicalFact: '乱世无常，哪怕孤胆英雄在无尽的刀兵铁雨面前，也常有力尽受挫之时。',
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
    historicalFact: '三国奇智用火极多。从博望坡到赤壁、夷陵。大火不仅销金蚀铁，更是智者逆袭宿命的终极手段。',
    options: [
      {
        id: 'c1_v_is_opt1',
        text: '【凯旋】带缴获 of 战马装备，向幽州府库领赏！',
        effect: {
          statChanges: { troops: 300, gold: 200, prestige: 50, intelligence: 3 }
        },
        nextSceneId: 'c1_town_gateway'
      }
    ]
  },

  'c1_village_intel_fail': {
    id: 'c1_village_intel_fail',
    chapterId: 'c1',
    title: '风急焦火，退走县城',
    year: 183,
    narration: '本想诱敌深入纵火御敌，奈何风向突变，狂火反噬我军外林工事，哭嚎连连。虽吓退寇兵，但庄稼与外营焚毁大半。翌朝风和，你长叹重整行装引溃民前往县城求助。',
    historicalFact: '智谋用火本属险招，无端风向、无常气候往往反教奇策化为浩劫。当年火烧乌巢 or 上方谷大雨皆如是。',
    options: [
      {
        id: 'c1_v_if_opt1',
        text: '痛定思痛，带领剩下的家眷溃卒徐徐撤向幽州城关。',
        effect: {
          statChanges: { gold: -50, deviance: -10 }
        },
        nextSceneId: 'c1_town_gateway'
      }
    ]
  },

  'c1_town_gateway': {
    id: 'c1_town_gateway',
    chapterId: 'c1',
    title: '幽州城门，群英会聚',
    year: 184,
    narration: '公元184年春，幽州涿县。你率众来到城门口，只见告示牌前挤满了人。因黄巾程远志犯境，校尉邹靖张贴了招募义勇的告示。人群之中，有三人长叹短叹——一人双耳垂肩、双手过膝（刘备）；一人身长九尺、髯长二尺（关羽）；一人豹头环眼、燕颔虎须（张飞）。他们正欲相约前去酒肆，再谋结义。你要如何参与其中？',
    historicalFact: '历史上刘关张三人在涿郡张飞庄后桃园结义，结为异姓兄弟，从此誓同生死，逐鹿天下。',
    options: [
      {
        id: 'c1_town_opt1',
        text: '【共谋大业】上前慷慨陈词，邀请三人共克时艰，前往张庄后园商讨结盟！',
        effect: {
          statChanges: { prestige: 20, virtue: 10 }
        },
        nextSceneId: 'c1_town_ask_unison'
      },
      {
        id: 'c1_town_opt2',
        text: '【独自招募】冷眼视之，不愿与这三人打交道，自主去涿郡募集豪杰，独树大旗！',
        effect: {
          statChanges: { deviance: 20, gold: -100, troops: 150 }
        },
        nextSceneId: 'c1_no_relation_path'
      },
      {
        id: 'c1_town_opt3',
        text: '【怒斥蛮勇】见市井之中，关羽和张飞无视禁令、争相打斗，上前强行喝止！',
        effect: {
          statChanges: { leadership: 5, force: 2 }
        },
        nextSceneId: 'c1_town_reprimand'
      }
    ]
  },

  'c1_town_reprimand': {
    id: 'c1_town_reprimand',
    chapterId: 'c1',
    title: '街头断斗，义训双雄',
    year: 184,
    narration: '市井之中，杀猪贩绿豆的壮汉扭扯在一处。你快步上前厉声喝道：“如今国难当头，黄巾乱兵就在旦夕，汝等空有一身惊世神武，不思报国安民，反在街衢斗气，何其浅薄！”那红脸（关羽）与环眼（张飞）大汉听罢一震，面露愧色，齐齐松手退开。',
    historicalFact: '关于关张打斗、肉铺冲突多见于民间评话与平话三国，在正史演义中二人早已情同手足。',
    options: [
      {
        id: 'c1_tr_opt1',
        text: '诚恳相邀，三人心气渐通，邀其同往酒肆一叙。',
        effect: {
          statChanges: { leadership: 8, virtue: 5 }
        },
        nextSceneId: 'c1_town_ask_unison'
      }
    ]
  },

  'c1_town_ask_unison': {
    id: 'c1_town_ask_unison',
    chapterId: 'c1',
    title: '幽州酒肆，煮酒论义',
    year: 184,
    narration: '在酒肆雅座之中，四人相谈甚欢。刘玄德大谈汉室宗亲、匡扶天下之志；关云长面红而沉毅，言道愿追随仁义；张翼德则高声嚷嚷，称张庄后桃园盛开，当行结义。然而，结义之法也有分歧。张飞建议备办乌牛白马，而关羽则有些迟疑，你该选择支持谁的建议？',
    historicalFact: '演义中，结义仪式非常隆重，大办乌牛白马、祭告天地，而正史中仅称“恩若兄弟，同榻而眠”。',
    options: [
      {
        id: 'c1_t_au_opt1',
        text: '【全力支持张飞】赞同张翼德！备办乌牛白马、丰厚贡礼，正式敬告天地！',
        effect: {
          statChanges: { popularity: 10, gold: -100 }
        },
        nextSceneId: 'c1_with_zhangfei_path'
      },
      {
        id: 'c1_t_au_opt2',
        text: '【听从云长之虑】支持关云长！认为如今军情紧急，不宜过于铺张，仅购备兵刃重甲大旗，便是不朽结拜！',
        effect: {
          statChanges: { intelligence: 5, gold: 50, troops: 50 }
        },
        nextSceneId: 'c1_buy_tools_path'
      }
    ]
  },

  'c1_with_zhangfei_path': {
    id: 'c1_with_zhangfei_path',
    chapterId: 'c1',
    title: '桃园歃血，四杰同誓',
    year: 184,
    narration: '桃花飞舞，天地鉴之。在张庄后园之中，红烛高烧，你们四人歃血同盟，焚香跪拜。刘备、关羽、张飞和你并肩而立，大声齐誓：“同心协力，救困扶危；上报国家，下安黎庶。不求同年同月同日生，只愿同年同月同日死！”兄弟之情，从此坚如磐石！',
    historicalFact: '经典的桃园三结义（此处多了一位主公的大夏誓师，构成四英同盟），是千百年来中国忠义文化的终极象征。',
    options: [
      {
        id: 'c1_w_zf_opt1',
        text: '结拜礼成！与兄弟们痛饮通宵，翌日整军出发！',
        effect: {
          statChanges: { virtue: 15, prestige: 40 }
        },
        nextSceneId: 'c1_fight'
      }
    ]
  },

  'c1_buy_tools_path': {
    id: 'c1_buy_tools_path',
    chapterId: 'c1',
    title: '神铁铸器，双雄较力',
    year: 184,
    narration: '在酒肆谈定不拘俗礼、省去繁复仪式后，你们四人一同动身前往涿县最好的铁匠铺，准备大肆收购镔铁铸造神兵。不料行至街头肉铺旁，张飞性格豪放，意图试探关羽的底细，指着自家门前一车绿豆与几扇肥猪肉，故意挑衅道：『都说云长有万夫不当之勇，俺这一车猪肉与千斤绿豆，你若能单手提得起来，便全送与诸位铸神兵！』关羽面如重枣，抚长髯冷笑：『翼德何必小瞧人！』说罢，两位盖世豪杰竟在当街扭扯成一团！两股排山倒海般的神功巨力合在一处，激荡的气劲震得空气发颤，街道两旁的土瓦纷纷震碎！稍有不慎，这两位震古烁今的猛将就会两败俱伤！主公，你现在立于风暴边缘，将采取什么方式劝阻这场旷世决斗？',
    historicalFact: '历史上关羽张飞早年相随，感情笃深。演义和民间评话中常有“街头神力较量、刘备徒手解围”的桥段，展现当世豪杰的盖世风采。',
    options: [
      {
        id: 'c1_bt_opt1',
        text: '【武力震慑】暴喝一声！运起全身气劲，徒手分砸两人神力，强力震服！',
        requirement: { attribute: 'force', minVal: 75 },
        effect: {
          statChanges: { force: 3, prestige: 50, leadership: 5 }
        },
        nextSceneId: 'c1_stop_fight_success'
      },
      {
        id: 'c1_bt_opt2',
        text: '【肉身死劝】不顾危险，用肉身挡在两雄重拳之间，以赤诚之血感化双雄！',
        effect: {
          statChanges: { virtue: 25, prestige: 40, force: -2 }
        },
        nextSceneId: 'c1_stop_fight_fail'
      },
      {
        id: 'c1_bt_opt3',
        text: '【巧智化解】大喊“校尉府兵已至！”并倒洒碎银制造混乱，以此妙计让双雄收手！',
        requirement: { attribute: 'intelligence', minVal: 70 },
        effect: {
          statChanges: { intelligence: 5, virtue: 10, gold: -50 }
        },
        nextSceneId: 'c1_stop_fight_intel_success'
      },
      {
        id: 'c1_bt_opt4',
        text: '【静观其变】默默注视刘玄德，笃信玄德自有帝王气运出手解斗。',
        effect: {
          statChanges: { virtue: 15, politics: 10 }
        },
        nextSceneId: 'c1_liubei_resolves'
      }
    ]
  },

  'c1_stop_fight_success': {
    id: 'c1_stop_fight_success',
    chapterId: 'c1',
    title: '神勇分双虎，霸气震街衢',
    year: 184,
    narration: '眼见狂飙将起，你暴喝一声，浑身真气激荡！你快步抢入风暴中心，运起千钧臂力，双手如铁钳般扣住两人的手腕，雷霆震吼：『两位贤弟，大敌当前，岂可同室操戈！给我开！』两股神力撞在你的肉躯上，你长立不退，生生将关张二人拆开！关羽、张飞连退数步，虎口酸麻，面露骇然：『主公竟有如此神力，真乃天神也！』双雄对你佩服得五体投地，当即敛气下拜。',
    historicalFact: '乱世唯武独尊。以凡人难企之武道正面降服关张，乃是获取万古猛将至死追随最快捷、最震撼的王道。',
    options: [
      {
        id: 'c1_sfs_opt1',
        text: '【桃园结义】与双雄豪爽大笑，拂去尘土，四人志同道合一同前往张庄桃园歃血结义！',
        effect: {
          statChanges: { force: 5, prestige: 50, virtue: 10 }
        },
        nextSceneId: 'c1_with_zhangfei_path'
      }
    ]
  },

  'c1_stop_fight_fail': {
    id: 'c1_stop_fight_fail',
    chapterId: 'c1',
    title: '血肉舍身劝，仁德感双雄',
    year: 184,
    narration: '你虽武艺未臻化境，却有一腔至诚赤心！你不顾漫天飞扬的碎瓦狂风，大声呼喊着挡在两人铁拳之间。关羽、张飞收招不及，两股足以开山裂石的劲力齐齐轰在你胸前！你闷哼一声，吐血连退。双雄见状大惊失色，慌忙收力抢步扶住你。张飞自责得连连掌嘴：『俺老张真该死，险些伤了大哥！』关羽亦虎目含泪：『主公以千金之躯舍命相劝，关某无地自容！』你的至诚大义彻底将两位绝世猛将感化。',
    historicalFact: '大仁大勇者，虽无力拔山兮之功，却能以德服天下。刘备当年亦常以仁德感人，使万人敌甘心驱驰。',
    options: [
      {
        id: 'c1_sff_opt1',
        text: '【桃园结义】虽身受轻伤却换来双雄赤胆。四人当即携手同往张庄，定下终身誓言！',
        effect: {
          statChanges: { virtue: 15, prestige: 30 }
        },
        nextSceneId: 'c1_with_zhangfei_path'
      }
    ]
  },

  'c1_stop_fight_intel_success': {
    id: 'c1_stop_fight_intel_success',
    chapterId: 'c1',
    title: '妙计息风波，千金市太平',
    year: 184,
    narration: '你不逞匹夫之勇，而是脑中电光石火，扯开喉咙高呼：『邹校尉和太守府兵已从十字街围剿过来了！市井聚众斗殴、损坏官物者当充军充公！』同时，你反手将一整袋散碎银两和铜钱洒向围观的人群，大喝：『张家肉铺大甩卖，见者有份！』四周数百黔首、难民瞬间沸腾，潮水般涌来争抢。汹涌的人潮顿时冲散了关张二人的对立气场。两人不得不尴尬收招，面面相觑，对你的随机应变大为叹服。',
    historicalFact: '智者不弄拳脚，而善御人心与大势。利用钱财市井之欲和官府威势，谈笑间息解千钧危机，方是名主之度。',
    options: [
      {
        id: 'c1_sfis_opt1',
        text: '【桃园结义】抚掌大笑上前，为两雄拂尘引路，同往张庄后桃园共定兄弟之约！',
        effect: {
          statChanges: { intelligence: 5, virtue: 10 }
        },
        nextSceneId: 'c1_with_zhangfei_path'
      }
    ]
  },

  'c1_liubei_resolves': {
    id: 'c1_liubei_resolves',
    chapterId: 'c1',
    title: '玄德显帝威，双手解双雄',
    year: 184,
    narration: '你心知非莽撞之时，默退半步，注视着身旁的刘玄德。只见刘备双目如电，面沉似水，一步跨入两人角力的风暴核心，双手左右一分，分别按在关羽、张飞的肩膀上。他身上隐隐升腾起一股力透千钧的真力，竟将两个万夫不当的猛将生生按住！关羽、张飞只觉浑身如压泰山，无法动弹，对这位汉室宗亲的深藏不露大为惊骇，当即敛气拱手。玄德微笑回头看向你，尽显宽宏：『有主公坐镇，备方敢放手一搏。』',
    historicalFact: '演义中，刘备常显露汉室宗亲的深厚德望与隐秘能耐。能在当街徒手拉开较力的关张，可见玄德并非手无缚鸡之力的庸才。',
    options: [
      {
        id: 'c1_lbr_opt1',
        text: '【桃园结义】大赞玄德帝王之姿！四人相视大笑，当下直奔张庄，行四结义大礼！',
        effect: {
          statChanges: { virtue: 15, politics: 10 }
        },
        nextSceneId: 'c1_with_zhangfei_path'
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

  'c1_pei_force': {
    id: 'c1_pei_force',
    chapterId: 'c1',
    title: '卧牛山大捷 · 俘获乱民群丑',
    year: 184,
    narration: '直撞锋芒，三军用命！只听交合一阵中一声刀雷炸响，关云长手拍青龙 Crescent 大刀凌空斩下，一合震倒裴元绍。裴贼落荒在泥地翻身，被张飞铁矛当即拷擒！部众黄巾眼见渠魁被擒，吓得魂飞魄散，三千贼兵丢盔弃甲，当场跪伏四百余名。然而正面尖刀拼刺下，我军义勇之士精锐受创，遭遇了小规模战损！',
    historicalFact: '演义中在地方割据角逐里，战斗不可避免伴随着死伤。如何处置俘虏，决定一个势力的长治与威德高下。',
    options: [
      {
        id: 'c1_pei_fc_opt1',
        text: '【宏恩招降】好生规劝，将其部众黄巾有志者收编如大营，折损部分黄金，大饱兵卒。',
        effect: {
          statChanges: { troops: 400, gold: -80, virtue: 5, popularity: 10 },
          customLog: '你开仓赏粮，对这些黄巾难民好言相和。四百余降卒感激涕零，甘愿解散裹头，全数编入你的中营义勇行伍，大扩阵仗！'
        },
        nextSceneId: 'c1_pei_ending'
      },
      {
        id: 'c1_pei_fc_opt2',
        text: '【德泽遣还】发放些许铜子，勒令其改邪归正还乡开垦荒野，立博善名。',
        effect: {
          statChanges: { virtue: 18, popularity: 20, prestige: 50, gold: -50 },
          customLog: '你不愿强制服军役，向降卒每人发放少量归乡米粮，遣散其还乡耕种。方圆百十里的平民百姓皆传颂你大恩大德。'
        },
        nextSceneId: 'c1_pei_ending'
      },
      {
        id: 'c1_pei_fc_opt3',
        text: '【雷霆正法】统统斩首示众！大汉纲纪岂容流寇妖道玷污，严威整振！',
        effect: {
          statChanges: { force: 5, politics: 5, prestige: 100, virtue: -20, popularity: -15 },
          customLog: '你挥下佩刀，在涿郡菜市口一字正法，重惩汉贼。塞外流寇土匪听闻你冷血之名，皆慑人心寒。'
        },
        nextSceneId: 'c1_pei_ending'
      }
    ]
  },

  'c1_pei_intel': {
    id: 'c1_pei_intel',
    chapterId: 'c1',
    title: '妙定伏局 · 无战擒得降众',
    year: 184,
    narration: '天赐奇谋！裴元绍中计被飞石大火堵在谷内，左冲右突无路。张翼德在断壁上扯雷暴吼，关云长引精骑高树重幡。裴元绍下马伏拜叩首：“公等皆乃汉室神将，罪将情愿率众归降，再不敢劫庄！”全军以极零成本困伏敌手，不仅无一兵一卒伤折，更完美降服三千之众，获得四百精干战俘！',
    historicalFact: '上兵伐谋，其次伐交，最下攻城。用智谋兵略将乱民兵不血刃解下武装，乃兵学最高一环。',
    options: [
      {
        id: 'c1_pei_it_opt1',
        text: '【宽大收纳】施予粮饷，将这些不伤分毫的精兵降卒扩充为中营义勇兵。',
        effect: {
          statChanges: { troops: 400, gold: -60, virtue: 5, popularity: 10 },
          customLog: '这些青壮未遭战创，体力丰足。收纳编入行伍后，你的长戟军仪容大振！'
        },
        nextSceneId: 'c1_pei_ending'
      },
      {
        id: 'c1_pei_it_opt2',
        text: '【仁爱开释】令其解甲归田。宣颂汉朝之恩，增加主公的名士德望。',
        effect: {
          statChanges: { virtue: 15, popularity: 15, prestige: 40, gold: -40 },
          customLog: '裴元绍一众抱拳痛哭，千谢万谢。散为平民还家开荒，大大改善了你属城郡的户籍安泰。'
        },
        nextSceneId: 'c1_pei_ending'
      },
      {
        id: 'c1_pei_it_opt3',
        text: '【以儆效尤】乱寇终为寇。为了防止降而复叛，全数发往塞外修城。',
        effect: {
          statChanges: { politics: 10, prestige: 80, popularity: -10 },
          customLog: '将这些囚俘戴罪羁押，发往附近防壁城塞强筑防线。大大增加了地方官民的畏惧敬肃。'
        },
        nextSceneId: 'c1_pei_ending'
      }
    ]
  },

  'c1_pei_ending': {
    id: 'c1_pei_ending',
    chapterId: 'c1',
    title: '涿郡威名大震 · 奠定争霸宏图',
    year: 184,
    cgImage: 'pei_yuanshao_battle.jpg',
    narration: '卧牛山一战定乾坤，裴元绍心悦诚服。刘关张等兄弟携你手慷慨高歌，举城同庆。幽州刺史、太守上奏龙廷推荐，你已被任命为讨贼别部先锋，大军开辟，兵指神州广茂中原。汉家天空里，红日将升，而主公开拔，迈入豪强割据的中原浩渺！',
    historicalFact: '首战首捷，主公在义军之中建立了难以企及的军事统御威烈。黄巾风暴卷向北海，匈奴雁门犯关！下一幕由此开启。',
    options: [
      {
        id: 'c1_pei_end_opt1',
        text: '【大业东征】挥旗号令，率关张赵云匈奴雁门与北海并进！',
        effect: {
          statChanges: { prestige: 50, year: 1 }
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
    title: '大浪淘沙，重理大鼎2',
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
        nextSceneId: 'c5_1'
      },
      {
        id: 'c4_s_opt2',
        text: '【尊王攘夷】寻找刘备玄德，同盟保卫汉室，去荆州依附并探寻人才。',
        effect: {
          statChanges: { virtue: 18, prestige: 80 },
          addGeneral: 'zhaoyun',
          customLog: '你选择投向同盟在外的刘备，结伴南下。在途中以你的豪杰风仪感化白马银枪大将赵云，将其保入麾下！'
        },
        nextSceneId: 'c5_1'
      },
      {
        id: 'c4_s_opt3',
        text: '【大汉权臣】带兵效忠天子，托身于曹操大营，辅魏政朝。',
        effect: {
          statChanges: { politics: 15, gold: 1500, intelligence: 10 },
          addGeneral: 'guojia',
          customLog: '你接受曹操的册封为副统帅。在他的太守会馆，你与鬼才郭嘉终日讨论局势。郭嘉大觉你的胸怀如龙，成了你可以策动的亲密密谋！'
        },
        nextSceneId: 'c5_1'
      },
      {
        id: 'c4_s_opt4',
        text: '【天子救驾】乘东都残破、天子潜逃黄河，带兵星夜奉逆天子移驾太室！（需德行 75）',
        requirement: { attribute: 'virtue', minVal: 75, neededGold: 200 },
        effect: {
          statChanges: { virtue: 20, prestige: 300, deviance: 15 },
          customLog: '因你高德清世，名声清正，天子在残垣断壁中拉住你的衣袖，封你为大司马。天子流泪奉迎于你的据点，彻底改写了大汉帝统的覆亡路线！'
        },
        nextSceneId: 'c4_emperor_route'
      }
    ]
  },
  'c4_emperor_route': {
    id: 'c4_emperor_route',
    chapterId: 'c4',
    title: '天子临关，霸道大权',
    year: 196,
    narration: '在洛阳畿辅，你完成了绝世奇谋——奉迎并把持了大汉天子刘协！现在，你是天下唯一实际垄断大汉宗庙天判的人。曹操极恨，袁绍自责。你要拿天子执行什么大略？',
    historicalFact: '本是曹操挟天子迁许，从此独家使用皇帝名牌。',
    options: [
      {
        id: 'c4_er_opt1',
        text: '【挟天子以令诸侯】行霸主权柄！强行诏令魏、吴，勒令裁兵纳税并割让并州。',
        effect: {
          statChanges: { politics: 15, prestige: 300, gold: 1000, deviance: 30 },
          changeFaction: { regionId: 'taiyuan', faction: 'PLAYER' },
          customLog: '天子御玺盖印，诏命通行宇内！你以霸道之权割调太原等郡，曹操、袁绍震怒却不得不口尊贤能。'
        },
        nextSceneId: 'c4_emperor_tyranny'
      },
      {
        id: 'c4_er_opt2',
        text: '【奉天子以从民望】行仁王复辟！分治政权予宗室，宣布天下齐合勤王。',
        effect: {
          statChanges: { virtue: 25, prestige: 200, troops: 3000 },
          addGeneral: 'liubei',
          customLog: '你尊崇天子而不越位，刘备皇叔闻讯奔归大司马帐下。英雄会聚，天下归心！'
        },
        nextSceneId: 'c4_emperor_virtue'
      }
    ]
  },
  'c4_emperor_tyranny': {
    id: 'c4_emperor_tyranny',
    chapterId: 'c4',
    title: '衣带诏密谋，挟天统驭',
    year: 198,
    narration: '你挟奉汉帝，权倾野朝。忠臣董承等私受汉帝血写在内衣的“衣带密诏”，联合外部谋刺大司马，事机不幸败露。军马围住深宫，被搜获密诏的天子面色如土。主公今日如何发落？',
    historicalFact: '历史中曹操严酷诛夷董承董贵人等，使得汉献帝处境极其恐怖窒息。',
    options: [
      {
        id: 'c4_et_opt1',
        text: '【雷霆夷族】朝堂处斩董臣等，武卫禁苑，迫使汉帝另颁立你为丞相之诏！',
        effect: {
          statChanges: { politics: 20, force: 10, prestige: 250, virtue: -15, deviance: 25 },
          customLog: '你诛杀叛臣，在殿堂高傲升迁为主政丞相。虽失天下君子之和，但挟令霸道空前暴涨。'
        },
        nextSceneId: 'c5_1'
      },
      {
        id: 'c4_et_opt2',
        text: '【焚书宽宥】朝会之时当众将衣带诏火解，宣称此乃奸人假冒，安抚天子重定心神。',
        effect: {
          statChanges: { virtue: 22, intelligence: 15, politics: 10, deviance: 5 },
          customLog: '你展现了极其宏大的容人之量，汉献帝感激涕零。忠名重传各野，反倒解除了后续朝叛之乱。'
        },
        nextSceneId: 'c5_1'
      }
    ]
  },
  'c4_emperor_virtue': {
    id: 'c4_emperor_virtue',
    chapterId: 'c4',
    title: '天子临田，劝课农桑',
    year: 198,
    narration: '大司马，你尊奉大汉法统，开办广厦屯田。汉献帝刘协在你的陪同下亲自前行汉中与并州边缘的麦垄，扶犁躬耕，吸引数十万战乱中的百姓奔向你的庇下。接下来你要推行哪条大政？',
    historicalFact: '历史中，曹氏将天子深幽于许昌宫阙。天子临田耕稼实属万代汉臣辅佐的无上佳话。',
    options: [
      {
        id: 'c4_ev_opt1',
        text: '【九品官制】宣布唯才是举与九品官法，在太学提拔豪桀寒门子弟。',
        effect: {
          statChanges: { politics: 25, leadership: 15, intelligence: 10 },
          customLog: '太学博士立，数十位精武统率自此归在府兵之中，大军的行政治理效率达到神话级的极速。'
        },
        nextSceneId: 'c5_1'
      },
      {
        id: 'c4_ev_opt2',
        text: '【广修文教】遣汉官出使西域、重建河西儒学。',
        effect: {
          statChanges: { prestige: 400, virtue: 25, intelligence: 15 },
          customLog: '神州士族高呼大司马为“当世周公”！万古文昌功垂不朽！'
        },
        nextSceneId: 'c5_1'
      }
    ]
  },

  // ------------ CHAPTER 5 ------------
  'c5_1': {
    id: 'c5_1',
    chapterId: 'c5',
    title: '隆中瑞雪，三顾茅庐',
    year: 207,
    narration: '公元207年，大局虽定，但曹操扫平袁氏、统一北方之大势已成。主公你在新野弹丸之地羽翼未丰，极度缺乏经天纬地之才。刘备听闻隆中深山隐居着“卧龙”诸葛孔明，特携主公（你）及关张，备下厚礼，冒雪前往隆中草庐拜访。此前两次均缘悭一面，今日你们第三次来到茅庐。大雪纷飞中，只听庄客说诸葛亮正在草堂午睡未醒。玄德不敢惊动，在阶下叉手侍立。关羽、张飞渐渐面露焦躁。此时主公应当如何定策？',
    historicalFact: '“三顾茅庐”是三国历史与演义中最著名的礼贤下士典范。刘备以诚意打动了隐居的诸葛亮，求得其出山辅佐，自此开创了蜀汉基业。',
    options: [
      {
        id: 'c5_1_opt1',
        text: '【仁心敬贤】按捺住关张脾气，主公与玄德在阶下顶着鹅毛大雪默默侍立，静待先生醒转。',
        effect: {
          statChanges: { virtue: 30, prestige: 150 },
          customLog: '天寒地冻，你与刘备在阶下站立数个时辰，雪落满头却面无愠色。诸葛亮醒来闻之，大受感动，慌忙整衣出迎，叹道：『将军如此仁德，亮怎敢不竭股肱之全力！』'
        },
        nextSceneId: 'c5_2_longzhong'
      },
      {
        id: 'c5_1_opt2',
        text: '【妙音唤仙】不拘泥俗礼，主公亲自在草堂前抚琴弹奏一曲《梁甫吟》，以高山流水之音唤醒卧龙。',
        effect: {
          statChanges: { intelligence: 20, politics: 15 },
          customLog: '琴声悠扬，穿透飞雪。草堂内的诸葛亮翻身而起，抚掌赞道：『妙哉！此曲深得古意，弹琴之人必是当世奇杰！』遂大开柴门，邀主公入内畅谈。'
        },
        nextSceneId: 'c5_2_longzhong'
      },
      {
        id: 'c5_1_opt3',
        text: '【张飞试探】任由张飞在门外大嚷“等俺去后门放一把火，看他起不起”，以此试探诸葛亮的反应。',
        effect: {
          statChanges: { force: 15, virtue: -10, deviance: 10 },
          customLog: '张飞粗声巨嗓，引得庄客惊慌。诸葛亮在榻上哑然失笑，披衣而出，指着张飞笑道：『翼德还是这般火爆脾气！』但也对你等不拘小节的豪气颇为欣赏。'
        },
        nextSceneId: 'c5_2_longzhong'
      }
    ]
  },
  'c5_2_longzhong': {
    id: 'c5_2_longzhong',
    chapterId: 'c5',
    title: '草堂对策，指点江山',
    year: 207,
    narration: '草堂之内，红炉温酒。诸葛亮羽扇纶巾，在案几上展开一幅西川舆图，指点山川，侃侃而谈：『今曹操已拥百万之众，挟天子以令诸侯，此诚不可与争锋；孙权据有江东，国险而民附，贤能为之用，此可以为援而不可图也。主公若欲建功立业，唯有先取荆州为家，后取西川建基，外结孙权，内修政理，待天下有变，则命一上将将荆州之军以向宛、洛，将军身率益州之众出于秦川，如此，大业可成，汉室可兴！』听闻这席惊天动地的《隆中对》，主公将如何应对？',
    historicalFact: '《隆中对》是诸葛亮在未出山前为刘备规划的终极战略蓝图，精准预测了天下三分的走势，展现了卓越的战略眼光。',
    options: [
      {
        id: 'c5_2_opt1',
        text: '【完全采纳】叹服先生远见！完全遵循“联吴抗曹、跨有荆益”之策，隆重拜孔明为军师。',
        effect: {
          statChanges: { intelligence: 25, prestige: 200, virtue: 15 },
          addGeneral: 'zhugeliang',
          customLog: '你与玄德听罢，如拨云雾而见青天。你当即拜诸葛亮为军师。卧龙出山，辅佐于你，天下局势自此为之一变！'
        },
        nextSceneId: 'c5_3_bowang'
      },
      {
        id: 'c5_2_opt2',
        text: '【自图天汉】提出奇思：若不局限于西川，而是在曹操北方后方进行暗中渗透与两面夹击，是否能更快复兴汉室？',
        effect: {
          statChanges: { deviance: 30, politics: 20, gold: 500 },
          addGeneral: 'zhugeliang',
          customLog: '你提出在曹魏后方广布密探、扶植地方豪强、实行暗中破坏的超前战略。诸葛亮双眸一亮，惊叹道：『主公此计奇诡雄阔，虽有违常理，然若行之有效，确实可收奇效！』遂欣然出山辅佐。'
        },
        nextSceneId: 'c5_3_bowang'
      }
    ]
  },
  'c5_3_bowang': {
    id: 'c5_3_bowang',
    chapterId: 'c5',
    title: '初试羽扇，火烧博望',
    year: 208,
    narration: '公元208年秋，曹操命大将夏侯惇领兵十万，以排山倒海之势杀奔新野。此时诸葛亮初掌兵印，关羽、张飞等将皆心中不服，冷眼旁观。孔明在新野县衙内神定气闲，调兵遣将：命赵云领轻骑为前锋，佯装不敌，将敌军诱入博望坡草木茂盛的狭窄山口；主公则需在后方与军师一同掌控火攻总攻时机。大战一触即发！',
    historicalFact: '博望坡之战是诸葛亮出山后的“第一把火”。他利用夏侯惇轻敌无备，在狭窄古道设下火攻，大败曹军前锋，彻底树立了在军中的威望。',
    options: [
      {
        id: 'c5_3_opt1',
        text: '【放火烧山】待敌军后队完全进入伏击圈，主公挥下令旗，四面伏兵齐出，火烧博望坡！',
        effect: {
          statChanges: { intelligence: 15, leadership: 15, prestige: 180, troops: 500 },
          customLog: '火光冲天，博望坡化作一片火海！夏侯惇军马自相践踏，死伤无数，狼狈溃逃。关羽、张飞见状，皆心悦诚服，下马拜服军师神妙！'
        },
        nextSceneId: 'c5_4_prep'
      },
      {
        id: 'c5_3_opt2',
        text: '【白刃夺关】不依赖火计。主公亲率赵云与中军骑兵，在隘口筑起铁壁，迎头痛击夏侯惇前锋！',
        requirement: { attribute: 'force', minVal: 75 },
        effect: {
          statChanges: { force: 25, prestige: 250, troops: -300 },
          customLog: '你与赵子龙两骑如虎入羊群，在隘口杀得血雨腥风！夏侯惇前锋被你们亲手阵斩数将，攻势顿挫。曹军见主公神武，畏惧退兵，博望坡白刃得胜！'
        },
        nextSceneId: 'c5_4_prep'
      }
    ]
  },
  'c5_4_prep': {
    id: 'c5_4_prep',
    chapterId: 'c5',
    title: '铁骑南下，赤壁前夕',
    year: 208,
    narration: '博望坡大败后曹操震怒，亲统大军八十万滚滚南下。荆州刘琮束手归降，你与刘备不得不携民渡江，退守夏口。曹操战船锁于大江之上，扬言旦夕荡平江南。危急时刻，诸葛亮孤身出使东吴，舌战群儒，说服孙权结盟抗曹。东吴大都督周瑜定下火攻之策，但隆冬时节多刮西北风，若贸然放火，反会引火自焚。孔明为此在七星坛登坛做法“巧借东风”；而庞统也已向曹操献上“连环计”使战船首尾相连。大战前夕，风声鹤唳，主公将采取何种行动？',
    historicalFact: '赤壁之战前夕，孙刘联军面临绝对的兵力劣势。通过“群英会蒋干中计”、“黄盖苦肉计”、“庞统献连环计”等一系列连环策谋，才为最后的火攻创造了条件。',
    options: [
      {
        id: 'c5_4_opt1',
        text: '【护法借风】亲率精锐密守七星坛下，阻击东吴暗刺孔明的刺客，确保军师安然归营，并精准测定东风起时！',
        effect: {
          statChanges: { leadership: 20, intelligence: 15, troops: 400 },
          customLog: '夜半子时，东南风大起！周瑜忌惮孔明之智，派丁奉、徐盛暗中包围七星坛。幸得你亲率精兵在坛下横刀阻击，杀退吴兵，护送孔明乘一叶扁舟安然脱险。联军火攻大势已成！'
        },
        nextSceneId: 'c5_5_battle'
      },
      {
        id: 'c5_4_opt2',
        text: '【反间斩将】利用曹营旧交，反用蒋干盗书之计，诱使曹操斩杀其水军都督蔡瑁、张允！',
        requirement: { attribute: 'politics', minVal: 75 },
        effect: {
          statChanges: { politics: 25, prestige: 200, gold: 300 },
          customLog: '你暗施反间之策，使得曹操确信蔡、张二人暗通东吴，一怒之下将两人斩首。曹操痛失水军将领，北方士卒更不习水战，只能将战船首尾相连，正落入火攻圈套！'
        },
        nextSceneId: 'c5_5_battle'
      }
    ]
  },
  'c5_5_battle': {
    id: 'c5_5_battle',
    chapterId: 'c5',
    title: '烈火红岩，赤壁狂澜',
    year: 208,
    narration: '公元208年冬至之夜，大江之上，东南狂风大作。黄盖率数十艘纵火轻船，高张“降”字大旗，顺风疾驶，直冲曹军水寨。接近之时，火船一时俱发，化作数十条火龙猛烈冲入连环战船中！风狂火烈，曹营战船首尾相连，无法拆开，刹那间火烧连天，江面一片血红，惨叫声、哭喊声震天动地。曹操八十万大军灰飞烟灭！你在南岸早已枕戈待旦，主公该如何出击？',
    historicalFact: '赤壁之战是历史上以少胜多的最著名战役。周瑜、刘备联军在赤壁利用火攻重创曹操主力，一举奠定了三国鼎立的政治格局。',
    options: [
      {
        id: 'c5_5_opt1',
        text: '【全军冲杀】亲率赵云、张飞部众乘风踏浪，直捣曹军陆地大营，痛击曹操溃兵！',
        effect: {
          statChanges: { force: 20, troops: 1500, gold: 1000 },
          customLog: '杀声震天！你亲率精锐自南岸杀出，直插曹军心脏。曹兵早已吓破了胆，漫山遍野四散奔逃。你军大获全胜，缴获了无数辎重铁甲，大涨军势！'
        },
        nextSceneId: 'c5_6_post'
      },
      {
        id: 'c5_5_opt2',
        text: '【巧夺荆州】在魏吴两军血战、疲惫不堪之际，暗调精兵，连夜奇袭并占领曹防守空虚的江陵、襄阳！',
        requirement: { attribute: 'politics', minVal: 80 },
        effect: {
          statChanges: { politics: 30, prestige: 400 },
          changeFaction: { regionId: 'xiangyang', faction: 'PLAYER' },
          customLog: '你使出金蝉脱壳之计，借周瑜与曹仁在江陵城下血拼之时，利用孔明伪造的调兵兵符，不费吹灰之力占领了襄阳与江陵。周瑜闻讯气得金疮迸裂，仰天长叹。你从此跨有荆州，王业初定！'
        },
        nextSceneId: 'c5_6_post'
      }
    ]
  },
  'c5_6_post': {
    id: 'c5_6_post',
    chapterId: 'c5',
    title: '华容道上，魏武伏道',
    year: 208,
    narration: '赤壁惨败后，曹操在众将拼死护送下，极为狼狈地往华容道败退。华容古道泥泞不堪，狂风暴雨中，曹操士卒自相践踏，死伤殆尽。诸葛亮算定曹操必走此路，已在此设下天罗地网。主公（你）亲率精锐与关云长并立在华容道狭谷关口。只见曹操衣冠不整，须发皆焦，领着数十骑残兵惨戚而来。见到关羽与你，曹操在马上苦苦哀求：『操今日兵败势穷，望将军念及往日许昌恩义、十里赠袍之情，高抬贵手，放我等一条生路...』',
    historicalFact: '演义中关羽在华容道因感念曹操旧恩，不惜违备军令放走曹操。在历史中，刘备曾率军追击并在华容道放火，但因慢了一步，被曹操狼狈逃脱。',
    options: [
      {
        id: 'c5_6_opt1',
        text: '【刀斩魏武】不顾私恩！天命在此，主公下令万弩齐发，或亲自纵马一剑，将曹操斩于华容道！',
        effect: {
          statChanges: { deviance: 60, prestige: 500, force: 15, virtue: -50 },
          customLog: '惊天破碎！历史在这一刻被你彻底粉碎。你下令万弩齐发，曹操被乱箭穿心，斩于华容道下，魏武霸业就此夭折！中原陷入无主的大乱，天下格局彻底失控，历史轨迹剧烈偏移！'
        },
        nextSceneId: 'c6_changan_war'
      },
      {
        id: 'c5_6_opt2',
        text: '【义释华容】关羽长叹一声，侧身让路，放曹操残兵过去。以此全云长“大义”，也使曹操回北牵制东吴。',
        effect: {
          statChanges: { virtue: 40, prestige: 300, deviance: -10 },
          customLog: '云长长叹，青龙刀落。曹操拜谢，狼狈逃回北方。你以此全了关羽一生“大义之名”，海内君子无不敬仰你的仁义高风。天下之势，正如孔明所料，步入三分鼎立。'
        },
        nextSceneId: 'c6_start'
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
  },
  'ending_defeat': {
    id: 'ending_defeat',
    chapterId: 'c1',
    title: '兵荒马乱：兵员竭尽，黄沙埋骨',
    year: 184,
    narration: '大势崩溃，如山崩地坼！你的势力由于中营精锐兵卒一扫而光，在此军阀交锋、流寇肆虐的严苛岁月中迅速成了任人染指宰割之餐。部将或溃走投诚，或身死阵前，而溃散败军與乱民也趁火打劫冲入帅帐。你拔剑回望烟火熏天，长叹一声倒于沙场！终归没能打破历史的绝情牢笼。主公，您已兵败身死！',
    historicalFact: '惨痛教训！中营兵卒兵力减少至 0 而触发强制败局。在这烽烟未平的东汉末年，兵权即是一切话语权的磐石。请在日后经营、攻防和奇遇试炼中极力关注库存兵力，厉兵秣马！',
    options: []
  },

  // ------------ CHAPTER 8: THREE HEROES FIGHT LU BU ------------
  'c8_start': {
    id: 'c8_start',
    chapterId: 'c8',
    title: '雄关阻路，神将盘横',
    year: 190,
    narration: '公元190年，十八路诸侯歃血为盟直插中原，却被温侯吕布一匹赤兔马、一杆方天画戟阻于虎牢关前。盟军折将折锐，公孙瓒险丧马前。两军阵前风沙起，温侯傲视万军，狂嗷：“谁敢再上受死！”关公横刀，张飞勒矛。面临这场天下第一神威宿缘交锋，主公欲作何裁断？',
    historicalFact: '《三国演义》经典名场面。虎牢关前三英激战吕布，让刘备军三人首次在天下诸侯前大显神威，书写了桃园结义的忠武华章。',
    options: [
      {
        id: 'c8_s_opt1',
        text: '【派遣三英】燕人张翼德挺丈八蛇矛横扫而出，关云长舞偃月刀、主公仗双股剑全伙围攻！',
        effect: {
          statChanges: { prestige: 180, virtue: 20 },
          customLog: '震撼苍穹之战！张飞厉喝一声率先冲入敌阵，如怒雷震裂冰层，枪尖颤击将赤兔马连阻数步。关云长青龙寒光如泼水泼出，主公共舞雌雄剑呈三叠合击。吕布纵能飞天走地，亦被合围逼得披发败北！虎牢关前千古第一杀，全军爆彩喝阵！'
        },
        nextSceneId: 'c8_victory'
      },
      {
        id: 'c8_s_opt2',
        text: '【铁桶战术】调重甲刀盾，遣军千人箭羽齐发，用纯重兵阵法和消耗挫其锐气！',
        effect: {
          statChanges: { troops: -350, prestige: 80, deviance: 10 },
          customLog: '重围之势！你无视单骑名号，直接号令五百中军悍卒与密箭流星夹攻温侯。吕布即便神威惊宇，也敌不过千军严壁，只能咬牙怒啸斩杀偏将后落荒遁投关。虽折损兵力，但终究拔除了杀阵！'
        },
        nextSceneId: 'c8_victory'
      },
      {
        id: 'c8_s_opt3',
        text: '【龟缩免战】战局不可测，暂高挂免战牌，保留兵卒实力任诸侯叫战。',
        effect: {
          statChanges: { prestige: -40, virtue: -10 },
          customLog: '诸侯皆露怯！袁绍长叹“若我颜良文丑在，何至于此！”。然而盟军内部分离，随着数日后火烧洛阳的消息传来，十八路讨董诸侯就此自私作罢、不战而散，青史留憾。'
        },
        nextSceneId: 'c8_draw'
      }
    ]
  },
  'c8_victory': {
    id: 'c8_victory',
    chapterId: 'c8',
    title: '名震中原，威震联军',
    year: 190,
    narration: '吕布落荒奔回雄关紧闭。诸侯公孙瓒、曹操大加宴赐，众人满斟黄金贺酒。中原联军上下，无人不叹服主公帐前之大勇。此次打破温侯不败金身神迹，你的名望和实力在极高天鉴上开始改写东汉割据宿世格局！',
    historicalFact: '虎牢关一捷是主角自此迈入一流权争之阶的重磅跳板，历史对这一大捷赋予了极其丰厚的评价分值。',
    options: [
      {
        id: 'c8_v_opt1',
        text: '【受勋班师】收复虎牢残散步卒，携带大宗诸侯犒劳黄金班师回大本营！',
        effect: {
          statChanges: { gold: 1200, troops: 500, prestige: 100 }
        },
        nextSceneId: 'ending_emperor'
      }
    ]
  },
  'c8_draw': {
    id: 'c8_draw',
    chapterId: 'c8',
    title: '落寞退场，历史重写',
    year: 190,
    narration: '由于过于求全保守，虎牢无所建树。董卓得胜从容迁都长安并纵火焚掠洛阳。各路诸侯在猜忌中纷纷自退，中原再度陷入了你争我夺、赤地千里的漫长荒芜乱纪。',
    historicalFact: '无功即过。错失战机导致中原错走上了分裂、民生涂炭的漫长乱纪世道。',
    options: [
      {
        id: 'c8_d_opt1',
        text: '【叹作休止】收拾退意，退归故地卧薪尝胆，精修内政。',
        effect: {
          statChanges: { prestige: -20, virtue: 10 }
        },
        nextSceneId: 'ending_historic'
      }
    ]
  },

  // ------------ CHAPTER 9: DISCUSSING HEROES OVER WINE ------------
  'c9_start': {
    id: 'c9_start',
    chapterId: 'c9',
    title: '后园藏锋，青梅亭会',
    year: 199,
    narration: '公元199年，幽燕战息。你身怀宏图，却暂羁留于曹操之许都。为避枭雄加害忌心，你每日于后园辟地种菜，挑粪灌溉，表现得全无大志。这日天际聚雨，曹操突然遣人召你。青梅亭上双雄对樽，操指点天下英雄。他逼视着你，突放惊天断语：“今天下英雄，唯使君与操耳！”此时春雷将起，风急云翻。主公如何破招？',
    historicalFact: '“煮酒论英雄”是《三国演义》中玄德韬光避害、金蝉脱壳的最高谋略桥段，其以雷惊筷落地来化解枭雄毒刺，令百代赞慕。',
    options: [
      {
        id: 'c9_s_opt1',
        text: '【落箸掩雷】大惊失箸！假称自己受迅雷之威惊骇，巧妙退隐傲绝乾坤之才，麻痹曹公！',
        effect: {
          statChanges: { virtue: 35, deviance: -10, prestige: -15 },
          customLog: '雷声大作！你巧妙掉落竹箸，顺水推舟：“雷威惊怖如斯，真大丈夫之畏天心。”曹孟德闻之狂笑不已，心底警惕瞬间荡为尘泥，视你为寻常庸君。数日后你成功借讨袁术之由调遣五万大军直趋徐州城！'
        },
        nextSceneId: 'c9_success'
      },
      {
        id: 'c9_s_opt2',
        text: '【当仁不让】挺直身姿！坦荡笑对曹操：“曹公所言极是！天下纷乱有志者，除备与明公，余者皆不足挂齿！”',
        effect: {
          statChanges: { deviance: 60, prestige: 250, virtue: -10 },
          customLog: '雄豪相撞！曹操眼中杀意滔天，虽然大叹你有傲骨，但程昱等人连夜劝说：“备乃飞龙异象，此时不杀必为后患。”当晚府兵包围府苑，局势凶猛，主公不得不带着关羽张飞踏过重甲鲜血，死战破门出城！'
        },
        nextSceneId: 'c9_clash'
      },
      {
        id: 'c9_s_opt3',
        text: '【叩首甘伏】胡言阿谀！直接跪倒在曹公座前叩首称谢，表态终生愿作孟德帐下一犬马，不再自称刘氏宗室。',
        effect: {
          statChanges: { prestige: -80, virtue: -30, deviance: -20 },
          customLog: '曹操虽然不再忌惮你，但眼神里的鄙夷显露无遗。你虽然逃脱杀身，但骨节意志皆碎，你被削夺了大名和随从并终生幽禁在深苑大墙里，郁郁而终。'
        },
        nextSceneId: 'c9_fail'
      }
    ]
  },
  'c9_success': {
    id: 'c9_success',
    chapterId: 'c9',
    title: '龙腾九汉，纵兵脱围',
    year: 199,
    narration: '你以完美心术瞒过当时最绝枭雄，犹如蛟龙游入怒海汪洋，金蝉摆脱死结！关张接令高奏凯旋歌，你们领着带出的几万曹军精锐一鼓作气夺下重镇并扩充行营。龙魂复苏！',
    historicalFact: '刘备借机脱离许都，从此蛟龙入海、天阔凭飞，是其创业立邦的一大奇迹改命里程碑。',
    options: [
      {
        id: 'c9_suc_opt1',
        text: '【一元复始】号召部众高筑防御，扩募集训各地兵数，筹集黄金司库。',
        effect: {
          statChanges: { gold: 1000, troops: 1800, prestige: 150 }
        },
        nextSceneId: 'ending_loyalist'
      }
    ]
  },
  'c9_clash': {
    id: 'c9_clash',
    chapterId: 'c9',
    title: '破浪决算，徐州阻击',
    year: 199,
    narration: '你踩着无尽血骨杀出了许都，但徐州全面战端因此被无限提早！曹操亲统二十万倾国大军，挟天子之诏杀声滚滚重兵围守。徐州城墙残破，兵卒惊恐。主公必须在此绝壁之上拼至死路！',
    historicalFact: '提前开局的大火并。虽然热血磅礴，然而也导致了极度残忍、艰难的攻城苦战和兵力减耗。',
    options: [
      {
        id: 'c9_cl_opt1',
        text: '【死守拒敌】用鲜血与怒火捍卫社稷，三军死不退步！',
        effect: {
          statChanges: { troops: -650, prestige: 200 }
        },
        nextSceneId: 'ending_historic'
      }
    ]
  },
  'c9_fail': {
    id: 'c9_fail',
    chapterId: 'c9',
    title: '折骨残名，长落草芥',
    year: 199,
    narration: '大势溃尽。在欺侮和极度耻辱的禁闭中，你磨掉了所有的英卓之气。关公叹息挂印，张飞流野，汉室之天命，就此凄凉落地。',
    historicalFact: '避祸而使骨志折断。豪杰一朝失胆，英雄从此不再入册。',
    options: [
      {
        id: 'c9_f_opt1',
        text: '【魂入悲流】一朝痛改前非，重渡宿命磨难。',
        effect: {
          statChanges: { deviance: -30 }
        },
        nextSceneId: 'ending_defeat'
      }
    ]
  },

  // ------------ CHAPTER 10: A THOUSAND MILES TO RIDE ------------
  'c10_start': {
    id: 'c10_start',
    chapterId: 'c10',
    title: '挂印封金，千里单骑',
    year: 200,
    narration: '公元200年，徐州离散，刘关张三杰天各一方。关羽为了保全两位皇嫂，不得已暂居许昌曹营。一朝听闻刘玄德生还于河北袁绍处，关公大喜，当即封金挂印，护送皇嫂登车北上。而主公（你）得知消息后，亦携同赵子龙赶来支援。五关守将因无通关文牒不肯放行，曹营追兵亦尾随而至。主公，你将如何选择护送路线？',
    historicalFact: '“千里走单骑”与“过五关斩六将”是关羽忠义绝伦的标志性事件。在演义中，关羽挂印封金，保皇嫂千里寻兄；而在本作中，玩家可选择与关羽结伴硬闯，或与赵云组队担任急先锋。',
    options: [
      {
        id: 'c10_s_opt1',
        text: '【云长同往】主公亲自与关云长并马同行，护送二嫂车仗，正面硬闯东路五关阻碍！',
        effect: {
          statChanges: { virtue: 15, prestige: 100 },
          customLog: '你决定与云长同行。两骑并肩，关羽手抚美髯，大为感动：『有主公同行，此行纵有千军万马阻拦，关某亦无惧！』'
        },
        nextSceneId: 'c10_guanyu_passes'
      },
      {
        id: 'c10_s_opt2',
        text: '【子龙开路】主公与常山赵子龙率百余轻骑先行开路，沿途斩关夺寨，为云长马车清扫障碍！',
        effect: {
          statChanges: { force: 15, leadership: 10 },
          customLog: '你与赵子龙率轻骑风驰电掣。赵云白马银枪，英姿勃发：『末将愿随主公陷阵破关，为关将军扫平前路阻碍！』'
        },
        nextSceneId: 'c10_zhaoyun_passes'
      },
      {
        id: 'c10_s_opt3',
        text: '【投桃留魏】力劝云长留仕许昌。极言天命已归曹氏，何必为虚名送命。',
        effect: {
          statChanges: { prestige: 250, deviance: 100, virtue: -80 },
          customLog: '关羽闻言，长叹一声，神神色黯然，最终被你的利害说辞和曹操的厚恩打动，长揖不拜归顺魏朝。桃园情义自此冰消瓦解，大汉气数沦丧。'
        },
        nextSceneId: 'ending_historic'
      }
    ]
  },
  'c10_guanyu_passes': {
    id: 'c10_guanyu_passes',
    chapterId: 'c10',
    title: '关羽合力：过五关斩六将',
    year: 200,
    narration: '主公与关云长并马护卫车仗。行至东岭关，守将孔秀横枪阻拦；洛阳关前，韩福与孟坦设下冷箭；汜水关卞喜暗设鸠酒伏兵；荥阳关王植密谋夜烧馆驿；滑州秦琪扼守渡口。关隘重重，杀机四伏。守将皆欲置关羽于死地，主公当如何破敌？',
    historicalFact: '关羽在东路连过东岭关、洛阳、汜水关、荥阳、滑州五处关隘，阵斩孔秀、韩福、孟坦、卞喜、王植、秦琪六将，威震天下。',
    options: [
      {
        id: 'c10_gy_opt1',
        text: '【白刃破关】云长凤目圆睁，青龙偃月刀冷光大作！主公亦仗剑纵马，合力斩将破关！',
        effect: {
          statChanges: { force: 20, prestige: 250, troops: -200 },
          customLog: '神威盖世！云长拖刀飞骑，一合劈孔秀于马下；在洛阳侧身闪过冷箭，回手一刀斩韩福。你在汜水关当众拆穿卞喜鸿门宴，一剑刺穿其心。荥阳王植欲纵火被你提前围剿，滑州秦琪在云长刀下未过三合首级高飞！五关六将命丧当场，血洒古道！'
        },
        nextSceneId: 'c10_success'
      },
      {
        id: 'c10_gy_opt2',
        text: '【智说守将】主公巧用政治手腕，出示曹操金牌，或以利害说词令守将知难而退，兵不血刃渡关！',
        requirement: { attribute: 'politics', minVal: 70 },
        effect: {
          statChanges: { politics: 20, virtue: 20, gold: -300 },
          customLog: '你凭三寸不烂之舌和手中曹公金牌，令各关守将畏惧退避，部分贪墨之辈则辅以黄金贿赂。大车车仗安然无恙通过，不染一丝血迹！'
        },
        nextSceneId: 'c10_success'
      }
    ]
  },
  'c10_zhaoyun_passes': {
    id: 'c10_zhaoyun_passes',
    chapterId: 'c10',
    title: '子龙并肩：千里单骑突重围',
    year: 200,
    narration: '主公与赵子龙率轻骑风驰北上。前路黄河渡口重兵把守，夏侯惇亲自率领曹魏精骑在后围追堵截。狂风吹乱衰草，夏侯惇挺枪怒喝，誓要留下车仗.子龙挺枪跃马挡在你身前，高呼：『主公，夏侯惇重骑兵进入山口，山石轰然落下，人仰马翻。子龙趁势领轻骑回马掩杀，曹军大败，仓皇退兵！』',
    historicalFact: '赵云在历史上亦是万人之敌、浑身是胆的白马悍将。与玩家组队担任开路先锋，千里奔行，极为豪迈。',
    options: [
      {
        id: 'c10_zy_opt1',
        text: '【龙胆陷阵】主角与赵子龙两骑并冲，银枪长剑织成死亡雨幕，强行撕裂夏侯惇骑阵！',
        effect: {
          statChanges: { force: 25, prestige: 300, troops: -150 },
          customLog: '天地失色！赵子龙一条银枪如梨花飞舞，连挑曹营四员悍将，夏侯惇被你一剑震退数丈，惊骇不已。两骑白闪冲透重围，杀得曹军人马翻腾，肝胆俱裂！'
        },
        nextSceneId: 'c10_success_zhaoyun'
      },
      {
        id: 'c10_zy_opt2',
        text: '【隘口设伏】利用险要山峪设下滚石绊马索，主角与赵云据守险口，以少击众阻击夏侯惇！',
        requirement: { attribute: 'leadership', minVal: 70 },
        effect: {
          statChanges: { leadership: 20, troops: 300, gold: 100 },
          customLog: '你在古道山峡巧妙设伏，夏侯惇重骑兵进入山口，山石轰然落下，人仰马翻。子龙趁势领轻骑回马掩杀，曹军大败，仓皇退兵！'
        },
        nextSceneId: 'c10_success_zhaoyun'
      }
    ]
  },
  'c10_success': {
    id: 'c10_success',
    chapterId: 'c10',
    title: '古城聚大义，兄弟再聚首',
    year: 200,
    narration: '山高路长，古城之下尘土飞扬。守城的张飞本疑云长降曹，听闻斩关夺将之功，大哭出迎。刘玄德快马北来，桃园三英在古城门下紧紧相拥，热泪盈眶。众将士及围观百姓见云长千难万险护送车仗，无不感动高呼，义名震彻海内。',
    historicalFact: '古城会是刘备势力重整的关键时刻。经此磨难，桃园结义之大义之名播于宇内，民望斗涨。',
    options: [
      {
        id: 'c10_suc_opt1',
        text: '【王业腾骧】大义初成！整顿兵马，扩充行伍，誓要高歌北上，匡扶汉室！',
        effect: {
          statChanges: { gold: 1200, troops: 2000, prestige: 300, virtue: 30 }
        },
        nextSceneId: 'ending_emperor'
      }
    ]
  },
  'c10_success_zhaoyun': {
    id: 'c10_success_zhaoyun',
    chapterId: 'c10',
    title: '古城大捷，盖世子龙归麾',
    year: 200,
    narration: '夕阳西下，古道斑驳。主公与赵云杀透重围，顺利保全刘备家小，终于在古城与刘备、关羽、张飞大军合流。三英得知主公与赵云沿途拼死截断追兵、夺关开路之神威，无不肃然起敬。玄德执子龙之手大哭道：『子龙孤胆，救我全家，真乃一身是胆也！』赵云单膝下跪，向主角及玄德慨然宣誓效忠！',
    historicalFact: '赵云在古城正式归队效力。他的一生赤胆忠心、骁勇善战，是蜀汉政权最坚实的支柱之一。',
    options: [
      {
        id: 'c10_scz_opt1',
        text: '【招纳神将】得子龙相助，天下何愁不平！全军高歌，向天下展现不灭斗志！',
        effect: {
          statChanges: { prestige: 400, leadership: 15, troops: 1500 },
          addGeneral: 'zhaoyun'
        },
        nextSceneId: 'ending_emperor'
      }
    ]
  },

  // ------------ CHAPTER 11: POEM IN SEVEN STEPS ------------
  'c11_start': {
    id: 'c11_start',
    chapterId: 'c11',
    title: '朝堂威逼，七步成诗',
    year: 220,
    narration: '公元220年，大魏王曹操薨逝，长子曹丕嗣位为魏王，随后践祚称帝，建立曹魏。然而曹丕生性多疑，深忌同胞弟、才高八斗的临淄侯曹植。一日，曹丕于许昌大殿上召见曹植，周围带刀宿卫森立。曹丕厉声威逼道：『吾与汝虽为兄弟，然位分已殊。汝素自负经才，今命汝于朝堂之上，每行一步吟诗一首，七步之内若不成，则以谋逆罪斩首不贷！』朝堂百官战栗，无人敢发一言。主公在暗中观察形势，该当如何抉择？',
    historicalFact: '《世说新语·文学》记载了曹植七步成诗的典故，而《三国志》及《后汉书》则详实记录了曹操长子曹丕与次子曹植长达数年的夺嫡之争，以及曹丕称帝后对诸弟的防范与削爵逼迫。',
    options: [
      {
        id: 'c11_opt_assist',
        text: '【代拟神作】施加文华妙技，暗中辅助曹植吟诵出流传千古的《七步诗》，以此唤醒同胞骨肉之情。',
        effect: {
          statChanges: { virtue: 180, prestige: 220, politics: 40 },
          customLog: '“煮豆燃豆萁，豆在釜中泣。本自同根生，相煎何太急！”曹植神态自若走步吟诵，声泪俱下。曹丕听罢泣不成声，深感愧疚，当堂降诏宽免，只贬其爵。同胞骨肉相残之大悲得以避免，主公也大张海内仁人声望！'
        },
        nextSceneId: 'c11_luoshen'
      },
      {
        id: 'c11_opt_resist',
        text: '【洛神赋词】不屑应答朝堂威逼，拂袖出殿，至黄昏洛水之畔，遥思故人，挥笔写下惊艳世人的《洛神赋》。',
        effect: {
          statChanges: { prestige: 350, deviance: 40, virtue: 100 },
          customLog: '“翩若惊鸿，婉若游龙。荣曜秋菊，华茂春松。”曹植临风长啸，挥毫落墨。凄婉超凡的辞章传遍中原，洛河神女之女真姬幻影似在云梦中拂袖起舞。此文学巨作不朽，天下士子无不将主公与曹植视为千古知音与神仙才俊！'
        },
        nextSceneId: 'c11_success'
      },
      {
        id: 'c11_opt_revolt',
        text: '【反客为主】暗中策动在野义士与曹植的旧部宿卫，在许昌朝堂发动伏兵死斗，强行保下曹植并直击曹丕！',
        effect: {
          statChanges: { troops: -600, deviance: 120, gold: -400, force: 100 },
          customLog: '历史狂轨倾复！许昌大殿当堂血飞如星。主公的便衣宿卫和曹植府兵拔键大杀，曹丕宿卫仓皇御敌。两军激战一昼夜，曹丕惊惧妥协，被迫许诺封曹植为临淄王自立一国。大魏内部分裂，大汉史学家无不目瞪口呆！'
        },
        nextSceneId: 'c11_success'
      }
    ]
  },
  'c11_luoshen': {
    id: 'c11_luoshen',
    chapterId: 'c11',
    title: '翩若惊鸿，神女出尘',
    year: 220,
    narration: '朝堂脱难后，曹植行至清冷碧绿的洛水之畔。斜阳芳草之中，风吹白雾，隐约可见一位天姿倾国之丽人立于波涛之上，衣带当风，仙姿绰约。她美眸含泪，朱唇微启：『君才高比天，奈何生于帝王之家。这枚洛神美玉，愿赠予知音，愿乱世英雄，能一洗骨肉相残、红颜夭亡之悲情。』说罢，化为大雁没入苍茫云烟。主公握此美玉，只觉手中留香，胸有千秋。',
    historicalFact: '洛神赋相传原名《感甄赋》，野史、唐代李善注中多有关于曹植与嫂甄氏、以及洛水神女传说的浪漫联想、写景绝伦，展现了文学史上的极致唯美。',
    options: [
      {
        id: 'c11_luoshen_opt1',
        text: '【神玉入册】珍藏洛神佩玉，承袭其翩跹灵气，安抚天下受难之红颜士子。',
        effect: {
          statChanges: { virtue: 120, prestige: 150, gold: 300 },
          customLog: '你珍重收下洛神玉佩，洛水中泛起一层金黄氤氲，预示着文治人望大盛。'
        },
        nextSceneId: 'c11_success'
      }
    ]
  },
  'c11_success': {
    id: 'c11_success',
    chapterId: 'c11',
    title: '文人高义，余音绕梁',
    year: 220,
    narration: '洛水浩荡，文采千秋。经此命轨之劫，文能抗威，诗可通神。天下名宿、建安诸子听闻主公之超然运作，无不抱拳景仰，纷纷前来涿郡会盟。主公平添了无数惊世文墨名望，为接下来的乱世大业奠定了不拔的精神高标！',
    historicalFact: '曹丕与曹植虽然政治矛盾酷烈，但二人在文学史上与曹操并称“三曹”，是建安文学的风骨奠基者，引领了中国古典诗歌的又一次高峰。',
    options: [
      {
        id: 'c11_suc_opt1',
        text: '【文治大兴】设高台招揽天下名仕儒生，令大汉风骨万代播扬！',
        effect: {
          statChanges: { virtue: 100, prestige: 200, gold: 500 }
        },
        nextSceneId: 'ending_emperor'
      }
    ]
  },

  // ------------ CHAPTER 12: CAO CAO SEEKING TALENTS ------------
  'c12_start': {
    id: 'c12_start',
    chapterId: 'c12',
    title: '三道求贤，唯才是举',
    year: 210,
    narration: '公元210年至217年间，一代枭雄曹操在中原巩固霸业，面对世家大族的顽强阻挠以及四方诸侯的缠斗，为广募英杰，不拘一格，在许昌连续颁布了三次震惊宇内的《求贤令》，大呼：『若必廉士而后可用，则齐桓其何以霸世！今天下得无有至德之人，二三子其佐我明扬仄陋，唯才是举，吾得而用之。』主公作为在野奇才、王佐之士，决定顺应大势，投身曹氏阵营！',
    historicalFact: '曹操著名的“求贤三令”打破了自东汉以来依靠门第、孝廉选官的腐朽制度，提出“唯才是举”口号，是北方得以迅速平定分裂并恢复生产的重大阶级战略。',
    options: [
      {
        id: 'c12_opt_advisor',
        text: '【呈十胜策】亲赴邺城铜雀台，向曹操呈献《囊括八荒十胜十败大策》，辅佐其唯才是举、破格征辟。',
        effect: {
          statChanges: { intelligence: 180, prestige: 250, politics: 45 },
          customLog: '曹操览毕策书，惊喜过望，当即解下身上锦袍披于你身，大呼：『公真吾之子房、郭奉孝再生也！』拜你为首席参谋，大魏贤良闻风而动，英杰聚如繁星。你成为了操盘北中国大局的一代军师！'
        },
        nextSceneId: 'c12_visiting'
      },
      {
        id: 'c12_opt_emperor',
        text: '【奉天子令】极力协助曹操贯彻“奉天子以令不臣，修耕植以畜军实”之大计，扩充王道屯田军需。',
        effect: {
          statChanges: { leadership: 150, troops: 1800, gold: 800 },
          customLog: '你协理朝纲、整顿屯田兵粮。许都官民安居乐业，大批难民归化为青州兵卒。曹操赞你：『足食足兵，建不世之基，卿居功首位。』大魏大纛招展，军势如破竹！'
        },
        nextSceneId: 'c12_success'
      },
      {
        id: 'c12_opt_pacify',
        text: '【安民招抚】要求曹操对投降、归宿的普通汉臣及地方守将大开不株连之门，以民心政治消解乱局。',
        effect: {
          statChanges: { virtue: 250, politics: 60, deviance: -30 },
          customLog: '你主张的厚德宽仁和不究往宿，使得曹魏版图内各路抗拒力量纷纷解剑归顺。大魏不仅招来了良将，更得到了广袤百姓的拥护。中原动荡暴跌，海内共敬你的仁德救世！'
        },
        nextSceneId: 'c12_success'
      }
    ]
  },
  'c12_visiting': {
    id: 'c12_visiting',
    chapterId: 'c12',
    title: '阿瞒拜贤，绝食跣足',
    year: 212,
    narration: '一日深夜，曹操听闻主公有关于平定关陇、迎战刘吴的至妙军事画轴，竟然大喜欲狂。他来不及穿鞋、甚至连口中饭粒都来不及咽下，跣足（赤脚）狂奔出营门迎接主公，一把攥住主公双手大叹：『孤深夜渴盼，犹如久旱之望云。今得卿佐，孤大业稳矣！』操引主公步入大帐，秉烛促膝谈至天明，天下雄主对你的敬畏重托无以复加。',
    historicalFact: '历史上曹操“跣足迎许攸”、“不拘小节尊贤”为人津津乐道，充分彰显了他礼贤下士、求才如渴的雄主胸怀与不拘一格之鲜活个性。',
    options: [
      {
        id: 'c12_visit_opt1',
        text: '【倾囊相佐】指画大势！为曹魏大军划定一鼓作气横扫徐豫、稳定中原防线之全盘战略！',
        effect: {
          statChanges: { leadership: 100, troops: 1500, gold: 600 },
          customLog: '烛火明灭中，你挥毫在军事布防图上点出天险关节。曹操连连击节赞叹，下令北方十万守军即刻依令执行变轨！'
        },
        nextSceneId: 'c12_success'
      }
    ]
  },
  'c12_success': {
    id: 'c12_success',
    chapterId: 'c12',
    title: '贤集魏基，天下定鼎',
    year: 215,
    narration: '良禽择木而栖，贤臣择主而事。主公投身曹魏，不仅成就了自己操兵指划的旷世才华，更将个人声望推至权勋顶峰。大魏军旗之下，百万人马屯田复苏，良将谋臣在你的统御调度下严阵以待。大业磐石已定，只待翻云覆雨，一统寰宇！',
    historicalFact: '大魏政权在不拘一格召贤纳贡后，拥有了当时中国最庞大的文官与将领军团，这也为后来政权更替后的天下一统奠定了广博的物质与军政基石。',
    options: [
      {
        id: 'c12_suc_opt1',
        text: '【鼎定寰宇】誓助魏师建立万世一统不拔之基，终结数代生灵之屠戮！',
        effect: {
          statChanges: { gold: 1500, troops: 2500, prestige: 250 }
        },
        nextSceneId: 'ending_emperor'
      }
    ]
  }
};
