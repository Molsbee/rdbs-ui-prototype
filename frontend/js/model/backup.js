"use strict";
var moment = require("moment");
var Backup = (function () {
    function Backup(data) {
        this.id = data.id;
        this.fileName = data.fileName;
        this.backupType = data.backupType;
        this.backupTime = data.backupTime;
        this.formattedBackupTime = moment.utc(data.backupTime).format("MMM DD, YYYY HH:mm:ss z");
        this.status = data.status;
        this.size = data.size;
    }
    return Backup;
}());
exports.Backup = Backup;
//# sourceMappingURL=backup.js.map