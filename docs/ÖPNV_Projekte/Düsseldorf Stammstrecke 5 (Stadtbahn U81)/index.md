---
description: Langfristig geplante Neubaustrecke der Düsseldorfer Stadtbahn zwischen der Messe und dem Flughafen mit möglichen Erweiterungen nach Ratingen und einer Rheinquerung nach Neuss. Die neue Linie U81 soll auf der Strecke verkehren.
project_type: neubau
transport_type: stadtbahn
status: im_bau
latitude: 51.272
longitude: 6.758
cities:
  - Düsseldorf
  - Ratingen
  - Neuss
  - Meerbusch
stations:
  - name: "Ratingen West"
    latitude: 51.299483
    longitude: 6.837670
  - name: "Wasserwerk"
    latitude: 51.298880
    longitude: 6.824867
    connects_to: ["Ratingen West"]
  - name: "Im Rott"
    latitude: 51.299764
    longitude: 6.819817
    connects_to: ["Wasserwerk"]
  - name: "Bahnhof Düsseldorf Flughafen"
    latitude: 51.291560
    longitude: 6.786370
    connects_to: ["Im Rott"]
  - name: "Wanheimer Straße"
    latitude: 51.286756
    longitude: 6.787062
    connects_to: ["Bahnhof Düsseldorf Flughafen"]
  - name: "Düsseldorf Flughafen Terminal"
    latitude: 51.276018
    longitude: 6.767058
    connects_to: ["Wanheimer Straße"]
  - name: "Freiligrathplatz"
    latitude: 51.265319
    longitude: 6.752536
    connects_to: ["Düsseldorf Flughafen Terminal"]
  - name: "Mörikestraße"
    latitude: 51.264479
    longitude: 6.745402
    connects_to: ["Freiligrathplatz"]
  - name: "Merkur Spiel-Arena/Messe Nord"
    latitude: 51.26122
    longitude: 6.73621
    connects_to: ["Mörikestraße"]
  - name: "D-Lörick"
    latitude: 51.244664
    longitude: 6.717314
    connects_to: ["Merkur Spiel-Arena/Messe Nord"]
  - name: "Willstätter Straße"
    latitude: 51.24193
    longitude: 6.71217
    connects_to: ["D-Lörick"]
  - name: "Böhlerweg"
    latitude: 51.239110
    longitude: 6.709267
    connects_to: ["Willstätter Straße"]
  - name: "Zülpicher Straße"
    latitude: 51.232023
    longitude: 6.701349
    connects_to: ["Böhlerweg"]
  - name: "Düsseldorf-Vogesenstraße"
    latitude: 51.225480
    longitude: 6.698466
    connects_to: ["Zülpicher Straße"]
  - name: "Neuss Am Kaiser"
    latitude: 51.220285
    longitude: 6.698189
    connects_to: ["Düsseldorf-Vogesenstraße"]
  - name: "Blücherstraße"
    latitude: 51.214378
    longitude: 6.693249
    connects_to: ["Neuss Am Kaiser"]
---

# Düsseldorf Stammstrecke 5 (Stadtbahn U81)

{{ badge(project_type, "#0d6efd") }} {{ badge(transport_type, "#fd7e14") }} {{ badge(status, "#6c757d") }} {% for city in cities %}{{ badge(city, "#198754") }} {% endfor %}

Langfristig geplante Neubaustrecke der Düsseldorfer Stadtbahn zwischen der Messe und dem Flughafen mit möglichen Erweiterungen nach Ratingen und einer Rheinquerung nach Neuss. Die neue Linie U81 soll auf der Strecke verkehren.

Die 5. Stammstrecke ist ein essentielles Projekt für den Ausbau des Düsseldorfer, Ratinger und
Neusser ÖPNV und verfolgt die folgenden Ziele:

