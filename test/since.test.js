const since = require("../lib/since")

test("since", () => {
  const tests = [
    {
      date: null,
      job: {},
      result: null,
    },
    {
      date: "2019-09-07T14:51:00.000Z",
      job: {
        schedule: "1",
      },
      result: "2019-09-07T14:50:00.000Z",
    },
    {
      date: "2019-09-07T14:00:00.000Z",
      job: {
        schedule: "1",
      },
      result: "2019-09-07T13:59:00.000Z",
    },
    {
      date: "2019-09-07T14:00:00.000Z",
      job: {
        schedule: "* 1",
      },
      result: "2019-09-07T13:00:00.000Z",
    },
    {
      date: "2019-09-01T14:00:00.000Z",
      job: {
        schedule: "* * 1",
      },
      result: "2019-08-31T14:00:00.000Z",
    },
  ]
  for (let test of tests) {
    const result = since(test.job, test.date)
    expect(result && result.toJSON()).toBe(test.result)
  }
})
