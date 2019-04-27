<?php

class Alumno_model extends CI_Model {

 public $idexpediente;
 public $idalumno;
 public $idFoto;
 public $usuario;
 public $subfijo;
 public $idtutor1;
 public $idtutor2;
 public $errorMsg;
 public $grupos_permisos;

 public function __construct() {
  $this->idexpediente = null;
  $this->idalumno = null;
  $this->idFoto = null;
  $this->subfijo = null;
  $this->idtutor1 = "";
  $this->idtutor2 = "";

  $this->load->database();
  $this->load->library('UtilsWrapper');
  $this->usuario = $this->utilswrapper->get_usuario_sesion($this);
  $this->load->model('Catalogos_model');

  /* 20190308 Ismael Castillo
  if (isset($this->session->datos_usuario->subfijo_tablas)) {
   $this->subfijo = $this->session->datos_usuario_yolixtli->subfijo_tablas;
  } else if (isset($this->session->datos_usuario_yolixtli->subfijo_tablas_tmp)) {
   $this->subfijo = $this->session->datos_usuario_yolixtli->subfijo_tablas_tmp;
  }
  */

  // 20190308 Ismael Castillo
  if (isset($this->usuario->subfijo_tablas)) {
   $this->subfijo = $this->usuario->subfijo_tablas;
  } else if (isset($this->usuario->subfijo_tablas_tmp)) {
   $this->subfijo = $this->usuario->subfijo_tablas_tmp;
  }

  // echo "<pre>";print_r($this);die();
  if ($this->usuario->idtipousuario === "5")
   $this->grupos_permisos = explode(",", $this->usuario->grupos);
 }

 function get_alumno($idalumno) {
  return $this->db->get_where('alumno', array('idalumno' => $idalumno))->row_array();
 }

 public function getAlumnos_($input) {

  // escolar > filtrado sencillo con busqueda en un solo idctfg
  //* es admin central o region
  //* si selecciono idctfg ?
  //* sino
  //* 		buscar en todos los niveles, aplicar los derechos sobre el expediente/evals si no tiene derecho sobre el nivel / mun ... etc
  //*
  //

  // print_r($this->session->datos_usuario_yolixtli->subfijo_tablas);
  // die();

  // $this->subfijo = $this->session->datos_usuario_yolixtli->subfijo_tablas;

  $permiso = ", 1 as permiso";
  $where = "where 1=1";
  // $where .= " and g.idplan>5";
  if ($input->post('nombre') !== ""){
   $where .= " and a.nombre like '%" . $input->post('nombre') . "%'";
  }
  if ($input->post('apellido1') !== ""){
   $where .= " and a.apell1 like '%" . $input->post('apellido1') . "%'";
  }
  if ($input->post('apellido2') !== ""){
   $where .= " and a.apell2 like '%" . $input->post('apellido2') . "%'";
  }
  if ($input->post('curp') !== ""){
   $where .= " and a.curp like '" . $input->post('curp') . "%'";
  }
  if ($input->post('estatus') !== ""){
   $where .= " and e.status='" . $input->post('estatus') . "'";
  }
  if (trim($input->post('itxt_alumno_nia')) !== ""){
   $where .= " and a.idalumno = '{$input->post('itxt_alumno_nia')}' ";
  }

  if ($this->usuario->idtipousuario == ESCOLARLIMITADO || $this->usuario->idtipousuario == ADMINESCOLAR) {

   if ($this->usuario->idtipousuario == ESCOLARLIMITADO) {
    $permiso = ",(case when FIND_IN_SET(g.idgrupo,'" . $this->usuario->grupos . "') <> 0 then 1 else 0 end ) as permiso";
   }
   $where .= " and c.idcentrocfg='" . $this->usuario->idcentrocfg . "'";

   if ($input->post('grupo') != "")
    $where .= " and g.idgrupo='" . $input->post('grupo') . "'";

    $str_query1 = "
 						SELECT '$this->subfijo' as subfijo,
 						  concat_ws(' / ', a.apell1 , a.apell2 ,a.nombre) AS nombrecompleto,
 						  a.curp,
 						  a.genero,
 						  ct.cct,
 						  g.grado,
 						  g.grupo,
              CONCAT(g.grado, '-', g.grupo) AS gradogrupo,
 						  e.idexpediente,
 						  (CASE
 								WHEN e.status = 'A' THEN 'checked'
 								ELSE ''
 						  END) AS checked,
 						  a.paisnac,
 						  a.calle,
 						  a.colonia,
 						  a.entidadnac,
 						  a.fechanac,
 						  a.telefono,
 						  a.idetnia,
 						  a.idtransnacional,
 						  e.idgrupo,
 						  g.grado,
 						  g.grupo,
 						  g.idcentrocfg,
 						  c.idct,
 						  c.nivel,
 						  ct.cct,
 						  a.idalumno, a.idalumno AS nia,
 							g.idplan
                                                   $permiso
 					 FROM
 						  expediente_$this->subfijo e
 								INNER JOIN
 						  alumno a ON a.idalumno = e.idalumno
 								INNER JOIN
 						  grupo_$this->subfijo g ON g.idgrupo = e.idgrupo
 								INNER JOIN
 						  centrocfg c ON c.idcentrocfg = g.idcentrocfg
 								INNER JOIN
 						  cct ct ON ct.idct = c.idct
                      $where
                      order by ct.cct,gradogrupo,nombrecompleto limit 2000";
      // echo $str_query1; die();

   $res['rows'] = $this->db->query($str_query1)->result_array();
   //echo $this->db->last_query();die();

   $res['conteo'] = $this->db->query("
						SELECT
							COUNT(*) numTotal,
							SUM(CASE
								 WHEN a.genero = 'H' THEN 1
								 ELSE 0
							END) AS numHombres,
							SUM(CASE
								 WHEN a.genero = 'M' THEN 1
								 ELSE 0
							END) AS numMujeres
					  FROM
							expediente_$this->subfijo e
								 INNER JOIN
							alumno a ON a.idalumno = e.idalumno
								 INNER JOIN
							grupo_$this->subfijo g ON g.idgrupo = e.idgrupo
								 INNER JOIN
							centrocfg c ON c.idcentrocfg = g.idcentrocfg
								 INNER JOIN
							cct ct ON ct.idct = c.idct $where")->result_array();
  }else { //es multi-cts
   if ($input->post('grupo_filtro') != "") {
    $where .= " and g.idgrupo='" . $input->post('grupo_filtro') . "'";
   }
   if ($input->post('cct_filtro') != "") {
    $where .= " and ct.cct='" . $input->post('cct_filtro') . "'";
   }

   /* 20190308 Ismael Castillo
   if ($this->session->datos_usuario->idtipousuario == "6") {
    $where .= " and c.idcentrocfg in (SELECT cfg2.idcentrocfg
                 FROM cct_zona cz
                 left join centrocfg cfg on cfg.idct = cz.idctzona
                 left join cct on cct.idct= cz.idct
                 left join centrocfg cfg2 on cfg2.idct = cct.idct
                 where cfg.idcentrocfg={$this->session->datos_usuario->idcentrocfg}) ";
   }
   */

   // 20190308 Ismael Castillo
   if ($this->usuario->idtipousuario == IDSUPERVISOR) { // 20190308 ismael castillo
    $where .= " and c.idcentrocfg in (SELECT cfg2.idcentrocfg
                 FROM cct_zona cz
                 left join centrocfg cfg on cfg.idct = cz.idctzona
                 left join cct on cct.idct= cz.idct
                 left join centrocfg cfg2 on cfg2.idct = cct.idct
                 where cfg.idcentrocfg={$this->usuario->idcentrocfg}) ";
   }

   $q_pree = "(SELECT 'pree' as subfijo,'PRE' as subfijo_display,concat_ws(' / ', a.apell1, a.apell2,a.nombre ) AS nombrecompleto,a.curp,a.genero,
                  ct.cct,g.grado,g.grupo,g.grado || '-' || g.grupo AS gradogrupo,e.idexpediente,(CASE WHEN e.status = 'A' THEN 'checked' ELSE ''END) AS checked,
                  a.paisnac,a.calle,a.colonia,a.entidadnac,a.fechanac,a.telefono,a.idetnia,a.idtransnacional,
                                          e.idgrupo,g.grado,g.grupo,g.idcentrocfg,c.idct,c.nivel as nivel,ct.cct,a.idalumno,
                                          a.idalumno AS nia,1 AS permiso, g.idplan
                FROM   expediente_pree e
                                  INNER JOIN alumno a ON a.idalumno = e.idalumno
                INNER JOIN grupo_pree g ON g.idgrupo = e.idgrupo
                INNER JOIN centrocfg c ON c.idcentrocfg = g.idcentrocfg
                INNER JOIN cct ct ON ct.idct = c.idct
                                  $where
                                  order by ct.cct,gradogrupo,nombrecompleto limit 1000)";

   $q_prim = "(SELECT 'prim' as subfijo ,'PRI' as subfijo_display,concat_ws(' / ',a.apell1, a.apell2, a.nombre) AS nombrecompleto,a.curp,a.genero,
                  ct.cct,g.grado,g.grupo,g.grado || '-' || g.grupo AS gradogrupo,e.idexpediente,(CASE WHEN e.status = 'A' THEN 'checked' ELSE ''END) AS checked,
                  a.paisnac,a.calle,a.colonia,a.entidadnac,a.fechanac,a.telefono,a.idetnia,a.idtransnacional,
                                          e.idgrupo,g.grado,g.grupo,g.idcentrocfg,c.idct,c.nivel as nivel,ct.cct,a.idalumno,
                                          a.idalumno AS nia,1 AS permiso, g.idplan
                FROM   expediente_prim e
                                  INNER JOIN alumno a ON a.idalumno = e.idalumno
                INNER JOIN grupo_prim g ON g.idgrupo = e.idgrupo
                INNER JOIN centrocfg c ON c.idcentrocfg = g.idcentrocfg
                INNER JOIN cct ct ON ct.idct = c.idct
                                  $where
                                  order by ct.cct,gradogrupo,nombrecompleto limit 1000)";

