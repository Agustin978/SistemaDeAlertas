const SistemaNotificaciones = require("./services/SIstemaNotificaciones");

const sistema = new SistemaNotificaciones();

//Registro de usuarios
const usuario1 = sistema.registrarUsuario('Agustin', '1234');
const usuario2 = sistema.registrarUsuario('Ignacio', '1234');
const usuario3 = sistema.registrarUsuario('Esteban', 'Quito');

//Registro de Temas
const tema1 = sistema.registrarTema('Paro de colectivos');
const tema2 = sistema.registrarTema('Noticia de ultima hora');
const tema3 = sistema.registrarTema('Feriados en Argentina');

//Suscripcion de usuario a tema
/*
Ya no se hace de esta manera
usuario1.suscribeATema(tema1);
usuario1.suscribeATema(tema2);
usuario1.suscribeATema(tema1);
usuario2.suscribeATema(tema1);
usuario2.suscribeATema(tema2);
usuario2.suscribeATema(tema3);
usuario3.suscribeATema(tema2);
usuario3.suscribeATema(tema3);*/

sistema.suscribeUsuarioEnTema(usuario1.id, tema1.id);


//Declaracion de fechas
const fechaExpira = new Date(Date.now() + 1000 * 60 * 60);
const fechaExpirada = new Date(Date.now() - 1000 * 60 * 60 * 24); //Fecha retrasada por un dia

//Envio de alertas
const alerta1 = sistema.enviarAlerta('Informativa','I1',fechaExpira,tema1.id,usuario1.id); //Alerta particular a un usuario
//Alerta que se manda a todos los usuarios que se suscriban al tema
const alerta2 = sistema.enviarAlerta('Urgente','U1',fechaExpira, tema2.id);
const alerta3 = sistema.enviarAlerta('Informativa','I2',fechaExpirada,tema3.id);
const alerta4 = sistema.enviarAlerta('Urgente','U1',fechaExpira,tema1.id); 

//Obtener las alertas de los respectivos usuarios
console.log('Alertas no leidas de usuario',usuario1.getNombre(),'\n',sistema.ObtenerAlertasNoLeidasDeUsuario(usuario1.id));
//console.log('Alertas no leidas de usuario',usuario2.getNombre(),'\n',sistema.ObtenerAlertasNoLeidasDeUsuario(usuario2.id));
//console.log('Alertas no leidas de usuario',usuario3.getNombre(),'\n',sistema.ObtenerAlertasNoLeidasDeUsuario(usuario3.id));

console.log('Alertas no expiradas de tema ',tema1.titulo,'\n',sistema.ObtenerAlertasNoExpiradasDeTema(tema1.id));
//console.log('Alertas no expiradas de tema ',tema3.titulo,'\n',sistema.ObtenerAlertasNoExpiradasDeTema(tema3.id)); //No me muestra nada ya que la alerta esta expirada

//Un usuario marca una alerta como leida
sistema.marcarAlertaComoLeida(usuario1.id, alerta1.id); //Marca la alerta 1 como leida
console.log('Alertas ya leidas del usuario ',usuario1.getNombre(),'\n',sistema.ObtenerAlertasLeidasPorUsuario(usuario1.id));
//Verifico si la alerta anterior ya no se encuentra entre las que faltan leer
console.log('\nAlertas no leidas de usuario',usuario1.getNombre(),'\n',sistema.ObtenerAlertasNoLeidasDeUsuario(usuario1.id));

//Obtener alertas no leidas de un usuario
//console.log('Alertas no leidas de: ',usuario2.getNombre(),'\n', sistema.ObtenerAlertasNoLeidasDeUsuario(usuario2.id));
//console.log('\nAlertas no leidas de: ',usuario1.getNombre(),'\n', sistema.ObtenerAlertasNoLeidasDeUsuario(usuario1.id));
//Obtener alertas no expiradas de un tema
//console.log('Alertas no expiradas de ',tema1.titulo,'\n',sistema.ObtenerAlertasNoExpiradasDeTema(tema1.titulo));

//Envia alerta a un usuario
//console.log('\nSe envia una alerta al usuario: ',usuario1.getNombre(),'\n',sistema.ObtenerAlertasNoLeidasDeUsuario(usuario1.id));

