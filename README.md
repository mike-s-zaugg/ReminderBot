# ReminderBot

Ein einfacher Discord-Bot zum Erstellen von Erinnerungen per Slash-Command.

## Features
- `/remind` mit Nachricht + Zeitangaben
- Tage, Stunden, Minuten, Sekunden
- Optionale Zeitparameter
- Antwort bei Start und bei Erinnerung
- Einfache Nutzung ohne Datenbank
- Globale Slash-Commands

## Voraussetzungen
- Node.js 18+
- Discord Bot (Application)
- Token und Client-ID

## Installation
1. Repo klonen
2. Abhängigkeiten installieren:
   `npm install`
3. `.env` Datei erstellen:
- DISCORD_TOKEN=dein_token
- CLIENT_ID=deine_client_id

4. Bot starten:
   `npm start`

## Slash-Command
`/remind nachricht:<text> days:<int?> hours:<int?> minutes:<int?> seconds:<int?>`

`nachricht` ist required. Rest optional.

## Beispiel
`/remind nachricht:"Meeting" minutes:10`

Bot:
`⏳ Ich erinnere dich in 0d 0h 10m 0s: Meeting`

Nach 10 Minuten:
`⏰ Erinnerung: Meeting`

## Hinweise
- Zeit wird per `setTimeout` ausgeführt
- Lang laufende Prozesses z. B. per PM2
- Next Steps: DB, Mehrere Erinnerungen, DM Support, wiederkehrende Timer


