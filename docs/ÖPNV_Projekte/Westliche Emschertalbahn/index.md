---
description: Mögliche Reaktivierung der heute nur vom Güterverkehr genutzten Bahnstrecke zwischen Bottrop Vonderort und Gelsenkirchen-Zoo über Bottrop Süd, Essen Karnap, GE-Horst und GE-Schalke, um das nördliche Ruhrgebiet besser an den Personenverkehr anzubinden.
project_type: reaktivierung
transport_type: eisenbahn
status: idee
latitude: 51.524118
longitude: 7.007335
cities:
  - Bottrop
  - Essen
  - Gelsenkirchen
stations:
  - name: "OB-Sterkrade"
    latitude: 51.512125
    longitude: 6.843570
  - name: "OB-Osterfeld Süd"
    latitude: 51.499790
    longitude: 6.884254
    connects_to: ["OB-Sterkrade"]
  - name: "BOT-Vonderort"
    latitude: 51.501730
    longitude: 6.912353
    connects_to: ["OB-Osterfeld Süd"]
  - name: "Bottrop Süd"
    latitude: 51.506505
    longitude: 6.936815
    connects_to: ["BOT-Vonderort"]
  - name: "E-Karnap"
    latitude: 51.524118
    longitude: 7.007335
    connects_to: ["Bottrop Süd"]
  - name: "GE-Horst Süd"
    latitude: 51.528691
    longitude: 7.028664
    connects_to: ["E-Karnap"]
  - name: "GE-Schalke Nord"
    latitude: 51.532602
    longitude: 7.079777
    connects_to: ["GE-Horst Süd"]
  - name: "GE-Zoo"
    latitude: 51.53771
    longitude: 7.11073
    connects_to: ["GE-Schalke Nord"]
  - name: "Wanne-Eickel Hbf"
    latitude: 51.531250
    longitude: 7.166095
    connects_to: ["GE-Zoo"]
---

# Westliche Emschertalbahn

{{ badge(project_type, "#0d6efd") }} {{ badge(transport_type, "#fd7e14") }} {{ badge(status, "#6c757d") }} {% for city in cities %}{{ badge(city, "#198754") }} {% endfor %}

Mögliche Reaktivierung der heute nur vom Güterverkehr genutzten Bahnstrecke Wanne–Ruhrort[^wikipedia_bahnstrecke_ruhrort_dortmund] zwischen Bottrop Vonderort und Gelsenkirchen-Zoo über Bottrop Süd, Essen Karnap, GE-Horst und GE-Schalke, um das nördliche Ruhrgebiet besser an den Personenverkehr anzubinden.

Die Strecke ist Teil der Emschertalbahn (Duisburg-Ruhrort–Dortmund[^wikipedia_bahnstrecke_ruhrort_dortmund]) der Köln-Mindener Eisenbahn-Gesellschaft, die ab 1871 das Gebiet zwischen Ruhr und Emscher für Zechen und Industrie erschloss. Für den hier beschriebenen Abschnitt zwischen Gelsenkirchen-Zoo und Oberhausen-Sterkrade verwendet der VRR die Bezeichnung *Westliche Emschertalbahn*[^vrr_nahverkehrsplan_2025]. Sie ist weder mit der heutigen RB 43 *Emschertal-Bahn*[^vrr_fahrplan_rb43_2026] zu verwechseln, die zwischen Wanne-Eickel und Gelsenkirchen-Zoo nicht auf der Emschertal-Trasse, sondern über Wanne Unser Fritz fährt und von der Emschertalbahn nur den östlichen Abschnitt Wanne-Eickel–Herne–Dortmund nutzt, noch mit der *Westfälischen Emschertalbahn* der Königlich-Westfälischen Eisenbahn (Strecke Welver–Sterkrade[^wikipedia_bahnstrecke_welver_sterkrade]).

## Streckenverlauf

{{ generate_station_map() }}

Auf der zu reaktivierenden Strecke zwischen Gelsenkirchen-Zoo und Bottrop-Vonderort ist der Wiederaufbau der folgenden Halte (**fettgedruckt**) geplant:

- *Strecke Oberhausen-Sterkrade – Duisburg-Neumühl – Duisburg-Meiderich Nord – Duisburg-Ruhrort* (bis Meiderich Nord Teil der VzG-Strecke 2206)[^nrwbahnarchiv_strecke_2206]: Stillgelegt und abgebaut; auf der Trasse verläuft heute der „Grüne Pfad“ (Rad- und Fußweg).

- Oberhausen-Sterkrade: Knoten an der Hollandstrecke (Bahnstrecke Oberhausen–Arnheim), heute von den Linien RE 5 (RRX), RE 19 und RE 49 bedient[^wikipedia_bahnhof_oberhausen_sterkrade]; hier ist der Anschluss an das RRX- und RE-Netz geplant.

