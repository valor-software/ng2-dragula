System.register(['./src/app/directives/dragula.directive', './src/app/providers/dragula.provider'], function(exports_1) {
    var dragula_directive_1, dragula_provider_1;
    function exportStar_1(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters:[
            function (dragula_directive_1_1) {
                dragula_directive_1 = dragula_directive_1_1;
                exportStar_1(dragula_directive_1_1);
            },
            function (dragula_provider_1_1) {
                dragula_provider_1 = dragula_provider_1_1;
                exportStar_1(dragula_provider_1_1);
            }],
        execute: function() {
            exports_1("default",{
                directives: [dragula_directive_1.Dragula],
                providers: [dragula_provider_1.DragulaService]
            });
        }
    }
});
//# sourceMappingURL=ng2-dragula.js.map