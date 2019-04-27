/**
 * Created by aarón on 10/03/17.
 */

    //script from Mistonline.in (Please dont remove this line)
function password(length) {
    var iteration = 0;
    var password = "";
    var randomNumber;
    while(iteration < length){
        randomNumber = (Math.floor((Math.random() * 100)) % 94) + 33;
        if ((randomNumber >=33) && (randomNumber <= 47)) { continue; }
        if ((randomNumber >=58) && (randomNumber <= 64)) { continue; }
        if ((randomNumber >=91) && (randomNumber <= 96)) { continue; }
        if ((randomNumber >=123) && (randomNumber <= 126)) { continue; }
        iteration++;
        password += String.fromCharCode(randomNumber);
    }
    return password;
}

$(document).ready(function(){
    $("#selecciona-todos").click(function(){
        var checkBoxes = $('.grupo');
        checkBoxes.attr("checked", !checkBoxes.prop("checked"));

        var span_txt = $("#txt-selecciona");
        var txt = !checkBoxes.prop("checked") ? "Selecciona todos" : "Deselecciona todos";
        span_txt.text(txt);
    });

    $("#genera-contrasena").click(function(){
        $("#contrasena").val(password(10));
    });
});