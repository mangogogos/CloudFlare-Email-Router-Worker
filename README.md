[cloudflare_email_workers]: https://developers.cloudflare.com/email-routing/email-workers/

# Cloudflare Email Routing Worker

This repository contains the logic for a [**Cloudflare Email Worker**](cloudflare_email_workers) that is intended to be used as the action for a "Catch-All" email router. It forwards some specific emails to youremail@domain.tld and all others youremail+unknownuser@domain.tld.

## Setup

### Prerequisites
- CloudFlare account
- Domain name with proper DNS records for email (created automatically when you create an email worker)

### Steps
1. Create the e-mail worker `cloudflare-email-router-worker`
1. Enable worker logs
1. Connect your GitHub repository
    - Disable non-production builds
    - Add a variable to the deployment `Email` with content `youremail@domain.tld`
    - Add a variable to the deployment `DirectEmailUsers` with content `["user1", "user2"]`
    - Enable build caching
1. Deploy worker
1. Run build `npm run build`
1. Commit and push changes
