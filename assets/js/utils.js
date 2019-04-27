var Utils = new function () {
    this.callAjax = function (ruta, methodType, dataType, params, callback) {
        $.ajax(
                {
                    url: live_url + ruta,
                    method: methodType,
                    dataType: dataType,
                    data: params,
                    //timeout: 5000,
                    beforeSend: function () {
                        $(".ajax-mensaje-loading").show();

                    },
                    complete: function () {
                        $(".ajax-mensaje-loading").hide();

                    },
                    success: function (result) {

                    },
                    error: function () {
                        $(".ajax-mensaje-loading").hide();

                    }
                })
                .done(callback)
                .fail(function (jqXHR, textStatus, errorThrown)
                {
                    busy = false;
                    $(".ajax-mensaje-loading").hidde();
                    bootbox.alert("Ocurrio un error de conexión por favor vuelva a intentarlo");
                });

    };

    this.getArrayLabelsGroupchecks = function (arrelements) {

        var arrstrings = new Array();
        for (var i = 0; i < arrelements.length; i++) {
            var p = $(arrelements[i]).parent();
            arrstrings.push($(p).text());
        }
        return arrstrings.join();
    }
    this.construye_checkgroup = function(path, model, method, key_label, key_value, checkAll, click_all, id, name, params, val_def, change) {

        var data = {model: model,
            method: method,
            params: params
        };
        Utils.callAjax(path, "POST", 'json', data, function (result) {
            var select = "";

            if (checkAll) {
                select += "<li><input type=\"checkbox\" id=\"checartodos" + id + "\"/>Todos</li>";
            }
            for (var i = 0; i < result.elementos.length; i++) {
                var ischecked = "";
                if (result.elementos[i].hasOwnProperty(key_label) && result.elementos[i].hasOwnProperty(key_value)) {
                    
                    if (Array.isArray(val_def)) {
                        for (var j = 0; j < val_def.length; j++) {
                            
                            if (val_def[j] == result.elementos[i][key_value]) {
                                ischecked = "checked";
                                break;
                            }
                        }
                    } else {
                        if (val_def == result.elementos[i][key_value]) {
                            ischecked = "checked";
                        }
                    }
                    select += "<li><input " + ischecked + " type=\"checkbox\" value=\"" + result.elementos[i][key_value] + "\" name=\"" + name + "[]\" class=\"seleccion checartodos" + id + "\" />" + result.elementos[i][key_label] + "</li>";
                }

            }

            var select_obj = $(select);

            if (checkAll) {
                var checkAllButton = select_obj.find("#checartodos" + id);
                if (click_all != null) {
                    $(checkAllButton).click(click_all);

                } else {
                    $(checkAllButton).click(function () {

                        if ($("#button_text_" + id).length > 0) {
                            $("#button_text_" + id).text("");
                            if ($(this).prop('checked')) {
                                $("#button_text_" + id).text("- Todos -");
                            }
                        }
                        $(".checartodos" + id).prop('checked', $(this).prop('checked'));
                    });
                }
            }
            $("#" + id).empty();
            $("#" + id).append(select_obj);

            if (change != null) {
                
                $(".checartodos" + id).click(change);
                change();
                
            } else {
                $(".checartodos" + id).click(function () {
                    var s = $("input.checartodos" + id + "[type='checkbox']:checked");
                    $("#button_text_" + id).text(Utils.getArrayLabelsGroupchecks(s));

                });

            }

            //poner texto de los seleccionados
            var s = $("input.checartodos" + id + "[type='checkbox']:checked");
            $("#button_text_" + id).text(Utils.getArrayLabelsGroupchecks(s));

        });

    }
    
    this.construye_selecxruta = function (ruta, key_label, key_value, opcion1, id, params, val_def, change) {
        var data = {
            params: params
        };
        Utils.callAjax(ruta, "POST", 'json', data, function (result) {
            var select = "";
            if (opcion1 != null) {
                if (opcion1.hasOwnProperty(key_label) && opcion1.hasOwnProperty(key_value)) {
                    select += "<option  value=\"" + opcion1[key_value] + "\">" + opcion1[key_label] + "</option>";
                }
            }
            for (var i = 0; i < result.elementos.length; i++) {
                if (result.elementos[i].hasOwnProperty(key_label) && result.elementos[i].hasOwnProperty(key_value)) {
                    var isselected = result.elementos[i][key_value] == val_def ? "selected" : "";
                    select += "<option " + isselected + " value=\"" + result.elementos[i][key_value] + "\">" + result.elementos[i][key_label] + "</option>";
                }

            }

            var select_obj = $(select);

            $("#" + id).empty();
            $("#" + id).append(select_obj);
            
            $("#" + id).prop("disabled", false);
            if (change != null) {
                $("#" + id).unbind();
                $("#" + id).change(change);

                if (val_def != "" && val_def != "-1") {

                    $("#" + id).trigger("change");
                }

            }

        });
    }
    
    

    this.construye_select = function (model, method, key_label, key_value, opcion1, id, params, val_def, change) {

        var data = {model: model,
            method: method,
            params: params
        };

        Utils.callAjax("index.php/utils_ajax/select_ajax", "POST", 'json', data, function (result) {
            var select = "";
            if (opcion1 != null) {
                if (opcion1.hasOwnProperty(key_label) && opcion1.hasOwnProperty(key_value)) {
                    select += "<option  value=\"" + opcion1[key_value] + "\">" + opcion1[key_label] + "</option>";
                }
            }
            for (var i = 0; i < result.elementos.length; i++) {
                if (result.elementos[i].hasOwnProperty(key_label) && result.elementos[i].hasOwnProperty(key_value)) {
                    var isselected = result.elementos[i][key_value] == val_def ? "selected" : "";
                    select += "<option " + isselected + " value=\"" + result.elementos[i][key_value] + "\">" + result.elementos[i][key_label] + "</option>";
                }

            }

            var select_obj = $(select);

            $("#" + id).empty();
            $("#" + id).append(select_obj);
            
            $("#" + id).prop("disabled", false);
            if (change != null) {
                $("#" + id).unbind();
                $("#" + id).change(change);

                if (val_def != "" && val_def != "-1") {

                    $("#" + id).trigger("change");
                }

            }

        });
    }
}

function atras() {
    window.history.back();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var nivelGradoEdad= [];
nivelGradoEdad[1] = [];
nivelGradoEdad[2] = [];
nivelGradoEdad[3] = [];

//   array[nivel][grado]=edadMinimaCumplida;
nivelGradoEdad[1][1] = 3;
nivelGradoEdad[1][2] = 4;
nivelGradoEdad[1][3] = 5;
nivelGradoEdad[2][1] = 6;
nivelGradoEdad[2][2] = 7;
nivelGradoEdad[2][3] = 8;
nivelGradoEdad[2][4] = 9;
nivelGradoEdad[2][5] = 10;
nivelGradoEdad[2][6] = 11;
nivelGradoEdad[3][1] = 12;
nivelGradoEdad[3][2] = 13;
nivelGradoEdad[3][3] = 14;
var edadPermitida=null;
var age = null;

function esEdadValida(fechaNac, nivel, grado) {
 var bit = false;
 if (fechaNac != "" && nivel != null && grado != null) {
  var nac = new Date(fechaNac);
  var now = new Date();
  var top = new Date(now.getFullYear() + '/12/31');

  age = Math.floor((top - nac) / 31557600000);
  edadPermitida = nivelGradoEdad[nivel][grado];
  //alert(age + " = "+nivelGradoEdad[nivel][grado])
  if (age == edadPermitida) {
   bit = true;
  }
 }
 return bit;


}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

