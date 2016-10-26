define(["require", "exports"], function (require, exports) {
    "use strict";
    var Server = (function () {
        function Server(data) {
            this.alias = data.alias;
            this.location = data.location;
            this.cpu = data.cpu;
            this.memory = data.memory;
            this.storage = data.storage;
            this.attributes = data.attributes;
        }
        return Server;
    }());
    exports.Server = Server;
});
//# sourceMappingURL=server.js.map