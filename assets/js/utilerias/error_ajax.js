var Error_ajax = {
  get_error : function(xhr){
    if (xhr.status === 0) {
      alert('Not connect: Verify Network.');
    } else if (xhr.status == 404) {
      alert('Requested page not found [404]');
    } else if (xhr.status == 500) {
      alert('Internal Server Error [500].');
    } else {
      alert('Uncaught Error: ' + xhr.responseText);
    }
    console.error(xhr);
  }
};
