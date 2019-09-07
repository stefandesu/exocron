const since = (job, now) => {
  if (!job) {
    return null
  }
  now = now || new Date()
  let date = new Date(now)
  let changed = false

  const schedule = (job.schedule && job.schedule.split && job.schedule.split(" ")) || []
  const methods = ["Minutes", "Hours", "Date", "Month", "FullYear"]

  for (let i = 0; i < schedule.length; i += 1) {
    if (schedule[i] == null || methods[i] == null) {
      continue
    }
    if (schedule[i] != "*" && !isNaN(parseInt(schedule[i]))) {
      date[`set${methods[i]}`](date[`get${methods[i]}`]() - parseInt(schedule[i]))
      changed = true
    }
  }

  // Return null if there is no schedule
  if (!changed) {
    return null
  }

  return date
}

module.exports = since
