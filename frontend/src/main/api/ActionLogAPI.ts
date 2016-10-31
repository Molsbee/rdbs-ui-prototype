import * as moment from "moment";
import Moment = moment.Moment;

declare var atlas: any;

export class ActionLog {
    timestamp: Moment;
    message: string;
    details: string;
    user: string;

    constructor(data: any) {
        this.timestamp = moment.utc(data.timeStamp).local();
        this.message = data.message;
        this.details = data.details;
        this.user = data.user;
    }

}

export interface ActionLogCallback {
    (actionLogs: Array<ActionLog>) : void;
}

export class ActionLogAPI {

    private api: string;
    private accountContext: KnockoutObservable<any>;

    constructor(api: string, accountContext: KnockoutObservable<any>) {
        this.api = api;
        this.accountContext = accountContext;
    }

    getActionLogs = (callback: ActionLogCallback): void => {
        let actionLogs: Array<ActionLog> = [];
        atlas.ajax({
            method: 'GET',
            url: this.api + "/" + this.accountContext().accountAlias + "/history",
            success: (data: Array<any>) => {
                data.forEach((d: any) => {
                    actionLogs.push(new ActionLog(d));
                })
            },
            complete: () => {
                callback(actionLogs);
            }
        });
    };
}