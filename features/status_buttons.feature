Feature: Status buttons
  In order to show the latest build status for my project
  As a user
  I want to be able to embed live status buttons on my website

  Scenario: Show an "unknown" button when the repository does not exist
    Given a repository named "svenfuchs/travis" does not exist
    When I embed the status button for "svenfuchs/travis"
    Then the status button should say "unknown"

  Scenario: Show an "unstable" button when the repository does not exist
    Given a repository named "svenfuchs/travis"
    And "svenfuchs/travis" has an unstable last build
    When I embed the status button for "svenfuchs/travis"
    Then the status button should say "unstable"

  Scenario: Show an "unstable" button when the repository does not exist
    Given a repository named "svenfuchs/travis"
    And "svenfuchs/travis" has a stable last build
    When I embed the status button for "svenfuchs/travis"
    Then the status button should say "stable"
