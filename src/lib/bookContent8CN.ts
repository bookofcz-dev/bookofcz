import book8Cover from "@/assets/book8-cover.png";

interface BookPage {
  title: string;
  content: string;
  chapter?: string;
  image?: string;
  link?: string;
}

export const bookContent: BookPage[] = [
  {
    title: "CZ圣经",
    content: "CZ之书 - 第8章\n\nCZ圣经\n\n这是一本关于CZ在加密货币世界及其他领域旅程中的智慧、教导和见解的神圣合集。\n\n---\n\n本书需要代币验证。要访问完整内容，您需要在BSC上持有至少44,444个CZ之书代币。\n\n代币地址：0x701bE97c604A35aB7BCF6C75cA6de3aba0704444",
    chapter: "封面",
    image: book8Cover
  },
  {
    title: "需要访问权限",
    content: "🔒 代币门控内容\n\n这是预览版。完整的CZ圣经仅对在币安智能链上持有CZ之书代币的用户开放。\n\n要求：\n• 最低余额：44,444个代币\n• 网络：BSC（币安智能链）\n• 代币：0x701bE97c604A35aB7BCF6C75cA6de3aba0704444\n\n连接您的钱包以验证您的持有量并解锁完整的智慧合集。"
  }
];

export const title = "CZ之书 - 第8章：CZ圣经";
export const coverImage = book8Cover;
