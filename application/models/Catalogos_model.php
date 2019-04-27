<?php

class Catalogos_model extends CI_Model {

	public function __construct() {
		$this->load->database();
        //$this->usuario = $this->utilswrapper->get_usuario_sesion($this);
	}

	public function getPaises() {
		$query = $this->db->query("SELECT * FROM pais order by pre_order,nombre");
		return $query->result();
	}

	public function getEtnias() {
		$query = $this->db->query('SELECT * FROM etnia');
		return $query->result();
	}

	public function getEntidades() {
		// $query = $this->db->query('SELECT * FROM entidad where nombre = "PUEBLA" union
  //                                  SELECT * FROM entidad where nombre <> "PUEBLA" and nombre <> "EXTRANJERO" ');
		$str_query = " SELECT * FROM entidad WHERE nombre = 'PUEBLA' UNION
                   SELECT * FROM entidad WHERE nombre <> 'PUEBLA' AND nombre <> 'EXTRANJERO' AND nombre <> 'NO DEFINIDA' UNION
                   SELECT * FROM entidad WHERE nombre = 'NO DEFINIDA'
									";
		$query = $this->db->query($str_query);
		return $query->result();
	}

	public function getMunicipios() {
		$query = $this->db->query('SELECT * FROM municipio WHERE municipio.identidad = '.CVE_ENTIDAD. ' ORDER BY FIELD (nombre,"NO DEFINIDO") ASC,nombre');
		return $query->result();
	}

	public function getGrupos($idctcfg = "", $subfijo=NULL) {
		if ($subfijo == NULL)
		{
			//buscar que nivel es para saber subfijo de tablas
			$nivel = $this->db->query("SELECT nivel FROM centrocfg where idcentrocfg = $idctcfg")->result();

            $nivel= $nivel[0]->nivel;

			if ($nivel == 1){
				$subfijo = 'pree';
			} else if ($nivel == 2) {
				$subfijo = 'prim';
			}else{
				$subfijo = 'sec';
			}
		}
		$q = "SELECT grupo_$subfijo.*,c.nivel FROM grupo_$subfijo left join centrocfg c on c.idcentrocfg = grupo_$subfijo.idcentrocfg where grupo_$subfijo.idcentrocfg = $idctcfg  and grupo_$subfijo.status = 1  order by grado, grupo";
		// echo $q; die();
		$query = $this->db->query($q);
		return $query->result();
	}

	public function getLocalidades($municipio = "") {
		$q = "SELECT * FROM localidad where idmunicipio = '$municipio' AND identidad =".CVE_ENTIDAD."  ORDER BY nombre ASC";
		// echo $q;
		$query = $this->db->query($q);
		return $query->result();
	}

	public function getCTs($ct,$nivel,$zona, $usuario_sesion) {
				 $where =" WHERE (cct.cct like '%$ct%' or cct.nombre like '%$ct%') AND cct.`status` IN ('A', 'R') AND centrocfg.tipo_ct = ".IDTIPOESCUELA;

         if($nivel !== "")
            $where.=" AND n.subfijo='$nivel' ";

         if($zona !== "")
            $where.=" AND cct.zona='$zona' ";
				 if((int)$usuario_sesion->idtipousuario==IDREGIONALCENTRAL)
            $where.=" AND cct.region = '{$this->session->datos_usuario->region}' ";
				 if((int)$usuario_sesion->idtipousuario==IDSUPERVISOR){
					 $idcentrocfg = (int)$usuario_sesion->idcentrocfg;
					 $str_query = " SELECT cz.cct as clavect,cz.nivel,cfg2.turno,cct.nombre,cfg2.idcentrocfg,m.nombre AS municipio,cct.zona,n.subfijo
							FROM cct_zona cz
							LEFT JOIN centrocfg cfg ON cfg.idct = cz.idctzona
							LEFT JOIN cct ON cct.idct = cz.idct
							LEFT JOIN centrocfg cfg2 ON cfg2.idct = cct.idct
							LEFT JOIN niveleducativo n ON n.idnivel = cfg2.nivel
							LEFT JOIN municipio m  ON m.idmunicipio = cct.municipio AND m.identidad = ".CVE_ENTIDAD."
							WHERE cfg.idcentrocfg = {$idcentrocfg} AND cct.status IN ('A', 'R') AND cfg.tipo_ct = ".IDTIPOESCUELA;
         }else{
         	$str_query = " SELECT cct.cct as clavect,cct.nivel,centrocfg.turno,cct.nombre,idcentrocfg,municipio.nombre as municipio,cct.zona,n.subfijo
			FROM centrocfg
			LEFT JOIN cct ON cct.idct = centrocfg.idct
			LEFT JOIN niveleducativo n ON n.idnivel = centrocfg.nivel
			LEFT JOIN municipio ON municipio.idmunicipio = cct.municipio AND municipio.identidad = ".CVE_ENTIDAD."
			$where ";
         }
		// echo  $str_query; die();
         $query = $this->db->query($str_query);
		return $query->result_array();
	}

