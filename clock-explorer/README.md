# Clock-Educator

## Google Ads integration

### Where to put real Google Ads values

Open **`js/ad-config.js`** and update the three constants at the top:

```js
ADS_ENABLED:       false,                 // ← change to true
ADSENSE_CLIENT_ID: 'ca-pub-XXXXXXXXXXXXXXXX', // ← your publisher ID
AD_SLOT_ID:        '1234567890',          // ← your ad slot ID
```

### How to enable ads

1. Replace `ADSENSE_CLIENT_ID` with your real AdSense publisher ID (e.g. `ca-pub-1234567890123456`).
2. Replace `AD_SLOT_ID` with the slot ID for the ad unit you created in your AdSense dashboard.
3. Set `ADS_ENABLED` to `true`.
4. Optionally set `AD_TEST_MODE` to `true` while you are testing to avoid invalid-click penalties.

The AdSense library is loaded automatically when `ADS_ENABLED` is `true`.
If the script is unavailable the app fails gracefully and shows nothing.

### Which screens intentionally do not show ads

| Screen | Shows ad? |
|--------|-----------|
| Home / mode-selection | ✗ Never |
| Read the Clock | ✓ After 60 s |
| Set the Clock | ✓ After 60 s |
| Match Game | ✓ After 60 s |
| Free Play | ✓ After 60 s |

The ad banner appears only after the learner has been in a module screen for
60 continuous seconds (tab-hidden time is not counted).
Switching to a different module resets the timer.
