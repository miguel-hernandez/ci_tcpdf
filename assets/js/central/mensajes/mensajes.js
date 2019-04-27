$(document).ready(function () {
  var params_datetimepicker = {
    format: 'dd-mm-yyyy',
    maxView: 4,
    minView: 2,
    todayBtn: true,
    todayHighlight: false,
    initialDate: new Date(),
    language: 'es',
    autoclose: true
  };

  $("#in_inicia_central").datetimepicker(params_datetimepicker);
  $("#in_expira_central").datetimepicker(params_datetimepicker);
});
