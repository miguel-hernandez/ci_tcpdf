$(document).ready(function () {
  es_supervision= false;
  obj_notification = new Notification("sisat_notifications");
  obj_sisat = new Sisat();

});

function manda_alert(){
  $("#alerta_noCap").modal("show");
}

function bloquea(){
    $("#sg-table tbody tr").each(function (index) {
      var elemento = $(this);

      var id_exp = String(elemento.attr('id'));
      var sig = elemento.next();

      var sig_id = String($(sig).attr('id'));

      if (sig_id.indexOf(id_exp)!=-1) {
          elemento = null;
          $(this).children("td").each(function (index2)
          {
            switch (index2)
            {
              case 11:
                var btn_hijo  = $(this).children("button");
                $(btn_hijo).prop( "disabled", true );
              break;
            }
          });
      }
    });
}

function ordenamiento_f(val){
   var inorder = $("#inorder").val();
   if(inorder == "ASC"){$("#inorder").val("DESC");}else{$("#inorder").val("ASC");}
    $("#ordenamiento").val(val);
    obj_sisat.get_alumnos_xgrupo();
}

$("#btn_sisat_getalumnos").click(function(e){
  e.preventDefault();
  obj_sisat.valida_form();
});

$("#btn_sisat_graba_cprof").click(function(e){
  e.preventDefault();
  obj_sisat.set_comentario_usuario();
});

$("#btn_sisat_graba_csuper").click(function(e){
  e.preventDefault();
  obj_sisat.set_comentario_supervisor();
});

$("#btn_sisat_clearform").click(function(e){
  e.preventDefault();
  var redirect = $("#itext_redirect").val();
  if(redirect==1){
    obj_sisat.get_form_redirect();
  }else {
    obj_sisat.clear_form();
    $("#inorder").val("ASC");
  }
});

$("#txt_sisat_grupo").change(function(){
  obj_sisat.restart_div_grid();
  $("#inorder").val("ASC");
});

$("#txt_sisat_opcion").change(function(){
  obj_sisat.restart_div_grid();
  $("#inorder").val("ASC");
});

$("#txt_sisat_grupo").change(function(){
  obj_sisat.restart_div_grid();
  $("#inorder").val("ASC");
});

$("#txt_sisat_exploracion").change(function(){
  obj_sisat.restart_div_grid();
  $("#inorder").val("ASC");
});

$("#sel_grupos_supervisor_sisat").change(function(){
  if($("#sel_grupos_supervisor_sisat").val() != ""){
    $("#btn_sisat_getalumnos").attr("disabled", false);
    vamos_grupos_escuela_supervisor();
  }else{
    $("#btn_sisat_getalumnos").attr("disabled", "disabled");
  }

});

function save_dataG(idexpediente,id_select){/* La función que se llama con el change de los select del grid */
  obj_notification.dismissible();
  var arr_tmp = id_select.split("_");
  var indice_columna = arr_tmp[0];
  var val_select = $("#"+id_select).val();
  var id_opcion = $("#txt_sisat_opcion").val();
  var id_exploracion = $("#txt_sisat_exploracion").val();
  if( (id_opcion == 1 || id_opcion == "1") || (id_opcion == 2 || id_opcion == "2") ){ // Lectura o Texto
    obj_sisat.calcula_total_txt_lect(idexpediente, function(total_pts, total_capturados){

      obj_sisat.set_values_sisat(total_capturados, idexpediente, val_select, id_opcion, id_exploracion, indice_columna, total_pts);
    });
  }
  else if ( id_opcion == 3 || id_opcion == "3" ) { // Cálculo
    obj_sisat.calcula_total_calc(idexpediente, function(total_pts, total_1V, total_capturados){
      obj_sisat.set_values_sisat(total_capturados, idexpediente, val_select, id_opcion, id_exploracion, indice_columna, total_pts, total_1V);
    });
  }
}// save_dataG()

function genera_campo_supervisor(idexpediente,id_select){
  var posicion = recorre(idexpediente);
  agregaFila(posicion, 'en medio', 'hola',idexpediente, id_select);
}

