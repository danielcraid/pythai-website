# LC HANDOFF — Warren-Inbox-Whitelist Toggle (`/admin`)

**Branch:** `feat/admin-warren-whitelist-toggle`
**Datum:** 2026-06-19
**Anlass:** Daniel will Warren-Inbox-Member-Auswahl visuell pro Notion-Property + Schnell-Toggle in `/admin` verwalten. Pattern: CRAID-CRM (Notion = Source of Truth, pythai-api liest, /admin SPA als UI).

## Was bereits gebaut ist (Backend, lokal auf VPS, live)

- **Notion-Property** `Warren-Inbox-Enabled` (Checkbox) auf Members-DB ist angelegt
- **API-Endpoints** (cookie-session-auth, admin-only):
  - `GET /api/admin/whitelist` → `{ ok, property_name, total, enabled_count, members: [{email, tier, nickname, approval, mailsActive, lastLogin, memberSince, enabled, pageId}] }`
  - `POST /api/admin/whitelist/toggle` `{email, enabled}` → `{ok, email, enabled, note}`
- **CLI** `node scripts/sync_warren_whitelist.js {list|add|remove|status|sync}`
- **Sync-Cron** `*/5 * * * *` schreibt `state/warren_inbound_whitelist.json` (von warren_inbound.mjs gelesen)

## Was diese PR ändert (Frontend)

**1 Datei:** `js/page-admin.js`

- **Neue Component `WarrenWhitelist`** (~95 Zeilen) zwischen `AdminInvite` und `InviteLog`.
- **Visuell:** Card-Layout im PYTHAI-Design (PyEyebrow, h3-Header, Counter, Filter-Input, Member-Liste mit Custom-Toggle-Switch).
- **Funktion:**
  - Auto-load via `GET /api/admin/whitelist` beim Mount
  - Filter (E-Mail / Nickname / Tier)
  - Pro Zeile: Email + Tier-Badge + Nickname + Toggle-Switch
  - Toggle-Klick → optimistic UI + `POST /api/admin/whitelist/toggle`
  - Loading/Error/Empty States
- **Style:** Toggle-Switch ist custom (kein lucide), matched zum Gold/Oracle-Accent. Disabled-State während Pending-API-Call.
- **i18n:** alle Strings via `T(de, en)`.

**Keine neuen Abhängigkeiten.** Nutzt nur existing DesignSystem (`Card`, `Button`-Style nicht direkt verwendet — eigenes Toggle), React-Hooks (`useState`, `useEffect`), bestehende `PyEyebrow`.

## Test-Plan

1. Login als Daniel (admin), navigiere zu `/admin`
2. Section „Warren-Inbox-Whitelist" sollte zwischen „Einladung versenden" und „Versendete Einladungen" sichtbar sein
3. Liste lädt alle Member aus Notion, Counter zeigt `N von M aktiv`
4. Filter testen (E-Mail-Teilstring)
5. Toggle bei einem Member klicken → Switch wechselt sofort, danach API-Call, danach lokaler State synchronisiert
6. Bei Fehler (z.B. Notion-Down): Toggle-Switch geht zurück
7. Cross-Tab: Notion-Checkbox in Members-DB ändern → nach max. 5 min Reload zeigt neuen State (Sync-Cron)

## Smoke-Test im Browser

```js
// In Devtools console nach Login als admin:
fetch('https://api.pythai.ch/api/admin/whitelist', { credentials: 'include' })
  .then(r => r.json()).then(d => console.log(d.enabled_count, '/', d.total));
```

Erwartung: kleines Objekt mit Members-Array.

## Visuelles Wireframe

```
╭─ Warren-Inbox-Whitelist ────────────────────────────────╮
│ Wer darf Warren schreiben?                              │
│ Nur Member auf der Whitelist kriegen den Warren-Reply-  │
│ Loop. Andere Mails werden direkt an dich weitergeleitet.│
│                                                          │
│   2  von 5 aktiv                                         │
│                                                          │
│ [ Filter: E-Mail / Nickname / Tier ____________________ ]│
│                                                          │
│ ─────────────────────────────────────────────────────── │
│ daniel@craid.de                                  [●━]   │
│ Syndicate · Daniel                                       │
│ ─────────────────────────────────────────────────────── │
│ daniel.simon@mac.com                             [●━]   │
│ Inner Circle                                             │
│ ─────────────────────────────────────────────────────── │
│ hello@spalkmusic.com                             [━○]   │
│ Syndicate                                                │
│ ─────────────────────────────────────────────────────── │
│ Sync-Cron läuft alle 5 min. Notion-Checkbox „Warren-     │
│ Inbox-Enabled" ist die Quelle.                           │
╰──────────────────────────────────────────────────────────╯
```

## Schon-Review-Punkte

- [ ] Visuelle Konsistenz mit `AdminInvite`-Card (Padding, PyEyebrow, h3-Größe)
- [ ] Toggle-Switch macht visuelle Antwort bei Klick auch wenn Backend langsam (optimistic update + pending-state)
- [ ] Mobile-Layout: Member-Zeile bricht nicht (Email ellipsis bei < 360px)
- [ ] Disabled-Toggle während Pending: cursor: wait, opacity: 0.5
- [ ] Filter-Empty-State („Kein Treffer.")

## Optional-Erweiterungen (nicht in dieser PR)

- Sortier-Pills (nach Tier / nach Enabled / nach Last-Login)
- Bulk-Toggle (alle Syndicate enable)
- Rate-Limit-Counter pro Member (würde extra Backend-Field `rate_limit_used` brauchen)

## Vor Merge

- Backend-Routes (`/api/admin/whitelist*`) sind seit 19.06.2026 19:30 CET live auf api.pythai.ch
- Auth-Gate funktioniert: `curl https://api.pythai.ch/api/admin/whitelist` ohne Cookie → 401

## Kontakt

Wenn Auth-Gate kaputt oder Member-Array leer trotz vorhandener Member: VPS-Log `journalctl --user -u pythai-api -n 50` checken.
