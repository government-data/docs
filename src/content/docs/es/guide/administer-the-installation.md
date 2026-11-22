---
title: "Tareas: correo, inicio de sesión y actualizaciones"
description: "El resto de Configuración para quien administra la instalación: el correo saliente, entrar con el directorio de la empresa o con un proveedor externo, las actualizaciones y añadir y aprobar una máquina."
sidebar:
  label: Correo, inicio de sesión y actualizaciones
  order: 2.95
---

**Quién lo hace:** un administrador: una cuenta con el rol
**Administrador**, o una con la política `quality-admin`. Cada tarjeta de
**Configuración** (el menú de arriba a la derecha) aparece solo para quien
puede usarla. Las cuentas, los grupos y las políticas están en [Administrar
usuarios y accesos](../manage-access/).

## Para configurar el correo saliente

Quality Data envía por correo los enlaces que activan cuentas y recuperan
contraseñas, y sus avisos. La instalación no trae servidor de correo
propio: usa el de tu organización. Sin él no se puede crear ninguna cuenta.

1. En **Configuración**, elige **Correo saliente**. La tarjeta dice **Sin
   configurar** hasta que se configura.
2. Activa **Enviar correo** y elige el **Proveedor de correo**: **Office
   365 (Microsoft Graph)** o **Servidor SMTP**, el protocolo estándar de
   correo.
3. Llena los campos; cada uno trae su ayuda.
4. En **Enviar un correo de prueba**, elige **Enviar prueba**: usa lo que
   está en el formulario, aunque no esté guardado.
5. Elige **Guardar**.

**Deberías ver** _Guardado. El correo saliente está activo._, la tarjeta
diciendo **Activo** y el correo de prueba en tu bandeja. En **Recuperar
contraseña**, **El enlace vence en (minutos)** fija cuánto sirve un enlace
de recuperación, de 5 minutos a un día. Con el correo apagado, Quality Data
no envía nada, no se pueden crear cuentas y **¿Olvidaste tu contraseña?**
dice que la recuperación no está disponible.

## Para que se entre con el directorio de la empresa

Las personas pueden entrar con la cuenta que usan en el trabajo, mediante
el directorio de la organización, por LDAP (protocolo ligero de acceso a
directorios), como Active Directory. Las cuentas locales siguen
funcionando. El directorio nombra cada cuenta y cada grupo por su DN
(nombre distintivo), su nombre completo allí.

1. En **Configuración**, elige **LDAP / Active Directory**.
2. Marca **Permitir iniciar sesión con cuentas del directorio**.
3. En **Conexión**, escribe la **URL del servidor**; en **Cuenta de
   servicio**, el **DN de la cuenta** y la **Contraseña** de una cuenta que
   pueda leer el directorio; en **Usuarios y grupos**, la **Base de
   búsqueda (DN)** y el **Filtro de usuario**. Cada campo trae su ayuda;
   pídele los valores al administrador del directorio.
4. En **Grupos de administradores**, escribe los grupos del directorio
   cuyos miembros son Administradores aquí, uno por línea.
5. En **Probar la conexión**, escribe el correo de un colaborador y elige
   **Probar**: muestra su **Correo**, su **Nombre**, si es
   **Administrador** y sus **Grupos directos**, sin revisar ninguna
   contraseña.
6. Elige **Guardar**.

**Deberías ver** _Guardado. El inicio de sesión LDAP ya usa esta
configuración._

Quién puede entrar entonces con el directorio:

- Los miembros de un grupo de **Grupos de administradores**, como
  Administradores.