- Direktere Anbindung von Ratingen an den Fernverkehr und den Düsseldorfer Flughafen.
- Bessere Anbindung der Düsseldorfer Messe bzw. der Merkur Spiel-Arena nach Neuss, Meerbusch und
  Krefeld über die Rheinquerung, sowie eine bessere Anbindung zur restlichen Rhein-Ruhr Metropole
  über den Bahnhof Düsseldorf Flughafen mit Anbindung an den Fern-, Regional- und Nahverkehr bzw.
  insbesondere auch den Rhein-Ruhr Express (RRX).
- Ausweichverbindung vom Ruhrgebiet zum Düsseldorfer Flughafen im Falle einer Streckensperrung
  zwischen Duisburg Hbf und Düsseldorf Flughafen. Erfordert die Reaktivierung der Ratinger
  Weststrecke für den Personenverkehr.
- Schaffen des Mobilitätshubs DUSconnect[^dus_connect] mit Anbindung an den SPNV, RRX, Flugverkehr,
  Individualverkehr (Auto mit P+R bzw. Fahrrad mit B+R). Dort wird zudem der
  EUREF Campus[^euref_campus] errichtet.

{{ generate_station_map() }}

## Bauabschnitte

Das Projekt lässt sich in insgesamt vier Bauabschnitte unterteilen, welche unabhängig geplant und gebaut werden.

### 1. Bauabschnitt: Flughafen Terminal {{ badge("Fertiggestellt", "#198754") }}

Der erste Bauabschnitt[^ba1_infos] verbindet die Station *Freiligrathplatz* nahe der Messe mit der
neuerrichteten Station *Flughafen-Terminal* und wurde am 04.09.2026 eröffnet[^ba1_eroeffnung_nrw].
Für diesen Bauabschnitt wurde die neue Nordsternbrücke[^nordsternbruecke_wikipedia] errichtet.

Auf der Strecke sollen die folgenden Linien verkehren[^ba1_offizielle_eroeffnung]:

- Die **U80** verkehrt im 20- bzw. 30-Minuten-Takt zwischen *Düsseldorf Hbf* und *Flughafen-Terminal*.
- Die **U81** verkehrt im 20- bzw. 30-Minuten-Takt zwischen *Arena/Messe Nord* und *Flughafen-Terminal*.
  Zunächst wird die Linie U81 nur im Messeverkehr eingesetzt und ersetzt die Buslinie 896.
  Sobald die Rheinquerung nach Lörick/Handweiser fertiggestellt ist, wird die U81 regelmäßig verkehren.

### 2. Bauabschnitt: Rheinquerung {{ badge("Geplant", "#0d6efd") }}

Der zweite Bauabschnitt[^ba2_infos] schafft eine Rheinquerung und verlängert die Stadtbahn von der
Messe über den Stadtteil Lörick bis zum Handweiser. Dabei schafft er Anschlüsse nach Neuss,
Meerbusch und Krefeld.

Im zweiten Bauabschnitt sollen die folgenden neuen Haltestellen errichtet werden:

- Düsseldorf-Lörick
- Willstätter Straße
- Böhlerweg
- Zülpicher Straße

Danach ist eine Streckenführung über die bestehende Trasse zwischen *Düsseldorf-Vogesenstraße* und
der *Blücherstraße* in Neuss vorgesehen.
Langfristig ist zudem eine Verlängerung bis zum S-Bahn Haltepunkt *Neuss Rheinpark-Center* vorgesehen.


### 3. Bauabschnitt: Flughafen Bahnhof {{ badge("Geplant", "#0d6efd") }}

Der dritte Bauabschnitt[^ba3_infos] schafft eine Verbindung von der neuen Station
*Flughafen-Terminal* zum Bahnhof *Düsseldorf Flughafen*. Dort entsteht somit eine Anbindung an den
Fern-, Regional- und Nahverkehr bzw. insbesondere auch den Rhein-Ruhr Express (RRX).

