import * as ko from "knockout";
import {Observable} from "knockout";
import {ObservableArray} from "knockout";
import {Subscription} from "../model/subscription";
import * as $ from "jquery";

declare var atlas: any;

export class ViewModel {

    dbaasApi: string;
    accountContext: Observable<any>;

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

    getPromotionConsumed() {
        let viewModel: ViewModel = this;
        atlas.ajax({
            method: 'GET',
            url: viewModel.dbaasApi + "/" + viewModel.accountContext().accountAlias + "/promotions",
            success: function(data: any) {
                let shouldBeAvailable = true;
                data.forEach((p: any) => {
                    if (p.promotionGroup == "Free Trial") {
                        shouldBeAvailable = false;
                        return
                    }
                });
                viewModel.promotionAvailable(shouldBeAvailable)
            }
        })
    }

    // TODO: Will this even work with scope of this
    getSubscription() {
        let viewModel: ViewModel = this;
        this.subscriptionsIsLoading(true);

        // TODO Can this be made cleaner with promise
        atlas.ajax({
            method: 'GET',
            url: viewModel.dbaasApi + "/" + viewModel.accountContext().accountAlias + "/subscriptions",
            success: function(data: Array<any>) {
                let subscriptionArray: any =  [];
                data.forEach((d: any) => {
                    subscriptionArray.push(new Subscription(d))
                });
                viewModel.subscriptions(subscriptionArray);
            },
            complete: function() {
                viewModel.subscriptionsIsLoading(false);
            }
        })
    }

    getConfigurations() {
        let viewModel: ViewModel = this;
        atlas.ajax({
            method: 'GET',
            url: viewModel.dbaasApi + "/" + viewModel.accountContext().accountAlias + "/configurationprofiles",
            success: function(data: Array<any>) {
                let configurationArray: any = [];
                data.forEach(d => {
                    d.configProfileUrl = "/" + viewModel.accountContext().accountAlias + "/configurationprofiles/" + d.id;
                    configurationArray.push(d);
                });
                viewModel.configurations(configurationArray);
            },
            complete: function() {
                viewModel.configurationsIsLoading(false);
            }
        });
    }

    updatePage() {
        this.getPromotionConsumed();
        this.getSubscription();
        this.getConfigurations();
    }

}

