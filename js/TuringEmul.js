'use strict';

//  Por si el navegador no tiene la función trim 
//if(typeof String.prototype.trim !== 'function') {
//    String.prototype.trim = function() {
//        return this.replace(/^\s+|\s+$/g, ''); 
//    }
//}

var tm_actual = TM_Ejemplo();
var editor = CodeMirror.fromTextArea(document.getElementById("code"), 
    {   
    mode: "javascript",
    styleActiveLine: true,
    lineNumbers: true,
    gutters: ["CodeMirror-linenumbers", "breakpoints"],
    extraKeys: {"Alt-F": "findPersistent"}
    }
);

editor.on("gutterClick", function(cm, n) {
    var info = cm.lineInfo(n);
    cm.setGutterMarker(n, "breakpoints", info.gutterMarkers ? null : makeMarker());
  });
  
function makeMarker() {
    var marker = document.createElement("div");
    marker.style.color = "rgb(39, 179, 69)";
    marker.innerHTML = "●";
    return marker;
}
  
function publicarTM(tm){
    // TODO 
    // Debería provenir de la clase TM con un HTML preformateado listo para salir a la página web
    document.getElementById("TCinta").innerHTML = tm.cintaHtml();
    document.getElementById("TEstado").innerText = tm.estado;
    document.getElementById("TParada").innerText = tm.parada;
    document.getElementById("TPos").innerText = tm.posCabeza;
    document.getElementById("TLinea").innerText = tm.lineaEjec;
    editor.setValue(tm.code);
    if (!tm.parada) 
        ponerBackground(tm.lineaEjec);

    // Publico en los campos de edición
    document.getElementById("TCintaEdit").value = tm.cinta;
    document.getElementById("TEstadoEdit").value = tm.estado;
    document.getElementById("TPosEdit").value = tm.posCabeza;
}

function publicarTMsinCodigo(tm){
    // TODO 
    // Debería provenir de la clase TM con un HTML preformateado listo para salir a la página web
    document.getElementById("TCinta").innerHTML = tm.cintaHtml();
    document.getElementById("TEstado").innerText = tm.estado;
    document.getElementById("TParada").innerText = tm.parada;
    document.getElementById("TPos").innerText = tm.posCabeza;
    document.getElementById("TLinea").innerText = tm.lineaEjec;
    //editor.setValue(tm.code);
    if (!tm.parada) 
        ponerBackground(tm.lineaEjec);

    // Publico en los campos de edición
    document.getElementById("TCintaEdit").value = tm.cinta;
    document.getElementById("TEstadoEdit").value = tm.estado;
    document.getElementById("TPosEdit").value = tm.posCabeza;
}

function capturarTM(tm){
    tm.cinta = document.getElementById("TCintaEdit").value ;
    tm.estado = document.getElementById("TEstadoEdit").value;
    tm.posCabeza = parseInt( document.getElementById("TPosEdit").value );
    tm.code = editor.getValue();
}

function carga(){
    tm_actual = TM_Ejemplo();
    publicarTM(tm_actual);
    console.log(""+tm_actual);
}

function run(){
    capturarTM(tm_actual);
    quitarBackground();
    var seEjecuto = tm_actual.ejecUnaVez();
    publicarTMsinCodigo(tm_actual);
}

function marcar(linea){
    editor.markText({line: linea, ch: 0}, {line: linea, ch: 100}, {className: "styled-background"});
}

function ponerBackground(lineNumber) {
    var editorC = editor.CodeMirror;
    //Set line css class
    editor.addLineClass(lineNumber, 'background', 'TLineaActual');
}

function quitarBackground(){
    var docEditor = editor.getDoc();
    var noMaxLineas = docEditor.lineCount();
    for (var i = 0; i < noMaxLineas; ++i){
        var infoLinea = docEditor.lineInfo(i);
        if (infoLinea.bgClass === undefined) continue;
        if (infoLinea.bgClass == null) continue;
        if (infoLinea.bgClass.includes('TLineaActual')){
            docEditor.removeLineClass(i,'background','TLineaActual');
            break;
        }
    }
}