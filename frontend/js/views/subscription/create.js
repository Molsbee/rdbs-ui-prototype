define(["require", "exports", "knockout", "../../rdbs-api", "../../model/notification", "../../model/pricing"], function (require, exports, ko, rdbs_api_1, notification_1, pricing_1) {
    "use strict";
    var Form = (function () {
        function Form() {
            var _this = this;
            this.engine = ko.observable();
            this.edition = ko.observable();
            this.network = ko.observable().extend({
                required: { onlyIf: function () { return _this.engine() === 'MSSQL'; } }
            });
            this.dataCenter = ko.observable();
            this.databaseName = ko.observable().extend({
                required: { params: true, message: "Please enter a database name" },
                minLength: { params: 2, message: "Your database name must container more than 2 characters" },
                maxLength: { params: 16, message: "Your database name must contain fewer than 16 characters" },
                pattern: { params: /^(?![0-9]+$)(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$/g, message: "Please enter a DNS valid name" }
            });
            this.username = ko.observable().extend({
                required: { params: true, message: "Please enter a database username" },
                minLength: { params: 2, message: "Your username must contain more than 2 characters" },
                maxLength: { params: 16, message: "Your username must contain fewer than 16 characters" }
            });
            this.disableUsername = ko.computed(function () {
                return _this.engine() == "MSSQL";
            });
            this.password = ko.observable().extend({
                required: { params: true, message: "Please provide a password" },
                passwordStrength: { requiredStrength: 3, dissallowedCharacters: "/`$^&\\|'\"<>" }
            });
            this.passwordConfirmation = ko.observable().extend({
                required: { params: true, message: "Please confirm your password" },
                equal: { params: this.password, message: "Your passwords do not match " }
            });
            this.cpu = ko.observable();
            this.memory = ko.observable();
            this.storage = ko.observable();
            this.replicationToggle = ko.observable(false);
            this.notificationToggle = ko.observable(false);
            this.notifications = ko.observableArray();
            this.backupToggle = ko.observable(false);
            this.backupHour = ko.observable(1);
            this.backupMinute = ko.observable(1);
            this.backupRetention = ko.observable(7);
            this.selectedConfigurationProfile = ko.observable();
            this.setEngine = function (option, item) {
                if (_this.object != null && item.engine == _this.object['engine']) {
                    ko.applyBindingsToNode(option.parentElement, { value: item.engine }, item);
                }
            };
            this.setEdition = function (option, item) {
                if (_this.object != null && item.editon == _this.object['edition']) {
                    ko.applyBindingsToNode(option.parentElement, { value: item.edition }, item);
                }
            };
            this.setNetwork = function (option, item) {
                if (_this.object != null && item.network == _this.object['network']) {
                    ko.applyBindingsToNode(option.parentElement, { value: item.network }, item);
                }
            };
            this.setDataCenter = function (option, item) {
                if (_this.object != null && item.dataCenter == _this.object['dataCenter']) {
                    ko.applyBindingsToNode(option.parentElement, { value: item.dataCenter }, item);
                }
            };
        }
        Form.prototype.construct = function () {
            var _this = this;
            var data = localStorage.getItem("createForm");
            if (data != null) {
                var object = $.parseJSON(data);
                this.object = object;
                this.databaseName(object['databaseName']);
                this.username(object['username']);
                this.password(object['password']);
                this.passwordConfirmation(object['passwordConfirmation']);
                this.cpu(object['cpu']);
                this.memory(object['memory']);
                this.storage(object['storage']);
                this.replicationToggle(object['replicationToggle']);
                this.notificationToggle(object['notificationToggle']);
                // TODO Model Notification
                var notificationArray = [];
                if (object['notifications'] != null) {
                    for (var i in object['notifications']) {
                        notificationArray.push(object['notifications'][i]);
                    }
                }
                else {
                    notificationArray.push("");
                }
            }
            localStorage.removeItem("createForm");
            this.engine.subscribe(function (e) {
                if (e == "MSSQL")
                    _this.username("SA");
            });
        };
        return Form;
    }());
    var ViewModel = (function () {
        function ViewModel(api, accountContext) {
            var _this = this;
            this.submitting = ko.observable(false);
            this.resourceConstraint = ko.computed(function () {
                return (_this.submitting() || _this.freeTrialCard.checked());
            });
            this.engines = ko.observableArray();
            this.networks = ko.observableArray();
            this.networkIsDisabled = ko.observable(false);
            this.configurationProfiles = ko.observableArray();
            this.notificationType = ko.observableArray(["EMAIL"]);
            this.hour = ko.observableArray();
            this.minute = ko.observableArray();
            this.nameField = ko.computed(function () {
                return _this.form.engine() == "MSSQL" ? "instance name" : "database name";
            });
            this.storageMax = ko.computed(function () {
                return _this.form.engine() == "MSSQL" ? 1024 : 664;
            });
            this.memoryMax = ko.computed(function () {
                return (_this.form.engine() == "MSSQL" && _this.form.edition() == "Web") ? 64 : 128;
            });
            this.editions = ko.computed(function () {
                var editions = [];
                _this.engines().forEach(function (e) {
                    if (e.engine == _this.form.engine()) {
                        editions = e.editions;
                    }
                });
                return editions;
            });
            this.datacenters = ko.computed(function () {
                var datacenters = [];
                _this.engines().forEach(function (e) {
                    if (e.engine == _this.form.engine()) {
                        datacenters = e.dataCenters;
                    }
                });
                return datacenters;
            });
            this.disableBackupRetention = ko.computed(function () {
                return _this.form.engine() == 'MSSQL';
            });
            this.selectedConfigurationProfile = function (option, item) {
                // TODO Implement
            };
            this.addNotification = function () {
                _this.form.notifications.push(new notification_1.Notification());
            };
            this.removeNotification = function (item) {
                console.log(item);
                _this.form.notifications.remove(item);
                if (_this.form.notifications().length === 0) {
                    _this.form.notifications.push(new notification_1.Notification());
                    _this.form.notificationToggle(false);
                }
            };
            this.submit = function () {
                // TODO Implement
            };
            this.saveFormState = function () {
                localStorage.setItem("createForm", ko.mapping.toJSON(_this.form));
                window.location.href = "/configProfile-create?fromSubscriptionCreate=true";
            };
            this.loadPageData = function () {
                // TODO Implement
            };
            this.rdbsApi = new rdbs_api_1.RdbsApi(api, accountContext);
            this.form = new Form();
            this.rdbsApi.engine().get(function (engines) {
                _this.engines(engines);
            });
            this.form.dataCenter.subscribe(function (d) {
                if (typeof d !== "undefined" && d !== "") {
                }
            });
            this.rdbsApi.configurationProfile().getProfiles(function (profiles) {
                _this.configurationProfiles(profiles);
            });
            this.hour(populateArray(0, 24));
            this.hour(populateArray(0, 60));
            this.form.engine.subscribe(function (e) {
                if (e == "MSSQL") {
                    _this.form.backupRetention(7);
                }
            });
            this.pricingEstimator = new pricing_1.PricingEstimator(api, this.form.cpu, this.form.memory, this.form.storage);
            this.form.dataCenter.subscribe(function (dataCenter) {
                if (dataCenter) {
                    _this.pricingEstimator.loadPricing(_this.form.engine(), _this.form.replicationToggle(), dataCenter);
                }
            });
            this.form.engine.subscribe(function (e) {
                if (e) {
                    _this.pricingEstimator.loadPricing(e, _this.form.replicationToggle(), _this.form.dataCenter());
                }
            });
            this.form.replicationToggle.subscribe(function (t) {
                if (t) {
                    _this.pricingEstimator.loadPricing(_this.form.engine(), t, _this.form.dataCenter());
                }
            });
            ko.validation.init({ grouping: { deep: true } });
            this.errors = ko.validation.group([
                this.form.databaseName,
                this.form.username,
                this.form.password,
                this.form.passwordConfirmation,
                this.form.notifications
            ]);
        }
        return ViewModel;
    }());
    exports.ViewModel = ViewModel;
    function populateArray(min, max) {
        var temp = [];
        for (var i = min; i < max; i++) {
            temp.push(("0" + i).slice(-2));
        }
        return temp;
    }
});
//# sourceMappingURL=create.js.map