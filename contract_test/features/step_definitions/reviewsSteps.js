const { Given, When, Then } = require('@cucumber/cucumber');
const chai = require('chai');
const axios = require('axios');
const expect = chai.expect;

let response;
let reviewPayload;

Given('I have a valid review payload', function () {
  reviewPayload = {
    // Define a valid review payload based on your schema
    serviceId: '123',
    clientId: '456',
    reviewType: 'positive',
    // Add other necessary fields
  };
});

When('I send a POST request to {string}', async function (path) {
  response = await axios.post(`http://localhost:3000${path}`, reviewPayload);
});

When('I send a GET request to {string}', async function (path) {
  response = await axios.get(`http://localhost:3000${path}`);
});

Then('I should receive a {int} status code', function (statusCode) {
  expect(response.status).to.equal(statusCode);
});

Then('the response should contain the review data', function () {
  expect(response.data).to.include(reviewPayload);
});

Then('the response should be a list of reviews', function () {
  expect(response.data).to.be.an('array');
});