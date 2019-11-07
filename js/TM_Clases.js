'use strict';

function TMachine (id, cinta, estado, code) {
    this.id         = id;
    this.cinta      = cinta;
    this.estado     = estado;
    this.code       = code;
    // guarda las condiciones iniciales
    this.estado_ini = estado;
    this.cinta_ini  = cinta;
    //
    this.cabPos     = 0;  // inicio de la cabeza
    this.lineaSig   = 1;  // la siguiente línea a ejecutarse
}

TMachine.prototype.toString = function tmToString() {
    var code_lineas = this.code.split("\n");
    var code_lineas_indentado ="";
    for (var i=0 ; i<code_lineas.length;i++){
        code_lineas_indentado += "\t" + code_lineas[i] + "\n";
    }
    var msg = 
              "Id: "        + this.id       + "\n" +
              "Cinta: "     + this.cinta    + "\n" +
              "Estado: "    + this.estado   + "\n" +
              "Código:"     + "\n" +
              code_lineas_indentado;
    return msg;
}