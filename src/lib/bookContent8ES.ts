export interface BookPage {
  title: string;
  content: string;
  chapter?: string;
}

export const bookContent: BookPage[] = [
  {
    title: "La Biblia de CZ",
    chapter: "Introducción",
    content: `Bienvenido a la Biblia de CZ—una colección sagrada de sabiduría, enseñanzas y perspectivas del viaje de CZ en el mundo de las criptomonedas y más allá.

Este capítulo exclusivo está protegido por tokens y requiere tener tokens del Libro de CZ en BSC. Es un testimonio de la creencia en el poder de la comunidad y el valor de la información premium.`
  },
  {
    title: "Capítulo 1: Génesis",
    content: `En el principio, había incertidumbre. Los sistemas financieros tradicionales dominaban, pero estaban agrietados, sesgados, controlados por pocos. Entonces surgió Bitcoin—una luz en la oscuridad, un faro de libertad financiera.

CZ vio esta luz y comprendió. No era solo tecnología. Era revolución. Era la oportunidad de reconstruir las finanzas desde cero, justa, transparente, accesible para todos.`
  },
  // ... more chapters
];