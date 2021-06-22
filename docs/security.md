# Security

## Allowed origins only

You can use the method `.setAllowedOrigins` to restrict message handling to a list of allowed origins.

```javascript
sdk = ShellSdk.init();
sdk.setAllowedOrigins(['https://example.com', 'https://example2.com']);
```

To help debugging, an error will be displayed if an event come from an other origin.

You disable this settings, call `.setAllowedOrigins` with an empy parameter.

### Allowed origins may be managed dynamically at runtime using following methods:

#### - addAllowedOrigin(url: string): void

method can be used to append new allowed orign to existing list of allowed origins at any time. `url` Parameter may
contain full url, in this case origin will be extracted from it.

```javascript
sdk = ShellSdk.init();
sdk.setAllowedOrigins(['https://example.com', 'https://example2.com']);
sdk.addAllowedOrigin('https://example3.com/extension');
// now allowed origins are: ['https://example.com', 'https://example2.com', 'https://example3.com']
```

#### - removeAllowedOrigin(url: string): void

method can be used to remove origin from list of allowed orign at any time. `url` Parameter may
contain full url, in this case origin will be extracted from it.

```javascript
sdk = ShellSdk.init();
sdk.setAllowedOrigins(['https://example.com', 'https://example2.com']);
sdk.addAllowedOrigin('https://example.com/extension');
// now allowed origins are: ['https://example2.com']
```

#### - isOriginAllowed(url: string): boolean

method can be used to test if specified origin is in the list of allowed origins. `url` Parameter may
contain full url, in this case origin will be extracted from it.

```javascript
sdk = ShellSdk.init();
sdk.setAllowedOrigins(['https://example.com', 'https://example2.com']);
const isAllowed = sdk.isOriginAllowed('https://example.com/extension');
// isAllowed will be set to true
```

## Ignored origins

In some cases, a specific origin might need to be ignored by ShellSdk. As using **allowed origins** to filter those will display a `console.error` message, it is possible to use as an alternative the **ignored origins** as following:

```javascript
sdk = ShellSdk.init();
sdk.setIgnoredOrigins(['https://example.com', 'https://example2.com']);
sdk.addIgnoredOrigin('https://example.com/extension');
// now ignored origins are: ['https://example.com/extension']
```

Messages from those origins will be silently ignored by ShellSdk.
