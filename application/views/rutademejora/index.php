							<section class="mainContent full-width clearfix" id="sectionCapturadatos" name="sectionCapturadatos">
								<div class="container">

							<div class="row">
								<div class="col-xs-3">
								</div>
								<div class="col-xs-2">
									<a href="<?= base_url('Reportes_tcpdf/carta_responsiva/4238') ?>" target="_blank" class="btn btn-primary">Carta responsiva 4238</a>
								</div>
								<div class="col-xs-3">
									<button id="btn_get_reporte_constancia" type="button" data-toggle="tooltip" title="Imprimir" class="btn btn-primary">CONSTANCIA 1</button>
								</div>
								<div class="col-xs-3">
									<button id="btn_get_lista_asist" type="button" data-toggle="tooltip" title="Asistencia" class="btn btn-primary">Lista Asistencia</button>
								</div>
								<div class="col-xs-1">
									<button id="btn_get_reporte" type="button" data-toggle="tooltip" title="Imprimir" class="btn btn-primary"><span class="glyphicon glyphicon-print"></span></button>
								</div>
							</div><!-- row -->

							<div class="row">
								<div class="col-xs-12 margintop_5">
									<div id="grid_rutamejora">
										<?= $grid ?>
									</div>
									<label class="" style="">*Puede modificar el orden de los temas prioritarios arrastrando el registro a la posición deseada.</label>
								</div>

								<input type="hidden" id="idcentrocfg" value="<?= $idcentrocfg ?>">
							</input>
							</div><!-- row -->
              </div>
            </div>
          </div><!-- faq-usuario -->



				</div>
			</div>

		</div>
	</div><!-- panel -->
</div><!-- container-->
</section>


<style>
#grid_rutamejora .table-responsive{
	margin-top:0px !important;
	padding-top:0px !important;
	margin-bottom:0px !important;
	padding-bottom:0px !important;
}
</style>



<script type="text/javascript" src="<?= base_url("assets/js/utilerias/grid.js") ?>"></script>
<script type="text/javascript" src="<?= base_url("assets/js/escolar/rutademejora/rutamejora.js") ?>"></script>
