#! /usr/bin/env node

const fs = require("fs")
const { exec } = require("child_process")
const since = require("../lib/since")
const command = process.argv[2]

if (!command || ["help", "--help", "-h"].includes(command)) {
  console.log("usage: exocron <jobsfile>")
  console.log()
  console.log("<jobsfile> needs to be a JSON file with an array of objects.")
  console.log("Each object needs to have two properties:")
  console.log("\tcommand  - the shell command to be run")
  console.log("\tschedule - a schedule string with a timeframe")
  console.log()
  console.log("The schedule string looks like this:")
  console.log("\t[<minutes>] [<hours>] [<days>] [<months>] [<years>]")
  console.log("At least one number has to be given. If a part can't be parsed as a number, it is ignored.")
  console.log("Note that there has to be exactly one space between each number.")
  console.log()
  console.log("Example jobsfile:")
  console.log(JSON.stringify([
    {
      command: "echo 'This will run if it hasn't run in 5 minutes.'",
      schedule: "5",
    },
  ], null, 2))
  console.log()
  console.log("Note that jobs will be gone through in order, and at most one job will be run.")
  console.log("Note that exocron will write to the jobsfile as well.")
  console.log()
  console.log("How can you actually use this?")
  console.log("You could add a cronjob that runs exocron every minute, and exocron will decide whether to run a script or not.")
  console.log("e.g. * * * * * exocron /path/to/jobsfile.json")
  console.log("(Make sure that the Node.js environment is available for the cronjob, e.g. by setting the PATH inside the crontab file.)")
  console.log()
  console.log("exocron will output the command that is run if any.")
  process.exit(command ? 0 : 1)
}
if (["version", "--version", "-v"].includes(command)) {
  console.log(require("../package.json").version)
  process.exit(0)
}
const jobsfile = command

let jobs
try {
  jobs = JSON.parse(fs.readFileSync(jobsfile))
  if (!Array.isArray(jobs)) {
    throw new Error("The provided file does not contain an array.")
  }
} catch (error) {
  console.error(`There was an error processing ${jobsfile}. Please make sure the file exists and contains a valid JSON array.`)
  console.log(error)
  process.exit(1)
}

for (const job of jobs) {
  const lastActualRun = job.lastRun && new Date(job.lastRun)
  const sinceDate = since(job)
  if (sinceDate && (!lastActualRun || sinceDate > lastActualRun)) {
    job.lastRun = new Date()
    console.log(job.command)
    exec(job.command)
    // TODO: Add command line option to skip break.
    break
  }
}

// Write jobs back to jobsfile
fs.writeFileSync(jobsfile, JSON.stringify(jobs, null, 2))
