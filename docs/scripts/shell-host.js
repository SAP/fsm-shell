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
    }
  });
}

main().catch((e) => (console.error(e), updateUI(e)));
