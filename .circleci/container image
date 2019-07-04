Version: 2.1

description: |
  Updates the container image(s) of a resource on EKS.
executor: << parameters.executor >>
parameters:
  aws-profile:
    default: ''
    description: |
      The AWS profile to be used. If not specified, the configured default
      profile for your AWS CLI installation will be used.
    type: string
  aws-region:
    default: ''
    description: |
      AWS region that the EKS cluster is in.
    type: string
  cluster-name:
    description: |
      The name of the EKS cluster.
    type: string
  container-image-updates:
    description: |
      Specify a list of container image updates
      (space-delimited name value pairs in the form
      CONTAINER_NAME_1=CONTAINER_IMAGE_1 ... CONTAINER_NAME_N=CONTAINER_IMAGE_N)
      to be applied to the resource via `kubectl set image`.
      e.g. "busybox=busybox nginx=nginx:1.9.1"
    type: string
  executor:
    default: python3
    description: |
      Executor to use for this job.
    type: executor
  get-rollout-status:
    default: false
    description: |
      Get the status of the rollout.
      This can only be used for resource types that are valid
      for usage with `kubectl rollout` subcommands.
    type: boolean
  namespace:
    default: ''
    description: |
      The kubernetes namespace that should be used.
    type: string
  pinned-revision-to-watch:
    default: ''
    description: |
      Pin a specific revision to be watched and abort watching if it is rolled
      over by another revision.
      Only effective if get-rollout-status is set to true.
    type: string
  record:
    default: false
    description: |
      Whether to record the update
    type: boolean
  resource-name:
    default: ''
    description: |
      Resource name in the format TYPE/NAME e.g. deployment/nginx-deployment
      Either resource-file-path or resource-name need to be specified.
      This is required if get-rollout-status is set to true.
    type: string
  show-kubectl-command:
    default: false
    description: |
      Whether to show the kubectl command used.
    type: boolean
  watch-rollout-status:
    default: true
    description: |
      Whether to watch the status of the latest rollout until it's done.
      Only effective if get-rollout-status is set to true.
    type: boolean
  watch-timeout:
    default: ''
    description: >
      The length of time to wait before ending the watch, zero means never.
      Any other values should contain a corresponding time unit (e.g. 1s, 2m,
      3h).
      Only effective if get-rollout-status is set to true.
    type: string
steps:
  - update-kubeconfig-with-authenticator:
      aws-profile: << parameters.aws-profile >>
      aws-region: << parameters.aws-region >>
      cluster-name: << parameters.cluster-name >>
      install-kubectl: true
  - kubernetes/update-container-image:
      container-image-updates: << parameters.container-image-updates >>
      get-rollout-status: << parameters.get-rollout-status >>
      namespace: << parameters.namespace >>
      pinned-revision-to-watch: << parameters.pinned-revision-to-watch >>
      record: << parameters.record >>
      resource-name: << parameters.resource-name >>
      show-kubectl-command: << parameters.show-kubectl-command >>
      watch-rollout-status: << parameters.watch-rollout-status >>
      watch-timeout: << parameters.watch-timeout >>