	public function getColonias() {
		$query = $this->db->query("SELECT * FROM colonias");
		return $query->result();
	}

	public function getProfesiones() {
		$query = $this->db->query("SELECT * FROM profesiones");
		return $query->result();
	}

	public function get_niveles() {
		$query = $this->db->query("SELECT * FROM niveleducativo");
		return $query->result();
	}

	public function get_nivelesAsigAdd($idsnivel) {
		$query = $this->db->query("SELECT * FROM niveleducativo WHERE idnivel IN({$idsnivel})");
		return $query->result();
	}



	public function get_nivelesapp() {
		$query = $this->db->query("SELECT idnivelapp,descr FROM nivelapp");
		return $query->result();
	}

	public function get_regiones() {
		$this->db->distinct();
		$this->db->select('region');
		$this->db->from('municipio');
		$this->db->where('region is not null');
		$query = $this->db->get();
		return $query->result();
	}

	public function get_municipios($region = NULL) {
		$this->db->select('idmunicipio,nombre');
		$this->db->from('municipio');
		if ($region != NULL)
			$this->db->where('region=trim(\'' . $region . '\')');
		$query = $this->db->get();
		$muns = array();
		if ($query->result()) {
			foreach ($query->result() as $mun) {
				$muns[$mun->idmunicipio] = $mun->nombre;
			}
			return $muns;
		} else {
			return false;
		}
	}

	public function get_zonas($mun = NULL) {
		$this->db->distinct();
		$this->db->select('zona');
		$this->db->from('cct');
		if ($mun != NULL)
			$this->db->where('municipio=' . $mun);
		$this->db->order_by('zona', 'DESC');
		$query = $this->db->get();
		$zonas = array();
		if ($query->result()) {
			foreach ($query->result() as $zona) {
				$zonas[$zona->zona] = $zona->zona;
			}
			return $zonas;
		} else {
			return false;
		}
	}

	public function get_escuelas($mun = NULL, $zona = NULL) {
		if ($mun == NULL0)
			return false;
		$this->db->select('idcentrocfg, centrocfg.idct, cct.cct as clave, centrocfg.nivel as nivelcfg, centrocfg.turno as turnocfg, municipio, localidad, zona, nombre');
		$this->db->from('centrocfg');
		$this->db->join('cct', 'cct.idct = centrocfg.idct');

		if ($mun != NULL)
			$this->db->where('municipio=' . $mun);
		if ($zona != NULL)
			$this->db->where('zona=' . $zona);

		$this->db->order_by('zona DESC, cct.cct DESC');
		$query = $this->db->get();
		//echo '<PRE>' ;      print_r($this->db->last_query());
		$escuelas = array();
		if ($query->result()) {
			foreach ($query->result() as $escuela) {
				$escuelas[$escuela->idcentrocfg] = $escuela->clave . ' - ' . $escuela->nombre . ' - ' . $escuela->turnocfg;
			}
			return $escuelas;
		} else {
			return false;
		}
	}

	public function getTransnacional() {
		$query = $this->db->query("SELECT * FROM c_procedencia");
		return $query->result();
	}

	public function getNecesidades() {
		$q = "SELECT * FROM necesidades";
		$query = $this->db->query($q);
		return $query->result_array();
	}

	public function getApoyos() {
		$q = "SELECT * FROM apoyo";
		$query = $this->db->query($q);
		return $query->result_array();
	}

	public function getRequisitos() {
		$q = "SELECT * FROM requisitos";
		$query = $this->db->query($q);
		return $query->result_array();
	}

	public function getServiciosMedicos() {
		$q = "SELECT * FROM servicio_medico";
		$query = $this->db->query($q);
		//echo  $this->db->last_query();

		return $query->result_array();
	}

	public function getFotoMotivosRechazo() {
		$q = "SELECT * FROM foto_motivosrechazo";
		$query = $this->db->query($q);
		return $query->result_array();
		//echo  $this->db->last_query();
	}

	public function getGrupo($idGrupo,$subfijo) {
		$q = "SELECT g.idgrupo,g.grado,g.grupo,g.idplan,g.idcentrocfg FROM grupo_".strtolower($subfijo)." g where g.idgrupo = '$idGrupo'";
		$query = $this->db->query($q);
		//echo  $this->db->last_query();
		return $query->result_array();
	}

