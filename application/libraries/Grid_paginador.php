<?php

class Grid_paginador {
    private $arr_columnas = "";
    private $arr_datos = "";
    private $str_html = "";
    private $theme = "";
    private $idvalue = "";
    private $idpaginador;

    function __construct() {
    }

    public function set_configs($arr_columns,$arr_datos,$idvalue,$theme){
      $this->arr_columns = $arr_columns;
      $this->arr_datos = $arr_datos;
      $this->idvalue = $idvalue;
      $this->theme = $theme;
      $this->is_paginador = FALSE;
    }// set_configs()

    public function set_configs_paginador($arr_columns,$idvalue,$theme,$total_datos, $valores_xpagina, $funcion = ""){
      $this->arr_columns = $arr_columns;
      $this->idvalue = $idvalue;
      $this->theme = $theme;
      $this->is_paginador = TRUE;

      $this->total_datos = $total_datos;
      $this->limit_values_paginador = $valores_xpagina;
      $this->funcion = $funcion;
    }// set_configs_paginador()

    public function set_data($arr_datos=array()){
      $this->arr_datos = $arr_datos;
      // echo "set_data()";
      // echo "<pre>"; print_r($this->arr_datos); die();
    }// set_data()

    public function get_table() {
      $this->get_header();
      $this->get_body();
      if($this->is_paginador  && $this->total_datos>$this->limit_values_paginador ){
        $this->get_paginador();
      }
      return $this->str_html;
    }// get_table()


    public function get_header(){
      $this->str_html .= "<div class='table-responsive'>";
      $this->str_html .= "<table id='' class='table table-condensed table-hover  table-bordered'>";

      $this->str_html .= "<thead class={$this->theme}>";
      $this->str_html .= "<tr>";

      foreach ($this->arr_columns as $item => $c) {
          $tipo = $c["type"];
          $label = $c["header"];
          $width = (isset($c["width"]))?$c["width"]:"auto";
          switch ($tipo) {
            case 'hidden':
              $this->str_html .= "<th id='".$item."' hidden>";
              $this->str_html .= "<center>".$label."</center>";
              $this->str_html .= "</th>";
            break;
            case 'text':
              $this->str_html .= "<th id='".$item."' style='width:{$width}'>";
              $this->str_html .= "<center>".$label."</center>";
              $this->str_html .= "</th>";
            break;
            case 'text_popover':
              $this->str_html .= "<th id='".$item."' style='width:{$width}'>";
              $this->str_html .= "<center>".$label."</center>";
              $this->str_html .= "</th>";
            break;
            case 'button':
              $this->str_html .= "<th id='".$item."' style='width:{$width}'>";
              $this->str_html .= "<center>".$label."</center>";
              $this->str_html .= "</th>";
            break;
            case 'boton':
              $this->str_html .= "<th id='".$item."' style='width:{$width}'>";
              $this->str_html .= "<center>".$label."</center>";
              $this->str_html .= "</th>";
            break;
            case 'icono':
              $this->str_html .= "<th id='".$item."' style='width:{$width}'>";
              $this->str_html .= "<center>".$label."</center>";
              $this->str_html .= "</th>";
            break;
            case 'itxt':
              $this->str_html .= "<th id='".$item."' style='width:{$width}'>";
              $this->str_html .= "<center>".$label."</center>";
              $this->str_html .= "</th>";
            break;
            case 'textcolor':
              $this->str_html .= "<th id='".$item."' style='width:{$width}'>";
              $this->str_html .= "<center>".$label."</center>";
              $this->str_html .= "</th>";
            break;
            case 'check':
              $this->str_html .= "<th id='".$item."' style='width:{$width}'>";
              $this->str_html .= "<center>".$label."</center>";
              $this->str_html .= "</th>";
            break;
            case 'checkl':
              $this->str_html .= "<th id='".$item."' style='width:{$width}'>";
              $this->str_html .= "<center>".$label."</center>";
              $this->str_html .= "</th>";
            break;
            case 'check_especial':
              $this->str_html .= "<th id='".$item."' style='width:{$width}'>";
              $this->str_html .= "<center>".$label."</center>";
              $this->str_html .= "</th>";
            break;
            case 'checkbox':
              $this->str_html .= "<th id='".$item."' style='width:{$width}'>";
              $this->str_html .= "<center>".$label."</center>";
              $this->str_html .= "</th>";
            break;
            case 'inputtext':
              $this->str_html .= "<th id='".$item."' style='width:{$width}'>";
              $this->str_html .= "<center>".$label."</center>";
              $this->str_html .= "</th>";
            break;
            case 'url':
              $this->str_html .= "<th id='".$item."' style='width:{$width}'>";
              $this->str_html .= "<center>".$label."</center>";
              $this->str_html .= "</th>";
            break;
            case 'btn_group':
              $this->str_html .= "<th id='".$item."' style='width:{$width}'>";
              $this->str_html .= "<center>".$label."</center>";
              $this->str_html .= "</th>";
            break;
          }
      }

      $this->str_html .= "</tr>";
      $this->str_html .= "</thead>";
    }// get_header()

