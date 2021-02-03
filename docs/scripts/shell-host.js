/**
 * This shell host generate a mock to handle example's messages
 */
const { ShellSdk, SHELL_EVENTS } = FSMShell;

console.log('Using ShellSdk version', ShellSdk.VERSION);

const shellSdk = ShellSdk.init(null, origin, undefined, 'shell-host');

window.addEventListener('message', (event) => {
  //
  if (!event.data && !event.data.type) {
    return;
  }

  switch (event.data.type) {
    case SHELL_EVENTS.Version1.REQUIRE_CONTEXT:
      event.source.postMessage(
        {
          type: SHELL_EVENTS.Version1.REQUIRE_CONTEXT,
          to: event.data.from,
          value: JSON.stringify({
            account: 'my_account',
            accountId: '1',
            company: 'sap',
            companyId: '1',
            user: 'shell-docsify',
            userId: '007',
            selectedLocale: 'en',
          }),
        },
        '*'
      );
      break;
    case SHELL_EVENTS.Version1.SET_VIEW_STATE:
      const { key, value } = event.data.value;
      event.source.postMessage(
        {
          type: SHELL_EVENTS.Version1.SET_VIEW_STATE,
          value: {
            key,
            value,
          },
        },
        '*'
      );
      break;
    case SHELL_EVENTS.Version1.TO_APP:
      event.source.postMessage(
        {
          type: SHELL_EVENTS.Version1.TO_APP,
          value: event.data.value,
        },
        '*'
      );
      break;
  }
});
