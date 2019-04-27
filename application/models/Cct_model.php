<?php

class Cct_model extends CI_Model {

    function __construct() {
        parent::__construct();
        $this->load->library('UtilsWrapper');

    }

    /*
     * acceso a un elemento de el cct
     * devuelve un arreglo con los datos de ese id
     */

    function get_cct($idct) {
        // echo $idct;die();
        return $this->db->get_where('cct', array('idct' => $idct))->row_array();

    }

    /*
     * busqueda nivel,busqueda zona y busqueda muni son filtros
     * consulta sobre cct en base a los filtros
     * devuelve toda la consulta
     * Adolfo: se ajusto el método para que tome el centrocfg como campos para SICEP y pace
     * cambio el id a idcentrocfg y campos SICEP y pace de la misma tabla.
     */

    function get_sql_listado_escuelas($usuario_sesion, $nivel, $region, $municipio, $zona, $cct) {
      // echo "<pre>";print_r($nivel);die();
        $filter = array();
        switch ($usuario_sesion->tipo->idtipousuario) {
            case IDADMINCENTRAL:
                if ($nivel != null && $nivel != "") {
                    $filter[] = " cf.nivel = " . $nivel;
                }
                if ($region != null && $region != "") {
                    $filter[] = " m.region = \"" . $region . "\"";
                }
                break;
            case IDCENTRAL:
                if (is_array($usuario_sesion->ids_niveles)) {
                    if ($nivel != "" && in_array($nivel, $usuario_sesion->ids_niveles)) {
                        $filter[] = " cf.nivel = " . $nivel;
                    } else {
                        $str_niveles = implode(",", $usuario_sesion->ids_niveles);
                        $filter[] = " cf.nivel in (" . $str_niveles . ")";
                    }
                } else {
                    if ($nivel == $usuario_sesion->ids_niveles) {
                        $filter[] = " cf.nivel = " . $nivel;
                    } else {
                        $filter[] = " cf.nivel = " . $usuario_sesion->ids_niveles;
                    }
                }
                if ($region != null && $region != "") {
                    $filter[] = " m.region = " . $region;
                }
                break;
            case IDREGIONALCENTRAL:
                if (is_array($usuario_sesion->ids_niveles)) {
                    if ($nivel != "" && in_array($nivel, $usuario_sesion->ids_niveles)) {
                        $filter[] = " cf.nivel = " . $nivel;
                    } else {
                        $str_niveles = implode(",", $usuario_sesion->ids_niveles);
                        $filter[] = "cf.nivel in (" . $str_niveles . ")";
                    }
                } else {
                    if ($nivel == $usuario_sesion->ids_niveles) {
                        $filter[] = " cf.nivel = " . $nivel;
                    } else {
                        $filter[] = " cf.nivel = " . $usuario_sesion->ids_niveles;
                    }
                }
                $filter[] = " m.region = " . $usuario_sesion->region;
                break;
            default:

                break;
        }


        if ($municipio != null && $municipio != "") {
            $filter[] = " m.idmunicipio = " . $municipio;
        }
        if ($zona != null && $zona != "") {
            if ($zona != null && $zona != "") {
                if ($zona != 'TODAS LAS ZONAS') {
                    $filter[] = " zona = " . $zona;
                }
                //  $filter[] = " zona = " . $zona;
            }
        }

        if ($cct != null && $cct != "") {
            $filter[] = " cc.cct = \"" . $cct . "\" OR zonacct.cct = '{$cct}'";
        }

        $filter[]=" cf.tipo_ct IN(".IDTIPOESCUELA.", 2) ORDER BY usuario ASC ";
        $where =  " WHERE " . implode(" AND ", $filter) ;


		   return "SELECT DISTINCT
						cc.cct,
						s.username as usuario,
						cc.idct,
						cc.nombre,
						(CASE
							 WHEN cc.turno = '100' THEN 'M'
							 WHEN cc.turno = '200' THEN 'V'
							 WHEN cc.turno = '300' THEN 'N'
							 WHEN cc.turno = '400' THEN 'D'
							 WHEN cc.turno = '500' THEN 'C'
							 WHEN cc.turno = '700' THEN 'J'
							 WHEN cc.turno = '600' THEN 'P'
							 WHEN cc.turno = '800' THEN 'C'
							 WHEN cc.turno = '130' THEN 'M, N'
							 WHEN cc.turno = '123' THEN 'M, V, N'
							 WHEN cc.turno = '230' THEN 'V, N'
							 WHEN cc.turno = '124' THEN 'M, V, D'
							 WHEN cc.turno = '120' THEN 'M, V'
							 ELSE cc.turno
						END) AS turno,
            (CASE
							 WHEN cf.nivel = '1' THEN 'PRE'
							 WHEN cf.nivel = '2' THEN 'PRI'
							 WHEN cf.nivel = '3' THEN 'SEC'
							 ELSE cf.nivel
						END) AS nivel,
						cc.zona,
						m.nombre AS municipio,
						CAST(cf.sicres AS unsigned int) sicres,
						CAST(cf.pace AS unsigned int) pace,
						cf.idcentrocfg
				  FROM
						cct AS cc
							 INNER JOIN
						centrocfg AS cf ON cc.idct = cf.idct
                        LEFT JOIN cct_zona AS zonacct ON zonacct.idctzona = cf.idct
						  inner join
						municipio AS m ON cc.idmunicipio = m.idmunicipio
						  INNER JOIN
					  usuario u ON cf.idcentrocfg = u.idcentrocfg and u.idtipousuario IN (4,6)
						  left join
					  seguridad s on u.idusuario = s.idusuario $where";
    }

