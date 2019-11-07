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
    document.getElementById("TCinta").innerText = tm.cinta;
    document.getElementById("TEstado").innerText = tm.estado;
    editor.setValue(tm.code);
}

function carga(){
    tm_actual = TM_Ejemplo();
    publicarTM(tm_actual);
    console.log(""+tm_actual);
}

function run(){
    tm_actual.estado = "Corriendo";
    tm_actual.cinta = "00>1011";
    tm_actual.code = "Adivina que sigue???!!!";

    publicarTM(tm_actual);
}

function marcar(linea){
    editor.markText({line: linea, ch: 1}, {line: linea, ch: 100}, {className: "styled-background"});
}