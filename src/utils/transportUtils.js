import { haversineKm } from './geoUtils'

/**
 * Known city-pair data for common Europe routes.
 * Format: [trainHours, trainCostMin, trainCostMax, flightHours, flightCostMin, flightCostMax, trainFeasible]
 * Costs in USD. Airport overhead (~4.5h) added separately for flights.
 */
const CITY_PAIRS = {
  'Amsterdam|Paris':      [3.3,  45,  95,  1.3,  45, 130, true],
  'Amsterdam|London':     [4.0,  60, 200,  1.2,  40, 180, true],
  'Amsterdam|Cologne':    [2.5,  20,  55,  1.0,  55, 110, true],
  'Amsterdam|Brussels':   [1.8,  20,  50,  1.0,  45,  95, true],
  'Paris|London':         [2.3,  65, 200,  1.2,  45, 180, true],
  'Paris|Brussels':       [1.4,  20,  60,  1.0,  45,  90, true],
  'Paris|Lyon':           [2.0,  25,  75,  1.1,  40, 100, true],
  'Cologne|Frankfurt':    [1.2,  15,  45,  0.8,  50,  90, true],
  'Cologne|Munich':       [4.3,  35,  90,  1.2,  35, 100, true],
  'Cologne|Berlin':       [4.3,  30,  85,  1.2,  35, 100, true],
  'Berlin|Munich':        [4.0,  30,  90,  1.2,  30,  95, true],
  'Berlin|Hamburg':       [1.8,  20,  55,  1.0,  40,  90, true],
  'Berlin|Frankfurt':     [3.8,  25,  80,  1.1,  30,  95, true],
  'Munich|Zurich':        [3.5,  45,  95,  0.8,  60, 135, true],
  'Munich|Vienna':        [4.0,  35,  90,  1.0,  45, 115, true],
  'Munich|Salzburg':      [1.5,  20,  50,  0.7,  50, 100, true],
  'Munich|Innsbruck':     [1.8,  25,  55,  0.8,  55, 110, true],
  'Zurich|Milan':         [3.4,  40,  85,  0.8,  50, 125, true],
  'Zurich|Geneva':        [2.8,  30,  70,  0.8,  50, 100, true],
  'Zurich|Bern':          [1.0,  15,  35,  0.7,  45,  90, true],
  'Zurich|Lucerne':       [0.8,  15,  30,  0.7,  45,  90, true],
  'Milan|Rome':           [3.0,  40, 100,  1.2,  30,  95, true],
  'Milan|Florence':       [1.7,  25,  65,  1.0,  35,  95, true],
  'Milan|Venice':         [2.5,  25,  70,  1.0,  35,  95, true],
  'Florence|Rome':        [1.5,  20,  60,  1.0,  35,  90, true],
  'Florence|Venice':      [2.2,  20,  60,  1.0,  35,  90, true],
  'Rome|Venice':          [3.7,  40,  95,  1.2,  30,  95, true],
  'Rome|Naples':          [1.2,  15,  45,  1.0,  35,  85, true],
  'Rome|Athens':          [null, null, null, 2.2, 35, 130, false],
  'Athens|Santorini':     [null, null, null, 0.5, 30,  90, false],
  'Athens|Mykonos':       [null, null, null, 0.5, 30,  90, false],
  'Paris|Nice':           [5.5,  50, 130,  1.4,  35, 110, true],
  'Paris|Bordeaux':       [2.1,  30,  90,  1.2,  35, 100, true],
}

function lookupPair(cityA, cityB) {
  const a = cityA.split(',')[0].trim()
  const b = cityB.split(',')[0].trim()
  return CITY_PAIRS[`${a}|${b}`] || CITY_PAIRS[`${b}|${a}`] || null
}

const AIRPORT_OVERHEAD_H = 4.5  // travel to airport + check-in + security + boarding + baggage claim
const AIRPORT_TRANSFER_COST = 45 // avg round-trip taxi/train to airport

