/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TriviaItem {
  id: string;
  keyword: string;
  title: string;
  content: string;
}

export const HISTORICAL_TRIVIA: TriviaItem[] = [
  {
    id: "t1",
    keyword: "桃园",
    title: "【正史冷知识：桃园三结义真实存在吗？】",
    content: "《三国演义》中刘关张「桃园结义」的故事家喻户晓。但据正史《三国志·关羽传》记载，刘关张三人并无正式结拜仪式，仅写三人「寝则同室，恩若兄弟，于稠人广坐中，侍立终日」。不过关张二人对刘备确实忠心耿耿，「随其周旋，不避艰险」，虽无骨肉之名，却有手足之实。"
  },
  {
    id: "t2",
    keyword: "神兵",
    title: "【正史冷知识：关羽真的使用「青龙偃月刀」吗？】",
    content: "汉代的骑兵战场上其实并没有「青龙偃月刀」这种长柄重宽刀。长柄偃月刀至唐宋才研发成熟并作为礼仪或操练器械。在东汉末年，关羽主要的兵器是「槊（长矛）」与「环首刀」。《三国志》中斩颜良时写道「策马刺良于万众之中，斩其首还」，其中的「刺」字即证实关羽当时使用的是矛或戟。"
  },
  {
    id: "t3",
    keyword: "张飞",
    title: "【正史冷知识：粗豪的张飞其实是书画名家？】",
    content: "戏曲或演义多把张飞塑造成黑脸、满腮胡的暴躁莽夫。但明代《丹铅总录》与清代碑文记载，张飞出身涿郡有资产之豪绅，极具文化修养，喜好挥毫作画，工于草书，尤擅长写生妙绘「美人图」。现今四川阆中等地仍存有传为张飞所书的摩崖石刻。"
  },
  {
    id: "t4",
    keyword: "刘备",
    title: "【正史冷知识：昭烈帝刘备的奇异容貌】",
    content: "据陈寿《三国志·先主传》记载，刘备身长七尺五寸（约汉制173厘米），容貌特异：「垂手下膝，顾自见其耳」。意思是他的双手长度过膝，且眼睛转斜能直接望见自己的耳朵。在汉末相术中，此等异相被称为「帝王贵戚之表」，常被视为受命于天的吉兆。"
  },
  {
    id: "t5",
    keyword: "曹操",
    title: "【正史冷知识：曹操是建安文坛盟主】",
    content: "曹操在历史上不仅是杰出的政治、军事家，还是「建安文学」的核心领袖。他的四言诗如《短歌行》、《观沧海》、《龟虽寿》等，洗练悲凉，开创了建安风骨之大气。鲁迅赞誉其为「改造文章的祖师」。"
  },
  {
    id: "t6",
    keyword: "诸葛",
    title: "【正史冷知识：诸葛连弩与木牛流马】",
    content: "正史中诸葛亮不仅有「鞠躬尽瘁，死而后已」的圣贤德操，还是位极其出色的军事发明家。他改良了能十矢俱发的「元戎弩（诸葛连弩）」，设计了运粮于崎岖蜀道的「木牛流马」，并完善了玄妙的「八阵图」，让魏将司马懿发出「天下奇才」的赞叹。"
  },
  {
    id: "t7",
    keyword: "黄巾",
    title: "【正史冷知识：黄巾党的口号与阴阳天命】",
    content: "黄巾起义的著名口号「苍天已死，黄天当立，岁在甲子，天下大吉」反映了当时盛行的「五德始终说」。汉朝自认属「火德（苍天/赤帝）」，依相生相克，代火者为「土德（黄色/黄天）」。太平道首领张角因而在甲子年以此煽动百万信徒，以求鼎立新朝。"
  },
  {
    id: "t8",
    keyword: "孙权",
    title: "【正史冷知识：孙权的奇异眼珠与虎将容貌】",
    content: "《三国演义》描述孙权「碧眼紫髯，堂堂一表」。而在正史记载中，张辽与张昭皆引证孙权骨格不凡，有「大口、方颐、碧眼、宽额」之相。曹操在与其两军交锋抗衡后，也叹息道：「生子当如孙仲谋，刘景升儿子若豚犬耳！」"
  },
  {
    id: "t9",
    keyword: "华雄",
    title: "【正史冷知识：「温酒斩华雄」的真正英雄】",
    content: "演义中「温酒斩华雄」是关羽声名大噪的首功。但是根据《三国志·吴书》真实记载，击破董卓先锋、在阳人兵变中斩杀胡轸、枭首骁将华雄的，其实是江东猛虎「孙坚（孙权之父）」。演义为了神化刘关张义军，将许多属于孙坚的胜绩转安在了关羽身上。"
  },
  {
    id: "t10",
    keyword: "吕布",
    title: "【正史冷知识：吕布的辕门射戟距地有多远？】",
    content: "正史《三国志·吕布传》证实「辕门射戟」是真事：「布令门候于营门竖一只戟，布挽弓躬射，正中戟支。纪灵等诸将皆震慑，乃罢兵」。其射程足足有一百五十步（约合汉制150多米），要在疾风之中射中如此纤细的小戟支，其眼力与臂力令人咋舌。"
  }
];

export function getTriviaForScene(sceneId: string, narrationText: string): TriviaItem {
  // Try matching via keyword first
  for (const item of HISTORICAL_TRIVIA) {
    if (narrationText.includes(item.keyword) || item.keyword === "桃园") {
      // Default to returning the matching one sequence
      if (narrationText.includes(item.keyword)) {
        return item;
      }
    }
  }
  // Custom fallback picker based on scene hash
  const charCodeSum = sceneId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = charCodeSum % HISTORICAL_TRIVIA.length;
  return HISTORICAL_TRIVIA[index];
}
