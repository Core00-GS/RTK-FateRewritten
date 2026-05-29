/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SideQuest } from '../types';

export const SIDE_QUESTS_POOL: SideQuest[] = [
  {
    id: 'taoyuan_item',
    title: '探寻寒铁：桃园神兵',
    description: '涿县后山发现落雷天外陨铁，张飞称此铁非比寻常，若能夺下熔炼，可为即将出世的神将打造趁手重器。但盘踞后山的黑山军流寇亦垂涎此铁。',
    hint: '需要在幽州(涿郡)完成本任务。可极大增强兄弟默契。',
    status: 'AVAILABLE',
    targetRegionId: 'zhuojun',
    rewardDesc: '获得黄金300及高额历史扭转度，提升玩家与关张默契。',
    requirement: {
      force: 65,
    },
    reward: {
      gold: 300,
      deviance: 6,
      prestige: 50
    },
    dialogue: {
      intro: '你带着几名亲兵深入涿郡后山，只见乱石堆中一闪烁着幽冷青光的奇金散落四周，而数百名黑山山贼手持斧头正欲将其拉走。',
      challenge: '山贼大头目雷公跳出来啐了一口狂喊：“哪来的碎游侠，吃爷爷一斧子，滚回去！”你想怎么应备？',
      choices: [
        {
          text: '【单挑力战】大喝一声挺枪直取雷公，以无双武勇震慑群盗！',
          successRate: '高 (武力判定 >= 70)',
          checkType: 'force',
          threshold: 70,
          success: {
            narration: '你怒吼一声，长枪抖出三朵残炎，直贯雷公面门。只一合，对方便被你用枪杆挑飞数十米当场昏死！群盗骇然狂呼，抱头四散！',
            rewardMultiplier: 1.2
          },
          failure: {
            narration: '对方居然也有些膂力，你连刺十余枪皆被对方挡下，最终只得指挥手下士卒一拥而上将其痛揍，战马有所擦伤，死伤数十名精兵。',
            lossTroops: 100
          }
        },
        {
          text: '【虚张声势】暗中让士卒多设战鼓、伏于草莽大吹牛号，智退群贼。',
          successRate: '中 (智力判定 >= 65)',
          checkType: 'intelligence',
          threshold: 65,
          success: {
            narration: '满山遍野突然战歌擂隆，山贼大恐，只以为是幽州大将公孙瓒的精锐红马白马义从过关扫匪，屁滚尿流抛下百斤陨铁而逃。',
            rewardMultiplier: 1.0
          },
          failure: {
            narration: '你的诡计被当场看破，山贼头目嘲笑一声反包抄过来，你们只得拼死血战才将天外陨铁抢出，士气大挫。',
            lossTroops: 200
          }
        }
      ]
    }
  },
  {
    id: 'rescue_zhen',
    title: '邺城救美：甄宓之困',
    description: '冀州邺城战乱不止，富户甄家遭到溃兵骚扰。听闻甄家遗孤甄宓天姿国色、饱读诗书，若能前去救济庇护，可令河北士族士子彻底归心。',
    hint: '需要智力或黄金。在邺城附近可接。',
    status: 'AVAILABLE',
    targetRegionId: 'yecheng',
    rewardDesc: '极大提高政治和声望。',
    requirement: {
      intelligence: 70,
    },
    reward: {
      prestige: 150,
      gold: 500,
      deviance: 5
    },
    dialogue: {
      intro: '来到邺城废墟之中，你看到数十个残兵正持长矛，叫嚣着试图撞开甄氏庭院的大门。甄氏母女依墙瑟瑟发抖。',
      challenge: '大门已崩，溃兵头目准备抢掠金银、劫掠人口。你当何以处之？',
      choices: [
        {
          text: '【大张王义】上前高呵你是汉家别部司马，下令违宪格杀，率亲随突袭！',
          successRate: '极易 (武力 >= 60)',
          checkType: 'force',
          threshold: 60,
          success: {
            narration: '你横枪怒斥，乱贼头目未及答话便被你飞马踏成烂泥，其余喽啰见阁下官服威严武勇爆顶，尽数跪地请降。甄家对阁下感激涕零。',
            rewardMultiplier: 1.1
          },
          failure: {
            narration: '溃兵负隅顽抗，双方在庭院内混战多时，甄家偏房不慎走火，死伤了数十难民，但好在甄宓本人安然无恙。',
            lossTroops: 50
          }
        },
        {
          text: '【金珠和解】不欲多造杀孽，掏出200两黄金将溃兵头目收编招降。',
          successRate: '必成 (消耗黄金 200)',
          checkType: 'gold',
          threshold: 200,
          success: {
            narration: '你手执黄金直接亮出，表示可编他们为正规汉军，给口营饱饭。对方大喜过望丢弃木器，当场纳头便拜，你平白收容上百名壮士。',
            rewardMultiplier: 1.5
          },
          failure: {
            narration: '钱两不足，被贼人看扁。',
            lossTroops: 0
          }
        }
      ]
    }
  },
  {
    id: 'xiongnu_beast',
    title: '北疆除凶：震慑匈奴',
    description: '塞外降服的匈奴白雕部落暗中反水，企图趁你南下诸侯会盟时再次撕毁盟约蹂躏雁门关，北方胡兵铁骑已经包围了边境多个屯军要塞。',
    hint: '需要极高军事统帅与兵力防卫。必须前往雁门。',
    status: 'LOCKED',
    targetRegionId: 'xiongnu',
    rewardDesc: '掠夺匈奴战马1000、补充2000精锐骑兵！',
    requirement: {
      prestige: 100,
    },
    reward: {
      troops: 2500,
      gold: 800,
      deviance: 12
    },
    dialogue: {
      intro: '塞北雁门，漫天飞雪，胡马烈鸣。你在前哨据点只见上千余匈奴铁甲狼头旗正环绕游走，边塞防线已岌岌可危。',
      challenge: '敌军单于之子正在叫阵：“南方汉人软骨耳！交出千名生口、万斛细粮，否则踏平雁门！”',
      choices: [
        {
          text: '【兵贵神速】带八百并州铁骑发动反冲锋，凿穿敌军大阵！',
          successRate: '难 (统帅 >= 80)',
          checkType: 'force',
          threshold: 80,
          success: {
            narration: '你单枪匹马，在暴风雪掩护下从敌侧翼致命斜插！直扑单于之子将当场剁下。群胡魂飞天外，以为汉天神下凡，丢下数千皮帽战马溃退塞北！',
            rewardMultiplier: 1.5
          },
          failure: {
            narration: '胡骑弓术凶猛，大雪中你无法形成突破，反而遭到四面合围，只得在部下舍命掩护下杀回要塞，兵员损失惨重。',
            lossTroops: 1200
          }
        },
        {
          text: '【空营诱敌】在塞城内遍插伏弩，开城门行空城计，引胡奴入伏。',
          successRate: '中 (智力 >= 75)',
          checkType: 'intelligence',
          threshold: 75,
          success: {
            narration: '你广开城门，自在敌前抚琴叫笑。胡人怀疑有埋兵不敢跨入，正迟疑，城上千百攒射弓弩齐射，连破敌方头面，胡将仓皇狼狈退走。',
            rewardMultiplier: 1.1
          },
          failure: {
            narration: '匈奴单于生性多疑却也有骁勇者，横冲直闯看穿了城内少虚，一拥而入，巷战绞杀数天，虽将其逐出，但要塞受损严重。',
            lossTroops: 800
          }
        }
      ]
    }
  },
  {
    id: 'taishici_rescue',
    title: '北海赈灾：士民归心',
    description: '青州北海饱经大战蹂躏，蝗灾连天，死骨枕籍，十万流民处于饥寒交迫之中。孔太守束手无策，需借粮赈济。',
    hint: '前往北海，消耗大量黄金，可兑换大量忠义流民入伍。',
    status: 'AVAILABLE',
    targetRegionId: 'beihai',
    rewardDesc: '增加海量民气声望与1500降从义家义军！',
    requirement: {
      prestige: 50,
    },
    reward: {
      troops: 1500,
      prestige: 250,
      deviance: 8
    },
    dialogue: {
      intro: '来到北海郡城门，只见大堆衣衫褴褛的孩子与妇人伏在一起。青州官库已然空涸，官民皆露出绝望之泪。',
      challenge: '孔融叹道：“天下荒乱，吾等大儒亦不能保黎民一餐饱饭。义士可愿出谷拯救？”',
      choices: [
        {
          text: '【倾囊施粥】毫不犹豫捐赠财帛500，在城外搭百口大锅日夜施粥！',
          successRate: '必成 (消耗黄金 500)',
          checkType: 'gold',
          threshold: 500,
          success: {
            narration: '金银散于民间，转瞬化为拯救命稻。香喷喷的大米粥沸隆多月，十万流民叩首大呼万岁。两千余壮丁发誓“此生只保明主”，当众要求扛枪随行！',
            rewardMultiplier: 1.4
          },
          failure: {
            narration: '资金不足。',
            lossTroops: 0
          }
        },
        {
          text: '【剿灭豪强】利用政治手段查抄青州囤粮之奸商豪强，借借鸡生蛋。',
          successRate: '极难 (智力/政治 >= 80)',
          checkType: 'intelligence',
          threshold: 80,
          success: {
            narration: '你单枪名查，巧用政治手腕和天朝法律大义，在豪强宗族还没反应过来时掌握了强买私扣谷米的死罪，抄取了三个豪强谷仓！不仅救活全郡，还掠得余财三千金！',
            rewardMultiplier: 1.8
          },
          failure: {
            narration: '地方世族群起对抗、串通州牧上奏参你欺凌宗室，全城百姓在挑唆之下暴乱，你的营盘声誉大跌、士气溃落。',
            lossTroops: 300
          }
        }
      ]
    }
  },
  {
    id: 'seek_wolong_quest',
    title: '三顾草庐：凤雏卧龙',
    description: '隆中隐逸着隐世凤雏与卧龙诸葛孔明。得此人者可得安天下之大智。曹操也派了密探前去打听。你需要抢在魏国特工下手前，诚心收揽贤人。',
    hint: '前往襄阳探析，不可过于粗莽用强。',
    status: 'AVAILABLE',
    targetRegionId: 'xiangyang',
    rewardDesc: '提前激活诸葛孔明效力（若尚未获得），或智力直接大涨。',
    requirement: {
      intelligence: 75,
    },
    reward: {
      intelligence: 10,
      prestige: 100,
      deviance: 14
    },
    dialogue: {
      intro: '襄阳隆中山谷幽香，松柏翠竹。你来到竹庐前，草率的童子拦住你称：“先生抱膝熟睡，今日不接待客。”而小道尽头，隐现几个手持短匕、眼神冷鹜的魏廷死士。',
      challenge: '刺客打算纵火竹苑顺便掳走诸葛亮！你要在不惊扰或拯救的情形下，解除本局。',
      choices: [
        {
          text: '【草庐解杀】亲自手刃魏死士！于山林乱斗，守护修竹！',
          successRate: '难 (力判定 >= 78)',
          checkType: 'force',
          threshold: 78,
          success: {
            narration: '你青钢细剑长击而出，身形在竹影中飘飞，不漏一声便把三名黑衣死士当场在山谷口钉杀！回转草堂，诸葛孔明刚好披衣推门出，含笑称：“将军绝勇，真龙杰也，亮愿为将军效犬马之劳！”',
            rewardMultiplier: 1.3
          },
          failure: {
            narration: '刺客在林中狂啸纵火，虽然你杀尽了来贼，但大火将半座竹林烧成赤浪，惊醒的诸葛先生仅从后窗惊险逃走，并未对你留下良好印象。',
            lossTroops: 100
          }
        },
        {
          text: '【名扬清流】在院前不卑不亢吟诗，以你的惊世文思和汉室安天下的道理，将门内的诸葛亮直接惊起迎接！',
          successRate: '极难 (智力 >= 83)',
          checkType: 'intelligence',
          threshold: 83,
          success: {
            narration: '你不理死士，站在院前遥遥吟出数首隆中大策与兴复汉土之隆中对！门闩顿时大开，诸葛孔明赤足跌撞跑出引你为天人知己。侧旁的曹军死士被你带来的庞大郡兵当场吓瘫。',
            rewardMultiplier: 2.0,
          },
          failure: {
            narration: '你背吟的古诗略有些磕绊，甚至用词不伦不类，屋中仅传来诸葛亮微微的讥笑声。门童送客称“大将军且回，先生今日出游去也”。',
            lossTroops: 0,
          },
        },
      ],
    },
  },
  {
    id: 'luoyang_dingtian',
    title: '虎盟除奸：刺董大谋',
    description: '权臣董卓倒行逆施、火烧京师。大儒王允暗设连环计策，邀你率部暗中入京刺董。此举若成，则大汉社稷可暂安，若败则将面临西凉军的无尽围剿。',
    hint: '前往京师洛阳，需要极高的武力或者黄金买通守卫。',
    status: 'AVAILABLE',
    targetRegionId: 'luoyang',
    rewardDesc: '获得黄金 500、声望 150，大幅度偏逸历史。',
    requirement: {
      force: 70,
    },
    reward: {
      gold: 500,
      prestige: 150,
      deviance: 12
    },
    dialogue: {
      intro: '洛阳残垣断壁，王司徒密召你于府邸偏殿。案上摆放着七星宝刀与一份城防暗图，而府外董卓的西凉宿卫军正高声喝问搜查。',
      challenge: '吕布手持方天画戟正巡视殿前！若想突刺董卓，必须做出决断：',
      choices: [
        {
          text: '【单刀突刺】手执冷刃，趁董卓侧身酣睡发动致命一击！（武力判定 >= 75）',
          successRate: '极难 (武力 >= 75)',
          checkType: 'force',
          threshold: 75,
          success: {
            narration: '你兔起鹘落，七星刀化作一道白虹直穿董卓肥厚的甲胄！胖魔王狂吼半声当场咽气。吕布惊闻冲入，你怒发赤胆，在关张掩护下飞身跃马杀出洛阳，汉室名望盖世！',
            rewardMultiplier: 1.4
          },
          failure: {
            narration: '刀锋划过龙床，发出铿然巨响。董卓惊醒回手一掌将你击退，吕布大踏步跨入偏殿，方天画戟怒扫，你拼死杀出重围，麾下宿卫损失殆尽。',
            lossTroops: 600
          }
        },
        {
          text: '【贿买细作】暗中耗费300两黄金，买通西凉中郎将，于膳食下软骨散。',
          successRate: '易 (消耗 300 黄金)',
          checkType: 'gold',
          threshold: 300,
          success: {
            narration: '重金之下，必有勇夫。董卓进食之后手脚酥软无力，你引精锐私兵攻入内府将其斩首，并将部分财宝据为己有。',
            rewardMultiplier: 1.2
          },
          failure: {
            narration: '金银不足，内应私拿钱财倒戈相向，刺杀计划泄露。你只得仓皇撤退。',
            lossTroops: 0
          }
        }
      ]
    }
  },
  {
    id: 'guangzong_yellow',
    title: '平定广宗：剿灭天公',
    description: '黄巾贼天公将军张角于广宗筑起高坛，祭天施法，呼风唤雨令大汉三军望而生畏。若能前去突击捣毁大坛，则三十万贼众可弹指土崩瓦解。',
    hint: '前往冀州邺城战线突围，需要极高智能。',
    status: 'AVAILABLE',
    targetRegionId: 'yecheng',
    rewardDesc: '招纳黄巾俘虏精卒 1800，缴获黄金 300。',
    requirement: {
      intelligence: 68,
    },
    reward: {
      troops: 1800,
      gold: 300,
      deviance: 10
    },
    dialogue: {
      intro: '广宗原野上，黄雾漫天。法坛高耸百尺，张角披发仗剑，口念咒语。天空中雷响不绝，狂风夹杂飞砂吹得汉军睁不开眼。',
      challenge: '黄巾军见汉军迟疑，挥舞大纛发起潮水般猛攻。你待如何反制这妖术？',
      choices: [
        {
          text: '【算定阴阳】以奇门奇术测定风向，放火箭逆风反烧黄巾大坛！（智力判定 >= 72）',
          successRate: '中 (智力 >= 72)',
          checkType: 'intelligence',
          threshold: 72,
          success: {
            narration: '你立于战车高处，料定巽风转头，下令火箭齐发。天际骤然大亮，火势顺狂风直扫黄巾妖坛！张角大惊吐血跌落，数十万黄巾瞬间以为天罚，当场成军瓦解归降！',
            rewardMultiplier: 1.3
          },
          failure: {
            narration: '风向骤变，火焰反而吞噬了你自军的先锋大队，军心动摇，遭妖符骑兵冲击，折损甚众。',
            lossTroops: 500
          }
        },
        {
          text: '【强攻法坛】不信妖术，亲督敢死精兵，顶着箭雨滚石强行破阵！',
          successRate: '中 (武力判定 >= 76)',
          checkType: 'force',
          threshold: 76,
          success: {
            narration: '你暴喝如雷，手执双刀斩将夺旗，只身带敢死队斩贼数十。黑夜中你一箭射瞎了张角的大徒，妖法因恐惧不攻自破！汉军趁势碾压，俘获无算。',
            rewardMultiplier: 1.1
          },
          failure: {
            narration: '雷石滚木如雨，雷电击中中军大纛，官军死伤惨重，不得不狼狈退守安平。',
            lossTroops: 700
          }
        }
      ]
    }
  },
  {
    id: 'chibi_fire',
    title: '赤壁风烈：烈火雄风',
    description: '曹操千万艨艟连舟列阵。江畔寒风刺骨，吴主孙权正招募敢死队纵火突袭，若能献计相助并倾力突击，三原宿命将在此改写。',
    hint: '在武昌附近协助孙刘联军。需武力与名望。',
    status: 'AVAILABLE',
    targetRegionId: 'jianye',
    rewardDesc: '战功大捷！分得兵甲2200，纳饷 600 两。',
    requirement: {
      prestige: 80,
    },
    reward: {
      troops: 2200,
      gold: 600,
      deviance: 15
    },
    dialogue: {
      intro: '大江之上，火光映红了半边天！黄盖诈降大船正满载干柴鱼油直冲曹操的铁锁战船。然而曹军岸边埋伏了大批神射手与投石机。',
      challenge: '曹军悍将大呼守御，试图以铁叉顶回火箭火舟。你将怎么援助东吴？',
      choices: [
        {
          text: '【冲关突击】亲自架战船，为火舟斩旗开道，以刚勇撞毁曹军横铁锁！（武力 >= 78）',
          successRate: '难 (武力 >= 78)',
          checkType: 'force',
          threshold: 78,
          success: {
            narration: '你赤膊挺枪，怒海长呼，连劈三名曹国水师牙将，架大舸凶悍撞断水寨连铁锁！火船瞬间倒卷曹操千万艨艟，烈火延烧百里！曹兵号哭滔天，大败溃逃。',
            rewardMultiplier: 1.5
          },
          failure: {
            narration: '曹军强弩齐攒，你的战船中石沉没，你在水卒奋力捞救下捡回一命，敢死队几乎全军覆没。',
            lossTroops: 800
          }
        },
        {
          text: '【安澜定风】暗设水下拒马与渔网，拦截曹军试图包抄解围的水鬼奇袭队。',
          successRate: '中 (智力 >= 70)',
          checkType: 'intelligence',
          threshold: 70,
          success: {
            narration: '你智算周密，曹军特种水卒果然密谋水下凿船，全数落入你所设的渔网钉板之中。大网捞起百余魏兵，让东吴火攻万无一失。',
            rewardMultiplier: 1.1
          },
          failure: {
            narration: '魏军蛙人在水下凿穿了你军的运粮楼船，物资损失严重。',
            lossTroops: 300
          }
        }
      ]
    }
  },
  {
    id: 'xuzhou_rescue',
    title: '驰援徐州：奉玺释兵',
    description: '曹操借杀父之仇举兵东征徐州，屠杀百姓无数。刺史陶谦向各路仁人志士发书求援。刘备已引三千步骑前往救援，向主公飞送羽檄。',
    hint: '前往北海或徐州前线阻击。需要强兵与善心。',
    status: 'AVAILABLE',
    targetRegionId: 'beihai',
    rewardDesc: '名声远播天下，奖励声望 200，引流民合部 1200 兵。',
    requirement: {
      prestige: 40,
    },
    reward: {
      prestige: 200,
      troops: 1200,
      deviance: 8
    },
    dialogue: {
      intro: '下邳城外，魏将曹仁麾下玄甲骑兵来回驱赶，城内大火熊熊，陶谦病体沉重。城上官兵皆惶恐。',
      challenge: '曹军围城，且于要道设伏。刘备兵少暂退。大军当何去何从？',
      choices: [
        {
          text: '【仁义一怒】直面硬撼！率领兄弟们杀入包围圈，打通救援神州路！（武力 >= 70）',
          successRate: '中 (武力 >= 70)',
          checkType: 'force',
          threshold: 70,
          success: {
            narration: '你一马当先，青龙战刀舞起阵阵寒芒，汉军义卒大呼冲锋，直将曹仁合围前锋生生凿出一条通路！徐州官民哭泣迎你与刘玄德入城，天下人皆赞主公乃万世一仁杰！',
            rewardMultiplier: 1.3
          },
          failure: {
            narration: '曹军铁骑严整，连珠弩封锁退路。你军虽拼斩突入，但殿后步兵被追兵截杀，重创损失颇深。',
            lossTroops: 500
          }
        },
        {
          text: '【驰羽修书】借天朝礼法与各路太守联名修书曹相，修秦赵之好，息兵干戈。',
          successRate: '极易 (智力 >= 60)',
          checkType: 'intelligence',
          threshold: 60,
          success: {
            narration: '你陈说利害，上表述说魏军暴行不仅动摇名望且吕布已乘虚抢占了曹操中原大本营兖州。曹操权衡利害，大骂一声无奈退归，徐州万千黎平得存，无不感戴主公。',
            rewardMultiplier: 1.0
          },
          failure: {
            narration: '曹操震怒碎书，官军再次狂攻要塞，防线崩塌，全赖刘关张断后才得幸免。',
            lossTroops: 400
          }
        }
      ]
    }
  },
  {
    id: 'chaoting_shoushou',
    title: '许都奉迎：挟天子大计',
    description: '汉帝流落废墟，百官茹毛饮血，诸侯皆以为累赞而避之。若抢先迎奉天子于己方都城，则可“面奉玺书，挟朝而令诸侯”，霸业大张！',
    hint: '前往洛阳迎奉，不可被西凉李傕郭汜截胡。',
    status: 'AVAILABLE',
    targetRegionId: 'luoyang',
    rewardDesc: '大赏百阶，收获黄金 1000，主公政治修证大涨。',
    requirement: {
      intelligence: 70,
    },
    reward: {
      gold: 1000,
      prestige: 300,
      deviance: 18
    },
    dialogue: {
      intro: '洛阳废墟，百草丰茂。汉献帝刘协与几十个老臣面无人色。远处李傕郭汜的虎狼骑士马蹄滚滚，准备再次将圣上虏往西凉当人质。',
      challenge: '天子衣衫褴褛，泣道：“忠臣何在？救朕一难！”你当如何处置？',
      choices: [
        {
          text: '【金戈护驾】亲率精骑发起救亡反抢攻，斩尽乱军，把天子接入大营！（武力 >= 76）',
          successRate: '难 (武力 >= 76)',
          checkType: 'force',
          threshold: 76,
          success: {
            narration: '你银甲闪耀，突袭凉州乱军本阵，一连格杀李傕数十名牙门宿卫！凉州兵大骇溃崩，你迎皇帝登上轩辕御辇，恭顺迎回幽州涿郡。受汉天子下诏策命为“辅汉车骑大将军”，黄金粟粮赏无可赏！',
            rewardMultiplier: 1.5
          },
          failure: {
            narration: '凉州战车冲突迅猛，乱战中流矢差点误伤天子，官军不得不且战且退，虽然救走百官成行，但精锐老兵损伤大半。',
            lossTroops: 800
          }
        },
        {
          text: '【神威修言】利用天子声名大义与伪玺发出勤王官诏，震退西凉乱军。',
          successRate: '中 (智力 >= 72)',
          checkType: 'intelligence',
          threshold: 72,
          success: {
            narration: '你振臂高擎大汉军法诏书，并借你麾下午睡军名声，怒斥他们为“谋大逆者戮九族”！西凉乱兵皆本汉臣，吓得面面相觑抛戈解马大溃离散。天子得以顺利迎至你的霸业根据地。',
            rewardMultiplier: 1.2
          },
          failure: {
            narration: '乱贼嚣张，哈哈大笑称“今日不认什么天子书，只认我西凉马刀！”，发起骑马蹂躏，你们死伤甚众，狼狈撤回。',
            lossTroops: 500
          }
        }
      ]
    }
  }
];
