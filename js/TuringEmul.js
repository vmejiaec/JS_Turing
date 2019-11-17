'use strict';

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
    document.getElementById("TCinta").innerHTML = tm.cintaHtml();
    document.getElementById("TEstado").innerText = tm.estado;
    editor.setValue(tm.code);
}

function capturarTM(tm){
    tm.cinta = document.getElementById("TCinta").innerText ;
    tm.estado = document.getElementById("TEstado").innerText;
    tm.code = editor.getValue();
}

function carga(){
    tm_actual = TM_Ejemplo();
    publicarTM(tm_actual);
    console.log(""+tm_actual);
}

function run(){
    capturarTM(tm_actual);
    tm_actual.ejecUnaVez();
    publicarTM(tm_actual);
}

function marcar(linea){
    editor.markText({line: linea, ch: 1}, {line: linea, ch: 100}, {className: "styled-background"});
}