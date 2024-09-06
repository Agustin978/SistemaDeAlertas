const { Alerta, AlertaUrgente, AlertaInformativa } = require("../models/Alerta");
const Tema = require("../models/Tema");
const Usuario = require("../models/Usuario");
const SistemaNotificaciones = require("../services/SIstemaNotificaciones");

describe('SistemaNotificaciones - Registro de usuario', ()=>{
    let sistema;

    beforeEach(() => {
        sistema = new SistemaNotificaciones();
    });

    test('Debe registrar correctamente a un usuario', () => {
        const nombre = 'Agustin';
        const password = '1234';
        const usuarioRegistrado = sistema.registrarUsuario(nombre, password);
        //Verifico que el usuario se cree correctamente
        expect(usuarioRegistrado).toBeInstanceOf(Usuario);
        expect(usuarioRegistrado.getNombre()).toBe(nombre);
        //Ahora verificamos que el usuario haya sido agregado a la lista de usuarios del sistema
        expect(sistema.usuarios.length).toBe(1);
        expect(sistema.usuarios[0]).toBe(usuarioRegistrado);
    });

    test('El sistema debe asignar un id unico para cada usuario registrado', () =>{
        const usuario1 = sistema.registrarUsuario('Usuario1', '1234');
        const usuario2 = sistema.registrarUsuario('Usuario2', '1234');
        //Verificamos que los ids sean diferentes
        expect(usuario1.id).not.toBe(usuario2.id);
    });
});

describe('SistemaNotificaciones - Registro de Tema', ()=>{
    let sistema;
    beforeEach(() => {
        sistema = new SistemaNotificaciones();
    });
    
    test('Debe registrar correctamente un tema',() => {
        const tituloTema = 'Tema de Prueba';
        const tema = sistema.registrarTema(tituloTema);
        //Verifica que el tema se creo correctamente
        expect(tema).toBeInstanceOf(Tema);
        expect(tema.obtenerTitulo()).toBe(tituloTema);
        //Verificamos si el tema se encuentra en la lista de temas del sistema
        expect(sistema.temas).toContain(tema);
    });

    test('Debe asignar un id unico a cada tema registrado.',() => {
        const tema1 = sistema.registrarTema('Tema1');
        const tema2 = sistema.registrarTema('Tema2');
        //Verifica que los ids sean diferentes.
        expect(tema1.id).not.toBe(tema2.id);
    });
});

describe('SistemaNotificaciones - Suscribir un usuario en un tema', () => {
    let sistema;
    beforeEach(() => {
        sistema = new SistemaNotificaciones();
    });

    test('Deberia suscribir a un usuario en un tema correctamente.', () => {
        const usuario = sistema.registrarUsuario('Agustin', '1234');
        const tema = sistema.registrarTema('Titulo tema');
        const respuesta = sistema.suscribeUsuarioEnTema(usuario.id, tema.id);
        //Verificamos caso de exito, que la respuesta sea 200
        expect(respuesta).toBe(200);
        //Ahora verificamos si el usuario esta suscripto al tema
        expect(tema.verificaUsuarioSuscrito(usuario)).toBe(true);
    });

    //Tests para manejo de errores
    test('Deberia manejar correctamente el caso de un usuario que se quiere suscribir por segunda vez a un tema.',() => {
        const usuario = sistema.registrarUsuario('Agustin', '1234');
        const tema = sistema.registrarTema('Titulo tema');

        sistema.suscribeUsuarioEnTema(usuario.id, tema.id); //Realiza una primera suscripcion
        let respuesta = sistema.suscribeUsuarioEnTema(usuario.id, tema.id); //Intenta realizar una segunda suscripcion

        expect(respuesta).toBeUndefined() //No se espera que haya una respuesta ya que el usuario ya estaba inscripto
        expect(tema.observers.length).toBe(1) //Ya que no se ingresara el usurio como observador (o suscripto) del tema
    });

    test('Deberia manejar el error en caso que el tema no exista.',() => {
        const usuario = sistema.registrarUsuario('Agustin', '1234');
        
        //Suscribo al usuario a un tema inexistente
        const respuesta = sistema.suscribeUsuarioEnTema(usuario.id, 999);
        expect(respuesta).toBeUndefined(); //No se espera un valor ya que el tema no existe.
    });

    test('Deberia manejar el error en caso que el usuario no existe.', () => {
        const tema = sistema.registrarTema('Titulo tema');

        //Intento suscribir un usuario inexistente en el tema
        const respuesta = sistema.suscribeUsuarioEnTema(999, tema.id);
        expect(respuesta).toBeUndefined(); //No se espera un valor ya que el usuario no existe.
    });
});

