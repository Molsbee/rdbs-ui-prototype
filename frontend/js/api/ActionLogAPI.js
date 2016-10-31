define(["require", "exports", "moment"], function (require, exports, moment) {
    "use strict";
    var ActionLog = (function () {
        function ActionLog(data) {
            this.timestamp = moment.utc(data.timeStamp).local();
            this.message = data.message;
            this.details = data.details;
            this.user = data.user;
        }
        return ActionLog;
    }());
    exports.ActionLog = ActionLog;
    var ActionLogAPI = (function () {
        function ActionLogAPI(api, accountContext) {
            var _this = this;
            this.getActionLogs = function (callback) {
                var actionLogs = [];
                atlas.ajax({
                    method: 'GET',
                    url: _this.api + "/" + _this.accountContext().accountAlias + "/history",
                    success: function (data) {
                        data.forEach(function (d) {
                            actionLogs.push(new ActionLog(d));
                        });
                    },
                    complete: function () {
                        callback(actionLogs);
                    }
                });
            };
            this.api = api;
            this.accountContext = accountContext;
        }
        return ActionLogAPI;
    }());
    exports.ActionLogAPI = ActionLogAPI;
});
//# sourceMappingURL=ActionLogAPI.js.map