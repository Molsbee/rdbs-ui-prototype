define(["require", "exports"], function (require, exports) {
    "use strict";
    var Notification = (function () {
        function Notification() {
        }
        return Notification;
    }());
    exports.Notification = Notification;
});
// var Notification = function(data){
//     var self = this;
//
//     self.destinationType = ko.observable(data ? data['destinationType'] : '');
//     self.location = ko.observable(data ? data['location'] : '').extend({
//         email: {
//             onlyIf: function() { return self.destinationType() === 'EMAIL'; }
//         }
//     });
//     self.allCheckbox = ko.observable(data ? data['allCheckbox'] : false);
//     self.checkboxes = ko.observableArray();
//
//
//     self.toggleAll = function() {
//         self.checkboxes.removeAll();
//         self.checkboxes.push("CPU_UTILIZATION");
//         self.checkboxes.push("STORAGE_UTILIZATION");
//         return true;
//     };
//
//     if (data) {
//         if (data['allCheckbox']) {
//             self.toggleAll();
//         } else {
//             self.checkboxes(data['checkboxes']);
//         }
//     }
//
//     self.chosenNotifications = function() {
//         self.allCheckbox(false);
//         return true;
//     };
//
//     return self;
// }; 
//# sourceMappingURL=notification.js.map