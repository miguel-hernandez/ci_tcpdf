<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class UtilsWrapper {

	public function __construct() {
		//  require_once APPPATH.'third_party/Utils.php';
	}

	public static function setTemplate($template = 'escolar', $controller, $page, $data) {
		$controller->load->view('templates/' . $template . '/header', $data);
		$controller->load->view(strtolower(get_class($controller)) . '/' . $page, $data);
		$controller->load->view('templates/' . $template . '/footer', $data);
	}

	/**
	 * Carga la vista básica de una página: header, vista y footer.
	 *
	 * @param controlador $contexto   Desde dónde se llamará a la vista
	 * @param string $vista      El nombre de la vista que se cargará después del header
	 * @param array  $data       Arreglo con los campos que usará templates/header y $vista
	 */
	public static function carga_pagina_basica($contexto, $vista = '', $data) {
		$contexto->load->view('templates/header', $data);
		$contexto->load->view($vista, $data);
		$contexto->load->view('templates/footer');
	}

	/**
	 * @param $contexto donde se llamara a la vista
	 * @param $menu elementos y permisos
	 */
	function carga_menu($menu) {
		$color = 1;
		echo '<div class="collapse navbar-collapse navbar-ex1-collapse">' .
		'<ul class="nav navbar-nav navbar-right">';
		foreach ($menu as $value) {
			if (isset($value['subelementos']) && $value['subelementos'] != '') {

				echo '<li class="dropdown singleDrop color-' . $color . '">' .
				'<a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">' .
				'<i class="fas ' . $value['icon'] . ' bg-color-' . $color . '" aria-hidden="true"></i> <span class="active">' . $value['tipo'] . '</span></a>' .
				'<ul class="dropdown-menu dropdown-menu-right">';
				foreach ($value["subelementos"] as $subelemento) {
					// Inicia pintado nivel 2 del submenú
					if (isset($subelemento['nivel2']) && $subelemento['nivel2'] == TRUE) {

						echo '<li class="dropdown dropdown-submenu active">
                                                  <a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown">' . $subelemento['subelemento'] . '<i class="fa" aria-hidden="false"></i>
                                                  </a>';
						echo '<ul class="dropdown-menu">';
						foreach ($subelemento["niveles"] as $subelemento2) {
							echo '<li class="dropdown dropdown-submenu active"><a href="' . $subelemento2['hrefelem'] . '">' . $subelemento2['label'] . '</a></li>';
						}
						echo'</ul>';
						echo'</li>';
						// Termina pintado de nivel2
					} else {
						echo '<li class="active"><a href=' . $subelemento['hrefelem'] . '>' . $subelemento['subelemento'] . '</a></li>';
					}
				}echo'</ul>';
				echo '</li>';
				$color++;
			} else {
				echo '<li class="color-' . $color . '">' .
				'<a href=' . $value['href'] . ' role="button">' .
				'<i class="fas ' . $value['icon'] . ' bg-color-' . $color . '" aria-hidden="true"></i>' .
				'<span>' . $value['tipo'] . '</span>' .
				'</a>' .
				'</li>';
				$color++;
			}
		}
		echo '</ul> </div>';
	}

	/**
	 * Comprueba si en la sesión existe valor para la clave 'nombre_usuario'
	 *
	 * @param CI_Controller $contexto  Controlador en donde se
	 * desea verificar si existe sesión abierta.
	 *
	 * @return boolean TRUE si existe valor para la clave 'nombre_usuario'
	 */
	public static function haySesionAbierta($contexto) {
		return $contexto->session->has_userdata(DATOSUSUARIO);
	}

	public static function esSesionAdmin($contexto) {
		$user = UtilsWrapper::get_usuario_sesion($contexto);
		if ($user != null) {
			if (isset($user->tipo->subtipo)) {
				return intval($user->tipo->subtipo) == SUPERADMIN;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	public static function esSesionAdminEscolar($contexto) {
		$user = UtilsWrapper::get_usuario_sesion($contexto);
		if ($user != null) {
			if (isset($user->tipo->subtipo)) {
				return intval($user->idtipousuario) == ADMINESCOLAR;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	public function redirige_prohibido($contexto) {
		$contexto->session->set_flashdata("mensaje_error", Utilswrapper::crea_mensaje(ERRORMESSAGE, "Acceso prohibido"));
		$contexto->session->set_flashdata("titulo", 'Acceso prohibido');
		$contexto->session->set_flashdata("url_back", site_url());
		redirect('errorint/error');
		//$this->carga_pagina_basica($contexto, 'templates/acceso_prohibido', $data);
		return;
	}

	public function redirige_error($contexto, $titulo, $mensaje) {
		$contexto->session->set_flashdata("mensaje_error", Utilswrapper::crea_mensaje(ERRORMESSAGE, $mensaje));
		$contexto->session->set_flashdata("titulo", $titulo);
		$contexto->session->set_flashdata("url_back", site_url());
		redirect('errorint/error');
		//$this->carga_pagina_basica($contexto, 'templates/acceso_prohibido', $data);
		return;
	}

	public function redirige_escolar($contexto) {
		$data['titulo'] = 'Acceso prohibido';
		$this->carga_pagina_basica($contexto, 'templates/prohibido_escolar', $data);
		return;
	}

	function genera_folio_pace() {
		$nums = array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
		$len_nums = sizeof($nums) - 1;
		$folio = '';
		$digito_anterior = 0;
		for ($i = 0; $i < LONG_FOLIO_PACE; $i++) {
			$digito = $nums[rand(0, $len_nums)];
			$digito = ($digito == $digito_anterior) ? $nums[rand(0, $len_nums)] : $digito;
			$folio .= '' . $digito;
			$digito_anterior = $digito;
		}
		return $folio;
	}

	/**
	 * Método para generar contraseñas usando números aleatorios
	 * como índices del arreglo de caracteres.
	 * Valida si la contraseña cumple con criterios establecidos.
	 *
	 * @param  int $num_caracteres  Número de caracteres de la contraseña
	 * @return string Contraseña generada
	 */
	public function genera_contrasena($num_caracteres) {
		// Se omiten B,8,G,6,I,1,l,O,0,Q,D,S,5,Z,2
		$caracteres = array(
			'A', 'C', 'E', 'F', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'T', 'U', 'V', 'W', 'X', 'Y',
			'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
			'3', '4', '7', '9');

		$tamano = sizeof($caracteres) - 1;
		$contrasena = '';
		$indice_anterior = 0;

		for ($i = 0; $i < $num_caracteres; $i++) {
			$indice = rand(0, $tamano);
			// Evita obtener caracteres consecutivos repetidos
			$indice = ($indice === $indice_anterior) ? rand(0, $tamano) : $indice;
			$contrasena .= $caracteres[$indice];
			$indice_anterior = $indice;
		}

		return $this->contrasena_valida($contrasena) ? $contrasena : $this->genera_contrasena($num_caracteres);
		//return $this->contrasena_valida($contrasena) ? $contrasena : $contrasena.'-No válida';
	}

	/**
	 * Verifica que la contraseña generada $pass cumpla con:
	 * - tener al menos una letra minúscula
	 * - tener al menos una letra mayúscula
	 * - tener al menos un caracter numérico
	 * - Ser de menor longitud que LONG_MAX_CONTRASENA
	 * - Ser de mayor longitud que LONG_MIN_CONTRASENA
	 *
	 * @param   string $pass  Contrasena generada automáticamente
	 * @return  boolean TRUE si cumple con los criterios. FALSE en otro caso
	 */
	function contrasena_valida($pass) {
		return (
				preg_match('/[a-z]+/', $pass) &&
				preg_match('/[A-Z]+/', $pass) &&
				preg_match('/[0-9]+/', $pass) &&
				// strlen($pass) < LONG_MAX_CONTRASENA &&
				strlen($pass) >= LONG_MIN_CONTRASENA );
	}

	/**
	 * Si $contenido tiene más de 50 caracteres, elimina las palabras
	 * necesarias hasta que la longitud sea menor o igual que 50
	 *
	 * @param string  $contenido Cadena a verificar
	 * @return string Cadena recortada o sin cambios si ésta es menor que 50
	 */
	function ajuste_nombre($contenido) {
		if (empty($contenido) || strlen($contenido) <= LONG_MAX_NOMBRE) {
			return $contenido;
		}

		if (strlen($contenido) > LONG_MAX_NOMBRE) {
			$recorte = '';
			$palabras = explode(' ', $contenido);
			foreach ($palabras as $palabra) {
				if (strlen($recorte . ' ' . $palabra) <= LONG_MAX_NOMBRE) {
					$recorte .= $palabra . ' ';
				} else {
					break;
				}
			}
			return $recorte;
		}
	}

// ajuste_nombre()

	/**
	 * Método para cargar la vista del formulario de generación de
	 * contraseña. Devuelve el resultado como cadena de caracteres
	 * para poder ser agregado a un formulario.
	 *
	 * @param  CI_Controller $contexto Controlador que obtendrá la vista
	 * para enviarlo a otra página.
	 * @param  int $num_caracteres Longitud de la contraseña resultante
	 * @param int $id_usuario 0 si se creará un nuevo usuario. En otro caso, se modificará
	 * @return string cadena de caracteres de la vista form_contrasena
	 */
	public function form_contrasena($contexto, $num_caracteres, $id_usuario = 0, $edita_central = FALSE) {
		$data['contrasena'] = $this->genera_contrasena($num_caracteres);
		$data['id_usuario'] = $id_usuario;
		$data['edita_central'] = $edita_central;

		return $contexto->load->view('form_contrasena', $data, TRUE);
	}

	/**
	 * Devuelve en formato JSON la contraseña generada automáticamente.
	 * @param int $num_caracteres Número de caracteres de la contraseña generada
	 * @return string Cadena en formato JSON. e.g. {"contrasena":"SqNTeG9ALq"}
	 */
	function get_contrasena_json($num_caracteres) {
		return json_encode(array(
			'contrasena' => $this->genera_contrasena($num_caracteres)
		));
	}

	/**
	 * Comprueba si la contraseña recibida como parámetro cumple con los
	 * criterios.
	 * @param string $contrasena Contraseña generada que se desea verificar
	 * @return string Cadena en formato JSON. e.g. {"es_valida":"1"} | {"es_valida":"0"}
	 */
	function contrasena_valida_json($contrasena) {
		return json_encode(array(
			'es_valida' => ($this->contrasena_valida($contrasena)) ? '1' : '0'
		));
	}

	/**
	 * Verifica que el nombre de usuario ingresado en el formulario
	 * de Login coincida con el patrón: <caracteres>@<10 caracteres>.<m|v|n|c>
	 * @param string $usuario Nombre de usuario ingresado en formulario
	 * @return int 1 si cumple el patrón. 0 en otro caso.
	 */
	public function usuario_escolar_valido($usuario) {
		return
				(preg_match('/([[:alnum:]])@([[:alnum:]]{10})./i', $usuario) &&
				$this->tiene_turno($usuario)) ? 1 : 0;
	}

	public function usuario_supervision_valido($usuario) {
		$checar_numero = explode('@', $usuario);

		if (count($checar_numero) > 1) {
			return (preg_match('/SUPERVISOR@([0-9A-Za-z]{10})+$/i', $usuario)) ? 1 : 0;
		} else {
			return 0;
		}
	}

	/**
	 * Verifica que el nombre de usuario ingresado en el formulario
	 * de Login coincida con el patrón: <caracteres>@central
	 * @param string $usuario Nombre de usuario ingresado en formulario
	 * @return int 1 si cumple el patrón. 0 en otro caso.
	 */
	public function usuario_central_valido($usuario) {
		return preg_match('/([[:alnum:]])@(central)$/i', $usuario);
	}

	/**
	 * Comprueba que el usuario escolar tenga terminación de turno válido.
	 * @param string $usuario Nombre de usuario ingresado en formulario
	 * @return int TRUE si cumple el patrón. FALSE en otro caso
	 */
	public function tiene_turno($usuario) {
		$usuario = strtolower($usuario);
		$turno = strstr($usuario, '.');
		$t = array('.m', '.v', '.n', '.c', ".n", ".d", ".p", ".u", ".j");

		return in_array($turno, $t); //($turno === '.m' OR $turno === '.v' OR $turno === '.n' OR $turno === '.c' OR $turno === '.c');
	}

	/**
	 * @param string $contenido  Cadena a procesar
	 * @return string $contenido sin espacios de más
	 */
	function elimina_espacios($contenido) {
		// Espacios al final de cadena
		$contenido = preg_replace('/(\\-\\ )/', '-', $contenido); // A- B
		$contenido = preg_replace('/(\\ \\-)/', '-', $contenido); // A -B

		$contenido = preg_replace('/\\ $/', '', $contenido);
		return preg_replace('/\\ {2,}/', ' ', $contenido);
	}

	public function caracteres_validos($contenido) {
		// Elimina localmente las letras
		$contenido = $this->reemplaza_acentos($contenido);
		if (preg_match("/[^a-z0-9ñÑáéíóú\\ \\-\\.\\/\\']/i", $contenido) === 1) {
			return FALSE;
		}
		return TRUE;
	}

	public function curp_rfc_valida($contenido) {
		// Elimina localmente las letras
		$contenido = $this->reemplaza_acentos($contenido);
		if (preg_match("/[^a-z0-9ñÑáéíóú]/i", $contenido) === 1) {
			return FALSE;
		}
		return TRUE;
	}

	public function solo_letras($contenido) {
		$contenido = $this->reemplaza_acentos($contenido);
		if (preg_match("/[^a-zñÑáéíóú\\ \\-\\.\\/\\']/i", $contenido) === 1) {
			return FALSE;
		}
		return TRUE;
	}

	function numerico_valido($contenido) {
		if (empty($contenido)) {
			return TRUE;
		}

		if (preg_match("/[0-9]/i", $contenido) !== 1) {
			return FALSE;
		}

		if (preg_match("/[0-9a-z\\ \\-\\(\\)\\+]/i", $contenido) === 1) {
			return TRUE;
		}
		return FALSE;
	}

	/**
	 * Si es existen, reemplaza los caracteres acentuados.
	 * @param string  $contenido  Valor del campo del formulario
	 * @return string Cadena con caracteres reemplazados y en mayúsculas
	 */
	public function reemplaza_acentos($contenido) {
		$cambio = array(
			'À' => 'A', '�?' => 'A', 'Â' => 'A', 'Ã' => 'A', 'Ä' => 'A', 'Å' => 'A',
			'à' => 'a', 'á' => 'a', 'â' => 'a', 'ã' => 'a', 'ä' => 'a', 'å' => 'a',
			'È' => 'E', 'É' => 'E', 'Ê' => 'E', 'Ë' => 'E',
			'è' => 'e', 'é' => 'e', 'ê' => 'e', 'ë' => 'e',
			'Ì' => 'I', '�?' => 'I', 'Î' => 'I', '�?' => 'I',
			'ì' => 'i', 'í' => 'i', 'î' => 'i', 'ï' => 'i',
			'Ò' => 'O', 'Ó' => 'O', 'Ô' => 'O', 'Õ' => 'O', 'Ö' => 'O',
			'ò' => 'o', 'ó' => 'o', 'ô' => 'o', 'õ' => 'o', 'ö' => 'o',
			'Ù' => 'U', 'Ú' => 'U', 'Û' => 'U', 'Ü' => 'U',
			'ù' => 'u', 'ú' => 'u', 'û' => 'u', 'ü' => 'u',
		);

		$nuevo = strtr($contenido, $cambio);
		return mb_strtoupper($nuevo, 'UTF-8');
	}

	/**
	 * Método que da formato a la consulta de permisos menu para su pintado y posterior validación de permisos
	 *
	 * @param array $consulta_menu Es el resultado de la consulta de los menus
	 * @return array retorna el menu con formato para almacenarlo
	 */
	public static function genera_objeto_menu($consulta_menu = array()) {
		$nuevo = array();
		if (is_array($consulta_menu)) {
			$nuevo = array();
			$ids_array = array();
			$i = 0;
			$posiciones = -1;
			while ($i < count($consulta_menu)) {
				if (!in_array($consulta_menu[$i]["idmenu"], $ids_array)) {
					$posiciones++;
					$nuevo[$posiciones] = $consulta_menu[$i];
					$ids_array[] = $consulta_menu[$i]["idmenu"];
					$nuevo[$posiciones]["derechos"] = array();
					//$nuevo[$posiciones]["derechos"][] = $consulta_menu[$i];
					//$nuevo[$posiciones]["derechos"][] = array();
				} else {
					$nuevo[$posiciones]["derechos"][] = $consulta_menu[$i];
				}
				$i++;
			}
		}
		return $nuevo;
	}

	/**
	 * Verifica si el usuario tiene o no derecho a una accion dentro del controlador
	 * @param array $menu_permisos es el objeto de menu guardado en la sesión
	 * @param string $vista es la url de del control para validar si el usuario tiene permisos
	 * @param string $accion es la accion a verificar (modificar, eliminar, crear)
	 * @return array retorna 1 si el usuario tiene permiso y 0 en caso contrario
	 */
	public static function verifica_permiso($menu_permisos = array(), $keyword = "", $idnivel = "") {
		if ($menu_permisos != null) {
			if ($idnivel == "") {
				foreach ($menu_permisos as &$derecho) {

					if ($keyword == $derecho->keyword) {
						return true;
					}
				}
			} else {
				foreach ($menu_permisos as &$derecho) {
					if ($keyword == $derecho->keyword && $derecho->idnivel == $idnivel) {
						return true;
					}
				}
			}
		}

		return false;
	}

	/**
	 * Método que genera un array con la estructura necesaria para pasar mensaje en el request
	 * @param string $tipo es el tipo de mensaje segun las constantes definidas en esta misma clase
	 * @param string $mensaje es el texto del mensaje
	 * @return array retorna un array con el formato de mensaje

	 */
	public static function crea_mensaje($tipo = "", $mensaje = "") {
		return array("type" => $tipo, "message" => $mensaje);
	}

	/**
	 * Método que genera el html del mensaje
	 * @param array $mensaje arreglo de mensaje
	 * @param boolean $cerrar indica si se añadira el boton de cerrar
	 * @return string retorna el html del mensaje
	 */
	public static function crea_html_mensaje($mensaje = array(), $cerrar = TRUE) {
		if (isset($mensaje)) {
			$type = "alert-info";
			if (isset($mensaje["type"])) {
				switch ($mensaje["type"]) {
					case SUCCESMESSAGE:
						$type = "alert-success ";
						break;
					case ERRORMESSAGE:
						$type = "alert-danger ";
						break;
				}
				return "<div class=\"alert {$type}alert-dismissible\" role=\"alert\">"
						. ($cerrar ? "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>" : "")
						. "  {$mensaje["message"]}"
						. "</div>";
			}
			return "";
		} else {
			return "";
		}
	}

	/**
	 * Método que obtiene los datos del usuario de la session, en caso de que el usuario no exista retorna nulo
	 * @param array $contexto  es el controlador para poder recuperar los dados de la sesión
	 * @return array retorna el usuario almacenado en la session

	 */
	public static function get_usuario_sesion($contexto) {
		if (UtilsWrapper::haySesionAbierta($contexto)) {
			return $contexto->session->userdata(DATOSUSUARIO);
		} else {
			return null;
		}
	}

	/**
	 * Método que guarda los datos del usuario en la sesión
	 * @param array $contexto es el controlador para poder recuperar los dados de la sesión
	 * @param array $usuario son los datos de usuario a almacenar
	 */
	public static function set_usuario_sesion($contexto, $usuario) {
		$contexto->session->set_userdata(DATOSUSUARIO, $usuario);
	}

	/**
	 * Método que que comprueba si la session existe si no existe redirije a login
	 * @param controlador $contexto es el controlador para poder recuperar los dados de la sesión
	 * @return boolean retorna true si la session existe
	 */
	public static function verifica_sesion_redirige($contexto) {
		if (!UtilsWrapper::haySesionAbierta($contexto)) {
			redirect('');
		}
		return true;
	}

	public static function verifica_sesion_redirige_ajax($contexto) {
		$bit = true;
		if (!UtilsWrapper::haySesionAbierta($contexto)) {
			echo "REDIRECT";
			$bit = false;
		}

		return $bit;
	}

	public function add_breadcrumb() {
		$con = '';
		$data = $this->uri->segment_array();
		echo '<ol class="breadcrumb">';
		foreach ($data as $row) {
			$con .= $row . '/';
			echo '<li class="breadcrumb-item"><a href="' . base_url('index.php/' . $con) . '">' . $row . '</a></li>';
		}
		echo '</ol>';
	}

	function get_tabla_sufijoxnivel($id_nivel) {
		$key = "";
		if ($id_nivel == NIVEL_PREE) {
			//tomamos los grupos de nivel preescolar
			$key = "pree";
		} else {
			if ($id_nivel == NIVEL_PRIM) {
				//tomamos los grupos de nivel preescolar
				$key = "prim";
			} else {
				if ($id_nivel == NIVEL_SEC) {
					//tomamos los grupos de nivel preescolar
					$key = "sec";
				}
			}
		}
		return $key;
	}

	function get_string_nivel_key($id_nivel) {
		$key = "";
		if ($id_nivel == NIVEL_PREE) {
			//tomamos los grupos de nivel preescolar
			$key = "idgrupo_pree";
		} else {
			if ($id_nivel == NIVEL_PRIM) {
				//tomamos los grupos de nivel preescolar
				$key = "idgrupo_prim";
			} else {
				if ($id_nivel == NIVEL_SEC) {
					//tomamos los grupos de nivel preescolar
					$key = "idgrupo_sec";
				}
			}
		}
		return $key;
	}

	function prep_insert_gusuario($idusuario, $grupos, $id_nivel, $id_keyfield = "idusuario") {
		$key = 0;
		$arreturn = array();
		if (is_array($grupos)) {
			$key = $this->get_string_nivel_key($id_nivel);
			for ($i = 0; $i < count($grupos); $i++) {
				$temp = array();
				$temp[$id_keyfield] = $idusuario;
				$temp[$key] = $grupos[$i];
				$arreturn[] = $temp;
			}
		}
		return $arreturn;
	}

	function get_n_grupousuario($nuevo, $consulta, $key) {
		$arr = array();
		for ($i = 0; $i < count($nuevo); $i++) {
			$flag = false;
			for ($j = 0; $j < count($consulta); $j++) {
				if ($nuevo[$i][$key] != null) {
					if ($nuevo[$i][$key] > 0) {
						if ($consulta[$j][$key] == $nuevo[$i][$key]) {
							$flag = true;
							break;
						}
					}
				}
			}
			if (!$flag) {
				$arr[] = $nuevo[$i];
			}
		}
		return $arr;
	}

	function get_el_gusuario($nuevo, $consulta, $key_field, $key = "idgusuario") {
		$arr = array();
		for ($i = 0; $i < count($consulta); $i++) {
			$flag = false;
			for ($j = 0; $j < count($nuevo); $j++) {
				if ($nuevo[$j][$key_field] != null) {
					if ($nuevo[$j][$key_field] > 0) {
						if ($consulta[$i][$key_field] == $nuevo[$j][$key_field]) {
							$flag = true;
							break;
						}
					}
				}
			}
			if (!$flag) {
				$arr[] = $consulta[$i][$key];
			}
		}
		return $arr;
	}

	function get_existentes_gusuario($nuevo, $consulta) {
		$existentes = array();
		for ($i = 0; $i < count($consulta); $i++) {
			for ($j = 0; $j < count($nuevo); $j++) {
				if ($consulta[$i]["idgrupo_pree"] != null) {
					if ($consulta[$i]["idgrupo_pree"] > 0) {
						if ($consulta[$i]["idgrupo_pree"] == $nuevo[$j]["idgrupo_pree"]) {
							$existentes[] = $consulta[$i];
							break;
						}
					}
				} else {
					if ($consulta[$i]["idgrupo_prim"] > 0) {
						if ($consulta[$i]["idgrupo_prim"] == $nuevo[$j]["idgrupo_prim"]) {
							$existentes[] = $consulta[$i];
							break;
						}
					}
				}
			}
		}
		return $existentes;
	}

	function stringtoarray($string) {
		if ($string != null) {
			if (!is_array($string)) {
				$string = explode(",", $string);
			}
		} else {
			$string = array();
		}
		return $string;
	}

	function agrega_primera_opcion($array, $label, $value, $key_label, $key_value) {
		$fop = array();
		$fop[$key_label] = $label;

		$fop[$key_value] = $value;

		if (is_array($array)) {
			array_unshift($array, $fop);
		} else {
			$array = $fop;
		}
		return $array;
	}

	function get_grupos_por_nivel($contexto, $id_nivel, $centro_cfg, $status = null) {
		$grupos = array();
		if ($id_nivel == NIVEL_PREE) {
			//tomamos los grupos de nivel preescolar
			$grupos = $contexto->grupo_pree_model->get_grupos_cfg($centro_cfg, $status);
		} else {
			if ($id_nivel == NIVEL_PRIM) {
				//tomamos los grupos de nivel preescolar
				$grupos = $contexto->grupo_prim_model->get_grupos_cfg($centro_cfg, $status);
			} else {
				if ($id_nivel == NIVEL_SEC) {
					//tomamos los grupos de nivel preescolar
					$grupos = $contexto->grupo_sec_model->get_grupos_cfg($centro_cfg, $status);
				}
			}
		}
		return $grupos;
	}

	function separa_grupos($grupos) {
		$grupos_separados = array();
		$grados = array();
		for ($i = 0; $i < count($grupos); $i++) {
			if (!in_array($grupos[$i]["grado"], $grados)) {
				$grados[] = $grupos[$i]["grado"];
			}
		}

		asort($grados);
		for ($i = 0; $i < count($grados); $i++) {
			$ag = array();
			$lista_letras = array();
			for ($j = 0; $j < count($grupos); $j++) {
				if ($grados[$i] == $grupos[$j]["grado"]) {
					$ag[] = $grupos[$j];
				}
			}
			if (count($ag) > 0) {
//                print_r($ag);
				usort($ag, function ($item1, $item2) {
					if ($item1['grupo'] == $item2['grupo'])
						return 0;
					return $item1['grupo'] < $item2['grupo'] ? -1 : 1;
				});
				$grupos_separados[] = $ag;
			}
		}

		return $grupos_separados;
	}

	function pinta_grupos_usuario($grupos, $asig, $id_nivel = 0, $disabled = false) {
		$grupos = empty($grupos) ? array() : $grupos;
		$asig = empty($asig) ? array() : $asig;
		$key = $this->get_string_nivel_key($id_nivel);

		$checks_grupos = array();
		//print_r($asig);
		for ($i = 0; $i < count($grupos); $i++):
			?>
			<!--<div class="div_row_buttons">-->
			<?php for ($j = 0; $j < count($grupos[$i]); $j++): ?>
				<?php
				$ischecked = "";

				for ($k = 0; $k < count($asig); $k++) {
					if ($asig[$k][$key] == $grupos[$i][$j]["idgrupo"]) {
						$ischecked = "checked";
					}
				}
				$checks_grupos[] = array(
					'grado_grupo' => $grupos[$i][$j]["grado"] . ' - ' . $grupos[$i][$j]["grupo"],
					'idgrupo' => $grupos[$i][$j]["idgrupo"],
					'asesor' => $grupos[$i][$j]["idpersonal_asesor"],
					'ischecked' => $ischecked);
				?>
				<!--<div class="checkbox">
					<label>
						<input class="cb-grupo" name="grupos_usuario[]"  type="checkbox" value="<?php //echo ($grupos[$i][$j]["idgrupo"]);               ?>" <?php //echo $ischecked               ?>/>
				<?php //echo $grupos[$i][$j]["grado"];  ?> -
				<?php //echo $grupos[$i][$j]["grupo"];  ?>
					</label>
				</div>-->
			<?php endfor; ?>
			<!--</div>    -->
			<?php
		endfor;

		asort($checks_grupos);
		$nueva_fila = 0;
		$columnas = 3;
		foreach ($checks_grupos as $grupo) {

			if ($nueva_fila % $columnas == 0) {
				echo '<div class="div_row_buttons">';
				$nueva_fila = 0;
			}
			echo '<div class="checkbox"><label>';
			echo '<input class="cb-grupo" ' . ($disabled ? "disabled" : "") . ' name="grupos_usuario[]"  type="checkbox" value="' . $grupo['idgrupo'] . '" ' . $grupo['ischecked'] . ' />';
			echo $grupo['grado_grupo'];
			if($grupo['asesor'] != ''){
				echo '<label style="color:#42a5f5;">[Docente responsable del grupo]</label>';
			}
			echo '</label></div>';

			echo $nueva_fila == $columnas ? '</div>' : '';
			$nueva_fila++;
		}
	}

	public function get_cctxcfg($ctcfg, $contexto) {
		// echo print_r($contexto->Centrocfg_model->get_centrocfg($ctcfg));
		return "MI ESCUELITA";
	}

	public function getMenu($usuario) {
		// echo "<pre>";
		// print_r($usuario);
		// die();
		$menu = array();

		switch ($usuario->tipo->subtipo) {
			case IDSUPTIPOCENTRAL:
				$menu = array();
				$alumnos = array('tipo' => 'Alumnos', 'href' => '#', 'icon' => 'fa-users');
				$alumnos["subelementos"] = array();

				//if ($usuario->tipo->idtipousuario != IDADMINCENTRAL && UtilsWrapper::verifica_permiso($usuario->permisos, 'MC_101')) {
				if (($usuario->tipo->idtipousuario === '1' || $usuario->tipo->idtipousuario === '4' ||
						$usuario->tipo->idtipousuario === '5' || $usuario->tipo->idtipousuario === '6') ||
						(UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRE_VER_ALUMNOS') ||
						UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRI_VER_ALUMNOS') ||
						UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'SEC_VER_ALUMNOS'))
				) {
					$alumnos["subelementos"][] = array('subelemento' => 'Consultar alumnos', 'hrefelem' => base_url('index.php/Alumno/consulta'));
				}

				if (($usuario->tipo->idtipousuario == "1") ||
						(UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRE_ADD_ALUMNO') ||
						UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRI_ADD_ALUMNO') ||
						UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'SEC_ADD_ALUMNO')) &&
						($usuario->tipo->idtipousuario != "4" && $usuario->tipo->idtipousuario != "5" && $usuario->tipo->idtipousuario != "6")
				) {
					$alumnos["subelementos"][] = array('subelemento' => 'Crea expediente', 'hrefelem' => base_url('index.php/Alumno/creaExpediente'));
				}
				if ($usuario->tipo->idtipousuario == IDADMINCENTRAL || ($usuario->tipo->idtipousuario != IDADMINCENTRAL && (UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRE_UNIR_EXPS') || UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRI_UNIR_EXPS') || UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'SEC_UNIR_EXPS')))) {
					$alumnos["subelementos"][] = array('subelemento' => 'Unificar expedientes', 'hrefelem' => base_url('index.php/Alumno/unificaExpedientes'));
				}

				// ESTADISTICAS DE INSCRIPCIONES JOSE LUIS
				$cort_submenuins = array();
				if ($usuario->tipo->idtipousuario == IDADMINCENTRAL || ($usuario->tipo->idtipousuario != IDADMINCENTRAL && (UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRE_UNIR_EXPS') || UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRI_UNIR_EXPS') || UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'SEC_UNIR_EXPS')))) {
					// $cort_submenuins[] = array('label' => 'Consultas', 'hrefelem' => base_url('index.php/Inscripciones/consultas_central'));
					$cort_submenuins[] = array('label' => 'Estadísticas', 'hrefelem' => base_url('index.php/Estadisticasinsc/index'));


					// $alumnos["subelementos"][] = array('subelemento' => 'Inscripción', 'niveles' => $cort_submenuins, 'nivel2' => TRUE);
				}

				if ( $usuario->tipo->idtipousuario == IDADMINCENTRAL ||
					  ($usuario->tipo->idtipousuario != IDADMINCENTRAL && ( UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRE_VER_PREINSCRIPCIONES') ||
					                                                  UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRI_VER_PREINSCRIPCIONES') ||
																														UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'SEC_VER_PREINSCRIPCIONES'))
																													)
						) {
							$cort_submenuins[] = array('label' => 'Consultas', 'hrefelem' => base_url('index.php/Inscripciones/consultas_central'));
				      }
				// echo "<pre>"; print_r($cort_submenuins); die();
				// $alumnos["subelementos"][] = array('subelemento' => 'Preinscripción', 'niveles' => $cort_submenuins, 'nivel2' => TRUE);
				// ESTADISTICAS DE INSCRIPCIONES JOSE LUISs



				$menu[] = $alumnos;
				$escuela = array('tipo' => 'Escuelas', 'href' => '#', 'icon' => 'fa-university');
				/*
				if ($usuario->tipo->idtipousuario == IDADMINCENTRAL || ($usuario->tipo->idtipousuario != IDADMINCENTRAL && (UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRE_ADM_ESCUELAS') || UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRI_ADM_ESCUELAS') || UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'SEC_ADM_ESCUELAS')))) {
				    $escuela["subelementos"][] = array('subelemento' => 'Consulta y validación', 'hrefelem' => base_url('/Cct/listado_escuelas'));
				}
				*/
				/* Comentado mientras está en desarrollo */
				if ($usuario->tipo->idtipousuario == IDADMINCENTRAL || ($usuario->tipo->idtipousuario != IDADMINCENTRAL && (UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRE_ADM_ESCUELAS') || UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRI_ADM_ESCUELAS') || UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'SEC_ADM_ESCUELAS')))) {
				    $escuela["subelementos"][] = array('subelemento' => 'Conf. acceso', 'hrefelem' => base_url('/Centrostrabajo/central'));
				}


				//if ($usuario->tipo->idtipousuario == IDADMINCENTRAL || UtilsWrapper::verifica_permiso($usuario->permisos, 'MC_001') || UtilsWrapper::verifica_permiso($usuario->permisos, 'MC_002'))
				if ($usuario->tipo->idtipousuario == IDADMINCENTRAL || ($usuario->tipo->idtipousuario != IDADMINCENTRAL && (UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRE_VER_SOLS') || UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRI_VER_SOLS') || UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'SEC_VER_SOLS')))) {
					// $escuela["subelementos"][] = array('subelemento' => 'Solicitudes', 'hrefelem' => base_url('index.php/solicitudes'));
					$escuela["subelementos"][] = array('subelemento' => 'Solicitudes', 'hrefelem' => base_url('Solicitudes'));

				}
				if ($usuario->tipo->idtipousuario == IDADMINCENTRAL) {
					$escuela["subelementos"][] = array('subelemento' => 'Inicio y fin de ciclo', 'hrefelem' => base_url('index.php/Corte/central'));
				}
				if ($usuario->tipo->idtipousuario == IDADMINCENTRAL || (UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRE_VER_STATS') ||
						UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRI_VER_STATS') ||
						UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'SEC_VER_STATS'))) {
					$escuela["subelementos"][] = array('subelemento' => 'Estad&iacutesticas', 'hrefelem' => base_url('index.php/Estadisticas/central'));
				}

				// if ($usuario->tipo->idtipousuario == IDADMINCENTRAL) {
				// 	$escuela["subelementos"][] = array('subelemento' => 'cripción', 'hrefelem' => base_url('index.php/CapacidadOfer/index'));
				// }  /////////// Se retira el camo de CT de inscripción




				$menu[] = $escuela;
