---
description: Reaktivierung des Personenverkehrs nach Kamp-Lintfort und Neukirchen-Vluyn.
date:
  created: 2026-10-23
  updated: 2026-09-04
project_type: reaktivierung
transport_type: eisenbahn
status: antrag
latitude: 51.45818
longitude: 6.63849
cities:
  - Moers
  - Kamp-Lintfort
  - Neukirchen-Vluyn
stations:  # Koordinaten manuell überprüft am 23.10.
  - name: "Moers"
    latitude: 51.4511
    longitude: 6.6415
  - name: "MO-Altstadt"
    latitude: 51.4569
    longitude: 6.6246
    connects_to: ["Moers"]
  - name: "MO-Hülsdonk"
    latitude: 51.4506
    longitude: 6.6039
    connects_to: ["MO-Altstadt"]
  - name: "Neukirchen"
    latitude: 51.4448
    longitude: 6.5777
    connects_to: ["MO-Hülsdonk"]
  - name: "Dicksche Heide"
    latitude: 51.4415
    longitude: 6.5552
    connects_to: ["Neukirchen"]
  - name: "Neukirchen-Vluyn"
    latitude: 51.4360
    longitude: 6.5292
    connects_to: ["Dicksche Heide"]
  - name: "MO-Eick"
    latitude: 51.4814
    longitude: 6.6339
    connects_to: ["Moers"]
  - name: "MO-Repelen"
    latitude: 51.4934
    longitude: 6.5930
    connects_to: ["MO-Eick"]
  - name: "Kamp-Lintfort Süd"
    latitude: 51.4880
    longitude: 6.5514
    connects_to: ["MO-Repelen"]
  - name: "Kamp-Lintfort Mitte"
    latitude: 51.4992
    longitude: 6.5476
    connects_to: ["Kamp-Lintfort Süd"]
---

# Niederrheinbahn

{{ badge(project_type, "#0d6efd") }} {{ badge(transport_type, "#fd7e14") }} {{ badge(status, "#6c757d") }} {% for city in cities %}{{ badge(city, "#198754") }} {% endfor %}

Zwei Projekte zur Reaktivierung des Personenverkehrs nach Kamp-Lintfort und Neukirchen-Vluyn.

Die Projekte sind Teil des Niederrhein-Münsterland-Netzes[^vrr_niederrhein_muensterland_netz].
Im VRR Nahverkehrsplan 2025 beschriebenen Zielnetz 2040 sollen die Strecken von der RE44 befahren werden, welche heute zwischen Moers und Bottrop fährt[^vrr_nahverkehrsplan_2025]. Dabei ist vorgesehen, dass die RE44 halbstündlich zwischen Dorsten und Moers fährt, wobei jeweils abwechselnd Kamp-Lintfort bzw. Neukirchen-Vluyn angefahren werden, wodurch sich bei diesen ein stündlicher Takt ergibt.

## Streckenverlauf

{{ generate_station_map() }}

### Niederrheinbahn I: Moers – Kamp-Lintfort {{ badge("Im Bau", "#198754") }}

Die Strecke folgt der ehemaligen Grubenanschlussbahn zwischen Kamp-Lintfort und Moers-Rheinkamp und wird als rund 8,4 Kilometer lange, weitgehend eingleisige und nicht elektrifizierte Strecke für 80 km/h ausgelegt; der Endbahnhof Kamp-Lintfort Mitte soll perspektivisch als zweigleisiger Kopfbahnhof entstehen[^brd_offenlage_niederrheinbahn]. Nötig sind neben der neuen Trasse im Zechenpark von Kamp-Lintfort Süd nach Kamp-Lintfort Mitte auch der Umbau des Gleisbogens in Moers-Rheinkamp, um die Strecke aus Moers kommend anfahren zu können[^gleisbogen_rheinkamp_kamp_lintfort].

Bereits 2020 verkehrte zur Landesgartenschau Kamp-Lintfort ein Vorlaufbetrieb im Wochenendverkehr, 2022 erhielt die Niederrheinbahn GmbH hierfür einen Förderbescheid des Landes über rund 17 Mio. €[^foerderbescheid_niederrheinbahn_2022]. Die Planfeststellung erfolgt in zwei Abschnitten: Für den Gleisbogen in Moers-Rheinkamp und die Strecke bis Kamp-Lintfort Süd erging am 30.06.2026 der Planfeststellungsbeschluss, während das Verfahren für den Abschnitt durch den Zechenpark noch läuft[^baugeehmigung_kamp_lintfort_2026]. Ein Betriebsstarttermin ist offen, denn der ursprünglich für Ende 2026 vorgesehene RE44 verzögert sich, da bei Voruntersuchungen Mängel an mehreren Brückenbauwerken festgestellt wurden[^baugeehmigung_kamp_lintfort_2026].

