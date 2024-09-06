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
    
});