<?php
$this->load->helper('form');
?>

<!-- FOOTER -->

<footer>
  <!-- FOOTER INFO LOGO SEC -->
  <div class="footerInfoArea full-width clearfix">
    <div class="container">
      <div class="row">
        <div class="col">
          <div class="footerTitle">
            <a href="<?= base_url() ?>"><img src="<?php echo base_url('assets/img/logoGEP.png'); ?>"></a>
          </div>
        </div>
        <!-- <div class="col-sm-4 col-xs-12">
                <div class="media">

                  <div class="media-body">

                            <h4 class="color-3">Mesa de ayuda <i class="fas fa-info-circle" aria-hidden="true"></i></h4>
                <ul class="list-group">
                   <li>Lunes a Viernes <span class="color-4"><i class="fas fa-calendar" aria-hidden="true"></i></span></li>
                  <li>8:00am - 3:00pm <span class="color-5"><i class="fas fa-clock-o" aria-hidden="true"></i></span></li>
                  <li>(662) 289 76 00  Ext.: 6000 <span class="color-1"><i class="fas fa-phone" aria-hidden="true"></i></span></li>
                </ul>
                  </div>
                </div>
        </div>   -->
      </div>
    </div>
  </div>
  <!-- COPY RIGHT -->
  <div class="copyRight clearfix">
    <div class="container">
      <div class="row">
        <div class="col-sm-5 col-sm-push-7 col-xs-12">
          <ul class="list-inline">
            <li><a href="https://www.facebook.com/sep.puebla/" target="_blank" class="bg-color-1"><i class="fab fa-facebook-f"></i></a></li>
            <li><a href="https://twitter.com/sep_puebla" target="_blank" class="bg-color-2"><i class="fab fa-twitter"></i></a></li>
          </ul>
        </div>
        <div class="col-sm-7 col-sm-pull-5 col-xs-12">
          <div class="copyRightText">
            <p>Versión <?= VERSIONYOLIXTLI ?> © 2017 Algunos derechos reservados. <?= date('d-m-Y H:i:s') ?></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</footer>
</div>

<div class="scrolling">
<a href="#pageTop" class="backToTop hidden-xs" id="backToTop"><i class="fas fa-arrow-up" aria-hidden="true"></i></a>
</div>


    <div class="modal " id="wait" data-backdrop="static" >
         <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate" style="font-size: 120px;"></span>
    </div>

    <div class="modal fade" id="ok"  style="color: #67b168" >
         <span class="glyphicon glyphicon-ok" style="font-size: 120px;"></span>
    </div>






    <div class="modal " id="wait" data-backdrop="static" >
         <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate" style="font-size: 120px;"></span>
    </div>

    <div class="modal fade" id="ok"  style="color: #67b168" >
         <span class="glyphicon glyphicon-ok" style="font-size: 120px;"></span>
    </div>


    <!-- Modal para mostrar el reporte ACA -->
    <div id="modal_reporteaca" class="modal fade" role="dialog">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header modalhead">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <span></span>
          </div>
          <div class="modal-body">
          </div>
        </div>
      </div>
    </div>


    <div id="div_generic"></div>


<!--DESIGN SOURCES-->

<script src="<?= base_url('assets/plugins/rs-plugin/js/jquery.themepunch.tools.min.js') ?>"></script>
<script src="<?= base_url('assets/plugins/rs-plugin/js/jquery.themepunch.revolution.min.js') ?>"></script>

<script src="<?= base_url('assets/plugins/selectbox/jquery.selectbox-0.1.3.min.js') ?>"></script>

<script src="<?= base_url('assets/plugins/owl-carousel/owl.carousel.js') ?>"></script>


<!-- este marca 403
<script src="https://cdnjs.cloudflare.com/ajax/libs/waypoints/2.0.3/waypoints.min.js');?>"></script>
-->
<script src="<?= base_url('assets/plugins/counter-up/jquery.counterup.min.js') ?>"></script>
<script src="<?= base_url('assets/plugins/isotope/isotope.min.js') ?>"></script>
<script src="<?= base_url('assets/plugins/isotope/jquery.fancybox.pack.js') ?>"></script>
<script src="<?= base_url('assets/plugins/isotope/isotope-triger.js') ?>"></script>
<script src="<?= base_url('assets/plugins/countdown/jquery.syotimer.js') ?>"></script>
<script src="<?= base_url('assets/plugins/velocity/velocity.min.js') ?>"></script>
<script src="<?= base_url('assets/plugins/smoothscroll/SmoothScroll.js') ?>"></script>
<script src="<?= base_url('assets/js/custom.js') ?>"></script>


<!--ORGINAL SOURCES-->
<script src="<?= base_url('assets/js/bootstrap-datetimepicker.js') ?>"></script>
<script  src="<?= base_url('assets/js/bootstrap-datetimepicker.es.js') ?>"></script>
<script  src="<?= base_url('assets/js/date_lenguaje.js') ?>"></script>
<script src="<?= base_url('assets/js/form_mensaje.js') ?>"></script>

<!--  JS CDN -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/4.4.0/bootbox.js"></script>

<!-- JS PROPIOS -->
<script src="<?= base_url('assets/js/formularios.js') ?>"></script>
<script src="<?= base_url('assets/js/utilerias/regularexpression.js') ?>"></script>
<script src="<?= base_url("assets/js/utilerias/constantes.js") ?>"></script>
<script src="<?= base_url("assets/js/utilerias/helpers.js") ?>"></script>

<script src="<?= base_url("assets/js/index/faqs.js") ?>"></script>

<script>
  function muestra_reporte_aca(pdf,id_bimestre){
          var bimestre = (id_bimestre==1 || id_bimestre==3)?"er":(id_bimestre==2)?"do":"to";
          var dom = '<iframe src="https://docs.google.com/viewer?url='+pdf+'&embedded=true" width="100%" height="500" style="border: none;"></iframe>';
          $('#modal_reporteaca .modal-header span').empty();
          $('#modal_reporteaca .modal-header span').html(id_bimestre+bimestre+". Bimestre");
          $('#modal_reporteaca .modal-body').empty();
          $('#modal_reporteaca .modal-body').html(dom);
          $('#modal_reporteaca').modal("show");
  }// muestra_reporte_aca()

  function muestra_faqs(){
    Faqs.mostrar();
  }// muestra_faqs()
  
</script>

</body>
</html>
