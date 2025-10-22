# GTM Dashboard Quick Setup Guide
**⏱️ Tijd:** 10-15 minuten | **Prioriteit:** 🔴 HOOG

---

## 🎯 Doel
GA4 tracking activeren voor www.mr-dj.nl door GTM dashboard te configureren.

---

## 📋 Voor je begint

**Je hebt nodig:**
- ✅ GTM Login: info@mr-dj.nl (wachtwoord in vault)
- ✅ GA4 Login: info@mr-dj.nl (wachtwoord in vault)
- ✅ Container ID: GTM-TK95XXK
- ✅ Measurement ID: G-166LYYHW64

**Status check:**
- ✅ GTM code al geïnstalleerd op website
- ✅ Event tracking JavaScript al geïmplementeerd
- ⏳ Alleen dashboard configuratie nodig

---

## 🚀 Stap 1: GA4 Configuration Tag (VERPLICHT)

**⏱️ Tijd:** 3 minuten

### 1.1 Inloggen
1. Ga naar: https://tagmanager.google.com
2. Login met: info@mr-dj.nl
3. Selecteer container: **GTM-TK95XXK**

### 1.2 Tag Aanmaken
1. Klik **"Tags"** (linker menu)
2. Klik **"New"** (rechts boven)
3. Klik op tag configuratie blok (boven)

### 1.3 Configureren
**Tag Type:**
- Selecteer: **"Google Analytics: GA4 Configuration"**

**Settings:**
```
Measurement ID: G-166LYYHW64
```

**Configuration Settings:**
- ✅ **Send a page view event** (aanvinken)
- Klik **"Configuration Settings"** uitvouwen:
  - Cookie Domain: `auto`
  - Enhanced Measurement: ✅ (aanvinken)

**Tag Naam (boven):**
```
GA4 - Configuration
```

### 1.4 Trigger Instellen
1. Klik op trigger blok (onder)
2. Selecteer: **"All Pages"** (Initialization - All Pages)

### 1.5 Opslaan
1. Klik **"Save"** (rechts boven)
2. ✅ Tag is aangemaakt!

---

## 🎉 Stap 2: Publiceren (VERPLICHT)

**⏱️ Tijd:** 1 minuut

1. Klik **"Submit"** (rechts boven, blauwe knop)
2. Vul in:
   ```
   Version Name: GA4 Initial Setup
   Version Description: Configured GA4 tag with Measurement ID G-166LYYHW64
   ```
3. Klik **"Publish"**
4. ✅ Live!

---

## ✅ Stap 3: Verificatie (VERPLICHT)

**⏱️ Tijd:** 2 minuten

### 3.1 Preview Mode Test
1. In GTM Dashboard, klik **"Preview"** (rechts boven)
2. Voer URL in: `https://www.mr-dj.nl` (of staging URL)
3. Klik **"Connect"**
4. Nieuwe tab opent met debug venster
5. Check:
   - ✅ "Tag Assistant Connected" bericht
   - ✅ "GA4 - Configuration" tag in "Tags Fired" lijst
   - ✅ Geen errors

### 3.2 GA4 Real-time Check
1. Open nieuw tabblad: https://analytics.google.com
2. Login met info@mr-dj.nl
3. Selecteer property: **Mr. DJ Website**
4. Ga naar: **Reports → Realtime**
5. Je zou nu moeten zien:
   - ✅ **1+ active users**
   - ✅ **Page views incrementing**

### 3.3 Success! 🎉
Als je active users en page views ziet → **Alles werkt!**

---

## 📊 Stap 4: Event Tags (OPTIONEEL - kan later)

**⏱️ Tijd:** 10 minuten | **Prioriteit:** 🟡 MEDIUM

Deze stap is optioneel maar wel aanbevolen voor conversie tracking.

### 4.1 Custom Event Trigger Aanmaken

Voor elk event hieronder, maak een trigger aan:

**Navigatie:** Triggers → New

#### Trigger 1: Contact Form Submit
```
Trigger Type: Custom Event
Trigger Name: Contact Form Submit
Event name: contact_form_submit
This trigger fires on: All Custom Events
```

#### Trigger 2: WhatsApp Click
```
Trigger Type: Custom Event
Trigger Name: WhatsApp Click
Event name: whatsapp_click
This trigger fires on: All Custom Events
```

#### Trigger 3: Phone Click
```
Trigger Type: Custom Event
Trigger Name: Phone Click
Event name: phone_click
This trigger fires on: All Custom Events
```

#### Trigger 4: Quote Request
```
Trigger Type: Custom Event
Trigger Name: Quote Request
Event name: quote_request
This trigger fires on: All Custom Events
```

### 4.2 Event Tags Aanmaken

Voor elk event, maak een tag aan:

**Navigatie:** Tags → New

**Template voor alle event tags:**
```
Tag Type: Google Analytics: GA4 Event
Tag Name: GA4 - Event - [Event Name]
Configuration Tag: GA4 - Configuration (selecteer uit dropdown)
Event Name: [event_name zoals in trigger]

Trigger: [Selecteer bijbehorende trigger]
```

