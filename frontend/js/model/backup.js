define(["require", "exports", "moment"], function (require, exports, moment) {
    "use strict";
    var RestorePoint = (function () {
        function RestorePoint(point) {
            this.startPosition = moment.utc(point.startPosition);
            this.formattedStartPosition = this.startPosition.format("MMMM DD, YYYY HH:mm z");
            this.endPosition = moment.utc(point.endPosition);
            this.formattedEndPosition = this.endPosition.format("MMMM DD, YYYY HH:mm z");
        }
        return RestorePoint;
    }());
    exports.RestorePoint = RestorePoint;
    var Backup = (function () {
        function Backup(data) {
            var _this = this;
            this.formattedBackupTime = function () {
                return moment.utc(_this.backupTime).format("MMMM DD, YYYY HH:mm:ss z");
            };
            this.id = data.id;
            this.fileName = data.fileName;
            this.backupTime = data.backupTime;
            this.backupType = data.backupType;
            this.status = data.status;
            this.size = data.size;
        }
        return Backup;
    }());
    exports.Backup = Backup;
});
//# sourceMappingURL=backup.js.map