//se comento validado por ap y se descomenta hasta que este disponible contenido para esta seccion
				// $documentos = array('tipo' => 'Documentos', 'href' => '#', 'icon' => 'fa-file-text-o');
				// $documentos["elementos"] = array();
				//
				//
				// if ($usuario->tipo->idtipousuario != IDADMINCENTRAL && UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'MC_103')) {
				// 	$documentos["elementos"][] = array('subelemento' => 'Documentos Oficiales', 'hrefelem' => '#');
				// } else {
				// 	if ($usuario->tipo->idtipousuario == IDADMINCENTRAL) {
				// 		$documentos["elementos"][] = array('subelemento' => 'Documentos Oficiales', 'hrefelem' => '#');
				// 	}
				// }
				// $menu[] = $documentos;

				//si tiene derechos se agrega menu y submenu de personal
				if ($usuario->tipo->idtipousuario == IDADMINCENTRAL || ($usuario->tipo->idtipousuario != IDADMINCENTRAL && (UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRE_VER_PERS') || UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRI_VER_PERS') || UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'SEC_VER_PERS')))) {
					$personal = array('tipo' => 'Personal', 'href' => '#', 'icon' => 'fa-user');
					$personal["subelementos"][] = array('subelemento' => 'Consultar plantilla', 'hrefelem' => base_url('index.php/personal/listado_personal'));
					$menu[] = $personal;
				}


				// $pace = array('tipo' => 'Comunicaci&oacuten', 'href' => '#', 'icon' => 'fa-paper-plane');
                $pace = array('tipo' => 'Mensajes', 'href' => '#', 'icon' => 'fa-paper-plane');

				$pace["subelementos"] = array();
				// if ($usuario->tipo->idtipousuario != IDADMINCENTRAL && UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'MC_015')) {
				//     $pace["subelementos"][] = array('subelemento' => 'Mensajes', 'hrefelem' => base_url('index.php/mensajes/listado_mensajes_central'));
				// } else {
				//     if ($usuario->tipo->idtipousuario == IDADMINCENTRAL) {
				//         $pace["subelementos"][] = array('subelemento' => 'Mensajes', 'hrefelem' => base_url('index.php/mensajes/listado_mensajes_central'));
				//     }
				// }
				// echo "ID tipo usuario: ".$usuario->tipo->idtipousuario; echo "\n"; echo "IDADMINCENTRAL: ".IDADMINCENTRAL;  echo "\n";echo "IDCENTRAL: ".IDCENTRAL;  echo "\n"; echo "IDREGIONALCENTRAL: ".IDREGIONALCENTRAL;  echo "\n";
				// echo "<pre>";
				// print_r($usuario->permisos);
				// die();

				if ($usuario->tipo->idtipousuario == IDADMINCENTRAL) {
					// echo "Mensajes IDADMINCENTRAL";
					$pace["subelementos"][] = array('subelemento' => 'Mensajes', 'hrefelem' => base_url('index.php/mensajes/listado_mensajes_central'));
				} elseif (($usuario->tipo->idtipousuario == IDCENTRAL || $usuario->tipo->idtipousuario == IDREGIONALCENTRAL) && (UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRE_ADM_MSG') || UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRI_ADM_MSG') || UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'SEC_ADM_MSG'))) {
					// echo "Mensajes IDCENTRAL || IDREGIONALCENTRAL";

					$pace["subelementos"][] = array('subelemento' => 'Mensajes', 'hrefelem' => base_url('index.php/mensajes/listado_mensajes_central'));
				}

				if ($usuario->tipo->idtipousuario == IDADMINCENTRAL || ($usuario->tipo->idtipousuario != IDADMINCENTRAL && (UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRE_ATN_ALERTAS') || UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRI_ATN_ALERTAS') || UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'SEC_ATN_ALERTAS')))) {
					// $pace["subelementos"][] = array('subelemento' => 'Alertas', 'hrefelem' => base_url('index.php/alertas/listado_alertas'));
					$pace["subelementos"][] = array('subelemento' => 'Alertas', 'hrefelem' => base_url('alertas/central'));
				}


				$menu[] = $pace;
				$configuracion = array('tipo' => 'Configuraci&oacuten', 'href' => '#', 'icon' => 'fa-cog');
				$configuracion["subelementos"] = array();

				/* COMENTADO TEMPORALMENTE, HASTA RESOLVER EL TEMA DE LOLS WEB SERVICES DE CENTROS DE TRABAJO -> MH 20190320
				if ($usuario->tipo->idtipousuario == IDADMINCENTRAL) {
					//$configuracion["subelementos"][] = array('subelemento' => 'Control de escuelas', 'hrefelem' => base_url('/Cct/listado_escuelas'));
					$configuracion["subelementos"][] = array('subelemento' => 'Insertar CCT', 'hrefelem' => base_url('index.php/Insertar_ccts'));
					$configuracion["subelementos"][] = array('subelemento' => 'Actualizar CCT', 'hrefelem' => base_url('index.php/Actualizacion'));
				}
				*/

				if ($usuario->tipo->idtipousuario == IDADMINCENTRAL ||
						($usuario->tipo->idtipousuario != IDADMINCENTRAL &&
							(UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRE_CONF_PARAMS') ||
								UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRI_CONF_PARAMS') ||
								UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'SEC_CONF_PARAMS'))
						)
					){
					$configuracion["subelementos"][] = array('subelemento' => 'Parámetros del sistema', 'hrefelem' => base_url('index.php/Parametro'));
				}

				/*
				  if ($usuario->tipo->idtipousuario != IDADMINCENTRAL && UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'MC_017')) {
				  $configuracion["subelementos"][] = array('subelemento' => 'Usuarios', 'hrefelem' => base_url('index.php/central/listado_usuarios'));
				  } else {
				  if ($usuario->tipo->idtipousuario == IDADMINCENTRAL) {
				  $configuracion["subelementos"][] = array('subelemento' => 'Usuarios', 'hrefelem' => base_url('index.php/central/listado_usuarios'));
				  }
				  }
				 */
				// Usuarios
				if ($usuario->tipo->idtipousuario == IDADMINCENTRAL) {
					$configuracion["subelementos"][] = array('subelemento' => 'Usuarios', 'hrefelem' => base_url('index.php/central/listado_usuarios'));
				} elseif (($usuario->tipo->idtipousuario == IDCENTRAL) &&
						(UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRE_ADM_USUARIOS') || UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRI_ADM_USUARIOS') || UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'SEC_ADM_USUARIOS'))
				) {
					$configuracion["subelementos"][] = array('subelemento' => 'Usuarios', 'hrefelem' => base_url('index.php/central/listado_usuarios'));
				}


				// if ($usuario->tipo->idtipousuario != IDADMINCENTRAL && UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'MC_018')) {
				// 	$configuracion["subelementos"][] = array('subelemento' => 'Escuela', 'hrefelem' => base_url('index.php/Cct/listado_escuelas'));
				// }


