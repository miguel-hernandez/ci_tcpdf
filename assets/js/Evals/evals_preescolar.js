$(document).ready(function() {

    $(document).on('change','#campoF',function(e){
        $('#txtNov').val('');
        $('#txtMar').val('');
        $('#txtJul').val('');

        $('#desempenio_noviembre').val('');
        $('#desempenio_marzo').val('');
        $('#desempenio_julio').val('');

        $('#inasist_noviembre').val('');
        $('#inasist_marzo').val('');
        $('#inasist_julio').val('');
    });

    function init_contadorTa(idtextarea, idcontador,max)
    {
        $("#"+idtextarea).keyup(function()
        {
            updateContadorTa(idtextarea, idcontador,max);
        });

        $("#"+idtextarea).change(function()
        {
            updateContadorTa(idtextarea, idcontador,max);
        });

    }

    function updateContadorTa(idtextarea, idcontador,max)
    {
        var contador = $("#"+idcontador);
        var ta =     $("#"+idtextarea);
        contador.html("0/"+max);

        contador.html(ta.val().length+"/"+max);
        if(parseInt(ta.val().length)>max)
        {
            ta.val(ta.val().substring(0,max));
            contador.html(max+"/"+max);
        }

    }
    init_contadorTa("txtNov","contTaComent_Nov", 250);
    init_contadorTa("txtMar","contTaComent_Mar", 250);
    init_contadorTa("txtJul","contTaComent_Jul", 250);
});