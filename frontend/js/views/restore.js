define(["require", "exports", "knockout", "moment", "../api/SubscriptionAPI", "../api/BackupAPI"], function (require, exports, ko, moment, SubscriptionAPI_1, BackupAPI_1) {
    "use strict";
    var ViewModel = (function () {
        function ViewModel(subscriptionId, api, accountContext) {
            var _this = this;
            this.toSubscription = ko.observable();
            this.fromSubscription = ko.observable();
            this.fromSubscriptions = ko.observableArray();
            this.fromBackup = ko.observable();
            this.restoreType = ko.observable("full");
            this.selectedDateTime = ko.observable(moment().utc().seconds(59).milliseconds(999));
            this.restorePoints = ko.observableArray();
            this.renderFromSubscriptions = function (option, item) {
                if (_this.toSubscription().id === item.id) {
                    ko.applyBindingsToNode(option.parentElement, { value: item }, item);
                }
                if (_this.toSubscription().storage < item.storage) {
                    ko.applyBindingsToNode(option, { disable: true }, item);
                }
            };
            this.restoreSubscription = function () {
                if (_this.restoreType() == 'point-in-time') {
                    if (_this.errors().length < 1) {
                        var request = {
                            type: "point-in-time-restore",
                            toSubscriptionId: _this.toSubscription().id,
                            restoreToTime: _this.selectedDateTime().valueOf()
                        };
                        atlas.ajax({
                            method: 'POST',
                            url: _this.api + "/" + _this.accountContext().accountAlias + "/subscriptions" + _this.fromSubscription().id + "/backups/operations",
                            data: JSON.stringify(request),
                            contentType: 'application/json',
                            success: function () {
                                window.location.href = "/" + _this.accountContext().accountAlias + "/subscription/" + _this.toSubscription().id;
                            },
                            error: function (jqXhr, textStatus, errorThrown) {
                                alert("Error performing point in time restore request: " + errorThrown);
                            }
                        });
                    }
                    else {
                        _this.errors.showAllMessages();
                    }
                }
                else {
                    var request = {
                        type: "restore",
                        toSubscriptionId: _this.toSubscription().id
                    };
                    atlas.ajax({
                        method: 'POST',
                        url: _this.api + "/" + _this.accountContext().accountAlias + "/subscriptions/" + _this.fromSubscription().id + "/backups/" + _this.fromBackup().id + "/operations",
                        data: JSON.stringify(request),
                        contentType: 'application/json',
                        success: function () {
                            window.location.href = "/" + _this.accountContext().accountAlias + "/subscription/" + _this.toSubscription().id;
                        },
                        error: function (jqXhr, textStatus, errorThrown) {
                            alert("Error restoring subscription: " + errorThrown);
                        }
                    });
                }
            };
            this.cancel = function () {
                window.location.href = "/" + _this.accountContext().accountAlias + "/subscription" + _this.toSubscription().id;
            };
            console.log(subscriptionId);
            console.log(api);
            this.api = api;
            this.accountContext = accountContext;
            this.subscriptionApi = new SubscriptionAPI_1.SubscriptionAPI(api, accountContext);
            this.backupApi = new BackupAPI_1.BackupAPI(api, accountContext);
            this.subscriptionApi.getSubscription(subscriptionId, function (subscription) {
                _this.toSubscription(subscription);
                _this.subscriptionApi.getSubscriptionsByEngine(subscription.engine, function (subscriptions) {
                    var sub = [];
                    subscriptions.forEach(function (s) {
                        if (s.backups.length != 0) {
                            sub.push(s);
                        }
                    });
                    subscriptions.sort(function (a, b) {
                        if (a.location < b.location)
                            return -1;
                        if (a.location > b.location)
                            return 1;
                        if (a.externalId < b.externalId)
                            return -1;
                        if (a.externalId > b.externalId)
                            return 1;
                        return 0;
                    });
                    _this.fromSubscriptions(sub);
                });
            });
            this.fromSubscription.subscribe(function (subscription) {
                if (subscription) {
                    console.log(subscription.backups[0]);
                    _this.backupApi.getRestorePoints(subscription.id, function (restorePoints) {
                        _this.restorePoints(restorePoints);
                    });
                }
            });
            this.selectedDateTime.extend({
                validation: {
                    validator: function (val) {
                        var isValid = false;
                        _this.restorePoints().forEach(function (p) {
                            if (val.isBetween(p.startPosition, p.endPosition, null, '[]')) {
                                isValid = true;
                            }
                        });
                        return isValid;
                    },
                    message: "Selected date time must be between an available restore point",
                    onlyIf: function () {
                        return _this.restoreType() == 'point-in-time';
                    }
                }
            });
            ko.validation.init();
            this.errors = ko.validation.group([
                this.selectedDateTime,
            ]);
        }
        return ViewModel;
    }());
    exports.ViewModel = ViewModel;
});
//# sourceMappingURL=restore.js.map