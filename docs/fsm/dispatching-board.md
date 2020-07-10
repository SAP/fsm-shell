## Dispatching Board

### Sidebar

<!-- panels:start -->

<!-- div:left-panel -->

A third party plug-in can be dispayed within the dispaching board as part of the sidebar on the right of the screen.

When loaded, this component appears within a collapsable card with a maximum height of `400px`.

<!-- div:right-panel -->

<img src="fsm/dispatchBoard.png" />
<!-- panels:end -->

#### Data

<!-- panels:start -->

<!-- div:title-panel -->

##### Require context

<!-- div:left-panel -->

Plug-in need to request fsm context to release the embedded loading screen. More about `GET_CONTEXT` within the [ShellSdk Events](/events?id=require_context) page.

<!-- div:right-panel -->

```javascript
shellSdk.emit(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, {
  clientIdentifier: '<your-app-client-identifier>',
  clientSecret: '<your-app-client-secret>',
});
```

<!-- panels:end -->

<!-- panels:start -->

<!-- div:title-panel -->

##### Selected Activity

<!-- div:left-panel -->

Selected activity is shared by the dispatching board using the `ViewState` object. In case of no selected activity or unselect event, the `null` value will be propagated and should be handle accordingly.

<!-- div:right-panel -->

```javascript
this.sdk.onViewState('ActivityId', (id) => {
  // use fsm public API to retrieve the activity object from id value
});
```

<!-- panels:end -->

#### Actions

<!-- panels:start -->

<!-- div:title-panel -->

##### Refresh

<!-- div:left-panel -->

When editing data, dispatching board might need to refresh its content to show the updated version. A plug-in can inform the application in such case by triggering a refresh using the `TO_APP` event.

<!-- div:right-panel -->

```javascript
this.sdk.emit(SHELL_EVENTS.Version1.TO_APP, {
  type: 'REFRESH',
});
```

<!-- panels:end -->
