window.image = function (imageId, params, fileName) {
    var params = new URLSearchParams(params || {}).toString();
    var fileName = fileName || null;
    return path('image', { imageId : imageId, fileName : fileName }) + (params ? '?' + params : '');
}

Twig.extendFunction("image", image);