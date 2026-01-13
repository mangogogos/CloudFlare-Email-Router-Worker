# ARCHIVED

This doesn't actually work 🤦‍♂️ You need to verify each destination address even if they only differ by tag i.e. email+tag@some.tld must be separately verified from email@some.tld or email+other@some.tld

Instead I've skipped the worker entirely and am just using a Catch-All to send all emails to my (verified) destination address, and am filtering in my destination inbox based on the original recipient

[cloudflare_email_workers]: https://developers.cloudflare.com/email-routing/email-workers/

<del>
# Cloudflare Email Routing Worker

This repository contains the logic for a [**Cloudflare Email Worker**](cloudflare_email_workers) that is intended to be used as the action for a "Catch-All" email router
It forwards some specific emails to youremail@domain.tld and all others youremail+unknownuser@domain.tld

## Set Up CloudFlare

1. Worker with name `cloudflare-email-router-worker`
1. Catch-all e-mail routing with action to forward to said worker
1. Domain name with proper DNS records for email (created automatically when you create an email worker in the CloudFlare dashboard)
1. CloudFlare API token created with the `Edit Cloudflare Workers` template
1. Repository secrets created for [Deploy workflow](./.github/workflows/deploy.yml)

## Deploy

Version uploads occur automatically on pushes to main. After that, simply find the uploaded version in the CloudFlare dashboard and deploy

## Update Wrangler Types

[Types for Wrangler](./worker-configuration.d.ts) are generated automatically by `npm run build`
</del>
