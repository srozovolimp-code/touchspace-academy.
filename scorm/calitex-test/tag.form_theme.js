Twig.extend(function (Twig) {
    Twig.exports.extendTag({
        type: 'form_theme',
        regex: /^form_theme\s+form\s+(.+)$/,
        next: [],
        open: true,
        parse() {
            return {
                chain: false,
                output: ''
            };
        }
    });
});