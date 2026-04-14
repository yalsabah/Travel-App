const ICONS = {
  landmark:  '🏛️',
  museum:    '🖼️',
  nature:    '⛰️',
  cruise:    '🚢',
  palace:    '🏰',
  religious: '⛪',
  district:  '🏘️',
}

export function CategoryIcon({ category, className = '' }) {
  return (
    <span className={`text-base leading-none ${className}`} title={category}>
      {ICONS[category] ?? '📍'}
    </span>
  )
}

export function getCategoryLabel(category) {
  const labels = {
    landmark:  'Landmark',
    museum:    'Museum',
    nature:    'Nature',
    cruise:    'Cruise',
    palace:    'Palace',
    religious: 'Religious',
    district:  'District',
  }
  return labels[category] ?? category
}