describe('SistemaNotificaciones - Enviar alerta a uno o a todos los usuarios suscriptos en un tema',() => {
    let sistema;
    beforeEach(() => {
        sistema = new SistemaNotificaciones();
    });

    test('Deberia enviar una alerta a un unico usuario suscrito a un tema correctamente.', () => {
        const usuario = sistema.registrarUsuario('Agustin', '1234');
        const tema = sistema.registrarTema('Titulo tema');
        const fechaExpira = new Date(Date.now() + 1000 * 60 * 60);
        sistema.suscribeUsuarioEnTema(usuario.id, tema.id);
        const respuesta = sistema.enviarAlerta('Urgente', 'U1', fechaExpira, tema.id, usuario.id);

        //Verificamos que la alerta se haya creado
        expect(respuesta).toBeInstanceOf(Alerta);
        //Verifico que el id del tema de la alerta coincida con el id del tema enviado
        expect(respuesta.temaID).toBe(tema.id);
        //Verificamos que la alerta sea solo para un usuario
        expect(respuesta.usuarioParticular).toBe(usuario.id);
        //Verificamos que el usuario contenga la alerta
        expect(usuario.alertasNoLeidas).toContain(respuesta);
    });

    test('Deberia enviar la alerta a todos los usuarios suscriptos al tema',() => {
        const usuario1 = sistema.registrarUsuario('Usuario1', '1234');
        const usuario2 = sistema.registrarUsuario('Usuario2', '1234');
        const tema = sistema.registrarTema('Titulo tema');
        const fechaExpira = new Date(Date.now() + 1000 * 60 * 60);
        sistema.suscribeUsuarioEnTema(usuario1.id, tema.id);
        sistema.suscribeUsuarioEnTema(usuario2.id, tema.id);

        //Envio la alerta sin id de usuario para que la reciban todos los usuarios suscriptos al tema
        const respuesta = sistema.enviarAlerta('Urgente', 'U1', fechaExpira, tema.id);
        //Verifico la creacion de la alerta
        expect(respuesta).toBeInstanceOf(Alerta);
        //Verifico que el id del tema de la alerta coincida con el id del tema enviado
        expect(respuesta.temaID).toBe(tema.id);
        //Verifico que la alerta este marcada para todos los usuarios
        expect(respuesta.usuarioParticular).toBe(null);
        expect(respuesta.paraTodos).toBe(true);
        //Verifico que la alerta se encuentre en ambos usuarios
        expect(usuario1.alertasNoLeidas).toContain(respuesta);
        expect(usuario2.alertasNoLeidas).toContain(respuesta);
    });

    test('Debe manejar correctamente el caso de la creacion de una alerta para un usuario que no esta suscripto en un tema.',() => {
        const usuario = sistema.registrarUsuario('Usuario1', '1234');
        const tema = sistema.registrarTema('Titulo tema');
        const fechaExpira = new Date(Date.now() + 1000 * 60 * 60);
        const respuesta = sistema.enviarAlerta('Urgente', 'U1', fechaExpira, tema.id, usuario.id);
        
        //Verifico que el usuario no esta suscripto al tema
        expect(tema.observers).not.toContain(usuario);
        expect(respuesta).toBeUndefined(); //No se espera un valor ya que el usuario no esta suscripto al tema
        expect(usuario.alertasNoLeidas.length).toBe(0) //Como no se creo la alerta no se deberia haber ingresado nada
    });

    test('Debe manejar correctamente el caso de la creacion de una alerta para un usuario inexistente.', () => {
        const tema = sistema.registrarTema('Titulo tema');
        const fechaExpira = new Date(Date.now() + 1000 * 60 * 60);
        const respuesta = sistema.enviarAlerta('Urgente', 'U1', fechaExpira, tema.id, 999); //Envio el id de un usuario que no existe

        expect(respuesta).toBeUndefined(); //No se espera un valor ya que el usuario no existe
    });

    test('Debe manejar correctamente el caso de la creacion de una alerta para un tema inexistente.', () => {
        const fechaExpira = new Date(Date.now() + 1000 * 60 * 60);
        const respuesta = sistema.enviarAlerta('Urgente', 'U1', fechaExpira, 999); //Se envia un alerta para el id de un tema que no existe

        expect(respuesta).toBeUndefined(); //No se espera un valor ya que el tema no existe
    });
    
    test('Un usuario inscripto en un tema no debe recibir mas de una alerta del mismo tema', () => {
        const usuario = sistema.registrarUsuario('Usuario1', '1234');
        const tema = sistema.registrarTema('Titulo tema');
        sistema.suscribeUsuarioEnTema(usuario.id, tema.id);
        const fechaExpira = new Date(Date.now() + 1000 * 60 * 60);
        const alerta1 = sistema.enviarAlerta('Informativa', 'I1', fechaExpira, tema.id, usuario.id); //Envia una alerta particular para el usuario suscrito
        const alerta2 = sistema.enviarAlerta('Informativa', 'I1', fechaExpira, tema.id); //Envia una alerta a todos los usuarios suscritos

        //Verifico que ambas alertas se crean
        expect(alerta1).toBeInstanceOf(Alerta);
        expect(alerta2).toBeInstanceOf(Alerta);
        //Verifico que el usuario solo se queda con una alerta
        expect(usuario.alertasNoLeidas).toContain(alerta1);
        expect(usuario.alertasNoLeidas).not.toContain(alerta2);
    });
});

