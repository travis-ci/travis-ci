jobs:
  build:
    docker:
      - image: buildpack-deps:trusty
    environment:
      FOO: bar
    parallelism: 24
    resource_class: large
    working_directory: ~/my-app
    branches:
      only:
        - Master
        - /rc-.*/
    steps:
      - run: make test
      - run: make