- Los miembros de un grupo del directorio que esté en los **Grupos del
  directorio** de un grupo
  ([grupos](../manage-access/#para-dar-políticas-a-varias-personas-grupos)),
  como usuarios con las políticas de ese grupo. Copia el DN de cada grupo
  tal como lo muestra **Probar** en **Grupos directos**; los grupos dentro
  de otros grupos no cuentan.
- Nadie más: reciben **Correo o contraseña incorrectos.**, como con una
  contraseña errada.

La nota bajo **Grupos de administradores** todavía dice que solo los
administradores entran con el directorio: los **Grupos del directorio** de
los grupos dejan entrar a otras personas también. Una cuenta del directorio
aparece como **Directorio (LDAP)** en **Usuarios**; el directorio pone su
nombre y su rol en cada inicio de sesión. Un correo que ya tiene cuenta
local sigue entrando con su contraseña local.

## Para que se entre con Microsoft, Google u otro proveedor

Un botón **Continuar con …** en la pantalla de inicio de sesión puede
llevar a un proveedor externo que hable OIDC (OpenID Connect).

1. En **Configuración**, elige **OAuth2 / OIDC**.
2. En **Agregar proveedor**, elige **+ Microsoft Entra ID** (antes escribe
   en la casilla el id del tenant de tu organización), **+ Google** u
   **+ Otro proveedor OIDC**.
3. Copia la **URL de retorno (regístrala en el proveedor)** en la
   configuración de la aplicación en el proveedor, y copia de allá el **Id
   de cliente** y el **Secreto de cliente**.
4. Para otro proveedor, escribe su **Emisor (issuer)** y elige **Descubrir
   endpoints**.
5. Elige **Guardar proveedores**.

**Deberías ver** _Guardado. 1 proveedor activo en el inicio de sesión._ y,
en **Iniciar sesión**, un botón **Continuar con …**. Una persona entra solo
si ya tiene una cuenta con ese correo (cuando el proveedor lo da por
verificado), o después de vincular el proveedor en **Configuración**, **Mi
cuenta**, **Cuentas vinculadas**, **Vincular**.

## Para instalar actualizaciones

En **Configuración**, elige **Actualizaciones**: la **Versión instalada**,
su **Estado**, la **Versión nueva** si la hay con sus **Novedades**, y el
**Historial**. Antes de instalar, Quality Data espera a que terminen las
ejecuciones, respalda su base de datos y, si la versión nueva no arranca,
vuelve sola a la anterior. Durante unos minutos no responde.

- **Ahora:** elige **Actualizar ahora**, lee el diálogo y elige
  **Actualizar**. **Deberías ver** _Pedido enviado: empieza en menos de un
  minuto_, y el avance en todas las pantallas.
- **Cuándo se actualiza:** elige **Con aprobación** (cada versión espera a
  **Actualizar ahora**), **Automática** (se instala sola los **Días**
  elegidos, entre **Desde** y **Hasta**, cuando no hay ejecuciones en curso)
  o **Manual** (se instala en el servidor), fija **Esperar a que terminen
  las ejecuciones hasta (min)** y elige **Guardar**. **Deberías ver**
  _Política guardada_.

## Para añadir una máquina

En **Configuración**, **Ejecución**, elige **Añadir una máquina**, escoge el
**Rol** (por ahora **worker** y **lake-replica** tienen comando de
instalación; los servidores de un pool del lago se añaden en
**Configuración**, **Lago**, más abajo) y, si los usas, un **Pool**. Para **lake-replica**, escribe en
**Discos** la ruta donde está montado cada disco del servidor, una por línea
(cada uno un sistema de archivos propio, montado y vacío), o déjalo vacío y
añade al final del comando `--drive` seguido de cada ruta antes de
ejecutarlo. Elige **Obtener el comando**. **Deberías ver** el
comando con **Copiar**, y hasta cuándo sirve: una hora, una vez. Se muestra
solo esta vez; cópialo antes de **Ya lo copié, cerrar**, o pide uno nuevo.
Quien da soporte a tu instalación lo ejecuta como root en el servidor
nuevo, que luego aparece en la lista **Pendiente de aprobación**. Para otro
rol recibes solo el token, sin comando: aún no hay instalación para ese
rol.

El comando también prepara la máquina para enviar sus métricas al servidor
de observabilidad de tu instalación, que Grafana muestra. Busca la dirección
de ese servidor en el DNS al ejecutarse: si no la encuentra se detiene sin
cambiar nada, y si la dirección cambia después, pide un comando nuevo y
ejecútalo otra vez.

## Para guardar las claves del administrador del lago principal

Cuando quien da soporte a tu instalación levanta el stack del lago, se crea
el usuario administrador del lago principal y se muestran, una sola vez, en
la terminal de ese servidor, una **clave de acceso** (`qd-platform-admin`) y
un **secreto** (64 dígitos hexadecimales), marcados _SHOWN ONLY THIS ONCE_.
No se escriben en ningún archivo ni se vuelven a mostrar, así que te los
pasa enseguida. En **Configuración**, **Lago**, bajo **El usuario
administrador del lago principal**, pégalos en **Clave de acceso** y
**Secreto** y elige **Guardar las claves**. **Deberías ver** _Las claves del
administrador del lago principal están guardadas._ y la clave de acceso y
cuándo se pegó. Encima, **El lago principal** dice si Quality Data llega al
lago con esas claves: **Deberías ver** que responde con las claves
guardadas, y cuántos de sus discos están en línea y fuera de línea. No se
cambia nada en el lago.

## Para definir el pool del lago

Un lago crece por pools de al menos cuatro servidores. Antes de instalar
cualquiera de ellos, en **Configuración**, **Lago**, bajo **El pool del
lago**, escribe en **Servidores** sus nombres, uno por línea, en orden
(letras minúsculas, dígitos y guiones; cada uno debe resolverse en el DNS
desde los demás), y en **Discos por servidor** cuántos discos tiene cada uno
(los mismos en todos). Elige **Guardar el pool**. **Deberías ver** _El pool
main quedó guardado._ y una tabla de los servidores, cada uno _Aún no se ha
unido_. Para un servidor, elige **Comando**, escribe las rutas montadas de
sus discos (tantas como dice el pool) o déjalo vacío, y elige **Obtener el
comando**: se muestra una sola vez, como al añadir una máquina, y nombra a
ese servidor; solo se une con ese nombre. Cuando un servidor se ha unido,
la tabla muestra su estado y los servidores y discos del pool ya no
cambian. El primer pool siempre es **main**; aún no es posible añadir un
segundo.

## Para instalar los servidores del pool del lago

Quien da soporte a tu instalación ejecuta el comando de cada servidor en
ese servidor, como root, un servidor tras otro. El pool se forma cuando
todos están arriba. El **último** servidor de la lista crea el usuario
administrador del lago y muestra sus claves una sola vez, como en "Para
guardar las claves del administrador del lago principal": ejecuta su
comando al final. Si se ejecutó antes de que los demás estuvieran arriba,
lo dice: cuando todos estén arriba, obtén su comando de nuevo y ejecútalo.
Los demás servidores dicen qué servidor crea el usuario.

Cada comando busca en el DNS las direcciones de los otros servidores al
ejecutarse, y deja que solo esas direcciones lleguen al puerto del servidor
para sus pares. Por eso, obtén de nuevo el comando de cada servidor y
ejecútalo cuando:

- cambia la dirección de un servidor, en todos los demás;
- la réplica del lago se une después de los servidores del pool, en todos,
  para que cada uno copie hacia ella;
- un servidor se reinicia, en ese servidor: hasta que esta versión
  conserve sus reglas tras un reinicio, el puerto vuelve a quedar abierto a
  cualquier dirección, aunque solo para máquinas con un certificado de tu
  instalación.

Ejecutar un comando de nuevo no cambia nada de lo que ya está en su sitio.

## Para guardar las claves del administrador de la réplica del lago

Cuando el comando de **lake-replica** arranca la réplica, crea el usuario
administrador del lago y muestra una sola vez, en la terminal de ese
servidor, una **clave de acceso** (`qd-platform-admin`) y un **secreto**
(64 dígitos hexadecimales), marcados _SHOWN ONLY THIS ONCE_. No se escriben
en ningún archivo y el comando no los vuelve a mostrar, así que quien lo
ejecuta te los pasa enseguida. En **Configuración**, **Lago**, pégalos en
**Clave de acceso** y **Secreto** y elige **Guardar las claves**. **Deberías
ver** _Las claves del administrador de la réplica están guardadas._ y, sobre
el formulario, la clave de acceso y cuándo se pegó. El secreto no se vuelve
a mostrar, ni aquí ni en ningún sitio; pegar las claves de nuevo las
reemplaza.

Sobre el formulario, **La réplica** dice si Quality Data llega a la réplica
con esas claves: una vez aprobada la réplica en **Ejecución** y guardadas
las claves, **Deberías ver** el nombre de la réplica, que responde con las
claves guardadas y cuántos de sus discos están en línea y fuera de línea.
Elige **Consultar de nuevo** para consultarla ahora. No se cambia nada en
la réplica.

## Para ver la replicación del lago

Cuando están guardadas las claves de administración del lago principal,
Quality Data crea en él el almacén de la instalación si falta, antes de
que haya ninguna réplica. Cuando también están las de la réplica y esta
está aprobada, configura el lago principal para copiar
el almacén en la réplica, donde cada objeto se guarda 30
días y nadie, ni siquiera un administrador, puede borrarlo ni acortar ese
plazo; las versiones antiguas del lago principal se eliminan a los 7 días.
Lo hace al guardar claves y cada hora, y no cambia nada cuando todo ya está
en su sitio. En **Configuración**, **Lago**, **La replicación** dice si está
lista y lista cada almacén: **Deberías ver** _Configurado desde el_ y una
fecha en cada uno. Hasta que estén la réplica y sus claves, un almacén
muestra _Creado en el lago principal; su replicación espera a la réplica y
sus claves_. Elige **Consultar de nuevo** para leerlo ahora.

## Para aprobar una máquina

Las máquinas que hacen el trabajo pesado se unen a la instalación desde su
propio servidor, que monta quien da soporte a tu instalación con el comando
de arriba. En **Configuración**, **Ejecución** las lista. Una nueva aparece **Pendiente de
aprobación** y no recibe trabajo hasta que eliges **Aprobar**. **Vaciar**
deja que una termine lo que tiene sin recibir nada nuevo; **Retirar** la
saca para siempre, después de confirmar.

## Problemas

| Lo que ves                                                                                                    | Qué significa y qué hacer                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| No hay tarjeta de correo, directorio o inicio de sesión externo en **Configuración**                          | Tus políticas no permiten configurarlos.                                                                                                         |
| **Conexión correcta, pero el filtro no encontró a ese usuario.**                                              | Revisa el **Filtro de usuario** y la **Base de búsqueda (DN)**.                                                                                  |
| Un colaborador del directorio recibe **Correo o contraseña incorrectos.** con la contraseña correcta          | Ninguno de sus grupos directos está en **Grupos de administradores** ni en los **Grupos del directorio** de un grupo.                            |
| **El directorio no responde. Inténtalo más tarde.**, en **Iniciar sesión**                                    | Quality Data no llega al directorio: revisa la **URL del servidor** y la red.                                                                    |
| **No se pudo entrar con el proveedor. …**                                                                     | Casi siempre ninguna cuenta tiene ese correo: la persona entra con contraseña y vincula el proveedor.                                            |
| **Actualizaciones** dice **Sin servicio** o **No responde**                                                   | El servicio de actualizaciones del servidor no está corriendo. Avísale a quien da soporte a tu instalación.                                      |
| **Actualizaciones** dice **Esta instalación no se actualiza desde aquí …**                                    | Se actualiza de otra forma: pregúntale a quien da soporte a tu instalación.                                                                      |
| **Esta instalación aún no tiene autoridad de certificación: ninguna máquina puede unirse.**, en **Ejecución** | Todavía no se pueden unir máquinas. Pregúntale a quien da soporte a tu instalación.                                                              |
| **Cada disco es una ruta absoluta …**, bajo **Discos**                                                        | Una ruta empieza por `/` y solo lleva letras, dígitos, `.`, `_`, `-` y `/`, como `/srv/disk1`.                                                   |
| **El secreto son los 64 dígitos hexadecimales que join.sh mostró …**, bajo **Secreto**                        | Pega el secreto entero, tal como se mostró, sin otros caracteres.                                                                                |
| Las claves del administrador de la réplica se perdieron antes de pegarlas                                     | El comando no las vuelve a mostrar. Pregúntale a quien da soporte a tu instalación.                                                              |
| **… rechaza las claves guardadas …**, bajo **La réplica**                                                     | Las claves pegadas no son las de la réplica: pega de nuevo las que mostró su comando.                                                            |
| **No se pudo llegar a …**, bajo **La réplica**                                                                | Quality Data no llega al servidor de la réplica. Avísale a quien da soporte a tu instalación lo que dice.                                        |
| **Hay más de una réplica aprobada …**, bajo **La réplica**                                                    | Retira en **Ejecución** las máquinas que no son la réplica.                                                                                      |
| **El lago principal rechaza las claves guardadas …**, bajo **El lago principal**                              | Las claves pegadas no son las del lago principal: pega de nuevo las que se mostraron al levantar su stack.                                       |
| **No se pudo llegar al lago principal …**, bajo **El lago principal**                                         | Quality Data no llega al lago. Avísale a quien da soporte a tu instalación lo que dice.                                                          |
| **Esta instalación no llega a ningún lago …**, bajo **El lago principal**                                     | Avísale a quien da soporte a tu instalación.                                                                                                     |
| **Falló en …**, bajo **La replicación**                                                                       | El paso nombrado fue rechazado o no se alcanzó. Se vuelve a intentar cada hora; si sigue, avisa a quien da soporte a tu instalación lo que dice. |

## A dónde ir después

- [Administrar usuarios y accesos](../manage-access/) y [Datos personales y
  el rastro de auditoría](../personal-data-and-audit/).
- [Primeros pasos: administrador](../start-admin/): instalar el producto.
