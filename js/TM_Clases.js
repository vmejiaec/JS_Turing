'use strict';

function TMachine (id, cinta, posCabeza, estado, code) {
    this.id         = id;
    this.cinta      = cinta;
    this.posCabeza  = posCabeza;
    this.estado     = estado;
    this.code       = code;
    // guarda las condiciones iniciales
    this.estado_ini = estado;
    this.cinta_ini  = cinta;
    //
    this.lineaEjec   = -1;  // la siguiente línea a ejecutarse
}

TMachine.prototype.ejecUnaVez = function() {
    var posCabezaActual = this.posCabeza;
    var celdaActual = this.cinta.substring(this.posCabeza,this.posCabeza+1);
    var estadoActual = this.estado;

    var codeLineas = this.code.split('\n');   
    var encontrado = false;
    var instrucciones = '';
    var noLineaEjec = null;

    // Encuentra la instrucción a ejecutar.
    for (var i=0 ; i<codeLineas.length;i++){
        instrucciones = codeLineas[i].split(' ');
        if (estadoActual == instrucciones[0]) {
            if (celdaActual == instrucciones[1]) {
                encontrado = true;
                noLineaEjec = i;
                break;
            }
        }
    }

    if (encontrado){
        this.estado = instrucciones[4];
        celdaNueva = instrucciones[2];
        
        var cintaPre = this.cinta.substring(0,this.posCabeza);
        var cintaPos = this.cinta.substring(this.posCabeza+1,this.cinta.length);
        this.cinta = cintaPre + celdaNueva + cintaPos ;

        // Mueve la cabeza a la derecha R o a la izquierda L
        var pos = this.posCabeza;
        if (instrucciones[3]=='R') 
            pos++;
        else 
            pos--;
        // TODO
        // Si se sale de los límites hay que añadir espacios a la cinta
        this.posCabeza = pos;
    }

}

TMachine.prototype.cintaHtml = function () {
    var divInicio = '<div class="TCabeza">';
    var divFin = '</div>';
    var cintaHtml = this.cinta.substring(0,this.posCabeza) + divInicio + 
                    this.cinta.substring(this.posCabeza,this.posCabeza+1) + divFin +
                    this.cinta.substring(this.posCabeza+1,this.cinta.length);
    return cintaHtml;
}

TMachine.prototype.toString = function () {
    var code_lineas = this.code.split("\n");
    var code_lineas_indentado ="";
    for (var i=0 ; i<code_lineas.length;i++){
        code_lineas_indentado += "\t" + code_lineas[i] + "\n";
    }
    var msg = 
              "Id: "        + this.id        + "\n" +
              "Cinta: "     + this.cinta     + "\n" +
              "Cabeza: "    + this.posCabeza + "\n" +
              "Estado: "    + this.estado    + "\n" +
              "Código:"     + "\n" +
              code_lineas_indentado;
    return msg;
}