function genera_campo_supervisor_calculo(idexpediente,id_select){
  es_supervision = true;
  var pos = recorre(idexpediente);
    var combo1 = "<select id = 1_"+idexpediente+"_sup onchange=save_data_supervisor('1_"+idexpediente+"_sup')><option value='NULL'></option><option value='0'>0</option><option value='1'>1</option><<option value='2'>1V</option></select>";
    var combo2 = "<select id = 2_"+idexpediente+"_sup onchange=save_data_supervisor('2_"+idexpediente+"_sup')><option value='NULL'></option><option value='0'>0</option><option value='1'>1</option><<option value='2'>1V</option></select>";
    var combo3 = "<select id = 3_"+idexpediente+"_sup onchange=save_data_supervisor('3_"+idexpediente+"_sup')><option value='NULL'></option><option value='0'>0</option><option value='1'>1</option><<option value='2'>1V</option></select>";
    var combo4 = "<select id = 4_"+idexpediente+"_sup onchange=save_data_supervisor('4_"+idexpediente+"_sup')><option value='NULL'></option><option value='0'>0</option><option value='1'>1</option><<option value='2'>1V</option></select>";
    var combo5 = "<select id = 5_"+idexpediente+"_sup onchange=save_data_supervisor('5_"+idexpediente+"_sup')><option value='NULL'></option><option value='0'>0</option><option value='1'>1</option><<option value='2'>1V</option></select>";
    var combo6 = "<select id = 6_"+idexpediente+"_sup onchange=save_data_supervisor('6_"+idexpediente+"_sup')><option value='NULL'></option><option value='0'>0</option><option value='1'>1</option><<option value='2'>1V</option></select>";
    var combo7 = "<select id = 7_"+idexpediente+"_sup onchange=save_data_supervisor('7_"+idexpediente+"_sup')><option value='NULL'></option><option value='0'>0</option><option value='1'>1</option><<option value='2'>1V</option></select>";
    var combo8 = "<select id = 8_"+idexpediente+"_sup onchange=save_data_supervisor('8_"+idexpediente+"_sup')><option value='NULL'></option><option value='0'>0</option><option value='1'>1</option><<option value='2'>1V</option></select>";
    var combo9 = "<select id = 9_"+idexpediente+"_sup onchange=save_data_supervisor('9_"+idexpediente+"_sup')><option value='NULL'></option><option value='0'>0</option><option value='1'>1</option><<option value='2'>1V</option></select>";
    var combo10 = "<select id = 10_"+idexpediente+"_sup onchange=save_data_supervisor('10_"+idexpediente+"_sup')><option value='NULL'></option><option value='0'>0</option><option value='1'>1</option><<option value='2'>1V</option></select>";
    var miTabla = document.getElementById("sg-table");
    var fila = document.createElement("tr");
    var celda0 = document.createElement("td");
    var celda00 = document.createElement("td");
    var celda1 = document.createElement("td");
    var celda2 = document.createElement("td");
    var celda3 = document.createElement("td");
    var celda4 = document.createElement("td");
    var celda5 = document.createElement("td");
    var celda6 = document.createElement("td");
    var celda7 = document.createElement("td");
    var celda8 = document.createElement("td");
    var celda9 = document.createElement("td");
    var celda10 = document.createElement("td");
    var celda11 = document.createElement("td");
    var celda12 = document.createElement("td");
    var celda13 = document.createElement("td");
    var celda14 = document.createElement("td");
    var celda15 = document.createElement("td");
    celda0.innerHTML = '';
    celda0.setAttribute('style', 'display:none');
    celda00.innerHTML = '';
    celda00.setAttribute('style', 'display:none');
    celda1.innerHTML = "";
    celda2.innerHTML = combo1;
    celda2.setAttribute('class', 'center');
    celda3.innerHTML = combo2;
    celda3.setAttribute('class', 'center');
    celda4.innerHTML = combo3;
    celda4.setAttribute('class', 'center');
    celda5.innerHTML = combo4;
    celda5.setAttribute('class', 'center');
    celda6.innerHTML = combo5;
    celda6.setAttribute('class', 'center');
    celda7.innerHTML = combo6;
    celda7.setAttribute('class', 'center');
    celda8.innerHTML = combo7;
    celda8.setAttribute('class', 'center');
    celda9.innerHTML = combo8;
    celda9.setAttribute('class', 'center');
    celda10.innerHTML = combo9;
    celda10.setAttribute('class', 'center');
    celda11.innerHTML = combo10;
    celda11.setAttribute('class', 'center');
    celda12.innerHTML = "";
    celda12.setAttribute('class', 'center');
    celda13.innerHTML = "";
    celda13.setAttribute('class', 'center');
    celda14.innerHTML = "";
    celda13.setAttribute('class', 'center');
    celda15.innerHTML = "<button id='elimina_"+idexpediente+"' onclick=elimina_row('"+idexpediente+"_2','"+id_select+"') value='test' class='btn btn_color_danger'><span class='glyphicon glyphicon-minus'></span></button>";
    celda15.setAttribute('class', 'center');
    fila.appendChild(celda0);
    fila.appendChild(celda00);
    fila.appendChild(celda1);
    fila.appendChild(celda2);
    fila.appendChild(celda3);
    fila.appendChild(celda4);
    fila.appendChild(celda5);
    fila.appendChild(celda6);
    fila.appendChild(celda7);
    fila.appendChild(celda8);
    fila.appendChild(celda9);
    fila.appendChild(celda10);
    fila.appendChild(celda11);
    fila.appendChild(celda12);
    fila.appendChild(celda13);
    fila.appendChild(celda14);
    fila.appendChild(celda15);

    // Obtenemos la referencia al elemento, antes de insertarlo
    var sp2 = document.getElementById(idexpediente);
    // Obten la referencia al elemento padre
    var parentDiv = sp2.parentNode;
    var TRs = miTabla.getElementsByTagName("tr");
    var dato = $("#"+idexpediente)[0].getElementsByTagName("td")[1].innerHTML;
    celda1.innerHTML = dato;
    if( TRs[pos] ) {
      // Insertamos el nuevo elemento en el DOM despues de sp2
        parentDiv.insertBefore(fila, sp2.nextSibling);
        $("#"+id_select).attr("disabled", true);
        fila.setAttribute('id', idexpediente+'_2');
    }
    else {
        miTabla.appendChild(fila);
    }
}

