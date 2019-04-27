<!DOCTYPE html>
<html lang="es">
<head>

  <!-- SITE TITTLE -->
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title> CI_TCPDF - <?= (isset($titulo))?$titulo:'' ?></title>

  <!-- estos se ocupan aqui en el header para los modulos q se cargan antes del footer -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  <script src="https://code.jquery.com/ui/1.11.1/jquery-ui.js" integrity="sha256-/2tw2EWTMuKYJ22GFr6X5vPF1kkl5mb75npmfM4JUPU=" crossorigin="anonymous"></script>

  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

  <!-- PLUGINS CSS STYLE -->
  <link rel="stylesheet" href="https://code.jquery.com/ui/1.11.1/themes/smoothness/jquery-ui.css">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

  <!--<link rel="stylesheet" href="<?php echo base_url('assets/plugins/font-awesome/css/font-awesome.min.css'); ?>" rel="stylesheet">-->
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">

  <link rel="stylesheet" type="text/css" media="screen" href="<?= base_url('assets/plugins/rs-plugin/css/settings.css') ?>">

  <!-- <link rel="stylesheet" type="text/css" media="screen" href="<?= base_url('assets/plugins/selectbox/select_option1.css') ?>"> -->
  <link rel="stylesheet" type="text/css" href="https://raw.githubusercontent.com/staceymoore/jquery-selectbox/master/jquery.selectbox.css">

  <link rel="stylesheet" type="text/css" media="screen" href="<?= base_url('assets/plugins/owl-carousel/owl.carousel.css') ?>">
  <link rel="stylesheet" type="text/css" media="screen" href="<?= base_url('assets/plugins/isotope/jquery.fancybox.css') ?>">
  <link rel="stylesheet" type="text/css" media="screen" href="<?= base_url('assets/plugins/isotope/isotope.css') ?>">

  <!-- GOOGLE FONT -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Amaranth:400,700">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Merriweather+Sans:400,700">


  <link rel="stylesheet" type="text/css" media="screen" href="<?= base_url('assets/css/style.css') ?>">
  <link rel="stylesheet" type="text/css" media="screen" href="<?= base_url('assets/css/default.css') ?>" id="option_color">


  <!-- Icons -->
  <link rel="shortcut icon" href="<?= base_url('assets/img/favicon.png'); ?>">

  <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
  <![endif]-->

  <link rel="stylesheet" type="text/css" media="screen" href="<?= base_url('assets/css/smartgrid3/smartgrid.css') ?>">
  <link rel="stylesheet" type="text/css" media="screen" href="<?= base_url('assets/css/estilos_puebla.css') ?>">

  <script type="text/javascript">
    var base_url = live_url = "<?= base_url() ?>";
  </script>

  <style>
    .mdialTamanio{
      width: 23% !important;
    }
    .modal-header {
      background: #f9a825;
    }
  </style>

        <script src="<?= base_url('assets/js/utils.js') ?>"></script>
        <script src="<?= base_url('assets/js/personal.js') ?>"></script>
	<!-- VALIDA MOVIL -->
        <!--<script src="<?= base_url('assets/js/validamobil.js') ?>"></script>-->

</head>