   $q_sec = "(SELECT 'sec' as subfijo,'SEC' as subfijo_display ,concat_ws(' / ', a.apell1, a.apell2,a.nombre) as nombrecompleto,a.curp,a.genero,
                ct.cct,g.grado,g.grupo,g.grado || '-' || g.grupo AS gradogrupo,e.idexpediente,(CASE WHEN e.status = 'A' THEN 'checked' ELSE ''END) AS checked,
                a.paisnac,a.calle,a.colonia,a.entidadnac,a.fechanac,a.telefono,a.idetnia,a.idtransnacional,
                                        e.idgrupo,g.grado,g.grupo,g.idcentrocfg,c.idct,c.nivel as nivel,ct.cct,a.idalumno,
                                        a.idalumno AS nia,1 AS permiso, g.idplan
              FROM   expediente_sec e
                                INNER JOIN alumno a ON a.idalumno = e.idalumno
              INNER JOIN grupo_sec g ON g.idgrupo = e.idgrupo
              INNER JOIN centrocfg c ON c.idcentrocfg = g.idcentrocfg
              INNER JOIN cct ct ON ct.idct = c.idct
                                $where
                                order by ct.cct,gradogrupo,nombrecompleto limit 1000)";

   if ($input->post('nivel_filtro') != "") {

    $res['rows'] = $this->db->query(${"q_" . $input->post('nivel_filtro')})->result_array();
   } else {
    $res['rows'] = $this->db->query($q_pree . " union " . $q_prim . " union " . $q_sec)->result_array();
   }


   // echo $this->db->last_query();die();


   $q = "SELECT SUM(numTotal) as numTotal, SUM(numHombres) AS numHombres,SUM(numMujeres) AS numMujeres
                                   FROM  (";

   $q_pree = "SELECT  COUNT(*) as numTotal,SUM(CASE WHEN a.genero = 'H' THEN 1 ELSE 0  END) AS numHombres,
                                   SUM(CASE WHEN a.genero = 'M' THEN 1 ELSE 0 END) AS numMujeres
                                   FROM    expediente_pree e
                                   INNER JOIN alumno a ON a.idalumno = e.idalumno
                                   INNER JOIN grupo_pree g ON g.idgrupo = e.idgrupo
                                   INNER JOIN centrocfg c ON c.idcentrocfg = g.idcentrocfg
                                   INNER JOIN cct ct ON ct.idct = c.idct
                                   $where ";

   $q_prim = "SELECT  COUNT(*) as numTotal,SUM(CASE WHEN a.genero = 'H' THEN 1 ELSE 0  END) AS numHombres,
                                   SUM(CASE WHEN a.genero = 'M' THEN 1 ELSE 0 END) AS numMujeres
                                   FROM    expediente_prim e
                                   INNER JOIN alumno a ON a.idalumno = e.idalumno
                                   INNER JOIN grupo_prim g ON g.idgrupo = e.idgrupo
                                   INNER JOIN centrocfg c ON c.idcentrocfg = g.idcentrocfg
                                   INNER JOIN cct ct ON ct.idct = c.idct
                                   $where ";

   $q_sec = "SELECT  COUNT(*) as numTotal,SUM(CASE WHEN a.genero = 'H' THEN 1 ELSE 0  END) AS numHombres,
                                   SUM(CASE WHEN a.genero = 'M' THEN 1 ELSE 0 END) AS numMujeres
                                   FROM    expediente_sec e
                                   INNER JOIN alumno a ON a.idalumno = e.idalumno
                                   INNER JOIN grupo_sec g ON g.idgrupo = e.idgrupo
                                   INNER JOIN centrocfg c ON c.idcentrocfg = g.idcentrocfg
                                   INNER JOIN cct ct ON ct.idct = c.idct
                                   $where ";

   if ($input->post('nivel_filtro') != "") {

    $res['conteo'] = $this->db->query($q . ${"q_" . $input->post('nivel_filtro')} . ") as aa")->result_array();
    //echo $this->db->last_query();
   } else {
    $res['conteo'] = $this->db->query($q . $q_pree . " union " . $q_prim . " union " . $q_sec . ") as aa")->result_array();
   }
  }
