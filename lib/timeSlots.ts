export const ALL_SLOTS = [
  '12:00', '12:30', '13:00', '13:30', '14:00',
  '14:30', '15:00', '15:30', '16:00', '16:30',
]

export function isWeekday(dateStr: string): boolean {
  const date = new Date(dateStr + 'T00:00:00')
  const day = date.getUTCDay()
  return day !== 0 && day !== 6
}

export function isPastDate(dateStr: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(dateStr + 'T00:00:00')
  // Must book at least 1 day in advance — today itself is not bookable
  return date <= today
}

export function formatSlot(slot: string): string {
  const [h, m] = slot.split(':').map(Number)
  const period = h < 12 ? 'AM' : 'PM'
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}
