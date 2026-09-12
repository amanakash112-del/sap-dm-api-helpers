// SAP DM (Digital Manufacturing) data collection API helpers
// GET and POST wrappers with usage examples

// ---------------------------------------------------------------------
// GET — helper + usage example (fetching printer list)
// ---------------------------------------------------------------------

get: function (api, params) {
    return new Promise((resolve, reject) => {
        if (this.getPodController()) {
            this.getPodController()._oPodController.ajaxGetRequest(
                this.getApiUrl(api),
                params,
                function (oResponseData) {
                    resolve(oResponseData);
                },
                function (oError, sHttpErrorMessage) {
                    var err = oError || sHttpErrorMessage;
                    console.log(err);
                    reject(err);
                }
            );
        } else {
            $.ajax({
                url: this.getApiUrl(api),
                method: "GET",
                headers: {
                    "X-Dme-Plant": this.getPlant(),
                },
                data: params,
                success: resolve,
                error: (oError) => {
                    reject((oError && oError.responseJSON) || oError)
                },
            });
        }
    });
},

// Usage: fetch printer list for the selected plant
const url = "/datacollection/v1/groups?group=MT_PRINTER_LIST_LABEL&plant=" + sPlantSelected;
const res = await this.get(url, {});
const printersList = res?.[0]?.dcParameters || [];

// ---------------------------------------------------------------------
// POST — helper + usage example (logging VI notes/rework)
// ---------------------------------------------------------------------

post: function (api, data, headers = {}, params = {}) {
    return new Promise((resolve, reject) => {
        let paramsString = (Object.keys(params).length > 0) ? "?" + $.param(params) : "";
        if (this.getPodController()) {
            this.getPodController()._oPodController.ajaxPostRequest(
                this.getApiUrl(api) + paramsString,
                data,
                function (oResponseData) {
                    resolve(oResponseData);
                },
                function (oError, sHttpErrorMessage) {
                    var err = oError || sHttpErrorMessage;
                    console.log(err);
                    reject(err);
                }
            );
        } else {
            $.ajax({
                url: this.getApiUrl(api) + paramsString,
                method: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                headers: {
                    "X-Dme-Plant": this.getPlant(),
                    ...headers
                },
                success: resolve,
                error: (oError) => {
                    reject((oError && oError.responseJSON) || oError)
                },
            });
        }
    });
},

// Usage: rework post
await this.post(
    apiRework,
    payloadCopy,
    { 'Accept': '/', 'Content-Type': 'application/json' }
);

// Usage: log VI notes payload
const oLogPayloadNotes = {
    group: { dcGroup: "MT_VI", version: "A" },
    operation: {
        operation: oSfc.operation,
        version: oSfc.operationVersion
    },
    parameterValues: [
        {
            comment: sNotes,
            name: "MT_VI",
            value: sValue,
            ...(fileMeta && {
                files: [
                    {
                        fileContent: base64Content,
                        fileId: crypto.randomUUID(),
                        fileMediaType: fileMeta.type,
                        fileName: fileMeta.name
                    }
                ]
            })
        }
    ],
    plant: sPlant,
    resource: oSfc.resource,
    sfcs: [oSfc.sfc]
};
