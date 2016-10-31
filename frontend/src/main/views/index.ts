import * as $ from "jquery";
import * as ko from "knockout";
import {Subscription} from "../model/subscription";
import {Billing} from "../model/billing";
import {History} from "../model/history";
import {RdbsApi} from "../rdbs-api";

declare var atlas: any;

export class ViewModel {

    dbaasApi: string;
    rdbsApi: RdbsApi;

    accountContext: KnockoutObservable<any>;

    billing: KnockoutObservable<Billing> = ko.observable<Billing>();
    history: KnockoutObservable<History> = ko.observable<History>();

    subscriptionTab: KnockoutObservable<boolean> = ko.observable(true);
    // TODO: Figure out how to handle filterableArray
    subscriptions: KnockoutObservableArray<Subscription> = ko.observableArray<Subscription>();
    subscriptionsIsLoading: KnockoutObservable<boolean> = ko.observable(true);
    promotionAvailable: KnockoutObservable<boolean> = ko.observable(false);

    configurationTab: KnockoutObservable<boolean> = ko.observable(window.location.hash == "#configuration");
    configurations: KnockoutObservableArray<any> = ko.observableArray();
    configurationsIsLoading: KnockoutObservable<boolean> = ko.observable(true);

    constructor(dbaasApi: string, accountContext: KnockoutObservable<any>) {
        this.dbaasApi = dbaasApi;
        this.rdbsApi = new RdbsApi(dbaasApi, accountContext);

        this.accountContext = accountContext;
        this.subscriptionTab(!this.configurationTab());

        this.billing(new Billing(dbaasApi, accountContext));
        this.history(new History(dbaasApi, accountContext));
    }

    activeTab(data: string) {
        if (data == "database") {
            this.subscriptionTab(true);
            this.configurationTab(false);
        } else if (data == "configuration") {
            this.configurationTab(true);
            this.subscriptionTab(false);
        }
    }

    clearFilter() {
        console.log("Filter Called")
    }

    addItemAnimation(element: any) {
        $(element).filter("li")
            .hide()
            .animate({ height: "toggle", backgroundColor: '#d9edf7' }, 200)
            .animate({ backgroundColor: 'transparent' }, 800);
    }

    removeItemAnimation(element: any) {
        $(element).filter("li").slideUp();
    }

    getPromotionConsumed = (): void => {
        atlas.ajax({
            method: 'GET',
            url: this.dbaasApi + "/" + this.accountContext().accountAlias + "/promotions",
            success: (data: any) => {
                let shouldBeAvailable = true;
                data.forEach((p: any) => {
                    if (p.promotionGroup == "Free Trial") {
                        shouldBeAvailable = false;
                    }
                });
                console.log(shouldBeAvailable);
                this.promotionAvailable(shouldBeAvailable)
            }
        });
    };

    getSubscription = (): void => {
        this.subscriptionsIsLoading(true);
        this.rdbsApi.subscriptions().getSubscriptions((subscriptions) => {
            this.subscriptions(subscriptions);
            this.subscriptionsIsLoading(false);
        });
    };

    getConfigurations = (): void => {
        atlas.ajax({
            method: 'GET',
            url: this.dbaasApi + "/" + this.accountContext().accountAlias + "/configurationprofiles",
            success: (data: Array<any>) => {
                let configurationArray: any = [];
                data.forEach(d => {
                    d.configProfileUrl = "/" + this.accountContext().accountAlias + "/configurationprofiles/" + d.id;
                    configurationArray.push(d);
                });
                this.configurations(configurationArray);
            },
            complete: (): void => {
                this.configurationsIsLoading(false);
            }
        });
    }

    updatePage = (): void => {
        this.getPromotionConsumed();
        this.getSubscription();
        this.getConfigurations();

        this.billing().loadCustomerBilling(() => {
            console.log("Billing call completed");
            this.billing.valueHasMutated();
        });

        this.history().loadActionLogs()
    }

}

