import {RestorePoint} from "../model/backup";
import Moment = moment.Moment;

declare var atlas: any;

export interface BackupResponse {
    id: number;
    fileName: string;
    backupTime: string;
    backupType: string;
    status: string;
    size: number;
}

export interface RestorePointResponse {
    startPosition: Moment;
    endPosition: Moment;
}

interface RestorePointsCallback {
    (restorePoints: Array<RestorePoint>) : void;
}

export class BackupAPI {

    api: string;
    accountContext: KnockoutObservable<any>;

    constructor(api: string, accountContext: KnockoutObservable<any>) {
        this.api = api;
        this.accountContext = accountContext;
    }

    getRestorePoints = (subscriptionId: number, callback: RestorePointsCallback): void => {
        let restorePoints: Array<RestorePoint> = [];
        atlas.ajax({
            method: 'GET',
            url: this.api + "/" + this.accountContext().accountAlias + "/subscriptions/" + subscriptionId + "/backups/restorePoints",
            success: (data: RestorePointResponse) => {
                restorePoints.push(new RestorePoint(data));
            },
            complete: () => {
                callback(restorePoints);
            }
        })
    };
}