//					 else {
//                    if ($usuario->tipo->idtipousuario == IDADMINCENTRAL) {
//                        $configuracion["subelementos"][] = array('subelemento' => 'Escuela', 'hrefelem' => base_url('index.php/Cct/listado_escuelas'));
//                    }
//                }
				// Grupos MH
				if ($usuario->tipo->idtipousuario == IDADMINCENTRAL) {
					$configuracion["subelementos"][] = array('subelemento' => 'Grupos', 'hrefelem' => base_url('index.php/Grupo_central/grupos'));
				} elseif (($usuario->tipo->idtipousuario == IDCENTRAL || $usuario->tipo->idtipousuario == IDREGIONALCENTRAL) &&
						(
						UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRE_VER_GRUPOS') || UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRI_VER_GRUPOS') || UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'SEC_VER_GRUPOS') ||
						UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRE_ADM_GRUPOS') || UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRI_ADM_GRUPOS') || UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'SEC_ADM_GRUPOS')
						)
				) {
					$configuracion["subelementos"][] = array('subelemento' => 'Grupos', 'hrefelem' => base_url('index.php/Grupo_central/grupos'));
				}

				// if ($usuario->tipo->idtipousuario == IDCENTRAL && UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRE_ADM_ASIGADD')
				//      || ) {
				//     // $configuracion["subelementos"][] = array('subelemento' => 'Asignaturas Adicionales', 'hrefelem' => base_url('index.php/asignatura/listado_solicitudes_central'));
				//     // $configuracion["subelementos"][] = array('subelemento' => 'Asignaturas Adicionales', 'hrefelem' => base_url('index.php/asignatura/get_solicitudes_central'));
				//       $configuracion["subelementos"][] = array('subelemento' => 'Asignaturas Adicionales', 'hrefelem' => base_url('index.php/asignaturasadicionales/central')); // 20180510 MH
				// } else {
				//     if ($usuario->tipo->idtipousuario == IDADMINCENTRAL) {
				//       $configuracion["subelementos"][] = array('subelemento' => 'Asignaturas Adicionalessssss', 'hrefelem' => base_url('index.php/asignaturasadicionales/central'));
				//     }
				// }

				// ASIGNATURAS ADICIONALES NO DISPONIBLE PARA CENTRAL 20190326 MH
				/*
				if ($usuario->tipo->idtipousuario == IDADMINCENTRAL) {
					$configuracion["subelementos"][] = array('subelemento' => 'Asignaturas Adicionales', 'hrefelem' => base_url('index.php/asignaturasadicionales/central'));
				} elseif (($usuario->tipo->idtipousuario == IDCENTRAL || $usuario->tipo->idtipousuario == IDREGIONALCENTRAL) && (UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRE_ADM_ASIGADD') || UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRI_ADM_ASIGADD') || UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'SEC_ADM_ASIGADD'))) {
					$configuracion["subelementos"][] = array('subelemento' => 'Asignaturas Adicionales', 'hrefelem' => base_url('index.php/asignaturasadicionales/central'));
				}
				*/




				$menu[] = $configuracion;
				/*
				  $ayuda = array('tipo' => 'Ayuda', 'href' => '#', 'icon' => 'fa-life-ring');
				  $ayuda["subelementos"] = array();
				  $ayuda["subelementos"][] = array('subelemento' => 'Manual', 'hrefelem' => '#');
				  $ayuda["subelementos"][] = array('subelemento' => 'Soporte', 'hrefelem' => '#');
				  $menu[] = $ayuda;
				 */
				break;
			case IDSUPTIPOESCOLAR:
				// echo "<pre>";
				// print_r($usuario->subfijo_tablas);
				// die();

				$menu = array();
				$grupos = array('tipo' => 'Alumnos', 'href' => '/listado', 'icon' => 'fa-users');
				$grupos["subelementos"] = array();
				if (($usuario->tipo->idtipousuario === '1' || $usuario->tipo->idtipousuario === '4' ||
						$usuario->tipo->idtipousuario === '5' || $usuario->tipo->idtipousuario === '6') ||
						UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRE_VER_ALUMNOS') ||
						UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'PRI_VER_ALUMNOS') ||
						UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'SEC_VER_ALUMNOS')) {
					$grupos["subelementos"][] = array('subelemento' => 'Consultar alumnos', 'hrefelem' => base_url('index.php/Alumno/consulta'));
				// $cort_submenu[] = array('label' => 'Nuevo registro', 'hrefelem' => base_url('index.php/inscripciones/nuevoregistro'));

				// $grupos["subelementos"][] = array('subelemento' => 'Inscripción', 'niveles' => $cort_submenu, 'nivel2' => TRUE);

				}

				// MUESTRO EL MENÚ A ADMIN ESCOLAR QUE SI PARTICIPE EN EL PROCESO DE PREINSCRIPCIONES
				/*if ( ($usuario->tipo->idtipousuario === ADMINESCOLAR) && ($usuario->preinscripciones->participa == 1) ){
					$grupos["subelementos"][] = array('subelemento' => 'Preinscripciones', 'hrefelem' => base_url('index.php/inscripciones/consultas'));
				}*/
				if ( ($usuario->tipo->idtipousuario === ADMINESCOLAR) && ($usuario->preinscripciones->participa == 1) ){
					$cort_submenu[] = array('label' => 'Consultas', 'hrefelem' => base_url('index.php/inscripciones/consultas'));
					//$cort_submenu[] = array('label' => 'Nuevo registro', 'hrefelem' => base_url('index.php/inscripciones/nuevo_registro'));
					$grupos["subelementos"][] = array('subelemento' => 'Preinscripciones', 'niveles' => $cort_submenu, 'nivel2' => TRUE);
				}




				if ($usuario->subfijo_tablas !== "pree") {
					$grupos["subelementos"][] = array('subelemento' => 'SiSAT', 'hrefelem' => base_url('index.php/Sisat/load_sisat'));
				}



				////Muesro el menú Calificaciones por grupo si es que el usuario es de tipo ADMINESCOLAR
				/*
				if ($usuario->tipo->idtipousuario === ADMINESCOLAR && $usuario->subfijo_tablas !== "pree") {
					$grupos["subelementos"][] = array('subelemento' => 'Calificaciones por grupo', 'hrefelem' => base_url('index.php/Reporte/evaluacionesxgrupo'));
				}
				*/


