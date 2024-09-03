<?php

class Usuario
{
    private $id;
    private $nombre;
    private $passwordhash;
    private $email;
    private $temasDeInteres = [];
    private $alertasRecibidas = [];

    public function __construct($id, $nombre, $email, $password)
    {
        $this->id = $id;
        $this->nombre = $nombre;
        $this->email = $email;
        $this->passwordhash = password_hash($password, PASSWORD_DEFAULT);
    }

    public function getID(){return $this->id;}
    public function getNombre(){return $this->nombre;}
    public function getTemas(){return $this->temasDeInteres;}
    public function getAlertas(){return $this->alertasRecibidas;}

    public function registraUsuario()
    {
        
    }

}

?>