    function get_sql_listado_escuelas_kw_v2($usuario_sesion, $nivel, $region, $municipio, $zona, $cct,$ids_niveles_aux) {
        $concat = "";
        switch ($usuario_sesion->tipo->idtipousuario) {
            case IDADMINCENTRAL:
                if ($nivel != NULL && $nivel != "") {
                    $concat .= " AND cfg.nivel = {$nivel}";
                }
                if ($region != NULL && $region != "") {
                    $concat .= " AND mun.region = {$region}";
                }
                break;
            case IDCENTRAL:
                if (is_array($ids_niveles_aux)) {
                    if ($nivel != "" && in_array($nivel, $ids_niveles_aux)) {
                        $concat .= " AND cfg.nivel = {$nivel}";
                    } else {
                        $str_niveles = implode(",", $ids_niveles_aux);
                        $concat .= " AND cfg.nivel IN  ({$str_niveles})";
                    }
                } else {
                    if ($nivel == $ids_niveles_aux) {
                        $concat .= " AND cfg.nivel IN  {$nivel}";
                    } else {
                        $concat .= " AND cfg.nivel IN  ({$ids_niveles_aux})";
                    }
                }
                if ($region != NULL && $region != "") {
                    $concat .= " AND mun.region = {$region}";
                }
                break;
            case IDREGIONALCENTRAL:
                if (is_array($ids_niveles_aux)) {
                    if ($nivel != "" && in_array($nivel, $ids_niveles_aux)) {
                        $concat .= " AND cfg.nivel = {$nivel}";
                    } else {
                        $str_niveles = implode(",", $ids_niveles_aux);
                        $concat .= " AND cfg.nivel IN  ({$str_niveles})";
                    }
                } else {
                    if ($nivel == $ids_niveles_aux) {
                        $concat .= " AND cfg.nivel = {$nivel}";
                    } else {
                        $concat .= " AND cfg.nivel IN  ({$ids_niveles_aux})";
                    }
                }
                $concat .= " AND mun.region = {$usuario_sesion->region}";
                break;
            default:
            break;
        }


        if ($municipio != 0 || $municipio != "0") {
            $concat .= " AND mun.idmunicipio = {$municipio}";
        }
        if ( strlen(trim($zona)) > 0) {
                if ($zona != 'TODAS LAS ZONAS') {
                    $concat .= " AND zona = {$zona}";
                }
        }

        if ( strlen(trim($cct)) > 0 ) {
            $concat .= " AND cc.cct = '{$cct}' OR zcct.cct = '{$cct}' OR seg.username LIKE '%{$cct}%' ";
        }

      $concat .= " AND cfg.tipo_ct IN (1, 2) ORDER BY usuario ASC";

      // echo $concat; die();

		   $str_query = " SELECT
          						cc.cct,
                      cc.idct,
                      cc.nombre,
                      cc.zona,
          						CASE cc.turno
          							 WHEN '100' THEN 'M'
          							 WHEN '200' THEN 'V'
          							 WHEN '300' THEN 'N'
          							 WHEN '400' THEN 'D'
          							 WHEN '500' THEN 'C'
          							 WHEN '700' THEN 'J'
          							 WHEN '600' THEN 'P'
          							 WHEN '800' THEN 'C'
          							 WHEN '130' THEN 'M, N'
          							 WHEN '123' THEN 'M, V, N'
          							 WHEN '230' THEN 'V, N'
          							 WHEN '124' THEN 'M, V, D'
          							 WHEN '120' THEN 'M, V'
          						END AS turno,
                      CASE cfg.nivel
          							 WHEN '1' THEN 'PRE'
          							 WHEN '2' THEN 'PRI'
          							 WHEN '3' THEN 'SEC'
          						END AS nivel,
                      seg.username AS usuario,
          						mun.nombre AS municipio,
          						CAST(cfg.sicres AS unsigned int) sicres,
          						CAST(cfg.pace AS unsigned int) pace,
          						cfg.idcentrocfg
          				  FROM cct cc
          				  LEFT JOIN centrocfg AS cfg ON cc.idct = cfg.idct
                    LEFT JOIN cct_zona zcct ON zcct.idctzona = cfg.idct
                    INNER JOIN municipio mun ON cc.idmunicipio = mun.idmunicipio
                    LEFT JOIN usuario usu ON cfg.idcentrocfg = usu.idcentrocfg AND usu.idtipousuario IN (4,6)
                    LEFT JOIN seguridad seg ON usu.idusuario = seg.idusuario
                    WHERE 1=1
                    $concat
            ";
          // echo $str_query;
          // die();
          return $str_query;
    }// get_sql_listado_escuelas_kw_v2()


