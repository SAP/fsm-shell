// Chrome 112+ (new headless mode) fires beforeunload when the window closes.
// Karma's onbeforeunload handler misidentifies this as a "full page reload" error.
// This global afterAll clears the handler after all tests complete.
afterAll(() => {
  window.onbeforeunload = null;
});
