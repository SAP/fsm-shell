# Nested views

An application running as iframe can contain multiple iframe running independant applications. By design iframes can only communicate with its parent, or any of its child frame, building so a tree topology.

<!-- panels:start -->

<!-- div:left-panel -->

ShellSdk manage routing at each level to allow each frame to reach Shell-host individually. We can identify in this scenario three kind of nodes :

- **shell-host node**: always being root with a single children
- **application node**: always being the only direct connexion with shell-host
- **sub-application node**: any node connected at any deepth of the application node

<!-- div:right-panel -->

```mermaid
graph LR
    A[Shell-host  .]-->B[Application  .]
    B-->A
    B-->C[iFrame 1  .]
    B-->D[iFrame 2  .]

    C--> B
    D--> B
```

<!-- panels:end -->

For each node, ShellSdk **dynamically build routes** allowing to add or remove an iframes, and to use the **same syntax** to simplify development.

It use the concept of a [meshed distributed network](https://en.wikipedia.org/wiki/Mesh_networking) with each node running the exact same code, not being aware of its position or surrounding.

## Routing

When initialising a sub-application node, the hosting application need to register it to shellSdk so it build routing and recognise it as a valid route.

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
```

A node will only handle messages if coming from its parent node or a registered outlet. When receiving a message from a registered outlet, it assign the corresponding uuid as origin and will use that exact value to answer back if needed.

```mermaid
sequenceDiagram
    autonumber

    iFrame2->>Application: emit({type: request_context, ...})
    Application->>Shellhost: emit({type: request_context, from: [uuid_2], ...})
    Shellhost->>Application: emit({type: request_context, to: [uuid_2], ...})
    Application->>iFrame2: emit({type: request_context, ...})
```

## Routing algorithm

All nodes run the same code, `ShellSdk.onMessage` method define rules for each messages with different level of priority.

## Special events

### toApp

`TO_APP` is a special event directly handled if received. It will never be forwarded, meaning receiving it from a parent means it comes directly from the shell-host application. If received from a child, it is forward to the parent until the shell-host forward it back to the application.

### setViewState

`setViewState()` will send a message to the shell-host then spread it back using a [flooding technique](<https://en.wikipedia.org/wiki/Flooding_(computer_networking)>) threw the entire network with the new value.

### Example

<!-- tabs:start -->

#### ** Demo **

<iframe src="examples/selected_items/application.html" height=400></iframe>

#### ** application.html **

[Demo](/examples/selected_items/application.html ':include :type=code text')

#### ** plugin.html **

[Demo](/examples/selected_items/plugin.html ':include :type=code text')

<!-- tabs:end -->

## Nested nested views

As all node **run the same code** and **use the same syntax**, this allow an **application to be a plugin**, a **plugin to be an application**, but also a plugin to **run at any level in depth** of an application.

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

Each node register mounted iframes, and initialise with its parent.

```mermaid
graph LR
    A[Shell-host  .]---B[Application  .]
    B---|uuid_1| C[iFrame 1  .]
    B---|uuid_2| D[iFrame 2  .]
    D---|uuid_3| E[iFrame 2.1  .]
```

Messages are routed by all nodes without knowing anything about its surrounding.

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

### Example

<!-- tabs:start -->

#### ** Demo **

<iframe src="examples/nested_nested/application.html?depth=3" height=600></iframe>

#### ** application.html?depth=3 **

[Demo](/examples/nested_nested/application.html ':include :type=code text')

#### ** Topology **

```mermaid
graph LR
    A[Shell-host  .]---B[Application  .]
    B---|uuid_1| C[iFrame 1  .]
        C---|uuid_3| D[iFrame 1.1  .]
            D---|uuid_7| I[iFrame 1.1.1  .]
            D---|uuid_8| J[iFrame 1.1.2  .]
        C---|uuid_4| E[iFrame 1.2  .]
            E---|uuid_9| K[iFrame 1.2.1  .]
            E---|uuid_10| L[iFrame 1.2.2  .]
    B---|uuid_2| F[iFrame 2  .]
        F---|uuid_5| G[iFrame 2.1  .]
            G---|uuid_11| M[iFrame 2.1.1  .]
            G---|uuid_12| N[iFrame 2.1.2  .]
        F---|uuid_6| H[iFrame 2.2  .]
            H---|uuid_13| O[iFrame 2.2.1  .]
            H---|uuid_14| P[iFrame 2.2.2  .]
```

<!-- tabs:end -->
