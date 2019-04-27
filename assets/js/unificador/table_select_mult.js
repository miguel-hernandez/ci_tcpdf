function GridMultiselect(idtable){
  document.onselectstart = function() {
      return false;
  }
  var _this = this;
  var lastSelectedRow;
  this.table = idtable;
  this.trs = document.getElementById(this.table).tBodies[0].getElementsByTagName('tr');

  this.getObjeto = function(){
    return _this;
  }
};

GridMultiselect.getObjeto = function(){
    return this._this;
}

// GridMultiselect.OBJETO = 

GridMultiselect.prototype.addRowHandlers =function(idtable) {
  var rows = document.getElementById(idtable).rows; 
  for (i = 1; i < rows.length; i++) { 
    rows[i].onclick = this.asigna_funcionalidad;
  } 
}

GridMultiselect.prototype.asigna_funcionalidad = function(){
  // console.log(GridMultiselect);
  Obj_table.RowClick(this, false);
}

GridMultiselect.prototype.RowClick = function(currenttr, lock){
  if (window.event.ctrlKey) {
        this.toggleRow(currenttr);
    }

    if (window.event.button === 0) {
        if (!window.event.ctrlKey && !window.event.shiftKey) {
          
            this.clearAll();
            this.toggleRow(currenttr);
        }

        if (window.event.shiftKey) {
          // console.log(this);
            this.selectRowsBetweenIndexes([lastSelectedRow.rowIndex, currenttr.rowIndex])
        }
    }
}


GridMultiselect.prototype.toggleRow = function(row){
  row.className = row.className == 'selected' ? '' : 'selected';
  lastSelectedRow = row;
}


GridMultiselect.prototype.selectRowsBetweenIndexes = function(indexes){
    indexes.sort(function(a, b) {
        return a - b;
    });

    for (var i = indexes[0]; i <= indexes[1]; i++) {
        this.trs[i-1].className = 'selected';
    }
}

GridMultiselect.prototype.clearAll = function(){
  for (var i = 0; i < this.trs.length; i++) {
        this.trs[i].className = '';
    }
}

GridMultiselect.prototype.getrows = function(idtable){
  var matriz=new Array();
  var valores = "";
  $("table#"+idtable+" tr.selected").each(function(){
    var fila = new Array();
        $(this).find("td").each(function() {
          fila.push($(this).html());
          });
    matriz.push(fila);
  });
  return matriz;
}

GridMultiselect.prototype.getidsrowsselected = function(idtable){
  // var matriz=new Array();
  // var valores = "";
  // $("table#"+idtable+" tr.selected").each(function(){
  //   var fila = new Array();
  //       $(this).find("td").each(function() {
  //         fila.push($(this).html());
  //         });
  //   matriz.push(fila);
  // });
  // return matriz;
}