<?php
class Reportes_model extends CI_Model {

  function __construct() {
    parent::__construct();
  }


  function carta_responsiva($idusuario) {
    $str_query=" SELECT CONCAT(us.nombre, ' ', us.apell1, ' ',us.apell2) AS nombre_completo, seg.username,seg.clave
            FROM usuario us
            INNER JOIN seguridad seg ON seg.idusuario = us.idusuario
            WHERE us.idusuario = ?
                              ";
    return $this->db->query($str_query, array($idusuario))->row_array();
  }// get()

}// class Reportes_model
