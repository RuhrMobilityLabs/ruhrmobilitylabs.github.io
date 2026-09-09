---
description: Neubaustrecke der Essener Straßenbahn auf der West-Ost-Achse von Essen Bergeborbeck über ESSEN 51 zum Betriebshof Stadtmitte. Teil des Projektes ist eine neue oberirdische Straßenbahnhaltestelle am Hauptbahnhof, um den U-Bahn-Tunnel zu entlasten.
project_type: neubau
transport_type: stadtbahn
status: im_bau
latitude: 51.452
longitude: 7.013
cities:
  - Essen
stations:
  - name: "Betriebshof Stadtmitte"
    latitude: 51.459669
    longitude: 7.021444
  - name: "Hollestraße"
    latitude: 51.453967
    longitude: 7.020773
    connects_to: ["Betriebshof Stadtmitte"]
  - name: "Hauptbahnhof (oberirdisch)"
    latitude: 51.452247
    longitude: 7.014014
    connects_to: ["Hollestraße"]
  - name: "Hindenburgstraße"
    latitude: 51.451537
    longitude: 7.006740
    connects_to: ["Hauptbahnhof (oberirdisch)"]
  - name: "Schwanenkampbrücke"
    latitude: 51.451426
    longitude: 6.996735
    connects_to: ["Hindenburgstraße"]
  - name: "Westendhof"
    latitude: 51.452727
    longitude: 6.993554
    connects_to: ["Schwanenkampbrücke"]
  - name: "Frohnhauser Straße"
    latitude: 51.45478
    longitude: 6.99057
    connects_to: ["Westendhof"]
  - name: "Krupp-Park"
    latitude: 51.462858
    longitude: 6.988034
    connects_to: ["Frohnhauser Straße"]
  - name: "Zeche Amalie"
    latitude: 51.468305
    longitude: 6.985309
    connects_to: ["Krupp-Park"]
  - name: "Zollstraße"
    latitude: 51.471266
    longitude: 6.979902
    connects_to: ["Zeche Amalie"]
  - name: "Bergmühle"
    latitude: 51.473057
    longitude: 6.977370
    connects_to: ["Zollstraße"]
  - name: "Bocholder Straße"
    latitude: 51.476391
    longitude: 6.978561
    connects_to: ["Bergmühle"]
  - name: "Bergeborbeck Bf"
    latitude: 51.478817
    longitude: 6.976855
    connects_to: ["Bocholder Straße"]
---

# Citybahn Essen

{{ badge(project_type, "#0d6efd") }} {{ badge(transport_type, "#fd7e14") }} {{ badge(status, "#6c757d") }} {% for city in cities %}{{ badge(city, "#198754") }} {% endfor %}

Neubaustrecke der Essener Straßenbahn auf der West-Ost-Achse von Essen Bergeborbeck über ESSEN 51 zum Betriebshof Stadtmitte. Teil des Projektes ist eine neue oberirdische Straßenbahnhaltestelle am Hauptbahnhof, um den U-Bahn-Tunnel zu entlasten.

Die Citybahn soll die Kapazitäten im Essener Straßenbahnnetz erhöhen und den stark ausgelasteten
Tunnel am Hauptbahnhof entlasten. Durch die oberirdische Führung kann beispielsweise die Linie 105
aus dem Tunnel herausgenommen werden. Dadurch entstehen zusätzliche Kapazitäten für andere Linien.
Gleichzeitig schafft sie eine neue direkte Ost-West-Verbindung: Vom Ostviertel über den Hauptbahnhof
und das Westviertel bis nach ESSEN 51[^essen51] und weiter Richtung Bergeborbeck.
Ein Schwerpunkt ist die Anbindung des neuen Stadtquartiers ESSEN 51 an die Innenstadt.
Von dort soll der Hauptbahnhof künftig in rund 8,5 Minuten erreichbar sein[^citybahn_essen].

Offizielle Webseite: [citybahn-essen.de](https://www.citybahn-essen.de/)

{{ generate_station_map() }}

## Bauabschnitte

Das Projekt lässt sich in insgesamt drei Bauabschnitte unterteilen[^bauabschnitte_citybahn]:

### 1. Bauabschnitt: Bahnhofstangente {{ badge("Im Bau", "#198754") }}

Der erste Bauabschnitt führt vom Betriebshof Stadtmitte, über die Hollestraße, die neue oberirdische
Haltestelle am Hauptbahnhof und die Hachestraße zur Kreuzung der Hans-Böckler-Straße.

Die folgenden Stationen entstehen:

- *Betriebshof Stadtmitte*
- Hollestraße (bestehend, wird umgebaut)
- *Hauptbahnhof (oberirdisch)*
- *Hindenburgstraße*

### 2. Bauabschnitt: Berthold-Beitz-Boulevard {{ badge("Im Bau", "#198754") }}

Der zweite Bauabschnitt führt von der Kreuzung Hachestraße/Hans-Böckler-Straße bis zur Kreuzung
Frohnhauser Straße/Berthold-Beitz-Boulevard und wird dort an die bestehende Trasse auf dem
Berthold-Beitz-Boulevard angebunden.

Die folgenden Stationen entstehen:

- *Schwanenkampbrücke*
- *Westendhof*
- Frohnhauser Straße (bestehend, wird umgebaut)

### 3. Bauabschnitt: ESSEN 51 {{ badge("Im Bau", "#198754") }}

Der dritte Bauabschnitt beginnt an der Kreuzung Berthold-Beitz-Boulevard/Altendorfer Straße und wird
weiter über den Berthold-Beitz-Boulevard bis zum Neubaugebiet ESSEN 51 nördlich der Pferdebahnstraße
geführt. Von dort verläuft der dritte Bauabschnitt durch das Neubaugebiet über die Zollstraße und
Haus-Berge-Straße, wo dieser an der Bergmühle an die bestehende Trasse anknüpft.

Die folgenden Stationen entstehen:

- *Krupp-Park*
- *Zeche Amalie*
- *Zollstraße*
- Bergmühle (bestehend, wird umgebaut)

## Referenzen

- [Offizielle Webseite der Citybahn (citybahn-essen.de)](https://www.citybahn-essen.de/)

[^bauabschnitte_citybahn]: https://www.citybahn-essen.de/planung-bau/bauabschnitte
[^essen51]: https://www.essen.de/e_magazin/emagazin_1578193.de.html
[^citybahn_essen]: https://www.essen.de/leben/mobilitaet/oepnv/citybahn.de.jsp