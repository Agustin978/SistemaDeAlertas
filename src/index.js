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

//Envio de alertas
sistema.enviarAlerta('Informativa', 'Nueva actualizacion disponible.', new Date(Date.now() + 1000 * 60 * 60), tema1.id);
sistema.enviarAlerta('Urgente', 'Servidor caido.', new Date(Date.now() + 1000 * 60 * 60), tema2.id);

//Obtener alertas no leidas de un usuario
console.log('Alertas no leidas de: ',usuario2.getNombre(),'\n', sistema.ObtenerAlertasNoLeidasDeUsuario(usuario2.id));
//Obtener alertas no expiradas de un tema
console.log('Alertas no expiradas de ',tema1.titulo,'\n',sistema.ObtenerAlertasNoExpiradasDeTema(tema1.titulo));