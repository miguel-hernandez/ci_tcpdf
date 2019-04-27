  <?php

  class Rutademejora_model extends CI_Model
  {

    function __construct()
    {
      parent::__construct();
      $this->load->database();
    }

    function get_prioridades($idcentrocfg){
      $str_query = " SELECT
                      	rtema.idrutamtema,
                      	rtema.orden,
                      	IFNULL(rtema.objetivo,'') AS objetivo,
                      	ctema.descripcion AS tema,
                      	ci.descripcion    AS indicador
                      FROM rutam_tema rtema
                      INNER JOIN c_rm_tema AS ctema ON ctema.idtema = rtema.idtema
                      INNER JOIN c_rm_indicador ci ON ci.idindicador = rtema.idindicadorAPA
                      WHERE rtema.idcentrocfg = {$idcentrocfg}
                      ORDER BY rtema.orden
      ";

                    // echo $str_query ; die();
       return $this->db->query($str_query)->result_array();
    }// get_prioridades()


  function get_numacts_idrutamtema($idrutamtema){
    $str_query = "SELECT COUNT(*) AS n_actividades
                  FROM rutam_acts
                  WHERE idrutamtema = {$idrutamtema}
    ";

    return $this->db->query($str_query)->result_array();

  }

  function get_temas(){
    $str_query = "SELECT idtema, descripcion, idindicador
                  FROM c_rm_tema
                  ";
                  // echo $str_query ; die();
    return $this->db->query($str_query)->result_array();
  }

  function get_problematicas(){
    $str_query = "SELECT idproblem, descripcion
                  FROM c_rm_problem
                  ";
    return $this->db->query($str_query)->result_array();
  }
  function get_evidencias(){
    $str_query = "SELECT idevidencia, descripcion
                  FROM c_rm_evidencia
                  ";
    return $this->db->query($str_query)->result_array();
  }
  function get_prog_apoy($idcentrocfg){
    $str_query = "SELECT
                  t2.idprograma, t2.descripcion
                  FROM progsxidctcfg t1
                  INNER JOIN c_progapoyo t2 ON t1.idprograma=t2.idprograma
                  WHERE t1.idcentrocfg=$idcentrocfg
                  ";
    return $this->db->query($str_query)->result_array();
  }
  function get_indicadores(){
    $str_query = "SELECT idindicador, descripcion
                  FROM c_rm_indicador
                  ";
    return $this->db->query($str_query)->result_array();
  }

    function insertamejora($idcentrocfg, $idtema, $orden, $idindicadorAPA, $fmod, $cayudan, $objetivo, $meta, $observaciones){
      $data = array(
              'idcentrocfg' => $idcentrocfg,
              'idtema' => $idtema,
              'orden' => $orden,
              'idindicadorAPA' => $idindicadorAPA,
              'fmod' => $fmod,
              'descrayuda' => $cayudan,
              'objetivo' => $objetivo,
              'meta' => $meta,
              'observaciones' => $observaciones
      );

      $this->db->insert('rutam_tema', $data);
      return $this->db->insert_id();
    }
    function estacfg_ident($idcentrocfg){
      $str_query = "SELECT idcentrocfg
                  FROM rutam_definicion
                  WHERE idcentrocfg=$idcentrocfg
                    ";
                    if ($this->db->query($str_query)->row('idcentrocfg')!='') {
                      return true;
                    }
                    else {
                      return false;
                    }
    }

    function insertaident($idcentrocfg, $identidar_esc){
      $data = array(
              'idcentrocfg' => $idcentrocfg,
              'identidad' => $identidar_esc
      );
      $this->db->insert('rutam_definicion', $data);
      return $this->db->insert_id();
    }

    function updateident($idcentrocfg, $identidar_esc){
      $this->db->trans_start();
      $data = array(
          'identidad' => $identidar_esc
      );

      $this->db->where('idcentrocfg', $idcentrocfg);
      $this->db->update('rutam_definicion', $data);
      $this->db->trans_complete();
      return $this->db->trans_status();
    }

    function getident($idcentrocfg){
      $str_query = "SELECT
                    identidad
                    FROM rutam_definicion
                    WHERE idcentrocfg=$idcentrocfg
                    ";
      return $this->db->query($str_query)->row('identidad');

    }

    function insert_problematicas($idruta_tema, $idproblematica, $otro, $falta, $fmod, $idusuario){
      $data = array(
              'idrutamtema' => $idruta_tema,
              'idproblem' => $idproblematica,
              'otro' => ($idproblematica == 3)? $otro: NULL,
              'falta' => $falta,
              'fmod' => $fmod,
              'idusuario'=> $idusuario
      );

      $this->db->insert('rutam_problems', $data);
    }

    function insert_evidencias($idrutamtema, $idevidencia, $otrospevidencia){
      $data = array(
        'idrutamtema' => $idrutamtema,
        'idevidencia' => $idevidencia,
        'otro' =>($idevidencia == 6)? $otrospevidencia: NULL
      );

      $this->db->insert('rutam_evidencia', $data);
    }

    function insert_progapoyo($idrutamtema, $progapoyo, $progapoyo_otro){
      $data = array(
        'idrutamtema' => $idrutamtema,
        'idprograma' => $progapoyo,
        'decrotro' =>($progapoyo == 0)? $progapoyo_otro: NULL
      );

      $this->db->insert('rutam_programa', $data);
    }

    function get_ambitos(){
      $str_query = "SELECT idambito, descripcion
                    FROM c_rm_ambito
                    ";
      return $this->db->query($str_query)->result_array();
    }


    function get_nombesc($idcentrocfg){
      $str_query = "SELECT t2.nombre as nombre
                    FROM centrocfg  t1
                    INNER JOIN cct t2 ON t1.idct=t2.idct
                    WHERE t1.idcentrocfg = {$idcentrocfg}
                    ";
      return $this->db->query($str_query)->row('nombre');
    }

    function get_orden($idprioridad){
      $str_query = "SELECT t2.descripcion as tema
                    FROM rutam_tema t1
                    INNER JOIN c_rm_tema t2 ON t1.idtema=t2.idtema
                    WHERE t1.idrutamtema=$idprioridad
                    ";
      return $this->db->query($str_query)->row('tema');
    }

    function get_problems($idprioridad){
      $str_query = "SELECT t3.descripcion
                    FROM rutam_tema t1
                    INNER JOIN rutam_problems t2 ON t1.idrutamtema=t2.idrutamtema
                    INNER JOIN c_rm_problem t3 ON t2.idproblem=t3.idproblem
                    WHERE t1.idrutamtema=$idprioridad
                    ";
                    $array_aux=$this->db->query($str_query)->result_array();
                    $srt_aux='';
                    foreach ($array_aux as $key) {
                      $srt_aux=$srt_aux.' '.$key['descripcion'].', ';
                    }
      return substr($srt_aux,0, -2);
    }


  function get_evidens($idprioridad){
    $str_query = "SELECT t3.descripcion
                  FROM rutam_tema t1
                  INNER JOIN rutam_evidencia t2 ON t1.idrutamtema=t2.idrutamtema
                  INNER JOIN c_rm_evidencia t3 ON t2.idevidencia=t3.idevidencia
                  WHERE t1.idrutamtema=$idprioridad
                  ";
                  $array_aux=$this->db->query($str_query)->result_array();
                  $srt_aux='';
                  foreach ($array_aux as $key) {
                    $srt_aux=$srt_aux.' '.$key['descripcion'].', ';
                  }
    return substr($srt_aux,0, -2);
  }

  function update_order($orden, $idtema){
    $data = array(
        'orden' => $orden
    );

    $this->db->where('idrutamtema', $idtema);
    $this->db->update('rutam_tema', $data);
  }

  function get_obj($idprioridad){
    $str_query = "SELECT objetivo
                  FROM rutam_tema
                  WHERE idrutamtema=$idprioridad
                  ";
    return $this->db->query($str_query)->row('objetivo');
  }

  function get_meta($idprioridad){
    $str_query = "SELECT meta
                  FROM rutam_tema
                  WHERE idrutamtema=$idprioridad
                  ";
    return $this->db->query($str_query)->row('meta');
  }

  function get_observaciones($idprioridad){
    $str_query = "SELECT observaciones
                  FROM rutam_tema
                  WHERE idrutamtema=$idprioridad
                  ";
    return $this->db->query($str_query)->row('observaciones');
  }

  function get_observacionessuperv($idprioridad){
    $str_query = "SELECT observacionessuperv
                  FROM rutam_tema
                  WHERE idrutamtema=$idprioridad
                  ";
    return $this->db->query($str_query)->row('observacionessuperv');
  }

  function insertarm_actividad($idrutatema, $idambito, $finicio, $ffin, $descripcion, $recursos, $avance, $responsables){
    $this->db->trans_start();
    $data = array(
            'idrutamtema' => $idrutatema,
            'idambito' => $idambito,
            'finicio' => $finicio,
            'ffin' => $ffin,
            'descripcion' => $descripcion,
            'recursos' => $recursos,
            'avance' => $avance
    );

    $this->db->insert('rutam_acts', $data);
    $idactividad  = $this->db->insert_id();
    foreach ($responsables as $responsable) {
      $data = array(
            'idpersonal' => $responsable,
            'idactividad' => $idactividad,
      );

      $this->db->insert('rutam_respxact', $data);
    }

    $this->db->trans_complete();

    if ($this->db->trans_status() === FALSE)
    {
            // generate an error... or use the log_message() function to log your error
            return false;
    }
    else
    {
            return true;
    }
  }

    function update_obj_meta($id_rmtema, $txtobjetivo, $txtmeta, $observaciones){

      $data = array(
                    'objetivo' => $txtobjetivo,
                    'meta' => $txtmeta,
                    'observaciones' => $observaciones,
                );
                $this->db->where('idrutamtema', $id_rmtema);
                $this->db->update('rutam_tema', $data);
    }

    function get_all_act_obj($id_rmtema){
      $str_query = "  SELECT
                    t1.idrutamtema,
                    t1.idactividad,
                    t1.descripcion,
                    t2.descripcion as idambito,
                    t1.finicio,
                    t1.ffin,
                    t1.recursos,
  									IF(t1.avance=1,'0%',IF(t1.avance=2,'25%',IF(t1.avance=3,'50%',IF(t1.avance=4,'75%',IF(t1.avance=5,'100%','0'))))) as avance
                    FROM rutam_acts t1
  									INNER JOIN c_rm_ambito t2 ON t1.idambito=t2.idambito
                    WHERE t1.idrutamtema=$id_rmtema
      ";
      return $this->db->query($str_query)->result_array();
    }

    function elimina_ruta($idruta, $orden, $idcentrocfg){
      $this->db->trans_start();
      $this->db->where('idrutamtema', $idruta);
      $this->db->delete('rutam_problems');
      $this->db->where('idrutamtema', $idruta);
      $this->db->delete('rutam_evidencia');
      $this->db->where('idrutamtema', $idruta);
      $this->db->delete('rutam_programa');
      $this->db->where(array('idrutamtema' => $idruta), array('idcentrocfg' => $idcentrocfg));
      $this->db->delete('rutam_tema');

      $this->db->trans_complete();

      if ($this->db->trans_status() === FALSE)
      {
              // generate an error... or use the log_message() function to log your error
              return false;
      }
      else
      {
              // $this->db->trans_commit();
              return true;
      }
    }


    function getrmactividadupdate($id_rmtema, $idrmact){

    $str_query = "SELECT
                  t1.objetivo, t1.meta,
                  t2.orden, t2.idactividad, t2.descripcion, t2.idambito, t2.finicio, t2.ffin, t2.recursos, t2.avance,
                  GROUP_CONCAT(t3.idpersonal) AS ids_personal
                  FROM rutam_tema t1
                  INNER JOIN rutam_acts t2 ON t1.idrutamtema=t2.idrutamtema
                  INNER JOIN rutam_respxact t3 ON t2.idactividad=t3.idactividad
                  WHERE t1.idrutamtema=$id_rmtema AND t2.idactividad=$idrmact
                  GROUP BY t2.idactividad
                  ";
    return $this->db->query($str_query)->result_array();
  }


  function get_xidrutamtema($idrutamtema){
    $str_query = " SELECT rt.idrutamtema, rt.idtema, rt.orden, rt.idindicadorAPA,
                          rt.descrayuda, rt.objetivo, rt.meta, rt.observaciones, rt.observacionessuperv,
                          ct.descripcion AS tema
                   FROM rutam_tema rt
                   INNER JOIN c_rm_tema ct ON ct.idtema = rt.idtema
                   WHERE rt.idrutamtema={$idrutamtema}
                  ";
    return $this->db->query($str_query)->result_array();
  }// get_xidrutamtema()

  // Transacción
  function update_problematicas($idrutamtem,$arr_problematicas,$idusuario){


      $this->db->trans_start();

      $str_query1 = "DELETE FROM rutam_problems
                            WHERE idrutamtema = {$idrutamtem}";
      $this->db->query($str_query1);
      $fecha = date("Y-m-d H:i:s");
      foreach ($arr_problematicas as $item) {
        $str_query2 = "INSERT INTO rutam_problems(idrutamtema,idproblem,fmod,idusuario)
        VALUES ($idrutamtem,$item,'$fecha',$idusuario)";
        $this->db->query($str_query2);
      }
      $this->db->trans_complete();
      if ($this->db->trans_status() === FALSE){
        return FALSE;
      }
      else{
        return TRUE;
      }

  }// update_problematicas()


  function get_personal($idcentrocfg){
    $str_query = "SELECT
                idpersonal as idresponsables,
                CONCAT(nombre,' ',apell1,' ',apell2) AS responsable
                FROM personal
                WHERE idcentrocfg=? -- AND `status`=1
                  ";
    return $this->db->query($str_query, array($idcentrocfg))->result_array();
  }

  function updatermactividad($idactividad, $idrutatema, $idambito, $finicio, $ffin, $descripcion, $recursos, $avance, $responsables){
     $this->db->trans_start();
     $str_query1 = "UPDATE
                rutam_acts
                SET
                idambito=$idambito,
                finicio='$finicio',
                ffin='$ffin',
                recursos='$recursos',
                descripcion = '$descripcion',
                avance=$avance
                WHERE idrutamtema=$idrutatema AND idactividad=$idactividad

                  ";
      $this->db->query($str_query1);

      $str_query2 = "DELETE FROM
                      rutam_respxact
                      WHERE idactividad=$idactividad
                   ";
       $this->db->query($str_query2);

      foreach ($responsables as $responsable) {
        $str_query3 = "INSERT INTO
                        rutam_respxact(idactividad,idpersonal) VALUES ($idactividad,$responsable)
                      ";
              $this->db->query($str_query3);
        }

          $this->db->trans_complete();

          if ($this->db->trans_status() === FALSE){
            return FALSE;
          }
          else{
            return TRUE;
          }

  }


  function delrmactividad($id_rmtema, $idrmact){
      $this->db->trans_start();
      $this->db->where('idrutamtema', $id_rmtema);
      $this->db->where('idactividad', $idrmact);
      $this->db->delete('rutam_acts');
      $this->db->where('idactividad', $idrmact);
      $this->db->delete('rutam_respxact');
      $this->db->trans_complete();
      if ($this->db->trans_status()=== FALSE) {
        return false;
      }
      else {
        return true;
      }
  }

  function option_tema($tema){
    $str_query = "SELECT * FROM c_rm_tema
                  WHERE  descripcion LIKE '%{$tema}%'";
    return $this->db->query($str_query)->result_array();
  }


  function get_problemsxidrutamtema($idprioridad){
    $str_query = "SELECT rp.idproblem,cp.descripcion,rp.otro
                  FROM rutam_problems rp
                  INNER JOIN c_rm_problem cp ON cp.idproblem = rp.idproblem
                  WHERE rp.idrutamtema={$idprioridad}
                  ";
      return $this->db->query($str_query)->result_array();
  }// get_problemsxidrutamtema()

  function get_evidenciasxidrutamtema($idprioridad){
    $str_query = "SELECT re.idevidencia, ce.descripcion, re.otro
                  FROM rutam_evidencia re
                  INNER JOIN c_rm_evidencia ce ON ce.idevidencia = re.idevidencia
                  WHERE re.idrutamtema={$idprioridad}
                  ";
      return $this->db->query($str_query)->result_array();
  }// get_evidenciasxidrutamtema()

  function get_prioridadprogapoy($idprioridad){
    $str_query = "SELECT
                  t1.idprograma, t2.descripcion, t1.decrotro
                  FROM rutam_programa t1
                  INNER JOIN c_progapoyo t2 ON t1.idprograma=t2.idprograma
                  WHERE t1.idrutamtema={$idprioridad}
                  ";
      return $this->db->query($str_query)->result_array();
  }// get_prioridadprogapoy()


  function updateruta($idusuario, $idrutamtema, $idtema, $idorden, $idindicadorAPA, $fmod,
                      $arr_problems,$otrosproblematica,$otrospevidencia,$arr_evidens,$objetivo,$meta,$observaciones,$otros,
                       $arr_paputilizadas, $progapoyo_otro, $cayudan){

    $this->db->trans_start();

    $str_query1 = "UPDATE rutam_tema
                   SET idindicadorAPA = {$idindicadorAPA},
                       fmod = '{$fmod}',
                       objetivo = '{$objetivo}',
                       meta = '{$meta}',
                       observaciones = '{$observaciones}',
                       descrayuda = '{$cayudan}'
                  WHERE idrutamtema = {$idrutamtema}
                    ";
    $this->db->query($str_query1);

    $str_query2 = "DELETE FROM rutam_problems
                          WHERE idrutamtema = {$idrutamtema}";
    $this->db->query($str_query2);

    foreach ($arr_problems as $item) {
      if($item==3){
        $str_query3 = "INSERT INTO rutam_problems(idrutamtema,idproblem,fmod,idusuario,otro)
        VALUES ($idrutamtema,$item,'$fmod',$idusuario,'$otros')";
      }else{
        $str_query3 = "INSERT INTO rutam_problems(idrutamtema,idproblem,fmod,idusuario)
        VALUES ($idrutamtema,$item,'$fmod',$idusuario)";
      }

      $this->db->query($str_query3);
    }


    $str_query4 = "DELETE FROM rutam_evidencia
                          WHERE idrutamtema = {$idrutamtema}";
    $this->db->query($str_query4);
    foreach ($arr_evidens as $item2) {

      if($item2==6){
      $str_query5 = "INSERT INTO rutam_evidencia(idrutamtema,idevidencia,otro)
      VALUES ($idrutamtema,$item2,'$otrospevidencia')";
      }
      else{
        $str_query5 = "INSERT INTO rutam_evidencia(idrutamtema,idevidencia)
        VALUES ($idrutamtema,$item2)";
      }
      $this->db->query($str_query5);
    } //die();

    $str_query6 = "DELETE FROM rutam_programa
                          WHERE idrutamtema = {$idrutamtema}";
    $this->db->query($str_query6);
    foreach ($arr_paputilizadas as $item7) {

      if($item7==0){
      $str_query7 = "INSERT INTO rutam_programa(idrutamtema,idprograma,decrotro)
      VALUES ($idrutamtema,$item7,'$progapoyo_otro')";
      }
      else{
        $str_query7 = "INSERT INTO rutam_programa(idrutamtema,idprograma)
        VALUES ($idrutamtema,$item7)";
      }
      $this->db->query($str_query7);
    } //die();

    $this->db->trans_complete();

    if ($this->db->trans_status() === FALSE){
      return FALSE;
    }
    else{
      return TRUE;
    }

  }// updateruta()

  function inserta_observacion_supervisor($idrutamtema, $observacion){
    $data = array(
                    'idrutamtema' => $idrutamtema,
                    'observacionessuperv' => $observacion
                );
                $this->db->where('idrutamtema', $idrutamtema);
               return  $this->db->update('rutam_tema', $data);
  }

  function get_observaciones_super($idrutamtema){
    $str_query = "SELECT observaciones, observacionessuperv FROM rutam_tema
                   WHERE idrutamtema = {$idrutamtema}
                  ";
      return $this->db->query($str_query)->result();
  }

  function get_datos_estadisticas($idscentrocfg){
    $str_query = "SELECT COUNT(IF(datos.idtema=1,datos.idtema,NULL)) AS 'normalidad',
      COUNT(IF(datos.idtema=2,datos.idtema,NULL)) AS 'puebla',
      COUNT(IF(datos.idtema=3,datos.idtema,NULL)) AS 'mejora',
      COUNT(IF(datos.idtema=4,datos.idtema,NULL)) AS 'rezago'FROM(
      SELECT tema.idcentrocfg, tema.idtema, crt.descripcion FROM rutam_tema AS tema
      RIGHT JOIN c_rm_tema crt ON crt.idtema = tema.idtema
      WHERE tema.idcentrocfg IN($idscentrocfg)) AS datos";
      echo $str_query; die();
      return $this->db->query($str_query)->result();
  }

  function get_datos_estadisticas_nact_por($idscentrocfg){
    $str_query = "SELECT
                  		t3.descripcion,
                  		SUM(IF(t1.avance=1,1,0)) as r_0,
                  		SUM(IF(t1.avance=2,1,0)) as r_25,
                  		SUM(IF(t1.avance=3,1,0)) as r_50,
                  		SUM(IF(t1.avance=4,1,0)) as r_75,
                  		SUM(IF(t1.avance=5,1,0)) as r_100
                  FROM rutam_tema t2
                  INNER JOIN rutam_acts t1 ON t2.idrutamtema=t1.idrutamtema
                  INNER JOIN c_rm_tema t3 ON t2.idtema=t3.idtema
                  WHERE t2.idcentrocfg IN ($idscentrocfg)
                  GROUP BY t2.idtema
                  ORDER BY FIELD(t2.idtema,1,2,4,3)";
      return $this->db->query($str_query)->result();
  }

  }
