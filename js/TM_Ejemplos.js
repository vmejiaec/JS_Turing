'use strict';

function TM_Ejemplo(){
    var tm_eje01 = new TMachine(
        "Busca Fin Derecha",
        ">001010",
        "Inicio",
        "Inicio 0 0 R Inicio "  + "\n" +
        "Inicio 1 1 R Inicio "  + "\n" +
        "Inicio _ _ L Fin "      
        );
    return tm_eje01;
}