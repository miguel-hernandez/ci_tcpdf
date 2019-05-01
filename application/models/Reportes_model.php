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
    /*
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
                     */

    $str_query = " SELECT
                      	rtema.idrutamtema,
                      	rtema.orden,
                      	IFNULL(rtema.objetivo,'') AS objetivo,
                      	ctema.descripcion AS tema,
                      	ci.descripcion    AS indicador,
                        rtema.observaciones,
                        rtema.observacionessuperv,
                        GROUP_CONCAT(DISTINCT crp.descripcion SEPARATOR ', ') AS problematicas,
                        GROUP_CONCAT(DISTINCT cre.descripcion SEPARATOR ', ') AS evidencias
                      FROM rutam_tema rtema
                      INNER JOIN c_rm_tema AS ctema ON ctema.idtema = rtema.idtema
                      INNER JOIN c_rm_indicador ci ON ci.idindicador = rtema.idindicadorAPA
                      INNER JOIN rutam_problems rtp ON rtp.idrutamtema = rtema.idrutamtema
                      INNER JOIN c_rm_problem crp ON crp.idproblem = rtp.idproblem

		                  INNER JOIN rutam_evidencia evi ON evi.idrutamtema = rtema.idrutamtema
		                  INNER JOIN c_rm_evidencia cre ON cre.idevidencia = evi.idevidencia

                      WHERE rtema.idcentrocfg = ?
                      GROUP BY rtema.idrutamtema
                      ORDER BY rtema.orden
    ";
 // echo $q;die();
    return $this->db->query($str_query, array($idcentrocfg))->result_array();
  }

  function get_actividades_xidrutatema($idrutamtema){
    $str_query = "   SELECT
     t1.idrutamtema,
     t1.idactividad,
     t1.descripcion,
     t2.descripcion AS ambito,
     DATE_FORMAT(t1.finicio, '%d/%m/%Y') AS finicio,
     DATE_FORMAT(t1.ffin, '%d/%m/%Y') AS ffin,
     t1.recursos,
     IF(
       t1.avance = 1,
       '0%',
       IF(
         t1.avance = 2,
         '25%',
         IF(
           t1.avance = 3,
           '50%',
           IF(
             t1.avance = 4,
             '75%',
             IF(t1.avance = 5, '100%', '0')
           )
         )
       )
     ) AS avance
    FROM
     rutam_acts t1
     INNER JOIN c_rm_ambito t2
       ON t1.idambito = t2.idambito
    WHERE t1.idrutamtema = ?;
    ";
  // echo $str_query;die();
    return $this->db->query($str_query, array($idrutamtema))->result_array();
  }

}// class Reportes_model
