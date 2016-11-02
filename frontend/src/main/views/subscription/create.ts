import * as ko from "knockout";
import {RdbsApi} from "../../rdbs-api";
import {EngineResponse, EngineDataCenter} from "../../api/EngineAPI";
import {ConfigurationProfile} from "../../api/ConfigurationProfilesAPI";
import {Notification} from "../../model/notification";
import {PricingEstimator} from "../../model/pricing";

class Form {

    object: any;

    engine: KnockoutObservable<string> = ko.observable<string>();
    edition: KnockoutObservable<string> = ko.observable<string>();
    network: KnockoutObservable<string> = ko.observable<string>().extend({
        required: { onlyIf: () => { return this.engine() === 'MSSQL' } }
    });
    dataCenter: KnockoutObservable<string> = ko.observable<string>();
    databaseName: KnockoutObservable<string> = ko.observable<string>().extend({
        required: {params: true, message: "Please enter a database name"},
        minLength: {params: 2, message: "Your database name must container more than 2 characters"},
        maxLength: {params: 16, message: "Your database name must contain fewer than 16 characters"},
        pattern: {params: /^(?![0-9]+$)(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$/g, message: "Please enter a DNS valid name"}
    });
    username: KnockoutObservable<string> = ko.observable<string>().extend({
        required: {params: true, message: "Please enter a database username"},
        minLength: {params: 2, message: "Your username must contain more than 2 characters"},
        maxLength: {params: 16, message: "Your username must contain fewer than 16 characters"}
    });
    disableUsername: KnockoutComputed<boolean> = ko.computed(() => {
        return this.engine() == "MSSQL";
    });
    password: KnockoutObservable<string> = ko.observable<string>().extend({
        required: {params: true, message: "Please provide a password"},
        passwordStrength: { requiredStrength: 3, dissallowedCharacters: "/`$^&\\|'\"<>"}
    });
    passwordConfirmation: KnockoutObservable<string> = ko.observable<string>().extend({
        required: {params: true, message: "Please confirm your password"},
        equal: {params: this.password, message: "Your passwords do not match "}
    });
    cpu: KnockoutObservable<number> = ko.observable<number>();
    memory: KnockoutObservable<number> = ko.observable<number>();
    storage: KnockoutObservable<number> = ko.observable<number>();
    replicationToggle: KnockoutObservable<boolean> = ko.observable(false);
    notificationToggle: KnockoutObservable<boolean> = ko.observable(false);
    notifications: KnockoutObservableArray<Notification> = ko.observableArray<Notification>();
    backupToggle: KnockoutObservable<boolean> = ko.observable(false);
    backupHour: KnockoutObservable<number> = ko.observable<number>(1);
    backupMinute: KnockoutObservable<number> = ko.observable<number>(1);
    backupRetention: KnockoutObservable<number> = ko.observable<number>(7);
    selectedConfigurationProfile: KnockoutObservable<string> = ko.observable<string>();

    construct() {
        let data = localStorage.getItem("createForm");
        if (data != null) {
            var object = $.parseJSON(data);
            this.object = object;

            this.databaseName(object['databaseName']);
            this.username(object['username']);
            this.password(object['password']);
            this.passwordConfirmation(object['passwordConfirmation']);
            this.cpu(object['cpu']);
            this.memory(object['memory']);
            this.storage(object['storage']);
            this.replicationToggle(object['replicationToggle']);
            this.notificationToggle(object['notificationToggle']);

            // TODO Model Notification
            let notificationArray: Array<any> = [];
            if (object['notifications'] != null) {
                for (var i in object['notifications']) {
                    notificationArray.push(object['notifications'][i]);
                }
            } else {
                notificationArray.push("");
            }

        }
        localStorage.removeItem("createForm");


        this.engine.subscribe((e) => {
            if (e == "MSSQL") this.username("SA");
        });
    }

    setEngine = (option: any, item: any): void => {
        if (this.object != null && item.engine == this.object['engine']) {
            ko.applyBindingsToNode(option.parentElement, {value: item.engine}, item);
        }
    };

    setEdition = (option: any, item: any): void => {
        if (this.object != null && item.editon == this.object['edition']) {
            ko.applyBindingsToNode(option.parentElement, {value: item.edition}, item);
        }
    };

    setNetwork = (option: any, item: any): void => {
        if (this.object != null && item.network == this.object['network']) {
            ko.applyBindingsToNode(option.parentElement, {value: item.network}, item);
        }
    };

    setDataCenter = (option: any, item: any): void => {
        if (this.object != null && item.dataCenter == this.object['dataCenter']) {
            ko.applyBindingsToNode(option.parentElement, {value: item.dataCenter}, item);
        }
    };


}

export class ViewModel {

    private rdbsApi: RdbsApi;

