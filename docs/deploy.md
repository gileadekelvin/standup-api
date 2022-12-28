## Current state of the deployment

- The deployment is configured with Railway app.

## How to config CircleCI for deploy on GCP

1. Before anything you need to provide a virtual machine in the GCP. And config that machine with a SSH key and make sure that this repo is cloned. The configuration od the machine in the GCP needs a individual documentation (yet to come!)

2. Make sure that the follow variables are present in the CircleCI

- GOOGLE_PROJECT_ID
- GOOGLE_COMPUTE_ZONE
- GOOGLE_COMPUTE_REGION
- GCLOUD_SERVICE_KEY
- SERVER (IP from vm in GCP)
- USERNAME (username for the ssh thats access the vm in GCP)

3. Make sure that you add the ssh key generate in the step 1 to the CircleCI
