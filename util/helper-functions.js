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

export function truncateWords(string = '', length = 15) {
  const stringLength = string.length

  if (stringLength > length) {
    return string.slice(0, length) + '...'
  }

  return string
}

export function fetchAndPostData(url, options = {}) {
  // console.log(options)
  const res = fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    ...options,
  }).then(res => res.json())

  return res
}

export function generateListOfIndex(count = 0) {
  return Array.from({length: count}, (_, i) => i + 1)
}