    function get_sql_listado_escuelas_kw($usuario_sesion, $nivel, $region, $municipio, $zona, $cct,$ids_niveles_aux) {
        $filter = array();
        switch ($usuario_sesion->tipo->idtipousuario) {
            case IDADMINCENTRAL:
                if ($nivel != null && $nivel != "") {
                    $filter[] = " cf.nivel = " . $this->db->escape($nivel);
                }
                if ($region != null && $region != "") {
                    $filter[] = " m.region = \"" . $this->db->escape($region) . "\"";
                }
                break;
            case IDCENTRAL:
                if (is_array($ids_niveles_aux)) {
                    if ($nivel != "" && in_array($nivel, $ids_niveles_aux)) {
                        $filter[] = " cf.nivel = " . $this->db->escape($nivel);
                    } else {
                        $str_niveles = implode(",", $ids_niveles_aux);
                        $filter[] = " cf.nivel in (" . $this->db->escape($str_niveles) . ")";
                    }
                } else {
                    if ($nivel == $ids_niveles_aux) {
                        $filter[] = " cf.nivel = " . $this->db->escape($nivel);
                    } else {
                        $filter[] = " cf.nivel = " . $this->db->escape($ids_niveles_aux);
                    }
                }
                if ($region != null && $region != "") {
                    $filter[] = " m.region = " . $this->db->escape($region);
                }
                break;
            case IDREGIONALCENTRAL:
                if (is_array($ids_niveles_aux)) {
                    if ($nivel != "" && in_array($nivel, $ids_niveles_aux)) {
                        $filter[] = " cf.nivel = " . $this->db->escape($nivel);
                    } else {
                        $str_niveles = implode(",", $ids_niveles_aux);
                        $filter[] = "cf.nivel in (" . $this->db->escape($str_niveles) . ")";
                    }
                } else {
                    if ($nivel == $ids_niveles_aux) {
                        $filter[] = " cf.nivel = " . $this->db->escape($nivel);
                    } else {
                        $filter[] = " cf.nivel = " . $this->db->escape($ids_niveles_aux);
                    }
                }
                $filter[] = " m.region = " . $this->db->escape($usuario_sesion->region);
                break;
            default:

                break;
        }


        if ($municipio != null && $municipio != "") {
            $filter[] = " m.idmunicipio = " . $this->db->escape($municipio);
        }
        if ($zona != null && $zona != "") {
            if ($zona != null && $zona != "") {
                if ($zona != 'TODAS LAS ZONAS') {
                    $filter[] = " zona = " . $this->db->escape($zona);
                }
            }
        }

        if ($cct != null && $cct != "") {
            $filter[] = " cc.cct = \"" . $this->db->escape($cct) . "\" OR zonacct.cct = '{$cct}' OR s.username LIKE '%{$cct}%' ";
        }

        $filter[]=" cf.tipo_ct IN(".$this->db->escape(IDTIPOESCUELA).", 2) ORDER BY usuario ASC ";
        $where =  " WHERE " . implode(" AND ", $filter) ;

		   return "SELECT DISTINCT
						cc.cct,
						s.username as usuario,
						cc.idct,
						cc.nombre,
						(CASE
							 WHEN cc.turno = '100' THEN 'M'
							 WHEN cc.turno = '200' THEN 'V'
							 WHEN cc.turno = '300' THEN 'N'
							 WHEN cc.turno = '400' THEN 'D'
							 WHEN cc.turno = '500' THEN 'C'
							 WHEN cc.turno = '700' THEN 'J'
							 WHEN cc.turno = '600' THEN 'P'
							 WHEN cc.turno = '800' THEN 'C'
							 WHEN cc.turno = '130' THEN 'M, N'
							 WHEN cc.turno = '123' THEN 'M, V, N'
							 WHEN cc.turno = '230' THEN 'V, N'
							 WHEN cc.turno = '124' THEN 'M, V, D'
							 WHEN cc.turno = '120' THEN 'M, V'
							 ELSE cc.turno
						END) AS turno,
            (CASE
							 WHEN cf.nivel = '1' THEN 'PRE'
							 WHEN cf.nivel = '2' THEN 'PRI'
							 WHEN cf.nivel = '3' THEN 'SEC'
							 ELSE cf.nivel
						END) AS nivel,
						cc.zona,
						m.nombre AS municipio,
						CAST(cf.sicres AS unsigned int) sicres,
						CAST(cf.pace AS unsigned int) pace,
						cf.idcentrocfg
				  FROM
						cct AS cc
							 INNER JOIN
						centrocfg AS cf ON cc.idct = cf.idct
                        LEFT JOIN cct_zona AS zonacct ON zonacct.idctzona = cf.idct
						  inner join
						municipio AS m ON cc.idmunicipio = m.idmunicipio
						  INNER JOIN
					  usuario u ON cf.idcentrocfg = u.idcentrocfg and u.idtipousuario IN (4,6)
						  left join
					  seguridad s on u.idusuario = s.idusuario $where";
    }

