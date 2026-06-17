window.permission = function(permission) {
    const user = Twig.getGlobal('currentUser');

    return user.permissions.includes(permission);
}

Twig.extendFunction("permission", permission);