    form: Form;
    submitting: KnockoutObservable<boolean> = ko.observable(false);
    errors: KnockoutValidationErrors;
    pricingEstimator: PricingEstimator;
    //TODO Define
    freeTrialCard: any;
    resourceConstraint: KnockoutComputed<boolean> = ko.computed(() => {
        return (this.submitting() || this.freeTrialCard.checked());
    });

    engines: KnockoutObservableArray<EngineResponse> = ko.observableArray<EngineResponse>();
    networks: KnockoutObservableArray<string> = ko.observableArray<string>();
    networkIsDisabled: KnockoutObservable<boolean> = ko.observable(false);
    configurationProfiles: KnockoutObservableArray<ConfigurationProfile> = ko.observableArray<ConfigurationProfile>();
    notificationType: KnockoutObservableArray<string> = ko.observableArray(["EMAIL"]);
    hour: KnockoutObservableArray<string> = ko.observableArray<string>();
    minute: KnockoutObservableArray<string> = ko.observableArray<string>();

    nameField: KnockoutComputed<string> = ko.computed(() => {
        return this.form.engine() == "MSSQL" ? "instance name" : "database name";
    });

    storageMax: KnockoutComputed<number> = ko.computed(() => {
        return this.form.engine() == "MSSQL" ? 1024: 664;
    });

    memoryMax: KnockoutComputed<number> = ko.computed(() => {
        return (this.form.engine() == "MSSQL" && this.form.edition() == "Web") ? 64 : 128;
    });

    editions: KnockoutComputed<Array<string>> = ko.computed(() => {
        let editions: Array<string> = [];
        this.engines().forEach((e) => {
            if (e.engine == this.form.engine()) {
                editions = e.editions;
            }
        });

        return editions;
    });

    datacenters: KnockoutComputed<Array<EngineDataCenter>> = ko.computed(() => {
        let datacenters: Array<EngineDataCenter> = [];
        this.engines().forEach((e) => {
            if (e.engine == this.form.engine()) {
                datacenters = e.dataCenters;
            }
        });

        return datacenters;
    });

    disableBackupRetention = ko.computed(() => {
        return this.form.engine() == 'MSSQL';
    });

    constructor(api: string, accountContext: KnockoutObservable<any>) {
        this.rdbsApi = new RdbsApi(api, accountContext);

        this.form = new Form();
        this.rdbsApi.engine().get((engines) => {
            this.engines(engines)
        });

        this.form.dataCenter.subscribe((d) => {
            if (typeof d !== "undefined" && d !== "") {
                // TODO Do something to get networks
            }
        });

        this.rdbsApi.configurationProfile().getProfiles((profiles) => {
            this.configurationProfiles(profiles);
        });

        this.hour(populateArray(0, 24));
        this.hour(populateArray(0, 60));

        this.form.engine.subscribe((e) => {
            if (e == "MSSQL") { this.form.backupRetention(7) }
        });

        this.pricingEstimator = new PricingEstimator(api, this.form.cpu, this.form.memory, this.form.storage);
        this.form.dataCenter.subscribe((dataCenter) => {
            if (dataCenter) {
                this.pricingEstimator.loadPricing(this.form.engine(), this.form.replicationToggle(), dataCenter);
            }
        });
        this.form.engine.subscribe((e) => {
            if (e) {
                this.pricingEstimator.loadPricing(e, this.form.replicationToggle(), this.form.dataCenter());
            }
        });
        this.form.replicationToggle.subscribe((t) => {
            if (t) {
                this.pricingEstimator.loadPricing(this.form.engine(), t, this.form.dataCenter());
            }
        });

        ko.validation.init({grouping: {deep: true}});
        this.errors = ko.validation.group([
            this.form.databaseName,
            this.form.username,
            this.form.password,
            this.form.passwordConfirmation,
            this.form.notifications
        ]);
    }

    selectedConfigurationProfile = (option: any, item: any): void => {
        // TODO Implement
    };

    addNotification = (): void => {
        this.form.notifications.push(new Notification());
    };

    removeNotification = (item: any): void => {
        console.log(item);
        this.form.notifications.remove(item);
        if (this.form.notifications().length === 0) {
            this.form.notifications.push(new Notification());
            this.form.notificationToggle(false);
        }
    };

    submit = (): void => {
        // TODO Implement
    };

    saveFormState = (): void => {
        localStorage.setItem("createForm", ko.mapping.toJSON(this.form));
        window.location.href = "/configProfile-create?fromSubscriptionCreate=true";
    };

    loadPageData = (): void => {
        // TODO Implement
    }

}

function populateArray(min: number, max:number): Array<string> {
    let temp: Array<string> = [];
    for (var i = min; i < max; i++) {
        temp.push(("0" + i).slice(-2));
    }

    return temp;
}