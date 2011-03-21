Feature: Status buttons
  In order to show the latest build status for my project
  As a user
  I want to be able to embed live status buttons on my website

  Scenario: Show an "unknown" button when the repository does not exist
    Given a repository "svenfuchs/travis" does not exist
    When I embed the status button for "svenfuchs/travis"
    Then the status button should say "unknown"

  Scenario: Show an "unknown" button when it only has a build that's not finished
    Given a repository "svenfuchs/travis"
    And "svenfuchs/travis" has an unfinished build
    When I embed the status button for "svenfuchs/travis"
    Then the status button should say "unknown"

  Scenario: Show an "unstable" button when the repository does not exist
    Given a repository "svenfuchs/travis"
    And "svenfuchs/travis" has an unstable build
    When I embed the status button for "svenfuchs/travis"
    Then the status button should say "unstable"

  Scenario: Show a "stable" button when the repository's last build passed
    Given a repository "svenfuchs/travis"
    And "svenfuchs/travis" has a stable build
    When I embed the status button for "svenfuchs/travis"
    Then the status button should say "stable"

  Scenario: Show a "stable" button when the previous build passed and there's one still running
    Given a repository "svenfuchs/travis"
    And "svenfuchs/travis" has a stable build
    And "svenfuchs/travis" has an unfinished build
    When I embed the status button for "svenfuchs/travis"
    Then the status button should say "stable"


