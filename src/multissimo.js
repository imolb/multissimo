'use strict'

/**
 * 1x1_trainer.js
 *
 */

var zahl1 = 0;
var zahl2 = 0;
var anzahlGut=0;
var anzahlSchlecht=0;

var anzahlZeilen = 11;
var anzahlSpalten = 11;

var tabelle = new Array(anzahlZeilen);



function summeTabelle() {
    var summe = 0;

    for (var i=0; i<anzahlZeilen; i++) {
        for (var j=0; j<anzahlSpalten; j++) {
            summe = summe + tabelle[i][j];
        }
    }

    return summe;
}

function minMaxTabelle() {
    var minTabelle = Infinity;
    var maxTabelle = 0;

    for (var i=0; i<anzahlZeilen; i++) {
        for (var j=0; j<anzahlSpalten; j++) {
            minTabelle = Math.min(minTabelle, tabelle[i][j]);
            maxTabelle = Math.max(maxTabelle, tabelle[i][j]);
        }
    }

    return {min: minTabelle, max: maxTabelle};
}

function waehleElementAusTabelle(position) {
    var summe = 0;

    for (var i=0; i<anzahlZeilen; i++) {
        for (var j=0; j<anzahlSpalten; j++) {
            summe = summe + tabelle[i][j];
            if (summe >= position) {
                return {i: i, j: j};
            }
        }
    }
}

function zufallsAufgabe() {
    var position = Math.floor(Math.random()*summeTabelle());

    var element = waehleElementAusTabelle(position);

    zahl1 = element.i;
    zahl2 = element.j;
}

function aufgabeStellFunktion () {
    zufallsAufgabe();

    var aufgabe = zahl1 + " * " + zahl2 + " = ";

    document.querySelector('#aufgabe').textContent = aufgabe;
    document.querySelector('#antwort').value = "";
    document.querySelector('#antwort').focus();
    document.querySelector('#bewertung').textContent = "";
}

function antwortFunktion () {
    var ergebnis = zahl1*zahl2;
    var ausgabe = zahl1 + " * " + zahl2 + " = " + ergebnis;
    var antwort = document.querySelector('#antwort').value;

    var bewertung = "";
    var farbenKlasse = "";
    if (antwort == ergebnis)  {
        farbenKlasse = "richtig";
        anzahlGut =anzahlGut+1;
        tabelle[zahl1][zahl2] = tabelle[zahl1][zahl2] / 2;
        ausgabe = ausgabe + " ✔";
    } else {
        farbenKlasse = "falsch";
        anzahlSchlecht=anzahlSchlecht+1;
        tabelle[zahl1][zahl2] = tabelle[zahl1][zahl2] * 2;
        ausgabe = ausgabe + " ❌";
    }

    document.querySelector('#aufgabe').textContent = ausgabe;
    document.querySelector('#bewertung').setAttribute('class', farbenKlasse);


    ausgabePunkte();
    anzahlAbspeichern();
    ausgabeTabelle();

    window.setTimeout(aufgabeStellFunktion, 2000);
}

function ausgabePunkte() {
    var punkte = anzahlGut - anzahlSchlecht;
    var punktestatus = "🎯 " + punkte +
                               " (✔️" + anzahlGut + " ❌" + anzahlSchlecht + ") ";
    var schwellePokale = 1000;
    var schwelleMedallien = 100;
    var schwelleSmileys = 10;

    var anzahlPokale = Math.floor(punkte / schwellePokale);
    var anzahlMedallien = Math.floor((punkte - schwellePokale*anzahlPokale) / schwelleMedallien);
    var anzahlSmileys = Math.floor((punkte - schwellePokale*anzahlPokale - schwelleMedallien*anzahlMedallien) / schwelleSmileys);

    for (var i=1; i<=anzahlSmileys; i++) {
        punktestatus = punktestatus + "😋";
    }

    for (var i=1; i<=anzahlMedallien; i++) {
        punktestatus = punktestatus + "🏅";
    }

    for (var i=1; i<=anzahlPokale; i++) {
        punktestatus = punktestatus + "🏆";
    }


    document.querySelector('#punktestatus').textContent = punktestatus;
}

const removeChilds = (parent) => {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};

function ausgabeTabelle() {
    var table = document.querySelector('#statistik');

    removeChilds(table);

    for (var i=-1; i<anzahlZeilen; i++) {
        var maxMinWert = minMaxTabelle();

        var tr = document.createElement('tr');
        table.appendChild(tr);

        for (var j=-1; j<anzahlSpalten; j++) {
            if (i >= 0 && j >= 0) {
                var td = createElementWithText('td', "");
                td.setAttribute('title', tabelle[i][j]);
                td.setAttribute('style', 'background-color:'+zellenFarbe(maxMinWert, tabelle[i][j]));
                tr.appendChild(td);
            } else if (i == -1 && j >= 0) {
                tr.appendChild(createElementWithText('th', j));
            } else if (i >= 0 && j == -1) {
                tr.appendChild(createElementWithText('th', i));
            } else {
                tr.appendChild(createElementWithText('th', ""));
            }
        }
    }
}

function zellenFarbe(maxMinWert, wert) {
    var anteil;
    if (maxMinWert.max - maxMinWert.min == 0) {
        anteil = "50";
    } else {
        anteil = (wert - maxMinWert.min)/(maxMinWert.max - maxMinWert.min)*100;
    }
    var farbe = "rgb("+anteil+"% " + (100 - anteil) + "% 50%)";
    return farbe;
}

function createElementWithText(nodeType, text) {
    var node = document.createElement(nodeType);
    var textNode = document.createTextNode(text);
    node.appendChild(textNode);

    return node;
}

function loeschFunktion () {
    document.querySelector('#aufgabe').textContent = "";
    document.querySelector('#antwort').value = "";
    document.querySelector('#antwort').focus();

    document.querySelector('#zaehler').textContent = "richtig: " + anzahlGut + "\nfalsch: " +anzahlSchlecht ;
}

function anzahlAbspeichern () {
    localStorage.setItem('anzahlGut', anzahlGut);
    localStorage.setItem('anzahlSchlecht', anzahlSchlecht);
    localStorage.setItem('tabelle', JSON.stringify(tabelle));
}

function anzahlLaden () {
    anzahlGut = parseInt(localStorage.getItem('anzahlGut'));
    anzahlSchlecht = parseInt(localStorage.getItem('anzahlSchlecht'));
    tabelle = JSON.parse(localStorage.getItem('tabelle'));

    if (isNaN(anzahlGut) || isNaN(anzahlSchlecht)) {
        anzahlGut = 0;
        anzahlSchlecht = 0;
    }

    if (!tabelle) {
        tabelle = new Array(anzahlZeilen);
        for (var i=0; i<anzahlZeilen; i++) {
            tabelle[i] = new Array(anzahlSpalten);
        }

        for (var i=0; i<anzahlZeilen; i++) {
            for (var j=0; j<anzahlSpalten; j++) {
                tabelle[i][j] = 1;
            }
        }
    }
}

function richteSeiteEin () {
    document.querySelector('#knopf2').addEventListener('click', antwortFunktion);
    anzahlLaden();

    ausgabePunkte();
    ausgabeTabelle();
    aufgabeStellFunktion();
}
window.addEventListener('load', richteSeiteEin)