- Oberhausen-Osterfeld Süd

- Bottrop-Vonderort: Im Zielnetz genannter Halt; der bestehende Haltepunkt Bottrop-Vonderort liegt an der Bahnstrecke Oberhausen-Osterfeld–Hamm[^wikipedia_bahnstrecke_oberhausen_osterfeld_hamm] und wird heute von der RE 44 bedient.

- **Bottrop Süd**[^geschichte_bottrop_sued]: Ab 1874 im Personenverkehr bedient, 1974 für den Personenverkehr geschlossen; heute Güterbahnhof im Süden der Stadt, im Einzugsgebiet liegen die Stadtteile Batenbrock und Welheim. Der Halt wird im NVP auch *BOT-Ebel/Welheimer Mark* genannt.

- **Essen-Karnap**[^geschichte_bahnhof_karnap]: Haltepunkt im nördlichsten, nördlich der Emscher gelegenen Essener Stadtteil, heute nur noch Ausweichanschlussstelle. Es gibt eine Anbindung zur Stadtbahnlinie U11 sowie an die Buslinien 189 und 263.

- **Gelsenkirchen-Horst Süd**[^geschichte_bahnhof_horst_sued]: 1907 eröffneter, 1971 geschlossener Bahnhof am heutigen Nordsternpark (Standort der Bundesgartenschau 1997). Erhalten ist nur noch die Brücke an der Straße "Zum Bauverein".

- *Strecke Abzweig Nordstern – Gelsenkirchen-Horst Süd – Essen-Karnap – Bottrop Süd – Bottrop-Vonderort – Oberhausen-Osterfeld Süd – Oberhausen-Sterkrade* (VzG-Strecke 2206; Gelsenkirchen-Schalke Nord liegt nicht an dieser Strecke, sondern an der VzG-Strecke 2153 und ist über den Abzweig Nordstern angebunden): durchgehend elektrifizierte, teils ein-, teils zweigleisige Strecke, heute überwiegend im Güterverkehr genutzt. Nur zwischen Oberhausen-Osterfeld Süd und Abzweig Grafenbusch verkehrt mit der RE 44 auch Personenverkehr[^nrwbahnarchiv_strecke_2206].

- **Gelsenkirchen-Schalke Nord**[^geschichte_bahnhof_schalke_nord]: Das denkmalgeschützte Empfangsgebäude von 1930/31 steht an der Caubstraße 27. Der letzte Personenzug verkehrte hier am 26. Mai 1974. Anbindung im Umfeld über die Straßenbahnlinie 302 der Bogestra.

- *Strecke Gelsenkirchen Zoo – Gelsenkirchen-Schalke Nord*: über Gelsenkirchen-Bismarck (VzG-Strecke 2153) und die 1970 in Betrieb genommene Verbindungskurve Schalke Nord – Abzweig Nordstern[^nrwbahnarchiv_strecke_2153]. Die alte Direktverbindung Bismarck – Schalke (VzG-Strecke 2235) ist seit 1970 stillgelegt.

- Gelsenkirchen Zoo: Personenbahnhof an der Strecke über Gelsenkirchen-Bismarck (VzG-Strecke 2153), nicht an der Emschertal-Trasse selbst; heute von der RB 43 bedient, benannt nach dem angrenzenden Ruhr Zoo / ZOOM Erlebniswelt[^wikipedia_bahnhof_gelsenkirchen_bismarck].

- *Strecke Wanne-Eickel Hbf – Gelsenkirchen Zoo*: heutige RB-43-Trasse über Wanne Unser Fritz (VzG-Strecken 2204 und 2153); die ursprüngliche Emschertal-Trasse ab dem Personenbahnhof Wanne-Eickel bis zum Abzweig Bickern (Teil der VzG-Strecke 2206)[^nrwbahnarchiv_strecke_2206] ist seit 1964 abgebaut. Erhalten ist die Güterzugverbindung vom Wanne-Eickel Gbf zum Abzweig Bickern (VzG-Strecke 2205, eröffnet 1911, elektrifiziert)[^nrwbahnarchiv_strecke_2205], von dort führt die eingleisige Strecke 2206 weiter nach Schalke.

- Wanne-Eickel Hbf: Fern- und Regionalverkehrsknoten (u. a. IC, RE und S-Bahn).

- Dortmund Hbf: Östlicher Ausgangspunkt der geplanten Linie S43.

## Projekt-Updates

### 17.01.2023: VRR SPNV-Zielnetz 2040

