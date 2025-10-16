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
    chapter: "Introduction",
    title: "Selfies with CZ: A Collection",
    content: `Welcome to "Selfies with CZ" - a unique collection capturing moments when people around the world met and photographed with CZ, the founder of Binance.

From conference halls to medical settings, from presidential meetings to casual encounters, these selfies tell stories of connection, community, and the human side of crypto.

Each photo represents a moment in time, a memory shared, and the accessibility of a leader who continues to inspire millions globally.

Tap through to explore these memorable selfies from the CZ community.`
  },
  {
    chapter: "Selfie 1",
    title: "Doge Vibes at Demo Day",
    image: selfie1,
    content: `A fun moment with CZ and a community member sporting a Doge hoodie at the BNB Chain Demo Day.

The yellow "BNB CHAIN DEMO DAY" backdrop perfectly frames this playful interaction, showing CZ's appreciation for meme culture and community creativity.`
  },
  {
    chapter: "Selfie 2",
    title: "Next Generation Builder",
    image: selfie2,
    content: `CZ poses with a young developer at a BNB Chain event.

This photo represents the future of blockchain - young, enthusiastic builders connecting with industry leaders to shape tomorrow's decentralized world.`
  },
  {
    chapter: "Selfie 3",
    title: "Demo Day Elegance",
    image: selfie3,
    content: `A stylish moment at BNB Chain Demo Day with CZ and a community member in elegant attire.

The casual yet professional atmosphere shows the welcoming nature of the crypto community, where innovation meets inclusivity.`
  },
  {
    chapter: "Selfie 4",
    title: "Office Visit",
    image: selfie4,
    content: `CZ meeting with young enthusiasts in a modern office setting.

These intimate moments in professional spaces show CZ's commitment to engaging with the community beyond conferences and stages.`
  },
  {
    chapter: "Selfie 5",
    title: "Young CZ",
    image: selfie5,
    content: `A throwback photo of young CZ from his early years.

This vintage shot reminds us that every journey starts somewhere - long before Binance, before blockchain, there was a young dreamer with a vision for the future.`
  },
  {
    chapter: "Selfie 6",
    title: "Meeting Room Moments",
    image: selfie6,
    content: `CZ captured during what appears to be a business meeting or presentation.

Behind the scenes at blockchain events, where ideas are shared, partnerships are formed, and the future of crypto is shaped through collaboration.`
  },
  {
    chapter: "Selfie 7",
    title: "Peace and Positivity",
    image: selfie7,
    content: `A cheerful selfie at BNB Chain Demo Day with peace signs all around.

This upbeat moment captures the optimistic spirit of the crypto community - building, connecting, and celebrating together.`
  },
  {
    chapter: "Selfie 8",
    title: "Team Binance",
    image: selfie8,
    content: `CZ with the Binance team - the people who make it all happen.

In matching Binance attire, this group photo celebrates the collaborative effort behind one of the world's leading crypto platforms.`
  },
  {
    chapter: "Selfie 9",
    title: "Conference Connection",
    image: selfie9,
    content: `CZ at a Binance conference with a community member against the iconic yellow backdrop.

These conference moments showcase the accessibility of crypto leaders and the welcoming nature of the Binance ecosystem.`
  },
  {
    chapter: "Selfie 10",
    title: "Meme Magic",
    image: selfie10,
    content: `A creative photo at BNB Chain Demo Day featuring CZ and a community member holding meme art.

This playful moment celebrates the intersection of blockchain technology and internet culture, showing that crypto can be both serious and fun.`
  },
  {
    chapter: "Closing",
    title: "The Collection Continues",
    content: `These 10 selfies represent moments of connection, community, and the accessible spirit of CZ and the Binance ecosystem.

From Demo Days to office visits, from vintage throwbacks to team celebrations, each photo tells a unique story of the people and moments that make up the global crypto community.

This collection showcases the human side of blockchain - real people, real connections, real impact.

Want to contribute? Tag @cz_binance in your selfie and it might be featured in future updates!`
  }
];