    /*
     * gereracion de botones
     * esta funcion es temporal, solo se mantiene en caso de que se agregue un boton de edicion ,etc.
     * devuelve la estructura html de los botones
     */

    function get_toolbar_grid($menu_permisos = array(), $url = "", $url_alta = "") {
        $buttons = array();
        //if ($this->utilswrapper->verifica_permiso_v2($menu_permisos, $url, "alta") == 1) {
        if ($this->utilswrapper->verifica_permiso_v2($menu_permisos, "MC_019")) {
            $buttons[] = array("url" => $url_alta, "glyphicon" => "glyphicon-plus-sign", "label" => "Agregar");
        }
        return $buttons;
    }

    /*
     * columnas del grid
     * como parametros son los permisos,una url y en caso de eliminacion o moficiacion dos parametros
     * devuelve array de columnas que se pasaran al grid con el smartgrid
     */

    function get_columnas_listado_escuelas($menu_permisos = array(), $url = "", $url_edit = "", $url_dell = "") {
        $array_columnas = array("cct" => array("header" => "CCT", "type" => "label"),
				"usuario" => array("header" => "Usuario", "type" => "label"),
            "nombre" => array("header" => "Nombre escuela", "type" => "label"),
            "turno" => array("header" => "Turno", "type" => "label"),
            "nivel" => array("header" => "Nivel", "type" => "label"),
            "municipio" => array("header" => "Municipio", "type" => "label"),
            "zona" => array("header" => "Zona", "type" => "label"),
        );
        //  if ($this->utilswrapper->verifica_permiso_v2($menu_permisos,"MC_019")) {
        $array_columnas["sicres"] = array("field" => "idcentrocfg", "campo" => "sicres", "header" => "Yoremia", "type" => "check", "href" => $url_edit, "width" => "50px",);
        // }
        // if ($this->utilswrapper->verifica_permiso_v2($menu_permisos,"MC_019"))
        //{
        $array_columnas["pace"] = array("field" => "idcentrocfg", "campo" => "pace", "header" => "Móvil", "type" => "check", "href" => $url_dell, "width" => "50px", "message" => "");
        // }
        return $array_columnas;
    }

    /*
     * funcion para obtener un array de todos los ccts (todos los campos)
     */

    function get_all_cct() {
        return $this->db->get('cct')->result_array();
    }

    function update_cct($idct, $params) {
        $this->db->where('idct', $idct);
        $response = $this->db->update('cct', $params);

        if ($response) {
            return TRUE;
        } else {
            return FALSE;
        }
    }

    function get_sql_escuelas($busqueda_escuela) {
        $this->db->select();
    }

    /*
     * esta funcion devuelve los datos de la escuela, asi como el nombre del municipio al que pertenece
     * parametros: nombre de escuela
     */

    function get_escuela($cct) {
        $this->db->select('cct.nombre AS escuela, cct.idct,cct.cct,cct.turno,municipio.nombre AS nombre,cct.idmunicipio,centrocfg.turno');
        $this->db->from('cct');
        $this->db->join('municipio', 'cct.idmunicipio = municipio.idmunicipio', 'left');
        $this->db->join('centrocfg', 'cct.idct = centrocfg.idct', 'left');
        //$this->db->where('cct.nombre',$nombre);
        $this->db->where('cct.cct', $cct);
        $this->db->distinct();
        return $this->db->get()->result_array();
    }

    /*
     * devuelve todos los nombres de las escuelas que se encuentran en la tabla cct junto con turno
     * no lleva parametros
     */