function recorre(id_select){
  var contador = 0;
  var pos = 0;
  $("#sg-table tbody tr").each(function (index) {
    contador++;
    var elemento = $(this);
    if(elemento.attr('id') == id_select){
       pos = contador;
    }
  });
  return pos;
}

function agregaFila(pos, txt1, txt2, idexpediente, id_select)    {
  es_supervision = true;
    var combo1 = "<select id = 1_"+idexpediente+"_sup onchange=save_data_supervisor('1_"+idexpediente+"_sup')><option value='NULL'></option><option value='1'>1</option><option value='2'>2</option><<option value='3'>3</option></select>";
    var combo2 = "<select id = 2_"+idexpediente+"_sup onchange=save_data_supervisor('2_"+idexpediente+"_sup')><option value='NULL'></option><option value='1'>1</option><option value='2'>2</option><<option value='3'>3</option></select>";
    var combo3 = "<select id = 3_"+idexpediente+"_sup onchange=save_data_supervisor('3_"+idexpediente+"_sup')><option value='NULL'></option><option value='1'>1</option><option value='2'>2</option><<option value='3'>3</option></select>";
    var combo4 = "<select id = 4_"+idexpediente+"_sup onchange=save_data_supervisor('4_"+idexpediente+"_sup')><option value='NULL'></option><option value='1'>1</option><option value='2'>2</option><<option value='3'>3</option></select>";
    var combo5 = "<select id = 5_"+idexpediente+"_sup onchange=save_data_supervisor('5_"+idexpediente+"_sup')><option value='NULL'></option><option value='1'>1</option><option value='2'>2</option><<option value='3'>3</option></select>";
    var combo6 = "<select id = 6_"+idexpediente+"_sup onchange=save_data_supervisor('6_"+idexpediente+"_sup')><option value='NULL'></option><option value='1'>1</option><option value='2'>2</option><<option value='3'>3</option></select>";
    var miTabla = document.getElementById("sg-table");
    var fila = document.createElement("tr");
    var celda0 = document.createElement("td");
    var celda00 = document.createElement("td");
    var celda1 = document.createElement("td");
    var celda2 = document.createElement("td");
    var celda3 = document.createElement("td");
    var celda4 = document.createElement("td");
    var celda5 = document.createElement("td");
    var celda6 = document.createElement("td");
    var celda7 = document.createElement("td");
    var celda8 = document.createElement("td");
    var celda9 = document.createElement("td");
    var celda10 = document.createElement("td");
    celda0.innerHTML = '';
    celda0.setAttribute('style', 'display:none');
    celda00.innerHTML = '';
    celda00.setAttribute('style', 'display:none');
    celda1.innerHTML = txt1;
    celda1.setAttribute("class", "destacado");
    celda2.innerHTML = combo1;
    celda2.setAttribute('class', 'center');
    celda3.innerHTML = combo2;
    celda3.setAttribute('class', 'center');
    celda4.innerHTML = combo3;
    celda4.setAttribute('class', 'center');
    celda5.innerHTML = combo4;
    celda5.setAttribute('class', 'center');
    celda6.innerHTML = combo5;
    celda6.setAttribute('class', 'center');
    celda7.innerHTML = combo6;
    celda7.setAttribute('class', 'center');
    celda8.innerHTML = "";
    celda8.setAttribute('class', 'center');
    celda9.innerHTML = "";
    celda9.setAttribute('class', 'center');
    celda10.innerHTML = "<button id='elimina_"+idexpediente+"' onclick=elimina_row('"+idexpediente+"_2','"+id_select+"') value='test' class='btn btn_color_danger'><span class='glyphicon glyphicon-minus'></span></button>";
    celda10.setAttribute('class', 'center');
    fila.appendChild(celda0);
    fila.appendChild(celda00);
    fila.appendChild(celda1);
    fila.appendChild(celda2);
    fila.appendChild(celda3);
    fila.appendChild(celda4);
    fila.appendChild(celda5);
    fila.appendChild(celda6);
    fila.appendChild(celda7);
    fila.appendChild(celda8);
    fila.appendChild(celda9);
    fila.appendChild(celda10);

    // Obtenemos la referencia al elemento, antes de insertarlo
    var sp2 = document.getElementById(idexpediente);
    // Obten la referencia al elemento padre
    var parentDiv = sp2.parentNode;
    var TRs = miTabla.getElementsByTagName("tr");
    var dato = $("#"+idexpediente)[0].getElementsByTagName("td")[1].innerHTML;
    celda1.innerHTML = dato;
    if( TRs[pos] ) {
      // Insertamos el nuevo elemento en el DOM despues de sp2
        parentDiv.insertBefore(fila, sp2.nextSibling);
        $("#"+id_select).attr("disabled", true);
        fila.setAttribute('id', idexpediente+'_2');
    }
    else {
        miTabla.appendChild(fila);
    }
}