    public function get_body(){
      // echo "get_body()";
      // echo "<pre>"; print_r($this->arr_datos); die();

      $this->str_html .= "<tbody>";
      // if(count($this->arr_datos) > 0 && $this->arr_datos[0][$this->idvalue]!=""){
      if(count($this->arr_datos) > 0){
        // echo "if"; die();
        for ($i = 0; $i<count($this->arr_datos); $i++) {
            $this->str_html .= "<tr>";
            $cont_columnas = 0;
            // "<pre>"; print_r($this->arr_datos);die();
            foreach ($this->arr_columns as $item => $c) {
              $tipo = $c["type"];
              $label = $c["header"];
              switch ($tipo) {
                case 'hidden':
                  $this->str_html .= "<td id='".$item."' data='".$this->arr_datos[$i][$item]."' hidden>";
                  $this->str_html .= $this->arr_datos[$i][$item];
                  $this->str_html .= "</td>";
                break;
                case 'text':
                  $this->str_html .= "<td id='".$item."' data='".$this->arr_datos[$i][$item]."' >";
                  $this->str_html .= $this->arr_datos[$i][$item];
                  $this->str_html .= "</td>";
                break;
                case 'text_popover':
                // data-toggle="popover" title="Popover Header" data-content="Some content inside the popover"
                  // $popover_title = "Titulo";
                  $popover_title = (isset($c['popover']['title']))?$c['popover']['title']:"";
                  $campo_content = (isset($c['popover']['content']))?$c['popover']['content']:"";
                  $popover_content = $this->arr_datos[$i][$campo_content];

                  $this->str_html .= "<td id='".$item."' data='".$this->arr_datos[$i][$item]."' data-toggle='popover' title='".$popover_title."' data-content='".$popover_content."' >";

                  $this->str_html .= $this->arr_datos[$i][$item];
                  $this->str_html .= "</td>";
                break;
                case 'button':
                // El parámetro de la función será el valor del nombre del campo según la consulta
                  $this->str_html .= "<td id='".$item."'>";
                  $visible = (isset($c['config']['visible']))?TRUE:FALSE;
                  $visible = (isset($this->arr_datos[$i][$item]) && $this->arr_datos[$i][$item] != 0 || $this->arr_datos[$i][$item] != '')?TRUE:FALSE;
                  $idvalor = $this->arr_datos[$i][$item];
                  if($visible){
                    $this->str_html .= "<center><button class='btn btn-suceess' onclick=".$c['config']["funcion"]."(".$idvalor.")>".$c["config"]['texto']."</button></center>";
                  }
                  $this->str_html .= "</td>";
                break;
                case 'boton':
                // El parámetro de la función será el valor del nombre del campo según la consulta
                  $this->str_html .= "<td id='".$item."'>";
                  $visible = (isset($c['config']['visible']))?TRUE:FALSE;
                  $visible = (isset($this->arr_datos[$i][$item]) && $this->arr_datos[$i][$item] != 0 || $this->arr_datos[$i][$item] != '')?TRUE:FALSE;
                  $idvalor = $this->arr_datos[$i][$item];
                  if($visible){
                    $this->str_html .= "<center><button class='btn btn-suceess' onclick=".$c['config']["funcion"]."('".$idvalor."')>".$c["config"]['texto']."</button></center>";
                  }
                  $this->str_html .= "</td>";
                break;
                case 'inputtext':
                // El parámetro de la función será el valor del nombre del campo según la consulta
                  $this->str_html .= "<td id='".$item."'>";
                  $visible = (isset($c['config']['visible']))?TRUE:FALSE;
                  $visible = (isset($this->arr_datos[$i][$item]) && $this->arr_datos[$i][$item] != 0 || $this->arr_datos[$i][$item] != '')?TRUE:FALSE;
                  $idvalor = $this->arr_datos[$i][$item];
                  $idelemento = $this->arr_datos[$i][$c['config']['id']];
                  $funcion = isset($c['config']["funcion"])? "onkeyup=".$c['config']["funcion"]."('".$idelemento.$c['config']['nelemento']."')": "";
                  if($visible){
                    $this->str_html .= "<center><input type='text' class='form-control' id='".$idelemento.$c['config']['nelemento']."' placeholder='' value='".$idvalor."' $funcion ></center>";
                  }
                  $this->str_html .= "</td>";
                break;
                case 'check':
                  $checked = "";
                  if($this->arr_datos[$i][$item] == 1){
                    $checked = "checked";
                  }
                  $this->str_html .= "<td id='".$item."'>";
                  $this->str_html .= "<center><input type='checkbox' onclick='".$c['config']["funcion"]."(".$this->arr_datos[$i][$this->idvalue].", ".$this->arr_datos[$i][$item].",  {$cont_columnas} )'" .$checked."></center>";
                  $this->str_html .= "</td>";
                break;
                case 'checkl':
                  $checked = "";
                  if($this->arr_datos[$i][$item] == 1){
                    $checked = "checked";
                  }
                  $this->str_html .= "<td id='".$item."'>";
                  $this->str_html .= "<center><input type='checkbox' onclick=".$c['config']["funcion"]."('".$this->arr_datos[$i][$this->idvalue]."',this) " .$checked."></center>";
                  $this->str_html .= "</td>";
                break;
                case 'check_especial': // Es capaz de determinar si check es enable/disable

                  $dato_contenido = $this->arr_datos[$i][$item];
                  $array_partes = explode("-", $dato_contenido);

                  $valor_principal = $array_partes[0];
                  $valor_aux = $array_partes[1];

                  $checked = "";
                  $estado = "";

                  if($valor_principal == 1){
                    $checked = "checked";
                  }
                  if($valor_aux == 0){
                    $estado = "disabled";
                  }

                  $this->str_html .= "<td id='".$item."'>";
                  $this->str_html .= "<input type='checkbox' onclick='".$c['config']["funcion"]."(".$this->arr_datos[$i][$this->idvalue].", ".$valor_principal.",  {$cont_columnas} )'" .$checked." ".$estado.">";
                  $this->str_html .= "</td>";
                break;
                case 'checkbox':
                  $enabled_disabled = (isset($this->arr_datos[$i][$item]) && $this->arr_datos[$i][$item] > 0 )?TRUE:FALSE;
                  $this->str_html .= "<td id='".$item."'>";
                  if($enabled_disabled){
                    $this->str_html .= "<center><input type='checkbox'" .$enabled_disabled."></center>";
                  }
                  // echo $enabled_disabled; die();
                  $this->str_html .= "</td>";
                break;

                case 'icono':
                  $this->str_html .= "<td id=''>";
                  $this->str_html .= "<center>".$this->arr_datos[$i][$item]."</center>";
                  $this->str_html .= "</td>";
                break;
                case 'itxt':
                // echo "<pre>"; print_r($c); die();
                  $valor = (string)$this->arr_datos[$i][$this->idvalue]."_".(string)$this->arr_datos[$i][$item];
                  // $valor = (string)$valor;
                  // echo $valor; die();

                  $this->str_html .= "<td id=''>";
                  // $this->str_html .= "<input type='text' class='form-control' value='".$this->arr_datos[$i][$item]."'>";
                  // $this->str_html .= "<textarea type='text' class='form-control' rows='2' onBlur='editarEnGrid({$this->arr_datos[$i][$this->idvalue]}-{$this->arr_datos[$i][$item]})'>".$this->arr_datos[$i][$item]."</textarea>";
                  /*
                  $this->str_html .= "<textarea type='text' class='form-control' rows='2'
                                      onBlur=" . $c["funcion"] . "('" . $this->arr_datos[$i][$this->idvalue]."-".$this->arr_datos[$i][$item]."')>".$this->arr_datos[$i][$item]."</textarea>";
                  $this->str_html .= "</td>";
                  */
                  // $this->str_html .= "<textarea type='text' class='form-control' rows='2'
                  //                     onkeypress =" . $c["funcion"]."(this)>".$this->arr_datos[$i][$item]."</textarea>";
                  // $this->str_html .= "</td>";
                  $this->str_html .= "<textarea id='id_td_{$cont_columnas}_{$item}_{$i}' class='form-control' rows='2'
                                      onkeypress='".$c['funcion']."(this, this.id,{$this->arr_datos[$i][$this->idvalue]})'>".$this->arr_datos[$i][$item]."</textarea>";
                  $this->str_html .= "</td>";
                break;
                case 'textcolor':

                if ($this->arr_datos[$i][$item]>0) {
                  if ($this->arr_datos[$i]['requisito']=='Alumnos con requisitos pendientes') {
                    $this->str_html .= "<td id='".$item."' data='".$this->arr_datos[$i][$item]."' style='color:blue'>";
                    $this->str_html .= "<center>".$this->arr_datos[$i][$item]."</center>";
                    $this->str_html .= "</td>";
                  }
                  else {
                    $this->str_html .= "<td id='".$item."' data='".$this->arr_datos[$i][$item]."' style='color:red'>";
                    $this->str_html .= "<center>".$this->arr_datos[$i][$item]."</center>";
                    $this->str_html .= "</td>";
                  }

                }
                else {
                  $this->str_html .= "<td id='".$item."' data='".$this->arr_datos[$i][$item]."'>";
                  $this->str_html .= "<center>".$this->arr_datos[$i][$item]."</center>";
                  $this->str_html .= "</td>";
                }
                break;
                case 'url':
                  $this->str_html .= "<td id='".$item."'>";
                  $idvalor = $this->arr_datos[$i][$item];
                  if( strlen(trim($idvalor)) > 0 ){
                    $this->str_html .= "<center><a href=".$idvalor." target='_blank' class='btn btn_color_primary'> <i class='fa fa-link' aria-hidden='true'></i></a></center>";
                  }
                  $this->str_html .= "</td>";
                break;
                case 'btn_group':
                /*
                <div class="btn-group open">
                                              <button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'><span class='glyphicon glyphicon-tasks'></span><span class='caret'></span></button>
                                              <ul class='dropdown-menu'>
                      </ul>
                                            </div>
                */
                // El parámetro de la función será el valor del nombre del campo según la consulta
                // echo "<pre>"; print_r($this->arr_datos[$i][$item]); die();
                // echo "<pre>"; print_r($c); die();
                  $this->str_html .= "<td id='".$item."'>";
                  $this->str_html .= "
                  <div class='btn-group'>
                  <button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'><span class='glyphicon glyphicon-tasks'></span><span class='caret'></span></button>
                  <ul class='dropdown-menu'>
                  ";
                  $array_configs = $c['config'];
                  // echo "<pre>"; print_r($array_configs); die();

                  $idvalor = $this->arr_datos[$i][$item];
                  foreach ($array_configs as $key => $li) {
                    // echo "<pre>"; print_r($li); die();
                    $this->str_html .= "
                    <li><a onclick=".$li['funcion']."('".$idvalor."')>".$li['texto']."</a></li>";
                  }
                  $this->str_html .= "
                  </ul></div>
                  ";

                  // echo $this->str_html; die();
                  $this->str_html .= "</td>";
                break;
              }
              $cont_columnas++;
            }// end for columns
          $this->str_html .= "</tr>";
        }
      }
      else{
        // echo "else"; die();
        $this->str_html .= "<tr>";
        $this->str_html .= "<td colspan='".count($this->arr_columns)."'>No hay datos para mostrar</td>";
        $this->str_html .= "</tr>";
      }

      $this->str_html .= "</tbody>";

      $this->str_html .= "</table>";
      $this->str_html .= "</div>";
    }// get_body()



