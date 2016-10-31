define(["require", "exports", "../model/backup"], function (require, exports, backup_1) {
    "use strict";
    var BackupAPI = (function () {
        function BackupAPI(api, accountContext) {
            var _this = this;
            this.getRestorePoints = function (subscriptionId, callback) {
                var restorePoints = [];
                atlas.ajax({
                    method: 'GET',
                    url: _this.api + "/" + _this.accountContext().accountAlias + "/subscriptions/" + subscriptionId + "/backups/restorePoints",
                    success: function (data) {
                        restorePoints.push(new backup_1.RestorePoint(data));
                    },
                    complete: function () {
                        callback(restorePoints);
                    }
                });
            };
            this.api = api;
            this.accountContext = accountContext;
        }
        return BackupAPI;
    }());
    exports.BackupAPI = BackupAPI;
});
//# sourceMappingURL=BackupAPI.js.map