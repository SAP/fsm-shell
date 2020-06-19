# Security

## Allowed origins only

You can use the method `.setAllowedOrigins` to restrict message handling to a list of allowed origins.

```javascript
sdk = ShellSdk.init();
sdk.setAllowedOrigins(['example.com', 'example2.com']);
```

To help debugging, an error will be displayed if an event come from an other origin.

You disable this settings, call `.setAllowedOrigins` with an empy parameter.