<body class="body-wrapper" id="mainTop">


    <div class="modal " id="wait" data-backdrop="static" >
		<i class="fas fa-spinner glyphicon-refresh-animate" style="font-size: 80px;"></i>
         <!--<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate" style="font-size: 50px;"></span>-->
    </div>

    <div class="modal fade" id="ok"  style="color: #67b168" >
         <span class="glyphicon glyphicon-ok" style="font-size: 120px;"></span>
    </div>

    <div class="modal fade" id="error"  style="color:#c12e2a " >
         <span class="glyphicon glyphicon-remove" style="font-size: 120px;"></span>
    </div>

  <div class="main-wrapper">
    <!-- HEADER -->
    <header id="pageTop" class="header-wrapper">
      <!-- COLOR BAR -->
      <div class="container-fluid color-bar top-fixed clearfix">
        <div class="row">
          <div class="col-sm-1 col-xs-2 bg-color-1">fix bar</div>
          <div class="col-sm-1 col-xs-2 bg-color-2">fix bar</div>
          <div class="col-sm-1 col-xs-2 bg-color-3">fix bar</div>
          <div class="col-sm-1 col-xs-2 bg-color-1">fix bar</div>
          <div class="col-sm-1 col-xs-2 bg-color-2">fix bar</div>
          <div class="col-sm-1 col-xs-2 bg-color-3">fix bar</div>
          <div class="col-sm-1 bg-color-1 hidden-xs">fix bar</div>
          <div class="col-sm-1 bg-color-2 hidden-xs">fix bar</div>
          <div class="col-sm-1 bg-color-3 hidden-xs">fix bar</div>
          <div class="col-sm-1 bg-color-1 hidden-xs">fix bar</div>
          <div class="col-sm-1 bg-color-2 hidden-xs">fix bar</div>
          <div class="col-sm-1 bg-color-3 hidden-xs">fix bar</div>
        </div>
      </div>
      <!-- TOP INFO BAR -->
      <div class="top-info-bar bg-color-7">
        <div class="container">
          <div class="row">
            <div class="col-xs-6 col-sm-8 hidden-xs">
                <?php
                $nombre_usuario = '';
                if(isset($_SESSION[DATOSUSUARIO])){
                    $user= $_SESSION[DATOSUSUARIO];
                    // echo "<pre>"; print_r($user); die();
                    $nombre_usuario=$user->nombre.($user->apell1!=null ?" ".$user->apell1:" " ).($user->apell2!=null ?" ".$user->apell2:" " );
                    if($user->tipo_app == APP_ESCOLAR){//Bugtrack 00045: datos de encabezado: rori 23/07/2017
                       $infoct = isset($_SESSION['infoct']) ? $_SESSION['infoct'] : "";
                        $cct=$infoct->cct.' - '.$infoct->nombre;
                        echo '<ul class=" topList">';
                        echo '<li style="font-size:11px;"> <i class="fas fa-user bg-color-1" aria-hidden="true"></i> '.$cct.' - '.$user->username;
                        //echo $user->username." - ".$user->tipo->tipousuario;
                        echo '</li>';
                        echo '</ul>';
                    }
                    elseif ($user->tipo_app == APP_SUPERVISION) {
                      $por = explode("@",$user->username);
                      $por2 = explode(".",$por[1]);
                      // $por2 = explode($por[0],".")

                      echo '<ul class="list-inline topList">
                              <li><i class="fas fa-user bg-color-1" aria-hidden="true"></i>
                              ';
                      echo $por2[0]." - ".$nombre_usuario." - ".$user->username." - ".$user->tipo->tipousuario;
                      echo '</li></ul>';

                    }
                    else{
                        echo '<ul class="list-inline topList"> <li><i class="fas fa-user bg-color-1" aria-hidden="true"></i>';
                        echo $nombre_usuario." - ".$user->tipo->tipousuario;
                        echo '</li></ul>';
                    }
                }
                ?>


            </div>

            <div class="col-xs-6 col-sm-8 visible-xs">
                <?php
                $nombre_usuario = '';
                if(isset($_SESSION[DATOSUSUARIO])){
                    $user= $_SESSION[DATOSUSUARIO];
                    // echo "<pre>"; print_r($user); die();
                    $nombre_usuario=$user->nombre.($user->apell1!=null ?" ".$user->apell1:" " ).($user->apell2!=null ?" ".$user->apell2:" " );
                    if($user->tipo_app == APP_ESCOLAR){//Bugtrack 00045: datos de encabezado: rori 23/07/2017
                       $infoct = isset($_SESSION['infoct']) ? $_SESSION['infoct'] : "";
                        $cct=$infoct->cct.' - '.$infoct->nombre;
                        echo '<ul class=" topList">';
                        echo '<li style="font-size:11px;"> <i class="fas fa-user bg-color-1" aria-hidden="true"></i> '.$cct.' - '.$user->username;
                        //echo $user->username." - ".$user->tipo->tipousuario;
                        echo '</li>';
                        echo '</ul>';
                    }
                    elseif ($user->tipo_app == APP_SUPERVISION) {
                      $por = explode("@",$user->username);
                      $por2 = explode(".",$por[1]);
                      // $por2 = explode($por[0],".")

                   //   echo '<ul class="list-inline topList">
                   //           <li><i class="fas fa-user bg-color-1" aria-hidden="true"></i>
                   //           ';
                   //   echo $por2[0]." - ".$nombre_usuario." - ".$user->username." - ".$user->tipo->tipousuario;
                   //   echo '</li></ul>';




             echo           '<div class="btn-group">';
             echo           '    <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
             echo           '        <i class="fas fa-user-circle"></i>';
             echo           '    </button>';
             echo           '    <div class="dropdown-menu dropdown-menu-left">';
             echo           '        <div class="arrow-up"></div>';
             echo           '        <p>';
             echo                      $user->tipo->tipousuario;
             echo           '        <br>';
             echo                      $user->username;
             echo           '        <br>';
             echo                      $nombre_usuario;
             echo           '        <br>';
             echo                      $por2[0];
             echo           '        </p>';
			 echo           '        <hr/>';
             echo           '        <p>';
             echo           '        <h6>Versión: '. VERSIONYOLIXTLI .'<h6>';
             echo           '        </p>';
             echo           '    </div>';
             echo           '</div>';





                    }
                    else{
                        echo '<ul class="list-inline topList"> <li><i class="fas fa-user bg-color-1" aria-hidden="true"></i>';
                        echo $nombre_usuario." - ".$user->tipo->tipousuario;
                        echo '</li></ul>';
                    }
                }
                ?>


            </div>
            <div class="col-xs-6 col-sm-4 right-options">
              <ul class="list-inline functionList">
                        <?php
                        // $menu = isset($_SESSION['elementos_menu']) ? $_SESSION['elementos_menu'] : NULL; // 20190307 MH
                        // if ($menu != NULL) { // 20190307 MH
                        if ($this->session->has_userdata(ELEMENTOS_MENU)) { // 20190307 MH
//                           echo '<li><a href="#" class="badge-link">Alertas <span class="badge">12</span></a></li>';
//                           echo '<li class="HelpList">' .
//                                   '<select name="guiest_id1" id="guiest_id1" class="select-drop">' .
//                                        '<option>Ayuda</option>' .
//                                        '<option>Manual</option>' .
//                                        '<option>Soporte</option>' .
//                                     '</select>' .
//                                 '</li>' ;
                           echo '<li><i class="fas fa-sign-out-alt bg-color-5" aria-hidden="true"></i> <a href="' . base_url('index.php/cerrar-sesion') . '" >Salir</a></li>' ;
                        }else{
                           echo '<li></li>' ;
                        } ?>
                  <li><i class="fas fa-question bg-color-1" aria-hidden="true"></i><a href='#' onclick="muestra_faqs();">Ayuda&nbsp;&nbsp;</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- NAVBAR -->
      <nav id="menuBar" class="navbar navbar-default lightHeader" role="navigation">
        <div class="container">
          <!-- Brand and toggle get grouped for better mobile display -->
          <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
         <a class="navbar-brand" href="<?= base_url() ?>"><img src="<?php echo base_url('assets/img/logo-main.png'); ?>" alt="Yolixtli"></a>
          </div>
          <!-- NAV OPTIONS -->
            <?php
            $menu = isset($_SESSION[ELEMENTOS_MENU]) ? $_SESSION[ELEMENTOS_MENU] : NULL; // 20190307 MH
            if (isset($menu) != NULL) {
                $this->utilswrapper->carga_menu($menu);
            }else{ ?>
               <div class="collapse navbar-collapse navbar-ex1-collapse">
                    <ul class="nav navbar-nav navbar-right">
                    <li class="color-1 ">
                      <a href="#mainTop" role="button">
                        <i class="fas fa-home bg-color-1" aria-hidden="true"></i>
                        <span>Inicio</span>
                      </a>
                    </li>
                    <li class="color-5 ">
                      <a href="#mainPadres" role="button">
                        <i class="fas fa-user bg-color-5" aria-hidden="true"></i>
                        <span>Padres</span>
                      </a>
                    </li>
                    <li class="color-2 ">
                      <a href="#mainVideo" role="button">
						  <i class="fas fa-video bg-color-2" aria-hidden="true"></i>
                        <span>Video</span>
                      </a>
                    </li>
                    <li class="color-3 ">
                      <a href="#mainAbout" role="button">
                        <i class="fas fa-star bg-color-3" aria-hidden="true"></i>
                        <span>Acerca</span>
                      </a>
                    </li>
                  </ul>
                </div><!-- .collapse -->
            <?php } ?>
          <!-- END NAV OPTIONS -->
        </div>
      </nav>
    </header>


<!-- Modal -->
<div class="modal fade" id="modal_aviso_movil" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
      </div>
      <div class="modal-body">
      </div>
    </div>
  </div>
</div><!-- .modal_aviso_movil -->
