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
    this.lineaEjec  = -1;  // la siguiente línea a ejecutarse
    this.parada     = false; // registra la parada por falta de instrucciones
}

TMachine.prototype.celda = function(){
    return this.cinta.substring(this.posCabeza,this.posCabeza+1);
}

// Intenta ejecutar una vez la máquina de turing
TMachine.prototype.ejecUnaVez = function() {   
    var codeLineas = this.code.split('\n');   
    var encontrado = false;
    var instrucciones = '';
    var noLinea = -1;
    // Encuentra la instrucción a ejecutar.
    for (var i=0 ; i<codeLineas.length;i++){
        var linea = codeLineas[i];
        // Limpia la linea de espacios en blanco y tabuladores
        linea = linea.replace(/\t/g,' ');
        linea = linea.trim();
        linea = linea.trim().replace(/\s\s+/g, ' ');
        // Eliminamos cualquier texto que se encuentre luego de la marca para comentarios
        var posMarcaComentarios = linea.indexOf('//');
        if (posMarcaComentarios > -1){  
            linea = linea.substring(0,posMarcaComentarios);
        }
        // Si la linea está vacía salta la verificación
        if (linea == '') continue;
        // Separa las instrucciones que hay en la línea
        instrucciones = linea.split(' ');
        // Verifica que la línea cumpla con el formato Turing
        // TODO Estado Celda CeldaNew Mov EstadoNew
        // Verifica si el estado y la celda coinciden
        if (this.estado == instrucciones[0]) {
            if (this.celda() == instrucciones[1]) {
                encontrado = true;
                noLinea = i;
                break;
            }
        }
    }
    // Ejecuta la línea encontrada
    if (encontrado){
        this.lineaEjec = noLinea;
        this.estado = instrucciones[4];
        // Arma la cinta
        var cintaPre = this.cinta.substring(0,this.posCabeza);
        var cintaPos = this.cinta.substring(this.posCabeza+1,this.cinta.length);
        this.cinta = cintaPre + instrucciones[2] + cintaPos ;
        // Mueve la cabeza a la derecha R o a la izquierda L
        var pos = this.posCabeza;
        if (instrucciones[3]=='R' || instrucciones[3]=='r') 
            pos++;
        else 
            pos--;
        // Si se sale de los límites hay que añadir espacios a la cinta
        if (pos < 0) {
            this.cinta = '_' + this.cinta;
            pos = 0;
        }
        else if (pos > this.cinta.length-1){
            this.cinta = this.cinta + '_';
        }
        this.posCabeza = pos;
        // Todo OK
        return true;
    }
    else  // En caso de que la máquina de turing no encuentre una línea qué ejecutar
        this.parada = true;
        return false;
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