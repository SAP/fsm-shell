# Debugging postMessage API events

FSM-SHELL library includes ability to debug events going thru postMessage API on
shell host side or on a client application side.

## Enable debugging

to enable postMessage API debugging perform following steps:

- open in the browser shell application which should be debugged
- open browser developer tools
- in developer tools go to `Application` tab and open `LocalStorage` item
- click on the origin of the app and add under it key `cs.fsm-shell.debug`
- set id of the component to be debugged as value for that key, it is possible to list
  multiple ids separated by commas. For example to debug messages going thru both shell-host
  set value to `shell-host`
- reload application

Following components' ids currently supported to debug postMessage API:

- `shell-host` - shell core to communicate between shell host and client application loaded
  into the main shell iframe

## Fetching and filtering list of tracked postMessage events

When debugging enabled for some component(s) all postMessage events going thru it will
be logged into the browser console.

List of previously tracked events can be accessed using MessageLogger object which is
available under `fsmShellMessageLogger` property of the window object. For example,
to get list of all prevously tracked events type in the console following command:
`window.fsmShellMessageLogger.all()`
also all events can be printed in table format by typing command:
`window.fsmShellMessageLogger.allTable()`

Message logger also provides ability to filter list of tracked events and includes 2 methods
for that:

- `filter` - to get filtered list of tracked events
- `filterTable` - to print table containing filtered list of tracked events

both methods expecting 1 argument containing filtering options object

Filtering options object may include following keys:

| Key name  | type               | possible values                | description                                                                                                                  |
| --------- | ------------------ | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| type      | string or string[] | any fsm shell event identifier | include only specific fsm-shell event types                                                                                  |
| direction | string             | `incoming`, `outgoing`         | include only received or sent events                                                                                         |
| component | string             | `fsm-shell`                    | include only events going thru specific component                                                                            |
| handled   | boolean            | `true` or `false`              | include only events handled by component (component may have no handlers set for specific event type and ignore some events) |
| from      | Date               | valid Date object              | include only events tracked since spcified moment in time                                                                    |
| to        | Date               | valid Date object              | include only events tracked before spcified moment in time                                                                   |

#### Example

To get list of all incoming events of types `V1.REQUIRE_CONTEXT` or `V1.GET_PERMISSIONS` tracked by `shell-host` component type in console following command:

```javascript
window.fsmShellMessageLogger.filterTable({
  type: ['V1.REQUIRE_CONTEXT', 'V1.GET_PERMISSIONS'],
  component: 'shell-host',
  direction: 'incoming',
});
```
