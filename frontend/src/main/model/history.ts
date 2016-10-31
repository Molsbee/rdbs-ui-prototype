import * as ko from "knockout";
import {ActionLog, ActionLogAPI} from "../api/ActionLogAPI";

export class History {

    actionLogApi: ActionLogAPI;

    actions: KnockoutObservableArray<ActionLog> = ko.observableArray<ActionLog>();
    sortedActionsGroupedByDate: KnockoutComputed<any> = ko.computed(() => {
        console.log("Sorting Actions grouped by Date");

        let sortedActions: any = [];
        let groupByDate: any = {};

        this.actions().forEach((a: ActionLog) => {
            let dateKey = a.timestamp.format("dddd MMM DD, YY");
            if (!groupByDate[dateKey]) {
                groupByDate[dateKey] = [];
            }
            groupByDate[dateKey].push(a);
        });

        for (var key in groupByDate) {
            groupByDate[key].sort(function(a: any, b: any) {
                return b.timestamp - a.timestamp;
            });
            sortedActions.push({date: key, actions: groupByDate[key]})
        }

        sortedActions.sort(function(a: any, b: any) {
            return a.timestamp - b.timestamp;
        });

        return sortedActions;
    });

    constructor(api: string, accountContext: KnockoutObservable<any>) {
        this.actionLogApi = new ActionLogAPI(api, accountContext);
    }


    loadActionLogs = () : void => {
        this.actionLogApi.getActionLogs((actionLogs: Array<ActionLog>) => {
            this.actions(actionLogs);
        })
    }


}