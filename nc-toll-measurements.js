// SAP DM (Digital Manufacturing) — NC TOLL measurement fetch example
// Fetches measurements for an SFC and flattens them into a param map

try {
    const response = await this.get("/datacollection/v1/measurements", {
        plant: sSfc.plant || "Q106",
        sfcs: [aSfcList[0]],
        "dcGroup.name": "MT_NC_TOLL",
        "dcGroup.version": "A"
    });

    const paramMap = {};
    (response.data || []).forEach(entry => {
        const name = entry?.parameter?.measureName;
        const value = entry?.parameter?.actual;
        if (name) { paramMap[name] = value; }
    });

    const oData = oDetailSfcModel.getData();
    oData.date = paramMap["NC_TOLL_DATE"] || "";
    oData.scrapquantity = paramMap["NC_TOLL_SCRAP_QTY"] || "";
    oOData.serialnumber = paramMap["MT_NC_TOLL_SERIAL_NUMBER"] || "";
    oData.holdreason = paramMap["MT_NC_TOLL_HOLD_REASON"] || "";
    oData.specification = paramMap["MT_NC_TOLL_SPEC"] || "";
    oData.actualreason = paramMap["MT_NC_TOLL_ACTUAL_REASON"] || "";

    oDetailSfcModel.setData(oData);
    oDetailSfcModel.checkUpdate(true);

} catch (err) {
    console.error("Failed to fetch NC TOLL details for NC_TOLL_SALES:", err);
}
