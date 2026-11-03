<<<<<<< HEAD
# funda-hub
=======
# Funda KZN Hub: mobile app

One React Native app (Expo, TypeScript, Expo Router) for learners from Grade R to 9 and their parents.
It runs on Android, iOS and the web from the same code.

This is the **front end**. It shows no sample data: you add real learners, and progress comes from lessons they finish. Nothing talks to a server yet, so data lives in memory and is lost when the app closes.

## Run it

```bash
npm install
npx expo start
```

Then press `a` for an Android emulator, scan the QR code with the **Expo Go** app on a phone, or press `w` for the browser.

On first run: enter a parent email, make a 4-digit PIN in the parent area, then add a learner.

Run the tests with `npm test`.

Before relying on it, run `npx expo install --fix` once. The dependency versions were pinned from Expo SDK 58's own compatibility list, but the compatibility service could not be reached while this was built.

## The one idea: how one app becomes several

Two things decide what anyone sees: **who is using the phone** and **how old they are**.

```
sign in once (parent)
   -> "Who is learning today?"  (shared-phone picker)
        -> learner profile  -> age band from grade -> theme + tab bar + home layout
        -> Parent area (PIN) -> parent theme + parent tabs
```

| Piece | File | What it does |
| --- | --- | --- |
| Age bands | `src/theme/bands.ts` | Grade 0-3 foundation, 4-6 intermediate, 7-9 senior. Also holds behaviour that differs by band (tutor tab, read-aloud, answer layout). |
| Themes | `src/theme/tokens.ts` | Colours, fonts, corner radius, tap size and border style for the three learner looks plus the parent look. |
| Active profile | `src/state/session.ts` | Who is signed in and which profile is active. Learners never type a password. |
| Guards | `src/app/_layout.tsx` | `Stack.Protected` decides which route groups exist for the current state. Changing profile moves the user automatically. |
| Tab bars | `src/app/learner/_layout.tsx`, `src/app/parent/_layout.tsx` | Grade R-3 gets 3 tabs; older learners get a 4th for the tutor. |
| Home screens | `src/components/home/*Home.tsx` | The only learner screen with three different layouts. |
| Lesson player | `src/app/lesson/[id].tsx` | One player for everyone. Foundation reads questions aloud and skips explanations. |

Shared components (`src/components/ui`) read the active theme, so a `Button` or `Card` looks right in every band without being rewritten.

```
src/
  app/            routes: sign-in, who-is-learning, parent-pin, learner/*, parent/*, lesson/[id]
  components/ui/  Button, Card, Text, Icon, ProgressBar, TabBar...
  components/home/, components/parent/
  data/           types.ts
  content/        starter lessons (placeholder study material)
  domain/         progress, streak, badge, report and household logic (unit tested)
  config/         feature flags for things that need the backend
  state/          session store
  theme/          bands, tokens, ThemeProvider
```

## What is real and what is a stand-in

Real: navigation, role and age-band separation, all screens, themes, lesson player, read-aloud, tutor chat UI.

Stand-ins you will replace:

- `src/state/session.ts`: the in-memory store for the household and lesson results. Replace with the backend plus on-device storage.
- `src/content/lessons.ts`: starter lessons only. The tutor's own material replaces these.
- AI tutor and parent messages (`features.tutorChat`, off): hidden until built. The real tutor must run on a server with cost limits and child-safety filtering, never inside the app.
- Parent PIN: made by the parent on first use; a convenience gate only. Anything that matters (plan changes, deleting a learner) must be checked on the server behind the parent's real login.
- Payments: the parent screen links out to the website (`WEB_ACCOUNT_URL`). Payments are deliberately not in the app. Check Google Play's current billing rules for South Africa before launch.
- Mascot "Funi": an original placeholder (`src/components/ui/Mascot.tsx`). Swap for the final brand art.
- Only Maths has lessons for Grade 4-9, and each Grade R-3 world has one short lesson. Other subjects say "coming soon".

## Not done yet

- Offline downloads and syncing answers later (important for low-data homes).
- Real accounts and database (Supabase was the plan).
- Push notifications and WhatsApp reports.
- isiZulu interface text and voice, and the tutor's isiZulu quality needs a native speaker to check.
- Automated tests.
>>>>>>> f52092e (feat: add TabBar, TabButton, Text, and Toggle components for UI)