        //creamos los enlaces de nuestra paginación
         public function get_paginador(){
            $function = ($this->funcion == "")?'get_gridpaginador':$this->funcion;
             $str_paginador = "";
             // echo "total ". $this->total_datos; die();
             //página actual
             $actual_pag = $_SESSION[PAGINA_ACTUAL_GRID];
             //limite por página
             $limit = $this->limit_values_paginador;
             //total de enlaces que existen
             $totalPag = floor($this->total_datos/$limit);
             //links delante y detrás que queremos mostrar
             $pagVisibles = 2;

             if($actual_pag <= $pagVisibles){
                 $primera_pag = 1;
             }else{
                 $primera_pag = $actual_pag - $pagVisibles;
             }

             if($actual_pag + $pagVisibles <= $totalPag){
                 $ultima_pag = $actual_pag + $pagVisibles;
             }else{
                 $ultima_pag = $totalPag;
             }

             /*
             $str_paginador .= "<nav><ul class='pager' style='margin-top:3px !important; '>";
             $str_paginador .= ($actual_pag > 1) ?
                                                "<li class='page-item'> <a href='javascript:void(0)' class='' onclick='get_gridpaginador(0,".$limit.")'>Primera</li></a>"
                                                :
                                                "<li class='page-item disabled'>   <a href='javascript:void(0)' class=''>Primera</li></a>";
             $str_paginador .= ($actual_pag > 1) ?
                                                "<li class='page-item'>   <a href='javascript:void(0)' class='' onclick='get_gridpaginador(".(($actual_pag-2)*$limit).")'><span aria-hidden='true'>&laquo;</span> </li></a>"
                                                :
                                                "<li class='page-item disabled'>   <a href='javascript:void(0)' class='><span aria-hidden='true'>&laquo;</span></li></a>";

             for($i=$primera_pag; $i<=$ultima_pag+1; $i++){
                 $z = $i;
                 $str_paginador .= ($i == $actual_pag) ?
                                                "<li class='page-item disabled'>  <a class='' href='javascript:void(0)'>".$i."</li></a>"
                                                :
                                                "<li class='page-item'>   <a class='' href='javascript:void(0)' onclick='get_gridpaginador(".(($z-1)*$limit).")'>".$i."</li></a>";
             }

             $str_paginador .= ($actual_pag < $totalPag) ?
                                                "<li class='page-item'>  <a href='javascript:void(0)' class='' onclick='get_gridpaginador(".(($actual_pag)*$limit).")'> <span aria-hidden='true'>&raquo;</span></li></a>"
                                                  :
                                                  "<li class='page-item disabled'>  <a href='javascript:void(0)' class=''><span aria-hidden='true'>&raquo;</span></li></a>";

             $str_paginador .= ($actual_pag < $totalPag) ?
                                                "<li class='page-item'>   <a href='javascript:void(0)' class='' onclick='get_gridpaginador(".(($totalPag)*$limit).")'>Última</li></a>"
                                                :
                                                "<li class='page-item disabled'>  <a href='javascript:void(0)' class=''>Última</li></a>";

             $str_paginador .= "</ul></nav>";
             */
             $str_paginador .= "<nav><ul class='pager' style='margin-top:3px !important; '>";
             $str_paginador .= ($actual_pag > 1) ?
                                                "<li class='page-item'> <a href='javascript:void(0)'  onclick={$function}(0,".$limit.")>Primera</li></a>"
                                                :
                                                "<li class='page-item disabled'>   <a href='javascript:void(0)'>Primera</li></a>";
             $str_paginador .= ($actual_pag > 1) ?
                                                "<li class='page-item'>   <a href='javascript:void(0)' onclick={$function}(".(($actual_pag-2)*$limit).")><span aria-hidden='true'>&laquo;</span> </li></a>"
                                                :
                                                "<li class='page-item disabled'><a href='javascript:void(0)'><span aria-hidden='true'>&laquo;</span></li></a>";

             for($i=$primera_pag; $i<=$ultima_pag+1; $i++){
                 $z = $i;
                 $str_paginador .= ($i == $actual_pag) ?
                                                "<li class='page-item disabled'>  <a  href='javascript:void(0)'>".$i."</li></a>"
                                                :
                                                "<li class='page-item'><a href='javascript:void(0)' onclick={$function}(".(($z-1)*$limit).")>".$i."</li></a>";
             }

             $str_paginador .= ($actual_pag < $totalPag) ?
                                                "<li class='page-item'><a href='javascript:void(0)' onclick={$function}(".(($actual_pag)*$limit).")> <span aria-hidden='true'>&raquo;</span></li></a>"
                                                  :
                                                  "<li class='page-item disabled'><a href='javascript:void(0)'><span aria-hidden='true'>&raquo;</span></li></a>";

             $str_paginador .= ($actual_pag < $totalPag) ?
                                                "<li class='page-item'><a href='javascript:void(0)' onclick={$function}(".(($totalPag)*$limit).")>Última</li></a>"
                                                :
                                                "<li class='page-item disabled'>  <a href='javascript:void(0)'>Última</li></a>";

             $str_paginador .= "</ul></nav>";


             $this->str_html .= $str_paginador;
             $str_paginador= NULL;
         }// get_paginador()

