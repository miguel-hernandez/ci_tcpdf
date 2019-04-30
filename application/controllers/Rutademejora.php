<?php
class Rutademejora extends CI_Controller {
	private $arr_columnas_grid;
	private $idkey;

	public function __construct() {
		parent::__construct();
		$this->load->helper('url');
		$this->load->library('session');
		$this->load->model('Rutademejora_model');

		$this->load->model('Cct_model');
		$this->load->model('centrocfg_model');
		$this->load->model('seguridad_model');

		$this->load->library('UtilsWrapper');

		$this->load->library('Grid_paginador');


		$this->arr_columnas_grid = array( "idrutamtema"=>array("type"=>"hidden", "header"=>"id"),
			"orden"=>array("type"=>"text", "header"=>"Orden","width"=>"4%"),
			"tema"=>array("type"=>"text", "header"=>"Temas prioritarios","width"=>"20%"),
			"problemas"=>array("type"=>"text", "header"=>"Problemáticas","width"=>"31%"),
			"evidencias"=>array("type"=>"text", "header"=>"Evidencias","width"=>"31%"),
			"n_actividades"=>array("type"=>"text", "header"=>"Actividades","width"=>"8%"),
			"objetivo"=>array("type"=>"icono", "header"=>"Objetivo","width"=>"6%")
		);
		$this->idkey = "idrutamtema";
	}// __construct()

	public function index() {
			$idcentrocfg = 1564;

					$arr_datos = $this->get_prioridades($idcentrocfg);
					$grid = new Grid_paginador();
					$grid->set_configs($this->arr_columnas_grid,$arr_datos,$this->idkey,"info");
					$html = $grid->get_table();
					$data["supervisor"]="no";
					$data["grid"]=$html;
					$data["tema"] = $this->Rutademejora_model->get_temas();
					$data["problematica"] = $this->Rutademejora_model->get_problematicas();
					$data["evidencia"] = $this->Rutademejora_model->get_evidencias();
					$auxprog_apoy = $this->Rutademejora_model->get_prog_apoy($idcentrocfg);
					$data["prog_apoy"] = $auxprog_apoy;
					$this->arr_columnas_grid = array(
						"idprog"=>array("type"=>"hidden", "header"=>"id"),
						"no"=>array("type"=>"text", "header"=>"No.","width"=>"5%"),
						"nombre"=>array("type"=>"text", "header"=>"Nombre del programa	","width"=>"65%"),
						"vigente"=>array("type"=>"icono", "header"=>"Vigente","width"=>"30%")
					);
					$data["idcentrocfg"]=$idcentrocfg;
					$this->idkey = "idprog";
					$countfe=1;
					$auxsimbol="<span class='glyphicon glyphicon-ok'></span>";
					$arr_datos=[];
					foreach ($auxprog_apoy as $item) {
						array_push($arr_datos,array("idprog"=>$item['idprograma'],"no"=>$countfe,"nombre"=>$item['descripcion'],"vigente"=>$auxsimbol));
						$countfe++;
					}
					$gridpa = new Grid_paginador();
					$gridpa->set_configs($this->arr_columnas_grid,$arr_datos,$this->idkey ,"info");
					$html = $gridpa->get_table();
					$data["gridpa"]=$html;
					// echo "<pre>";print_r($data);die();
					$indicadores = $this->Rutademejora_model->get_indicadores();
					UtilsWrapper::carga_pagina_basica($this, "rutademejora/index", $data);
	}// index()

	function get_prioridades($idcentrocfg){
		$arr_datos = $this->Rutademejora_model->get_prioridades($idcentrocfg);
		$arr_datos2 = $arr_datos;
		$idactual = 0;
		$arr_finish = array();
		$arr_ids = array();
		foreach ($arr_datos2 as $item2) {
			if (!in_array($item2["idrutamtema"], $arr_ids)) {
			    $arr_ids[] = $item2["idrutamtema"];
			}
		}

		foreach ($arr_datos as $item) {
			$objetivo = ($item["objetivo"]=="")?$item["objetivo"]:"<span class='glyphicon glyphicon-ok' aria-hidden='true'></span>";
			$arr_finish_aux = array("idrutamtema"=>0,"orden"=>0,"tema"=>"","problemas"=>"","evidencias"=>"","indicador"=>"","n_actividades"=>"","objetivo"=>"");
			$problemas = "";
			$evidencias = "";
			$idactual = $item["idrutamtema"];
			$arr_finish_aux["idrutamtema"] =  $item["idrutamtema"];
			$arr_finish_aux["orden"] =  $item["orden"];
			$arr_finish_aux["tema"] =  $item["tema"];
			$arr_finish_aux["problemas"] =  $problemas;
			$arr_finish_aux["evidencias"] =  $evidencias;
			$arr_finish_aux["indicador"] =  $item["indicador"];
			$arr_finish_aux["n_actividades"] =  "";
			$arr_finish_aux["objetivo"] =  $objetivo;

			array_push($arr_finish,$arr_finish_aux);

		}

		// Llamamos a la función que nos va a eliminar duplicados
		$arr = $this->unique_multidim_array($arr_finish,"idrutamtema");

		// Reajustar los índices
		$arr_f = array();
		foreach ($arr as $item2) {
			$arr_f[] = $item2;
		}

		// Insertar el número de evidencias al array
		$arr_ok = array();
		foreach ($arr_f as $item) {
			$arr_au = array("idrutamtema"=>0,"orden"=>0,"tema"=>"","problemas"=>"","evidencias"=>"","indicador"=>"","n_actividades"=>"","objetivo"=>"");
			$idtema = $item["idrutamtema"];
			$arr_acts = $this->Rutademejora_model->get_numacts_idrutamtema($idtema);
			$arr_problems = $this->Rutademejora_model->get_problemsxidrutamtema($idtema);
			$str_problems = "";
			if(count($arr_problems)>0){
				foreach ($arr_problems as $item2) {
					$str_problems .= $item2["descripcion"].", ";
				}
			}
			$str_problems = substr($str_problems, 0, -2);

			$arr_evidens = $this->Rutademejora_model->get_evidenciasxidrutamtema($idtema);
			$str_evidencias = "";
			if(count($arr_evidens)>0){
				foreach ($arr_evidens as $item3) {
					$str_evidencias .= $item3["descripcion"].", ";
				}
			}
			$str_evidencias = substr($str_evidencias, 0, -2);
			$arr_au["idrutamtema"] =  $item["idrutamtema"];
			$arr_au["orden"] =  $item["orden"];
			$arr_au["tema"] =  $item["tema"];
			$arr_au["problemas"] =  $str_problems;
			$arr_au["evidencias"] =  $str_evidencias;
			$arr_au["indicador"] =  $item["indicador"];
			$arr_au["n_actividades"] =  $arr_acts[0]["n_actividades"];;
			$arr_au["objetivo"] =  $item["objetivo"];
			array_push($arr_ok,$arr_au);
		}
		$arr_au = $arr_f = $arr_finish = $arr_ids = $arr_finish_aux = $arr = NULL;
		unset($arr_au,$arr_f,$arr_finish,$arr_ids,$arr_finish_aux,$arr); // limpiar por completo
		// Retornamos
		return $arr_ok;
	}// get_prioridades()

