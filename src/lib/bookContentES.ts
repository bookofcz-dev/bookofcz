export interface BookPage {
  title: string;
  content: string;
  chapter?: string;
  image?: string;
  link?: string;
}

export const bookContent: BookPage[] = [
  // Capítulo 1: Los Comienzos (Páginas 1-15)
  {
    title: "El Comienzo",
    chapter: "Capítulo 1: Orígenes",
    content: `En la bulliciosa ciudad de Lianyungang, provincia de Jiangsu, China, nació un niño en 1977 que un día revolucionaría el mundo de las criptomonedas. Changpeng Zhao, quien más tarde sería conocido simplemente como "CZ", llegó a un mundo al borde de un cambio dramático.

Sus padres eran ambos maestros, educadores dedicados en una nación que aún se recuperaba de tiempos turbulentos. Inculcaron en el joven Changpeng los valores del trabajo duro, la perseverancia y el poder transformador de la educación.`,
  },
  {
    title: "El Exilio del Padre",
    content: `El padre de CZ, Zhao Shengkai, era instructor universitario con ideas progresistas. Poco después del nacimiento de CZ, su padre fue etiquetado como "intelectual pro-burgués" durante las convulsiones políticas de China. Fue exiliado a áreas rurales, un destino común para los intelectuales durante esos tiempos.

Esta temprana adversidad moldeó la visión del mundo de la familia e influiría más tarde en la comprensión de CZ sobre la libertad, la descentralización y la importancia de sistemas que no pudieran ser controlados por autoridades únicas.`,
  },
  {
    title: "El Viaje a Canadá",
    content: `Cuando CZ tenía 12 años, a fines de la década de 1980, su familia tomó una decisión que cambiaría sus vidas. Dejaron todo atrás en China e inmigraron a Canadá, estableciéndose en Vancouver, Columbia Británica.

Este movimiento representó esperanza para un futuro mejor, pero también vino con desafíos inmensos. La familia tuvo que comenzar de nuevo en un país nuevo con un idioma, cultura y oportunidades diferentes.`,
  },
  {
    title: "La Vida en Vancouver",
    content: `Vancouver se convirtió en el telón de fondo de los años formativos de CZ. La ciudad, con su población diversa y vibrante escena tecnológica, resultaría ser el ambiente perfecto para su desarrollo.

La familia enfrentó dificultades financieras, comunes para muchas familias inmigrantes. Pero estaban determinados a que su nueva vida funcionara, y el joven CZ se adaptó rápidamente a su nuevo entorno.`,
  },
  {
    title: "Trabajando en McDonald's",
    content: `Para ayudar a mantener a su familia, el adolescente CZ asumió varios trabajos de servicio. Uno de sus primeros puestos fue en un restaurante McDonald's, volteando hamburguesas y atendiendo clientes.

Esto no era solo un trabajo—era una lección de responsabilidad, servicio al cliente y el valor del trabajo honesto. Años después, como CEO billonario, CZ reflexionaría a menudo sobre estos humildes comienzos.`,
  },
  {
    title: "Los Días en la Gasolinera",
    content: `Junto con sus turnos en McDonald's, CZ también trabajó en una gasolinera. Llueva o haga sol, bombeaba gasolina para los clientes, limpiaba parabrisas y manejaba transacciones.

Estas experiencias le enseñaron resiliencia y la importancia de la perseverancia. Mientras sus compañeros de clase disfrutaban años adolescentes despreocupados, CZ estaba aprendiendo habilidades del mundo real que más tarde lo ayudarían a construir un imperio empresarial.`,
  },
  {
    title: "Sueños de Tecnología",
    content: `A pesar de las largas horas de trabajo, CZ sobresalió en la escuela. Se sintió particularmente atraído por las matemáticas y las ciencias, mostrando aptitud para el pensamiento lógico y la resolución de problemas.

El mundo emergente de las computadoras lo fascinó. A fines de la década de 1980 y principios de 1990, las computadoras personales estaban comenzando a transformar la sociedad, y CZ quería ser parte de esa revolución.`,
  },
  {
    title: "Excelencia Académica",
    content: `El trabajo duro de CZ dio sus frutos. Sus calificaciones eran excepcionales, y demostró un talento particular para las ciencias de la computación. Los maestros notaron su mente analítica y su capacidad para comprender conceptos complejos rápidamente.

El énfasis de sus padres en la educación había echado raíces. CZ entendió que la educación era su camino hacia un futuro mejor, y la persiguió con determinación.`,
  },
  {
    title: "La Decisión de McGill",
    content: `Cuando llegó el momento de la universidad, CZ apuntó alto. Aplicó a la Universidad McGill en Montreal, una de las instituciones más prestigiosas de Canadá, conocida por su sólido programa de ciencias de la computación.

Ser aceptado fue un triunfo, pero también significaba mudarse a una nueva ciudad y asumir la carga financiera de la educación universitaria. CZ no se desanimó—esta era su oportunidad.`,
  },
  {
    title: "La Vida en Montreal",
    content: `Montreal presentó una cara diferente de Canadá—bilingüe, culturalmente rica y con un distintivo sabor europeo. El campus de McGill se convirtió en el nuevo hogar de CZ, donde se sumergió en los estudios de ciencias de la computación.

El plan de estudios era desafiante, cubriendo todo desde algoritmos y estructuras de datos hasta ingeniería de software y arquitectura de sistemas. CZ prosperó en este entorno.`,
  },
  {
    title: "Luchas Universitarias",
    content: `A pesar de su éxito académico, la vida universitaria no fue fácil. CZ continuó trabajando en empleos a tiempo parcial para mantenerse, equilibrando el estudio con el empleo.

Las presiones financieras eran constantes, pero también alimentaban su ambición. No solo quería graduarse—quería sobresalir y crear oportunidades que aseguraran que nunca enfrentaría tales luchas nuevamente.`,
  },
  {
    title: "Noches de Programación",
    content: `CZ pasó incontables noches tardías en los laboratorios de computación, perfeccionando sus habilidades de programación. Aprendió múltiples lenguajes—C++, Java, Python—y desarrolló una comprensión profunda de la arquitectura de sistemas.

Sus profesores reconocieron su talento. No solo estaba memorizando conceptos; estaba entendiendo los principios fundamentales que hacían funcionar los sistemas informáticos.`,
  },
  {
    title: "Oportunidades de Prácticas",
    content: `A medida que avanzaba en su carrera, CZ comenzó a buscar oportunidades de prácticas. Quería experiencia del mundo real, no solo conocimiento académico.

Su búsqueda lo llevó a descubrir oportunidades en tecnología financiera, un campo que combinaba su amor por la programación con el complejo mundo del comercio y los mercados.`,
  },
  {
    title: "Día de Graduación",
    content: `A fines de la década de 1990, CZ se graduó de la Universidad McGill con una Licenciatura en Ciencias de la Computación. Fue un momento orgulloso para él y su familia, validación de años de sacrificio y trabajo duro.

Pero la graduación fue solo el comienzo. Armado con su título y sus habilidades, CZ estaba listo para entrar en el mundo profesional y dejar su marca.`,
  },
  {
    title: "Sueños Post-Universitarios",
    content: `Después de la graduación, CZ se encontró en una encrucijada. Podía seguir un camino de carrera tradicional en desarrollo de software, o podía tomar riesgos y perseguir oportunidades más grandes.

El auge tecnológico de fines de la década de 1990 estaba en pleno apogeo. Internet estaba transformando todas las industrias, y los programadores talentosos tenían gran demanda. CZ sabía que tenía las habilidades—ahora necesitaba la oportunidad correcta.`,
  },

  // Capítulo 2: Carrera Temprana (Páginas 16-30)
  {
    title: "El Llamado de Tokio",
    chapter: "Capítulo 2: El Viaje Profesional",
    content: `Recién salido de McGill, CZ recibió una emocionante oportunidad que lo llevaría a Tokio, Japón. Fue seleccionado para una práctica con un subcontratista de la Bolsa de Valores de Tokio.

Esta fue su entrada al mundo de la tecnología financiera—un campo que definiría gran parte de su carrera. El papel involucraba desarrollar software para emparejar órdenes de comercio, infraestructura crítica para una de las bolsas más grandes del mundo.`,
  },
  {
    title: "Aprendiendo los Mercados Japoneses",
    content: `Tokio fue una revelación. La mezcla de tradición antigua y tecnología de vanguardia de la ciudad fascinó a CZ. Más importante aún, estaba aprendiendo cómo funcionaban los sistemas financieros modernos en su núcleo.

Los sistemas de emparejamiento de operaciones tenían que ser increíblemente rápidos y confiables. Miles de millones de dólares dependían de que estos sistemas se ejecutaran correctamente, cada vez. La precisión requerida era inmensa.`,
  },
  {
    title: "Bloomberg Tradebook",
    content: `Después de su exitosa temporada en Tokio, el talento de CZ llamó la atención de Bloomberg Tradebook, la plataforma de comercio institucional de Bloomberg. Este fue un gran paso—Bloomberg era un gigante en tecnología financiera.

CZ se unió como desarrollador, trabajando en software de comercio de futuros. Este rol lo colocó en la intersección de finanzas y tecnología, exactamente donde quería estar.`,
  },
  {
    title: "El Mundo del Comercio",
    content: `En Bloomberg Tradebook, CZ pasó cuatro años perfeccionando sus habilidades en desarrollo de software financiero. Trabajó en sistemas que ejecutaban millones de operaciones, aprendiendo las complejidades de los mercados de futuros, enrutamiento de órdenes y ejecución de operaciones.

La experiencia fue invaluable. No solo estaba escribiendo código—estaba construyendo sistemas que movían mercados y manejaban sumas enormes de dinero.`,
  },
  {
    title: "Comercio de Alta Frecuencia",
    content: `Durante su tiempo en Bloomberg, CZ se interesó cada vez más en el comercio de alta frecuencia (HFT). Aquí era donde la tecnología y el comercio se encontraban en su punto más intenso—algoritmos realizando miles de operaciones por segundo.

Los requisitos de velocidad eran extraordinarios. Los milisegundos importaban. CZ aprendió a escribir código que no solo era correcto, sino increíblemente rápido.`,
  },
  {
    title: "La Picazón Empresarial",
    content: `A medida que ganaba experiencia, CZ comenzó a sentir la picazón empresarial. Trabajar para empresas establecidas estaba bien, pero soñaba con construir algo propio.

Tenía ideas para mejorar los sistemas de comercio, para hacerlos más rápidos y eficientes. Pero en una gran empresa, la innovación se movía lentamente. Quería la libertad de experimentar y construir.`,
  },
  {
    title: "Mudanza a Shanghái",
    content: `En 2005, CZ tomó una decisión audaz. Dejó Bloomberg y se mudó a Shanghái, China. Después de años en el extranjero, regresaba a su tierra natal—pero esta vez como profesional experimentado con grandes planes.

Shanghái, la capital financiera de China, estaba en auge. La ciudad se estaba modernizando rápidamente, y las oportunidades abundaban para tecnólogos capacitados.`,
  },
  {
    title: "Fusion Systems",
    content: `En Shanghái, CZ fundó su primera empresa: Fusion Systems. Esta era su oportunidad de poner sus ideas en práctica, de construir el tipo de sistemas de comercio que siempre había imaginado.

Fusion Systems se especializó en desarrollar plataformas de comercio de alta frecuencia para corredores de bolsa. Los sistemas de la compañía estaban entre los más rápidos del mercado, capaces de ejecutar operaciones en microsegundos.`,
  },
  {
    title: "Construyendo el Equipo",
    content: `Construir Fusion Systems significó ensamblar un equipo talentoso. CZ reclutó desarrolladores que compartían su pasión por el rendimiento y la precisión.

El trabajo era intenso. Estaban compitiendo con jugadores establecidos que tenían recursos mucho mayores. Pero el equipo de CZ tenía algo especial—tenían velocidad e innovación de su lado.`,
  },
  {
    title: "Éxito en el Mercado",
    content: `Fusion Systems rápidamente ganó tracción. Los corredores de bolsa apreciaron la velocidad y confiabilidad de la plataforma. La reputación de CZ en el mundo del software de comercio estaba creciendo.

Durante varios años, Fusion Systems prosperó. CZ era exitoso por cualquier medida—estaba dirigiendo una empresa tecnológica rentable, trabajando con instituciones financieras importantes y viviendo cómodamente en Shanghái.`,
  },
  {
    title: "El Juego de Póker",
    content: `Una noche en 2013, la vida de CZ cambió para siempre. Estaba jugando póker con amigos, incluyendo a Bobby Lee, cuyo hermano Charlie Lee más tarde crearía Litecoin.

Durante el juego, Bobby mencionó Bitcoin. Explicó el concepto de moneda digital, tecnología blockchain y descentralización. Aconsejó a CZ invertir el 10% de su riqueza en Bitcoin.`,
  },
  {
    title: "La Revelación de Bitcoin",
    content: `CZ estaba intrigado. El concepto de Bitcoin se alineaba con todo lo que había aprendido sobre tecnología y finanzas. Aquí había una moneda que ningún gobierno controlaba, un sistema de pago sin autoridad central.

Como programador, inmediatamente comprendió la elegancia del blockchain. Como alguien que había construido sistemas de comercio, entendió el potencial de disrupción para los mercados financieros.`,
  },
  {
    title: "Apostando Todo",
    content: `Bobby Lee había sugerido invertir el 10% en Bitcoin. Pero CZ no era de medias tintas. Después de investigar Bitcoin extensamente, tomó una decisión que sorprendería a su familia y amigos.

Vendió su apartamento en Shanghái. Convirtió todos sus ahorros. Se "apostó todo" en Bitcoin, invirtiendo casi todo su patrimonio neto en esta moneda digital experimental.`,
  },
  {
    title: "La Preocupación Familiar",
    content: `Su familia pensó que estaba loco. ¿Vender su casa para comprar tokens digitales de los que la mayoría de la gente nunca había oído hablar? Parecía un suicidio financiero.

Pero CZ había hecho su investigación. Entendió tanto la tecnología como el potencial. Creía que Bitcoin representaba un cambio fundamental en cómo funcionaría el dinero en el futuro.`,
  },
  {
    title: "Blockchain.info",
    content: `En 2013, CZ se unió al equipo que desarrollaba Blockchain.info (ahora Blockchain.com), uno de los servicios de billetera Bitcoin más tempranos y populares.

Esta fue su inmersión profunda en criptomonedas. Ya no era solo un inversor—estaba construyendo la infraestructura que apoyaría el creciente ecosistema de Bitcoin.`,
  },

  // Capítulo 3: Expansión y Binance (Páginas 31-44)
  {
    title: "Fundando Binance",
    chapter: "Capítulo 3: El Imperio Cripto",
    content: `En 2017, CZ lanzó Binance, una plataforma de intercambio de criptomonedas que rápidamente se convirtió en la más grande del mundo por volumen de operaciones.

Binance ofrecía una interfaz rápida, tarifas bajas y una amplia variedad de criptomonedas, atrayendo a millones de usuarios globalmente.`,
  },
  {
    title: "Innovación Continua",
    content: `Bajo el liderazgo de CZ, Binance no solo fue un intercambio, sino un ecosistema completo que incluía Binance Smart Chain, servicios de staking, préstamos y más.

La innovación constante mantuvo a Binance a la vanguardia del sector cripto.`,
  },
  {
    title: "Desafíos Regulatorios",
    content: `A medida que Binance crecía, también enfrentó desafíos regulatorios en múltiples países. CZ adoptó un enfoque proactivo, buscando cumplir con las normativas y educar a los reguladores sobre la tecnología blockchain.`,
  },
  {
    title: "Visión para el Futuro",
    content: `CZ continúa impulsando la adopción global de criptomonedas, creyendo en un futuro donde las finanzas sean más accesibles, descentralizadas y transparentes.

Su historia es un testimonio del poder de la innovación, la perseverancia y la visión.`,
  },
];
