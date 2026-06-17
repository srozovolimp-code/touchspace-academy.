window.anchor = function ($url = '', $title = '', $attributes = null) {
    let $result = null;
    let $attributesString = null;

    if ($attributes) {
        if (typeof $attributes === 'string' || $attributes instanceof String) {
            $attributesString = $attributes;
        }
        else {
            $attributesString = $attributes.join(" ");
        }
    }

    if ($url && $title) {
        $result = '<a href="' + $url + '" ' + $attributesString + '>' + $title + '</a>';
    }

    return $result;
}

Twig.extendFunction("anchor", anchor);