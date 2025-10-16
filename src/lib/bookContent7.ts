import selfie1 from "@/assets/selfie1.png";
import selfie2 from "@/assets/selfie2.png";
import selfie3 from "@/assets/selfie3.png";
import selfie4 from "@/assets/selfie4.png";
import selfie5 from "@/assets/selfie5.png";
import selfie6 from "@/assets/selfie6.png";
import selfie7 from "@/assets/selfie7.png";
import selfie8 from "@/assets/selfie8.png";
import selfie9 from "@/assets/selfie9.png";
import selfie10 from "@/assets/selfie10.png";

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

From medical settings to conferences, from casual meetups to official events, these selfies tell stories of connection, community, and the human side of crypto.

Each photo represents a moment in time, a memory shared, and the accessibility of a leader who continues to inspire millions globally.

Tap through to explore 10 memorable selfies from the CZ community.`
  },
  {
    chapter: "Selfie 1",
    title: "Medical Setting Moment",
    image: selfie1,
    link: "https://x.com/TheBTCVerse/status/1965047744030191852",
    content: `A real selfie with CZ captured in a medical setting.

This candid photo shows CZ's down-to-earth nature, taking time to connect even in unexpected places.

Posted by: @TheBTCVerse`
  },
  {
    chapter: "Selfie 2",
    title: "Event Gathering",
    image: selfie2,
    link: "https://x.com/Abrlien/status/1917564407883653387",
    content: `Photos from a special event, including a memorable moment with CZ.

These event photos capture the energy and excitement when the crypto community comes together.

Posted by: @Abrlien`
  },
  {
    chapter: "Selfie 3",
    title: "Litecoin Memory Lane",
    image: selfie3,
    link: "https://x.com/litecoin/status/1959799543051989366",
    content: `Litecoin sharing a treasured selfie memory with CZ.

A throwback moment showing the long-standing connections in the crypto ecosystem.

Posted by: @litecoin`
  },
  {
    chapter: "Selfie 4",
    title: "Event Connection",
    image: selfie4,
    link: "https://x.com/ice_z3us/status/1852028431908647189",
    content: `A real photo with CZ captured at a crypto event.

These in-person moments showcase the vibrant community that gathers at blockchain conferences worldwide.

Posted by: @ice_z3us`
  },
  {
    chapter: "Selfie 5",
    title: "Presidential Meeting & Lunch",
    image: selfie5,
    link: "https://x.com/cz_binance/status/1544818369362141184",
    content: `CZ photographed with a president, plus a group lunch photo.

These photos document important diplomatic and business connections in the crypto world.

Posted by: @cz_binance`
  },
  {
    chapter: "Selfie 6",
    title: "Australian GM",
    image: selfie6,
    link: "https://x.com/toastpunk/status/1959852084695798109",
    content: `A cheerful selfie with CZ's famous Australian "GM" (Good Morning).

The crypto community knows CZ for his daily GM tweets - this photo captures that positive energy in person.

Posted by: @toastpunk`
  },
  {
    chapter: "Selfie 7",
    title: "Creative Edit",
    image: selfie7,
    link: "https://x.com/rohelkhan/status/1961281256404001139",
    content: `An edited selfie creation featuring CZ.

The crypto community's creativity shines through in these fun photo edits and tributes.

Posted by: @rohelkhan`
  },
  {
    chapter: "Selfie 8",
    title: "Meme Magic",
    image: selfie8,
    link: "https://x.com/Halou_cto/status/1959837810418131199",
    content: `A meme-style selfie with CZ.

From serious business to internet culture - this photo shows CZ's good humor about memes and community creativity.

Posted by: @Halou_cto`
  },
  {
    chapter: "Selfie 9",
    title: "CZ Statue Selfie",
    image: selfie9,
    link: "https://x.com/Cryptomania____/status/1917224455292297321",
    content: `A photo with the CZ statue at a crypto event.

When your impact is so significant that events feature statues - fans couldn't resist taking selfies with this unique tribute.

Posted by: @Cryptomania____`
  },
  {
    chapter: "Selfie 10",
    title: "Classic CZ Moment",
    image: selfie10,
    link: "https://x.com/cz_binance/status/1622165925662277635",
    content: `A classic photo shared by CZ himself.

These personal shares from CZ give us glimpses into his journey and the people he meets along the way.

Posted by: @cz_binance`
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
