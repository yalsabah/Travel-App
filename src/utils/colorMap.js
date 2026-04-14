export const COLOR_MAP = {
  FR: { hex: '#EF4444', light: '#fca5a5', name: 'France',      flag: '🇫🇷', tailwind: 'red' },
  NL: { hex: '#F97316', light: '#fdba74', name: 'Netherlands',  flag: '🇳🇱', tailwind: 'orange' },
  DE: { hex: '#EAB308', light: '#fde047', name: 'Germany',      flag: '🇩🇪', tailwind: 'yellow' },
  CH: { hex: '#22C55E', light: '#86efac', name: 'Switzerland',  flag: '🇨🇭', tailwind: 'green' },
  IT: { hex: '#14B8A6', light: '#5eead4', name: 'Italy',        flag: '🇮🇹', tailwind: 'teal' },
  GR: { hex: '#3B82F6', light: '#93c5fd', name: 'Greece',       flag: '🇬🇷', tailwind: 'blue' },
}

export function getCountryStyle(code) {
  return COLOR_MAP[code] ?? { hex: '#94a3b8', light: '#cbd5e1', name: code, flag: '🌍', tailwind: 'slate' }
}