//				$nivel2 = array();
//				if ((($usuario->tipo->idtipousuario == ADMINESCOLAR)) && ($usuario->prefijo_nivel == NIVEL_PRIM)) {
//					//$nivel2[] = array('label' => 'Captura de datos', 'hrefelem' => '#');
//					//$nivel2[] = array('label' => 'Estadísticas', 'hrefelem' => '#');
//					$nivel2[] = array('label' => 'Captura de datos', 'hrefelem' => base_url('index.php/Sisat/load_sisat'));
//					$nivel2[] = array('label' => 'Estadísticas', 'hrefelem' => base_url('index.php/Sisat/get_estadisticas'));
//					$grupos["subelementos"][] = array('subelemento' => 'SisAT', 'niveles' => $nivel2, 'nivel2' => TRUE);
//				} else if (($usuario->tipo->idtipousuario == ESCOLARLIMITADO) && ($usuario->prefijo_nivel == NIVEL_PRIM)) {
//					//$nivel2[] = array('label' => 'Captura de datos', 'hrefelem' => '#');
//					$nivel2[] = array('label' => 'Captura de datos', 'hrefelem' => base_url('index.php/Sisat/load_sisat'));
//					$grupos["subelementos"][] = array('subelemento' => 'SisAT', 'niveles' => $nivel2, 'nivel2' => TRUE);
//				}
				// echo "<pre>"; print_r($grupos); die();
				$menu[] = $grupos;


				$soilicitudes = array('tipo' => 'Solicitudes', 'href' => '#', 'icon' => 'fa-inbox');
				$soilicitudes["subelementos"] = array();
				$soilicitudes["subelementos"][] = array('subelemento' => 'Consultar solicitudes', 'hrefelem' => base_url('index.php/solicitud'));

				$menu[] = $soilicitudes;
				if ($usuario->tipo->idtipousuario == ADMINESCOLAR) {
					$personal = array('tipo' => 'Personal', 'href' => '#', 'icon' => 'fa-user');
					$personal["subelementos"] = array();

					$personal["subelementos"][] = array('subelemento' => 'Consultar plantilla', 'hrefelem' => base_url('index.php/personal/listado_personal'));

					$menu[] = $personal;
				}


