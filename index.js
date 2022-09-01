const axios = require('axios');

let sendMessage = (logType,startTime, categoryName, message, webhookUrl) => {
    let themeColor = '';
    switch (logType) {
        case 'ERROR':
            themeColor = 16711680;
            break;
        case 'WARN':
            themeColor = 16776960;
            break;
        case 'INFO':
            themeColor = 65280;
            break;
        case 'TRACE':
            themeColor = 255;
            break;
        case 'DEBUG':
            themeColor = 65535;
            break;
        case 'FATAL':
            themeColor = 16711935;
            break;

    }

    axios({
        method: 'post',
        url: webhookUrl,
        data: {
            "content": `${startTime} - ${categoryName}`,
            "embeds": [
                {
                    "title": logType,
                    "description": message,
                    "color": themeColor
                }
            ],
            "attachments": []
        }
    }).catch(err => {
        console.error('log4js discord appender - Error ', err);
    })
};

function configure(config) {
    return discordAppender(config);
}

function discordAppender(config) {
    return (logEvent) => {
        if (!config.webhookUrl)
            console.error('log4js discord appender - Validation Error', 'WebHook not defined in config');
        else {
            let message = '';
            logEvent.data.forEach(log => {
                if (typeof log !== 'string'){
                    if(log instanceof Error){
                        message += log.stack;
                    }else if(log instanceof Object){
                        message += JSON.stringify(log);
                    }else {
                        message += log +' ';
                    }
                }else {
                    message += log + ' ';
                }
            });
            sendMessage(logEvent.level.levelStr,logEvent.startTime, logEvent.categoryName, message, config.webhookUrl);
        }
    };
}

exports.configure = configure;
