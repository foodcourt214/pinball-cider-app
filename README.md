# Food Court Creative — site redesign

A redesign of [foodcourtcreative.com](https://www.foodcourtcreative.com) built
with React 19, Vite and Tailwind CSS 4. All 14 case studies from the live site
are ported into `src/data/caseStudies.js`.

## Develop

```
npm install
npm run dev
```

## Build

```
npm run build   # outputs to dist/
```

## Adding real imagery

Case studies currently render art-directed placeholder covers in each brand's
colors. To swap in real photography, see `src/assets/work/README.md` — drop a
`cover.jpg` into the matching slug folder and it's picked up automatically.

## Editing content

Everything — copy, services, categories, brand colors — lives in
`src/data/caseStudies.js`. Add a new case study by appending an object there;
the work grid, filters and detail page are generated from the data.
