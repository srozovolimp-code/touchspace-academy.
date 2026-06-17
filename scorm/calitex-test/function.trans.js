window.trans = function (messageId, domain, params) {
    var translations = window.translations || {},
        domain = domain || 'messages',
        params = params || {},
        result = messageId || '';

    if (typeof translations[domain] !== 'undefined' && typeof translations[domain][messageId] !== 'undefined') {
        result = translations[domain][messageId];

        if (typeof params['%count%'] !== 'undefined') {
            let isIE11 = !!window.MSInputMethodContext && !!document.documentMode; //MOT-21860
            result = isIE11 ? result : choiceTranslation(result, Number(params['%count%']));
        }

        for (key in params) {
            result = result.replace(key, params[key]);
        }
    }

    return result;
}

function choiceTranslation(message, number) {
    let locale = Twig.getGlobal('locale'),
        parts = [],
        standardRules = [],
        matches = [];

    if (/^\|+$/.test(message)) {
        parts = message.split('|');
    }
    else if (matches = message.match(/(?:\|\||[^\|])+/g)) {
        parts = matches;
    }

    let intervalRegexp = /^(?<interval>({\s*(\-?\d+(\.\d+)?[\s*,\s*\-?\d+(\.\d+)?]*)\s*})|(?<left_delimiter>[\[\]])\s*(?<left>-Inf|\-?\d+(\\d+)?)\s*,\s*(?<right>\+?Inf|\-?\d+(\.\d+)?)\s*(?<right_delimiter>[\[\]]))\s*(?<message>.*?)$/s;

    for (i = 0; i < parts.length; i++) {
        let part = parts[i].replace('||', '|').trim();

        if (matches = intervalRegexp.exec(part)) {
            if (matches[2]) {
                let interval = matches[3].split(',');
                for (let n = 0; n < interval.length; n++) {
                    if (number == n)
                    {
                        return matches.groups.message;
                    }
                }
            }
            else {
                let leftNumber = '-Inf' === matches.groups.left ? -Infinity: Number(matches.groups.left),
                    rightNumber = /^-?\d+$/.test(matrches.groups.right) ? Number(matches.groups.right) : Infinity;

                if (('[' === matches.groups.left_delimiter ? number >= leftNumber : number > leftNumber)
                    && (']' === matches.groups.right_delimiter ? number <= rightNumber : number < rightNumber)
                )
                {
                    return matches.groups.message;
                }
            }
        }
        else if (matches = /^\w+\:\s*(.*?)$/.exec(part)) {
            standardRules.push(matches[1]);
        }
        else {
            standardRules.push(part);
        }
    }

    let position = getPluralizationRule(number, locale);
    if(typeof standardRules[position] === 'undefined')
    {
        return 1 === parts.length && typeof standardRules[0] !== 'undefined' ? standardRules[0] : ''
    }

    return standardRules[position];
}

function getPluralizationRule(number, locale) {
    number = Math.abs(number);

    switch ('pt_BR' !== locale && locale.length > 3 ? locale.substr(0, locale.indexOf('_')) : locale) {
        case 'af':
        case 'bn':
        case 'bg':
        case 'ca':
        case 'da':
        case 'de':
        case 'el':
        case 'en':
        case 'eo':
        case 'es':
        case 'et':
        case 'eu':
        case 'fa':
        case 'fi':
        case 'fo':
        case 'fur':
        case 'fy':
        case 'gl':
        case 'gu':
        case 'ha':
        case 'he':
        case 'hu':
        case 'is':
        case 'it':
        case 'ku':
        case 'lb':
        case 'ml':
        case 'mn':
        case 'mr':
        case 'nah':
        case 'nb':
        case 'ne':
        case 'nl':
        case 'nn':
        case 'no':
        case 'oc':
        case 'om':
        case 'or':
        case 'pa':
        case 'pap':
        case 'ps':
        case 'pt':
        case 'so':
        case 'sq':
        case 'sv':
        case 'sw':
        case 'ta':
        case 'te':
        case 'tk':
        case 'ur':
        case 'zu':
            return (1 == number) ? 0 : 1;
        case 'am':
        case 'bh':
        case 'fil':
        case 'fr':
        case 'gun':
        case 'hi':
        case 'hy':
        case 'ln':
        case 'mg':
        case 'nso':
        case 'pt_BR':
        case 'ti':
        case 'wa':
            return (number < 2) ? 0 : 1;

        case 'be':
        case 'bs':
        case 'hr':
        case 'ru':
        case 'sh':
        case 'sr':
        case 'uk':
            return ((1 == number % 10) && (11 != number % 100)) ? 0 : (((number % 10 >= 2) && (number % 10 <= 4) && ((number % 100 < 10) || (number % 100 >= 20))) ? 1 : 2);

        case 'cs':
        case 'sk':
            return (1 == number) ? 0 : (((number >= 2) && (number <= 4)) ? 1 : 2);

        case 'ga':
            return (1 == number) ? 0 : ((2 == number) ? 1 : 2);

        case 'lt':
            return ((1 == number % 10) && (11 != number % 100)) ? 0 : (((number % 10 >= 2) && ((number % 100 < 10) || (number % 100 >= 20))) ? 1 : 2);

        case 'sl':
            return (1 == number % 100) ? 0 : ((2 == number % 100) ? 1 : (((3 == number % 100) || (4 == number % 100)) ? 2 : 3));

        case 'mk':
            return (1 == number % 10) ? 0 : 1;

        case 'mt':
            return (1 == number) ? 0 : (((0 == number) || ((number % 100 > 1) && (number % 100 < 11))) ? 1 : (((number % 100 > 10) && (number % 100 < 20)) ? 2 : 3));

        case 'lv':
            return (0 == number) ? 0 : (((1 == number % 10) && (11 != number % 100)) ? 1 : 2);

        case 'pl':
            return (1 == number) ? 0 : (((number % 10 >= 2) && (number % 10 <= 4) && ((number % 100 < 12) || (number % 100 > 14))) ? 1 : 2);

        case 'cy':
            return (1 == number) ? 0 : ((2 == number) ? 1 : (((8 == number) || (11 == number)) ? 2 : 3));

        case 'ro':
            return (1 == number) ? 0 : (((0 == number) || ((number % 100 > 0) && (number % 100 < 20))) ? 1 : 2);

        case 'ar':
            return (0 == number) ? 0 : ((1 == number) ? 1 : ((2 == number) ? 2 : (((number % 100 >= 3) && (number % 100 <= 10)) ? 3 : (((number % 100 >= 11) && (number % 100 <= 99)) ? 4 : 5))));

        default:
            return 0;
    }
}

Twig.extendFunction("trans", trans);