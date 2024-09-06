# Ejercicio - Sistema de Alertas

### Se pide programar un sistema para enviar alertas a usuarios que tenga la siguiente funcionalidad:
1. Se pueden registrar usuarios que recibirán alertas. 
2. Se pueden registrar temas sobre los cuales se enviarán alertas.
3. Los usuarios pueden optar sobre cuales temas quieren recibir alertas.
4. Se puede enviar una alerta sobre un tema y lo reciben todos los usuarios que han optado recibir alertas de ese tema.
5. Se puede enviar una alerta sobre un tema a un usuario específico, solo lo recibe ese único usuario.
6. Una alerta puede tener una fecha y hora de expiración. 
7. Hay dos tipos de alertas: Informativas y Urgentes.
8. Un usuario puede marcar una alerta como leída.
9. Se pueden obtener todas las alertas no expiradas de un usuario que aún no ha leído. 
10. Se pueden obtener todas las alertas no expiradas para un tema. Se informa para cada alerta si es para todos los usuarios o para uno específico.
11. Tanto para el punto 9 como el 10, el ordenamiento de las alertas es el siguiente: las Urgentes van al inicio, siendo la última en llegar la primera en obtenerse (LIFO). Y a continuación las informativas, siendo la primera en llegar la primera en obtenerse (FIFO). Ej: Dadas las siguientes alertas Informativas y Urgentes que llegan en el siguiente orden: I1,I2,U1,I3,U2,I4 se ordenarán de la siguiente forma --> U2,U1,I1,I2,I3,I4

### Aclaraciones importantes:
* La aplicación se ejecuta desde línea de comando. En ningún caso pedimos que escribas código de front end, tampoco que hagas impresiones a la consola
* Debe tener Tests Unitarios.
* No debés hacer ningún tipo de persistencia de datos (base de datos, archivos). Todo debe resolverse con estructuras en memoria.
* Si tenés que hacer algún supuesto sobre algo que no esté claro en el ejercicio, por favor anotalo para que lo tengamos en cuenta al revisar el código.

## Descripcion.
Este sistema de notificaciones gestiona el envío de alertas a usuarios suscriptos a temas específicos, implementando los patrones de diseño *Observer* y *Singleton* para garantizar la correcta administración de suscripciones y notificaciones. El objetivo principal es permitir la entrega eficiente de alertas, respetando la prioridad y el estado de expiración de cada una.
### Patrones de diseño utilizados:
* **Observer**: Este patron lo utilice para gestionar la relación entre usuarios y temas. Los usuarios pueden suscribirse a temas y recibir notificaciones automáticamente cuando se genera una nueva alerta. 
* **Singleton**: Esta implementado en la clase `SistemaNotificaciones`, la cual se encarga de gestionar todas las tareas, registros, suscripciones y alertas.<br>
<br>
Ejecucion del sistema: `node src/index.js`
### Supuestos propios:
En el caso que un usuario se encuentre suscripto en un tema y ya tenga una alerta del tema en cuestion, si se emite una nueva alerta del tema esta la recibe el usuario solo si la prioridad de la nueva alerta es mayor a la que ya habia recibido o si la alerta que habia recibido ya esta expirada, en ambos casos si el usuario recibe la nueva alerta la alerta previa se elimina. 
Tambien se ingreso una metodo para que el usuario pueda preservar las alertas que ya leyó. 

## Ejecución de Tests
Para comprobar el correcto funcionamiento de los casos de uso, se realizaron tests unitarios usando *jest*. <br>
Instalación: `npm install --save-dev jest`.<br>
Ejecución; `npm test`.

# Ejercicio SQL
Escribir una consulta SQL que traiga todos los clientes que han comprado en total más de 100,000$ en los últimos 12 meses usando las siguientes tablas: 
- Clientes: ID, Nombre, Apellido
- Ventas: Fecha, Sucursal, Numero_factura, Importe, Id_cliente
<br>
Consulta: 
```sql 
SELECT C.ID, C.Nombre, C.Apellido, SUM(V.Importe) AS Total_Compras
FROM Clientes C INNER JOIN Ventas V USING(Id_cliente) WHERE V.Fecha >= DATEADD(YEAR, -1, GETDATE())
GROUP BY C.ID, C.Nombre, C.Apellido
HAVING SUM(V.Importe) > 100000
ORDER BY Total_Compras DESC;