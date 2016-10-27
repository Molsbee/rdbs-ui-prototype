define(["require", "exports", "moment"], function (require, exports, moment) {
    "use strict";
    var Backup = (function () {
        function Backup(data) {
            this.id = data.id;
            this.fileName = data.fileName;
            this.backupType = data.backupType;
            this.backupTime = data.backupTime;
            // this.formattedBackupTime = moment.utc(data.backupTime).format("MMMM DD, YYYY HH:mm:ss z");
            this.status = data.status;
            this.size = data.size;
        }
        Backup.prototype.getFormattedBackupTime = function () {
            return moment.utc(this.backupTime).format("MMMM DD, YYYY HH:mm:ss z");
        };
        return Backup;
    }());
    exports.Backup = Backup;
});
//# sourceMappingURL=backup.js.map