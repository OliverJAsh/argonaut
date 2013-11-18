define(function() {

    function validValueType(val) {
        var type = typeof val;
        return type === 'string' || type === 'number' || type === 'boolean';
    }

    function truthy(x) {
        return x;
    }

    /**
     * Apply a URI template to a set of parameters.
     *
     * @param {string} template URI template string
     * @param {object} params   Key-value map of URI parameters
     * @return
     */
    function uriTemplate(template, params) {
        params = params || {};
        return template.
            replace(/\{\?(.*?)\}/g, function(match, varNameList) {
                var varNames = varNameList.split(',');
                var query = varNames.map(function(varName) {
                    var val = params[varName];
                    if (typeof val !== 'undefined') {
                        if (! validValueType(val)) {
                            throw new Error("Invalid type for URI template parameter: " + varName);
                        }
                        // TODO: url encode?
                        return varName + '=' + val;
                    }
                }).filter(truthy);
                if (query.length > 0) {
                    return '?' + query.join('&');
                } else {
                    return '';
                }
            }).
            replace(/\{(.*?)\}/g, function(match, varName) {
                var val = params[varName];
                if (!val) {
                    throw new Error("Missing parameter for URI template variable: " + varName);
                }
                if (! validValueType(val)) {
                    throw new Error("Invalid type for URI template parameter: " + varName);
                }
                return val;
            });
    }

    return uriTemplate;
});
