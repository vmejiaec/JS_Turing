"use strict";

//  Por si el navegador no tiene la función trim
//if(typeof String.prototype.trim !== 'function') {
//    String.prototype.trim = function() {
//        return this.replace(/^\s+|\s+$/g, '');
//    }
//}

// Para manejar el timer que ejecuta repetidamente la MT.
var hRunTimer = null;

//var tm_actual = TM_Ejemplo();
var tm_actual ;

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

function carga(tmId) {
  // Busca la máquina con el id del parámetro
  apiGET_TM_ById(tmId);
}

function apiGET_TM_ById(tmId){
  var request = new XMLHttpRequest();
  request.open("GET", "http://localhost:3000/TM_maquinas"+"/"+tmId);
  request.onload = function() {
    var tmObj = JSON.parse( this.response);
    if (request.status >= 200 && request.status < 400) {
      // Crea un objeto TM
        var tm = new TMachine(
          tmObj.id,
          tmObj.cinta,
          tmObj.posCabeza,
          tmObj.estado,
          tmObj.code
        );
      // Publica en la páguina el resultado
      tm_actual = tm;
      publicarTM(tm_actual);
      publicarMensaje("Cargando una máquina de Turing: "+tmId);
    } else {
      console.log("Error del API REST GET by Id");
    }
  };
  request.send();
}

function apiGET_TM_Web() {
  var request = new XMLHttpRequest();
  request.open("GET", "http://localhost:3000/TM_maquinas");
  request.onload = function() {
    var listaMT = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
      // Crea una lista de objetos TM
      var listaObjTM = [];
      listaMT.forEach(tmObj => {
        var tm = new TMachine(
          tmObj.id,
          tmObj.cinta,
          tmObj.posCabeza,
          tmObj.estado,
          tmObj.code
        );
        listaObjTM.push(tm);
      });
      // Publica en la páguina el resultado
      crearLista(listaObjTM);
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


// --------------------------------------------
// Crear el resultado HTML en la página
// --------------------------------------------

function crearLista(listaMT){
  // Borra una lista previa que ya exista
  const ListadeMaquinas = document.getElementById('listaMaqTuring');
  const divLista = document.getElementById('TM_Lista');
  if (ListadeMaquinas != null) 
    divLista.removeChild(ListadeMaquinas);
  //
  const app = document.getElementById("TM_Lista");
  // Preparar los iconos y las imágenes
  const iconoTM = document.createElement('img');
  iconoTM.src='./img/IconoTuring.png';

  const lista = document.createElement('div');
  lista.setAttribute('id','listaMaqTuring');

  const tabla = document.createElement('table');
  // Crea la cabecera de la tabla
  const cab = document.createElement('thead');
  const cabfila = document.createElement('tr');
  
  const cabCeldaId = document.createElement('th');
  const cabCeldaCinta = document.createElement('th');
  const cabCeldaPosCabeza = document.createElement('th');
  const cabCeldaEstado = document.createElement('th');

  cabCeldaId.textContent ="Id";
  cabCeldaCinta.textContent ="Cinta";
  cabCeldaPosCabeza.textContent ="PosCabeza";
  cabCeldaEstado.textContent ="Estado";

  cabfila.appendChild(cabCeldaId);
  cabfila.appendChild(cabCeldaPosCabeza);
  cabfila.appendChild(cabCeldaEstado);
  cabfila.appendChild(cabCeldaCinta);

  cab.appendChild(cabfila);
  tabla.appendChild(cab);

  // Crea una fila por cada registro de la lista
  listaMT.forEach(tm => {
    tabla.appendChild(crearFila(tm));
  });

  lista.appendChild(iconoTM);
  lista.appendChild(tabla);
  
  app.appendChild(lista);
  
}

function crearFila(tm){

  const fila = document.createElement('tr');
  const celdaId = document.createElement('td');
  const celdaCinta = document.createElement('td');
  const celdaPosCabeza = document.createElement('td');
  const celdaEstado = document.createElement('td');
  // El menú de la fila
  const celdaMenuBorrar = document.createElement('td');
  const celdaMenuCargar = document.createElement('td');
  /*
  const iconoBorrar = document.createElement('img');
  iconoBorrar.src = './img/iconoBorrar.png';
  const iconoCargar = document.createElement('img');
  iconoCargar.src = './img/iconoDescargar.png';
  */

  const btnCargar = document.createElement('button');
  btnCargar.type = 'button';
  btnCargar.innerText ="Cargar";
  btnCargar.addEventListener('click',function(){carga(tm.id)},false);
  
  const btnBorrar = document.createElement('button');
  btnBorrar.type = 'button';
  btnBorrar.innerText = "Borrar";
  
  celdaMenuCargar.appendChild(btnCargar);
  celdaMenuBorrar.appendChild(btnBorrar);

  celdaId.textContent = tm.id;
  celdaPosCabeza.textContent = tm.posCabeza;
  celdaEstado.textContent = tm.estado;
  celdaCinta.textContent = tm.cinta;

  fila.appendChild(celdaId);
  fila.appendChild(celdaPosCabeza);
  fila.appendChild(celdaEstado);
  fila.appendChild(celdaCinta);
  fila.appendChild(celdaMenuBorrar);
  fila.appendChild(celdaMenuCargar);

  return fila;
}