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

describe('SIstemaNotificaciones - Suscribir un usuario en un tema', () => {
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
        
    })
})