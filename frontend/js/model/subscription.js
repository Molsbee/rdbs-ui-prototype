"use strict";
var Subscription = (function () {
    // restartRequired: boolean;
    function Subscription(id, accountAlias, externalId, instanceType, engine, location, host, port, servers, backups) {
        this.id = id;
        this.accountAlias = accountAlias;
        this.externalId = externalId;
        this.instanceType = instanceType;
        this.isReplicated = (instanceType.indexOf("REPLICATION") !== -1) ? true : false;
        this.engine = engine;
        this.location = location;
        this.host = host;
        this.port = port;
        this.servers = servers;
        this.backups = backups;
        this.backupIsEmpty = (backups.length == 0) ? true : false;
    }
    return Subscription;
}());
exports.Subscription = Subscription;
//# sourceMappingURL=subscription.js.map