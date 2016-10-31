import {Server} from "../model/server";
import {Backup} from "../model/backup";
import {Subscription} from "../model/subscription";

declare var atlas: any;

export interface SubscriptionResponse {
    id: number;
    accountAlias: string;
    location: string;
    instanceType: string;
    engine: string;
    externalId: string;
    restartRequired: boolean;
    status: string;
    backupTime: string;
    backupRetentionDays: number;
    servers: Array<Server>;
    host: string;
    port: number;
    certificate: string;
    backups: Array<Backup>;
    configurationProfile: any;
}

export interface SubscriptionsCallback {
    (subsciptions: Array<Subscription>) : void;
}

export interface SubscriptionCallback {
    (subscription: Subscription): void;
}

export class SubscriptionAPI {

    api: string;
    accountContext: KnockoutObservable<any>;

    constructor(api: string, accountContext: KnockoutObservable<any>) {
        this.api = api;
        this.accountContext = accountContext;
    }

    getSubscriptions = (callback: SubscriptionsCallback): void => {
        let subscriptionsArray: Array<Subscription> = [];
        atlas.ajax({
            method: 'GET',
            url: this.api + "/" + this.accountContext().accountAlias + "/subscriptions",
            success: (data: Array<SubscriptionResponse>) => {
                data.forEach((d) => {
                    subscriptionsArray.push(new Subscription(d));
                });
            },
            complete: () => {
                callback(subscriptionsArray);
            }
        });
    };

    getSubscriptionsByEngine = (engine: string, callback: SubscriptionsCallback): void => {
        let subscriptionsArray: Array<Subscription> = [];
        atlas.ajax({
            method: 'GET',
            url: this.api + "/" + this.accountContext().accountAlias + "/subscriptions?engine=" + engine,
            success: (data: Array<SubscriptionResponse>) => {
                data.forEach((d) => {
                    subscriptionsArray.push(new Subscription(d));
                });
            },
            complete: () => {
                callback(subscriptionsArray);
            }
        });
    };

    getSubscription = (subscriptionId: number, callback: SubscriptionCallback): void => {
        let subscription: Subscription;
        atlas.ajax({
            method: 'GET',
            url: this.api + "/" + this.accountContext().accountAlias + "/subscriptions/" + subscriptionId,
            success: (data: SubscriptionResponse) => {
                subscription = new Subscription(data);
            },
            complete: () => {
                callback(subscription);
            }
        });
    };

}