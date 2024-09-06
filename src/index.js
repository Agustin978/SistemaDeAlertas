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

//Suscripcion de usuario a tema
sistema.suscribeUsuarioEnTema(usuario1.id, tema1.id);
sistema.suscribeUsuarioEnTema(usuario1.id, tema2.id);
sistema.suscribeUsuarioEnTema(usuario1.id, tema3.id);

sistema.suscribeUsuarioEnTema(usuario2.id, tema2.id);
sistema.suscribeUsuarioEnTema(usuario2.id, tema3.id);
sistema.suscribeUsuarioEnTema(usuario2.id, tema4.id);

sistema.suscribeUsuarioEnTema(usuario3.id, tema3.id);
sistema.suscribeUsuarioEnTema(usuario3.id, tema4.id);
sistema.suscribeUsuarioEnTema(usuario3.id, tema5.id);

//Declaracion de fechas
const fechaExpira = new Date(Date.now() + 1000 * 60 * 60);
const fechaExpirada = new Date(Date.now() - 1000 * 60 * 60 * 24); //Fecha retrasada por un dia

//Envio de alertas
const alerta1 = sistema.enviarAlerta('Informativa', 'I1', fechaExpira, tema1.id, usuario1.id); //Solo el usuario 1 recibira la alerta
const alerta2 = sistema.enviarAlerta('Urgente', 'U1', fechaExpira, tema2.id); //Alerta para todos, usuario1 y 2
const alerta3 = sistema.enviarAlerta('Informativa', 'I1', fechaExpirada, tema3.id, usuario3.id); //Alerta expirada para el usuario 3
const alerta4 = sistema.enviarAlerta('Urgente', 'U2', fechaExpira, tema3.id); //Alerta urgente para todos los usuarios
const alerta5 = sistema.enviarAlerta('Informativa', 'I1', fechaExpira, tema4.id) //Alerta para usuario 2 y 3
const alerta7 = sistema.enviarAlerta('Informativa', 'I2', fechaExpira, tema5.id, usuario3.id); //Alerta particular par usuario 3

//Muesta de las alertas no leidas de los usuarios
console.log('\n****************Muesta de las alertas no leidas de los usuarios****************\n');
console.log('==========\nAlertas no leidas de usuario',usuario1.getNombre(),'\n',sistema.ObtenerAlertasNoLeidasDeUsuario(usuario1.id),'\n==========');
console.log('==========\nAlertas no leidas de usuario',usuario2.getNombre(),'\n',sistema.ObtenerAlertasNoLeidasDeUsuario(usuario2.id),'\n==========');
console.log('==========\nAlertas no leidas de usuario',usuario3.getNombre(),'\n',sistema.ObtenerAlertasNoLeidasDeUsuario(usuario3.id),'\n==========');

//Muestra de las alertas no expiradas de los temas
console.log('\n****************Muesta de las alertas no expiradas de los temas****************\n');
console.log('==========\nAlertas no expiradas de tema ',tema1.titulo,'\n',sistema.ObtenerAlertasNoExpiradasDeTema(tema1.id),'\n==========');
console.log('==========\nAlertas no expiradas de tema ',tema2.titulo,'\n',sistema.ObtenerAlertasNoExpiradasDeTema(tema2.id),'\n==========');
console.log('==========\nAlertas no expiradas de tema ',tema3.titulo,'\n',sistema.ObtenerAlertasNoExpiradasDeTema(tema3.id),'\n==========');
console.log('==========\nAlertas no expiradas de tema ',tema4.titulo,'\n',sistema.ObtenerAlertasNoExpiradasDeTema(tema4.id),'\n==========');
console.log('==========\nAlertas no expiradas de tema ',tema5.titulo,'\n',sistema.ObtenerAlertasNoExpiradasDeTema(tema5.id),'\n==========');

//Usuario lee una alerta y luego se muestra las alertas no leidas y las ya leidas
console.log('\n********************************\n');
sistema.marcarAlertaComoLeida(usuario1.id, alerta4.id); //Marca la alerta 1 como leida
console.log('==========\nAlertas no leidas de usuario',usuario1.getNombre(),'\n',sistema.ObtenerAlertasNoLeidasDeUsuario(usuario1.id),'\n==========');
console.log('==========\nAlertas ya leidas del usuario ',usuario1.getNombre(),'\n',sistema.ObtenerAlertasLeidasPorUsuario(usuario1.id));