//				$estats = array('tipo' => 'Datos', 'href' => '#', 'icon' => 'fa-life-ring');
//				$estats["subelementos"] = array();
//				$estats["subelementos"][] = array('subelemento' => 'Grupos y alumnos', 'hrefelem' => '#');
//				// $estats["subelementos"][] = array('subelemento' => 'Estadisticas SiSAT', 'hrefelem' => base_url('/Sisat/get_estadisticas'));
//
//				$menu[] = $estats;
// COMENTADO BY LUIS
				// $estats = array('tipo' => 'Datos', 'href' => '#', 'icon' => 'fa-life-ring');
				// $estats["subelementos"] = array();
				// $estats["subelementos"][] = array('subelemento' => 'Grupos y alumnos', 'hrefelem' => '#');
				// // $estats["subelementos"][] = array('subelemento' => 'Estadisticas SiSAT', 'hrefelem' => base_url('/Sisat/get_estadisticas'));
				// $menu[] = $estats;
//CONMENTADO BY LUIS
				// echo "<pre>";print_r($usuario->pace);die();
				//$pace = array('tipo' => 'Comunicaci&oacuten', 'href' => '#', 'icon' => 'fa-paper-plane');
                $pace = array('tipo' => 'Mensajes', 'href' => '#', 'icon' => 'fa-paper-plane');
				$pace["subelementos"] = array();
				if ($usuario->tipo->idtipousuario == ADMINESCOLAR || $usuario->tipo->idtipousuario == ESCOLARLIMITADO) {
					$pace["subelementos"][] = array('subelemento' => 'Mensajes', 'hrefelem' => base_url('index.php/mensajes/listado_mensajes'));
					// $pace["subelementos"][] = array('subelemento' => 'Alertas', 'hrefelem' => base_url('index.php/alertas/escolar'));
					$pace["subelementos"][] = array('subelemento' => 'Alertas', 'hrefelem' => base_url('alertas/escolar'));
				}
				if ($usuario->pace) {
					$menu[] = $pace;
				}

