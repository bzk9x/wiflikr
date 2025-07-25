function pad(n) {
  return n.toString().padStart(2, '0')
}

function updateClock() {
  const now = new Date()
  const hrs = pad(now.getHours())
  const mins = pad(now.getMinutes())

  document.querySelector('.clock-digit-1').textContent = hrs[0]
  document.querySelector('.clock-digit-2').textContent = hrs[1]
  document.querySelector('.clock-digit-3').textContent = mins[0]
  document.querySelector('.clock-digit-4').textContent = mins[1]
}

setInterval(updateClock, 1000)
updateClock()