# Nested views

An application running as iframe can contain multiple iframe running independant applications. By design iframes can only communicate with its parent, or any of its child frame, building so a tree topology.

```mermaid
graph LR
    A[Shell-host  .]-->B[Application  .]
    B-->A
    B-->C[iFrame 1  .]
    B-->D[iFrame 2  .]
    D-->E[iFrame 2.1  .]

    C--> B
    D--> B
    E--> D
```

ShellSdk manage routing at each level to allow each frame to reach Shell-host individually. We can identify in this scenario three kind of nodes :

- **shell-host node**: always being root with a single children
- **application node**: always being the only direct connexion with shell-host
- **sub-application node**: any node connected at any deepth of the application node

For each node, ShellSdk **dynamically build routes** allowing to add or remove an iframes, and to use the **same syntax** to simplify development.

It use the concept of a [meshed distributed network](https://en.wikipedia.org/wiki/Mesh_networking) with each node running the exact same code, not being aware of its position or surrounding.

## Routing

When initialising a sub-application node, the hosting application need to register it to shellSdk so he knows it is a valid origin.

```javascript
// on init event
this.shellSdk.registerOutlet((frame: HTMLIFrameElement));
// on destroy event
this.shellSdk.unregisterOutlet((frame: HTMLIFrameElement));
```

Registration will assign a [`uuid v4`](https://fr.wikipedia.org/wiki/Universal_Unique_Identifier) used to identify a route, which is **not exposed** threw a public API.

```mermaid
graph LR
    A[Shell-host  .]---B[Application  .]
    B---|uuid_1| C[iFrame 1  .]
    B---|uuid_2| D[iFrame 2  .]
    D---|uuid_3| E[iFrame 2.1  .]
```

A node will only handle messages if coming from its parent node or a registered outlet. When receiving a message from a registered outlet, it assign the corresponding uuid as origin and will use that exact value to answer back if needed.

```mermaid
sequenceDiagram
    autonumber
    iFrame2.1->>iFrame2: emit({type: request_context, ...})
    iFrame2->>Application: emit({type: request_context, from: [uuid_3], ...})
    Application->>Shellhost: emit({type: request_context, from: [uuid_3, uuid_2], ...})
    Shellhost->>Application: emit({type: request_context, to: [uuid_3, uuid_2], ...})
    Application->>iFrame2: emit({type: request_context, to: [uuid_3], ...})
    iFrame2->>iFrame2.1: emit({type: request_context, to: [], ...})
```

## Routing algorithm

All nodes run the same code, `ShellSdk.onMessage` method define rules for each messages with different level of priority.

## Special events

### toApp

`TO_APP` is a special event directly handled if received. It will never be forwarded, meaning receiving it from a parent means it comes directly from the shell-host application. If received from a child, it is forward to the parent until the shell-host forward it back to the application.

### setViewState

`setViewState()` will send a message to the shell-host then spread it back using a [flooding technique](<https://en.wikipedia.org/wiki/Flooding_(computer_networking)>) threw the entire network with the new value.
