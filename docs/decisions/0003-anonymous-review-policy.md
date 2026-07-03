# ADR 0003: Anonymous Review Policy

## Context and Problem Statement

To maximize tenant trust, Nyumbani needs a policy regarding review visibility. Renters should be able to make informed decisions without needing to log in.

## Decision

We adopted an **Anonymous Public Read Policy**.

- All unmoderated reviews (`is_moderated = false`) are public.
- Users can search, filter, and read all metrics without authenticating.
- To submit reviews or claim property ownership, users must later authenticate.

## Consequences

- **Accessibility:** Zero paywalls or SMS verification requirements exist for reading content.
- **Decoupled Profile Queries:** Review rows are fetched anonymously without exposing email addresses or authentication IDs to the public.
