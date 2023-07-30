'use strict'

/**
 * 1x1_trainer.js
 *
 */




function schreibWasFunktion () {
    document.querySelector('#ausgabe').textContent = "Hallo, gut gedrückt."
}

function richteSeiteEin () {
    document.querySelector('#knopf1').addEventListener('click', schreibWasFunktion)
}

window.addEventListener('load', richteSeiteEin)