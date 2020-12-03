const expect = require('chai').expect
const request = require('supertest')

const app = require('../../app.js')

describe('POST /ledger', () => {
  before((done) => {
    console.log('Starting the tests')
    done()
  })

  //Adding correct data with month paying
  it('OK, Adding ledger monthly works', (done) => {
    request(app)
      .post('/ledger')
      .send({
        end_date: '2011-10-10T14:48:00',
        start_date: '2011-06-10T14:48:00',
        frequency: 'monthly',
        weekly_rent: 30,
        timezone: 'America/Edmonton',
      })
      .catch((err) => done(err))
    done()
  })
  //Adding correct data with weekly paying
  it('OK, Adding ledger weekly works', (done) => {
    request(app)
      .post('/ledger')
      .send({
        end_date: '2011-06-24T14:48:00',
        start_date: '2011-06-10T14:48:00',
        frequency: 'weekly',
        weekly_rent: 10,
        timezone: 'America/Edmonton',
      })
      .catch((err) => done(err))
    done()
  })
  //Adding correct data with fortnightly paying
  it('OK, Adding ledger fortnightly works', (done) => {
    request(app)
      .post('/ledger')
      .send({
        end_date: '2011-07-24T14:48:00',
        start_date: '2011-06-10T14:48:00',
        frequency: 'fortnightly',
        weekly_rent: 10,
        timezone: 'America/Edmonton',
      })
      .catch((err) => done(err))
    done()
  })
  //checking february
  it('OK, February month  works', (done) => {
    request(app)
      .post('/ledger')
      .send({
        end_date: '2011-04-01T14:48:00',
        start_date: '2011-02-01T14:48:00',
        frequency: 'monthly',
        weekly_rent: 10,
        timezone: 'America/Edmonton',
      })
      .catch((err) => done(err))
    done()
  })

  it('OK, Long Ledger works', (done) => {
    request(app)
      .post('/ledger')
      .send({
        end_date: '2011-06-01T14:48:00',
        start_date: '2011-01-01T14:48:00',
        frequency: 'weekly',
        weekly_rent: 5,
        timezone: 'America/Edmonton',
      })
      .catch((err) => done(err))
    done()
  })

  it('Fail, End date should be valid', (done) => {
    request(app)
      .post('/ledger')
      .send({
        end_date: 'abc',
        start_date: '2011-06-10T14:48:00',
        frequency: 'fortnightly',
        weekly_rent: 10,
        timezone: 'America/Edmonton',
      })
      .then((res) => {
        throw new Error(res.error.text)
        done()
      })
      .catch((err) => done(err))
  })

  it('Fail, Start date should be less than end date', (done) => {
    request(app)
      .post('/ledger')
      .send({
        end_date: '2011-06-10T14:48:00',
        start_date: '2011-06-20T14:48:00',
        frequency: 'fortnightly',
        weekly_rent: 10,
        timezone: 'America/Edmonton',
      })
      .then((res) => {
        throw new Error(res.error.text)
        done()
      })
      .catch((err) => done(err))
  })

  it('fail, testing if weekly rent is a number', (done) => {
    request(app)
      .post('/ledger')
      .send({
        end_date: '2011-04-01T14:48:00',
        start_date: '2011-02-01T14:48:00',
        frequency: 'monthly',
        weekly_rent: 'ab',
        timezone: 'America/Edmonton',
      })
      .then((res) => {
        throw new Error(res.error.text)
      })
      .catch((err) => done(err))
  })
})