//				$configuracion = array('tipo' => 'Configuración', 'href' => '#', 'icon' => 'fa-cog');
//				$configuracion["subelementos"] = array();
//				if ($usuario->tipo->idtipousuario == ADMINESCOLAR) {
//					$configuracion["subelementos"][] = array('subelemento' => 'Usuarios', 'hrefelem' => base_url('index.php/escolar/listado_usuarios'));
//				}
//				//todos acceden al cambio de contraseña
//				$configuracion["subelementos"][] = array('subelemento' => 'Cambiar contraseña', 'hrefelem' => base_url('index.php/escolar/cambio_contrasena'));
//
//				if ($usuario->tipo->idtipousuario == ADMINESCOLAR) { // ADMINESCOLAR = '4'
//					$configuracion["subelementos"][] = array('subelemento' => 'Grupos', 'hrefelem' => base_url('index.php/grupo_sec/grupos'));
//					// if (isset($usuario->nivel) &&  $usuario->nivel != NIVEL_PREE)
//					// $configuracion["subelementos"][] = array('subelemento' => 'Asignaturas adicionales', 'hrefelem' => base_url('index.php/asignatura/listado_solicitudes'));
//				}
//				$configuracion["subelementos"][] = array('subelemento' => 'Datos de escuela', 'hrefelem' => base_url('/Datos_escuela/'));
//
//				// Las asignaturas adicionales van para todos los usuarios ADMINESCOLAR
//				if ($usuario->tipo->idtipousuario == ADMINESCOLAR) { // ADMINESCOLAR = '4'
//					$configuracion["subelementos"][] = array('subelemento' => 'Asignaturas adicionales', 'hrefelem' => base_url('index.php/asignatura/listado_solicitudes'));
//				}
//
//				$menu[] = $configuracion;


				$escuela = array('tipo' => 'Escuela', 'href' => '#', 'icon' => 'fa-life-ring');
				$escuela["subelementos"] = array();

//				$pace = array();
//				if ($usuario->tipo->idtipousuario == ADMINESCOLAR) {
//					$pace[] = array('label' => 'Mensajes', 'hrefelem' => base_url('/mensajes/listado_mensajes'));
//					$pace[] = array('label' => 'Alertas', 'hrefelem' => base_url('/alertas/listado_alertas'));
//
//					//$nivel2[] = array('label' => 'Captura de datos', 'hrefelem' => base_url('index.php/Sisat/load_sisat'));
//					//$nivel2[] = array('label' => 'Estadísticas', 'hrefelem' => base_url('index.php/Sisat/get_estadisticas'));
//				}
//				if ($usuario->pace) {
//					$escuela["subelementos"][] = array('subelemento' => 'Comunicación', 'niveles' => $pace, 'nivel2' => TRUE);
				if ($usuario->tipo->idtipousuario == ADMINESCOLAR) { // ADMINESCOLAR = '4'
					if ($usuario->parametros->cortiniciclo == "1") {
						$cort_submenu[] = array('label' => 'Inicio de ciclo', 'hrefelem' => base_url('index.php/Corte/corteinicio'));
					}
					if ($usuario->parametros->cortfinciclo == "1") {
						$cort_submenu[] = array('label' => 'Fin de ciclo', 'hrefelem' => base_url('index.php/Corte/cortefin'));
					}
					if ($usuario->parametros->cortiniciclo == "1" || $usuario->parametros->cortfinciclo == "1") {
						$escuela["subelementos"][] = array('subelemento' => 'Cierre electr&oacutenico <i class="fas fa-angle-left"></i>', 'niveles' => $cort_submenu, 'nivel2' => TRUE);
					}

					$escuela["subelementos"][] = array('subelemento' => 'Planeación de la Ruta de Mejora', 'hrefelem' => base_url('index.php/Rutademejora/index'));
				}
//				}
				$escuela["subelementos"][] = array('subelemento' => 'Cambiar contrase&ntildea', 'hrefelem' => base_url('index.php/usuario/cambio_contrasena'));


				// Comentado mientras está en desarrollo
				if ($usuario->tipo->idtipousuario == ADMINESCOLAR) { // ADMINESCOLAR = '4'
					$escuela["subelementos"][] = array('subelemento' => 'Clubes', 'hrefelem' => base_url('index.php/clubes/index'));
				}





				if ($usuario->tipo->idtipousuario == ADMINESCOLAR) { // ADMINESCOLAR = '4'
					// $escuela["subelementos"][] = array('subelemento' => 'Grupos', 'hrefelem' => base_url('index.php/grupo_sec/grupos'));
					switch ($usuario->prefijo_nivel) {
						case NIVEL_PREE:
							$escuela["subelementos"][] = array('subelemento' => 'Grupos', 'hrefelem' => base_url('index.php/grupo_pree/grupos'));
							break;
						case NIVEL_PRIM:
							$escuela["subelementos"][] = array('subelemento' => 'Grupos', 'hrefelem' => base_url('index.php/grupo_prim/grupos'));
							break;
						case NIVEL_SEC:
							$escuela["subelementos"][] = array('subelemento' => 'Grupos', 'hrefelem' => base_url('index.php/grupo_sec/grupos'));
							break;
					}

					$escuela["subelementos"][] = array('subelemento' => 'Usuarios', 'hrefelem' => base_url('index.php/escolar/listado_usuarios'));

					// $escuela["subelementos"][] = array('subelemento' => 'Asignaturas adicionales', 'hrefelem' => base_url('index.php/asignatura/listado_solicitudes'));
					// ASIGNATURAS ADICIONALES NO DISPONIBLE PARA ESCOLAR 20190326 MH
					/*
					$escuela["subelementos"][] = array('subelemento' => 'Asignaturas adicionales', 'hrefelem' => base_url('index.php/asignaturasadicionales/solicitudes'));
					*/

					$escuela["subelementos"][] = array('subelemento' => 'Estad&iacutesticas', 'hrefelem' => base_url('index.php/estadisticas/load_index'));
				}

				$escuela["subelementos"][] = array('subelemento' => 'Datos de escuela', 'hrefelem' => base_url('/Datos_escuela/'));
				//$escuela["subelementos"][] = array('subelemento' => 'Videotutoriales', 'hrefelem' => base_url('index.php/Escolar/videotutoriales'));
				$escuela["subelementos"][] = array('subelemento' => 'Soporte', 'hrefelem' => base_url('/contacto'));

				$menu[] = $escuela;

				break;
			case IDSUPTIPOSUPERVISOR:
				$menu = array();
				//alumnos
				$alumnos = array('tipo' => 'Alumnos', 'href' => "#", 'icon' => 'fa-users');
// <<<<<<< .mine
				// echo "<pre>"; print_r($usuario); die();
				$alumnos["subelementos"] = array();
				$alumnos["subelementos"][] = array('subelemento' => 'Consultar', 'hrefelem' => base_url('index.php/Alumno/consulta'));
				// echo "<pre>";
				// print_r($usuario);
				// die();
				if ($usuario->nivel_supervisor == NIVEL_PRIM || $usuario->nivel_supervisor == NIVEL_SEC) {
					$alumnos["subelementos"][] = array('subelemento' => 'SiSAT', 'hrefelem' => base_url('index.php/Sisat/load_sisat'));
				}
				$alumnos["subelementos"][] = array('subelemento' => 'Ruta de Mejora', 'hrefelem' => base_url('index.php/Rutademejora/index'));


				// $consultar = array('subelemento' => 'Consultar', 'hrefelem' => '#');
				//
                // $consultar["subelementos"] = array();
				// $consultar["subelementos"][] = array('subelemento' => 'Expediente', 'hrefelem' => "#");
				// $consultar["subelementos"][] = array('subelemento' => 'Evaluaciones', 'hrefelem' => base_url('#'));
				// $consultar["subelementos"][] = array('subelemento' => 'Históricos', 'hrefelem' => base_url('#'));
				// $consultar["subelementos"][] = array('subelemento' => 'Reportes', 'hrefelem' => base_url('#'));
// ||||||| .r783
//                 $alumnos["subelementos"] = array();
//                 $consultar = array('subelemento' => 'Consultar', 'hrefelem' => '#');
//                 $consultar["subelementos"] = array();
//                 $consultar["subelementos"][] = array('subelemento' => 'Expediente', 'hrefelem' => "#");
//                 $consultar["subelementos"][] = array('subelemento' => 'Evaluaciones', 'hrefelem' => base_url('#'));
//                 $consultar["subelementos"][] = array('subelemento' => 'Históricos', 'hrefelem' => base_url('#'));
//                 $consultar["subelementos"][] = array('subelemento' => 'Reportes', 'hrefelem' => base_url('#'));
// =======
//                 $alumnos["subelementos"] = array();
//                 $consultar = array('subelemento' => 'Consultar', 'hrefelem'  => base_url('index.php/Alumno/consulta'));
//                 $consultar["subelementos"] = array();
//                 $consultar["subelementos"][] = array('subelemento' => 'Expediente', 'hrefelem' => "#");
//                 $consultar["subelementos"][] = array('subelemento' => 'Evaluaciones', 'hrefelem' => base_url('#'));
//                 $consultar["subelementos"][] = array('subelemento' => 'Históricos', 'hrefelem' => base_url('#'));
//                 $consultar["subelementos"][] = array('subelemento' => 'Reportes', 'hrefelem' => base_url('#'));
// >>>>>>> .r787
				// $alumnos["subelementos"][] = $consultar;

				$menu[] = $alumnos;
				//fin alumnos
				//
					$solicitudes = array('tipo' => 'Solicitudes', 'href' => '#', 'icon' => 'fa-inbox');
				$solicitudes["subelementos"] = array();
				$solicitudes["subelementos"][] = array('subelemento' => 'Consultar solicitudes', 'hrefelem' => base_url('index.php/solicitud'));

				$menu[] = $solicitudes;
				//
				//estadisticas
				$estadisticas = array('tipo' => 'Estadísticas', 'href' => "#", 'icon' => 'fa-percentage');
				$estadisticas["subelementos"] = array();
				$estadisticas["subelementos"][] = array('subelemento' => 'Consultar estad&iacutesticas', 'hrefelem' => base_url('/estadisticas/load_index'));
