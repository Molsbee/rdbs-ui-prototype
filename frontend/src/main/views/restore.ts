import * as ko from "knockout";
import * as moment from "moment";
import {Subscription} from "../model/subscription";
import {SubscriptionAPI} from "../api/SubscriptionAPI";
import {Backup, RestorePoint} from "../model/backup";
import {BackupAPI} from "../api/BackupAPI";
import Moment = moment.Moment;

declare var atlas: any;

export class ViewModel {

    private api: string;
    private accountContext: KnockoutObservable<any>;
    private subscriptionApi: SubscriptionAPI;
    private backupApi: BackupAPI;

    toSubscription: KnockoutObservable<Subscription> = ko.observable<Subscription>();
    fromSubscription: KnockoutObservable<Subscription> = ko.observable<Subscription>();
    fromSubscriptions: KnockoutObservableArray<Subscription> = ko.observableArray<Subscription>();
    fromBackup: KnockoutObservable<Backup> = ko.observable<Backup>();
    restoreType: KnockoutObservable<String> = ko.observable("full");
    selectedDateTime: KnockoutObservable<Moment> = ko.observable(moment().utc().seconds(59).milliseconds(999));
    restorePoints: KnockoutObservableArray<RestorePoint> = ko.observableArray<RestorePoint>();
    errors: KnockoutValidationErrors;

    constructor(subscriptionId: number, api: string, accountContext: KnockoutObservable<any>) {
        console.log(subscriptionId);
        console.log(api);

        this.api = api;
        this.accountContext = accountContext;
        this.subscriptionApi = new SubscriptionAPI(api, accountContext);
        this.backupApi = new BackupAPI(api, accountContext);

        this.subscriptionApi.getSubscription(subscriptionId, (subscription) => {
            this.toSubscription(subscription);

            this.subscriptionApi.getSubscriptionsByEngine(subscription.engine, (subscriptions) => {
                let sub: Array<Subscription> = [];
                subscriptions.forEach((s) => {
                    if (s.backups.length != 0) {
                        sub.push(s);
                    }
                });

                subscriptions.sort(function(a, b) {
                    if (a.location < b.location) return -1;
                    if (a.location > b.location) return 1;
                    if (a.externalId < b.externalId) return -1;
                    if (a.externalId > b.externalId) return 1;
                    return 0;
                });

                this.fromSubscriptions(sub);
            });
        });

        this.fromSubscription.subscribe((subscription: Subscription) => {
            if (subscription) {
                console.log(subscription.backups[0]);
                this.backupApi.getRestorePoints(subscription.id, (restorePoints) => {
                    this.restorePoints(restorePoints);
                })
            }
        });

        this.selectedDateTime.extend({
            validation: {
                validator: (val: Moment) => {
                    var isValid = false;
                    this.restorePoints().forEach((p) => {
                        if (val.isBetween(p.startPosition, p.endPosition, null, '[]')) {
                            isValid = true;
                        }
                    });
                    return isValid;
                },
                message: "Selected date time must be between an available restore point",
                onlyIf: () => {
                    return this.restoreType() == 'point-in-time';
                }
            }
        });

        ko.validation.init();
        this.errors = ko.validation.group([
            this.selectedDateTime,
        ])
    }

    renderFromSubscriptions = (option: any, item: Subscription) : void => {
        if (this.toSubscription().id === item.id) {
            ko.applyBindingsToNode(option.parentElement, {value: item}, item);
        }
        if (this.toSubscription().storage < item.storage) {
            ko.applyBindingsToNode(option, {disable: true}, item);
        }
    };

    restoreSubscription = (): void => {
        if (this.restoreType() == 'point-in-time') {
            if (this.errors().length < 1) {
                let request = {
                    type: "point-in-time-restore",
                    toSubscriptionId: this.toSubscription().id,
                    restoreToTime: this.selectedDateTime().valueOf()
                };

                atlas.ajax({
                    method: 'POST',
                    url: this.api + "/" + this.accountContext().accountAlias + "/subscriptions" + this.fromSubscription().id + "/backups/operations",
                    data: JSON.stringify(request),
                    contentType: 'application/json',
                    success: () => {
                        window.location.href = "/" + this.accountContext().accountAlias + "/subscription/" + this.toSubscription().id;
                    },
                    error: function(jqXhr: any, textStatus: any, errorThrown: any) {
                        alert("Error performing point in time restore request: " + errorThrown);
                    }
                })
            } else {
                this.errors.showAllMessages();
            }
        } else {
            let request = {
                type: "restore",
                toSubscriptionId: this.toSubscription().id
            };

            atlas.ajax({
                method: 'POST',
                url: this.api + "/" + this.accountContext().accountAlias + "/subscriptions/" + this.fromSubscription().id + "/backups/" + this.fromBackup().id + "/operations",
                data: JSON.stringify(request),
                contentType: 'application/json',
                success: () => {
                    window.location.href = "/" + this.accountContext().accountAlias + "/subscription/" + this.toSubscription().id;
                },
                error: function(jqXhr: any, textStatus: any, errorThrown: any) {
                    alert("Error restoring subscription: " + errorThrown);
                }
            });
        }
    };

    cancel = (): void => {
        window.location.href = "/" + this.accountContext().accountAlias + "/subscription" + this.toSubscription().id
    }

}