function save_data_supervisor(id_expediente){
  es_supervision = true;
   // obj_notification.dismissible();
  var arr_tmp = id_expediente.split("_");
  var indice_columna = arr_tmp[0];
  var idexpediente = arr_tmp[1];

  var val_select = $("#"+id_expediente).val();
  var id_opcion = $("#txt_sisat_opcion").val();
  var id_exploracion = $("#txt_sisat_exploracion").val();
  if( (id_opcion == 1 || id_opcion == "1") || (id_opcion == 2 || id_opcion == "2") ){ // Lectura o Texto
    obj_sisat.calcula_total_txt_lect(idexpediente, function(total_pts, total_capturados){
      obj_sisat.set_values_sisat(total_capturados, idexpediente, val_select, id_opcion, id_exploracion, indice_columna, total_pts, es_supervision);
    });
  }
  else if ( id_opcion == 3 || id_opcion == "3" ) { // Cálculo
    obj_sisat.calcula_total_calc(idexpediente, function(total_pts, total_1V, total_capturados){

      obj_sisat.set_values_sisat(total_capturados, idexpediente, val_select, id_opcion, id_exploracion, indice_columna, total_pts, total_1V);
    });
  }
}

function elimina_row(idexpediente, id_select){
   var arr_tmp = idexpediente.split("_");
   var id_expediente_elim = arr_tmp[0];
   var posicion = recorre(idexpediente);
   var table = document.getElementById('sg-table');
  // elimina_row_supervisor(id_expediente_elim, posicion, id_select, table);

    $("#delete_id_expediente").val(id_expediente_elim);
    $("#delete_posicion").val(posicion);
    $("#delete_id_select").val(id_select);
    // $("#delete_table").val(table);

    $("#modal_delete_row").modal("show");
}// elimina_row()


$("#btn_delete_confirm").click(function(e){
  e.preventDefault();
  var id_expediente_elim = $("#delete_id_expediente").val();
  var posicion = $("#delete_posicion").val();
  var id_select = $("#delete_id_select").val();

  var table = document.getElementById('sg-table');
  elimina_row_supervisor(id_expediente_elim, posicion, id_select, table);
});


function elimina_row_supervisor(id_expediente, posicion, id_select, table){
  $.ajax({
    url: base_url+"index.php/Sisat/elimina_row_supervisor",
    type: 'POST',
    data: 'id_expediente='+id_expediente,
    success: function(data){
      if(data == 1 || data == true || data == "true" || data == "1"){
        table.deleteRow(posicion);
        $("#"+id_select).attr("disabled", false);
        // reset al form y ocultamos modal
        $('#form_delete_row')[0].reset();
        $("#modal_delete_row").modal("hide");
      }else{
        alert("no eliminado");
      }
    },
    error: function(error){
      console.error(error);
    }
  });
}

function vamos_grupos_escuela_supervisor(){
  $.ajax({
    url: base_url+"index.php/Sisat/get_grupos_supervisor",
    type: 'POST',
    data: 'id_cfg='+$("#sel_grupos_supervisor_sisat").val(),
    success: function(data){
      $('#txt_sisat_grupo').empty();
      var grupos = data.grupos;
      for (var i = 0; i < grupos.length; i++) {
        $('#txt_sisat_grupo')
         .append($("<option value='"+grupos[i]['idgrupo']+"'>"+grupos[i]['grado']+grupos[i]['grupo']+"</option>"));
      }
    },
    error: function(error){
      console.error(error);
    }
  });

}


