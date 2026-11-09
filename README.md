# Stockholm Open — inofficiellt koncept

En svensk-först sajt för inomhusveckan i Kungl. Tennishallen, byggd som ett designkoncept i kvällsljus. Den är inte arrangörens webbplats, säljer inga biljetter och är inte kopplad till en livescore.

Matcherna är en ögonblicksbild av offentliga sidor den 9 november 2026. Se [Om konceptet](http://127.0.0.1:47291/om) när servern är igång.

## Köra lokalt

```bash
npm install
npm run dev
```

Öppna http://127.0.0.1:47291

```bash
npm test
npm run lint
npm run build
```

## Data

All turneringsdata läses via `src/lib/data/adapter.ts`. Själva ögonblicksbilden ligger i `players.ts`, `matches.ts` och `editorial.ts`. En senare riktig källa kan implementera samma funktioner utan att sidorna skrivs om. Den här versionen har `live: false`.
