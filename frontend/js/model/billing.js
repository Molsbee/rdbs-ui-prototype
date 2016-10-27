define(["require", "exports"], function (require, exports) {
    "use strict";
    var Billing = (function () {
        function Billing() {
        }
        Billing.prototype.loadBilling = function (billingURL, callback) {
            console.log("loading billing data");
            var self = this;
            self.currentHour = "...";
            self.monthToDate = "...";
            self.monthlyEstimate = "...";
            atlas.ajax({
                method: 'GET',
                url: billingURL,
                success: function (response) {
                    self.currentHour = response.currentHour;
                    self.monthToDate = response.monthToDate;
                    self.monthlyEstimate = response.monthlyEstimate;
                },
                error: function () {
                    self.currentHour = "-";
                    self.monthToDate = "-";
                    self.monthlyEstimate = "-";
                },
                complete: function () {
                    callback();
                }
            });
        };
        return Billing;
    }());
    exports.Billing = Billing;
});
//# sourceMappingURL=billing.js.map