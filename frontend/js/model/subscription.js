define(["require", "exports", "./backup"], function (require, exports, backup_1) {
    "use strict";
    var Subscription = (function () {
        function Subscription(data) {
            var _this = this;
            this.backups = [];
            this.backupIsEmpty = function () {
                return (_this.backups && _this.backups.length != 0) ? false : true;
            };
            this.id = data.id;
            this.accountAlias = data.accountAlias;
            this.externalId = data.externalId;
            this.instanceType = data.instanceType;
            this.isReplicated = (data.instanceType.indexOf("REPLICATION") !== -1) ? true : false;
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
            this.activeServerRole = getActiveServerRole(data.servers);
            if (data.backups) {
                data.backups.forEach(function (b) {
                    _this.backups.push(new backup_1.Backup(b));
                });
            }
            this.restartRequired = data.restartRequired;
        }
        // TODO: Complete
        Subscription.prototype.update = function () {
        };
        return Subscription;
    }());
    exports.Subscription = Subscription;
    function getActiveServerRole(servers) {
        var activeServerRole = "UNKNOWN";
        servers.forEach(function (s) {
            if (s.attributes.hasOwnProperty('ACTIVE_CONNECTION')) {
                s.attributes.forEach(function (a) {
                    if (a.key == "REPLICATION_ROLE") {
                        activeServerRole = a.value;
                    }
                });
            }
        });
        return activeServerRole;
    }
});
//# sourceMappingURL=subscription.js.map