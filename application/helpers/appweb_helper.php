<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

    if(!function_exists('limpia_sesion')){ //Nos aseguramos de que no haya conflictos con otras funciones
        function limpia_sesion($contexto){
          $contexto->session->unset_userdata(array(ELEMENTOS_MENU, 'nombre_usuario', 'tipousuario', 'nombre_usuario_f', DATOSUSUARIO));
        }// limpia_sesion()
    }

    if(!function_exists('envia_datos_json')){
        function envia_datos_json($status, $data, $contexto) {
          return $contexto->output
                  ->set_status_header($status)
                  ->set_content_type('application/json', 'utf-8')
                  ->set_output(json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        }// envia_datos_json()
    }

    if(!function_exists('cerrar_sesion')){
        function cerrar_sesion($contexto) {
          $contexto->session->unset_userdata(array(ELEMENTOS_MENU, 'nombre_usuario', 'tipousuario', 'nombre_usuario_f', DATOSUSUARIO));
          $contexto->session->sess_destroy();
          redirect('/');
        }// cerrar_sesion()
    }

    if(!function_exists('hay_sesion_abierta')){
        function hay_sesion_abierta($contexto) {
      		return $contexto->session->has_userdata(DATOSUSUARIO);
      	}// hay_sesion_abierta()
    }

    if(!function_exists('verifica_sesion_redirige_ajax')){
        function verifica_sesion_redirige_ajax($contexto) {
      		$flag = TRUE;
      		if (!hay_sesion_abierta($contexto)) {
            $response = array('respuesta' => 'REDIRECT');
            envia_datos_json(200, $response, $this);
      			$flag = FALSE;
      		}
      		return $flag;
      	}// verifica_sesion_redirige_ajax()
    }

    if(!function_exists('get_nombre_mes')){
        function get_nombre_mes($date) { // '2019-01-01'
          setlocale(LC_TIME, 'spanish');

          $array_fecha = explode('-', $date);
          $mes = $array_fecha[1];
     		  $nombre = strftime("%B",mktime(0, 0, 0, $mes, 1, 2000));
     		  return trim($nombre);
      	}// get_nombre_mes()
    }

?>