	function unique_multidim_array($array, $key) {
	    $temp_array = array();
	    $i = 0;
	    $key_array = array();
	    foreach($array as $val) {
	        if (!in_array($val[$key], $key_array)) {
	            $key_array[$i] = $val[$key];
	            $temp_array[$i] = $val;
	        }
	        $i++;
	    }
	    return $temp_array;
	}// unique_multidim_array()

	public function get_identidad(){
		if (UtilsWrapper::verifica_sesion_redirige($this)) {
			$usuario = UtilsWrapper::get_usuario_sesion($this);
			$idcentrocfg = $usuario->idcentrocfg;
			$estatus_insert = $this->Rutademejora_model->getident($idcentrocfg);
			$html = $estatus_insert;

			$response = array('tabla' => $html);

			UtilsWrapper::enviaDataJson(200, $response, $this);
			exit;
		}

	}// get_identidad()

	public function get_cadpdf(){
		if (UtilsWrapper::verifica_sesion_redirige($this)) {
			$usuario = UtilsWrapper::get_usuario_sesion($this);
			$idcentrocfg = $usuario->idcentrocfg;
			$url_apaini = "http://acasonora.org/";
			$porciones = explode("@", $usuario->username);
			$porciones2 = explode(".", $porciones[1]);
			$cct_apa = $porciones2[0];
			$turno_apa = $porciones2[1];
			$id_nivel = $usuario->ids_niveles[0];
			$centro_cfg = $this->centrocfg_model->get_centrocfg($usuario->idcentrocfg);
			$cct = $this->cct_model->get_cct($centro_cfg["idct"]);
			$momento_o_bim = '';
			switch ($id_nivel) {
				case 1:
					$nivel_apa = "PRE";
					$momento_o_bim = 'M';
				break;
				case 2:
					$nivel_apa = "PRIM";
					$momento_o_bim = 'B';
				break;
				case 3:
					$nivel_apa = "SECU";
					$momento_o_bim = 'B';
				break;
			}
			//0 Necesitamos 3 digitos para la zona, así está la nomenclatura de los pdfs
			$zona_apa =   (strlen($cct["zona"])==1)?"00".$cct["zona"]:((strlen($cct["zona"])==2)?"0".$cct["zona"]:$cct["zona"]);
			$rp1 = $url_apaini."Reportes/ACA_".$nivel_apa."1".substr($momento_o_bim, 0, 1)."_1617/".$cct_apa."T".$turno_apa.$zona_apa."_01_1617.pdf";

			$rp2  = $url_apaini."Reportes/ACA_".$nivel_apa."2".substr($momento_o_bim, 0, 1)."_1617/".$cct_apa."T".$turno_apa.$zona_apa."_02_1617.pdf";

			$rp3  = $url_apaini."Reportes/ACA_".$nivel_apa."3".substr($momento_o_bim, 0, 1)."_1617/".$cct_apa."T".$turno_apa.$zona_apa."_03_1617.pdf";

			$rp4  = $url_apaini."Reportes/ACA_".$nivel_apa."4".substr($momento_o_bim, 0, 1)."_1617/".$cct_apa."T".$turno_apa.$zona_apa."_04_1617.pdf";

			$rp5  = $url_apaini."Reportes/ACA_".$nivel_apa."5".substr($momento_o_bim, 0, 1)."_1617/".$cct_apa."T".$turno_apa.$zona_apa."_05_1617.pdf";

			$response = array(
			'cadena1bool' => UtilsWrapper::wb_serv_validarapa($rp1),'cadena1' => $rp1,
			'cadena2bool' => UtilsWrapper::wb_serv_validarapa($rp2),'cadena2' => $rp2,
			'cadena3bool' => UtilsWrapper::wb_serv_validarapa($rp3),'cadena3' => $rp3,
			'cadena4bool' => UtilsWrapper::wb_serv_validarapa($rp4),'cadena4' => $rp4,
			'cadena5bool' => UtilsWrapper::wb_serv_validarapa($rp5),'cadena5' => $rp5);

			UtilsWrapper::enviaDataJson(200, $response, $this);
			exit;
		}

	}// get_cadpdf()

}// class
