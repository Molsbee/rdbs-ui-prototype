declare var atlas: any;

export interface EngineResponse {
    engine: string;
    editions: Array<string>;
    dataCenters: Array<EngineDataCenter>;
}

export interface EngineDataCenter {
    dataCenter: string;
    friendlyName: string;
}

export interface EngineCallback {
    (response: Array<EngineResponse>): void;
}

export class EngineAPI {

    private api: string;
    private accountContext: KnockoutObservable<any>;

    constructor(api: string, accountContext: KnockoutObservable<any>) {
        this.api = api;
        this.accountContext = accountContext;
    }

    get = (callback: EngineCallback): void => {
        atlas.ajax({
            method: 'GET',
            url: "${dbaasApi}/engines",
            success: (data: Array<EngineResponse>) => {
                callback(data);
            }
        });
    }
}