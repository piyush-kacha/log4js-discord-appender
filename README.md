Log4js Discord Appender
--------------------------------

Sends log events to a Discord channel. This is an appender for use with log4js.

## Installation
This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).
```
npm i log4js-discord-appender
```

## Configuration in discord

1. Open your **Server Settings** and head into the **Integrations** tab:
2. Click the **"Create Webhook"** button to create a new webhook!

![Discord Configuration 1](https://i.postimg.cc/BnqGzzH6/discord-image-1.png)

You'll have a few options here. You can:
* **Edit the avatar**: By clicking the avatar next to the Name in the top left
* **Choose what channel the Webhook posts to**: By selecting the desired text channel in the  dropdown menu.
* **Name your Webhook**: Good for distinguishing multiple webhooks for multiple different services.

![Discord Configuration 2](https://i.postimg.cc/RZVZthPX/discord-image-2.png)

## Configuration in code

* `type` - `log4js-discord-appender`
* `webhookURL` - Enter the **Discord-generated** URL
## Example

#### With webhook url
```js
log4js.configure({
    appenders: {
        discordAlert: {
            type: 'log4js-discord-appender',
            webhookUrl: 'https://discord.com/api/webhooks/*****/**********'
        }
    },
    categories: {default: {appenders: ['discordAlert'], level: 'warn'}}
});
```
This configuration will send all warn (and above) messages to the respective discord channel.


#### With multiple appenders
```js
log4js.configure({
	appenders: {
		out: {type: 'stdout'},
		allLogs: {type: 'file', filename: 'logs/all.log', maxLogSize: 10485760, backups: 10, compress: true},
		outFilter: {
			type: 'logLevelFilter', appender: 'out', level: process.env.LOG_LEVEL || 'all'
		},
		discordAlert: {
		    type: 'log4js-discord-appender',
		    webhookUrl: 'https://discord.com/api/webhooks/*****/**********'
		    },
		discordFilter: {
			type: 'logLevelFilter', appender: 'discordAlert', level: process.env.ALERT_LOG_LEVEL || 'warn'
		}
	},
	categories: {
		default: {appenders: ['allLogs','outFilter', 'discordFilter'], level: process.env.LOG_LEVEL || 'all'}
	}
});
```
This configuration displays use of multiple appenders.

- `outFilter`: Push log in **stdout** with filter `LOG_LEVEL` set in environment, if not set then `all` levels
- `discordFilter`: Push log in **discord channel** with filter `ALERT_LOG_LEVEL` set in environment, if not set then `warn` levels

#### Full Example with log4js and morgan `logger.js`
```js
/**
 * System and 3rd party libs
 */
const log4js = require('log4js');
const morgan = require('morgan');

/**
 * Configure log4js
 */
 log4js.configure({
    appenders: {
        out: { type: 'stdout' },
        allLogs: { type: 'file', filename: 'logs/all.log', maxLogSize: 10485760, backups: 10, compress: true },
        errorLogs: { type: 'file', filename: 'logs/error.log', maxLogSize: 10485760, backups: 10, compress: true },
        errorLogsFiltered: {
            type: 'logLevelFilter',
            appender: 'errorLogs',
            level: 'warn',
        },
        outFilter: {
            type: 'logLevelFilter',
            appender: 'out',
            level: process.env.LOG_LEVEL || 'all'
        },
        discordAlert: {
            type: 'log4js-discord-appender',
            webhookUrl: process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/*****/**********',
        },
        discordFilter: {
            type: 'logLevelFilter',
            appender: 'discordAlert',
            level: process.env.DISCORD_ALERT_LOG_LEVEL || 'warn',
        },
    },
    categories: {
        default: { appenders: ['allLogs', 'outFilter', 'errorLogsFiltered', 'discordFilter'], level: process.env.LOG_LEVEL || 'all' },
    },
 });

 const log = log4js.getLogger();
 const morganInstance = morgan('dev', {
     stream: {
         write: str => {
             if (str && str.split('?')[1]) {
                 if (str.split('?')[1].split('=')[0] !== 'watermark') {
                     log.debug(str);
                 }
             } else {
                 log.debug(str);
             }
         },
     },
 });

 /**
  * Service Export
  */
 module.exports = {
     log,
     morgan: morganInstance,
 };
```
