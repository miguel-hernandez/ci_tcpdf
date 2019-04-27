function accesoTutor(){
  // alert('Entró a la funcion');

  let acceso = (document.getElementById('acceso_tutor').value).trim();

  let curp = acceso.toUpperCase();
  let nia = parseInt(acceso);

  let re_curp = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\-\d])(\d)$/;

  let re_nia = /^([0-9])*$/;

  let valida_curp = curp.match(re_curp);
  let valida_nia = acceso.match(re_nia);

  if (acceso == "") {
    Helpers.alert('Por favor ingrese CURP o NIA de su hija o hijo', 'error');
  } else {
    if (!valida_curp) {
      if (!valida_nia) {
        Helpers.alert('Formato de CURP o NIA no validos, por favor verifque sus datos', 'error');
      } else {
          let redirige = base_url + '/Tutor/consulta/'+nia
          window.location.href = redirige;
        } // NIA
    } else {
        let redirige = base_url + '/Tutor/consulta/'+curp
        window.location.href = redirige;
      } /// CURP
  }
} // accesoTutor
