//  альтурнатива фильтру date, но с поправкой на разницу часовых поясов сервера и клиента
window.sdate = ((old) => function() {

    if (!arguments[0]) {
        return old.apply(this, arguments);    
    }

    let timezone = arguments[1][1] || Twig.getGlobal('server_timezone_name');
    if (timezone === 'UTC') {
        timezone = 'Africa/Abidjan';
    }

    let timestamp = null;
    if (!arguments[0].toString().length || arguments[0] === 'now') {
        timestamp = Math.floor(new Date().getTime() / 1000);
    } else {
        timestamp = arguments[0] * 1;
    }

    if (window.Intl && Intl.supportedValuesOf('timeZone').includes(timezone)) {
        // better now
        const timeInServerTimezone = Math.floor(new Date(
            new Date(timestamp*1000).toLocaleString("en-US", {timeZone: timezone})
        ).getTime() / 1000);
        
        const timeInLocalTimezone = Math.floor(new Date(timestamp*1000).getTime() / 1000);
        
        const diff = timeInServerTimezone - timeInLocalTimezone;
        
        arguments[0] = timestamp + diff;
    } else {
        // not good, don't know about summer time. Left for old browsers
        const [hours,minutes] = Twig.getGlobal('server_timezone').split(':').map((item)=>{
            return parseInt(item);
        }),
        serverTimezone = ( hours * 60 + (hours < 0 ? (-minutes) : minutes) ),
        clientTimezoneOffset = ( new Date(timestamp).getTimezoneOffset() ),
        delta = ( serverTimezone + clientTimezoneOffset ) * 60;
    
        arguments[0] = timestamp + delta;
    }
    
    return old.apply(this, arguments);
})(Twig.filters.date);

Twig.extendFilter("sdate", sdate);
