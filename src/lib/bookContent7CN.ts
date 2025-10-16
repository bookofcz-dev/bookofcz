import selfie1 from "@/assets/selfie1.jpg";
import selfie2 from "@/assets/selfie2.jpg";
import selfie3 from "@/assets/selfie3.jpg";
import selfie4 from "@/assets/selfie4.jpg";
import selfie5 from "@/assets/selfie5.jpg";
import selfie6 from "@/assets/selfie6.jpg";
import selfie7 from "@/assets/selfie7.jpg";

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
    title: "币安大会",
    image: selfie1,
    link: "https://x.com/TheBTCVerse/status/1965047744030191852",
    content: `在币安会议活动上与CZ的自拍。

明亮的黄色币安品牌为这个在重大加密会议上捕捉的充满活力的时刻奠定了基调。

发布者：@TheBTCVerse`
  },
  {
    chapter: "自拍 2",
    title: "虚拟会面",
    image: selfie2,
    link: "https://x.com/Abrlien/status/1917564407883653387",
    content: `在虚拟会议期间CZ出现在屏幕上的创意自拍。

即使在数字时代，粉丝们也能找到独特的方式来捕捉与CZ的联系。

发布者：@Abrlien`
  },
  {
    chapter: "自拍 3",
    title: "总统会面",
    image: selfie3,
    link: "https://x.com/cz_binance/status/1544818369362141184",
    content: `CZ在正式外交场合与总统的合影。

这张照片记录了重要的高层联系以及加密货币在政府层面日益增长的认可。

发布者：@cz_binance`
  },
  {
    chapter: "自拍 4",
    title: "区块链活动",
    image: selfie4,
    link: "https://x.com/ice_z3us/status/1852028431908647189",
    content: `在展示Tron、Solana和币安品牌的区块链会议上与CZ的合影。

这些多链活动展示了加密生态系统的合作精神。

发布者：@ice_z3us`
  },
  {
    chapter: "自拍 5",
    title: "莱特币致敬",
    image: selfie5,
    link: "https://x.com/litecoin/status/1959799543051989366",
    content: `CZ用俏皮的手势表达对莱特币的喜爱。

一个有趣的时刻，展示了CZ对更广泛的加密社区和不同区块链项目的欣赏。

发布者：@litecoin`
  },
  {
    chapter: "自拍 6",
    title: "中东连接",
    image: selfie6,
    link: "https://x.com/toastpunk/status/1959852084695798109",
    content: `CZ与中东的加密爱好者会面。

这张照片代表了币安的全球影响力和在不同地区架设桥梁的承诺。

发布者：@toastpunk`
  },
  {
    chapter: "自拍 7",
    title: "医疗环境",
    image: selfie7,
    link: "https://x.com/rohelkhan/status/1961281256404001139",
    content: `在医疗环境中拍摄的与CZ的温馨自拍。

这张自然的照片展示了CZ的平易近人，即使在意想不到的地方也会花时间与人交流。

发布者：@rohelkhan`
  },
  {
    chapter: "结语",
    title: "未完待续...",
    content: `这只是我们自拍集的开始！

我们正在收集来自全球各地更多与CZ的自拍。目标是展示社区中44个难忘的时刻。

每张自拍都讲述着一个关于联系、灵感和加密革命人性化一面的故事。

敬请期待这个不断增长的合集的更多内容。

想要贡献？在你的自拍中标记@cz_binance，它可能会在未来的更新中出现！`
  }
];
