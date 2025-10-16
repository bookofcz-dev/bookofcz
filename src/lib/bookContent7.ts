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
    chapter: "Introduction",
    title: "Selfies with CZ: A Collection",
    content: `Welcome to "Selfies with CZ" - a unique collection capturing moments when people around the world met and photographed with CZ, the founder of Binance.

From conference halls to medical settings, from presidential meetings to casual encounters, these selfies tell stories of connection, community, and the human side of crypto.

Each photo represents a moment in time, a memory shared, and the accessibility of a leader who continues to inspire millions globally.

Tap through to explore these memorable selfies from the CZ community.`
  },
  {
    chapter: "Selfie 1",
    title: "Binance Conference",
    image: selfie1,
    link: "https://x.com/TheBTCVerse/status/1965047744030191852",
    content: `A selfie with CZ at a Binance conference event.

The bright yellow Binance branding sets the stage for this energetic moment captured at a major crypto conference.

Posted by: @TheBTCVerse`
  },
  {
    chapter: "Selfie 2",
    title: "Virtual Meeting",
    image: selfie2,
    link: "https://x.com/Abrlien/status/1917564407883653387",
    content: `A creative selfie with CZ appearing on screen during a virtual meeting.

Even in the digital age, fans find unique ways to capture their connection with CZ.

Posted by: @Abrlien`
  },
  {
    chapter: "Selfie 3",
    title: "Presidential Meeting",
    image: selfie3,
    link: "https://x.com/cz_binance/status/1544818369362141184",
    content: `CZ photographed with a president in an official diplomatic setting.

This photo documents important high-level connections and the growing recognition of crypto at the government level.

Posted by: @cz_binance`
  },
  {
    chapter: "Selfie 4",
    title: "Blockchain Event",
    image: selfie4,
    link: "https://x.com/ice_z3us/status/1852028431908647189",
    content: `A photo with CZ at a blockchain conference featuring Tron, Solana, and Binance branding.

These multi-chain events showcase the collaborative spirit of the crypto ecosystem.

Posted by: @ice_z3us`
  },
  {
    chapter: "Selfie 5",
    title: "Litecoin Tribute",
    image: selfie5,
    link: "https://x.com/litecoin/status/1959799543051989366",
    content: `CZ showing love for Litecoin with a playful hand gesture.

A fun moment showing CZ's appreciation for the broader crypto community and different blockchain projects.

Posted by: @litecoin`
  },
  {
    chapter: "Selfie 6",
    title: "Middle East Connection",
    image: selfie6,
    link: "https://x.com/toastpunk/status/1959852084695798109",
    content: `CZ meeting with crypto enthusiasts in the Middle East.

This photo represents Binance's global reach and commitment to building bridges across different regions.

Posted by: @toastpunk`
  },
  {
    chapter: "Selfie 7",
    title: "Medical Setting",
    image: selfie7,
    link: "https://x.com/rohelkhan/status/1961281256404001139",
    content: `A heartwarming selfie with CZ captured in a medical setting.

This candid photo shows CZ's down-to-earth nature, taking time to connect even in unexpected places.

Posted by: @rohelkhan`
  },
  {
    chapter: "Closing",
    title: "To Be Continued...",
    content: `This is just the beginning of our selfie collection!

We're gathering more selfies with CZ from across the globe. The goal is to showcase 44 memorable moments from the community.

Each selfie tells a story of connection, inspiration, and the human side of the crypto revolution.

Stay tuned for more additions to this growing collection.

Want to contribute? Tag @cz_binance in your selfie and it might be featured in future updates!`
  }
];
