# Sevi செவி — live captions, smart notes and a voice for deaf and hard-of-hearing students and IT professionals

## The problem
Deaf and hard-of-hearing students and IT professionals in India sit in lectures, stand-ups and client calls where people speak **Tamil/Hindi mixed with English**. Common captioning tools are built for plain English and fail on code-mixed speech and technical words. People also cannot easily reply: they miss their name being called, miss deadlines, and have no quick way to speak up.

## What Sevi does
1. **Live captions** in big, adjustable text (3 themes incl. high-contrast yellow-on-black). **Gnani Prisma v3.0** auto-detects the language and handles code-mixed speech.
2. **Visual alerts:** when **your name** or an **alert word** is spoken (exam, deadline, deploy, bug, …), the screen flashes and the phone vibrates (optional beep for partial hearing).
3. **Colour-coded lines:** ❓ questions, ✅ action items, 📅 dates/deadlines, ⭐ keywords.
4. **Smart notes (automatic):** key terms, questions, action items, deadlines and a 3-sentence summary; **download as Markdown** after class or the meeting.
5. **Technical glossary:** add words like "Kubernetes"; mis-spellings such as "cubernetes" are corrected.
6. **Speak for me:** type (or tap quick phrases like "Could you speak slower?", "I have a doubt") and **Gnani Timbre** says it aloud in a natural Indian voice, in 10 languages. **Show big** displays the text full-screen for the speaker.
7. Works as a **study tool for anyone**: searchable notes of every class.

## Run
1. Node.js 18+. Copy `.env.example` to `.env`, add `GNANI_API_KEY` (app.gnani.ai/voice).
2. `node server.js` → open **http://localhost:3000** in Chrome → allow the microphone → **Start captions**.
3. `node test.js` runs 18 brain tests.
Without a Gnani key it falls back to the browser's speech recognition (English/Tamil/Hindi, chosen manually) so you can still demo.

## 3-minute demo script
1. Enter your name, pick **IT meeting** or **Class**, add glossary words. Press **Start captions**, speak Tanglish: "Ravi, tomorrow we deploy the release, and the Kubernetes bug must be fixed by Friday."
2. Show the colour-coded lines, the **flash + vibration alert** on your name, and the live **Smart notes**.
3. **Speak for me:** tap "Could you speak a little slower?" → hear it in Tamil. **Show big**.
4. **Save notes** → open the Markdown file.
5. Close: "Next: word-by-word captions with Gnani's real-time WebSocket API, speaker labels, and a mobile app."

## Honest limitations
- Captions appear **after each pause** (about 1–2 s), not word by word. A real-time WebSocket version is the upgrade path.
- No speaker labels yet; sound alerts beyond speech (doorbell, alarms) are not detected.
- Notes, alerts and the glossary are **rule-based** (keywords and patterns), not an AI model; the summary is extractive.
- Accuracy depends on the room microphone. Test with your own speech.
- Quick phrases in Tamil and Hindi are machine-translated; have native speakers review. Audio is sent to Gnani.ai for recognition and is not stored by this server.
- Not a certified medical or legal accessibility service.