**Voorbeeld voor Contact Form:**
```
Tag Type: Google Analytics: GA4 Event
Tag Name: GA4 - Event - Contact Form Submit
Configuration Tag: GA4 - Configuration
Event Name: contact_form_submit

Trigger: Contact Form Submit
```

Herhaal voor:
- WhatsApp Click (event_name: `whatsapp_click`)
- Phone Click (event_name: `phone_click`)
- Quote Request (event_name: `quote_request`)

### 4.3 Publiceren
1. Klik **"Submit"** (rechts boven)
2. Version Name: `Custom Events Setup`
3. Klik **"Publish"**

---

## 🎯 Stap 5: Conversies Markeren (OPTIONEEL)

**⏱️ Tijd:** 3 minuten | **Prioriteit:** 🟡 MEDIUM

### 5.1 Wacht 24 uur
- Events moeten eerst data hebben voordat je ze als conversie kunt markeren
- Kom morgen terug voor deze stap

### 5.2 Markeer als Conversie (na 24 uur)
1. Ga naar: https://analytics.google.com
2. Admin → Events
3. Zoek deze events:
   - `contact_form_submit`
   - `whatsapp_click`
   - `phone_click`
   - `quote_request`
4. Vink **"Mark as conversion"** aan voor elk event
5. ✅ Done!

---

## 🐛 Troubleshooting

### "Geen active users in Realtime"
**Oorzaken:**
- Wacht 30-60 seconden na pagina load
- Check of je ad blocker aan staat (zet uit)
- Ververs de pagina

**Fix:**
1. Open browser console (F12)
2. Check voor errors
3. Type: `console.log(window.dataLayer)`
4. Moet array tonen, niet `undefined`

### "Tag vuurt niet in Preview mode"
**Fix:**
1. Check trigger configuratie (moet "All Pages" zijn)
2. Refresh Preview session
3. Hard refresh website (Ctrl+Shift+R)

### "Event tags vuren niet"
**Check:**
1. Is Custom Event trigger correct gespeld?
2. Event name moet exact matchen JavaScript code
3. Check browser console voor `console.log('GTM Event:')` messages

---

## 📱 Mobile Friendly Checklist

Print deze checklist of open op je telefoon:

**Minimale Setup (MOET):**
- [ ] GTM Dashboard login
- [ ] GA4 Configuration tag aangemaakt
- [ ] Measurement ID: G-166LYYHW64 ingevuld
- [ ] Trigger: All Pages ingesteld
- [ ] Tag naam: GA4 - Configuration
- [ ] Submit & Publish
- [ ] Preview mode test: tag vuurt
- [ ] GA4 Realtime: 1+ users visible

**Uitgebreide Setup (KAN):**
- [ ] 4 Custom Event triggers aangemaakt
- [ ] 4 Event tags aangemaakt
- [ ] Submit & Publish
- [ ] Test elk event in Preview mode
- [ ] Na 24u: Conversies markeren

---

## 🎓 Tips & Tricks

**Tip 1: Use Preview Mode vaak**
- Preview mode is je beste vriend
- Test ALTIJD na elke wijziging
- Kost geen extra tijd, voorkomt bugs

**Tip 2: Naming Convention**
- Gebruik altijd prefix: `GA4 - `
- Gebruik descriptive names
- Voorbeeld: ✅ `GA4 - Event - Contact Form Submit`
- Niet: ❌ `Contact Form Tag 1`

**Tip 3: Version Names**
- Gebruik duidelijke version names
- Voorbeeld: ✅ `GA4 Initial Setup`
- Niet: ❌ `Version 1`

**Tip 4: Test op echte device**
- Desktop én mobile testen
- Verschillende browsers
- Ad blocker uit!

---

## ⏭️ Na Setup

**Direct:**
1. Monitor GA4 Realtime dagelijks (eerste week)
2. Check voor errors in browser console
3. Verifieer events worden getriggerd

**Deze week:**
1. Maak screenshot van Realtime rapport (proof it works)
2. Deel met team
3. Setup weekly analytics review meeting

**Volgende maand:**
1. Analyseer data
2. Maak custom reports
3. Optimize CTA's based on data

---

## 📞 Support

**GTM Docs:**
https://support.google.com/tagmanager

**GA4 Docs:**
https://support.google.com/analytics/answer/10089681

**Mr. DJ Docs:**
- Full Guide: `/srv/apps/mr-djv1/docs/GTM_GA4_CONFIGURATION_GUIDE.md`
- Status: `/srv/apps/mr-djv1/docs/GTM_GA4_IMPLEMENTATION_STATUS.md`

---

## ✅ Success Criteria

**Je weet dat het werkt als:**
- ✅ GA4 Realtime toont active users
- ✅ Page views incrementeren bij navigatie
- ✅ Console logs tonen: `GTM Event:` messages
- ✅ Preview mode toont tags firing
- ✅ Geen JavaScript errors in console

**Klaar? Deploy naar productie! 🚀**

---

**Laatste check:**
- [ ] GA4 Configuration tag: DONE
- [ ] Published: DONE
- [ ] Tested: DONE
- [ ] Realtime shows data: DONE

**Status:** ✅ Analytics fully operational!