In dem im Jahr 2023 vorgestellten VRR SPNV-Zielnetz 2040[^vrr_nahverkehrsplan_2025] wird die S-Bahn-Linie S43 vorgestellt, welche sich von Dortmund über Wanne-Eickel Hbf kommend am Bahnhof Gelsenkirchen-Zoo in die Linien S43a und S43b aufteilt. Von dort verläuft die vorgestellte Linie S43b über GE-Schalke Nord, GE-Horst Süd, Essen-Karnap, Bottrop Süd, BOT-Vonderort und Oberhausen-Osterfeld Süd nach OB-Sterkrade.

In den NRW-Zielnetzen 2032 und 2040 des Kompetenzcenters Integraler Taktfahrplan (KC ITF) ist die Strecke dagegen nicht enthalten, und auch eine Machbarkeits- oder Nutzen-Kosten-Untersuchung liegt bisher nicht vor. Die Reaktivierung ist damit eine langfristige und unverbindliche Planung.

### Historischer Personenverkehr bis 1974

Nachdem der Personenverkehr zwischen dem Abzweig Grafenbusch und Duisburg-Ruhrort bereits 1930 eingestellt worden war, bestand auf dem übrigen westlichen Streckenast noch bis in die 1970er Jahre Personenverkehr, der abschnittsweise aufgegeben wurde[^nrwbahnarchiv_strecke_2206]: 1959 zwischen Wanne-Eickel und Gelsenkirchen-Schalke (danach Führung der Züge über Gelsenkirchen-Bismarck), 1969 zwischen Bottrop Süd und der Abzweigstelle Hochstraße, 1970 zwischen Schalke und der Abzweigstelle Nordstern und schließlich am 26. Mai 1974 zwischen Nordstern und Oberhausen-Osterfeld Süd. Seither wird die Strecke nur noch vom Güterverkehr genutzt; regelmäßiger Personenverkehr findet heute nur noch auf dem Abschnitt Wanne-Eickel Hbf – Gelsenkirchen Zoo (RB 43) und auf dem kurzen Abschnitt Oberhausen-Osterfeld Süd – Abzweig Grafenbusch (RE 44) statt.

## Referenzen

- VRR Nahverkehrsplan 2025[^vrr_nahverkehrsplan_2025]
- Bahnstrecke Duisburg-Ruhrort–Dortmund[^wikipedia_bahnstrecke_ruhrort_dortmund]
- NRWbahnarchiv (André Joost): Strecken 2205 und 2206[^nrwbahnarchiv_strecke_2206]
- Wikipedia: Bahnhof Gelsenkirchen-Bismarck[^wikipedia_bahnhof_gelsenkirchen_bismarck]

[^vrr_nahverkehrsplan_2025]: https://nahverkehrsplan.vrr.de/fileadmin/nahverkehrsplan_upload/VRR_Nahverkehrsplan_2025.pdf
[^vrr_fahrplan_rb43_2026]: https://www.vrr.de/fileadmin/user_upload/pdf/fahrplan_und_mobilitaet/RB-Linienplaene_2026/RB43.pdf
[^wikipedia_bahnstrecke_ruhrort_dortmund]: https://de.wikipedia.org/wiki/Bahnstrecke_Duisburg-Ruhrort%E2%80%93Dortmund
[^wikipedia_bahnstrecke_welver_sterkrade]: https://de.wikipedia.org/wiki/Bahnstrecke_Welver%E2%80%93Sterkrade
[^wikipedia_bahnstrecke_oberhausen_osterfeld_hamm]: https://de.wikipedia.org/wiki/Bahnstrecke_Oberhausen-Osterfeld%E2%80%93Hamm
[^nrwbahnarchiv_strecke_2205]: http://nrwbahnarchiv.bplaced.net/strecken/2205.htm
[^nrwbahnarchiv_strecke_2206]: http://nrwbahnarchiv.bplaced.net/strecken/2206.htm
[^nrwbahnarchiv_strecke_2153]: http://nrwbahnarchiv.bplaced.net/strecken/2153.htm
[^wikipedia_bahnhof_oberhausen_sterkrade]: https://de.wikipedia.org/wiki/Bahnhof_Oberhausen-Sterkrade
[^wikipedia_bahnhof_gelsenkirchen_bismarck]: https://de.wikipedia.org/wiki/Bahnhof_Gelsenkirchen-Bismarck
[^geschichte_bahnhof_schalke_nord]: https://www.gelsenkirchener-geschichten.de/wiki/Bahnhof_Schalke-Nord
[^geschichte_bahnhof_horst_sued]: https://www.gelsenkirchener-geschichten.de/wiki/Bahnhof_Horst-S%C3%BCd
[^geschichte_bahnhof_karnap]: http://www.karnap.de/Karnap_im_Wandel/imagepage3.html
[^geschichte_bottrop_sued]: https://bf-b3.zielbahnhof.de/bottrop_stadt.htm
