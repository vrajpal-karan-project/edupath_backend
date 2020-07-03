

// Array of Error to Object
exports.normalErrors = (errors) => {
    let obj = {};
    errors.array().map(e => obj = { ...obj, [e.param]: e.msg });
    return obj;
}

exports.getRoleName = (role) => {
    if (role === 0) return "Student";
    if (role === 1) return "Instructor";
    if (role === 2) return "Admin";
    return "UNKNOWN";
}