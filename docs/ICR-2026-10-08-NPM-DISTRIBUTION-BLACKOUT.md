# Incident Cause Report (ICR)
**Incident ID**: ICR-2026-10-08-01  
**Severity**: SEV-1 (Silent Total Outage of Primary Distribution Channel)  
**Date**: October 8, 2026  
**Status**: Root Cause Identified & Remediation Active  
**Author**: Engineering / Reliability (`franchisedata.io`)  
**Scope**: MCP Server Distribution (`franchisedata-mcp` / `@outis-co/franchisedata-mcp`)

---

## 1. Executive Summary

Between **October 6, 2026, ~06:00 PDT** and **October 8, 2026, ~13:25 PDT** (an outage window of approximately 55 hours), the primary distribution channel for the FranchiseData Model Context Protocol (MCP) server was completely offline. Prospective users attempting to run the advertised command:

```bash
npx -y @outis-co/franchisedata-mcp
```

or installing via Claude Desktop and Smithery encountered an immediate HTTP 404 error from the public npm registry:
`npm error 404 Not Found - '@outis-co/franchisedata-mcp' is not in this registry.`

During this 55-hour window, the listing on the Glama MCP registry drove significant developer interest: **34 unique developers cloned the underlying GitHub repository 111 times**. However, because the package was missing from npm, zero developers were able to complete an out-of-the-box `npx` launch, and zero paid API keys or FDD queries were converted.

Crucially, **the engineering team had no automated monitoring or alerting on registry presence**, creating an undetected silent failure where local tests passed green and git commits succeeded, but the end-user delivery mechanism was completely non-functional.

---

## 2. Impact Assessment

| Metric | Measured Impact |
| :--- | :--- |
| **Primary CLI Installation Availability** | **0% (Complete Outage)** |
| **Remote HTTP Endpoint Availability** | 100% (`https://franchisedata.io/mcp` remained online) |
| **Impacted Prospective Developers** | **34 unique developers** (forced to manually `git clone` source code) |
| **Lost Launch Conversions** | High (0 paid conversions during the peak 48-hour launch period) |
| **Identity / Attribution Leaks** | **Zero (0)**. Authenticated npm identity is strictly `franchisedata.io <research@franchisedata.io>`. |

---

## 3. Incident Timeline

*All timestamps in Pacific Daylight Time (PDT)*:

* **2026-10-06 05:47**: TypeScript migration to official `@modelcontextprotocol/sdk` completed. Standalone bundle built and verified locally in `bin/mcp.js`. All 10 Vitest tests passed.
* **2026-10-06 06:00**: Git tag `v1.1.0` created and pushed to GitHub. Release published on GitHub.
* **2026-10-06 06:08**: GitHub Actions triggered `.github/workflows/publish.yml`. The job failed silently on npm authentication because `secrets.NPM_TOKEN` was not populated in repository secrets.
* **2026-10-06 06:10 – 2026-10-07 14:00**: Glama catalog traffic surged. 34 unique developers hit npm 404 and manually fell back to `git clone`. Remote streamable HTTP calls (`POST /mcp`) succeeded for users who bypassed npm.
* **2026-10-07 14:35**: Traffic check observed 111 git clones, but 0 newly activated paid API keys.
* **2026-10-08 13:23**: Direct registry audit executed via `npm view @outis-co/franchisedata-mcp`. Registry returned `E404 Not Found`, establishing that the package had never been published to npm.
* **2026-10-08 13:26**: Fresh npm user account created and authenticated via browser CLI: `franchisedata.io` (`research@franchisedata.io`).
* **2026-10-08 13:29**: Package metadata restructured to unscoped `franchisedata-mcp` with author set to `FranchiseData (https://franchisedata.io)`.
* **2026-10-08 13:34**: Manual publish attempted; blocked by npm registry security policy: `E403 Two-factor authentication or granular access token with bypass 2fa enabled is required to publish packages`.

---

## 4. Root Cause Analysis (The 5 Whys)

1. **Why did developers fail to run `npx @outis-co/franchisedata-mcp`?**  
   Because the package did not exist on `registry.npmjs.org` (HTTP 404).

2. **Why did the package not exist on the registry despite a release being cut?**  
   Because the automated GitHub Actions publish workflow (`publish.yml`) failed to publish upon release creation.

3. **Why did the GitHub Actions publish workflow fail?**  
   Because the workflow required `secrets.NPM_TOKEN`, which was never created in the repository's GitHub Secrets settings.

4. **Why did the team believe the release was live when the publish failed?**  
   Because the CI test pipeline (`ci.yml`) passed green on commit, and success was inferred from local test execution and GitHub release creation without an active end-to-end registry validation probe.

5. **Why was manual remediation blocked today?**  
   Because npm enforces mandatory 2FA or Granular Access Tokens with bypass permissions for package creation, and the newly minted `franchisedata.io` account had 2FA disabled.

---

## 5. Preventative & Corrective Action Items

### Immediate Actions (P0 — Within 1 Hour)
- [ ] **ACT-01**: Enable 2FA on `franchisedata.io` or generate a Granular Access Token with Publish permissions on [npmjs.com/settings/franchisedata.io/tokens](https://www.npmjs.com/settings/franchisedata.io/tokens).
- [ ] **ACT-02**: Execute `npm publish --access public` for `franchisedata-mcp` to resolve the 404 registry outage.
- [ ] **ACT-03**: Add the generated token as `NPM_TOKEN` in GitHub Secrets (`outis-co/franchisedata-mcp/settings/secrets/actions`).

### Automated Quality & Monitoring Gates (P1 — Within 24 Hours)
- [ ] **ACT-04**: **Synthetic Verification Test in CI**: Update `.github/workflows/publish.yml` to include a mandatory post-publish verification step:
  ```bash
  sleep 15
  npm view franchisedata-mcp version
  npx -y franchisedata-mcp --version
  ```
  If this step fails, the workflow must fail loudly.
- [ ] **ACT-05**: **Failed Workflow Alerting**: Configure GitHub Actions failure notifications to dispatch immediate webhook alerts to team email / Slack so broken releases are caught within 60 seconds.
- [ ] **ACT-06**: **Update Registry Listings**: Update `server.json`, `glama.json`, and the Glama MCP directory listing to point to `franchisedata-mcp` (`npx -y franchisedata-mcp`).

---

## 6. Verification Protocol

The incident will be marked **RESOLVED** once the following external verification check returns `0` exit code from a clean environment:

```bash
npx -y franchisedata-mcp --version
# Expected output: franchisedata-mcp v1.1.0
```