         public function get_offset($post, $valores_xpagina){
             $offset = !isset($post["offset"]) || $post["offset"] == "undefined" ? 0 : $post["offset"];
             if($offset == 0){
                 $_SESSION[PAGINA_ACTUAL_GRID] = 1;
             }else{
                 $_SESSION[PAGINA_ACTUAL_GRID] = ($offset+$valores_xpagina)/$valores_xpagina;
             }
             return $offset;
         }// get_offset()

         public static function get_paginador_only($funcion, $valores_xpagina, $total_datos){
             $function = $funcion;
             $str_paginador = "";
             //página actual
             $actual_pag = $_SESSION[PAGINA_ACTUAL_GRID];
             //limite por página
             $limit = $valores_xpagina;
             //total de enlaces que existen
             $totalPag = floor($total_datos/$limit);
             //links delante y detrás que queremos mostrar
             $pagVisibles = 2;

             if($actual_pag <= $pagVisibles){
                 $primera_pag = 1;
             }else{
                 $primera_pag = $actual_pag - $pagVisibles;
             }

             if($actual_pag + $pagVisibles <= $totalPag){
                 $ultima_pag = $actual_pag + $pagVisibles;
             }else{
                 $ultima_pag = $totalPag;
             }


             $str_paginador .= "<nav><ul class='pager' style='margin-top:3px !important; '>";
             $str_paginador .= ($actual_pag > 1) ?
                                                "<li class='page-item'> <a href='javascript:void(0)'  onclick={$function}(0,".$limit.")>Primera</li></a>"
                                                :
                                                "<li class='page-item disabled'>   <a href='javascript:void(0)'>Primera</li></a>";
             $str_paginador .= ($actual_pag > 1) ?
                                                "<li class='page-item'>   <a href='javascript:void(0)' onclick={$function}(".(($actual_pag-2)*$limit).")><span aria-hidden='true'>&laquo;</span> </li></a>"
                                                :
                                                "<li class='page-item disabled'><a href='javascript:void(0)'><span aria-hidden='true'>&laquo;</span></li></a>";

             for($i=$primera_pag; $i<=$ultima_pag+1; $i++){
                 $z = $i;
                 $str_paginador .= ($i == $actual_pag) ?
                                                "<li class='page-item disabled'>  <a  href='javascript:void(0)'>".$i."</li></a>"
                                                :
                                                "<li class='page-item'><a href='javascript:void(0)' onclick={$function}(".(($z-1)*$limit).")>".$i."</li></a>";
             }

             $str_paginador .= ($actual_pag < $totalPag) ?
                                                "<li class='page-item'><a href='javascript:void(0)' onclick={$function}(".(($actual_pag)*$limit).")> <span aria-hidden='true'>&raquo;</span></li></a>"
                                                  :
                                                  "<li class='page-item disabled'><a href='javascript:void(0)'><span aria-hidden='true'>&raquo;</span></li></a>";

             $str_paginador .= ($actual_pag < $totalPag) ?
                                                "<li class='page-item'><a href='javascript:void(0)' onclick={$function}(".(($totalPag)*$limit).")>Última</li></a>"
                                                :
                                                "<li class='page-item disabled'>  <a href='javascript:void(0)'>Última</li></a>";

             $str_paginador .= "</ul></nav>";

             return $str_paginador;
        }// get_paginador_only()

}// class
