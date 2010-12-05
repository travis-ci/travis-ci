Feature: Building code
  Background:
    Given a repository with the uri "http://github.com/svenfuchs/minimal"
      And I am on the dashboard page

  Scenario: Viewing the dashboard
    Then I should see "svenfuchs/minimal" within the repositories list

  Scenario: Starting a build for a new repository
     When someone triggers a build for the repository "svenfuchs/i18n"
     Then a repository should have been created for "svenfuchs/i18n"
      And that repository should have 1 build
      And all users should have received the following update:
        | path                  | value                            |
        | event                 | build_started                    |
        | build.repository.name | svenfuchs/i18n                   |
        | build.repository.uri  | http://github.com/svenfuchs/i18n |
        | build.commit          | 5911413de86b53e29854             |


