"use strict";

function TM_Ejemplo() {
  var tm_eje01 = new TMachine(
    "Busca Fin Derecha",
    "012345",
    0,
    "Inicio",
    " // Programa para pruebas  " +
      "\n" +
      "Inicio 0 0 R Inicio  // Comentario" +
      "\n" +
      "Inicio 1 1 R Inicio//..Otro pegado " +
      "\n" +
      "//Inicio pegado " +
      "\n" +
      "Inicio 2 1 L Salto " +
      "\n" +
      "Inicio 3 2 L Salto " +
      "\n" +
      "Inicio 4 3 L Salto " +
      "\n" +
      "Inicio 5 4 L Salto " +
      "\n" +
      "Salto 0 0 R Salto " +
      "\n" +
      "Salto 1 1 L Regresa " +
      "\n" +
      "Salto 4 3 L Regresa " +
      "\n" +
      "Salto 5 4 L Regresa " +
      "\n" +
      "Regresa 0 0 R Inicio " +
      "\n" +
      "Regresa 1 1 L Regresa " +
      "\n" +
      "Regresa 2 1 L Fin " +
      "\n" +
      "Regresa 3 2 L Fin " +
      "\n" +
      "Fin 1 1 L Inicio " +
      "\n" +
      "Inicio A A L Salto " +
      "\n" +
      "Salto B B R Salto " +
      "\n" +
      "Salto X y R Regresa "
  );
  return tm_eje01;
}
