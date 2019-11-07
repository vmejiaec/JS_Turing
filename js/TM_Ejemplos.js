'use strict';

function TM_Ejemplo(){
    var tm_eje01 = new TMachine(
        "Busca Fin Derecha",
        ">001010",
        "Inicio",
        "Inicio 0 0 R Inicio "  + "\n" +
        "Inicio 1 1 R Inicio "  + "\n" +
        "Inicio _ _ L Salto "     + "\n" +
        "Salto 0 0 R Salto "  + "\n" +
        "Salto 1 1 R Regresa "  + "\n" +
        "Regresa _ _ L Fin "     + "\n" +
        "Inicio A A L Salto "     + "\n" +
        "Salto B B R Salto "  + "\n" +
        "Salto X y R Regresa "  
        );
    return tm_eje01;
}