define(["require", "exports"], function (require, exports) {
    "use strict";
    var Subscription = (function () {
        function Subscription(data) {
            var _this = this;
            this.id = data.id;
            this.accountAlias = data.accountAlias;
            this.externalId = data.externalId;
            this.instanceType = data.instanceType;
            this.isReplicated = (this.instanceType.indexOf("REPLICATION") !== -1) ? true : false;
            this.engine = data.engine;
            this.location = data.location;
            this.host = data.host;
            this.port = data.port;
            this.status = data.status;
            this.servers = data.servers;
            var server = this.servers[0];
            this.cpu = server.cpu;
            this.memory = server.memory;
            this.storage = server.storage;
            this.servers.forEach(function (s) {
                if (s.attributes.hasOwnProperty('ACTIVE_CONNECTION')) {
                    s.attributes.forEach(function (a) {
                        if (a.key == "REPLICATION_ROLE")
                            _this.activeServerRole = a.value;
                    });
                }
            });
            this.backups = data.backups;
            this.backupIsEmpty = (this.backups.length == 0) ? true : false;
            this.restartRequired = data.restartRequired;
        }
        // TODO: Complete
        Subscription.prototype.update = function () {
        };
        return Subscription;
    }());
    exports.Subscription = Subscription;
});
//# sourceMappingURL=subscription.js.map