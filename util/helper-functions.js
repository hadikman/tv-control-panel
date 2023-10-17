export function randomNumberBetweenTwoDigits(min, max) {
  return Math.floor(Math.random() * max) + min
}

export function uid() {
  let uniqueId = ''
  for (let i = 0; i < 6; i++) {
    uniqueId += randomNumberBetweenTwoDigits(1, 15).toString(16)
  }
  return uniqueId
}

export function generateKeyCopy(id) {
  return `${id}-copy-${uid()}`
}

export function milisecondsToTime(milisecond) {
  let h, m, s

  h = Math.floor(milisecond / 1000 / 60 / 60)
  m = Math.floor((milisecond / 1000 / 60 / 60 - h) * 60)
  s = Math.floor(((milisecond / 1000 / 60 / 60 - h) * 60 - m) * 60)

  h = `${h < 10 ? '0' : ''}${h}`
  m = `${m < 10 ? '0' : ''}${m}`
  s = `${s < 10 ? '0' : ''}${s}`

  return `${h}:${m}:${s}`
}

export function bytesToMemoryUnit(bytes) {
  const units = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت', 'ترابایت']
  let l = 0
  let n = parseInt(bytes, 10) || 0

  while (n >= 1024 && ++l) {
    n = n / 1024
  }

  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]
}

export function truncateWords(string = '', length = 15) {
  const stringLength = string.length

  if (stringLength > length) {
    return string.slice(0, length) + '...'
  }

  return string
}

export function generateListOfIndex(count = 0) {
  return Array.from({length: count}, (_, i) => i + 1)
}

export function preventClicking(e) {
  e.preventDefault()
  e.stopPropagation()
}