### Niederrheinbahn II: Moers – Neukirchen-Vluyn {{ badge("Geplant", "#0d6efd") }}

Die Strecke geht auf die 1909 eröffnete Moerser Kreisbahn zurück, auf der bis 1968 Personen- und Güterverkehr stattfand[^moerser_kreisbahn_wikipedia][^bahnstrecke_rheinberg_moers_hoerstgen_sevelen_wikipedia]. Anschließend nutzte die Zeche Niederberg die Trasse bis zu deren Stilllegung im Jahr 2001. Für den Anschluss an die Gleise der Deutschen Bahn ist ein Brückenbauwerk auf dem Betriebsgelände der NIAG erforderlich[^anfrage_18_03_2021_moers].

Das Projekt befindet sich in der Vorplanung: Der VRR hat zusammen mit dem Kreis Wesel, den Städten Moers und Neukirchen-Vluyn sowie der NIAG eine Kooperations- und Finanzierungsvereinbarung geschlossen und beim Land die Förderung der Leistungsphasen Grundlagenermittlung und Vorplanung von Strecke und Überwerfungsbauwerk angemeldet (Planungskosten rund 2,3 Mio. €, zu 90 % förderfähig)[^vorlage_18_318_moers]. Da das Überwerfungsbauwerk im Bereich des NIAG-Betriebsgeländes den technisch und finanziell schwierigsten Teil darstellt, soll seine Machbarkeit vorgezogen geprüft werden; ein wirtschaftlicher Betrieb gilt nur bei durchgängiger Befahrbarkeit bis Duisburg als möglich[^vorlage_18_318_moers]. Im Mai 2026 stellte der Moerser Hauptausschuss die städtischen Mittel für Grundlagenermittlung und Vorplanung bereit, sodass die Vergabe der Planungsleistungen beginnen kann[^beschluss_haushalt_2026_moers].

### Ideen zu möglichen Verlängerungen in Richtung Geldern {{ badge("Idee", "#6c757d") }}

In einer Potentialanalyse des Kreis Kleve aus 2025 werden verschiedene Verlängerungsoptionen benannt, darunter mögliche Verlängerungen von Kamp-Lintfort oder Neukirchen-Vluyn nach Geldern[^potentialanalyse_spnv_kleve_2025]. Dabei erhält die Strecke Geldern – Kamp-Lintfort eine leicht positive Bewertung, erreicht allerdings nur ein Nutzen-Kosten-Verhältnis von 0,73.

Anders als bei den beiden Niederrheinbahn-Strecken existiert zwischen Kamp-Lintfort und Geldern keine fertiggestellte Bahntrasse: Die rund 23,5 Kilometer lange Bahnstrecke Geldern–Meerbeck wurde vor dem Ersten Weltkrieg begonnen, ihre Erdbauwerke und Brücken waren zum großen Teil fertig, vollendet wurde sie jedoch nie. Heute ist die Trasse unter anderem von der A 57 und Gewerbegebieten durchschnitten, sodass eine Umsetzung faktisch einem Neubau gleichkäme[^bahnstrecke_geldern_meerbeck_wikipedia]. Ende 2025 wurde auf der Crowdsourcing-Plattform Linie Plus eine Verbindung Geldern–Kamp-Lintfort–Moers–Oberhausen vorgeschlagen, was das weiterhin bestehende Interesse an der Verbindung zeigt. Ein solcher Vorschlag ist jedoch kein Planungsverfahren[^linie_plus_geldern_kamp_lintfort]. Da das Nutzen-Kosten-Verhältnis von 0,73 auf dem heutigen Bezugsfall beruht, wäre eine Neubewertung nach Inbetriebnahme der Niederrheinbahn denkbar, da dann eine Anknüpfung an einen betriebenen SPNV bestünde. Entsprechende Schritte wurden bislang allerdings nicht eingeleitet.

