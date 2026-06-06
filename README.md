# PYTHAI — Website (pythai.ch)

> *Wisdom, foretold.* Die öffentliche PYTHAI-Site, gehostet von **Warren**.
> Aus dem PYTHAI Design System gebaut.

**Repo:** `danielcraid/pythai-website` · **Hosting:** Vercel (Auto-Deploy bei Push) · **Domain:** pythai.ch

> Ordner heißt nach dem ersten Deploy `pythai-website` (umbenannt via `PYTHAI-Website-Deploy.command`).

---

## Seiten

`index.html` (Landing) · `reading.html` · `signals.html` · `playbook.html` ·
`inner-circle.html` · `manifesto.html` · `register.html` · `legal.html`

Alle laden dieselben Skripte aus `js/` (in dieser Reihenfolge):
`react` · `react-dom` · `lucide` · `ds-bundle` (DS-Komponenten) · `brand-buttons` (Serif-CTAs) ·
`i18n` (DE/EN) · `ds-landing` (Hero/Reading/Pricing) · `site` (Nav/Footer) · `pagekit` (Seiten-Helfer) ·
`page-*` (die jeweilige Seite).

- **Zweisprachig** DE/EN — Default nach Browser-Sprache, Toggle in der Nav, Wahl in `localStorage`.
  Brand-Begriffe & Headlines bleiben englisch; Fließtexte werden übersetzt.
- **Statisch** — kein Build-Step nötig; Vercel serviert die Dateien direkt.
- React/Lucide sind lokal vendored (`js/*.min.js`), Fonts via Google Fonts CDN.

## API-Endpoints (Backend = VPS)

Das Frontend ruft `https://api.pythai.ch/api/*` auf:
`/api/waitlist` (Inner Circle), `/api/register`, `/api/auth/google`. Diese laufen auf dem VPS,
nicht auf Vercel. Siehe `../pythai-deploy-prep.md`.

## Lokal testen

```bash
cd pythai-website
python3 -m http.server 8080   # → http://localhost:8080
```

## Deploy (Vercel)

1. Einmalig `PYTHAI-Website-Deploy.command` doppelklicken → benennt Ordner um, pusht zu
   `danielcraid/pythai-website`.
2. In Vercel das Repo importieren (Framework **Other**, Build leer, Output Root) → Deploy.
3. Domain `pythai.ch` + `www.pythai.ch` in Vercel hinzufügen, DNS-Werte bei IONOS eintragen.
4. Ab dann: **jeder `git push` deployt automatisch.**

## Neu bauen (wenn sich Design System / Inhalte ändern)

Die Seiten-Skripte werden mit esbuild aus JSX-Quellen kompiliert (Hero, Nav, Seiten).
Quellen + Build-Befehle liegen in der Cowork-Arbeitsumgebung; bei Änderungswunsch dort neu kompilieren
und `js/` aktualisieren.

## CTAs / offene Punkte

- „Enter the Sanctum" / „Seek counsel" → Waitlist-Form (postet an `api.pythai.ch/api/waitlist`).
- „Sign in" / Register → `register.html` (Google-OAuth + E-Mail; Backend Phase 1 auf VPS).
- Legal-Seite ist Entwurf — vor Live-Gang anwaltlich prüfen.