Der dritte Bauabschnitt verläuft somit ähnlich zum SkyTrain People Mover[^duesseldorf_skytrain].
Im Gegensatz zu diesem bindet der dritte Bauabschnitt jedoch ebenfalls die Messe über den ersten
Bauabschnitt, sowie den Stadtteil Lörick über den zweiten Bauabschnitt an den Flughafen Bahnhof an.
Ohne die U81 sind diese aus dem Ruhrgebiet nur mit langer Fahrt oder relativ umständlich mit der
Linie U79 ab Duisburg Hbf oder der Linie U76 ab Düsseldorf Hbf bzw. U76 ab Krefeld Hbf erreichbar.
Ein Parallelbetrieb scheint insofern sinnvoll, dass der SkyTrain reguläre Flughafengäste zum Bahnhof
bzw. zu den Parkhäusern transportiert, während die U81 den Flughafen selber und die Rhein-Ruhr
Metropole über den Bahnhof Düsseldorf Flughafen an die Messe bzw. restlichen Stadtteile anbindet.
Somit ist selbst bei Großveranstaltungen ein freies, ungestörtes Vorankommen zwischen dem Flughafen
und dem Bahnhof gewährleistet.

Zwischen *Flughafen-Terminal* und dem Bahnhof *Düsseldorf Flughafen* soll zudem ein Haltepunkt an
der *Wanheimer Straße* entstehen.

Am Flughafen Bahnhof entsteht aktuell zudem der EUREF Campus[^euref_campus], sowie der Mobilitätshub
DUSconnect[^dus_connect] mit Umstieg zum SPNV, dem Auto (P+R) und dem Fahrrad (B+R), welcher mit der
U81 dann optimal angebunden werden soll.

### 4. Bauabschnitt: Ratingen West {{ badge("Geplant", "#0d6efd") }}

Der vierte Bauabschnitt[^ba4_infos] verlängert die U81 vom Flughafen Bahnhof weiter nach Ratingen.
Dadurch entsteht eine direkte Anbindung von Ratingen an den Flughafen Bahnof, die Messe, sowie die
linksrheinischen Stadtteile Neuss, Meerbusch und Krefeld.

In Kombination mit der Reaktivierung der Ratinger Weststrecke für Personenverkehr ensteht zudem eine
komfortable Anbindung von Duisburg Wedau zu den an der Stammstrecke 5 liegenden Orten. Im Falle
einer Streckensperrung zwischen Duisburg Hbf und dem Bahnhof Düsseldorf Flughafen, bietet die U81 in
Kombination mit der Ratinger Weststrecke zudem eine Ausweichmöglichkeit, um den Flughafen dennoch zu
erreichen.

Im vierten Bauabschnitt sollen die folgenden neuen Haltestellen errichtet werden:

- Im Rott
- Wasserwerk
- Ratingen West (S-Bahn Haltepunkt)

## Projekt-Updates

### 18.06.2026: Wirtschaftlichkeit des dritten Bauabschnittes nicht gegeben. Neubewertung geplant

Während laut RP im Januar 2026 noch der Plan vorlag, den dritten Bauabschnitt vor dem zweiten
Bauabschnitt zu priorisieren[^rp_ba3_vor_ba2_jan2026], liegen nun Informationen vor, dass der dritte
Bauabschnitt zwischen Flughafen-Terminal und Bahnhof Düsseldorf Flughafen einen Kosten-Nutzen-Faktor
unter eins hat, wodurch die geplante Variante nicht förderfähig wäre. Die Rheinquerung weist
hingegen in sowohl der Tunnel- als auch Brückenvariante einen Kosten-Nutzen-Faktor über eins aus.
Es gibt nun den Plan, ein Gesamtprojekt aus allen Abschnitten zu bilden und für diese die
Förderfähigkeit zu bestimmen[^rp_ba3_lohnt_nicht_jun2026].

