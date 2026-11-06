const express = require('express');

const app = express();
app.set('view engine', 'pug');

const BASE = 'https://rickandmortyapi.com/api';
const cache = {};

const sleep = (seconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });

// Fetch a URL. If the API says "too many requests", wait and try again.
async function fetchJson(url, attempt = 1) {
  const res = await fetch(url);
  if (res.ok) return res.json();
  if (res.status !== 429 || attempt >= 5) {
    throw new Error(`API error ${res.status} for ${url}`);
  }
  await sleep(
    Math.min(Number(res.headers.get('retry-after')) || attempt * 2, 30),
  );
  return fetchJson(url, attempt + 1);
}

// Follow the API's "next" link one page at a time
// Pages are requested one after another to avoid rate limiting.
async function getPages(url, maxPages) {
  const data = await fetchJson(url);
  if (!data.info.next || maxPages <= 1) return data.results;
  const rest = await getPages(data.info.next, maxPages - 1);
  return [...data.results, ...rest];
}

// Results are kept in memory so each list is only fetched once per server run.
async function getAll(resource, maxPages = Infinity) {
  const key = `${resource}-${maxPages}`;
  if (!cache[key]) cache[key] = await getPages(`${BASE}/${resource}`, maxPages);
  return cache[key];
}

// Group item names by a field, putting blank values under "unknown".
function groupBy(items, field) {
  const groups = {};
  items.forEach((item) => {
    const key = item[field] || 'unknown';
    groups[key] = groups[key] || [];
    groups[key].push(item.name);
  });
  return groups;
}

app.get('/', (req, res) => res.redirect('/home'));

app.get('/home', (req, res) => res.render('home'));

app.get('/characters', async (req, res, next) => {
  try {
    const characters = (await getAll('character', 5)).slice(0, 100);
    res.render('characters', { characters });
  } catch (err) {
    next(err);
  }
});

app.get('/species', async (req, res, next) => {
  try {
    const groups = groupBy(await getAll('character'), 'species');
    res.render('species', { groups });
  } catch (err) {
    next(err);
  }
});

app.get('/locations', async (req, res, next) => {
  try {
    const groups = groupBy(await getAll('location'), 'type');
    res.render('locations', { groups });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .send("Couldn't load data from the Rick and Morty API. Try refreshing.");
});

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});
