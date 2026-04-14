/**
 * Generate an array of formatted date strings from startDate to endDate (inclusive).
 * @param {string} startDate - ISO date string e.g. "2026-05-31"
 * @param {string} endDate   - ISO date string e.g. "2026-06-13"
 * @returns {string[]} e.g. ["May 31", "Jun 1", ..., "Jun 13"]
 */
export function generateDayRange(startDate, endDate) {
  const days = []
  const start = new Date(startDate + 'T00:00:00')
  const end = new Date(endDate + 'T00:00:00')
  const cur = new Date(start)

  while (cur <= end) {
    days.push(cur.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    cur.setDate(cur.getDate() + 1)
  }
  return days
}

/**
 * Returns short day label like "Sun May 31"
 */
export function formatDayLabel(startDate, dayIndex) {
  const d = new Date(startDate + 'T00:00:00')
  d.setDate(d.getDate() + dayIndex)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}
