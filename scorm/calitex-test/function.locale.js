window.locale = function () {
    return Twig.getGlobal('locale') || 'ru';
}

Twig.extendFunction("locale", locale);