//                $estadisticas["subelementos"][] = array('subelemento' => 'Reporte ACA', 'hrefelem' => '#');
				//$estadisticas["subelementos"][] = array('subelemento' => 'Resumen', 'hrefelem' => '#');

				$menu[] = $estadisticas;
				//fin menu estadisticas
				//personal
				$personal = array('tipo' => 'Personal', 'href' => "#", 'icon' => 'fa-user');
				$personal["subelementos"] = array();
				$personal["subelementos"][] = array('subelemento' => 'Consultar', 'hrefelem' => base_url('index.php/personal/listado_personal_supervision'));
				$menu[] = $personal;
				//fin personal
				//PACE
				// $pace = array('tipo' => 'Comunicaci&oacuten', 'href' => "#", 'icon' => 'fa-paper-plane');
				$pace = array('tipo' => 'Mensajes', 'href' => "#", 'icon' => 'fa-paper-plane');

				$pace["subelementos"] = array();
				$pace["subelementos"][] = array('subelemento' => 'Mensajes', 'hrefelem' => base_url('index.php/mensajes/listado_mensajes_supervisor'));
				// $pace["subelementos"][] = array('subelemento' => 'Alertas', 'hrefelem' => base_url('index.php/alertas/listado_alertas_supervision'));
				$pace["subelementos"][] = array('subelemento' => 'Alertas', 'hrefelem' => base_url('alertas/supervision'));
				$menu[] = $pace;
				//finpace
				//Configuración  Estad&iacutesticas
				$configuracion = array('tipo' => 'Configuraci&oacuten', 'href' => "#", 'icon' => 'fa-cog');
				$configuracion["subelementos"] = array();
				$configuracion["subelementos"][] = array('subelemento' => 'Cambiar contrase&ntildea', 'hrefelem' => base_url('index.php/usuario/cambio_contrasena'));
				$configuracion["subelementos"][] = array('subelemento' => 'Soporte', 'hrefelem' => base_url('/contacto'));
				$menu[] = $configuracion;
				//fin configuracion
				//ayuda
/*				$ayuda = array('tipo' => 'Ayuda', 'href' => '#', 'icon' => 'fa-life-ring');
				$ayuda["subelementos"] = array();
				//$ayuda["subelementos"][] = array('subelemento' => 'Videotutoriales', 'hrefelem' => base_url("index.php/Escolar/videotutoriales"));
				$ayuda["subelementos"][] = array('subelemento' => 'Soporte', 'hrefelem' => base_url('/contacto'));
				$menu[] = $ayuda; */
				//fin ayuda
				break;
		}
		return $menu;
	}

	function total_solicitudes_a_mi_escuela($idcentrocfg, $model) {
		$resp = 0;
		// de-otras-escuelas
		$params = array('tSol.status' => 'SIN', 'tGrupo.idcentrocfg' => $idcentrocfg);
		$resp = $model->get_total_solicitudes($params);
		return $resp;
	}

	function get_post_def($input, $key, $def) {
		$value = $input->post($key);
		if ($value != null) {
			return $value;
		} else {
			return $def;
		}
	}

	function get_fields_leido_main($sufijo) {
		return "mensaje_{$sufijo}.idalumno,mensaje_{$sufijo}.idgrupo,mensaje_{$sufijo}.idcentrocfg,mensaje_{$sufijo}.zona,mensaje_{$sufijo}.idmunicipio, mensaje_{$sufijo}.region,mensaje_{$sufijo}.idnivel,
                        mensaje_{$sufijo}.idmsj{$sufijo} as idmensaje, mensaje_{$sufijo}.titulo, mensaje_{$sufijo}.descr, mensaje_{$sufijo}.freg,
                        mensaje_{$sufijo}.finivigencia, mensaje_{$sufijo}.ffinvigencia, mensaje_{$sufijo}.idtipomensaje,
                        mensaje_{$sufijo}.idusuario, mensaje_{$sufijo}.idnivel, mensaje_{$sufijo}.region, mensaje_{$sufijo}.idmunicipio,
                        mensaje_{$sufijo}.zona, mensaje_{$sufijo}.idcentrocfg, mensaje_{$sufijo}.idgrupo, mensaje_{$sufijo}.idalumno,
                         mensaje_{$sufijo}.status
                        , tipomensaje.tipomensaje,
                         mensaje{$sufijo}_leido.leido
                        ";
	}

	function get_were_leido_main($sufijo, $idusuario, $idcentrocfg, $zona, $idmunicipio, $idnivel, $leidos) {
		$now = new DateTime();
		$now->setTimezone(new DateTimezone(ZONAHORARIA));
		return "(" .
				//"(mensaje_{$sufijo}.idalumno is NULL and mensaje_{$sufijo}.idusuario={$idusuario}) OR".
				" ( mensaje_{$sufijo}.idgrupo is NOT null and  grupoxusuario.idgrupo_{$sufijo}=mensaje_{$sufijo}.idgrupo and grupoxusuario.idusuario={$idusuario})
                           OR ( mensaje_{$sufijo}.idgrupo is null and mensaje_{$sufijo}.idcentrocfg=$idcentrocfg)
                           OR ( mensaje_{$sufijo}.idgrupo is null and mensaje_{$sufijo}.idcentrocfg is null and mensaje_{$sufijo}.zona={$zona})
                           OR ( mensaje_{$sufijo}.idgrupo is null and mensaje_{$sufijo}.idcentrocfg is null and mensaje_{$sufijo}.zona is NULL and mensaje_{$sufijo}.idmunicipio={$idmunicipio}  )" .
				//"-- OR ( mensaje_{$sufijo}.idgrupo is null and mensaje_{$sufijo}.idcentrocfg is null and mensaje_{$sufijo}.zona is NULL and mensaje_{$sufijo}.idmunicipio is NULL and  mensaje_{$sufijo}.region=$region)".
				" OR ( mensaje_{$sufijo}.idgrupo is null and mensaje_{$sufijo}.idcentrocfg is null and mensaje_{$sufijo}.zona is NULL and mensaje_{$sufijo}.idmunicipio is NULL and  mensaje_{$sufijo}.region is null and mensaje_{$sufijo}.idnivel={$idnivel}))
                           " . ($leidos == 0 ? " AND (mensaje{$sufijo}_leido.leido is null )" : " AND (mensaje{$sufijo}_leido.leido is not null  )") . //"AND mensaje_{$sufijo}.track={$leidos}
				" AND (mensaje_{$sufijo}.finivigencia <= \"{$now->format('Y-m-d H:i:s')}\" and mensaje_{$sufijo}.ffinvigencia > \"{$now->format('Y-m-d H:i:s')}\")
                           and (mensaje_{$sufijo}.`idusuario` is null or mensaje_{$sufijo}.idusuario <> {$idusuario} ) ";
	}

	function get_array_leido($leido, $idmsj, $idusuario, $sufijo) {
		$params = array();

		if ($leido != null) {
			$params["leido"] = $leido;
		}
		if ($idmsj != null) {
			$params["idmsj" . $sufijo] = $idmsj;
		}

		if ($idusuario != null) {
			$params["idusuario"] = $idusuario;
		}
		return $params;
	}

	function nullifemtyorcero($var) {
		return ($var == "" || $var == "0" ? null : $var );
	}

	function obtienevalorvaropost($var, $name) {
		return ($var != null && $var != "" ? $var : (isset($_POST[$name]) ? $_POST[$name] : "") );
	}

	function getidsnieveles($tipousuario, $permisos = array(), $infoct) {

		$idsniveles = array();

		if ($tipousuario == IDADMINCENTRAL) {
			$idsniveles[] = NIVEL_PREE;
			$idsniveles[] = NIVEL_PRIM;
			$idsniveles[] = NIVEL_SEC;
		} else if ($tipousuario == IDCENTRAL || $tipousuario == IDREGIONALCENTRAL) {
			for ($i = 0; $i < count($permisos); $i++) {
				if (!in_array($permisos[$i]->idnivel, $idsniveles)) {
					$idsniveles[] = $permisos[$i]->idnivel;
				}
			}
		} else { // es escolar
			$idsniveles[] = $infoct->nivel;
		}

		return $idsniveles;
	}

	function construyeselectlist($select) {
		$name = isset($select["name"]) ? $select["name"] : "nombrelist";
		$label = isset($select["label"]) ? $select["label"] : "";
		$selecthml = "<div class=\"cont_select_ajax_nivel_post\"><label class=\"mr-sm-2\" for=\"$name\">{$label}</label>";
		$selecthml .= "<select class=\"custom-select form-control\" id=\"{$name}\" name=\"$name\" >\"";
		$elements = array();

		//print_r($select["values"]);
		if (isset($select["values"])) {
			$elements = $select["values"];
		}
		$def_value = "";
		if (isset($select["default_value"])) {
			$def_value = $select["default_value"];
		}
		$llave_label = "";
		if (isset($select["llave_label"])) {
			$llave_label = $select["llave_label"];
		}
		$llave_value = "";
		if (isset($select["llave_value"])) {
			$llave_value = $select["llave_value"];
		}
		$deflabel = "";
		for ($j = 0; $j < count($elements); $j++) {
			$element_label = isset($elements[$j][$llave_label]) ? $elements[$j][$llave_label] : "";
			$element_value = isset($elements[$j][$llave_value]) ? $elements[$j][$llave_value] : "";
			if ($element_value == $def_value) {
				$deflabel = $element_label;
			}
			$selecthml .= "<option value=\"{$element_value}\" " . ($element_value == $def_value ? "selected" : "") . " >{$element_label}</option>";
		}
		$selecthml .= "</select></div>";
		return $selecthml;
	}

	function get_nivelespermisos($usuario_sesion, $key) {
		$niveles = array();
		for ($i = 0; $i < count($usuario_sesion->ids_niveles); $i++) {
			if (Utilswrapper::verifica_permiso_v2($usuario_sesion->permisos, $key, $usuario_sesion->ids_niveles[$i])) {
				$niveles[] = $usuario_sesion->ids_niveles[$i];
			}
		}
		return $niveles;
	}

	/**
	 * Método que que comprueba si la session es de admin escolar o manda acceso prohibido
	 * @param controlador $contexto es el controlador para poder recuperar los dados de la sesión
	 * @return boolean retorna true si la session existe
	 */
	public static function verifica_sesion_adminescolar($contexto) {
		$usuario = Utilswrapper::get_usuario_sesion($contexto);
		if ($usuario->tipo->idtipousuario != ADMINESCOLAR) {
			Utilswrapper::redirige_prohibido($contexto);
		}
		return true;
	}

	public static function get_zona_username($username) {
		$r = null;
		$temp = explode("@", $username);
		if (count($temp) > 1) {
			return trim($temp[1]);
		}
		return $r;
	}

	public static function get_format_date($date) {
		return date("d/m/Y", strtotime($date));
	}

	/**
	 * Método que comprueba si la session es de admin o manda acceso prohibido
	 * @param controlador $contexto es el controlador para poder recuperar los datos de la sesión
	 * @return boolean retorna true si la session existe
	 */
	public function verifica_sesion_admin($contexto) {
		$usuario = Utilswrapper::get_usuario_sesion($contexto);
		//if ($usuario->tipo->idtipousuario != IDADMINCENTRAL && $usuario->tipo->idtipousuario != ADMINESCOLAR) {
		if (($usuario->tipo->idtipousuario != IDADMINCENTRAL && $usuario->tipo->idtipousuario != ADMINESCOLAR && !UtilsWrapper::verifica_permiso_v2($usuario->permisos, 'MC_104'))) {

			Utilswrapper::redirige_prohibido($contexto);
		}
		return true;
	}

	public static function convert_date($str_fecha) {
		$timestamp_i = strtotime($str_fecha);
		return date('Y-m-d', $timestamp_i);
	}

	/*
	  Funcion para retornar datos a peticiones ajax
	 */

	public static function enviaDataJson($status, $data, $contexto) {
		return $contexto->output
						->set_status_header($status)
						->set_content_type('application/json', 'utf-8')
						->set_output(json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES))
						->_display();
	}

	public static function wb_serv_validarapa($cad_repo) {
		$xchaux = '';
		$url_wbsrest = "http://acasonora.org/wbser_rest?apa-pdf=" . $cad_repo;
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url_wbsrest);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		$xchaux = curl_exec($ch);
		curl_close($ch);
		return $xchaux;
	}

	public static function verifica_permiso_v2($arr_permisos = array(), $keyword = "") {
		if ($keyword == "" || $arr_permisos == NULL) {
			return FALSE;
		}

		if ($arr_permisos != NULL) {
			foreach ($arr_permisos as $permiso) {
				if ($keyword == $permiso->keyword) {
					return TRUE;
				}
			}
		}

		return FALSE;
	}