//   $sql = $this->db->get_compiled_select();
// echo $sql; die();

  // echo $this->db->last_query();die();
  return $res;
 }

 function getAlumnos_club($input, $subfijo, $idgrupoc, $idcentrocfg, $offset, $limit) {
  $aux = "'";
  if ($offset < 0 && $limit < 0) {
   $concat_paginador = "";
  } else {
   $concat_paginador = " LIMIT {$offset},{$limit} ";
  }

  $where = "";

  if ($input->post('nombre') !== ""){
   $where .= " and a.nombre like '%" . $input->post('nombre') . "%'";
  }
  if ($input->post('apellido1') !== ""){
   $where .= " and a.apell1 like '%" . $input->post('apellido1') . "%'";
  }
  if ($input->post('apellido2') !== ""){
   $where .= " and a.apell2 like '%" . $input->post('apellido2') . "%'";
  }
  if ($input->post('curp') !== ""){
   $where .= " and a.curp like '" . $input->post('curp') . "%'";
  }
  if ($input->post('estatus') !== ""){
   $where .= " and expe.status='" . $input->post('estatus') . "'";
  }
  if (trim($input->post('itxt_alumno_nia')) !== ""){
   $where .= " and a.idalumno = '{$input->post('itxt_alumno_nia')}' ";
  }


  if ((int) $idgrupoc != 0) {
   $where .= " AND evp.idgrupo_club = {$idgrupoc}";
  }

  $str_query = "SELECT expe.idexpediente, a.idalumno, CONCAT(a.apell1, '/', apell2, '/', a.nombre) AS nombrea, a.curp, a.genero, a.idalumno AS nia,
                  CONCAT(c.descripcion, ' - ',gcp.grupo )AS grupo, expe.idexpediente AS expediente_alumno, expe.idexpediente AS evaluacion_alumno,
									CONCAT(gr.grado,'-',gr.grupo) ggrupo, gr.idplan,
									CONCAT(expe.idexpediente,','," . "''" . "'{$subfijo}'" . "''" . ") as parametros,
									CONCAT(gr.idgrupo,',',expe.idexpediente,',',a.idalumno,',',gcp.idcentrocfg,',', cfg.nivel,',',gr.idplan) as param_evaluacion_alumno
                FROM grupo_club_{$subfijo} gcp
                INNER JOIN evalxclub_{$subfijo} evp ON gcp.idgrupo_club = evp.idgrupo_club
                INNER JOIN expediente_{$subfijo} expe ON expe.idexpediente = evp.idexpediente
								INNER JOIN grupo_{$subfijo} gr ON expe.idgrupo = gr.idgrupo
                INNER JOIN alumno a ON a.idalumno = expe.idalumno
                INNER JOIN clubxescuela cxe ON cxe.idclub = gcp.idclub AND cxe.idcentrocfg = gcp.idcentrocfg
                INNER JOIN c_club c ON c.idclub = cxe.idclub
								INNER JOIN centrocfg cfg ON gr.idcentrocfg = cfg.idcentrocfg
                WHERE gcp.idcentrocfg = {$idcentrocfg}  {$where}
                {$concat_paginador}
    ";
  // echo $str_query; die();

  if ($offset < 0 && $limit < 0) {
   return $this->db->query($str_query)->num_rows();
  } else {
   return $this->db->query($str_query)->result_array();
  }
 }

 public function getExpediente($id) {
  $str_query = " SELECT a.idalumno,a.nombre,a.apell1,a.apell2,a.celular,e.status,a.curp,a.genero,ct.cct,g.grado,g.grupo,e.idexpediente,c.turno, e.cam_usaer, e.ctusaer,a.cpostal,
         DATE_FORMAT(e.fecha1medicion,'%d/%m/%Y') AS fecha1medicion,e.estatura1medicion,e.peso1medicion, '' as talla1medicion, e.tallacintura, e.tallaespalda, e.tallauniforme, e.tallacalzado,
         DATE_FORMAT(e.fecha2medicion,'%d/%m/%Y') AS fecha2medicion,e.estatura2medicion,e.peso2medicion, '' as talla2medicion,
         '' as talla_camisa_blusa, '' as talla_pantalon_jumper, '' as talla_calzado, '' as talla_calceta, '' as codigopostal, e.id_servicio_medico,
         a.paisnac,pais.nombre as paisnac_nombre, a.calle,a.numero as num_ext,a.colonia,a.entidadnac,DATE_FORMAT(a.fechanac,'%d/%m/%Y') AS fechanac,a.telefono,a.idetnia,a.idtransnacional,
         a.paisdomicilio, pais_dom.nombre as paisdomicilio_nombre,a.entidaddomicilio,a.municipiodomicilio,a.localidaddomicilio,
         e.idgrupo,g.grado,g.grupo,g.idcentrocfg,c.idct,ct.cct,e.observacion_apoyos,e.notas,e.fecha_registro,
         foto_propuesta.foto as fotoPropuesta,foto_propuesta.estatus as fotoPropuestaEstatus,foto_propuesta.idfoto as fotoPropuestaId,
         foto_motivosrechazo.motivorechazo as motivoRechazo,n.subfijo as subfijo,
         foto_oficial.foto as fotoOficial,foto_oficial.idfoto as fotoOficialId
         ,a.exttel as extension
         ,a.numeroint as num_int,e.otroservmed
    FROM expediente_{$this->subfijo}  e
    LEFT JOIN alumno a ON a.idalumno = e.idalumno
    LEFT JOIN grupo_{$this->subfijo} g ON g.idgrupo = e.idgrupo
    LEFT JOIN centrocfg c ON c.idcentrocfg = g.idcentrocfg
    LEFT JOIN niveleducativo n ON n.idnivel = c.nivel
    LEFT JOIN cct ct ON ct.idct = c.idct
    LEFT JOIN foto as foto_propuesta  ON foto_propuesta.idalumno = a.idalumno and foto_propuesta.oficial = 0
    LEFT JOIN foto as foto_oficial  ON foto_oficial.idalumno = a.idalumno and foto_oficial.oficial = 1
    LEFT JOIN foto_motivosrechazo ON foto_motivosrechazo.id_motivorechazo = foto_propuesta.id_motivorechazo
    LEFT JOIN pais ON pais.idpais = a.paisnac
    LEFT JOIN pais pais_dom ON pais_dom.idpais = a.paisdomicilio
    WHERE e.idexpediente='{$id}'";

    $query = $this->db->query($str_query);

    $r = $query->result_array();
    // echo $this->db->last_query();die();
    return $r;
  }// getExpediente()

 public function getNecesidades() {
  $q = "SELECT * FROM necesidades";
  $query = $this->db->query($q);
  return $query->result_array();
 }

 public function getMisNecesidades($id) {


  $query = $this->db->query("select * from necesidadxalumno_$this->subfijo where idexpediente='$id' ");
  //echo $this->db->last_query();
  return $query->result_array();
 }

 public function grabaExpedienteDatosGenerales($input) {
   // echo "garbar datos";print_r($input->post());die();
  $ap2 = NULL;
  if (trim($input->post('apellido2')) != "")
   $ap2 = mb_strtoupper($input->post('apellido2'), 'UTF-8');
  $bit = false;

  $fnac = null;
  if (isset($_POST['fechaNac']) && $_POST['fechaNac'] != "") {
   $tmp = explode('/', $_POST['fechaNac']);
   $fnac = $tmp[2] . '-' . $tmp[1] . '-' . $tmp[0];
  }
  $data = array();

  // echo "<pre>"; print_r($input); die();
  //echo "//".$this->usuario->idtipousuario."//";

  //Aqui esta fijo el usuario 1
  // var_dump($this->usuario->idtipousuario); die();
  if (($this->usuario->idtipousuario === "1")
  ) {

   $data = array(
       'nombre' => mb_strtoupper($input->post('nombre'), 'UTF-8'),
       'apell1' => mb_strtoupper($input->post('apellido1'), 'UTF-8'),
       'apell2' => $ap2,
       'curp' => mb_strtoupper($input->post('curp')),
       'fechanac' => $fnac,
       'genero' => $input->post('genero'),
       'paisnac' => $input->post('pais'),
       'entidadnac' => ($input->post('estado') != '' ? $input->post('estado') : 21), //antes39
       'idtransnacional' => $input->post('transnacional'),
       'idetnia' => $input->post('etnia'),
       'celular' => trim($input->post('celular')),
       'calle' => mb_strtoupper($input->post('calle'), 'UTF-8'),
       // 'numero' => mb_strtoupper($input->post('numero'), 'UTF-8'),
       'numero' => mb_strtoupper($input->post('num_ext'), 'UTF-8'),
       'numeroint' => mb_strtoupper($input->post('num_int'), 'UTF-8'),
       'cpostal' => $input->post('cpostal'),
       'colonia' => mb_strtoupper($input->post('colonia'), 'UTF-8'),
       'telefono' => mb_strtoupper(trim($input->post('telefono')), 'UTF-8'),
       'exttel' => ($input->post('extension')),
       'paisdomicilio' => $input->post('paisDomicilio'),
       'entidaddomicilio' => $input->post('entidad'),
       'municipiodomicilio' => $input->post('municipio'),
       'localidaddomicilio' => $input->post('localidad'),

       'fecha_mod' => date('Y-m-d H:i:s')
   );
  } else if ((($this->usuario->idtipousuario === "2" || $this->usuario->idtipousuario === "3") &&
          ($this->utilswrapper->verifica_permiso_v2($this->usuario->permisos, strtoupper(substr($this->input->post('subfijo'), 0, 3)) . '_MOD_ALUMNO')))) {
   $data = array(
       'nombre' => mb_strtoupper($input->post('nombre'), 'UTF-8'),
       'apell1' => mb_strtoupper($input->post('apellido1'), 'UTF-8'),
       'apell2' => $ap2,
       'curp' => mb_strtoupper($input->post('curp')),
       'fechanac' => $fnac,
       'genero' => $input->post('genero'),
       'paisnac' => $input->post('pais'),
       'entidadnac' => $input->post('estado'),
       'idtransnacional' => $input->post('transnacional'),
       'idetnia' => $input->post('etnia'),
       'fecha_mod' => date('Y-m-d H:i:s'));
  } else if (($this->usuario->idtipousuario === "4") ||
          ($this->usuario->idtipousuario === "5" && in_array($input->post('grupo_'), $this->grupos_permisos))
  ) {
    // echo "escolar"; die();
   $data = array(
       'idetnia' => $input->post('etnia'),
       'celular' => trim($input->post('celular')),
       'calle' => mb_strtoupper($input->post('calle'), 'UTF-8'),
       // 'numero' => mb_strtoupper($input->post('numero'), 'UTF-8'),
       'numero' => mb_strtoupper($input->post('num_ext'), 'UTF-8'),
       'numeroint' => mb_strtoupper($input->post('num_int'), 'UTF-8'),

       'colonia' => mb_strtoupper($input->post('colonia'), 'UTF-8'),
       'telefono' => mb_strtoupper(trim($input->post('telefono')), 'UTF-8'),
       'exttel' => ($input->post('extension')),
       'paisdomicilio' => $input->post('paisDomicilio'),
       'entidaddomicilio' => $input->post('entidad'),
       'municipiodomicilio' => $input->post('municipio'),
       'localidaddomicilio' => $input->post('localidad'),
       'cpostal' => $input->post('cpostal'),
       'fecha_mod' => date('Y-m-d H:i:s')
   );
  }

  $this->db->where(array('idalumno' => $input->post('idalumno')));


  $bit = $this->db->update('alumno', $data);
  //echo  $this->db->last_query();
  $error = $this->db->error();


  if ($bit && ($this->usuario->idtipousuario == "1" || ($this->usuario->idtipousuario == "4") ||
          ($this->usuario->idtipousuario === "5" && in_array($input->post('grupo_'), $this->grupos_permisos)))
  ) {

   $fecha1 = null;
   $fecha2 = null;
   if (isset($_POST['fecha1']) && $_POST['fecha1'] != "") {
    $tmp = explode('/', $_POST['fecha1']);
    $fecha1 = $tmp[2] . '-' . $tmp[1] . '-' . $tmp[0];
   }
   if (isset($_POST['fecha2']) && $_POST['fecha2'] != "") {
    $tmp = explode('/', $_POST['fecha2']);
    $fecha2 = $tmp[2] . '-' . $tmp[1] . '-' . $tmp[0];
   }



   $data = array(
       'fecha1medicion' => $fecha1,
       'estatura1medicion' => $input->post('estatura1'),
       'peso1medicion' => $input->post('peso1'),
       // 'talla1medicion' => $input->post('talla1'),
       'fecha2medicion' => $fecha2,
       'estatura2medicion' => $input->post('estatura2'),
       'peso2medicion' => $input->post('peso2'),
       // 'talla2medicion' => $input->post('talla2'),
       'imc1' => $input->post('imc1'),
       'imc2' => $input->post('imc2'),
       'estatusIMC1' => $input->post('estatusIMC1'),
       'estatusIMC2' => $input->post('estatusIMC2'),
       'fecha_mod' => date('Y-m-d H:i:s')
   );

   //if ($this->usuario->idtipousuario === "1" || $this->usuario->idtipousuario === "2")	$data['idgrupo'] = $input->post('grupo');
   //'' => $input->post('')
   $this->db->where(array('idexpediente' => $input->post('idexpediente')));
   $bit = $this->db->update("expediente_$this->subfijo", $data);
   $error = $this->db->error();
  }

  if ($bit && ($this->usuario->idtipousuario == "1" || ($this->usuario->idtipousuario == "4") ||
          ($this->usuario->idtipousuario === "5" && in_array($input->post('grupo_'), $this->grupos_permisos)))
  ) {

   $this->db->delete("necesidadxalumno_$this->subfijo", array('idexpediente' => $input->post('idexpediente')));
   //echo  $this->db->last_query();
   $necesidades = $this->getNecesidades();
   $data = array();
   if (is_array($input->post('necesidadesMultiple'))) {
    foreach ($input->post('necesidadesMultiple') as $row) {
     $data = array('clavenecesidad' => $row, 'idexpediente' => $input->post('idexpediente'));
     $bit = $this->db->insert("necesidadxalumno_$this->subfijo", $data);
     $error = $this->db->error();
     //echo  $this->db->last_query();
    }
   }
  }

  //USAER
  if ($bit && ($this->usuario->idtipousuario == "1" || ($this->usuario->idtipousuario == "4") ||
          ($this->usuario->idtipousuario === "5" && in_array($input->post('grupo_'), $this->grupos_permisos)))
  ){
    $data = array(
      'cam_usaer' => $input->post('cam_usaer'),
      'ctusaer' => $input->post('ctusaer'),
    );
    $this->db->where(array('idexpediente' => $input->post('idexpediente')));
    $bit = $this->db->update("expediente_$this->subfijo", $data);
    $error = $this->db->error();
  }


  $this->errorMsg = $error['message'];
  return $bit;
 }

 public function getTutor($numtutor, $idexpediente) {


  $query = $this->db->query("select e.status,t.*,DATE_FORMAT(t.fechanac,'%d/%m/%Y') AS fechanac,p.nombre as pais_dom_nombre,numero as num_extTutor,numeroint as num_intTutor
    ,exttel as extensionTutor
    from expediente_$this->subfijo e
    left join tutor t on t.idalumno=e.idalumno and t.numtutor='$numtutor'
    left join pais p on p.idpais = t.pais_dom where e.idexpediente='$idexpediente' ");
  //$this->db->select('*');$this->db->from('tutor');$this->db->where(array('idalumno' => $idalumno, 'numtutor' => $numtutor));
  //$query = $this->db->get();
  $rs = $query->result_array();
  //echo  $this->db->last_query();
  return $rs;
 }

 public function grabaExpedienteTutores($input) {

  $this->db->trans_start();

  $fnac = null;
  if (isset($_POST['fechaNacTutor1']) && $_POST['fechaNacTutor1'] != "") {
   $tmp = explode('/', $_POST['fechaNacTutor1']);
   $fnac = $tmp[2] . '-' . $tmp[1] . '-' . $tmp[0];
  }


  $data = array('numtutor' => '1',
      'idalumno' => $input->post('idalumnoTutor'),
      'nombre' => mb_strtoupper($input->post('nombreTutor1'), 'UTF-8'),
      'apell1' => mb_strtoupper($input->post('apellido1Tutor1'), 'UTF-8'),
      'apell2' => mb_strtoupper($input->post('apellido2Tutor1'), 'UTF-8'),
      'curp' => mb_strtoupper($input->post('curpTutor1'), 'UTF-8'),
      'idparentesco' => $input->post('parentescoTutor1'),
      'fechanac' => $fnac,
      'entidad' => $input->post('entidadTutor1'),
      'profesion' => $input->post('profesionTutor1'),
      'telefono' => trim($input->post('telefonoTutor1')),
      'correo' => $input->post('correoTutor1'),
      'viveconalumno' => ($input->post('viveConAlumnoTutor1') !== null ? 1 : 0),
      'calle' => mb_strtoupper($input->post('calleTutor1'), 'UTF-8'),
      'numero' => mb_strtoupper($input->post('num_extTutor1'), 'UTF-8'),
      'numeroint' => mb_strtoupper($input->post('num_intTutor1'), 'UTF-8'),
      'colonia' => mb_strtoupper($input->post('coloniaTutor1'), 'UTF-8'),
      'telefono_dom' => trim($input->post('telefonoDomTutor1')),
      'exttel' => trim($input->post('extensionTutor1')),
      'pais_dom' => $input->post('paisDomTutor1'),
      'entidad_dom' => $input->post('entidadDomTutor1'),
      'municipio_dom' => $input->post('municipioDomTutor1'),
      'localidad_dom' => $input->post('localidadDomTutor1'),
      'tienepace' => ($input->post('PaceTutor1') === 'on' ? 1 : 0),
      'folioaccesopace' => $input->post('clavePaceTutor1')
  );
  //echo "/".$input->post('idTutor1')."/";
  if ($input->post('idTutor1') == "") {
   $bit = $this->db->insert('tutor', $data);
   if ($bit)
    $this->idtutor1 = $this->db->insert_id();
  } else {
   $this->db->where(array('idtutor' => $input->post('idTutor1')));
   $this->idtutor1 = $input->post('idTutor1');
   $bit = $this->db->update('tutor', $data);
  }

  //echo  $this->db->last_query();

  if ($bit) {
   $data = array('numtutor' => '2',
       'idalumno' => $input->post('idalumnoTutor'),
       'nombre' => mb_strtoupper($input->post('nombreTutor2'), 'UTF-8'),
       'apell1' => mb_strtoupper($input->post('apellido1Tutor2'), 'UTF-8'),
       'apell2' => mb_strtoupper($input->post('apellido2Tutor2'), 'UTF-8'),
       'curp' => mb_strtoupper($input->post('curpTutor2'), 'UTF-8'),
       'idparentesco' => $input->post('parentescoTutor2'),
       'fechanac' => $input->post('fechaNacimientoTutor2'),
       'entidad' => $input->post('entidadTutor2'),
       'profesion' => $input->post('profesionTutor2'),
       'telefono' => trim($input->post('telefonoTutor2')),
       'correo' => $input->post('correoTutor2'),
       'viveconalumno' => ($input->post('viveConAlumnoTutor2') !== null ? 1 : 0),
       'calle' => mb_strtoupper($input->post('calleTutor2'), 'UTF-8'),
       'numero' => mb_strtoupper($input->post('num_extTutor2'), 'UTF-8'),
       'numeroint' => mb_strtoupper($input->post('num_intTutor2'), 'UTF-8'),
       'colonia' => mb_strtoupper($input->post('coloniaTutor2'), 'UTF-8'),
       'telefono_dom' => trim($input->post('telefonoDomTutor2')),
       'exttel' => trim($input->post('extensionTutor2')),
       'pais_dom' => $input->post('paisDomTutor2'),
       'entidad_dom' => $input->post('entidadDomTutor2'),
       'municipio_dom' => $input->post('municipioDomTutor2'),
       'localidad_dom' => $input->post('localidadDomTutor2'),
       'tienepace' => ($input->post('PaceTutor2') === 'on' ? 1 : 0),
       'folioaccesopace' => $input->post('clavePaceTutor2')
   );
   //echo "/".$input->post('idTutor1')."/";
   if ($input->post('idTutor2') == "") {
    $bit = $this->db->insert('tutor', $data);
    if ($bit)
     $this->idtutor2 = $this->db->insert_id();
   } else {
    $this->db->where(array('idtutor' => $input->post('idTutor2')));
    $this->idtutor2 = $input->post('idTutor2');
    $bit = $this->db->update('tutor', $data);
   }
  }
  //echo  $this->db->last_query();
  $this->db->trans_complete();

  return $bit;
 }

 public function apoyos() {
  $q = "SELECT * FROM apoyo";
  $query = $this->db->query($q);
  return $query->result_array();
 }

 public function requisitos() {
  $q = "SELECT * FROM requisitos";
  $query = $this->db->query($q);
  return $query->result_array();
 }

 public function getMisApoyos($id) {


  $query = $this->db->query("select * from apoyoxalumno_$this->subfijo where idexpediente='$id' ");
  return $query->result_array();
 }

 public function getMisRequisitos($idexpediente) {
  $str_query = "SELECT * FROM requisitoxalumno_{$this->subfijo} WHERE idexpediente = ? ";
  return $this->db->query($str_query, array($idexpediente))->result_array();
 }// getMisRequisitos()

 public function grabaExpedienteApoyos($input) {
  $bit = true;
  $this->db->trans_start();


  $data = array(
      'tallacintura' => $input->post('tallacintura'),
      'tallaespalda' => $input->post('tallaespalda'),
      'tallauniforme' => $input->post('tallauniforme'),
      'tallacalzado' => $input->post('tallacalzado'),
      'observacion_apoyos' => mb_strtoupper($input->post('observacionApoyos'), 'UTF-8'),
      'fecha_mod' => date('Y-m-d H:i:s')
  );

  $this->db->where(array('idexpediente' => $input->post('idexpedienteApoyos')));
  $bit = $this->db->update("expediente_$this->subfijo", $data);
  //echo  $this->db->last_query();



  if ($bit) {

   $this->db->delete("apoyoxalumno_$this->subfijo", array('idexpediente' => $input->post('idexpedienteApoyos')));
   //echo  $this->db->last_query();
   $apoyos = $this->apoyos();
   $data = array();
   if (is_array($input->post('apoyosMultiple'))) {
    foreach ($input->post('apoyosMultiple') as $row) {
     $data = array('idapoyo' => $row, 'idexpediente' => $input->post('idexpedienteApoyos'));
     $bit = $this->db->insert("apoyoxalumno_$this->subfijo", $data);
     //echo  $this->db->last_query();
    }
   }
  }

  $this->db->trans_complete();

  return $bit;
 }

 public function grabaExpedienteOtros($input) {
  $bit = true;
  $this->db->trans_start();

$otroserv=$input->post('otroservmed');
$otroserv = mb_strtoupper($otroserv, "UTF-8");
  //$faltan_requisitos = 0;
  //if($input->post('requisitosFaltantes')!== null)$faltan_requisitos=1;

  $data = array('notas' => $input->post('notas'),
      'id_servicio_medico' => $input->post('servicioMedico'),
      'otroservmed' => $otroserv,
      'fecha_mod' => date('Y-m-d H:i:s'));

  $this->db->where(array('idexpediente' => $input->post('idexpedienteOtros')));
  $bit = $this->db->update("expediente_$this->subfijo", $data);
  //echo  $this->db->last_query();

  if ($bit && ($this->usuario->idtipousuario === "1" || $this->usuario->idtipousuario === "2")) {
   $this->db->delete("requisitoxalumno_$this->subfijo", array('idexpediente' => $input->post('idexpedienteOtros')));

   $requisitos = $this->requisitos();
   $data = array();
   foreach ($requisitos as $row) {
    if ($input->post("requisito_" . $row['idrequisito']) !== null) {
     $data = array('idrequisito' => $row['idrequisito'],
         'idexpediente' => $input->post('idexpedienteOtros'));
     $bit = $this->db->insert("requisitoxalumno_$this->subfijo", $data);
    }
   }
  }

  $this->db->trans_complete();

  return $bit;
 }

 public function existeExpediente($input) {
  $bit = false;

  $query = $this->db->query("SELECT e.idexpediente,e.idalumno
                                       FROM alumno a
                                       left join expediente_{$input->post('nivel')} e on e.idalumno = a.idalumno
                                       where (a.apell1 = '" . $input->post('apellido1') . "' and a.apell2 = '" . $input->post('apellido2') . "' and a.nombre='" . $input->post('nombre') . "'
                                              and a.genero = '" . $input->post('genero') . "' and a.fechanac='" . $input->post('fechaNac') . "')
                                              OR a.curp = '" . $input->post('curp') . "'");
  foreach ($query->result() as $row) {
   if ($row->idexpediente != null) {

    //echo "//".$row->idexpediente."//";
    $this->idexpediente = $row->idexpediente;
    $this->idalumno = $row->idalumno;
    $bit = true;
   }
  }
  //echo  $this->db->last_query();
  return $bit;
 }

 public function existeAlumno($input) {
  $bit = false;

  $query = $this->db->query("SELECT a.idalumno
                                           FROM alumno a
                                           where (a.apell1 = '" . $input->post('apellido1') . "' and a.apell2 = '" . $input->post('apellido2') . "' and a.nombre='" . $input->post('nombre') . "'
                                                  and a.genero = '" . $input->post('genero') . "' and a.fechanac='" . $input->post('fechaNac') . "')
                                                  OR a.curp = '" . $input->post('curp') . "'");
  foreach ($query->result() as $row) {
   if ($row->idalumno != null) {

    //echo "//".$row->idexpediente."//";
    //$this->idexpediente = $row->idexpediente;
    $this->idalumno = $row->idalumno;
    $bit = true;
   }
  }
  //echo  $this->db->last_query();
  return $bit;
 }

 public function grabaCrearExpediente($input) {
  $bit = true;
  $this->db->trans_start();
  if (!$this->existeAlumno($input)) {
   $ap2 = NULL;
   $etnia = NULL;
   $transnacional = NULL;
   if (trim($input->post('etnia')) !== "")
    $etnia = $input->post('etnia');
   if (trim($input->post('transnacional')) !== "")
    $transnacional = $input->post('transnacional');
   if (trim($input->post('apellido2')) !== "")
    $ap2 = mb_strtoupper($input->post('apellido2'), 'UTF-8');

   $fnac = null;
   if ($input->post('fechaNac') != "") {
    $tmp = explode('/', $input->post('fechaNac'));
    $fnac = $tmp[2] . '-' . $tmp[1] . '-' . $tmp[0];
   }

   $data = array('nombre' => mb_strtoupper($input->post('nombre'), 'UTF-8'),
       'apell1' => mb_strtoupper($input->post('apellido1'), 'UTF-8'),
       'apell2' => $ap2,
       'curp' => mb_strtoupper($input->post('curp'), 'UTF-8'),
       'fechanac' => $fnac,
       'genero' => $input->post('genero'),
       'paisnac' => $input->post('pais'),
       'entidadnac' => ($input->post('estado') != '' ? $input->post('estado') : 21), //antes39
       'idetnia' => $etnia,
       'idtransnacional' => $transnacional,
       'fecha_registro' => date('Y-m-d H:i:s'),
       'idusuario' => $this->usuario->idusuario);

   $bit = $this->db->insert('alumno', $data);
   $this->idalumno = $this->db->insert_id();
  }
  // echo  $this->db->last_query();
  if ($bit) {
   $data = array('idgrupo' => $input->post('grupo_crea_expediente'),
       'status' => 'A',
       'fecha_registro' => date('Y-m-d H:i:s'),
       'idalumno' => $this->idalumno,
       'idusuario' => $this->usuario->idusuario);
   $bit = $this->db->insert("expediente_{$input->post('nivel')}", $data);
   $this->idexpediente = $this->db->insert_id();
   // echo  $this->db->last_query();

   if ($bit) {
    // echo $input->post('grupo_crea_expediente');
    $grupo_destino = $this->Catalogos_model->getGrupo($input->post('grupo_crea_expediente'), $input->post('nivel'));
    // echo "<pre>";print_r($this->idexpediente); die();
    $this->db->select(" '" . $this->idexpediente . "' as idexpediente,idasig{$input->post('nivel')} as idasig");
    $this->db->where(array('idplan' => $grupo_destino[0]['idplan'], 'grado' => $grupo_destino[0]['grado']));
    $asignaturas_base1 = $this->db->get("asignatura_{$input->post('nivel')}");

    if ($asignaturas_base1->num_rows()) {
     $bit = $this->db->insert_batch("evalxasig_{$input->post('nivel')}", $asignaturas_base1->result_array());
     // echo  $this->db->last_query();
    }
    if ($bit && $input->post('nivel') != 'pree') {
     $bit = $this->db->insert("prom_{$input->post('nivel')}", array('idexpediente' => $this->idexpediente));
     // echo  $this->db->last_query(); die();
    }
    $str_query = "
					SELECT '" . $this->idexpediente . "' as idexpediente, asi.idasig{$input->post('nivel')} as idasig, asp.idsegm as idsegmento
					FROM asignatura_{$input->post('nivel')} asi
					INNER JOIN aspecxasig_{$input->post('nivel')} asp ON asi.idasig{$input->post('nivel')} = asp.idasig{$input->post('nivel')}
					WHERE idplan = '" . $grupo_destino[0]['idplan'] . "'
					AND grado = '" . $grupo_destino[0]['grado'] . "'
									";
    // print_r($str_query);
    // die();
    $asignaturas_base2 = $this->db->query($str_query)->result_array();
    // echo "<pre>"; print_r($asignaturas_base2);die();
    if (count($asignaturas_base2) > 0) {
     $bit = $this->db->insert_batch("evalxsegm_{$input->post('nivel')}", $asignaturas_base2);
     // echo  $this->db->last_query();die();
    }

    if ($bit) {
     $data = array('idgrupo' => $input->post('grupo_crea_expediente'),
         'id_tipomovimiento' => 1,
         'fechaalta' => date('Y-m-d H:i:s'),
         'idalumno' => $this->idalumno,
         'idexpediente' => $this->idexpediente,
         'idusuario' => $this->usuario->idusuario);
     $bit = $this->db->insert("movimientos_{$input->post('nivel')}", $data);
     // echo  $this->db->last_query();
    }
   }
  }
  // die();
  $this->db->trans_complete();

  // echo "<pre>";print_r($bit);die();
  return $bit;
 }

 public function grabaImagen($input) {
  //print_r($input);
  //$filename = $data['upload_data']['file_name'];
  //$file_data = mysql_real_escape_string(file_get_contents($data['upload_data']['full_path']));
  $year = $this->usuario->parametros->ciclo;
  $bit = true;
  $insert = true;


  $query = $this->db->query("SELECT 1 as bit,idfoto FROM foto where idalumno=" . $input->idalumno . " and ciclo=" . $year . " and estatus = 'A'");
  foreach ($query->result() as $row) {
   if ($row->bit === '1') {
    $insert = false;
    $this->idFoto = $row->idfoto;
   }
  }


  //echo  $this->db->last_query();
  //echo "header('content-type: image/your_image_type');";
  //echo $input->imagen;
  $data = array('foto' => $input->imagen,
      'ciclo' => $year,
      'idalumno' => $input->idalumno,
      //'obs' => 'nada',
      'fmod' => date('Y-m-d H:i:s'),
      'iduser' => $this->usuario->idusuario,
      'oficial' => 1, // temporal para grabar directo a imagen oficial
      'estatus' => 'A'
  );

  if ($insert) {
   $bit = $this->db->insert('foto', $data);
   $this->idFoto = $this->db->insert_id();
  } else {
   $this->db->where(array('idalumno' => $input->idalumno,
       'ciclo' => $year,
       'oficial' => 1));
   $bit = $this->db->update('foto', $data);
  }


  //echo  $this->db->last_query();
  if ($bit)
   $bit = $this->aceptaFotoPropuesta($this->idFoto);

  return $bit;
 }

 public function eliminaImagen() {

  $this->db->where(array('idfoto' => $this->idFoto));
  $bit = $this->db->delete("foto");

  return $bit;
 }

 public function aceptaFotoPropuesta($idFotoPropuesta) {
  $bit = true;
  $insert = true;

  $this->db->trans_start();

  $fotoPropuesta = $this->db->select("idalumno, ciclo, foto")->where('idfoto', $idFotoPropuesta)->get('foto');
  $rs = $fotoPropuesta->result_array();
  //print_r($rs);
  //echo $rs[0]['foto'];
  $this->db->where('idfoto', $idFotoPropuesta)->update('foto', array('estatus' => 'A'));

  $fotoOficial = $this->db->query('SELECT 1 as bit FROM foto where idalumno=' . $rs[0]['idalumno'] . ' and ciclo=' . $rs[0]['ciclo'] . ' and oficial=1');

  if ($fotoOficial->num_rows() > 0)
   $insert = false;

  $data = array('foto' => $rs[0]['foto'],
      'ciclo' => $rs[0]['ciclo'],
      'idalumno' => $rs[0]['idalumno'],
      //'obs' => 'nada',
      'fmod' => date('Y-m-d H:i:s'),
      'iduser' => $this->usuario->idusuario,
      'oficial' => 1,
      'estatus' => 'A'
  );

  if ($insert)
   $bit = $this->db->insert('foto', $data);
  else {
   $this->db->where(array('idalumno' => $rs[0]['idalumno'],
       'ciclo' => $rs[0]['ciclo'],
       'oficial' => 1));
   $bit = $this->db->update('foto', $data);
  }

  //echo  $this->db->last_query();

  $this->db->trans_complete();

  return $bit;
 }

 public function rechazaFotoPropuesta($idFotoPropuesta, $motivoRechazo) {
  $bit = true;


  $data = array(
      'id_motivorechazo' => $motivoRechazo,
      'fmod' => date('Y-m-d H:i:s'),
      'iduser' => $this->usuario->idusuario,
      'estatus' => 'R'
  );


  $this->db->where(array('idfoto' => $idFotoPropuesta));
  $bit = $this->db->update('foto', $data);


  //echo  $this->db->last_query();


  return $bit;
 }

 public function getMovimientos($idalumno) {


  $query = $this->db->query("
select tm.tipomovimiento as Movimiento, cct.cct as Escuela,g.grado||'/'||g.grupo as Grupo , m.fechaalta as Fecha, s.username as Usuario
from movimientos_$this->subfijo as m
left join grupo_$this->subfijo g on g.idgrupo = m.idgrupo
left join centrocfg cfg on cfg.idcentrocfg = g.idcentrocfg
left join cct on cct.idct = cfg.idct
left join tipo_movimiento tm on tm.id_tipomovimiento = m.id_tipomovimiento
left join seguridad s on s.idusuario = m.idusuario
where m.idalumno = $idalumno order by m.fechaalta desc");




  //$this->db->order_by('nombrecompleto');
  //echo  $this->db->last_query();
  return $query->result_array();
 }

 public function switchStatusExpediente($idAlumno, $idExpediente, $status, $motivoBaja, $bajaFisica, $subfijo, $idgrupo) {

  $this->db->trans_start();

  if ($bajaFisica) {


   $this->db->where(array('idexpediente' => $idExpediente));
   $this->db->delete("movimientos_$subfijo");
   // echo  $this->db->last_query();

   $this->db->where(array('idexpediente' => $idExpediente));
   $this->db->delete("requisitoxalumno_$subfijo");
   // echo  $this->db->last_query();

   $this->db->where(array('idexpediente' => $idExpediente));
   $this->db->delete("necesidadxalumno_$subfijo");
   // echo  $this->db->last_query();

   $this->db->where(array('idexpediente' => $idExpediente));
   $resp = $this->db->delete("apoyoxalumno_$subfijo");

   // echo  $this->db->last_query();

   $this->db->where(array('idexpediente' => $idExpediente));
   $resp = $this->db->delete("eval_$subfijo");
   // echo  $this->db->last_query();
// obsxasig_prim, prom_prim,sisat_prim,sisat_superv_prim,evaladd_,herrapren_

   $this->db->where(array('idexpediente' => $idExpediente));
   $resp = $this->db->delete("evalxsegm_$subfijo");
   // echo  $this->db->last_query();

   $this->db->where(array('idexpediente' => $idExpediente));
   $resp = $this->db->delete("evalxclub_$subfijo");
   // echo  $this->db->last_query();

   $this->db->where(array('idexpediente' => $idExpediente));
   $resp = $this->db->delete("evalxasig_$subfijo");
   // echo  $this->db->last_query();

   $this->db->where(array('idexpediente' => $idExpediente));
   $this->db->delete("expediente_$subfijo");
   // echo  $this->db->last_query();
  } else {

   $data = array('status' => $status, 'idusuario' => $this->usuario->idusuario);
   $this->db->where(array('idexpediente' => $idExpediente));
   $this->db->update("expediente_$subfijo", $data);

   // echo  $this->db->last_query();

   $data = array('idexpediente' => $idExpediente,
       'idalumno' => $idAlumno,
       'idgrupo' => $idgrupo,
       'fechaalta' => date('Y-m-d H:i:s'),
       'idusuario' => $this->usuario->idusuario);
   if ($status === "B") {
    $data['id_tipomovimiento'] = "4";
    $data['id_motivo_baja'] = $motivoBaja;
   } else {
    $data['id_tipomovimiento'] = "1";
   }

   $this->db->insert("movimientos_$subfijo", $data);

   //echo  $this->db->last_query();
  }

  $data = array('tienepace' => 0, 'folioaccesopace' => null);
  $this->db->where(array('idalumno' => $idAlumno));
  $this->db->update("tutor", $data);
  // echo  $this->db->last_query();
  // die();

  $this->db->trans_complete();
  return $this->db->trans_status();
 }

 public function getExpedienteBasic($idExpediente, $subfijo) {
  $q = "SELECT e.idexpediente,e.idalumno,e.idgrupo,g.programa,g.grado,g.grupo,g.idcentrocfg,g.idplan
                      FROM expediente_$subfijo e
                      left join grupo_$subfijo g on g.idgrupo = e.idgrupo
                      where e.idexpediente = '$idExpediente'";
  $query = $this->db->query($q);
  //echo  $this->db->last_query();
  return $query->result_array();
 }

 public function gettienecupoxidgrupo($idgrupo, $subfijo) {
  $str_query = "SELECT
						IF(g.cupo>(COUNT(exp.idalumno)), 1, 0) as esss
						FROM expediente_{$subfijo} exp
						INNER JOIN grupo_{$subfijo} g ON exp.idgrupo = g.idgrupo
						WHERE exp.idgrupo={$idgrupo} AND exp.`status`='A'";
  return $this->db->query($str_query)->row('esss');
  //echo  $this->db->last_query();
 }

 public function actualizaGrupoExpediente($idExpediente, $idAlumno, $idgrupo_origen, $subfijoOrigen, $idcentrocfg_origen, $idgrupo_destino, $subfijoDestino, $idcentrocfg_destino, $generaMovs) {

  if ((int) $idcentrocfg_origen != (int) $idcentrocfg_destino) {
   $this->db->where(array('idexpediente' => $idExpediente));
   $this->db->delete("evalxclub_$subfijoOrigen");
  }
  $this->db->trans_start();

  $data = array('idgrupo' => $idgrupo_destino, 'idusuario' => $this->usuario->idusuario);

  $this->db->where(array('idexpediente' => $idExpediente));
  $this->db->update("expediente_$subfijoOrigen", $data);

  $data = array('idexpediente' => $idExpediente,
      'idalumno' => $idAlumno,
      'idgrupo' => $idgrupo_origen,
      'fechaalta' => date('Y-m-d H:i:s'),
      'idusuario' => $this->usuario->idusuario);
  $data['id_tipomovimiento'] = "5";
  $this->db->insert("movimientos_$subfijoOrigen", $data);
  //echo  $this->db->last_query();

  $this->db->trans_complete();

  return $this->db->trans_status();
 }

 public function reconfiguraGrupoExpediente($idExpediente, $grupo_origen, $subfijoOrigen, $grupo_destino, $subfijoDestino, $generaMovs) {
  // echo "<pre>";print_r($grupo_origen);
  // echo "<pre>";print_r($grupo_destino);
  // die();
  $this->db->trans_start();
  // $this->db->where(array('idexpediente' => $idExpediente));
  // $this->db->delete("eval_$subfijoOrigen");
  //echo  $this->db->last_query();

  $data = array('idgrupo' => $grupo_destino[0]['idgrupo'], 'idusuario' => $this->usuario->idusuario);
  $this->db->where(array('idexpediente' => $idExpediente));
  $this->db->update("expediente_$subfijoDestino", $data);
  //echo  $this->db->last_query();
  //
		// $this->db->select(" '" . $idExpediente . "' as idexpediente,idasig$subfijoDestino as idasig,'A' as status,'" . $this->usuario->idusuario . "' as idusuario");
  // $this->db->where(array('idplan' => $grupo_destino[0]['idplan'], 'grado' => $grupo_destino[0]['grado']));
  // $select = $this->db->get("asignatura_$subfijoOrigen");
  //             //echo  $this->db->last_query();
  // if ($select->num_rows()) {
  // 	$this->db->insert_batch("eval_$subfijoOrigen", $select->result_array());
  // }
  $auxstr_camp_inasist_asig_sec = '';
  $auxstr_camp_inasist_asig_sect = '';
  $auxstr_camp_inasist_asig_sectt = '';
  if ($subfijoDestino == 'sec') {
   $auxstr_camp_inasist_asig_sec .= ', eval.alertap1, eval.alertap2,eval.alertap3, eval.pf,eval.inasisp1, eval.inasisp2, eval.inasisp3, eval.recuperap1, eval.recuperap2, eval.recuperap3';
   $auxstr_camp_inasist_asig_sect .= ', tab1.alertap1, tab1.alertap2,tab1.alertap3, tab1.pf,tab1.inasisp1, tab1.inasisp2, tab1.inasisp3, tab1.recuperap1, tab1.recuperap2, tab1.recuperap3';
   $auxstr_camp_inasist_asig_sectt .= ',alertap1,alertap2,alertap3,pf, recuperap1, recuperap2, recuperap3';
  }
  if ($subfijoDestino == 'prim') {
   $auxstr_camp_inasist_asig_sec .= ', eval.alertap1, eval.alertap2,eval.alertap3, eval.pf';
   $auxstr_camp_inasist_asig_sect .= ', tab1.alertap1, tab1.alertap2,tab1.alertap3, tab1.pf';
   $auxstr_camp_inasist_asig_sectt .= ',alertap1,alertap2,alertap3,pf';
  }

  $str_query1 = "INSERT INTO evalxasig_{$subfijoDestino} (idexpediente, idasig, tipoeval, p1,p2,p3,recomp1,recomp2,recomp3,fmod,idusuario{$auxstr_camp_inasist_asig_sectt})
		SELECT
			tab2.idexpediente, tab2.idasig,
			tab1.tipoeval, tab1.p1, tab1.p2, tab1.p3, tab1.recomp1,
			tab1.recomp2, tab1.recomp3, tab1.fmod, tab1.idusuario {$auxstr_camp_inasist_asig_sect}
			FROM
			(SELECT '" . $idExpediente . "' as idexpediente, asi.idasig{$subfijoDestino} as idasig, asi.descr, asi.clave,
				eval.tipoeval, eval.p1, eval.p2, eval.p3, eval.recomp1,
				eval.recomp2, eval.recomp3, eval.fmod, eval.idusuario {$auxstr_camp_inasist_asig_sec}
				FROM asignatura_{$subfijoDestino} asi
				LEFT JOIN evalxasig_{$subfijoDestino} eval ON asi.idasig{$subfijoDestino} = eval.idasig
				WHERE asi.idplan = '" . $grupo_origen[0]['idplan'] . "' AND asi.grado = '" . $grupo_origen[0]['grado'] . "' AND eval.idexpediente='" . $idExpediente . "' AND asi.clave!='150'
			) as tab1
			RIGHT JOIN (SELECT '" . $idExpediente . "' as idexpediente, asi.idasig{$subfijoDestino} as idasig, asi.descr, asi.clave
									FROM asignatura_{$subfijoDestino} asi WHERE asi.idplan = '" . $grupo_destino[0]['idplan'] . "' AND asi.grado = '" . $grupo_destino[0]['grado'] . "' ) as tab2 ON tab1.clave = tab2.clave
						";
  // print_r($str_query1);
  // die();
  $resp = $this->db->query($str_query1);
  if ($resp) {
   $str_query3 = "INSERT INTO evalxsegm_{$subfijoDestino} (idexpediente, idasig, idsegmento, nivelp1,nivelp2,nivelp3)
			SELECT
				tab2.idexpediente,
				tab2.idasig,
				tab2.idsegmento,
				tab1.nivelp1 as nivelp1,
				tab1.nivelp2 as nivelp2,
				tab1.nivelp3 as nivelp3
				FROM
				(SELECT '" . $idExpediente . "' as idexpediente,
				 asi.idasig{$subfijoDestino} as idasig, asi.descr, asi.clave,
				 eval.idsegmento,
				 eval.nivelp1 as nivelp1,
				 eval.nivelp2 as nivelp2,
				 eval.nivelp3 as nivelp3
					FROM asignatura_{$subfijoDestino} asi
					LEFT JOIN evalxsegm_{$subfijoDestino} eval ON asi.idasig{$subfijoDestino} = eval.idasig
					WHERE asi.idplan = '" . $grupo_origen[0]['idplan'] . "' AND asi.grado = '" . $grupo_origen[0]['grado'] . "' AND eval.idexpediente='" . $idExpediente . "'
				) as tab1
				RIGHT JOIN (SELECT '" . $idExpediente . "' as idexpediente, asi.idasig{$subfijoDestino} as idasig, asi.descr, asi.clave,
										asp.idsegm as idsegmento
										FROM asignatura_{$subfijoDestino} asi
										INNER JOIN aspecxasig_{$subfijoDestino} asp ON asi.idasig{$subfijoDestino} = asp.idasig{$subfijoOrigen}
										WHERE asi.idplan = '" . $grupo_destino[0]['idplan'] . "' AND asi.grado = '" . $grupo_destino[0]['grado'] . "'
										) as tab2 ON tab1.clave = tab2.clave AND tab1.idsegmento =tab2.idsegmento
							";
   // print_r($str_query3);
   // die();
   $resp = $this->db->query($str_query3);
  }

  if ($resp) {

   $str_query4 = "
											DELETE
											FROM evalxsegm_{$subfijoOrigen} WHERE evalxsegm_{$subfijoOrigen}.idasig IN (
												SELECT * FROM (SELECT asi.idasig{$subfijoOrigen} as idasig
														FROM asignatura_{$subfijoOrigen} asi
														INNER JOIN evalxsegm_{$subfijoOrigen} eval ON asi.idasig{$subfijoOrigen} = eval.idasig
														WHERE asi.idplan = '" . $grupo_origen[0]['idplan'] . "' AND asi.grado = '" . $grupo_origen[0]['grado'] . "' AND eval.idexpediente='" . $idExpediente . "' GROUP BY asi.idasig{$subfijoOrigen}) AS p
								 )
								 AND(
									 evalxsegm_{$subfijoOrigen}.idsegmento IN (
										 SELECT * FROM (SELECT eval.idsegmento
												 FROM asignatura_{$subfijoOrigen} asi
												 INNER JOIN evalxsegm_{$subfijoOrigen} eval ON asi.idasig{$subfijoOrigen} = eval.idasig
												 WHERE asi.idplan = '" . $grupo_origen[0]['idplan'] . "' AND asi.grado = '" . $grupo_origen[0]['grado'] . "' AND eval.idexpediente='" . $idExpediente . "' GROUP BY eval.idsegmento) AS q
												 )
									 )
								 AND evalxsegm_{$subfijoOrigen}.idexpediente = '" . $idExpediente . "'
								";
   // print_r($str_query4);
   // die();
   $resp = $this->db->query($str_query4);
  }
  if ($resp) {
   $str_query2 = "
											DELETE
											FROM evalxasig_{$subfijoOrigen} WHERE evalxasig_{$subfijoOrigen}.idasig IN (
												SELECT * FROM (SELECT asi.idasig{$subfijoOrigen} as idasig
														FROM asignatura_{$subfijoOrigen} asi
														INNER JOIN evalxasig_{$subfijoOrigen} eval ON asi.idasig{$subfijoOrigen} = eval.idasig
														WHERE asi.idplan = '" . $grupo_origen[0]['idplan'] . "' AND asi.grado = '" . $grupo_origen[0]['grado'] . "' AND eval.idexpediente='" . $idExpediente . "') AS p
								 ) AND evalxasig_{$subfijoOrigen}.idexpediente = '" . $idExpediente . "'
								";
   // print_r($str_query2);
   // die();
   $resp = $this->db->query($str_query2);
  }
  if ($resp) {
   $this->db->where(array('idexpediente' => $idExpediente));
   $resp = $this->db->delete("evalxclub_$subfijoOrigen");
  }

  if ($resp) {
   $data = array('idexpediente' => $idExpediente,
       'idalumno' => $grupo_origen[0]['idalumno'],
       'idgrupo' => $grupo_destino[0]['idgrupo'],
       'fechaalta' => date('Y-m-d H:i:s'),
       'idusuario' => $this->usuario->idusuario);
   $data['id_tipomovimiento'] = "5";
   $resp = $this->db->insert("movimientos_$subfijoOrigen", $data); // code...
  }

  //echo  $this->db->last_query();
  //echo  $this->db->last_query();
  if ($resp == FALSE) {
   $this->db->trans_rollback();
   return $resp;
  } else {
   $this->db->trans_complete();
   return $this->db->trans_status();
  }
 }

 public function existeCurp($curp) {
  $resp = FALSE;

  $query = $this->db->get_where('alumno', array('curp' => $curp));
  if ($query->num_rows() > 0) {
   $resp = TRUE;
  }

  return $resp;
 }

 public function getExpediente_min($id) {

  $where = " where e.idexpediente='$id' ";
  if ($this->usuario->idtipousuario == ESCOLARLIMITADO || $this->usuario->idtipousuario == ADMINESCOLAR) {
   $where .= " and c.idcentrocfg='" . $this->usuario->idcentrocfg . "'";
  }
  $query = $this->db->query("
       select e.idalumno,e.idexpediente,e.status,concat_ws(' / ', a.nombre, a.apell1, a.apell2 ) as nombrecompleto,e.idgrupo,
              concat_ws('-',g.grado,g.grupo) as grado_grupo
        from expediente_$this->subfijo  e
        left join alumno a on a.idalumno=e.idalumno
        left join grupo_$this->subfijo g ON g.idgrupo = e.idgrupo
        left join  centrocfg c ON c.idcentrocfg = g.idcentrocfg
        $where ");
  // echo "<pre>";print_r($query);die();
  return $query->result_array();
  echo $this->db->last_query();
 }

 /*  * 2017-09-09 Luis Sanchez
  * Alumnos por grupo_pree.idgrupo, grupo_prim.idgrupo o grupo_sec.idgrupo
  * @param idgrupo, sufijo para saber que tabla consumir
  * @return array de alumnos
  */

 public function get_alumnos_xgrupo($idgrupo, $sufijo, $idasig, $asignatura, $idopcion, $exploracion, $ordemaniento, $inorder) {
  $ordemaniento = ($ordemaniento == '') ? "ORDER BY nombrecompleto " : " ORDER BY " . $ordemaniento;
  if ($idgrupo != "0") {
   $opcion = '';

   if ($idopcion == "1") {
    $opcion = 'lec';
   } else if ($idopcion == "2") {
    $opcion = 'txt';
   }
   if ($asignatura == 'MATEMÁTICAS') {
    $str_query = "
										SELECT e.idexpediente,CONCAT_WS(' / ', a.apell1, a.apell2,  a.nombre) AS nombrecompleto,a.curp,
										ct.cct, CONCAT(g.grado, '-', g.grupo) AS gradogrupo,
										g.idcentrocfg,c.idct,c.nivel AS nivel,ct.cct,a.idalumno, '0' as pf,
										s.exp" . $exploracion . "_cal_1 AS '1', s.exp" . $exploracion . "_cal_2 AS '2', s.exp" . $exploracion . "_cal_3 AS '3',
										s.exp" . $exploracion . "_cal_4 AS '4', s.exp" . $exploracion . "_cal_5 AS '5', s.exp" . $exploracion . "_cal_6 AS '6',
										s.exp" . $exploracion . "_cal_7 AS '7', s.exp" . $exploracion . "_cal_8 AS '8', s.exp" . $exploracion . "_cal_9 AS '9',
										s.exp" . $exploracion . "_cal_10 AS '10', s.exp" . $exploracion . "_cal_pts AS pt, s.exp" . $exploracion . "_cal_pv AS 1v,
										CASE s.exp" . $exploracion . "_cal_nivel  WHEN 1 THEN 'sem_rojo.png'  WHEN 2 THEN 'sem_amarillo.png'  WHEN 3 THEN 'sem_verde.png'  END AS 'nivel'
										FROM expediente_" . $sufijo . " e
										INNER JOIN alumno a ON a.idalumno = e.idalumno
										INNER JOIN grupo_" . $sufijo . " g ON g.idgrupo = e.idgrupo
										INNER JOIN centrocfg c ON c.idcentrocfg = g.idcentrocfg
										INNER JOIN cct ct ON ct.idct = c.idct

										LEFT JOIN sisat_{$sufijo} s ON s.idexpediente = e.idexpediente
										WHERE e.status='A' AND g.idgrupo=" . $idgrupo . "
										" . $ordemaniento . ' ' . $inorder;
   } else {
    $str_query = "
										SELECT e.idexpediente,CONCAT_WS(' / ', a.apell1, a.apell2,  a.nombre) AS nombrecompleto,a.curp,
										ct.cct, CONCAT(g.grado, '-', g.grupo) AS gradogrupo,
										g.idcentrocfg,c.idct,c.nivel AS nivel,ct.cct,a.idalumno, '0' as pf,
										s.exp" . $exploracion . "_" . $opcion . "_1 AS '1', s.exp" . $exploracion . "_" . $opcion . "_2 AS '2', s.exp" . $exploracion . "_" . $opcion . "_3 AS '3',
										s.exp" . $exploracion . "_" . $opcion . "_4 AS '4', s.exp" . $exploracion . "_" . $opcion . "_5 AS '5', s.exp" . $exploracion . "_" . $opcion . "_6 AS '6', ' ' AS '7',
										s.exp" . $exploracion . "_" . $opcion . "_pts AS 'pt',
										CASE s.exp" . $exploracion . "_" . $opcion . "_nivel  WHEN 1 THEN 'sem_rojo.png'  WHEN 2 THEN 'sem_amarillo.png'  WHEN 3 THEN 'sem_verde.png'  END AS 'nivel'
										FROM expediente_" . $sufijo . " e
										INNER JOIN alumno a ON a.idalumno = e.idalumno
										INNER JOIN grupo_" . $sufijo . " g ON g.idgrupo = e.idgrupo
										INNER JOIN centrocfg c ON c.idcentrocfg = g.idcentrocfg
										INNER JOIN cct ct ON ct.idct = c.idct

										LEFT JOIN sisat_" . $sufijo . " s ON s.idexpediente = e.idexpediente
										WHERE e.status='A' AND g.idgrupo=" . $idgrupo . "
										" . $ordemaniento . ' ' . $inorder;
   }
   // print_r($str_query);
   // die();
   return $this->db->query($str_query)->result_array();
   // return $query->result_array();
  }
 }

// get_alumnos_xgrupo()
// get_alumnos_xgrupo_supervision
 public function get_alumnos_xgrupo_supervision($idgrupo, $sufijo, $asignatura, $idopcion, $exploracion, $ordemaniento = '', $inorder = '') {
  $ordemaniento = ($ordemaniento == '') ? "ORDER BY nombrecompleto " : " ORDER BY " . $ordemaniento;
  if ($idgrupo != "0") {
   $opcion = '';

   if ($idopcion == "1") {
    $opcion = 'lec';
   } else if ($idopcion == "2") {
    $opcion = 'txt';
   }
   if ($asignatura == 'MATEMÁTICAS') {
    $str_query = "
            (
										SELECT e.idexpediente, CONCAT(' ', a.apell1,' / ',a.apell2,' / ',a.nombre) AS nombrecompleto, a.curp,
                    ct.cct, CONCAT(g.grado, '-', g.grupo) AS gradogrupo,
                    g.idcentrocfg,c.idct,c.nivel AS nivel,ct.cct,a.idalumno,  '0' as pf,
                    s.exp{$exploracion}_cal_1 AS '1', s.exp{$exploracion}_cal_2 AS '2', s.exp{$exploracion}_cal_3 AS '3',
                    s.exp{$exploracion}_cal_4 AS '4', s.exp{$exploracion}_cal_5 AS '5', s.exp{$exploracion}_cal_6 AS '6',
                    s.exp{$exploracion}_cal_7 AS '7', s.exp{$exploracion}_cal_8 AS '8', s.exp{$exploracion}_cal_9 AS '9',
                    s.exp{$exploracion}_cal_10 AS '10', '' AS '11', s.exp{$exploracion}_cal_pts AS pt, s.exp{$exploracion}_cal_pv AS 1v,
                    CASE s.exp{$exploracion}_cal_nivel  WHEN 1 THEN 'sem_rojo.png'  WHEN 2 THEN 'sem_amarillo.png'  WHEN 3 THEN 'sem_verde.png'  END AS 'nivel',
                    'escolar' AS tipousuario
                    FROM expediente_{$sufijo} e
                    INNER JOIN alumno a ON a.idalumno = e.idalumno
                    INNER JOIN grupo_{$sufijo} g ON g.idgrupo = e.idgrupo
                    INNER JOIN centrocfg c ON c.idcentrocfg = g.idcentrocfg
                    INNER JOIN cct ct ON ct.idct = c.idct
                    LEFT JOIN sisat_{$sufijo} s ON s.idexpediente = e.idexpediente
                    WHERE e.status='A' AND g.idgrupo= {$idgrupo}
              ) UNION ALL (
                  SELECT e.idexpediente,CONCAT_WS(' / ', a.apell1, a.apell2,  a.nombre) AS nombrecompleto,a.curp,
                    ct.cct, CONCAT(g.grado, '-', g.grupo) AS gradogrupo,
                    g.idcentrocfg,c.idct,c.nivel AS nivel,ct.cct,a.idalumno, '0' as pf,
                    s.exp{$exploracion}_cal_1 AS '1', s.exp{$exploracion}_cal_2 AS '2', s.exp{$exploracion}_cal_3 AS '3',
                    s.exp{$exploracion}_cal_4 AS '4', s.exp{$exploracion}_cal_5 AS '5', s.exp{$exploracion}_cal_6 AS '6',
                    s.exp{$exploracion}_cal_7 AS '7', s.exp{$exploracion}_cal_8 AS '8', s.exp{$exploracion}_cal_9 AS '9',
                    s.exp{$exploracion}_cal_10 AS '10', '' AS '11', s.exp{$exploracion}_cal_pts AS pt, s.exp{$exploracion}_cal_pv AS 1v,
                    CASE s.exp{$exploracion}_cal_nivel  WHEN 1 THEN 'sem_rojo.png'  WHEN 2 THEN 'sem_amarillo.png'  WHEN 3 THEN 'sem_verde.png'  END AS 'nivel',
                    'supervisor' AS tipousuario
                    FROM expediente_{$sufijo} e
                    INNER JOIN alumno a ON a.idalumno = e.idalumno
                    INNER JOIN grupo_{$sufijo} g ON g.idgrupo = e.idgrupo
                    INNER JOIN centrocfg c ON c.idcentrocfg = g.idcentrocfg
                    INNER JOIN cct ct ON ct.idct = c.idct
                    INNER JOIN sisat_superv_{$sufijo} s ON s.idexpediente = e.idexpediente
                    WHERE e.status='A' AND g.idgrupo= {$idgrupo}
              ) ORDER BY idexpediente, nombrecompleto";
   } else {
    $str_query = "
						(
							SELECT e.idexpediente, CONCAT(' ', a.apell1,' / ',a.apell2,' / ',a.nombre) AS nombrecompleto, a.curp,
								ct.cct, CONCAT(g.grado, '-', g.grupo) AS gradogrupo,
								g.idcentrocfg,c.idct,c.nivel AS nivel,ct.cct,a.idalumno, '0' as pf,
								s.exp{$exploracion}_{$opcion}_1 AS '1', s.exp{$exploracion}_{$opcion}_2 AS '2', s.exp{$exploracion}_{$opcion}_3 AS '3',
								s.exp{$exploracion}_{$opcion}_4 AS '4', s.exp{$exploracion}_{$opcion}_5 AS '5', s.exp{$exploracion}_{$opcion}_6 AS '6', ' ' AS '7',
								s.exp{$exploracion}_{$opcion}_pts AS 'pt',
								CASE s.exp{$exploracion}_{$opcion}_nivel  WHEN 1 THEN 'sem_rojo.png'  WHEN 2 THEN 'sem_amarillo.png'  WHEN 3 THEN 'sem_verde.png'  END AS 'nivel',
								'escolar' AS tipousuario
							FROM expediente_{$sufijo} e
							INNER JOIN alumno a ON a.idalumno = e.idalumno
							INNER JOIN grupo_{$sufijo} g ON g.idgrupo = e.idgrupo
							INNER JOIN centrocfg c ON c.idcentrocfg = g.idcentrocfg
							INNER JOIN cct ct ON ct.idct = c.idct
							LEFT JOIN sisat_{$sufijo} s ON s.idexpediente = e.idexpediente
							WHERE e.status='A' AND g.idgrupo={$idgrupo}

						)
						#
						UNION ALL
						(
							SELECT
								e.idexpediente,
								CONCAT_WS(' / ', a.apell1, a.apell2,  a.nombre) AS nombrecompleto, a.curp,
								ct.cct, CONCAT(g.grado, '-', g.grupo) AS gradogrupo,
								g.idcentrocfg,c.idct,c.nivel AS nivel,ct.cct,a.idalumno, '0' as pf,
								sup.exp{$exploracion}_{$opcion}_1 AS '1_sup', sup.exp{$exploracion}_{$opcion}_2 AS '2_sup', sup.exp{$exploracion}_{$opcion}_3 AS '3_sup',
								sup.exp{$exploracion}_{$opcion}_4 AS '4_sup', sup.exp{$exploracion}_{$opcion}_5 AS '5_sup', sup.exp{$exploracion}_{$opcion}_6 AS '6_sup', ' ' AS '7_sup',
								sup.exp{$exploracion}_{$opcion}_pts AS 'pt_sup',
								CASE sup.exp{$exploracion}_{$opcion}_nivel  WHEN 1 THEN 'sem_rojo.png'  WHEN 2 THEN 'sem_amarillo.png'  WHEN 3 THEN 'sem_verde.png'  END AS 'nivel',
								'supervisor' AS tipousuario
							FROM expediente_{$sufijo} e
							INNER JOIN alumno a ON a.idalumno = e.idalumno
							INNER JOIN grupo_{$sufijo} g ON g.idgrupo = e.idgrupo
							INNER JOIN centrocfg c ON c.idcentrocfg = g.idcentrocfg
							INNER JOIN cct ct ON ct.idct = c.idct

							INNER JOIN sisat_superv_{$sufijo} sup ON sup.idexpediente = e.idexpediente
							WHERE e.status='A' AND g.idgrupo={$idgrupo}
						)
						ORDER BY idexpediente, nombrecompleto
						";
   }
   // print_r($str_query);
   // die();
   return $this->db->query($str_query)->result_array();
   // return $query->result_array();
  }
 }

// get_alumnos_xgrupo()

 public function getDocumentoDigital($idAlumno, $idDoc) {
  $r = null;
  $q = "SELECT i.imagen
           FROM req_digital i
           left join reqdigxalumno ixa on ixa.idreq_digital = i.idreq_digital
           where ixa.idalumno = '$idAlumno' and ixa.idrequisito = '$idDoc'";
  $query = $this->db->query($q);
  $rs = $query->result_array();
  //echo $this->db->last_query();
  if (isset($rs[0]['imagen']))
   $r = $rs[0]['imagen'];

  return $r;
 }

 public function get_alumn_gg_xidexp($idExpediente, $subfijo) {
  $query = $this->db->query("
															 select e.idalumno,e.idexpediente,e.status,concat_ws(' / ',  a.apell1, a.apell2, a.nombre) as nombrecompleto,e.idgrupo,
																			concat_ws('-',g.grado,g.grupo) as grado_grupo
																from expediente_$subfijo  e
																left join alumno a on a.idalumno=e.idalumno
																left join grupo_$subfijo g ON g.idgrupo = e.idgrupo
																left join  centrocfg c ON c.idcentrocfg = g.idcentrocfg
																where e.idexpediente='$idExpediente' ");

  return $query->result_array();
 }

}

/* 20190324 MH
 public function getMisRequisitos($id) {
  $query = $this->db->query("select * from requisitoxalumno_$this->subfijo where idexpediente='$id' ");
  return $query->result_array();
 }
 */
