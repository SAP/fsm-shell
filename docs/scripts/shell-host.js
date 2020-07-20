/**
 * This shell host generate a mock to handle example's messages
 */
async function main() {
  const { ShellSdk, SHELL_EVENTS } = await System.import(
    'https://unpkg.com/fsm-shell'
  ).then((m) => m.default);

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
            value: JSON.stringify({
              account: 'account',
              accountId: 'accountId',
              company: 'company',
              companyId: 'companyId',
              user: 'user',
              userId: 'userId',
              selectedLocale: 'selectedLocale',
            }),
          },
          '*'
        );
        break;
      case SHELL_EVENTS.Version1.SET_VIEW_STATE:
        const { key, value } = event.data.value;
        console.log(SHELL_EVENTS.Version1.SET_VIEW_STATE, key, value);
        console.log({
          type: SHELL_EVENTS.Version1.SET_VIEW_STATE,
          value: {
            key,
            value,
          },
        });
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
}

main().catch((e) => (console.error(e), updateUI(e)));
