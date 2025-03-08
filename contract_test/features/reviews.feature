Feature: Reviews API

  Scenario: Create a new review
    Given I have a valid review payload
    When I send a POST request to "/api/reviews"
    Then I should receive a 201 status code
    And the response should contain the review data

  Scenario: Get all reviews
    When I send a GET request to "/api/reviews"
    Then I should receive a 200 status code
    And the response should be a list of reviews