??? "Übersichtstabelle des Potentials verschiedener Streckenerweiterungen"

    Laut Seite 25 (Seite 43 im Dokument) ergibt sich folgendes Potential[^potentialanalyse_spnv_kleve_2025]:

    Strecken | Nachfrage-potential | Fahrzeit-verbesserung | Eingriffe in Natur | Baurestriktionen | Linen-angebot SPNV | Geplantes Angebot | Summe Bewertung | Nutzen-Kosten-Faktor
    ---------|--------------------|----------------------|--------------------|------------------|------------------|-------------------|-----------------|----
    Kleve–Nijmegen               | ++ | ++ | 0  | -  | ++ | +  | *6*     | 1,68
    Kleve–Emmerich               | -  | +  | -- | -- | 0  | 0  | 0       | 
    Geldern–Straelen             | 0  | +  | -  | -- | 0  | 0  | 0       | 
    Geldern–Alpen                | -  | 0  | -  | -- | 0  | 0  | 0       | 
    **Geldern–Kamp-Lintfort**    | ++ | +  | 0  | -- | 0  | 0  | ***1*** | 0,73
    Geldern–Kleve                | ++ | +  | +  | 0  | ++ | ++ | *8*     | 0,09[^nkv_geldern_009]
    **Geldern–Neukirchen-Vluyn** | -  | +  | -  | -- | +  | 0  | **0**   | 
    Xanten–Kleve                 | +  | +  | -- | -- | +  | 0  | 0       | 
    Xanten–Goch                  | +  | +  | -  | -- | +  | 0  | 0       | 
    Kalkar–Isselburg             | 0  | ++ | -- | -- | 0  | 0  | 0       | 

    [^nkv_geldern_009]: Der Nutzen-Kosten-Faktor von 0,09 bezieht sich auf den zweigleisigen Ausbau der Strecke. Siehe Seite 87 (105 im Dokument)[^potentialanalyse_spnv_kleve_2025].

## Projekt-Updates

### 04.09.2026: Erörterungstermin zur Niederrheinbahn Kamp-Lintfort

Unter Leitung der Bezirksregierung Düsseldorf erörterten am 15.09.2026 (mit möglicher Fortsetzung am 16.09.2026) der Vorhabenträger, Träger öffentlicher Belange und Einwender im Schirrhof in Kamp-Lintfort die Planung des Gleisabschnitts Zechenpark. Eine Entscheidung fiel im Termin selbst nicht; die Ergebnisse fließen in den noch ausstehenden Planfeststellungsbeschluss ein[^eroerterungstermin_niederrheinbahn_kamp_lintfort_nrw].

### 17.04.2023: NRW-Takt Zielnetz 2040 (2. Gutachterentwuft)

Das Kompetenzcenter Integraler Taktfahrplan NRW veröffentlichte die aktualisierte Netzgrafik des Zielnetzes 2040 als zweiten Gutachterentwurf. Darin ist die Reaktivierung beider Strecken enthalten: Der RE44 soll demnach halbstündlich zwischen Dorsten und Moers verkehren und abwechselnd nach Kamp-Lintfort und Neukirchen-Vluyn durchgebunden werden[^kcitf_nrw_zielnetz_2040][^vrr_nahverkehrsplan_2025].

### 20.01.2020: Machbarkeitsstudie Schienenpersonennahverkehr Neukirchen-Vluyn

Die von der TÜV Rheinland InterTraffic GmbH im Auftrag der Stadt Neukirchen-Vluyn erstellte Machbarkeitsstudie kommt zum Ergebnis, dass die Reaktivierung der Strecke nach Moers realisierbar ist und ein positives Nutzen-Kosten-Verhältnis erwarten lässt; die Investitionskosten wurden mit rund 35–50 Mio. € beziffert[^machbarkeitsstudie_neukirchen_vluyn_2020][^machbarkeitsstudie_presse_neukirchen_vluyn]. Aufbauend auf die Studie nahm der VRR das Projekt in seine weitere Planung auf.

## Referenzen

- Moerser Kreisbahn[^moerser_kreisbahn_wikipedia]

!!! info "KI-Nutzung"

    Die Recherche sowie Formulierung dieses Artikels wurde teilweise mit Hilfe von Generativer KI (LLMs) unterstützt.

