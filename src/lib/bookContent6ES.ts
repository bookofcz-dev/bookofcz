export interface BookPage {
  title: string;
  content: string;
  chapter?: string;
}

export const bookContent: BookPage[] = [
  {
    title: "El Nacimiento del FUD",
    chapter: "Capítulo 1: Comprendiendo el FUD",
    content: `FUD—Miedo, Incertidumbre y Duda. En el mundo de las criptomonedas, estas tres palabras representan una de las fuerzas más poderosas que pueden hacer o deshacer proyectos, hundir mercados y destruir confianza en cuestión de horas.

Para CZ y Binance, el FUD no era solo un inconveniente ocasional. Era una batalla constante, una guerra de información que requería vigilancia eterna y respuestas estratégicas. Pero de esta lucha surgió una de las estrategias más efectivas en la historia de las criptomonedas: matar al FUD con hechos, transparencia y construcción incesante.`
  },
  {
    title: "La Filosofía del 4",
    content: `Todo comenzó con una resolución de Año Nuevo. En 2018, CZ tuiteó su plan para el año entrante, y se redujo a un solo carácter: "4"

La comunidad cripto quedó perpleja. ¿Qué significaba? ¿Era un objetivo de precio? ¿Un número de la suerte? ¿Un mensaje cifrado?

CZ explicó: "4" significaba "Ignora el FUD". En chino, el cuatro (四, sì) suena similar a "ignorar" o "no prestar atención". Era su manera de señalar que Binance no se dejaría distraer por negatividad, rumores o ataques. Solo seguirían construyendo.`
  },
  {
    title: "La Naturaleza del FUD",
    content: `El FUD en las criptomonedas viene en muchas formas. Competidores difundiendo rumores. Medios malinterpretando desarrollos. Trolls creando pánico. Reguladores haciendo declaraciones ambiguas. Incluso usuarios bien intencionados amplificando información incorrecta.

Para una plataforma del tamaño de Binance, el FUD era inevitable. Cada decisión sería cuestionada. Cada característica sería criticada. Cada contratiempo sería amplificado. La pregunta no era si el FUD vendría, sino cómo responder a él.`
  },
  // ... more content
];