    function get_nomescuela($usuario_sesion = null) {
        $where = "centrocfg.tipo_ct =".IDTIPOESCUELA." ";

        if ($usuario_sesion != null) {
            if ($usuario_sesion->tipo->idtipousuario != IDADMINCENTRAL) {
                $niveles = $this->utilswrapper->get_nivelespermisos($usuario_sesion, 'MC_022');


                if (count($niveles) == 0) {
                    return array();
                }

                $where = "and centrocfg.nivel in (" . implode(",", $niveles) . ")";
            }
            switch ($usuario_sesion->tipo->idtipousuario) {

                case IDREGIONALCENTRAL:
                    $where .= ($where != "" ? " AND " : "") . "municipio.region=" . $usuario_sesion->region;

                    break;
            }
        }
        $this->db->select("cct.nombre,cct.cct,(CASE WHEN cct.turno = '100' THEN 'Matutino' WHEN cct.turno = '130' THEN 'Matutino-Nocturno' WHEN cct.turno = '200'
         THEN 'Vespertino' WHEN cct.turno = '123' THEN 'Matutino-Vespertino-Nocturno' WHEN cct.turno = '300' THEN 'Nocturno'
         WHEN cct.turno='230' THEN 'Vespertino-Nocturno' WHEN cct.turno ='400' THEN 'Discontinuo'
         WHEN cct.turno='124' THEN 'Matutino-Vespertino-Discontinuo' WHEN cct.turno='500' THEN 'Tiempo completo' WHEN cct.turno='700'
         THEN 'Jornada ampliada' WHEN cct.turno='600' THEN 'Complementario' WHEN cct.turno='800' THEN 'Continuo'
         WHEN cct.turno='120' THEN ' Matutino-Vespertino' ELSE cct.turno END) as turno,centrocfg.nivel,cct.idct,municipio.nombre AS muni,centrocfg.idcentrocfg");
        $this->db->from('cct');
        if ($where != "") {
            $this->db->where($where);
        }

        $this->db->join('municipio', 'cct.idmunicipio = municipio.idmunicipio');
        $this->db->join('centrocfg', 'cct.idct = centrocfg.idct', 'inner');

        $this->db->order_by('cct.idct', 'ASC');
        $result = $this->db->get()->result_array();

        return $result;
    }

    function escuelas_por_nivel($usuario_sesion = null, $nivel) {
        $where = "";
        if ($usuario_sesion != null) {
            if ($usuario_sesion->tipo->idtipousuario != IDADMINCENTRAL) {
                $niveles = $this->utilswrapper->get_nivelespermisos($usuario_sesion, 'MC_022');


                if (count($niveles) == 0) {
                    return array();
                }

                $where = "centrocfg.nivel in (" . implode(",", $niveles) . ")";
            }
            switch ($usuario_sesion->tipo->idtipousuario) {

                case IDREGIONALCENTRAL:
                    $where .= ($where != "" ? " AND " : "") . "municipio.region=" . $usuario_sesion->region;

                    break;
                case IDADMINCENTRAL:
                    $nivel = (int) $nivel;
                    $where .= ($where != "" ? " AND " : "") . "centrocfg.nivel=" . $nivel;
                    break;
            }
        }
        $this->db->select("cct.nombre,cct.cct,(CASE WHEN cct.turno = '100' THEN 'Matutino' WHEN cct.turno = '130' THEN 'Matutino-Nocturno' WHEN cct.turno = '200'
         THEN 'Vespertino' WHEN cct.turno = '123' THEN 'Matutino-Vespertino-Nocturno' WHEN cct.turno = '300' THEN 'Nocturno'
         WHEN cct.turno='230' THEN 'Vespertino-Nocturno' WHEN cct.turno ='400' THEN 'Discontinuo'
         WHEN cct.turno='124' THEN 'Matutino-Vespertino-Discontinuo' WHEN cct.turno='500' THEN 'Tiempo completo' WHEN cct.turno='700'
         THEN 'Jornada ampliada' WHEN cct.turno='600' THEN 'Complementario' WHEN cct.turno='800' THEN 'Continuo'
         WHEN cct.turno='120' THEN ' Matutino-Vespertino' ELSE cct.turno END) as turno,centrocfg.nivel,cct.idct,municipio.nombre AS muni,centrocfg.idcentrocfg");
        $this->db->from('cct');
        if ($where != "") {
            $this->db->where($where);
        }

        $this->db->join('municipio', 'cct.idmunicipio = municipio.idmunicipio');
        $this->db->join('centrocfg', 'cct.idct = centrocfg.idct', 'inner');

        $this->db->order_by('cct.idct', 'ASC');
        $result = $this->db->get()->result_array();

        return $result;
    }

    function get_nivel($cct) {
        $this->db->select('cf.nivel,c.cct,c.nivel,cf.idcentrocfg');
        $this->db->from('cct AS c');
        $this->db->join('centrocfg AS cf', 'c.idct = cf.idct', 'left');
        $this->db->where('c.cct', $cct);
        $this->db->distinct();


        $result = $this->db->get()->row_array();

        return $result;
    }

    function get_grupocct($cct, $tabla_grupo) {
        if ($tabla_grupo == "grupo_sec") {
            $this->db->select('cf.nivel,c.cct,c.nivel,cf.idcentrocfg,pp.grado,pp.grupo,pp.cupo,pp.idgrupo,pe.descr,pp.status AS status');
        } else {
            $this->db->select('cf.nivel,c.cct,c.nivel,cf.idcentrocfg,pp.grado,pp.grupo,pp.cupo,pp.idgrupo,pe.descr,pp.status AS status');
        }

        $this->db->from('cct AS c');
        $this->db->join('centrocfg AS cf', 'c.idct = cf.idct', 'left');
        $this->db->join($tabla_grupo . ' AS pp', 'cf.idcentrocfg = pp.idcentrocfg', 'left');
        $this->db->join('planestudio AS pe', 'pe.idplan = pp.idplan');

        $this->db->where('c.cct', $cct);
        $this->db->distinct();
        $this->db->order_by("pp.grado", "asc");
        $this->db->order_by("pp.grupo", "asc");
        $a = $this->db->get()->result_array();
        //   echo $this->db->last_query();
        return $a;
    }

