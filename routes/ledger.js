const express = require('express')
const moment = require('moment')

const router = express.Router()

router.post('/', async (req, res) => {
  //Assigning values from the body to variables

  const {
    name,
    start_date,
    end_date,
    frequency,
    weekly_rent,
    timezone,
  } = req.body
  var frequency_value = 0
  let duration = ''

  //validation of weekly_rent checking if it is a number

  if (isNaN(weekly_rent) || weekly_rent < 0) {
    err = 'Rent rate should be a valid number'
    return res.status(400).send(err)
  }
  //timezone
  if (!timezone) {
    err = 'TimeZone should be entered'
    return res.status(400).send(err)
  }
  //validation of dates
  if (!moment(start_date, 'YYYY-MM-DDTHH:mm:ss', true).isValid()) {
    err = 'Invalid Starting Date'
    return res.status(400).send(err)
  }

  if (!moment(end_date, 'YYYY-MM-DDTHH:mm:ss', true).isValid()) {
    err = 'Invalid Ending Date'
    return res.status(400).send(err)
  }
  //checking if starting date is less than ending date
  if (!moment(start_date).isBefore(end_date)) {
    err = 'Start date should be behind end date'
    return res.status(400).send(err)
  }

  const format_end_date = moment(end_date)
  const format_start_date = moment(start_date)

  //checking if frequency entered is valid
  if (
    !(
      frequency == 'monthly' ||
      frequency == 'weekly' ||
      frequency == 'fortnightly'
    )
  ) {
    err = 'Please enter proper frequency'
    return res.status(400).send(err)
  }
  if (frequency === 'monthly') {
    duration = 'every monthly'
  }

  if (frequency === 'weekly') {
    frequency_value = 7
    // checking if tenet stays for more than 7 days
    if (format_end_date.diff(format_start_date, 'days') <= frequency_value) {
      err = 'Make sure you stay for more than one week'
      return res.status(400).send(err)
    }
    duration = 'every weekly'
  }

  if (frequency === 'fortnightly') {
    frequency_value = 14
    //check if tenet stays for more than 2 weeks
    if (format_end_date.diff(format_start_date, 'days') <= frequency_value) {
      err = 'Make sure you stay for more than two weeks'
      return res.status(400).send(err)
    }
    duration = 'every two weeks'
  }
  //finding the gap between the start and the end with days
  const number_of_days = format_end_date.diff(format_start_date, 'days')
  //calculating total using days
  const total = (
    parseInt(number_of_days) *
    (parseFloat(weekly_rent) / 7)
  ).toFixed(2)

  let table_start_date = format_start_date
  let table_end_date = format_end_date
  let temp_start = ''
  var remainder = 0
  var dataTable = []

  while (moment(table_start_date).isBefore(table_end_date)) {
    temp_start = table_start_date
    if (frequency == 'monthly') {
      //days of the month changes based on month
      frequency_value = moment(table_start_date, 'YYYY/MM/DD').daysInMonth()
      table_start_date = moment(table_start_date).add(frequency_value, 'days')
    } else {
      //adding days to the starting date
      table_start_date = moment(table_start_date).add(frequency_value, 'days')
    }
    table_start_date = moment(table_start_date)
    //making sure remainder of days is stored
    remainder = table_end_date.diff(table_start_date, 'days')

    dataTable.push({
      StartDate: moment(temp_start).format('MMM Do YYYY'),
      EndDate: moment(table_start_date).format('MMM Do YYYY'),
      Amount: ((parseFloat(weekly_rent) / 7) * frequency_value).toFixed(2),
    })

    if (parseInt(remainder) < frequency_value) {
      break
    }
  }

  //if there is a remainder add it to the table as well
  if (remainder) {
    table_start_date = dataTable.push({
      StartDate: moment(table_start_date).format('MMM Do YYYY'),
      EndDate: moment(table_end_date).format('MMM Do YYYY'),
      Amount: ((parseInt(weekly_rent) / 7) * parseInt(remainder)).toFixed(2),
    })
  }

  //Output statements if valiation is done properly

  const start_date_output = format_start_date.format('MMM Do YYYY')
  const end_date_output = format_end_date.format('MMM Do YYYY')
  const starting_statement = `Alex, one of our tenants, signed a lease with Different. His lease starts on ${start_date_output}
  and ends on ${end_date_output}. He pays $${weekly_rent} a week, on a ${frequency} basis. `

  const ending_statement = `The first payment is on ${start_date_output} which is the first day of the lease.
  Going forward, every ${frequency_value} days (Number of days will vary for months) , Alex will be charged for ${duration} until the
  lease ends on ${end_date_output}. Total is ${total}`

  console.log(starting_statement)
  console.table(dataTable)
  console.log(ending_statement)
  return res.status(200)
})

module.exports = router
