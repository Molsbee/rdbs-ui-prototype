import * as ko from "knockout";
import {Computed, ObservableArray} from "knockout";
import Moment = moment.Moment;

class ActionLog {
    timeStamp: Moment;
    message: string;
    details: string;
    user: string;

    ActionLog(data: any) {
        this.timeStamp = moment.utc(data.timeStamp).local();
        this.message = data.message;
        this.details = data.details;
        this.user = data.user;
    }

}

export class History {

    actions: ObservableArray<ActionLog> = ko.observableArray();
    sortedActionsGroupedByDate: Computed<any> = ko.computed(() => {
            let sortedActions: any = [];
            let groupByDate: any = {};

            this.actions().forEach((a: ActionLog) => {
                let dateKey = a.timeStamp.format("dddd MMM DD, YY");
                if (!groupByDate[dateKey]) {
                    groupByDate[dateKey] = [];
                }
                groupByDate[dateKey].push(a);
            });

            for (var key in groupByDate) {
                groupByDate[key].sort(function(a: any, b: any) {
                    return b.timeStamp - a.timeStamp;
                });
                sortedActions.push({date: key, actions: groupByDate[key]})
            }

            sortedActions.sort(function(a: any, b: any) {
                return a.timeStamp - b.timeStamp;
            });

            return sortedActions;
    })

}