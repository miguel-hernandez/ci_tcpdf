/* jshint esversion: 6 */

let Preinscripciones_uniformes = {

	uniformes : [
		{bloque :1 ,nivel:1 ,genero:'H',concepto:'Camisa',tallas: ["T-4","T-6","T-8","T-10","T-12"] },
		{bloque :2 ,nivel:1 ,genero:'H',concepto:'Pantalón',tallas: ["T-4","T-6","T-8"] },
		{bloque :3 ,nivel:1 ,genero:'H',concepto:'Calzado',tallas: ["T-15","T-16","T-17","T-18","T-19","T-20","T-21"] },

		{bloque :1 ,nivel:1 ,genero:'M',concepto:'Blusa',tallas: ["T-4","T-6","T-8","T-10","T-12","T-14","T-16"] },
		{bloque :2 ,nivel:1 ,genero:'M',concepto:'Jumper',tallas: ["T-4","T-6","T-8"] },
		{bloque :3 ,nivel:1 ,genero:'M',concepto:'Calzado',tallas: ["T-15","T-16","T-17","T-18","T-19","T-20","T-21"] },
		{bloque :4 ,nivel:1 ,genero:'M',concepto:'Calceta',tallas: ["6-8","9-12"] },

		{bloque :1 ,nivel:2 ,genero:'H',concepto:'Camisa',tallas: ["T-6","T-8","T-10","T-12","T-14","T-16","T-18","T-20","T-XCH","T-CH","T-M","T-G","T-XG"] },
		{bloque :2 ,nivel:2 ,genero:'H',concepto:'Pantalón',tallas: ["T-6","T-8","T-10","T-12","T-14","T-16","T-18","T-20","T-XCH","T-CH","T-M","T-G","T-XG"]},
		{bloque :3 ,nivel:2 ,genero:'H',concepto:'Calzado',tallas: ["T-17","T-18","T-19","T-20","T-21","T-22","T-23","T-24","T-25","T-26","T-27","T-28"] },

		{bloque :1 ,nivel:2 ,genero:'M',concepto:'Blusa',tallas: ["T-4","T-6","T-8","T-10","T-12","T-14","T-16","T-18","T-20","T-XCH","T-CH","T-M","T-G","T-XG"] },
		{bloque :2 ,nivel:2 ,genero:'M',concepto:'Jumper',tallas: ["T-6","T-8","T-10","T-12","T-14","T-16","T-18","T-20","T-XCH","T-CH","T-M","T-G","T-XG"] },
		{bloque :3 ,nivel:2 ,genero:'M',concepto:'Calzado',tallas: ["T-17","T-18","T-19","T-20","T-21","T-22","T-23","T-24","T-25"] },
		{bloque :4 ,nivel:2 ,genero:'M',concepto:'Calceta',tallas: ["13-18"] },

		{bloque :1 ,nivel:3 ,genero:'H',concepto:'Camisa',tallas:  ["T-8","T-9","T-10","T-12","T-14","T-16","T-18","T-20","T-XCH","T-CH","T-M","T-G","T-XG","T-2XG"] },
		{bloque :2 ,nivel:3 ,genero:'H',concepto:'Pantalón',tallas:["T-10","T-12","T-14","T-16","T-18","T-20","T-44","T-46","T-XCH","T-CH","T-M","T-G","T-XG","T-2XG"]},
		{bloque :3 ,nivel:3 ,genero:'H',concepto:'Calzado',tallas: ["T-22","T-23","T-24","T-25","T-26","T-27","T-28","T-29","T-30","T-31"] },

		{bloque :1 ,nivel:3 ,genero:'M',concepto:'Blusa',tallas:   ["T-8","T-10","T-10","T-12","T-14","T-16","T-18","T-20","T-XCH","T-CH","T-M","T-G","T-XG","T-2XG"] },
		{bloque :2 ,nivel:3 ,genero:'M',concepto:'Falda',tallas:   ["T-10","T-12","T-14","T-16","T-18","T-20","T-XCH","T-CH","T-M","T-G","T-XG","T-2XG"] },
		{bloque :3 ,nivel:3 ,genero:'M',concepto:'Calzado',tallas: ["T-22","T-23","T-24","T-25","T-26","T-27","T-28"] },
		{bloque :4 ,nivel:3 ,genero:'M',concepto:'Calceta',tallas: ["13-18"] }
	],

	cargaUniformes : (nivel,sexo) => {
		Preinscripciones_uniformes.feed_div_uniformes(sexo);

		Preinscripciones_uniformes.filtraUniformes(1,nivel,sexo, function(bloque1){
			$.each(bloque1[0]['tallas'], function(key,value){ $('#uniforme1').append('<option value=' + value + '>' + value + '</option>'); });
			$('#label_uniforme-1').html(bloque1[0]['concepto']+" (talla)");

			Preinscripciones_uniformes.filtraUniformes(2,nivel,sexo, function(bloque2){
				$.each(bloque2[0]['tallas'], function(key,value){$('#uniforme2').append('<option value=' + value + '>' + value + '</option>');});
				$('#label_uniforme-2').html(bloque2[0]['concepto']+" (talla)");

				Preinscripciones_uniformes.filtraUniformes(3,nivel,sexo, function(bloque3){
					$.each(bloque3[0]['tallas'], function(key,value){$('#uniforme3').append('<option value=' + value + '>' + value + '</option>');});
					$('#label_uniforme-3').html(bloque3[0]['concepto']+" (talla)");

					Preinscripciones_uniformes.filtraUniformes(4,nivel,sexo, function(bloque4){
						if(bloque4.length > 0){
							$.each(bloque4[0]['tallas'], function(key,value){ $('#uniforme4').append('<option value=' + value + '>' + value + '</option>'); });
							$('#label_uniforme-4').html(bloque4[0]['concepto']+" (talla)");
						}

					});
				});
			});
		});
	},

	filtraUniformes : (bloque_,nivel_,genero_, callback) => {
		filterBy = { bloque: [bloque_],nivel: [nivel_],genero: [genero_],},
		filtered = Preinscripciones_uniformes.uniformes.filter(function (o) {
			return Object.keys(filterBy).every(function (k) {
				return filterBy[k].some(function (f) {
					return o[k] === f;
				});
			});
		});

		return callback(filtered);
	},



	feed_div_uniformes : (genero) => {
		$("#div_preinscripcionesnuevo_uniformes").empty();
		let str_div = "";
		if(genero == "H"){
			str_div = ` <div class="row">
						<div class="col-md-12 col-lg-4">
							<div class="form-group">
								<label id="label_uniforme-1"></label> *
								<select class="form-control" label="label_uniforme-1" name="uniforme1" id="uniforme1">
									<option value="" disabled selected>Seleccione Talla</option>
								</select>
							</div>
						</div>
						<div class="col-md-12 col-lg-4">
							<div class="form-group">
								<label id="label_uniforme-2"></label> *
								<select class="form-control" label="label_uniforme2" name="uniforme2" id="uniforme2">
									<option value="" disabled selected>Seleccione Talla</option>
								</select>
							</div>
						</div>
						<div class="col-md-12 col-lg-4">
							<div class="form-group">
								<label id="label_uniforme-3"></label> *
								<select class="form-control" label="label_uniforme-3" name="uniforme3" id="uniforme3" >
									<option value="" disabled selected>Seleccione Talla</option>
								</select>
								<input type="hidden" name="uniforme4" id="uniforme4" >
							</div>
						</div>
					</div> `;


		} else if (genero == "M") {
			str_div = `
				<div class="row">
					<div class="col-md-12 col-lg-3">
						<div class="form-group">
							<label id="label_uniforme-1"></label> *
							<select class="form-control" label="label_uniforme-1" name="uniforme1" id="uniforme1">
								<option value="" disabled selected>Seleccione Talla</option>
							</select>
						</div>
					</div>
					<div class="col-md-12 col-lg-3">
						<div class="form-group">
							<label id="label_uniforme-2"></label> *
							<select class="form-control" label="label_uniforme-2" name="uniforme2" id="uniforme2">
								<option value="" disabled selected>Seleccione Talla</option>
							</select>
						</div>
					</div>
					<div class="col-md-12 col-lg-3">
						<div class="form-group">
							<label id="label_uniforme-3"></label> *
							<select class="form-control" label="label_uniforme3" name="uniforme3" id="uniforme3" >
								<option value="" disabled selected>Seleccione Talla</option>
							</select>
						</div>
					</div>
					<div class="col-md-12 col-lg-3">
						<div class="form-group">
							<label id="label_uniforme-4"></label> *
							<select class="form-control" label="label_uniforme4" name="uniforme4" id="uniforme4" >
								<option value="" disabled selected>Seleccione Talla</option>
							</select>
						</div>
					</div>
				</div>
			`;
		}
		else {
			alert("Ha ocurrido un error");
		}
		$("#div_preinscripcionesnuevo_uniformes").append(str_div);
	}




};
