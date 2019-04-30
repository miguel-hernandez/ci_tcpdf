<?php
class Reportes_model extends CI_Model {

  function __construct() {
    parent::__construct();
    $this->load->database();

  }


  function carta_responsiva($idusuario) {
    $str_query=" SELECT CONCAT(us.nombre, ' ', us.apell1, ' ',us.apell2) AS nombre_completo, seg.username,seg.clave
            FROM usuario us
            INNER JOIN seguridad seg ON seg.idusuario = us.idusuario
            WHERE us.idusuario = ?
                              ";
    return $this->db->query($str_query, array($idusuario))->row_array();
  }// get()

  function get_datos_escuela($idcentrocfg){
    $q = "SELECT ct.cct,ct.nombre,'2018-1019' AS ciclo
FROM centrocfg cfg
INNER JOIN cct ct ON cfg.idct=ct.idct
WHERE cfg.idcentrocfg= $idcentrocfg";
 // echo $q;die();
    return $this->db->query($q)->row_array();
  }

  function get_rutas($idcentrocfg){
    $q = "SELECT
                     	rtema.idrutamtema,
                     	rtema.orden,
                     	IFNULL(rtema.objetivo,'') AS objetivo,crp.descripcion,
                     	ctema.descripcion AS tema,
                     	ci.descripcion    AS indicador,
                     	group_concat(cre.descripcion) AS evidencia,
                      crp.descripcion AS problematica,
                      rtema.observaciones,
                      rtema.observacionessuperv
                     FROM rutam_tema rtema
                     INNER JOIN c_rm_tema AS ctema ON ctema.idtema = rtema.idtema
                     INNER JOIN c_rm_indicador ci ON ci.idindicador = rtema.idindicadorAPA
                     INNER JOIN rutam_problems rtp ON rtp.idrutamtema=rtema.idrutamtema
                     INNER JOIN c_rm_problem crp ON crp.idproblem=rtp.idproblem
                     INNER JOIN rutam_evidencia evi ON evi.idrutamtema=rtema.idrutamtema
                     INNER JOIN c_rm_evidencia cre ON cre.idevidencia=evi.idevidencia
                     WHERE rtema.idcentrocfg = $idcentrocfg
                     GROUP BY cre.descripcion,rtema.idrutamtema,
                     rtema.orden,rtema.objetivo,crp.descripcion,ctema.descripcion,ci.descripcion
                     ORDER BY rtema.orden";
 // echo $q;die();
    return $this->db->query($q)->result_array();
  }


}// class Reportes_model
