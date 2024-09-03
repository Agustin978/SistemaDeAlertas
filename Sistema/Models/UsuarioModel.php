<?php

class Usuario
{
    private $id;
    private $nombre;
    private $password;
    private $temasDeInteres = [];
    private $alertasRecibidas = [];

    public function __construct($id, $nombre)
    {
        $this->id = $id;
        $this ->nombre = $nombre;
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