Ohne den dritten Bauabschnitt würde die Anbindung der Messe an den Fernverkehr sowie RRX entfallen.
Zudem entfällt die Möglichkeit, die Ratinger Weststrecke als direkte Ausweichstrecke zu nutzen bzw.
nur mit Umstieg zum SkyTrain, sollte der vierte Bauabschnitt dennoch gebaut werden. Zudem ist
denkbar, dass gerade bei großen Messeveranstaltungen der SkyTrain überlastet wird, da Personen
versuchen könnten, über den SkyTrain und den ersten Bauabschnitt vom Bahnhof zur Messe zu gelangen.

### 04.09.2026: Eröffnung des ersten Bauabschnittes der U81

Die Eröffnung des ersten Bauabschnittes der U81 zwischen *Freiligrathplatz* und *Flughafen-Terminal*
ist für den 04.09.2026 angesetzt[^ba1_eroeffnung_nrw] [^ba1_eroeffnung_rp_mai].

## Verwandte Projekte

- [Reaktivierung der Ratinger Weststrecke für den Personenverkehr](../Ratinger%20Weststrecke/index.md)
- EUREF Campus[^euref_campus]

## Referenzen

- [4. Düsseldorfer Nahverkehrsplan (duesseldorf.de)](https://www.duesseldorf.de/fileadmin/Amt66/verkehrsmanagement/pdf/NVP_Endfassung_2017.pdf)
- [U81: Verbindungen in die Region beschleunigen (duesseldorf.de)](https://www.duesseldorf.de/amt-fuer-bruecken-tunnel-und-stadtbahnbau/stadtbahnbau/stadtbahnstrecke-u81)
- [Stammstrecke 5 (Stadtbahn Düsseldorf) (wikipedia.org)](https://de.wikipedia.org/wiki/Stammstrecke_5_(Stadtbahn_Düsseldorf))

[^ba1_infos]: https://www.duesseldorf.de/amt-fuer-bruecken-tunnel-und-stadtbahnbau/stadtbahnbau/stadtbahnstrecke-u81/1-ba-flughafen-terminal
[^ba2_infos]: https://www.duesseldorf.de/amt-fuer-bruecken-tunnel-und-stadtbahnbau/stadtbahnbau/stadtbahnstrecke-u81/2-ba-rheinquerung
[^ba3_infos]: https://www.duesseldorf.de/amt-fuer-bruecken-tunnel-und-stadtbahnbau/stadtbahnbau/stadtbahnstrecke-u81/3-ba-flughafen-bahnhof
[^ba4_infos]: https://www.duesseldorf.de/amt-fuer-bruecken-tunnel-und-stadtbahnbau/stadtbahnbau/stadtbahnstrecke-u81/4-ba-ratingen-west
[^ba1_eroeffnung_rp_mai]: https://rp-online.de/nrw/staedte/duesseldorf/verkehr/duesseldorf-starttermin-der-u81-zum-flughafen-steht-fest_aid-147849529
[^ba1_offizielle_eroeffnung]: https://www.duesseldorf.de/medienportal/pressedienst-einzelansicht/pld/u81-offizielle-eroeffnung-am-4-september
[^ba1_eroeffnung_nrw]: https://www.land.nrw/node/25461
[^nordsternbruecke_wikipedia]: https://de.wikipedia.org/wiki/Nordsternbr%C3%BCcke
[^duesseldorf_skytrain]: https://www.am-flughafen.com/duesseldorf-flughafen-skytrain.html
[^euref_campus]: https://duesseldorf.euref.de/
[^dus_connect]: https://www.dus.com/de-de/konzern/unternehmen/infrastruktur/dusconnect
[^rp_ba3_vor_ba2_jan2026]: https://rp-online.de/nrw/staedte/duesseldorf/verkehr/duesseldorf-neue-plaene-fuer-u81-flughafen-bahnhof-vor-rheinquerung_aid-142785837
[^rp_ba3_lohnt_nicht_jun2026]: https://rp-online.de/nrw/staedte/duesseldorf/verkehr/u81-duesseldorf-verbindung-zum-flughafen-bahnhof-lohnt-sich-nicht-die-gruende_aid-150049199