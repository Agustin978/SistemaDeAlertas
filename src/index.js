const SistemaNotificaciones = require("./services/SIstemaNotificaciones");

const sistema = new SistemaNotificaciones();

//Registro de usuarios
const usuario1 = sistema.registrarUsuario('Agustin', '1234');
const usuario2 = sistema.registrarUsuario('Ignacio', '1234');
const usuario3 = sistema.registrarUsuario('Esteban', 'Quito');

//Registro de Temas
const tema1 = sistema.registrarTema('T1');
const tema2 = sistema.registrarTema('T2');
const tema3 = sistema.registrarTema('T3');
const tema4 = sistema.registrarTema('T4');
const tema5 = sistema.registrarTema('T5');
const tema6 = sistema.registrarTema('T6');
const tema7 = sistema.registrarTema('T7');
const tema8 = sistema.registrarTema('T8');

//Suscripcion de usuario a tema
sistema.suscribeUsuarioEnTema(usuario1.id, tema1.id);
sistema.suscribeUsuarioEnTema(usuario2.id, tema1.id);
sistema.suscribeUsuarioEnTema(usuario3.id, tema1.id);
sistema.suscribeUsuarioEnTema(usuario1.id, tema2.id);

//sistema.suscribeUsuarioEnTema(usuario1.id, tema1.id);
/*
sistema.suscribeUsuarioEnTema(usuario1.id, tema2.id);
sistema.suscribeUsuarioEnTema(usuario1.id, tema3.id);
sistema.suscribeUsuarioEnTema(usuario1.id, tema4.id);
sistema.suscribeUsuarioEnTema(usuario1.id, tema5.id);
sistema.suscribeUsuarioEnTema(usuario1.id, tema6.id);
sistema.suscribeUsuarioEnTema(usuario1.id, tema7.id);
sistema.suscribeUsuarioEnTema(usuario1.id, tema8.id);
sistema.suscribeUsuarioEnTema(usuario3.id, tema3.id);
sistema.suscribeUsuarioEnTema(usuario2.id, tema3.id);
sistema.suscribeUsuarioEnTema(usuario2.id, tema5.id);
sistema.suscribeUsuarioEnTema(usuario2.id, tema1.id);
sistema.suscribeUsuarioEnTema(usuario3.id, tema1.id);
*/
//sistema.suscribeUsuarioEnTema(usuario1.id, tema1.id);



//Declaracion de fechas
const fechaExpira = new Date(Date.now() + 1000 * 60 * 60);
const fechaExpirada = new Date(Date.now() - 1000 * 60 * 60 * 24); //Fecha retrasada por un dia

//Envio de alertas
const alerta1 = sistema.enviarAlerta('Informativa','I1',fechaExpira,tema1.id,usuario1.id);
const alerta2 = sistema.enviarAlerta('Informativa', 'I1', fechaExpirada, tema1.id, usuario2.id);
const alerta3 = sistema.enviarAlerta('Urgente', 'U1', fechaExpira, tema1.id, usuario3.id); 
const alerta4 = sistema.enviarAlerta('Urgente', 'U2', fechaExpira, tema2.id);
/*
const alerta1 = sistema.enviarAlerta('Informativa','I1',fechaExpira,tema1.id,usuario1.id); //Alerta particular a un usuario
const alerta2 = sistema.enviarAlerta('Informativa','I2',fechaExpira,tema2.id,usuario1.id);
const alerta3 = sistema.enviarAlerta('Urgente','U1',fechaExpira,tema3.id); //Alerta para todos los usuarios
const alerta4 = sistema.enviarAlerta('Informativa','I3',fechaExpira,tema4.id,usuario1.id);
const alerta5 = sistema.enviarAlerta('Urgente','U2',fechaExpira,tema5.id,usuario1.id);
const alerta6 = sistema.enviarAlerta('Informativa','I4',fechaExpira,tema6.id,usuario1.id);
const alerta7 = sistema.enviarAlerta('Informativa','I5',fechaExpira,tema5.id,usuario1.id);
const alerta8 = sistema.enviarAlerta('Informativa','I6',fechaExpira,tema1.id,usuario1.id);
*/
//Creacion de alertas de un tema para determinar el punto 10
//sistema.enviarAlerta('Informativa','I1',fechaExpira,tema1.id); //Alerta para todos los usuarios suscriptos a tema1 
//sistema.enviarAlerta('Urgente','I1',fechaExpira,tema1.id, usuario2.id);
//Alerta que se manda a todos los usuarios que se suscriban al tema
/*
const alerta2 = sistema.enviarAlerta('Urgente','U1',fechaExpira, tema2.id);
const alerta3 = sistema.enviarAlerta('Informativa','I2',fechaExpirada,tema3.id);
const alerta4 = sistema.enviarAlerta('Urgente','U1',fechaExpira,tema1.id); */

//Obtener las alertas de los respectivos usuarios
console.log('Alertas no leidas de usuario',usuario1.getNombre(),'\n',sistema.ObtenerAlertasNoLeidasDeUsuario(usuario1.id),'\n==========');
console.log('\nAlertas no leidas de usuario',usuario2.getNombre(),'\n',sistema.ObtenerAlertasNoLeidasDeUsuario(usuario2.id),'\n==========');
console.log('\nAlertas no leidas de usuario',usuario3.getNombre(),'\n',sistema.ObtenerAlertasNoLeidasDeUsuario(usuario3.id),'\n==========');
//console.log('Alertas no leidas de usuario',usuario2.getNombre(),'\n',sistema.ObtenerAlertasNoLeidasDeUsuario(usuario2.id));
//console.log('Alertas no leidas de usuario',usuario3.getNombre(),'\n',sistema.ObtenerAlertasNoLeidasDeUsuario(usuario3.id));

console.log('==========\nAlertas no expiradas de tema ',tema1.titulo,'\n',sistema.ObtenerAlertasNoExpiradasDeTema(tema1.id),'\n==========');
//console.log('Alertas no expiradas de tema ',tema3.titulo,'\n',sistema.ObtenerAlertasNoExpiradasDeTema(tema3.id)); //No me muestra nada ya que la alerta esta expirada

//Un usuario marca una alerta como leida
sistema.marcarAlertaComoLeida(usuario1.id, alerta3.id); //Marca la alerta 1 como leida
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

