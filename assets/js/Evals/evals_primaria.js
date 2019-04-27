/**
 * Created by Nelson Moreno on 19/06/2017.
 */
$(document).ready(function() {

    $(document).on('change','#alumno',function(e){

        var base_url_    = $('#alumno option:selected').data('url');

        //alert(base_url);

        window.location.replace(base_url_+'/'+$('#bimestre').val());
    });

    $(document).on('keypress','._eval_materia',function(e) {

        delete_all_caution($(this));

        if(e.which == 13 && !$(this).prop('disabled')) {

            data_array={
                'item'           : $(this).val(),
                'idct'           : $('#idct').val(),
                'grupo'          : $('#grupo').val(),
                'idexpediente'   : $('#expediente').val(),
                'alumno'         : $('#alumno').val(),
                'materia'        : $(this).data('materia'),
                'bimestre'       : $(this).data('bimestre'),
                'tipo'           : $(this).data('tipo_data'),
                'tipo_eval'      : 'materia'
            };
            e.preventDefault();
            //evita que se ejecute 2 veces el evento
            e.stopImmediatePropagation();

            //alert(data_array['item'])
            if(add_update_data($(this),data_array)){

            }

            /*nos movemos al siguiente*/

            var $next = $('[tabIndex=' + ($(this).prop('tabIndex') + 1) + ']');
            //console.log($next.length);
            if (!$next.length) {
                $next = $('[tabIndex=1]');
            }
            $next.focus();

        }
    });

    $(document).on('keypress','._eval_alumno',function(e) {

        delete_all_caution($(this));

        if(e.which == 13 && !$(this).prop('disabled')) {

            data_array={
                'item'           : $(this).val(),
                'idct'           : $('#idct').val(),
                'grupo'          : $('#grupo').val(),
                'idexpediente'   : $(this).data('expediente'),
                'alumno'         : $(this).data('alumno'),
                'materia'        : $('#materia').val(),
                'bimestre'       : $(this).data('bimestre'),
                'tipo'           : $(this).data('tipo_data'),
                'tipo_eval'      : 'alumno'
            };
            //alert(data_array['item'])

            e.preventDefault();
            //evita que se ejecute 2 veces el evento
            e.stopImmediatePropagation();
            if(add_update_data($(this),data_array)){

            }
            /*nos movemos al siguiente*/

            var $next = $('[tabIndex=' + ($(this).prop('tabIndex') + 1) + ']');
            //console.log($next.length);
            if (!$next.length) {
                $next = $('[tabIndex=1]');
            }
            $next.focus();

        }
    });

    $(document).on('click','._reprobacion_alumno',function(e) {

        delete_all_caution($(this));
        valor_check = $(this).prop('checked') ? 1 : 0;

        data_array={
            'item'           : valor_check,
            'idct'           : $('#idct').val(),
            'grupo'          : $('#grupo').val(),
            'idexpediente'   : $(this).data('expediente'),
            'alumno'         : $(this).data('alumno'),
            'materia'        : $('#materia').val(),
            'bimestre'       : $(this).data('bimestre'),
            'tipo'           : $(this).data('tipo_data'),
            'tipo_eval'      : 'alumno'
        };

        if(add_update_data($(this),data_array)){

        }

        /*nos movemos al siguiente*/
        e.preventDefault();
        var $next = $('[tabIndex=' + ($(this).prop('tabIndex') + 1) + ']');
        //console.log($next.length);
        if (!$next.length) {
            $next = $('[tabIndex=1]');
        }
        $next.focus();


    });

    $(document).on('click','._reprobacion_materia',function(e) {

        delete_all_caution($(this));
        valor_check = $(this).prop('checked') ? 1 : 0;

        data_array={
            'item'           : valor_check,
            'idct'           : $('#idct').val(),
            'grupo'          : $('#grupo').val(),
            'idexpediente'   : $('#expediente').val(),
            'alumno'         : $('#alumno').val(),
            'materia'        : $(this).data('materia'),
            'bimestre'       : $(this).data('bimestre'),
            'tipo'           : $(this).data('tipo_data'),
            'tipo_eval'      : 'materia'
        };

        if(add_update_data($(this),data_array)){

        }

        /*nos movemos al siguiente*/
        e.preventDefault();
        var $next = $('[tabIndex=' + ($(this).prop('tabIndex') + 1) + ']');
        //console.log($next.length);
        if (!$next.length) {
            $next = $('[tabIndex=1]');
        }
        $next.focus();


    });

    function delete_all_caution(elemento){
        var clases_existentes='text-success text-fail';

        elemento.prop('title','');
        elemento.removeClass( clases_existentes );

    }

    function add_update_data(item,data_array){

        //obtener las clases que ya estan fijadas ya que despues(cuando regresa del server) se pierde el $(this)
        clases_existentes 	=	item.prop('class');
        //tambien guardamos el id
        id_item=(item.prop('id'));
        $(".mensaje-error").remove();
        //alert(data_array['item']);
        $.ajax({
            type:"POST",
            url: base_url + "add_update_eval",
            dataType: 'json',
            data:{
                'item'           : data_array['item'] ,
                'idct'           : data_array['idct'] ,
                'grupo'          : data_array['grupo'] ,
                'idexpediente'   : data_array['idexpediente'] , //$('#expediente').val(),
                'alumno'         : data_array['alumno'] ,
                'materia'        : data_array['materia'] , //item.data('materia'),
                'bimestre'       : data_array['bimestre'] , //item.data('bimestre'),
                'tipo'           : data_array['tipo']  //tipo
            },
            success:function(data){
                //alert(data);
                if(data == 'REDIRECT'){
                    alert("Su sesion ha expirado ... ingrese de nuevo.");
                    parent.location=base_url;
                }else{

                    //alert(data.result);
                    if(data.result == 'success') {

                        if (data_array['tipo'] == 1) {

                            $( '#promedio_' + data_array[ data_array['tipo_eval'] ] ).html(data.promedio);

                        }else if(data_array['tipo'] == 2) {

                            $('#' + id_item).prop('checked', data_array['item']);

                        }else{
                            $( '#inasistencias_' + data_array[ data_array['tipo_eval'] ] ).html(data.inasistencias);
                        }

                        $('#' + id_item).prop('title','Se grabó correctamente')
                        clases_existentes = clases_existentes + " text-success";
                        $('#' + id_item).addClass(clases_existentes);

                        return true;

                    }else{

                        /*nos movemos al anterior*/
                        var $prev = $('[tabIndex=' + ($('#' + id_item).prop('tabIndex')) + ']');
                        //console.log($next.length);

                        $prev.focus();
                        pos_right =  $('#' + id_item).css('right');
                        $('#' + id_item).val('');
                        $('#' + id_item).prop('title', remove_htmlEntities(data.result));
                        $('#' + id_item).parent().append("<div id='td_"+id_item+"' class='mensaje-error' style='color: #FFF;position:absolute; bottom:-42px; height:50px; z-index:0;'><span class='label label-danger'>"+remove_htmlEntities(data.result)+"</span></div>");
                        clases_existentes = clases_existentes + " text-fail";
                        $('#' + id_item).addClass(clases_existentes);

                        return false;
                    }

                }
            },
            error:function(jqXhr){
                if(jqXhr.responseText == "REDIRECT"){
                    alert("Su sesion ha expirado ... ingrese de nuevo.");
                    parent.location=base_url;
                }else{
                    alert (jqXhr.responseText);
                    $("#wait").modal("hide");}
            }
        });


    }

    $(document).on('click','.tools',function(e) {
        var forma = $("#frm_herramientas").serialize();
        e.preventDefault();
        //evita que se ejecute 2 veces el evento
        e.stopImmediatePropagation();

        $.ajax({
            type:"POST",
            url: base_url + "tools_upd",
            dataType: 'json',
            data:forma,
            beforeSend: function () {
                $("#wait").modal("show");

            },
            complete: function () {
                $("#wait").modal("hide");
            },
            success:function(data){
                $("#wait").modal("hide");
                if(data == 'REDIRECT'){
                    alert("Su sesion ha expirado ... ingrese de nuevo.");
                    parent.location=base_url;
                }else if(data.error !=""){
                    alert(data.error);
                }else{
                    alert(data.result);
                }
            },
            error:function(jqXhr){
                $("#wait").modal("hide");
                if(jqXhr.responseText == "REDIRECT"){
                    alert("Su sesion ha expirado ... ingrese de nuevo.");
                    parent.location=base_url;
                }else {
                    alert(jqXhr.responseText);
                }
            }
        });
    });

    $(document).on('click','._get_apoyo',function(e) {
        var forma = $("#frm_apoyos").serialize();

        e.preventDefault();
        //evita que se ejecute 2 veces el evento
        e.stopImmediatePropagation();

        $.ajax({
            type:"POST",
            url: base_url + "get_apoyo",
            dataType: 'json',
            data:forma,
            beforeSend: function () {
                $("#wait").modal("show");

            },
            complete: function () {
                $("#wait").modal("hide");
            },
            success:function(data){
                //alert(data.toSource());
                if(data == 'REDIRECT'){
                    alert("Su sesion ha expirado ... ingrese de nuevo.");
                    parent.location=base_url;
                }else if(data.error!=""){
                    $("#wait").modal("hide");
                    alert(remove_htmlEntities(data.error));
                }else{
                    $('#contenedor').html(data.result);
                }
            },
            error:function(jqXhr){
                $("#wait").modal("hide");
                if(jqXhr.responseText == "REDIRECT"){
                    alert("Su sesion ha expirado ... ingrese de nuevo.");
                    parent.location=base_url;
                }else {
                    alert(jqXhr.responseText);
                }
            }
        });
    });

    $(document).on('click','._add_apoyo',function(e) {
        var forma = $("#frm_apoyos").serialize();

        e.preventDefault();
        //evita que se ejecute 2 veces el evento
        e.stopImmediatePropagation();

        $.ajax({
            type:"POST",
            url: base_url + "add_apoyo",
            dataType: 'json',
            data:forma,
            beforeSend: function () {
                $("#wait").modal("show");

            },
            complete: function () {
                $("#wait").modal("hide");
            },
            success:function(data){
                //alert(data.toSource());

                if(data == 'REDIRECT'){
                    alert("Su sesion ha expirado ... ingrese de nuevo.");
                    parent.location=base_url;
                }else if(data.error!=""){
                    $("#wait").modal("hide");
                    alert(remove_htmlEntities(data.error));
                }else{
                    $('#tbl_body_apoyos').html(data.result);
                }
            },
            error:function(jqXhr){
                $("#wait").modal("hide");
                if(jqXhr.responseText == "REDIRECT"){
                    alert("Su sesion ha expirado ... ingrese de nuevo.");
                    parent.location=base_url;
                }else {
                    alert(jqXhr.responseText);
                }
            }
        });
    });

    $(document).on('click','._upd_apoyo',function(e) {
        var forma = $("#frm_apoyos").serialize();

        e.preventDefault();
        //evita que se ejecute 2 veces el evento
        e.stopImmediatePropagation();

        $.ajax({
            type:"POST",
            url: base_url + "upd_apoyo",
            dataType: 'json',
            data:forma,
            beforeSend: function () {
                $("#wait").modal("show");

            },
            complete: function () {
                $("#wait").modal("hide");
            },
            success:function(data){
                //alert(data.toSource());

                if(data == 'REDIRECT'){
                    alert("Su sesion ha expirado ... ingrese de nuevo.");
                    parent.location=base_url;
                }else if(data.error!=""){
                    $("#wait").modal("hide");
                    alert(remove_htmlEntities(data.error));
                }else{
                    $(".hide_modif").click();
                    $('#tbl_body_apoyos').html(data.result);
                }
            },
            error:function(jqXhr){
                $("#wait").modal("hide");
                if(jqXhr.responseText == "REDIRECT"){
                    alert("Su sesion ha expirado ... ingrese de nuevo.");
                    parent.location=base_url;
                }else {
                    alert(jqXhr.responseText);
                }
            }
        });
    });

    $(document).on('click','._delete_apoyo',function(e) {

        e.preventDefault();
        //evita que se ejecute 2 veces el evento
        e.stopImmediatePropagation();

        $.ajax({
            type:"POST",
            url: base_url + "del_apoyo",
            dataType: 'json',
            data: {
                apoyo: $(this).data('apoyo'),
                idexpediente: $(this).data('idexpediente')
                },
            beforeSend: function () {
                $("#wait").modal("show");

            },
            complete: function () {
                $("#wait").modal("hide");
            },
            success:function(data){
                //alert(data.toSource());

                if(data == 'REDIRECT'){
                    alert("Su sesion ha expirado ... ingrese de nuevo.");
                    parent.location=base_url;
                }else if(data.error!=""){
                    $("#wait").modal("hide");
                    alert(remove_htmlEntities(data.error));
                }else{
                    $('#tbl_body_apoyos').html(data.result);
                }
            },
            error:function(jqXhr){
                $("#wait").modal("hide");
                if(jqXhr.responseText == "REDIRECT"){
                    alert("Su sesion ha expirado ... ingrese de nuevo.");
                    parent.location=base_url;
                }else {
                    alert(jqXhr.responseText);
                }
            }
        });

    });

    $(document).on('click','._get_adicionales',function(e) {
        var forma = $("#frm_adicionales").serialize();

        e.preventDefault();
        //evita que se ejecute 2 veces el evento
        e.stopImmediatePropagation();

        $.ajax({
            type:"POST",
            url: base_url + "get_adicionales",
            dataType: 'json',
            data:forma,
            beforeSend: function () {
                $("#wait").modal("show");

            },
            complete: function () {
                $("#wait").modal("hide");
            },
            success:function(data){
                //alert(data.toSource());

                if(data == 'REDIRECT'){
                    alert("Su sesion ha expirado ... ingrese de nuevo.");
                    parent.location=base_url;
                }else if(data.error!=""){
                    $("#wait").modal("hide");
                    alert(remove_htmlEntities(data.error));
                }else{
                    $('#contenedor_adicionales').html(data.result);
                }
            },
            error:function(jqXhr){
                $("#wait").modal("hide");
                if(jqXhr.responseText == "REDIRECT"){
                    alert("Su sesion ha expirado ... ingrese de nuevo.");
                    parent.location=base_url;
                }else {
                    alert(jqXhr.responseText);
                }
            }
        });
    });

    $(document).on('click','._upd_adicionales',function(e) {
        var forma = $("#frm_adicionales").serialize();

        e.preventDefault();
        //evita que se ejecute 2 veces el evento
        e.stopImmediatePropagation();

        $.ajax({
            type:"POST",
            url: base_url + "upd_adicionales",
            dataType: 'json',
            data:forma,
            beforeSend: function () {
                $("#wait").modal("show");

            },
            complete: function () {
                $("#wait").modal("hide");
            },
            success:function(data){
                //alert(data.toSource());

                if(data == 'REDIRECT'){
                    alert("Su sesion ha expirado ... ingrese de nuevo.");
                    parent.location=base_url;
                }else if(data.error!=""){
                    $("#wait").modal("hide");
                    alert(remove_htmlEntities(data.error));
                }else{
                    alert(remove_htmlEntities(data.result));
                }
            },
            error:function(jqXhr){
                $("#wait").modal("hide");
                if(jqXhr.responseText == "REDIRECT"){
                    alert("Su sesion ha expirado ... ingrese de nuevo.");
                    parent.location=base_url;
                }else {
                    alert(jqXhr.responseText);
                }
            }
        });
    });

    $(document).on('click','.show_modif',function(e) {
        e.preventDefault();
        //evita que se ejecute 2 veces el evento
        e.stopImmediatePropagation();

        apoyo= $(this).data('apoyo');
        observacion = $('#td_apoyo_obsv'+apoyo).html();
        $('#apoyo').val(apoyo);
        $('#observacion').val(observacion);
        $('._add_apoyo').hide();
        $('._upd_apoyo').show();
        $('.hide_modif').show();

    });

    $(document).on('click','.hide_modif',function(e) {
        e.preventDefault();
        //evita que se ejecute 2 veces el evento
        e.stopImmediatePropagation();

        $('#apoyo').val('');
        $('#observacion').val('');
        $('._add_apoyo').show();
        $('._upd_apoyo').hide();
        $('.hide_modif').hide();

    });

});

function remove_htmlEntities(str) {
    return String(str).replace('<p>','').replace('</p>','').replace(/&/g, '').replace(/<p/g, '').replace(/p>/g, '').replace(/"/g, '');
}

function replace_htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}