describe('SistemaNotificaciones - Obtener las alertas no expiradas y no leidas por un usuario.', () => {
    let sistema;
    beforeEach(() => {
        sistema = new SistemaNotificaciones();
    });

    test('Se deben obtener las alertas no leidas de un usuario mostrando primero las urgentes (con orden LIFO) y luego las informativas (con orden FIFO).', () => {
        //Se registra un usuario
        const usuario = sistema.registrarUsuario('Usuario1', '1234');
        //Registro temas
        const tema1 = sistema.registrarTema('T1');
        const tema2 = sistema.registrarTema('T2');
        const tema3 = sistema.registrarTema('T3');
        const tema4 = sistema.registrarTema('T4');
        const tema5 = sistema.registrarTema('T5');
        const tema6 = sistema.registrarTema('T6');
        const tema7 = sistema.registrarTema('T7');
        //Suscribo al usuario al tema
        sistema.suscribeUsuarioEnTema(usuario.id, tema1.id);
        sistema.suscribeUsuarioEnTema(usuario.id, tema2.id);
        sistema.suscribeUsuarioEnTema(usuario.id, tema3.id);
        sistema.suscribeUsuarioEnTema(usuario.id, tema4.id);
        sistema.suscribeUsuarioEnTema(usuario.id, tema5.id);
        sistema.suscribeUsuarioEnTema(usuario.id, tema6.id);
        sistema.suscribeUsuarioEnTema(usuario.id, tema7.id);
        //Creo las alertas de cada tema
        const fechaExpira = new Date(Date.now() + 1000 * 60 * 60);
        const alerta1 = sistema.enviarAlerta('Informativa','I1',fechaExpira,tema1.id);
        const alerta2 = sistema.enviarAlerta('Informativa','I2',fechaExpira,tema2.id);
        const alerta3 = sistema.enviarAlerta('Urgente','U1',fechaExpira,tema3.id);
        const alerta4 = sistema.enviarAlerta('Urgente', 'U2', fechaExpira, tema7.id);
        const alerta5 = sistema.enviarAlerta('Informativa','I3',fechaExpira,tema4.id);
        const alerta6 = sistema.enviarAlerta('Urgente','U3',fechaExpira,tema5.id);
        const alerta7 = sistema.enviarAlerta('Informativa','I4',fechaExpira,tema6.id);

        //Marco la alerta 4 como leida
        sistema.marcarAlertaComoLeida(usuario.id, alerta4.id);
        //Obtengo las alertas no leidas por el usuario
        const alertasNoLeidas = sistema.ObtenerAlertasNoLeidasDeUsuario(usuario.id);

        //Verifico que solo se obtengan las alertas no leidas
        expect(alertasNoLeidas).not.toContain(alerta4);
        expect(alertasNoLeidas.length).toBe(6);

        //Controlo como me retorno el orden del arreglo de alertas no leidas y que las mismas no esten expiradas
        expect(alertasNoLeidas[0]).toBe(alerta6) && expect(alertasNoLeidas[0].estaExpirada()).toBe(false);
        expect(alertasNoLeidas[1]).toBe(alerta3) && expect(alertasNoLeidas[1].estaExpirada()).toBe(false);
        expect(alertasNoLeidas[2]).toBe(alerta1) && expect(alertasNoLeidas[2].estaExpirada()).toBe(false);
        expect(alertasNoLeidas[3]).toBe(alerta2) && expect(alertasNoLeidas[3].estaExpirada()).toBe(false);
        expect(alertasNoLeidas[4]).toBe(alerta5) && expect(alertasNoLeidas[4].estaExpirada()).toBe(false);
        expect(alertasNoLeidas[5]).toBe(alerta7) && expect(alertasNoLeidas[5].estaExpirada()).toBe(false);
    })
});