function Sisat(){
  that_sisat = this;
  that_sisat.total_opc_texlect = 6;
  that_sisat.total_opc_calc = 10;

  // Intervalos Cálculo
  that_sisat.nivelcal_apoyo_min = 0;
  that_sisat.nivelcal_apoyo_max = 4;

  that_sisat.nivelcal_desarrollo_min = 5;
  that_sisat.nivelcal_desarrollo_max = 7;

  that_sisat.nivelcal_esperado_min = 8;
  that_sisat.nivelcal_esperado_max = 10;

  // Intervalos Texto y Lectura (Los dos tienen los mismos valores)
  that_sisat.nivellectext_apoyo_min = 0;
  that_sisat.nivellectext_apoyo_max = 9;

  that_sisat.nivellectext_desarrollo_min = 10;
  that_sisat.nivellectext_desarrollo_max = 14;

  that_sisat.nivellectext_esperado_min = 15;
  that_sisat.nivellectext_esperado_max = 18;



  this.valida_form = function(){
    // obj_notification = null;
    var grupo_filtro = $("#txt_sisat_grupo").val();
    var opcion = $("#txt_sisat_opcion").val();
    var exploracion = $("#txt_sisat_exploracion").val();
    if(grupo_filtro == "0"){
      // var obj_notification = new Notification("sisat_notifications");
      obj_notification.error("Seleccione un grupo");
    }else{
      if(opcion == "0"){
        // var obj_notification = new Notification("sisat_notifications");
        obj_notification.error("Seleccione una herramienta");
      }else{
        if(exploracion == "0"){
          // var obj_notification = new Notification("sisat_notifications");
          obj_notification.error("Seleccione una exploración");
        }else{
          that_sisat.get_alumnos_xgrupo();
        }
      }
    }
  }// valida_form()

  this.get_alumnos_xgrupo = function(){
    $("#comentario_prf").val("");
    that_sisat.restart_div_grid();
    var forma = $("#form_sisat").serialize();
    $.ajax({
      url: base_url+"index.php/Sisat/get_alumnos_grupo",
      data:forma,
      type:'POST',
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success: function(result){
        $("#row_semaforos").show();
        $("#wait").modal("hide");
        $("#div_sisat_grid").empty();
        $("#div_sisat_grid").append(result.grid);
        $("#panel_oculto").show();
        $("#comentario_prf").val(result.nota);
        $("#comentario_sup").val(result.nota_superv);

        that_sisat.get_icon_habilidad( $("#txt_sisat_opcion").val() );
        bloquea();
      },
      error:function(xhr){
        $("#wait").modal("hide");
        console.error(xhr.status + ": " + xhr.responseText);
      }
    });
  }// get_alumnos_xgrupo()




  /*
  var select_hijo  = $(this).children("select");
  var val = parseInt($(select_hijo).val());
  total_puntos = total_puntos + parseInt(val);
  */
  this.totalpts_textlect = function(that,total_puntos, total_capturados, callback){
    var select_hijo  = $(that).children("select");
    var pts = $(select_hijo).val();
    if(pts=="NULL"){
    }else{
        total_puntos = total_puntos + parseInt(pts);
        total_capturados = total_capturados+1;
    }
    return callback(total_puntos, total_capturados);
  }// totalpts_textlect()

  this.calcula_total_txt_lect = function(idexpediente,callback){
    idexpediente = (es_supervision)?idexpediente+"_2":idexpediente;
    var total_puntos = 0;
    var total_capturados = 0;
    $("#sg-table tbody tr").each(function() {
      var id_row = $(this).attr("id");
      if(idexpediente == id_row){
        $(this).children("td").each(function (index)
        {
          switch (index)
          {
            case 3:
                that_sisat.totalpts_textlect(this, total_puntos, total_capturados, function(total_pts_aux, total_capturados_aux){
                  total_puntos = total_pts_aux;
                  total_capturados = total_capturados_aux;
                });
            break;
            case 4:
                that_sisat.totalpts_textlect(this, total_puntos, total_capturados, function(total_pts_aux, total_capturados_aux){
                  total_puntos = total_pts_aux;
                  total_capturados = total_capturados_aux;
                });
            break;
            case 5:
                that_sisat.totalpts_textlect(this, total_puntos, total_capturados, function(total_pts_aux, total_capturados_aux){
                  total_puntos = total_pts_aux;
                  total_capturados = total_capturados_aux;
                });
            break;
            case 6:
                that_sisat.totalpts_textlect(this, total_puntos, total_capturados, function(total_pts_aux, total_capturados_aux){
                  total_puntos = total_pts_aux;
                  total_capturados = total_capturados_aux;
                });
            break;
            case 7:
                that_sisat.totalpts_textlect(this, total_puntos, total_capturados, function(total_pts_aux, total_capturados_aux){
                  total_puntos = total_pts_aux;
                  total_capturados = total_capturados_aux;
                });
            break;
            case 8:
                that_sisat.totalpts_textlect(this, total_puntos, total_capturados, function(total_pts_aux, total_capturados_aux){
                  total_puntos = total_pts_aux;
                  total_capturados = total_capturados_aux;
                });
            break;
            case 9:
              /*$(this).empty();
              $(this).html(total_puntos);*/
            break;
          }
        });
      }
    });
    return callback(total_puntos, total_capturados);
  }// calcula_total_txt_lect()

  // 1 + 1V = PT
  // total 1V = 1V
this.total_pts_1v = function(that,t_puntos,t_1v,total_capturados,callback){
      var select_hijo  = $(that).children("select");
      var valor = $.trim($(select_hijo).val());
      if(valor=="NULL") {
      }
      else{
        total_capturados = total_capturados +1;
        if(valor == "1" || valor == 1) {
            t_puntos = t_puntos + 1;
        }
        else if(valor == "2" || valor == 2){
           t_1v = t_1v+1;
           t_puntos = t_puntos + 1;
        }
      }

    return callback(t_puntos, t_1v, total_capturados);
  }// total_pts_1v()

  this.calcula_total_calc = function(idexpediente,callback){
    idexpediente = (es_supervision)?idexpediente+"_2":idexpediente;

    var total_puntos = 0;
    var total_1v = 0;
    var total_capturados = 0;

    $("#sg-table tbody tr").each(function() {
      var id_row = $(this).attr("id");
      if(idexpediente==id_row){
        $(this).children("td").each(function (index)
        {
          switch (index)
          {
            case 3:
                  that_sisat.total_pts_1v(this, total_puntos, total_1v, total_capturados, function(total_pts_aux, total_1v_aux, total_capturados_aux){
                    total_puntos = total_pts_aux;
                    total_1v = total_1v_aux;
                    total_capturados = total_capturados_aux;
                  });
            break;
            case 4:
                that_sisat.total_pts_1v(this, total_puntos, total_1v, total_capturados, function(total_pts_aux, total_1v_aux, total_capturados_aux){
                  total_puntos = total_pts_aux;
                  total_1v = total_1v_aux;
                  total_capturados = total_capturados_aux;
                });
            break;
            case 5:
                that_sisat.total_pts_1v(this, total_puntos, total_1v, total_capturados, function(total_pts_aux, total_1v_aux, total_capturados_aux){
                  total_puntos = total_pts_aux;
                  total_1v = total_1v_aux;
                  total_capturados = total_capturados_aux;
                });
            break;
            case 6:
                that_sisat.total_pts_1v(this, total_puntos, total_1v, total_capturados, function(total_pts_aux, total_1v_aux, total_capturados_aux){
                  total_puntos = total_pts_aux;
                  total_1v = total_1v_aux;
                  total_capturados = total_capturados_aux;
                });
            break;
            case 7:
                that_sisat.total_pts_1v(this, total_puntos, total_1v, total_capturados, function(total_pts_aux, total_1v_aux, total_capturados_aux){
                  total_puntos = total_pts_aux;
                  total_1v = total_1v_aux;
                  total_capturados = total_capturados_aux;
                });
            break;
            case 8:
                that_sisat.total_pts_1v(this, total_puntos, total_1v, total_capturados, function(total_pts_aux, total_1v_aux, total_capturados_aux){
                  total_puntos = total_pts_aux;
                  total_1v = total_1v_aux;
                  total_capturados = total_capturados_aux;
                });
            break;
            case 9:
                that_sisat.total_pts_1v(this, total_puntos, total_1v, total_capturados, function(total_pts_aux, total_1v_aux, total_capturados_aux){
                  total_puntos = total_pts_aux;
                  total_1v = total_1v_aux;
                  total_capturados = total_capturados_aux;
                });
            break;
            case 10:
                that_sisat.total_pts_1v(this, total_puntos, total_1v, total_capturados, function(total_pts_aux, total_1v_aux, total_capturados_aux){
                  total_puntos = total_pts_aux;
                  total_1v = total_1v_aux;
                  total_capturados = total_capturados_aux;
                });
            break;
            case 11:
                that_sisat.total_pts_1v(this, total_puntos, total_1v, total_capturados, function(total_pts_aux, total_1v_aux, total_capturados_aux){
                  total_puntos = total_pts_aux;
                  total_1v = total_1v_aux;
                  total_capturados = total_capturados_aux;
                });
            break;
            case 12:
                that_sisat.total_pts_1v(this, total_puntos, total_1v, total_capturados, function(total_pts_aux, total_1v_aux, total_capturados_aux){
                  total_puntos = total_pts_aux;
                  total_1v = total_1v_aux;
                  total_capturados = total_capturados_aux;
                });
            break;
            case 13:
                /*$(this).empty();
                $(this).html(total_puntos);*/
            break;
            case 14:
                /*$(this).empty();
                $(this).html(total_1v);*/
            break;
          }
        });
      }
    });
    return callback(total_puntos,total_1v,total_capturados);
  }// calcula_total_calc()

  this.set_values_sisat = function(total_capturados, idexpediente, val_select, id_opcion, id_exploracion, indice_columna, total_pts, total_1V=0, supervisor){

        obj_sisat.get_nivel_numerico(id_opcion,total_pts,total_capturados, function(nivel_aux, continuar){
            that_sisat.set_values_sisat_ok(idexpediente,nivel_aux,id_opcion,id_exploracion,indice_columna,continuar,
                                           val_select,total_pts,total_1V, es_supervision);
        });
  }// set_values_sisat()

  this.get_nivel_numerico = function(id_habilidad,total_pts,total_capturados,callback){
    var total_opc = 0;
    var nivel = 0;
    var insertar_nivel = "no";

    if( (id_habilidad == 1 || id_habilidad == "1") || (id_habilidad == 2 || id_habilidad == "2") ){ // Lectura o Texto
      total_opc = that_sisat.total_opc_texlect;
    }
    else if ( id_habilidad == 3 || id_habilidad == "3" ) { // Cálculo
      total_opc = that_sisat.total_opc_calc;
    }

    if(total_capturados == total_opc){
        insertar_nivel = "si";
        if( (id_habilidad == 1 || id_habilidad == "1") || (id_habilidad == 2 || id_habilidad == "2") ){ // Lectura o Texto
            if(total_pts<= that_sisat.nivellectext_apoyo_max){ // Requiere apoyo
              nivel = 1;
            }
            else if(total_pts>that_sisat.nivellectext_apoyo_max  && total_pts<=that_sisat.nivellectext_desarrollo_max){ // En desarrollo
              nivel = 2;
            }
            else if(total_pts>that_sisat.nivellectext_desarrollo_max && total_pts<=that_sisat.nivellectext_esperado_max){ // Esperado
              nivel = 3;
            }
        }
        else if ( id_habilidad == 3 || id_habilidad == "3" ) { // Cálculo
            if(total_pts<= that_sisat.nivelcal_apoyo_max){ // Requiere apoyo
              nivel = 1;
            }
            else if(total_pts>that_sisat.nivelcal_apoyo_max && total_pts<=that_sisat.nivelcal_desarrollo_max){ // En desarrollo
              nivel = 2;
            }
            else if(total_pts>that_sisat.nivelcal_desarrollo_max && total_pts<=that_sisat.nivelcal_esperado_max){ // Esperado
              nivel = 3;
            }
        }
    }
    return callback(nivel, insertar_nivel);
  }// get_nivel_numerico()

  this.set_values_sisat_ok = function(idexpediente,nivel,id_habilidad,id_exploracion,indice_columna, continuar,val_select,total_pts,total_1V, supervisor=false ){

    $.ajax({
      url: base_url+"index.php/Sisat/set_all_values",
      data:{'idexpediente':idexpediente, 'nivel':nivel, 'id_habilidad':id_habilidad, 'id_exploracion':id_exploracion, 'indice_columna':indice_columna, 'continuar':continuar,
            'val_select':val_select, 'total_pts':total_pts,'total_1V':total_1V, "supervisor":supervisor},
      type:'POST',
      success: function(result){
        // var result = JSON.parse(result);
        var i_columna = parseInt(indice_columna) + parseInt(2);
        if(result == 1 || result == "1" || result == true || result == "true"){
            that_sisat.colorea_select(i_columna,idexpediente,1);
            var index_tlc = (id_habilidad==3)?15:10;
            var index_pts = (id_habilidad==3)?13:9;
            that_sisat.get_img_semaforo_tlc(idexpediente,nivel,index_tlc,continuar);// continuar es un boolean que determina si se pone el semaforo o no
            if(id_habilidad==3){
              that_sisat.set_pts_1v_calculo(idexpediente, total_pts, total_1V,continuar);
            }
            else{
              that_sisat.set_pts_tl(idexpediente, total_pts, continuar);
            }
        }
        else if (result == 0 || result == "0" || result == false || result == "false") {
            that_sisat.colorea_select(i_columna,idexpediente,0);
        }
        else{
            that_sisat.colorea_select(i_columna,idexpediente,0);
        }
      },
      error:function(xhr){
        $("#wait").modal("hide");
        console.error(xhr.status + ": " + xhr.responseText);
        that_sisat.colorea_select(i_columna,idexpediente,0);
      }
    });
  }// set_nivel()


  this.get_icon_habilidad = function(idhabilidad){
    var nom = "";
    var lbl = "";
    var string_img ="";
    if(idhabilidad == "1" || idhabilidad == 1){
      nom = "lectura.png";
      lbl = "<label> Lectura </label>";
    }else if (idhabilidad == "2" || idhabilidad == 2) {
      nom = "textos_escritos.png";
      lbl = "<label> Textos escritos </label>";
    }else if (idhabilidad == "3" || idhabilidad == 3) {
      nom = "calculo_mental.png";
      lbl = "<label> Cálculo mental </label>";
    }
    // string_img = "<img src='../../assets/images/"+nom+"' width='40' height='40'> " + lbl;
    string_img = "<img src='"+base_url+"assets/images/"+nom+"' width='40' height='40'> " + lbl;
    $("#img_habilidad").empty();
    $("#img_habilidad").append(string_img);
  }// get_icon_habilidad()

  this.restart_div_grid = function(){
    obj_notification.dismissible();
    /*$("#div_sisat_grid").removeClass('scroll');*/
    $("#div_sisat_grid").empty();
    $("#panel_oculto").hide();
    $("#row_semaforos").hide();
    /*
    if( $('#sel_grupos_supervisor_sisat').is(":visible") ){
        $("#btn_sisat_getalumnos").attr("disabled", true);
    }else{
    }
    */

  }// restart_div_grid()

  this.clear_form = function(){
    $('#form_sisat')[0].reset();
    that_sisat.restart_div_grid();
  }// clear_form()


  this.colorea_select = function(indice_columna, idexpediente, estatus){
    idexpediente = (es_supervision)?idexpediente+"_2":idexpediente;
      $("#sg-table tbody tr").each(function() {
        var id_row = $(this).attr("id");
        if(idexpediente==id_row){
          $(this).children("td").each(function (index)
          {
            if(index==indice_columna){
              var select_hijo  = $(this).children("select");
              $(select_hijo).removeClass('select_success');
              $(select_hijo).removeClass('select_error');

              if(estatus==1){
                $(select_hijo).addClass('select_success');
              }
              else if (estatus==0) {
                $(select_hijo).addClass('select_error');
              }
            }
          });
        }
      });
  }// colorea_select()


  this.get_img_semaforo_tlc = function(idexpediente,nivel,index_tlc,continuar){
    idexpediente = (es_supervision)?idexpediente+"_2":idexpediente;
      var img = (nivel==1)?"sem_rojo.png":((nivel==2)?"sem_amarillo.png":"sem_verde.png");
      // string_img = "<img src='../../assets/images/"+img+"' width='30' height='30'>";
      string_img = "<img src='"+base_url+"assets/images/"+img+"' width='30' height='30'>";
      $("#sg-table tbody tr").each(function() {
        var id_row = $(this).attr("id");
        if(idexpediente==id_row){
          $(this).children("td").each(function (index)
          {
              switch (index)
              {
                case index_tlc:
                    $(this).empty();
                    if(continuar=="si"){
                      $(this).html(string_img);
                    }
                break;
              }
          });
        }
      });
  }// get_img_semaforo_tlc()

  this.set_pts_tl = function(idexpediente, total_pts, continuar){
    idexpediente = (es_supervision)?idexpediente+"_2":idexpediente;
      $("#sg-table tbody tr").each(function() {
        var id_row = $(this).attr("id");
        if(idexpediente==id_row){
          $(this).children("td").each(function (index)
          {
              switch (index)
              {
                case 9:
                    $(this).empty();
                    if(continuar=="si"){
                      $(this).html(total_pts);
                    }
                break;
              }
          });
        }
      });
  }// set_pts_tl()

  this.set_pts_1v_calculo = function(idexpediente, total_pts, total_iv,continuar){
    idexpediente = (es_supervision)?idexpediente+"_2":idexpediente;
      $("#sg-table tbody tr").each(function() {
        var id_row = $(this).attr("id");
        if(idexpediente==id_row){
          $(this).children("td").each(function (index)
          {
              switch (index)
              {
                case 13:
                    $(this).empty();
                    if(continuar=="si"){
                      $(this).html(total_pts);
                    }
                break;
                case 14:
                    $(this).empty();
                    if(continuar=="si"){
                      $(this).html(total_iv);
                    }
                break;
              }
          });
        }
      });
  }// set_pts_1v_calculo()

  this.set_comentario_usuario = function(){
    var id_grupo = $("#txt_sisat_grupo").val();
    var texto = $("#comentario_prf").val();
    $.ajax({
      url: base_url+"index.php/Sisat/set_comentario_usuario",
      data:{"id_grupo":id_grupo, "texto":texto},
      type:'POST',
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success: function(result){
        $("#wait").modal("hide");
        var result = JSON.parse(result);
        var arr_partes = result.split("_");
        var mensaje_accion = (arr_partes[0] == "update")?"Nota actualizada":"Nota creada";
        var mensaje_respuesta = (arr_partes[1] == 1 || arr_partes[1] == "1")?"correctamente":"incorrectamente";
        obj_notification.success(mensaje_accion + " " + mensaje_respuesta);
      },
      error:function(xhr){
        $("#wait").modal("hide");
        console.error(xhr.status + ": " + xhr.responseText);
      }
    });
  }// set_comentario_usuario()


  this.set_comentario_supervisor = function(){
    var idcfg = $("#sel_grupos_supervisor_sisat").val();
    var id_grupo = $("#txt_sisat_grupo").val();
    var texto = $("#comentario_sup").val();
    $.ajax({
      url: base_url+"index.php/Sisat/set_comentario_supervisor",
      data:{"id_grupo":id_grupo, "texto":texto, "idcfg": idcfg},
      type:'POST',
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success: function(result){
        $("#wait").modal("hide");
        var result = JSON.parse(result);
        var arr_partes = result.split("_");
        var mensaje_accion = (arr_partes[0] == "update")?"Nota actualizada":"Nota creada";
        var mensaje_respuesta = (arr_partes[1] == 1 || arr_partes[1] == "1")?"correctamente":"incorrectamente";
        obj_notification.success(mensaje_accion + " " + mensaje_respuesta);
      },
      error:function(xhr){
        $("#wait").modal("hide");
        console.error(xhr.status + ": " + xhr.responseText);
      }
    });
  }// set_comentario_usuario()

  this.get_form_redirect = function(){
    $.ajax({
      url: base_url+"index.php/Sisat/get_form_redirect",
      data:{},
      type:'POST',
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success: function(result){
        $("#wait").modal("hide");
        $("#sel_grupos_supervisor_sisat").empty();
        $("#sel_grupos_supervisor_sisat").append(result.select_escuelas);

        $("#txt_sisat_grupo").empty();

        $("#txt_sisat_exploracion").empty();
        $("#txt_sisat_exploracion").append(result.select_exploracion);

        $("#itext_redirect").val(0);
      },
      error:function(xhr){
        $("#wait").modal("hide");
        console.error(xhr.status + ": " + xhr.responseText);
      }
    });
  }// get_form_redirect()
  
}// Sisat()
