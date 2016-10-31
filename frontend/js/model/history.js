define(["require", "exports", "knockout", "../api/ActionLogAPI"], function (require, exports, ko, ActionLogAPI_1) {
    "use strict";
    var History = (function () {
        function History(api, accountContext) {
            var _this = this;
            this.actions = ko.observableArray();
            this.sortedActionsGroupedByDate = ko.computed(function () {
                console.log("Sorting Actions grouped by Date");
                var sortedActions = [];
                var groupByDate = {};
                _this.actions().forEach(function (a) {
                    var dateKey = a.timestamp.format("dddd MMM DD, YY");
                    if (!groupByDate[dateKey]) {
                        groupByDate[dateKey] = [];
                    }
                    groupByDate[dateKey].push(a);
                });
                for (var key in groupByDate) {
                    groupByDate[key].sort(function (a, b) {
                        return b.timestamp - a.timestamp;
                    });
                    sortedActions.push({ date: key, actions: groupByDate[key] });
                }
                sortedActions.sort(function (a, b) {
                    return a.timestamp - b.timestamp;
                });
                return sortedActions;
            });
            this.loadActionLogs = function () {
                _this.actionLogApi.getActionLogs(function (actionLogs) {
                    _this.actions(actionLogs);
                });
            };
            this.actionLogApi = new ActionLogAPI_1.ActionLogAPI(api, accountContext);
        }
        return History;
    }());
    exports.History = History;
});
//# sourceMappingURL=history.js.map