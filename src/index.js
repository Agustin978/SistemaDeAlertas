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
usuario1.suscribeATema(tema1);
usuario2.suscribeATema(tema1);
usuario2.suscribeATema(tema2);
usuario3.suscribeATema(tema2);
usuario1.suscribeATema(tema2);
usuario1.suscribeATema(tema1);


//Envio de alertas
const fechaExpira = new Date(Date.now() + 1000 * 60 * 60);
const fechaExpirada = new Date(Date.now() - 1000 * 60 * 60 * 24); //Fecha retrasada por un dia
//sistema.enviarAlerta('Informativa', 'Nueva actualizacion disponible.', fechaExpira, tema1.id);
//sistema.enviarAlerta('Urgente', 'Servidor caido.', fechaExpirada, tema2.id);
//sistema.enviarAlerta('Urgente', 'Recibio una actualización.', fechaExpira, tema3.id);
//sistema.enviarAlerta('Informativa', 'Algo extra.', fechaExpira, tema3.id, usuario1.id);
sistema.enviarAlerta('Informativa','I1',fechaExpira,tema1.id,usuario1.id);
sistema.enviarAlerta('Urgente','U1',fechaExpira, tema2.id); //Noticia que se manda a todos los usuarios registrados
console.log('Alertas no leidas de usuario',usuario1.getNombre(),'\n',sistema.ObtenerAlertasNoLeidasDeUsuario(usuario1.id));
console.log('Alertas no leidas de usuario',usuario2.getNombre(),'\n',sistema.ObtenerAlertasNoLeidasDeUsuario(usuario2.id));
console.log('Alertas no leidas de usuario',usuario3.getNombre(),'\n',sistema.ObtenerAlertasNoLeidasDeUsuario(usuario3.id));


//Obtener alertas no leidas de un usuario
//console.log('Alertas no leidas de: ',usuario2.getNombre(),'\n', sistema.ObtenerAlertasNoLeidasDeUsuario(usuario2.id));
//console.log('\nAlertas no leidas de: ',usuario1.getNombre(),'\n', sistema.ObtenerAlertasNoLeidasDeUsuario(usuario1.id));
//Obtener alertas no expiradas de un tema
//console.log('Alertas no expiradas de ',tema1.titulo,'\n',sistema.ObtenerAlertasNoExpiradasDeTema(tema1.titulo));

//Envia alerta a un usuario
//console.log('\nSe envia una alerta al usuario: ',usuario1.getNombre(),'\n',sistema.ObtenerAlertasNoLeidasDeUsuario(usuario1.id));

