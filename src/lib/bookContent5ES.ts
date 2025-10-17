export interface BookPage {
  title: string;
  content: string;
  chapter?: string;
}

export const bookContent: BookPage[] = [
  {
    title: "Los Co-Fundadores",
    chapter: "Capítulo 1: Orígenes",
    content: `CZ (Changpeng Zhao) y Yi He son los co-fundadores de Binance, el intercambio de criptomonedas más grande del mundo. Yi He sirve como Directora de Marketing y Jefa de Binance Labs.

Antes de Binance, Yi He trabajó en OKCoin, uno de los primeros intercambios de criptomonedas de China, donde ganó experiencia en marketing cripto y construcción de comunidades. CZ previamente había trabajado en Blockchain.info y OKCoin, desarrollando experiencia en sistemas de comercio.`
  },
  {
    title: "Asociación Profesional",
    content: `Yi He y CZ formaron una asociación profesional que resultaría transformadora para la industria de las criptomonedas. Sus habilidades complementarias—la experiencia técnica de CZ y la perspicacia en marketing de Yi He—crearon una base sólida para construir un intercambio global.

Más allá de la colaboración profesional, son compañeros de vida. Yi He ha confirmado públicamente su relación en entrevistas, señalando que tienen hijos juntos mientras mantienen privacidad sobre su vida familiar.`
  },
  {
    title: "Más que Negocios",
    chapter: "Capítulo 1.5: Conexión Personal",
    content: `En una entrevista de Bloomberg de 2023, Yi He abordó su relación públicamente, declarando: "Yo traje a CZ al mundo cripto." Enfatizó que su asociación es tanto profesional como personal, distinguiéndola de otras relaciones cripto.

"Somos socios y tenemos hijos juntos", confirmó Yi He, mientras notaba que mantienen asuntos familiares privados para proteger a sus hijos y mantener límites entre trabajo y vida.`
  },
  // ... more content
];