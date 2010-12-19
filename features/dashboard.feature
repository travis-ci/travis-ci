Feature: The dashboard
  Background:
    Given the current time is 2010-11-21 13:00:05
    And the following repositories:
      | uri                                 | last_built_at       | last_duration |
      | http://github.com/svenfuchs/minimal | 2010-11-21 13:00:00 | 30            |
      | http://github.com/josevalim/enginex | 2010-11-11 12:00:00 |               |
    And the following builds:
      | repository        | number | status | commit  | message               | duration | created_at          | finished_at         | agent    | log    |
      | svenfuchs/minimal | 1      | 1      | 1a938da | add Gemfile           | 30       | 2010-11-20 12:00:00 | 2010-11-20 12:00:30 | 76f4f2ba | log #1 |
      | svenfuchs/minimal | 2      | 0      | 91d1b7b | Bump to 0.0.22        | 31       | 2010-11-20 12:30:00 | 2010-11-20 12:20:30 | a1732e4f | log #2 |
      | svenfuchs/minimal | 3      |        | add057e | unignore Gemfile.lock |  5       | 2010-11-21 13:00:00 |                     | 76f4f2ba | log #3 |
      | josevalim/enginex | 1      | 0      | 565294c | Update Capybara       | 20       | 2010-11-11 12:00:00 | 2010-11-11 12:00:20 | a1732e4f | log #1 |

  Scenario Outline: Viewing the repositories list
    Given I am on the <page>
    Then I should see the following repositories within the repositories list:
      | name              | duration | build | eta           | finished_at   |
      | svenfuchs/minimal |  5       | 3     | half a minute |               |
      | josevalim/enginex | 20       | 1     |               | 10 days ago   |
    Examples:
      | page                                   |
      | dashboard page                         |
  #     # | repository page for: svenfuchs/minimal |
  #     # | build page for: svenfuchs/minimal #2   |

  # Scenario: Viewing a repository
  #   Given I am on the repository page for: svenfuchs/minimal
  #   Then I should see the following repository information within the repository pane:
  #     | name         | svenfuchs/minimal                               |
  #     | last_success | build: 2, duration: 31 sec, finished: 1 day ago |
  #     | last_failure | build: 1, duration: 30 sec, finished: 1 day ago |
  #   And I should see the following build history within the repository pane:
  #     | number | commit  | duration | finished  |
  #     | #3     | add057e | 5 sec    |           |
  #     | #2     | 91d1b7b | 31 sec   | 1 day ago |
  #     | #1     | 1a938da | 30 sec   | 1 day ago |

  # Scenario: Viewing a build
  #   Given I am on the build page for: svenfuchs/minimal #2
  #   Then I should see the following build information within the build pane:
  #     | build    | #2             |
  #     | commit   | 91d1b7b        |
  #     | message  | Bump to 0.0.22 |
  #     | duration | 31 sec         |
  #     | finished | 1 day ago      |
  #     | agent    | a1732e4f       |
  #   And I should see the build log "log #2"

  # Scenario: Starting a build for a new repository
  #    When someone triggers a build for the repository "svenfuchs/i18n"
  #    Then a repository should have been created for "svenfuchs/i18n"
  #     And that repository should have 1 build
  #     And all users should have received the following update:
  #       | path                  | value                            |
  #       | event                 | build_started                    |
  #       | build.repository.name | svenfuchs/i18n                   |
  #       | build.repository.uri  | http://github.com/svenfuchs/i18n |
  #       | build.commit          | 5911413de86b53e29854             |


