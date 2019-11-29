"use strict";

//  Por si el navegador no tiene la función trim
//if(typeof String.prototype.trim !== 'function') {
//    String.prototype.trim = function() {
//        return this.replace(/^\s+|\s+$/g, '');
//    }
//}

// Para manejar el timer que ejecuta repetidamente la MT.
var hRunTimer = null;

var tm_actual = TM_Ejemplo();
var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  mode: "javascript",
  styleActiveLine: true,
  lineNumbers: true,
  gutters: ["CodeMirror-linenumbers", "breakpoints"],
  extraKeys: { "Alt-F": "findPersistent" }
});

editor.on("gutterClick", function(cm, n) {
  var info = cm.lineInfo(n);
  cm.setGutterMarker(
    n,
    "breakpoints",
    info.gutterMarkers ? null : makeMarker()
  );
});

function makeMarker() {
  var marker = document.createElement("div");
  marker.style.color = "rgb(39, 179, 69)";
  marker.innerHTML = "●-";
  return marker;
}

function publicarTM(tm) {
  // TODO
  // Debería provenir de la clase TM con un HTML preformateado listo para salir a la página web
  document.getElementById("TId").value = tm.id;
  document.getElementById("TCinta").innerHTML = tm.cintaHtml();
  document.getElementById("TEstado").innerText = tm.estado;
  document.getElementById("TParada").innerText = tm.parada;
  document.getElementById("TPos").innerText = tm.posCabeza;
  document.getElementById("TLinea").innerText = tm.lineaEjec;
  editor.setValue(tm.code);
  if (!tm.parada) {
    quitarBackground();
    ponerBackground(tm.lineaEjec);
  }

  // Publico en los campos de edición
  document.getElementById("TCintaEdit").value = tm.cinta;
  document.getElementById("TEstadoEdit").value = tm.estado;
  document.getElementById("TPosEdit").value = tm.posCabeza;
}

function publicarTMsinCodigo(tm) {
  // TODO
  // Debería provenir de la clase TM con un HTML preformateado listo para salir a la página web
  document.getElementById("TId").value = tm.id;
  document.getElementById("TCinta").innerHTML = tm.cintaHtml();
  document.getElementById("TEstado").innerText = tm.estado;
  document.getElementById("TParada").innerText = tm.parada;
  document.getElementById("TPos").innerText = tm.posCabeza;
  document.getElementById("TLinea").innerText = tm.lineaEjec;
  //editor.setValue(tm.code);
  if (!tm.parada) {
    quitarBackground();
    ponerBackground(tm.lineaEjec);
  }

  // Publico en los campos de edición
  document.getElementById("TCintaEdit").value = tm.cinta;
  document.getElementById("TEstadoEdit").value = tm.estado;
  document.getElementById("TPosEdit").value = tm.posCabeza;
}

function capturarTM(tm) {
  tm.id = document.getElementById("TId").value;
  tm.cinta = document.getElementById("TCintaEdit").value;
  tm.estado = document.getElementById("TEstadoEdit").value;
  tm.posCabeza = parseInt(document.getElementById("TPosEdit").value);
  tm.code = editor.getValue();
}

function carga() {
  tm_actual = TM_Ejemplo();
  publicarTM(tm_actual);
  publicarMensaje("Cargando una máquina de Turing de prueba.");
  console.log("" + tm_actual);
  var jsonTM = JSON.stringify(tm_actual);
  console.log("JSON: " + jsonTM);
}

function apiGET_TM_Web() {
  var request = new XMLHttpRequest();
  request.open("GET", "http://localhost:3000/TM_maquinas");
  request.onload = function() {
    var listaMT = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
      listaMT.forEach(tmObj => {
        var tm = new TMachine(
          tmObj.id,
          tmObj.cinta,
          tmObj.posCabeza,
          tmObj.estado,
          tmObj.code
        );
        console.log("-- " + tm.toString());
      });
    } else {
      console.log("Error del API REST de las máquinas de Turing");
    }
  };
  request.send();
}

function grabarTM_Web(){
    capturarTM(tm_actual);
    var url = 'http://localhost:3000/TM_maquinas';
    var dataJSON = JSON.stringify(tm_actual);
    fetch(url,{
        method: 'POST',
        body: dataJSON,
        headers: {'Content-Type':'application/json'}
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Exito: ',response));
}

function ejecutarUnaVez() {
  capturarTM(tm_actual);
  tm_actual.ejecUnaVez();
  publicarTMsinCodigo(tm_actual);
}

function ejecutarUnaVez_SinCaptura() {
  var seEjecuto = tm_actual.ejecUnaVez();
  publicarTMsinCodigo(tm_actual);
  return seEjecuto;
}

function RunButton() {
  capturarTM(tm_actual);
  publicarMensaje("Running...");
  habilitarControles(false, false, true, false);
  Run();
}

/* Run(): run the TM until it halts or until user interrupts it */
function Run() {
  if (ejecutarUnaVez_SinCaptura()) {
    hRunTimer = window.setTimeout(Run, 100);
  }
}

function StopButton() {
  if (hRunTimer != null) {
    publicarMensaje("Ejecución detenida por botón <Parar>.");
    habilitarControles(true, true, false, true);
    StopTimer();
  }
}

/* StopTimer(): Deactivate the run timer. */
function StopTimer() {
  if (hRunTimer != null) {
    window.clearInterval(hRunTimer);
    hRunTimer = null;
  }
}

// _______________________________________

function marcar(linea) {
  editor.markText(
    { line: linea, ch: 0 },
    { line: linea, ch: 100 },
    { className: "styled-background" }
  );
}

function ponerBackground(lineNumber) {
  var editorC = editor.CodeMirror;
  //Set line css class
  editor.addLineClass(lineNumber, "background", "TLineaActual");
}

function quitarBackground() {
  var docEditor = editor.getDoc();
  var noMaxLineas = docEditor.lineCount();
  for (var i = 0; i < noMaxLineas; ++i) {
    var infoLinea = docEditor.lineInfo(i);
    if (infoLinea.bgClass === undefined) continue;
    if (infoLinea.bgClass == null) continue;
    if (infoLinea.bgClass.includes("TLineaActual")) {
      docEditor.removeLineClass(i, "background", "TLineaActual");
      break;
    }
  }
}

function habilitarControles(bStep, bRun, bParar, bCargar) {
  document.getElementById("Step").disabled = !bStep;
  document.getElementById("Run").disabled = !bRun;
  document.getElementById("Parar").disabled = !bParar;
  document.getElementById("Cargar").disabled = !bCargar;
}

function publicarMensaje(mensaje) {
  document.getElementById("TMensaje").innerHTML = mensaje;
}
