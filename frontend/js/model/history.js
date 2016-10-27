define(["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    var ActionLog = (function () {
        function ActionLog() {
        }
        ActionLog.prototype.ActionLog = function (data) {
            this.timeStamp = moment.utc(data.timeStamp).local();
            this.message = data.message;
            this.details = data.details;
            this.user = data.user;
        };
        return ActionLog;
    }());
    var History = (function () {
        function History() {
            var _this = this;
            this.actions = ko.observableArray();
            this.sortedActionsGroupedByDate = ko.computed(function () {
                var sortedActions = [];
                var groupByDate = {};
                _this.actions().forEach(function (a) {
                    var dateKey = a.timeStamp.format("dddd MMM DD, YY");
                    if (!groupByDate[dateKey]) {
                        groupByDate[dateKey] = [];
                    }
                    groupByDate[dateKey].push(a);
                });
                for (var key in groupByDate) {
                    groupByDate[key].sort(function (a, b) {
                        return b.timeStamp - a.timeStamp;
                    });
                    sortedActions.push({ date: key, actions: groupByDate[key] });
                }
                sortedActions.sort(function (a, b) {
                    return a.timeStamp - b.timeStamp;
                });
                return sortedActions;
            });
        }
        return History;
    }());
    exports.History = History;
});
//# sourceMappingURL=history.js.map