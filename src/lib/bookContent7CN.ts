import selfie1 from "@/assets/selfie1.jpg";
import selfie2 from "@/assets/selfie2.jpg";
import selfie3 from "@/assets/selfie3.jpg";
import selfie4 from "@/assets/selfie4.jpg";
import selfie5 from "@/assets/selfie5.jpg";
import selfie6 from "@/assets/selfie6.jpg";
import selfie7 from "@/assets/selfie7.jpg";
import selfie8 from "@/assets/selfie8.jpg";
import selfie9 from "@/assets/selfie9.jpg";
import selfie10 from "@/assets/selfie10.jpg";

export interface BookPage {
  title: string;
  content: string;
  chapter?: string;
  image?: string;
  link?: string;
}

export const bookContent: BookPage[] = [
  {
    chapter: "简介",
    title: "与CZ的自拍：精选集",
    content: `欢迎来到"与CZ的自拍" - 这是一个独特的合集，记录了世界各地的人们与币安创始人CZ相遇并合影的瞬间。

从会议场所到医疗环境，从总统会面到休闲邂逅，这些自拍讲述着联系、社区和加密货币领袖人性化的一面。

每张照片都代表着一个时刻，一段共同的回忆，以及一位继续在全球激励数百万人的领导者的亲和力。

浏览这些来自CZ社区的难忘自拍。`
  },
  {
    chapter: "自拍 1",
    title: "Demo Day的狗狗币氛围",
    image: selfie1,
    content: `在BNB Chain Demo Day上，CZ与穿着狗狗币帽衫的社区成员的有趣时刻。

黄色的"BNB CHAIN DEMO DAY"背景完美地衬托出这次有趣的互动，展示了CZ对模因文化和社区创造力的欣赏。`
  },
  {
    chapter: "自拍 2",
    title: "下一代建设者",
    image: selfie2,
    content: `CZ在BNB Chain活动上与一位年轻开发者合影。

这张照片代表了区块链的未来——年轻、充满热情的建设者与行业领袖建立联系，共同塑造明天的去中心化世界。`
  },
  {
    chapter: "自拍 3",
    title: "Demo Day优雅时刻",
    image: selfie3,
    content: `在BNB Chain Demo Day上，CZ与穿着优雅服装的社区成员的时尚时刻。

休闲而专业的氛围展示了加密社区的包容性，创新与包容并存。`
  },
  {
    chapter: "自拍 4",
    title: "办公室访问",
    image: selfie4,
    content: `CZ在现代办公环境中与年轻爱好者会面。

这些在专业空间中的亲密时刻展示了CZ致力于在会议和舞台之外与社区互动的承诺。`
  },
  {
    chapter: "自拍 5",
    title: "年轻的CZ",
    image: selfie5,
    content: `CZ早年的回顾照片。

这张复古照片提醒我们，每一段旅程都有起点——在币安之前，在区块链之前，有一个年轻的梦想家对未来充满愿景。`
  },
  {
    chapter: "自拍 6",
    title: "会议室时刻",
    image: selfie6,
    content: `CZ在商务会议或演示期间的捕捉。

在区块链活动的幕后，想法得以分享，合作伙伴关系得以形成，加密货币的未来通过协作得以塑造。`
  },
  {
    chapter: "自拍 7",
    title: "和平与积极",
    image: selfie7,
    content: `在BNB Chain Demo Day上的欢快自拍，到处都是和平手势。

这个乐观的时刻捕捉了加密社区的乐观精神——共同建设、连接和庆祝。`
  },
  {
    chapter: "自拍 8",
    title: "币安团队",
    image: selfie8,
    content: `CZ与币安团队——让这一切成为现实的人们。

穿着配套的币安服装，这张集体照庆祝了世界领先加密平台背后的协作努力。`
  },
  {
    chapter: "自拍 9",
    title: "会议连接",
    image: selfie9,
    content: `CZ在币安大会上与社区成员在标志性的黄色背景前合影。

这些会议时刻展示了加密领导者的可及性以及币安生态系统的包容性。`
  },
  {
    chapter: "自拍 10",
    title: "模因魔法",
    image: selfie10,
    content: `在BNB Chain Demo Day上的创意照片，CZ和社区成员手持模因艺术作品。

这个有趣的时刻庆祝了区块链技术与互联网文化的交汇，表明加密货币既可以严肃也可以有趣。`
  },
  {
    chapter: "结语",
    title: "收藏继续",
    content: `这10张自拍代表了连接、社区以及CZ和币安生态系统可及精神的时刻。

从Demo Day到办公室访问，从复古回顾到团队庆祝，每张照片都讲述了构成全球加密社区的人们和时刻的独特故事。

这个收藏展示了区块链的人性化一面——真实的人、真实的联系、真实的影响。

想要贡献？在您的自拍中标记@cz_binance，它可能会在未来的更新中展示！`
  }
];
