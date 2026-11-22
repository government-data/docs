import { abbr } from "../types";

// The abbreviations of the Spanish pages: those of the old glossary, in its
// words, and standard ones in plain words.
export const abbreviations = [
  abbr(
    "ANS",
    "Acuerdo de niveles de servicio",
    "Compromiso medible de tiempo; el ANS de una cola de remediación son los días que hay para corregir sus hallazgos, 30 si nadie fija otro.",
  ),
  abbr(
    "API",
    "Interfaz de programación de aplicaciones",
    "La puerta por la que otros programas hablan con la plataforma; sus propias pantallas también la usan.",
  ),
  abbr(
    "CDE",
    "Elemento crítico de dato",
    "Dato cuyos errores tienen un impacto regulatorio, financiero o comercial material; en Quality Data, un campo con prioridad crítica o alta.",
  ),
  abbr(
    "CIIU",
    "Clasificación Industrial Internacional Uniforme (adaptada para Colombia)",
    "En Colombia, el código de 4 dígitos de una actividad económica.",
  ),
  abbr(
    "CPU",
    "Unidad central de procesamiento",
    "El procesador de un servidor; el instalador pide al menos 2.",
  ),
  abbr(
    "CSRF",
    "Falsificación de petición en sitios cruzados",
    "Un ataque en el que otro sitio web intenta actuar con la sesión de una persona que ya inició sesión; la plataforma lo bloquea con un token guardado en una cookie.",
  ),
  abbr(
    "DAMA",
    "DAMA International (Data Management Association)",
    "La asociación profesional que publica DAMA-DMBOK, el cuerpo de conocimiento de gestión de datos.",
  ),
  abbr(
    "DAMA-DMBOK",
    "Cuerpo de conocimiento de gestión de datos de DAMA International",
    "Marco de gobierno, roles (dueño, custodio) y ciclo de calidad.",
  ),
  abbr(
    "DANE",
    "Departamento Administrativo Nacional de Estadística",
    "La entidad de estadística de Colombia, que expide los códigos DIVIPOLA.",
  ),
  abbr(
    "DN",
    "Nombre distintivo (distinguished name)",
    "El nombre completo de una entrada del directorio de una empresa, como un grupo: CN=Calidad,OU=Grupos,DC=ejemplo,DC=org.",
  ),
  abbr(
    "DIVIPOLA",
    "División Político-Administrativa del DANE",
    "En Colombia, el código de 5 dígitos de un municipio o de 8 de un centro poblado; los 2 primeros son el departamento.",
  ),
  abbr(
    "HTTPS",
    "Protocolo seguro de transferencia de hipertexto",
    "El protocolo web seguro: por él se llega al producto, con el certificado que hace el instalador.",
  ),
  abbr(
    "ICD",
    "Índice de confiabilidad del dato",
    "Puntaje de 0 a 1 para cada campo de cada registro que combina la conformidad con sus propias reglas, la consistencia con otros campos y la actualidad; ponderado por prioridad, da el ICD de un registro y de una entidad.",
  ),
  abbr(
    "IEC",
    "Comisión Electrotécnica Internacional",
    "Organismo internacional de normas; con ISO publica la norma ISO/IEC 25012.",
  ),
  abbr(
    "IGCD",
    "Índice global de calidad de datos",
    "El ICD medio de un dataset en un corte: la cifra que se sigue en el tiempo.",
  ),
  abbr(
    "ISO",
    "Organización Internacional de Normalización",
    "El organismo internacional que publica normas como ISO 8000.",
  ),
  abbr(
    "JSON",
    "JavaScript Object Notation",
    "Un formato de texto plano muy común con el que los programas intercambian datos estructurados.",
  ),
  abbr("KB", "Kilobyte", "Unidad de tamaño de archivo, unos mil bytes."),
  abbr(
    "LDAP",
    "Protocolo ligero de acceso a directorios",
    "La forma estándar de consultar el directorio de usuarios de una organización, para que las personas inicien sesión con la cuenta que ya usan en el trabajo.",
  ),
  abbr(
    "MAD",
    "Desviación absoluta mediana",
    "Qué tan dispersos están los datos alrededor de su valor típico: la mediana de las distancias de cada dato a la mediana. Un valor extremo no la infla, por eso sirve para encontrar atípicos.",
  ),
  abbr(
    "MVP",
    "Producto mínimo viable",
    "La primera versión del servicio que ya produce resultados útiles con datos reales, para validarla antes de construir lo demás.",
  ),
  abbr(
    "NBSP",
    "Espacio de no separación (U+00A0)",
    "Parece un espacio, pero rompe comparaciones y búsquedas.",
  ),
  abbr(
    "OIDC",
    "OpenID Connect",
    "Un estándar para iniciar sesión mediante un proveedor de identidad externo, como la cuenta corporativa de la organización.",
  ),
  abbr(
    "OTP",
    "Código de un solo uso",
    "Se envía a un celular o a un correo para comprobar que la persona realmente lo tiene.",
  ),
  abbr("P99", "Percentil 99", "El valor bajo el cual queda el 99 % de los datos."),
  abbr(
    "PEP",
    "Persona expuesta políticamente",
    "Quien ocupa, o está cerca de, un cargo público destacado; la regulación financiera exige controles reforzados para estas personas.",
  ),
  abbr(
    "PSI",
    "Índice de estabilidad poblacional",
    "Cuánto cambió la distribución de un dato entre dos grupos, comparando su porcentaje en 10 tramos de la base. Menos de 0,10, estable; entre 0,10 y 0,25, cambio moderado que hay que vigilar; más de 0,25, cambio grande: el lote se revisa antes de usarlo.",
  ),
  abbr(
    "RE2",
    "Motor de expresiones regulares de Google",
    "El dialecto en que se escriben las expresiones regulares de las reglas; siempre corre en un tiempo predecible, por eso no tiene referencias hacia atrás ni lookaround.",
  ),
  abbr(
    "S3",
    "Simple Storage Service",
    "La interfaz de Amazon para guardar archivos, que muchos sistemas de almacenamiento (entre ellos RustFS) también ofrecen.",
  ),
  abbr(
    "SARLAFT",
    "Sistema de Administración del Riesgo de Lavado de Activos y Financiación del Terrorismo",
    "El sistema con el que las entidades financieras vigiladas en Colombia gestionan el riesgo de lavado de activos y financiación del terrorismo.",
  ),
  abbr(
    "SFC",
    "Superintendencia Financiera de Colombia",
    "El supervisor financiero de Colombia. Su indicador de calidad de datos aplica solo a las entidades que vigila.",
  ),
  abbr(
    "SIEM",
    "Gestión de información y eventos de seguridad",
    "El sistema donde el equipo de seguridad de una organización reúne y vigila los registros de todas sus aplicaciones.",
  ),
  abbr(
    "SMTP",
    "Protocolo simple de transferencia de correo",
    "El protocolo estándar de correo; por él, el servidor de correo de la organización envía a los colaboradores sus enlaces de activación.",
  ),
  abbr(
    "SQL",
    "Lenguaje de consulta estructurado",
    "El lenguaje estándar para consultar bases de datos; la plataforma convierte cada regla en SQL para el motor que la ejecuta.",
  ),
  abbr(
    "TLS",
    "Seguridad de la capa de transporte",
    "El cifrado que protege los datos que viajan entre dos sistemas; con TLS mutuo, ambos lados demuestran quiénes son con un certificado.",
  ),
  abbr("VM", "Máquina virtual", "Un computador simulado por software sobre un servidor físico."),
  abbr(
    "YAML",
    "YAML Ain't Markup Language",
    "Un formato de texto plano, fácil de leer y escribir para las personas, en el que se escriben las reglas.",
  ),
];
