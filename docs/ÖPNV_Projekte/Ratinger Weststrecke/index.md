---
description: Reaktivierung der Ratinger Weststrecke für den Personenverkehr. Die Trasse wird aktuell ausschließlich für den Güterverkehr verwendet. Es ist geplant, die Strecke auszubauen und eine S-Bahn über Duisburg-Wedau und Ratingen anzubieten.
project_type: reaktivierung
transport_type: eisenbahn
status: antrag
latitude: 51.362
longitude: 6.817
cities:
  - Düsseldorf
  - Ratingen
  - Duisburg
stations:
  - name: "Duisburg Hbf"
    latitude: 51.42970
    longitude: 6.77612
  - name: "Duisburg Sportpark Nord"
    latitude: 51.4114
    longitude: 6.7778
    connects_to: ["Duisburg Hbf"]
  - name: "Duisburg-Wedau"
    latitude: 51.3992
    longitude: 6.8035
    connects_to: ["Duisburg Sportpark Nord"]
  - name: "Ratingen-Lintorf"
    latitude: 51.3358
    longitude: 6.8262
    connects_to: ["Duisburg-Wedau"]
  - name: "Ratingen-Tiefenbroich"
    latitude: 51.3148
    longitude: 6.8352
    connects_to: ["Ratingen-Lintorf"]
  - name: "Ratingen West"
    latitude: 51.2998
    longitude: 6.8387
    connects_to: ["Ratingen-Tiefenbroich"]
  - name: "Düsseldorf-Rath"
    latitude: 51.26490
    longitude: 6.82148
    connects_to: ["Ratingen West"]
---

# Ratinger Weststrecke

{{ badge(project_type, "#0d6efd") }} {{ badge(transport_type, "#fd7e14") }} {{ badge(status, "#6c757d") }} {% for city in cities %}{{ badge(city, "#198754") }} {% endfor %}

Reaktivierung der Ratinger Weststrecke für den Personenverkehr. Die Trasse wird aktuell ausschließlich für den Güterverkehr verwendet. Es ist geplant, die Strecke auszubauen und eine S-Bahn über Duisburg-Wedau und Ratingen anzubieten.

Durch die Reaktivierung der Ratinger Weststrecke wird der Nahverkehr in der Region hinsichtlich
Zuverlässigkeit, Taktung und Abdeckung gestärkt. Unter anderem entstehen die folgende Vorteile:

- Erschließung der Stadtteile Duisburg-Wedau (Nahe dem Neubaugebiet 6-Seen-Wedau), Ratingen-Lintorf,
  und Ratingen West für den SPNV.
- Erhöhte Taktung und Kapazität zwischen Duisburg und Düsseldorf.
- Schaffung einer Ausweichstrecke zwischen Duisburg und Düsseldorf neben der Hauptstrecke über
  Duisburg-Großenbaum, Angermund und den Düsseldorfer Flughafen.
- In Kombination mit der [geplanten Stadtbahn U81](../Düsseldorf%20Stammstrecke%205%20(Stadtbahn%20U81)/index.md)
  entsteht eine Ersatzverbindung zum Düsseldorfer Flughafen, falls die Hauptstrecke gesperrt ist.
- Bessere Anbindung der Schauinsland-Reisen-Arena und dem Sportpark Duisburg.

{{ generate_station_map() }}

## Streckenverlauf

Im Zielnetz 2040[^zielnetz_2040_vrr] ist vorgesehen, die Verbindungen *S47* und *S39X* auf der
Ratinger Weststrecke anzubieten.
Dabei wird der folgende Streckenverlauf beschrieben (eingeklammerte Halte nur S47):

- Duisburg Hbf
- Duisburg Sportpark Nord
- Duisburg-Wedau
- Ratingen-Lintorf
- Ratingen-Tiefenbroich
- Ratingen West
- Düsseldorf-Rath
- (Düsseldorf-Rath Mitte)
- (Düsseldorf-Derendorf)
- (Düsseldorf-Zoo)
- (Düsseldorf-Wehrhahn)
- Düsseldorf Hbf
- ...
- Wuppertal Hbf (S47X) / Bedburg (S39X)

## Technische Daten

Die Ratinger Weststrecke (2326, 2320, 2324, 2400) ist zweigleisig und hat zwischen Duisburg Hbf und
Düsseldorf Hbf eine Gesamtlänge von 27 km. Die Höchstgeschwindigkeit liegt zwischen 100 km/h und 120 km/h.
Die Kommunikation erfolgt aktuell per GSM-R und für die Zugbeeinflussung wird PZB eingesetzt[^machbarkeitsstudie_2020].

Für einen S-Bahn-Betrieb auf der Ratinger Weststrecke sind zusätzliche Infrastrukturmaßnahmen an der
Strecke erforderlich (drittes Gleis, weitere Weichen und Überholgleise)[^machbarkeitsstudie_2020].

### ETCS

Es ist geplant, die Strecke 2324 zwischen Ratingen West und Leverkusen bis Ende 2029 mit ETCS
auszustatten[^etcs_ratingen_leverkusen_2026_eurailpress].
Für den Abschnitt zwischen Duisburg Hbf und Ratingen West gibt es aktuell keine konkreten Pläne.

Da die Ratinger Weststrecke Teil des TEN-T Korridor Rhine-Alpine ist, ist eine ETCS-Ausrüstung bis
2040 vereinbart[^korridor_rhine_alpine].

