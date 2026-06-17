window.path = function (routeName, params) {
    var params = params || [],
        route = window.routes[routeName.toLowerCase()] || '';
    for (i in params) {
        if (params[i] === null || typeof params[i] === 'undefined') {
            continue;
        }
        route = route.replace('{' + i + '}', params[i]);
    }
    route = route.replace('/{params}', '');
    route = route.replace(new RegExp('/{.*?}'), '');
    route = route.replace(new RegExp('^/'), window.location.origin + '/');
    return route;
}

Twig.extendFunction("path", path);
Twig.extendFunction("url", path);