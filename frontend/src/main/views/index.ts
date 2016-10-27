import * as $ from "jquery";
import * as ko from "knockout";
import {Observable} from "knockout";
import {ObservableArray} from "knockout";
import {Subscription} from "../model/subscription";
import {Billing} from "../model/billing";
import {History} from "../model/history";

declare var atlas: any;

export class ViewModel {

    dbaasApi: string;
    accountContext: Observable<any>;

    billing: Observable<Billing> = ko.observable();
    history: Observable<History> = ko.observable();

    subscriptionTab: Observable<boolean> = ko.observable(true);
    // TODO: Figure out how to handle filterableArray
    subscriptions: ObservableArray<Subscription> = ko.observableArray();
    subscriptionsIsLoading: Observable<boolean> = ko.observable(true);
    promotionAvailable: Observable<boolean> = ko.observable(false);

    configurationTab: Observable<boolean> = ko.observable(window.location.hash == "#configuration");
    configurations: ObservableArray<any> = ko.observableArray();
    configurationsIsLoading: Observable<boolean> = ko.observable(true);

    constructor(dbaasApi: string, accountContext: Observable<any>) {
        this.dbaasApi = dbaasApi;
        this.accountContext = accountContext;
        this.subscriptionTab(!this.configurationTab());

        this.billing(new Billing());
        this.history(new History());
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

        atlas.ajax({
            method: 'GET',
            url: this.dbaasApi + "/" + this.accountContext().accountAlias + "/subscriptions",
            success: (data: Array<any>): void => {
                let subscriptionArray: any =  [];
                data.forEach((d: any) => {
                    subscriptionArray.push(new Subscription(d))
                });
                this.subscriptions(subscriptionArray);
            },
            complete: (): void => {
                this.subscriptionsIsLoading(false);
            }
        })
    }

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
        this.billing().loadBilling(this.dbaasApi + "/" + this.accountContext().accountAlias + "/billing", (): void => {
            console.log("Billing call completed");
            this.billing.valueHasMutated();
        });
    }

}