[^vrr_nahverkehrsplan_2025]: https://nahverkehrsplan.vrr.de/fileadmin/nahverkehrsplan_upload/VRR_Nahverkehrsplan_2025.pdf
[^vrr_niederrhein_muensterland_netz]: https://www.vrr.de/der-vrr/ueber-uns/schienenpersonennahverkehr-im-vrr/niederrhein-muensterland-netz
[^machbarkeitsstudie_neukirchen_vluyn_2020]: https://ris.neukirchen-vluyn.de/sdnetrim/UGhVM0hpd2NXNFdFcExjZcxpa9thEocHcFRjXq4jruM9nlBKdnNr26QzHNuGcs3M/Anlage_A-01_Erstellung_einer_Machbarkeitsstudie_zur_Reaktivierung_des_Schienenpersonennahverkehrs_zwischen_Neukirchen-Vluyn_und_Moers.pdf
[^machbarkeitsstudie_presse_neukirchen_vluyn]: https://www.neukirchen-vluyn.de/pressemeldungen/machbarkeitsstudie-zur-niederrheinbahn
[^kcitf_nrw_zielnetz_2040]: https://www.kcitf-nrw.de/fileadmin/03_KC_Seiten/KCITF/Service/Netzgrafik_NRW_2040_2._Gutachterentwurf.pdf
[^gleisbogen_rheinkamp_kamp_lintfort]: https://www.kamp-lintfort.de/bauen-wirtschaft/niederrheinbahn/gleisbogen-rheinkamp
[^anfrage_18_03_2021_moers]: https://ris.moers.de/sdnetrim/UGhVM0hpd2NXNFdFcExjZdnMsQLPkeiczNwG7jokGbyFwt9fGhz18i23vbOsHXix/TOP_4.2_Reaktivierung_Bahnlinie_Moers_-_Neukirchen-Vluyn.pdf
[^vorlage_18_318_moers]: https://ris.moers.de/sdnetrim/UGhVM0hpd2NXNFdFcExjZY6K6HlksjSWHNwGx024Nx3wgP_gcji2V1eL1TjaOFp8/Sitzungsvorlage_18-318.pdf
[^beschluss_haushalt_2026_moers]: https://www.moers.de/rathaus-politik/aktuelles/presse/ausschuss-setzt-wichtige-impulse-fuer-mobilitaet
[^brd_offenlage_niederrheinbahn]: https://www.brd.nrw.de/presse/pressemitteilungen/Niederrheinbahn-soll-Moers-Rheinkamp-und-Kamp-Lintfort-verbinden
[^foerderbescheid_niederrheinbahn_2022]: https://www.land.nrw/pressemitteilung/reaktivierung-der-niederrheinbahn-rund-17-millionen-euro-fuer-einen-besseren-und
[^baugeehmigung_kamp_lintfort_2026]: https://www.radiokw.de/artikel/niederrheinbahn-kamp-lintfort-bekommt-baugenehmigung-2690043
[^moerser_kreisbahn_wikipedia]: https://de.wikipedia.org/wiki/Moerser_Kreisbahn
[^bahnstrecke_rheinberg_moers_hoerstgen_sevelen_wikipedia]: https://de.wikipedia.org/wiki/Bahnstrecke_Rheinberg%E2%80%93Moers%E2%80%93Hoerstgen-Sevelen
[^bahnstrecke_geldern_meerbeck_wikipedia]: https://de.wikipedia.org/wiki/Bahnstrecke_Geldern%E2%80%93Meerbeck
[^linie_plus_geldern_kamp_lintfort]: https://linieplus.de/proposal/geldern-kamp-lintfort-moers-duisburg-meiderich-oberhausen/
[^potentialanalyse_spnv_kleve_2025]: https://kis.kreis-kleve.de/sdnetrim/UGhVM0hpd2NXNFdFcExjZex2_b-k-qsBbD1qjSDg0oVy4pxT22lrEm1MuEcavMAqn/Oeffentliche_Niederschrift_Ausschuss_fuer_Bauen-_Entsorgung-_Verkehr_und_Infrastrukturplanung_20.02.2025.pdf
[^eroerterungstermin_niederrheinbahn_kamp_lintfort_nrw]: https://www.brd.nrw.de/presse/pressemitteilungen/Reaktivierung-Niederrheinbahn-Bezirksregierung-ermoeglicht-Betroffenen