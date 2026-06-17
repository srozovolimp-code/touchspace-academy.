window.view = function (template, data) {
    try {
        var data = data || {};
        return templates[template].render(data).toString();
    } catch (e) {
        console.trace();
        console.error(e)
        return '';
    }
}

Twig.extendFunction("view", view);
