# Node.js Wrapper for frp library
This is a Node.js wrapper package for the [frp](https://github.com/fatedier/frp) library, allowing you to easily integrate and utilize frp functionality within your Node.js applications. frp is a fast reverse proxy to help you expose a local server behind a NAT or firewall to the Internet.

## Installation
```bash
$ yarn add @bss-sbc/frp
```

## Usage
### frp Server
```javascript
const {frps} = require("@bss-sbc/frp");

frps.start(
    {
        common: {
            "bind_port": 7000,
            "vhost_http_port": 8080
        }
    },
    {log: true, unref: false}
)
```

### frp Client
```javascript
const {frpc} = require("@bss-sbc/frp");

frpc.start(
    {
        common: {
            "server_addr": "x.x.x.x",
            "server_port": 7000
        },
        web: {
            "type": "http",
            "local_port": 8080,
            "custom_domains": "www.example.com"
        }
    },
    {log: true, unref: false}
)
```

