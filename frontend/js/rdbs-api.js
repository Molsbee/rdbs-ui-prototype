define(["require", "exports", "./api/BillingAPI", "./api/ActionLogAPI", "./api/SubscriptionAPI", "./api/EngineAPI", "./api/ConfigurationProfilesAPI"], function (require, exports, BillingAPI_1, ActionLogAPI_1, SubscriptionAPI_1, EngineAPI_1, ConfigurationProfilesAPI_1) {
    "use strict";
    var RdbsApi = (function () {
        function RdbsApi(api, accountContext) {
            var _this = this;
            this.subscriptions = function () {
                if (!_this.subscriptionsApi) {
                    console.log("Creating new instance of subscription api");
                    _this.subscriptionsApi = new SubscriptionAPI_1.SubscriptionAPI(_this.api, _this.accountContext);
                }
                return _this.subscriptionsApi;
            };
            this.actionLog = function () {
                if (!_this.actionLogApi) {
                    console.log("Creating new instance of action log api");
                    _this.actionLogApi = new ActionLogAPI_1.ActionLogAPI(_this.api, _this.accountContext);
                }
                return _this.actionLogApi;
            };
            this.billing = function () {
                if (!_this.billingAPI) {
                    console.log("Creating new instance of billing api");
                    _this.billingAPI = new BillingAPI_1.BillingAPI(_this.api, _this.accountContext);
                }
                return _this.billingAPI;
            };
            this.engine = function () {
                if (!_this.engineAPI) {
                    console.log("Creating new instance of engine api");
                    _this.engineAPI = new EngineAPI_1.EngineAPI(_this.api, _this.accountContext);
                }
                return _this.engineAPI;
            };
            this.configurationProfile = function () {
                if (!_this.configurationProfileAPI) {
                    console.log("Creating new instance of configuration profile api");
                    _this.configurationProfileAPI = new ConfigurationProfilesAPI_1.ConfigurationProfilesAPI(_this.api, _this.accountContext);
                }
                return _this.configurationProfileAPI;
            };
            this.api = api;
            this.accountContext = accountContext;
        }
        return RdbsApi;
    }());
    exports.RdbsApi = RdbsApi;
});
//# sourceMappingURL=rdbs-api.js.map