describe('SistemaNotificaciones - Obtener las alertas no expiradas de un tema.', () => {
    let sistema;
    let usuario1, usuario2, usuario3, usuario4, usuario5;
    let tema1, tema2;
    beforeEach(() => {
        sistema = new SistemaNotificaciones();
        //Registro los usuarios
        usuario1 = sistema.registrarUsuario('Usuario1', '1234');
        usuario2 = sistema.registrarUsuario('Usuario2', '1234');
        usuario3 = sistema.registrarUsuario('Usuario3', '1234');
        usuario4 = sistema.registrarUsuario('Usuario4', '1234');
        usuario5 = sistema.registrarUsuario('Usuario5', '1234');
        //Registro los temas
        tema1 = sistema.registrarTema('Titulo tema 1');
        tema2 = sistema.registrarTema('Titulo tema 2');
        //Suscribo a los usuarios a los respectivos temas
        sistema.suscribeUsuarioEnTema(usuario1.id, tema1.id);
        sistema.suscribeUsuarioEnTema(usuario2.id, tema1.id);
        sistema.suscribeUsuarioEnTema(usuario3.id, tema1.id);
        sistema.suscribeUsuarioEnTema(usuario4.id, tema1.id);
        sistema.suscribeUsuarioEnTema(usuario5.id, tema1.id);
        sistema.suscribeUsuarioEnTema(usuario1.id, tema2.id);
    });

    test('Debe retornar todas las alertas no expiradas en el orden correcto.', () => {
        const fechaExpira = new Date(Date.now() + 1000 * 60 * 60); //Expira en 1 hora
        const fechaExpirada = new Date(Date.now() - 1000 * 60 * 60 * 24); //Expirada hace 1 dia

        //Envio de alertas
        sistema.enviarAlerta('Urgente', 'U1', fechaExpira, tema1.id, usuario1.id);
        sistema.enviarAlerta('Informativa', 'I1', fechaExpira, tema1.id, usuario2.id);
        sistema.enviarAlerta('Informativa', 'I2', fechaExpirada, tema1.id, usuario3.id);
        sistema.enviarAlerta('Urgente', 'U2', fechaExpira, tema1.id, usuario4.id);
        sistema.enviarAlerta('Informativa', 'I3', fechaExpira, tema1.id, usuario5.id);
        sistema.enviarAlerta('Informativa', 'I4', fechaExpira, tema2.id);

        //Obtendremos las alertas no expiradas
        const alertas = sistema.ObtenerAlertasNoExpiradasDeTema(tema1.id);
        const alertas2 = sistema.ObtenerAlertasNoExpiradasDeTema(tema2.id);
        //Verificamos longitud del arreglo
        expect(alertas.length).toBe(4); //Ya que ingresamos una alerta expirada
        expect(alertas2.length).toBe(1);
        //Verifico el correcto ordenamiento de las alertas
        expect(alertas[0].mensaje).toBe('U2');
        expect(alertas[1].mensaje).toBe('U1');
        expect(alertas[2].mensaje).toBe('I1');
        expect(alertas[3].mensaje).toBe('I3');
        //Verifico en el tema2 tambien
        expect(alertas2[0].mensaje).toBe('I4');
        //Verificamos si las alertas muestran que son particulares o para todos
        expect(alertas[0].usuarioParticular).toBe(usuario4.id) && expect(alertas[0].paraTodos).toBe(false);
        expect(alertas[1].usuarioParticular).toBe(usuario1.id) && expect(alertas[1].paraTodos).toBe(false);
        expect(alertas[2].usuarioParticular).toBe(usuario2.id) && expect(alertas[2].paraTodos).toBe(false);
        expect(alertas[3].usuarioParticular).toBe(usuario5.id) && expect(alertas[3].paraTodos).toBe(false);
        //Ahora para el tema2
        expect(alertas2[0].usuarioParticular).toBe(null) && expect(alertas2[0].paraTodos).toBe(true);
    });

    test('Debe manejar correctamente el error en caso que el tema del que se quiere obtener la alerta no exista', () => {
        const alerta = sistema.ObtenerAlertasNoExpiradasDeTema(999);
        expect(alerta).toBeUndefined();
    });

})