## Projekt-Updates

### 10.07.2026: VRR und DB unterzeichnen Planungsvereinbarung

Im Juli 2026 unterzeichneten der VRR und die DB eine Planungsvereinbarung für die Aufnahme der Leistungsphase 1+ nach HOAI[^planung_unterzeichnet_2026_db_vrr]:

> Gemeinsam mit den Städten Düsseldorf, Duisburg und Ratingen sowie dem Kreis Mettmann verfolgt der VRR das Ziel, die heute überwiegend vom Güterverkehr genutzte Strecke langfristig wieder für den Personenverkehr nutzbar zu machen. Hierzu haben alle beteiligten Gebietskörperschaften und der VRR bereits eine Kooperationsvereinbarung für die gemeinsame Zusammenarbeit geschlossen.
> 
> Die nun vereinbarten Planungsleistungen der Leistungsphase 1+ nach HOAI sollen ein belastbares Bild über die erforderlichen Infrastrukturmaßnahmen und eine verlässliche Prognose der Kosten einer Erweiterung der Ratinger Weststrecke liefern. Dafür werden die bestehenden Rahmenbedingungen analysiert, erste Planungskonzepte entwickelt und die notwendigen Investitionen konkretisiert. Neben der Bestandsaufnahme wird die Leistungsphase 1+ nach HOAI auch einzelne Inhalte der Leistungsphase 2 abdecken. Dies sind insbesondere die sogenannte Bestandsmodellierung durch Entwicklung eines BIM-Modells (Building Information Modeling). Dabei handelt es sich um ein 3D-Modell, das alle Informationen zu geometrischen Daten, Kosten, Terminen und technische Anlagen zusammenfasst.  Die BIM-Methode ist bei der DB InfraGo Planungsstandard und soll helfen, Probleme frühzeitig zu erkennen und den Bauprozess effizienter zu gestalten

### 24.09.2019: VRR stellt die Machbarkeitsstudie vor

Nachdem im Jahr 2019 der Personenverkehr auf der Ratinger Weststrecke endgültig eingestellt wurde,
schlägt der VRR im selben Jahr eine Machbarkeitsstudie vor, den Personenverkehr wieder aufzunehmen
und möchte diese im Jahr 2022 beauftragen[^studie_2019_vrr].

Zunächst werden dort die folgenden Planfälle vorgeschlagen:

1. Planfall
    - neue Linie S 61: Duisburg Hbf – Duisburg-Wedau – Düsseldorf Hbf (– Langenfeld) im 20-Minuten-Takt
    - neue Linie S 81: Wuppertal-Vohwinkel – Düsseldorf Hbf – Solingen Hbf (ersetzt heutige Züge in der Hauptverkehrszeit)
    - Entfall der S 68, die durch die S 61 und S 81 ersetzt wird
2. Planfall
    - RB 37 im 30-Minuten-Takt zwischen Duisburg und Düsseldorf

## Verwandte Projekte

- [Düsseldorf Stammstrecke 5 (Stadtbahn U81)](../Düsseldorf%20Stammstrecke%205%20(Stadtbahn%20U81)/index.md)
- Sechsgleisiger Ausbau zwischen Duisburg und Düsseldorf für den RRX[^rrx_duesseldorf]

## Referenzen

- [Machbarkeitsstudie Ratinger Weststrecke, April 2020 (kreis-mettmann.de)](https://kis.kreis-mettmann.de/sdnetrim/UGhVM0hpd2NXNFdFcExjZWYryFclvywyHI1kID6wIs8ScU0tW8zE1zpbdqt4pqjL/Anlage_1.pdf)
- [Zielnetz 2040 NRW (kcitf-nrw.de)](https://www.kcitf-nrw.de/fileadmin/03_KC_Seiten/KCITF/Service/Netzgrafik_NRW_2040_2._Gutachterentwurf.pdf)
- [Ratinger Weststrecke: Stillgelegte Bahntrasse vor Comeback (nahverkehr-nrw.de)](https://nahverkehr-nrw.de/ratinger-weststrecke-stillgelegte-bahntrasse-vor-comeback/)

[^studie_2019_vrr]: https://www.vrr-investitionsprojekte.de/infrastruktur/spnv/ratinger-weststrecke/
[^zielnetz_2040_vrr]: https://www.vrr.de/fileadmin/user_upload/pdf/magazin/2023_Artikel/Zielnetz_2040.pdf
[^planung_unterzeichnet_2026_db_vrr]: https://www.vrr.de/aktuelles/newsroom/ratinger-weststrecke-staerkt-mobilitaet-in-der-region/
[^etcs_ratingen_leverkusen_2026_eurailpress]: https://www.eurailpress.de/nachrichten/infrastruktur-ausruestung/detail/news/db-beauftragt-alstom-fuer-etcs-ausruestung-in-nrw.html
[^machbarkeitsstudie_2020]: https://kis.kreis-mettmann.de/sdnetrim/UGhVM0hpd2NXNFdFcExjZWYryFclvywyHI1kID6wIs8ScU0tW8zE1zpbdqt4pqjL/Anlage_1.pdf
[^korridor_rhine_alpine]: https://digitale-schiene-deutschland.de/de/projekte/Korridor_Rhine-Alpine
[^rrx_duesseldorf]: https://www.rheinruhrexpress.de/duesseldorf.html