// verifica_permisov2()

	public static function validaAccesoPermisos($contexto, $keywordpre = "", $keywordpri = "", $keywordsec = "", $escolaradm = 0, $escolarlimit = 0, $supervisor = 0) {
		if (UtilsWrapper::haySesionAbierta($contexto)) { //si hay sesion abierta
			$usuariovalidacion = Utilswrapper::get_usuario_sesion($contexto); //variables de session
			if ($usuariovalidacion->idtipousuario == (int) $escolaradm || $usuariovalidacion->idtipousuario == (int) $escolarlimit || $usuariovalidacion->idtipousuario == (int) $supervisor) {
				//si lo que trae la session en idtipousuario es igual a alguna variable global que paso el usuario por la funcion (ADMINESCOLAR,ESCOLARLIMITADO,IDSUPERVISOR)
				return true;
			} else {
				if (($usuariovalidacion->idusuario == IDADMINCENTRAL && $usuariovalidacion->tipo->idtipousuario == 1 && $usuariovalidacion->tipo->tipousuario == "ADMIN") && ($keywordpre != "" || $keywordpri != "" || $keywordsec != "") && (count($usuariovalidacion->permisos) == 0)
				) {
					//para que enetre aqui debe de ser de tipo admincentral y que el usuario alla pasado una keyword por la funcion, y que en session no traiga ninguna keyword
					return true;
				} else {
					if ($keywordpre == "" || $keywordpri == "" || $keywordsec == "" || count($usuariovalidacion->permisos) == 0) {
						//si las keyword pasadas por el usuario son vacias y notrae keyword en la session (puede entrar admincentral, central y regional)
						UtilsWrapper::redirige_prohibido($contexto);
					}
					if (count($usuariovalidacion->permisos) > 0) {
						//si la session trae por lo menos una keyword
						foreach ($usuariovalidacion->permisos as $permiso) {
							if ($keywordpre == $permiso->keyword || $keywordpri == $permiso->keyword || $keywordsec == $permiso->keyword) {
								//si alguna de las keyword que trae la session coincide con alguna del las keyword que se pasaron por la funcion entra
								return true;
								break;
							}
						}
						//si ninguna de las keyword que trae la session coincidio con alguna del las keyword que se pasaron por la funcion
						Utilswrapper::redirige_prohibido($contexto);
					}
				}
			}
		} else {
			redirect("Login/index");
		}
	}

	public static function isRequestAjax($contexto) {
		if ($contexto->input->is_ajax_request()) {
			if (self::haySesionAbierta($contexto)) {
				return TRUE;
			} else {
				Utilswrapper::redirige_prohibido($contexto);
			}
		} else {
			Utilswrapper::redirige_prohibido($contexto);
		}
	}// isRequestAjax()

	public static function isPetAjax($contexto) {
		if ($contexto->input->is_ajax_request()) {
			if (self::haySesionAbierta($contexto)) {
				return TRUE;
			} else {
				return FALSE;
			}
		} else {
			return FALSE;
		}
	}// isPetAjax()

	public static function get_sufijotabla_xidnivel($idnivel) {
		$sufijo_tabla = '';
		switch ($idnivel) {
			case NIVEL_PREE:
				$sufijo_tabla = "pree";
			break;
			case NIVEL_PRIM:
				$sufijo_tabla = "prim";
			break;
			case NIVEL_SEC:
				$sufijo_tabla = "sec";

			break;
		}
		return $sufijo_tabla;
	}// get_sufijotabla_xidnivel()

	public static function get_nombremes($mes){
		 setlocale(LC_TIME, 'spanish');
		 $nombre = strftime("%B",mktime(0, 0, 0, $mes, 1, 2000));
		 return strtoupper($nombre);
	}// get_nombremes()

	public static function get_fecha_datetime($fecha){
		if($fecha == '0000-00-00 00:00:00' || strlen(trim($fecha))==0){
				return '';
		}

		$date = new DateTime($fecha);
		$date_format = $date->format('d-m-Y H:i:s');
		$porciones_p = explode(" ", $date_format);

		$anio_mes_dia = $porciones_p[0];
		$hora_minuto_segundo = $porciones_p[1];

		$porciones = explode("-", $anio_mes_dia);
		return $porciones[0]." ".self::get_nombremes($porciones[1])." ".$porciones[2]." ".$hora_minuto_segundo;
	}// get_nombremes()

	public static function get_fecha_datenumbers($fecha){
		if($fecha == '0000-00-00' || strlen(trim($fecha))==0){
				return '';
		}else{
			$fecha_aux = explode('-', $fecha);
			return $fecha_aux[2].'-'.$fecha_aux[1].'-'.$fecha_aux[0];
		}
	}// get_fecha_datenumbers()


	function get_datos_form($modulo,$nivel,$region,$municipio,$zona,$cct) {


$dato=array('modulo'=>$modulo,'datos'=>array('nivel'=>$nivel,'region'=>$region,'municipio'=>$municipio,'zona'=>$zona,'cct'=>$cct));


		return $dato;
	}

}// class


/* Movidas a config/contants.php MH 20190416
define('SUPERADMIN', '1');

define('IDSUPTIPOCENTRAL', '1');
define('IDSUPTIPOSUPERVISOR', '3');
define('IDSUPTIPOESCOLAR', '2');


define('MESSAGEREQUEST', 'message_request_yolixtli');
define('SUCCESMESSAGE', '1');
define('ERRORMESSAGE', '2');
define('DATOSUSUARIO', "datos_usuario_yolixtli");

define('ELEMENTOS_MENU', "elementos_menu_yolixtli");

define('LONG_MIN_CONTRASENA', "10");
define('LONG_MAX_CONTRASENA', "20");
define('LONG_FOLIO_PACE', '7');
define('LONG_MAX_NOMBRE', 50); //nombre del usuario tabla usuario.nombre
define('LONG_MAX_APELL1', 50);
define('LONG_MAX_APELL2', 50);
define('LONG_MAX_FUNCION', 50); //funcion del usuario tabla usuario.funcion
define('LONG_MAX_DEPTO', 90); //departamento del usuario tabla usuario.departamento
define('LONG_MAX_USERNAME', 25); //username del usuario tabla seguridad.username

define('PERSONAL_DOCENTE', 3); // DIRECTIVO table funcionxpersonal.idfuncion
define('PERSONAL_FNC_DOCENTE', 4); // DOCENTE table funcionxpersonal.idfuncion
define('PERSONAL_FNC_DOCENTE_TECN', 6); // DOCENTE TÉCNICO table funcionxpersonal.idfuncion

define('PERSONAL_FNC_DOCENTE_INGLES', 8); // DOCENTE INGLES table funcionxpersonal.idfuncion
define('PERSONAL_FNC_DOCENTE_ADMINISTRATIVO', 9); // ADMINISTRATIVO table funcionxpersonal.idfuncion
define('PERSONAL_FNC_DOCENTE_ENCARGADO', 10); // DOCENTE ENCARGADO table funcionxpersonal.idfuncion

define('NIVEL_PREE', 1);
define('NIVEL_PRIM', 2);
define('NIVEL_SEC', 3);

define('APP_ESCOLAR', 1);
define('APP_SUPERVISION', 2);
define('APP_CENTRAL', 3);

define('NUMERO_INTENTOS', 5);
define('TIEMPO_BLOQUEO', 5);

define('TIPO_ASIG_ADICIONALES', 'ADI');
define('TIPO_ASIG_ESTATAL', 'EST');
define('TIPO_ASIG_LENGUA', 'LEN');
define('VERSIONSISTEMA', "2.0");
define("ZONAHORARIA", "America/Mexico_City");

define("IDADMINCENTRAL", 1);
define("IDCENTRAL", 2);
define("IDREGIONALCENTRAL", 3);
// define('ADMINESCOLAR', '4');
// define('ESCOLARLIMITADO', '5');
// define('IDSUPERVISOR', '6');
define('ADMINESCOLAR', 4);
define('ESCOLARLIMITADO', 5);
define('IDSUPERVISOR', 6);

define("IDTIPOESCUELA", 1);
define("IDTIPOSUPERVISION", 2);

define('VERSIONYOLIXTLI', '19FEB.2300');

define("PAGINA_ACTUAL_GRID", "gridpaginador_yolixtli");

// Tipos para Asignaturas adicionales
define("TASIG_EXTRA_ESTAT", "EES");
define("TASIG_EXTRA_ESTFE", "EPR");
define("TASIG_EXTRA_ESCPA", "EPT");
define("TASIG_EXTRA_LENGU", "ELG");

define("CVE_ENTIDAD", 21);
*/