    function get_cctxzona($zona) {
        $query = $this->db->query('SELECT
                                    cct.cct,
                                    cct.nombre,
                                    centrocfg.idcentrocfg as id
                                    FROM
                                    cct
                                    INNER JOIN centrocfg ON centrocfg.idct = cct.idct
                                    WHERE cct.zona=' . $zona);

        return $query->result_array();

    }

    function get_escuelas_filtros($paramas) {
        if ($paramas['idnivel'] == NIVEL_PREE) {
            $niv = NIVEL_PREE;
        } elseif ($paramas['idnivel'] == NIVEL_PRIM) {
            $niv = NIVEL_PRIM;
        } elseif ($paramas['idnivel'] == NIVEL_SEC) {
            $niv = NIVEL_SEC;
        }
        $query = $this->db->query("select
                                    c.nivel,
                                    r.nombre as nregion,
                                    municipio.nombre as nmunicipio,
                                    c.cct,
                                    c.nombre,
                                    c.zona,
                                    c.idmunicipio,
            centrocfg.idcentrocfg as id,
            CONCAT(
                c.cct,
		\" - \",
		(
                    CASE
                        WHEN c.turno = '100' THEN 'M'
                        WHEN c.turno = '200' THEN 'V'
			WHEN c.turno = '300' THEN 'N'
			WHEN c.turno = '400' THEN 'D'
			WHEN c.turno = '500' THEN 'C'
			WHEN c.turno = '700' THEN 'J'
			WHEN c.turno = '600' THEN 'P'
			WHEN c.turno = '800' THEN 'C'

                        WHEN c.turno = '130' THEN 'M, N'
                        WHEN c.turno = '123' THEN 'M, V, N'
                        WHEN c.turno='230' THEN 'V, N'
                        WHEN c.turno='124' THEN 'M, V, D'
                        WHEN c.turno='120' THEN 'M, V'
                        ELSE
                    c.turno
                    END
		),\" / \",c.nombre
	) AS cct_turno
                                    FROM cct as c
                                    INNER JOIN municipio ON municipio.idmunicipio = c.idmunicipio
                                    INNER JOIN c_region as r on r.idregion = municipio.region
                                    INNER JOIN centrocfg ON centrocfg.idct = c.idct
        WHERE  centrocfg.tipo_ct=".IDTIPOESCUELA." and centrocfg.nivel=\"" . $niv . "\" AND r.idregion=" . $paramas['region'] . " AND municipio.idmunicipio=\"" . $paramas['idmunicipio'] . "\" " . ($paramas['zona'] != "TODAS LAS ZONAS" ? " AND  c.zona=\"" . $paramas['zona'] . "\"" : "") . "
        ORDER BY c.idmunicipio ASC, c.nombre ASC");
        $r = $query->result_array();
        return $r;
    }

    function get_cctxccfg($idcentrocfg) {
        $query = $this->db->query("SELECT
                                    centrocfg.idcentrocfg,
                                    cct.nombre
                                    FROM
                                    centrocfg
                                    INNER JOIN cct ON centrocfg.idct = cct.idct
                                    WHERE centrocfg.idcentrocfg=" . $idcentrocfg);
        return $query->result_array();
    }

    function get_zona($zona) {
        if ($zona != null && $zona != "") {
            $query = $this->db->query("SELECT*
                                    FROM
                                    cct
                                    WHERE cct.zona='" . $zona . "'");


            if ($query->num_rows() > 0) {
                return TRUE;
            } else {
                return FALSE;
            }
        } else {
            return FALSE;
        }
    }

    function get_zona_supervisor($cct) {
        if ($cct != null && $cct != "") {

            $query = $this->db->query("select * from centrocfg as c
INNER JOIN cct on cct.idct=c.idct
where c.tipo_ct=".IDTIPOSUPERVISION." and cct.cct='" . $cct . "'");

            /*$query = $this->db->query("SELECT idctzona
                                    FROM
                                    view_cct_zona_supervisor
                                    WHERE cct='" . $cct . "'");*/


            if ($query->num_rows() > 0) {
                return TRUE;
            } else {
                return FALSE;
            }
        } else {
            return FALSE;
        }
    }

    function get_numzona($cct) {
        if ($cct != null && $cct != "") {
            $query = $this->db->query("SELECT idctzona
                                    FROM
                                    view_cct_zona_supervisor
                                    WHERE cct='" . $cct . "'");


            if ($query->num_rows() > 0) {
                return $query->row_array();
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    function get_data_sup($cct) {
        if ($cct != null && $cct != "") {
            $query = $this->db->query("SELECT *
                                    FROM
                                    view_cct_zona_supervisor
                                    WHERE cct='" . $cct . "'");


            if ($query->num_rows() > 0) {
                return $query->row_array();
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    function obtiene_escuelaxccfg($ccfg) {
        $query = $this->db->query("SELECT
	(
		CASE
		WHEN cct.turno = '100' THEN
			'Matutino'
		WHEN cct.turno = '130' THEN
			'Matutino-Nocturno'
		WHEN cct.turno = '200' THEN
			'Vespertino'
		WHEN cct.turno = '123' THEN
			'Matutino-Vespertino-Nocturno'
		WHEN cct.turno = '300' THEN
			'Nocturno'
		WHEN cct.turno = '230' THEN
			'Vespertino-Nocturno'
		WHEN cct.turno = '400' THEN
			'Discontinuo'
		WHEN cct.turno = '124' THEN
			'Matutino-Vespertino-Discontinuo'
		WHEN cct.turno = '500' THEN
			'Tiempo completo'
		WHEN cct.turno = '700' THEN
			'Jornada ampliada'
		WHEN cct.turno = '600' THEN
			'Complementario'
		WHEN cct.turno = '800' THEN
			'Continuo'
		WHEN cct.turno = '120' THEN
			' Matutino-Vespertino'
		ELSE
			cct.turno
		END
	) AS turno,
	(
		CASE
		WHEN cct.nivel = 'PRI' THEN
			'Primaria'
		WHEN cct.nivel = 'PRE' THEN
			'Preescolar'
		WHEN cct.nivel = 'SEC' THEN
			'Secundaria'
		ELSE
			cct.nivel
		END
	) AS nivel,
	cct.nombre,
	cct.cct,
	municipio.nombre AS municipio
FROM
	centrocfg
INNER JOIN cct ON centrocfg.idct = cct.idct
INNER JOIN municipio ON municipio.idmunicipio = cct.idmunicipio
INNER JOIN niveleducativo ON niveleducativo.idnivel=centrocfg.nivel
WHERE
	idcentrocfg = " . $ccfg);

        return $query->result_array();
    }

    // FUNCION PARA TRAER LAS ESCUELAS POR ZONA EN USUARIO SUPERVISION

    function get_cctturnoxzona($zona) {
        $this->db->distinct();
        $this->db->select("centrocfg.idcentrocfg, CONCAT(cct.cct,\" - \" , (CASE WHEN cct.turno = '100' THEN 'Matutino' WHEN cct.turno = '130' THEN 'Matutino - Nocturno' WHEN cct.turno = '200'
         THEN 'Vespertino' WHEN cct.turno = '123' THEN 'Matutino - Vespertino - Nocturno' WHEN cct.turno = '300' THEN 'Nocturno'
         WHEN cct.turno='230' THEN 'Vespertino - Nocturno' WHEN cct.turno ='400' THEN 'Discontinuo'
         WHEN cct.turno='124' THEN 'Matutino - Vespertino - Discontinuo' WHEN cct.turno='500' THEN 'Tiempo completo' WHEN cct.turno='700'
         THEN 'Jornada ampliada' WHEN cct.turno='600' THEN 'Complementario' WHEN cct.turno='800' THEN 'Continuo'
         WHEN cct.turno='120' THEN ' Matutino - Vespertino' ELSE cct.turno END)  ) as cct_turno, (centrocfg.nivel) AS cct_niv");
        $this->db->from('centrocfg');
        $this->db->join('cct', 'cct.idct=centrocfg.idct', 'inner');
        //$this->db->join('niveleducativo', 'niveleducativo.idnivel=centrocfg.nivel', 'inner');

        $this->db->where("cct.zona='" . $zona . "'");
        $this->db->order_by('cct.turno', 'ASC');
        $rows = $this->db->get()->result_array();
        return $rows;
    }

    function obtiene_regmunxidct($idct) {
        $this->db->select("cct.cct, cct.idmunicipio, municipio.region");
        $this->db->from("cct");
        $this->db->join("centrocfg", "centrocfg.idct = cct.idct");
        $this->db->join("municipio", "municipio.idmunicipio = cct.idmunicipio");
        $this->db->where("centrocfg.idcentrocfg=" . $idct);
        $this->db->where("municipio.identidad = 21");
        $rows = $this->db->get()->result_array();
        return $rows;
    }

    function get_cctxidalerta($nivel, $sufijo, $idalerta) {
        if ($nivel != 3) {
            $q = "select
            cc.*
	from `alertapace_$sufijo` `s`
	join `alumno` `a` on((`a`.`idalumno` = `s`.`idalumno`))
	join `expediente_$sufijo` `g` on((`g`.`idalumno` = `a`.`idalumno`))
	join `grupo_$sufijo` `gs` on((`gs`.`idgrupo` = `g`.`idgrupo`))
	join `centrocfg` `cfg` on((`cfg`.`idcentrocfg` = `gs`.`idcentrocfg`))
	join `cct` `cc` on((`cc`.`idct` = `cfg`.`idct`))
        where s.idalerta_$sufijo = '$idalerta'";
        } else {
            $q = "select
	cc.*
	from `alertapace_sec` `s`
	join `alumno` `a` on((`a`.`idalumno` = `s`.`idalumno`))
        join grupoxalumno_sec `g` on ((g.idalumno = `a`.`idalumno`))
	join `grupo_sec` `gs` on((`gs`.`idgrupo` = `g`.`idgrupo`))
	join `centrocfg` `cfg` on((`cfg`.`idcentrocfg` = `gs`.`idcentrocfg`))
	join `cct` `cc` on((`cc`.`idct` = `cfg`.`idct`))
        where s.idalerta_sec = '$idalerta'";
        }
        $query = $this->db->query($q);
        return $query->row_array();
    }

    function get_cctturnoxzona_supervision($zona) {
        $this->db->select("cctcentro.idcentrocfg as idcentrocfg,czona.nivel as cct_niv,
	CONCAT(
		cct.cct,
		\" - \",
		(
			CASE
			WHEN cct.turno = '100' THEN 'M'
			WHEN cct.turno = '200' THEN 'V'
			WHEN cct.turno = '300' THEN 'N'
			WHEN cct.turno = '400' THEN 'D'
			WHEN cct.turno = '500' THEN 'C'
			WHEN cct.turno = '700' THEN 'J'
			WHEN cct.turno = '600' THEN 'P'
			WHEN cct.turno = '800' THEN 'C'

                        WHEN cct.turno = '130' THEN 'M, N'
                        WHEN cct.turno = '123' THEN 'M, V, N'
                        WHEN cct.turno='230' THEN 'V, N'
                        WHEN cct.turno='124' THEN 'M, V, D'
                        WHEN cct.turno='120' THEN 'M, V'
			ELSE
				cct.turno
			END
		),\" / \",cct.nombre
	) AS cct_turno");
        $this->db->from('cct');
        $this->db->join('centrocfg as cctcentro', 'cctcentro.idct = cct.idct', 'inner');
        $this->db->join('cct_zona AS cz', 'cz.idct = cct.idct', 'inner');
        $this->db->join('cct AS cctzonar', 'cctzonar.idct = cz.idctzona', 'inner');
        $this->db->join('centrocfg AS czona', 'czona.idct = cctzonar.idct', 'inner');

        $this->db->where("czona.idcentrocfg =" . $zona);
        $this->db->where("cct.`status` IN ('A', 'R')");
        // $sql = $this->db->get_compiled_select();
        // echo $sql; die();
        $rows = $this->db->get()->result_array();
        return $rows;
    }

    function get_escuelas_supervisor($idcentrocfg){
        $sql = " SELECT
                  cctcentro.idcentrocfg as idcentrocfg,
                  czona.nivel as cct_niv, cct.cct, cct.turno, cct.nombre, cct.idct, cct.nivel,
                  cctcentro.turno,mun.region,cct.idmunicipio
                FROM cct
                  INNER JOIN centrocfg as cctcentro ON cctcentro.idct = cct.idct
                  INNER JOIN cct_zona AS cz ON cz.idct = cct.idct
                  INNER JOIN cct AS cctzonar ON cctzonar.idct = cz.idctzona
                  INNER JOIN centrocfg AS czona ON czona.idct = cctzonar.idct
                  INNER JOIN municipio AS mun ON mun.idmunicipio=cct.idmunicipio AND mun.identidad = ?
                WHERE (cct.`status` IN ('A', 'R')) and czona.idcentrocfg = ?
                GROUP BY cctcentro.idcentrocfg
                ";
                // echo $sql;die();
                return $query = $this->db->query($sql, array(CVE_ENTIDAD, $idcentrocfg))->result_array();
    }// get_escuelas_supervisor()

    function get_datosescuela_xidct($idcct) {
        $this->db->select('cct.nombre AS escuela, cct.idct,cct.cct,cct.turno,municipio.nombre as municipio,
                           turno.descripcion as turno, cct.zona, ne.descr as nivel, centrocfg.nivel as idnivel, centrocfg.idcentrocfg');
        $this->db->from('cct');
        $this->db->join('municipio', 'cct.idmunicipio = municipio.idmunicipio', 'left');
        $this->db->join('centrocfg', 'cct.idct = centrocfg.idct', 'left');
        $this->db->join('turno', 'turno.idturno = centrocfg.turno', 'inner');
        $this->db->join('niveleducativo ne', 'ne.idnivel = centrocfg.nivel', 'inner');

        $this->db->where('centrocfg.idct', $idcct);
        $this->db->where("cct.`status` IN ('A', 'R')");
        $this->db->distinct();
        return $this->db->get()->result_array();
    }// get_datosescuela_xidct()

}