/**
 * Compare train vs flight between two points.
 * @param {{ city: string, lat: number, lng: number }} from
 * @param {{ city: string, lat: number, lng: number }} to
 * @returns comparison object
 */
export function compareTransport(from, to) {
  const distKm = Math.round(haversineKm(from.lat, from.lng, to.lat, to.lng))
  const pair = lookupPair(from.city, to.city)

  // ── Train ──
  const trainFeasible = pair != null ? pair[6] : distKm < 1400
  const trainHours    = pair?.[0] ?? Math.max(1, distKm / 185)
  const trainCostMin  = pair?.[1] ?? Math.max(15, Math.round(distKm * 0.07))
  const trainCostMax  = pair?.[2] ?? Math.max(45, Math.round(distKm * 0.24))

  // ── Flight ──
  const flightHoursAir       = pair?.[3] ?? Math.max(0.8, distKm / 820)
  const flightHoursDoorToDoor = flightHoursAir + AIRPORT_OVERHEAD_H
  const flightCostMin        = (pair?.[4] ?? Math.max(30, Math.round(distKm * 0.04))) + AIRPORT_TRANSFER_COST
  const flightCostMax        = (pair?.[5] ?? Math.max(80, Math.round(distKm * 0.15))) + AIRPORT_TRANSFER_COST

  // ── Recommendation ──
  let winner, reason, tip
  if (!trainFeasible) {
    winner = 'fly'
    reason = 'No direct train connection — flying is the practical option for this route.'
    tip    = 'Book 4–6 weeks ahead for the best budget airline prices.'
  } else if (distKm < 250) {
    winner = 'train'
    reason = 'Under 250 km — the train beats flying door-to-door by a wide margin.'
    tip    = 'High-speed rail often departs from city center. No airport stress.'
  } else if (trainHours < flightHoursDoorToDoor && trainCostMax <= flightCostMax) {
    winner = 'train'
    reason = 'Train is faster door-to-door and comparable in cost for this distance.'
    tip    = 'Book 30–60 days ahead on Trainline or DB for cheapest fares.'
  } else if (flightHoursDoorToDoor < trainHours * 0.75 && flightCostMin < trainCostMin * 1.3) {
    winner = 'fly'
    reason = 'Flight saves significant time and can be cost-competitive for this distance.'
    tip    = 'Check Ryanair, easyJet, Wizz Air. Book early for €30–50 fares.'
  } else {
    winner = 'either'
    reason = 'Roughly equal in time. Train is more scenic and flexible; flight may be cheaper if booked early.'
    tip    = 'Compare live prices on Trainline vs Google Flights for best deal.'
  }

  return {
    distKm,
    train: {
      feasible:  trainFeasible,
      hours:     trainFeasible ? +trainHours.toFixed(1) : null,
      costMin:   trainFeasible ? trainCostMin : null,
      costMax:   trainFeasible ? trainCostMax : null,
    },
    flight: {
      hoursAir:         +flightHoursAir.toFixed(1),
      hoursDoorToDoor:  +flightHoursDoorToDoor.toFixed(1),
      costMin:          flightCostMin,
      costMax:          flightCostMax,
    },
    winner,
    reason,
    tip,
    isEstimate: !pair,
  }
}

/** Flat list of all cities from all countries (for the route picker) */
export function getAllCities(countries, customAttractions = []) {
  const cities = []
  for (const country of countries) {
    for (const city of country.cities) {
      cities.push({
        label: `${country.flagEmoji} ${city.name}, ${country.name}`,
        city: city.name,
        country: country.name,
        lat: city.lat,
        lng: city.lng,
      })
    }
  }
  // Add unique cities from custom attractions
  const seen = new Set(cities.map(c => c.city))
  for (const a of customAttractions) {
    if (!seen.has(a.city)) {
      seen.add(a.city)
      cities.push({
        label: `📍 ${a.city}, ${a.country}`,
        city: a.city,
        country: a.country,
        lat: a.lat,
        lng: a.lng,
      })
    }
  }
  return cities
}
