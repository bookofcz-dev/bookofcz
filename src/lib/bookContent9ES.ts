export interface BookPage {
  title: string;
  content: string;
  chapter?: string;
}

import bookCover from "@/assets/book9-cover.png";

export const bookContent: BookPage[] = [
  {
    title: "Por Qué Importa Bitcoin",
    chapter: "Capítulo 1: Los Fundamentos",
    content: `Bitcoin no es solo otra moneda digital. Es una revolución fundamental en cómo pensamos sobre el dinero, el valor y la libertad financiera. CZ lo entendió antes que la mayoría, y su creencia en Bitcoin ha moldeado toda su carrera.

"Bitcoin es la forma más pura de criptomoneda", dice CZ a menudo. "Es descentralizado, transparente y no puede ser controlado por ningún gobierno o corporación. Eso es lo que lo hace especial."

Pero entender Bitcoin requiere ir más allá del bombo. Requiere comprender por qué fue creado, qué problemas resuelve y por qué educar a la gente sobre él es una de las misiones más importantes de nuestro tiempo.`
  },
  {
    title: "El Problema con el Dinero Tradicional",
    content: `Para apreciar Bitcoin, primero debes entender lo que está mal con el dinero tradicional. El dinero fiat—dólares, euros, yuanes—es controlado por gobiernos y bancos centrales. Pueden imprimir más cuando quieran, diluyendo el valor de tus ahorros.

La inflación no es un accidente. Es una característica del diseño del dinero fiat. Tus ahorros pierden poder adquisitivo cada año. Tus $100 de hoy valdrán menos el próximo año. Esta es una transferencia silenciosa de riqueza de los ahorradores a los gobiernos.

Bitcoin ofrece una alternativa. Su suministro está fijado en 21 millones de monedas. Nadie puede imprimir más. Nadie puede inflarlo. Es dinero sólido para la era digital.`
  },
  {
    title: "Descentralización: El Superpoder de Bitcoin",
    content: `La característica más poderosa de Bitcoin no es su precio o su tecnología—es su descentralización. Ninguna entidad controla Bitcoin. Ni siquiera su creador, Satoshi Nakamoto, puede cambiarlo.

Esta descentralización hace a Bitcoin resistente a la censura, confiscación y manipulación. Los gobiernos no pueden apagarlo. Los bancos no pueden bloquearlo. Las corporaciones no pueden controlarlo.

Para CZ, quien creció viendo a su padre ser perseguido por el gobierno chino, esta descentralización no es solo una característica técnica. Es libertad. Es el poder de controlar tu propio destino financiero.`
  },
  {
    title: "La Visión de CZ para la Educación en Bitcoin",
    content: `CZ cree que educar a la gente sobre Bitcoin es crucial para la adopción masiva. "Demasiada gente ve Bitcoin solo como una forma de hacerse rico rápido", dice. "Necesitan entender la tecnología, los principios, el por qué importa."

Esta creencia impulsó su apoyo a Giggle Academy y otras iniciativas educativas. La educación no es solo sobre enseñar a la gente a comerciar—es sobre enseñarles a pensar diferente sobre el dinero.

Bitcoin representa un cambio fundamental en nuestra relación con el dinero. Entender este cambio es la clave para participar en la revolución financiera que viene.`
  },
  // ... 40 more pages about Bitcoin education
];

export const title = "Libro de CZ: Educando Sobre Bitcoin";
export const coverImage = bookCover;