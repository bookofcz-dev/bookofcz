export interface BookPage {
  title: string;
  content: string;
  chapter?: string;
  image?: string;
}

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
import selfie11 from "@/assets/selfie11.jpg";
import selfie12 from "@/assets/selfie12.jpg";
import selfie13 from "@/assets/selfie13.jpg";
import selfie14 from "@/assets/selfie14.jpg";
import selfie15 from "@/assets/selfie15.jpg";
import selfie16 from "@/assets/selfie16.jpg";
import selfie17 from "@/assets/selfie17.jpg";
import selfie18 from "@/assets/selfie18.jpg";
import selfie19 from "@/assets/selfie19.jpg";
import selfie20 from "@/assets/selfie20.jpg";

export const bookContent: BookPage[] = [
  {
    title: "Introducción",
    chapter: "Selfies con CZ",
    content: `De entornos médicos a conferencias, de encuentros casuales a eventos oficiales, estas selfies cuentan historias de conexión, comunidad y el lado humano de las criptomonedas. Experimenta 20 momentos memorables de la comunidad CZ.

Cada foto captura no solo un momento en el tiempo, sino un recordatorio de que detrás de los gráficos, los intercambios y la tecnología blockchain, las criptomonedas son sobre personas. Personas con sueños, historias y un futuro compartido.`
  },
  {
    title: "Selfie 1",
    content: `Un momento capturado con CZ en un entorno médico. Esta foto representa resiliencia y el recordatorio de que incluso los líderes más poderosos son humanos, enfrentando desafíos de salud como todos los demás.`,
    image: selfie1
  },
  // ... more selfies
];