	public function getUniforme($concepto, $genero) {
		$query = $this->db->query("SELECT talla FROM uniformes where idnivel=1 and genero = '$genero' and
			concepto = '$concepto' ORDER BY CAST(talla AS UNSIGNED) ASC");
		// echo "SELECT talla FROM uniformes where idnivel=1 and genero = '$genero' and
		// 	concepto = '$concepto' order by talla asc";
		// 	die();
		return $query->result();
	}

	public function getMotivosBaja() {
		$q = "SELECT id_baja,descripcion,
                     CONCAT((case when nivel_pree = 1 then ' pree' else '' end),
                            (case when nivel_prim = 1 then ' prim' else '' end),
                            (case when nivel_sec = 1 then ' sec' else '' end))  as niveles
              FROM c_bajas_alumno
              WHERE estatus='A'";
		$query = $this->db->query($q);
		return $query->result_array();
		//echo  $this->db->last_query();
	}

	public function getParentesco() {
		$query = $this->db->query("SELECT * FROM parentesco");
		return $query->result();
	}

  public function getnivelesImc() {
		$query = $this->db->query("SELECT descripcion FROM nivel_imc");
		return json_encode($query->result_array());
	}

	public function get_ccts($ct,$nivel) {
	    $concat ="";
	    if(strlen($ct)>0){
	      $concat .= "WHERE (cct.cct LIKE '$ct%' OR cct.nombre LIKE '%$ct%') ";
	    }
	    if(strlen($nivel)>0){
	      $concat.=" AND n.subfijo='$nivel' ";
	    }
	    $query = $this->db->query("
	      SELECT cct.cct as clavect,centrocfg.turno,cct.nombre,idcentrocfg,municipio.nombre as municipio,cct.zona, n.subfijo
	      FROM centrocfg
	      LEFT JOIN cct ON cct.idct = centrocfg.idct
	      LEFT JOIN niveleducativo n ON n.idnivel = centrocfg.nivel
	      LEFT JOIN municipio ON municipio.idmunicipio = cct.municipio
	      $concat ");
	    return $query->result_array();
	}

        public function get_parametros() {
		$q = "SELECT * FROM parametro";
		$query = $this->db->query($q);
		return $query->result_array();
	}


	public function get_niveles_xids($idsnivel) { // MH 20180829
		$str_query = "SELECT idnivel, descr AS nivel
									FROM niveleducativo
									WHERE idnivel IN({$idsnivel})
									";
		return $this->db->query($str_query)->result_array();
	}// get_niveles_xids()

	public function get_regiones_all() { // MH 20180829
		$str_query = " SELECT idregion, nombre AS nombre_region
					   FROM c_region
					   ";
		return $this->db->query($str_query)->result_array();
	}// get_niveles_xids()

	public function get_regiones_xids($idsregiones) { // MH 20180829
		$str_query = " SELECT idregion, nombre AS nombre_region
					   FROM c_region
					   WHERE idregion IN({$idsregiones})
					   ";
		return $this->db->query($str_query)->result_array();
	}// get_niveles_xids()


	public function getGrupos2($idctcfg = "", $subfijo=NULL) {
		if ($subfijo == NULL)
		{
			//buscar que nivel es para saber subfijo de tablas
			$nivel = $this->db->query("SELECT nivel FROM centrocfg where idcentrocfg = $idctcfg")->result();

            $nivel= $nivel[0]->nivel;
			if ($nivel == 1){
				$subfijo = 'pree';
			} else if ($nivel == 2) {
				$subfijo = 'prim';
			}else{
				$subfijo = 'sec';
			}
		}
		$q = "SELECT grupo_$subfijo.*,c.nivel FROM grupo_$subfijo left join centrocfg c on c.idcentrocfg = grupo_$subfijo.idcentrocfg where grupo_$subfijo.idcentrocfg = $idctcfg  and grupo_$subfijo.status = 1 order by grado, grupo";
		$query = $this->db->query($q);
		return $query->result_array();
	}

	function getGrupos_club($idctcfg, $subfijo=NULL){
		if ($subfijo == NULL){
			//buscar que nivel es para saber subfijo de tablas
			$nivel = $this->db->query("SELECT nivel FROM centrocfg where idcentrocfg = $idctcfg")->result();

            $nivel= $nivel[0]->nivel;
			if ($nivel == 1){
				$subfijo = 'pree';
			} else if ($nivel == 2) {
				$subfijo = 'prim';
			}else{
				$subfijo = 'sec';
			}
		}
		$str_query = "SELECT CONCAT(gc.idgrupo_club, '-club') AS idgrupo_club, CONCAT(c.descripcion, ' - ',gc.grupo )AS grupo
			FROM grupo_club_{$subfijo} gc
			INNER JOIN clubxescuela cxe ON cxe.idclub = gc.idclub AND cxe.idcentrocfg = gc.idcentrocfg
			INNER JOIN c_club c ON c.idclub = cxe.idclub
			WHERE gc.idcentrocfg = {$idctcfg}
			GROUP BY gc.idgrupo_club";

		$query = $this->db->query($str_query);
		return $query->result_array();
	}
//Esta funcion nos recupera el el idcentrocfg pasandole la cct de la escuela interesada en especial para los supervisores
	function getidcentrocfgxcct($cct){
		$str_query = "SELECT cfg.idcentrocfg FROM cct ct
		INNER JOIN centrocfg cfg ON cfg.idct = ct.idct
		WHERE ct.cct = '{$cct}' ";
		$query = $this->db->query($str_query);
		return $query->result_array();
	}

	public function getidGrupoxidexp($idexp,$subfijo) {
		$q = "SELECT idgrupo FROM expediente_{$subfijo} WHERE idexpediente={$idexp}";
		return $this->db->query($q)->row('idgrupo');
	}

}
