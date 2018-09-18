

function AmazonAPI(type) {

    var region = "in", //"in" or "com"
            method = "POST",
            uri = "/FulfillmentInventory/2010-10-01",
            host = "mws.amazonservices." + region;

    var AWS_SECRET_ACCESS_KEY = "",
            AWS_ACCESS_KEY_ID = "",
            MERCHANT_ID = "";

    if (type == 1) {// inventory
        var ACTION = "ListInventorySupply",
                VERSION = "2010-10-01";
    }

    TimeStamp = new Date().toISOString();

    var params = {
        Action: ACTION,
        QueryStartDateTime: "2018-09-17T18:30:00Z",
        Timestamp: TimeStamp,
        AWSAccessKeyId: AWS_ACCESS_KEY_ID,
        SellerId: MERCHANT_ID,
        SignatureMethod: "HmacSHA256",
        SignatureVersion: "2",
        Version: VERSION,
    };

    var canonicalized_query = Object.keys(params).sort();

    canonicalized_query = canonicalized_query.map(function (key) {
        return key + "=" + encodeURIComponent(params[key]);
    });

    var string_to_sign = method + "\n" + host + "\n" + uri + "\n" + canonicalized_query.join("&");

    var signature = Utilities.base64Encode
            (Utilities.computeHmacSha256Signature(string_to_sign, AWS_SECRET_ACCESS_KEY));

    var request = "https://" + host + uri + "?" + canonicalized_query.join("&")
            + "&Signature=" + encodeURIComponent(signature);


    options = {muteHttpExceptions: true, method: 'post'};
    var response = UrlFetchApp.fetch(request, options);

    return (XML_to_JSON1(response.getContentText()));

}

function getInventoryInfo() {

    var type = 1;

    var response = AmazonAPI(type);

    var inventory = response.ListInventorySupplyResponse.ListInventorySupplyResult.InventorySupplyList.member;
    var data = [];
    var sheet = SpreadsheetApp.getActiveSheet();
    data= ['Condition','TotalSupplyQuantity','FNSKU','InStockSupplyQuantity','ASIN','SellerSKU'];
    sheet.appendRow(data);
    for (var i = 0; i < inventory.length; i++) {
        data = [
            inventory[i].Condition.Text,
            inventory[i].TotalSupplyQuantity.Text,
            inventory[i].FNSKU.Text,
            inventory[i].InStockSupplyQuantity.Text,
            inventory[i].ASIN.Text,
            inventory[i].SellerSKU.Text
        ];
        sheet.appendRow(data);
    }
    
}

function getOrderInfo() {

    var type = 1;

    var response = AmazonAPI(type);

    var inventory = response.ListInventorySupplyResponse.ListInventorySupplyResult.InventorySupplyList.member;
    var data = [];
    var sheet = SpreadsheetApp.getActiveSheet();
    data= ['Condition','TotalSupplyQuantity','FNSKU','InStockSupplyQuantity','ASIN','SellerSKU'];
    sheet.appendRow(data);
    for (var i = 0; i < inventory.length; i++) {
        data = [
            inventory[i].Condition.Text,
            inventory[i].TotalSupplyQuantity.Text,
            inventory[i].FNSKU.Text,
            inventory[i].InStockSupplyQuantity.Text,
            inventory[i].ASIN.Text,
            inventory[i].SellerSKU.Text
        ];
        sheet.appendRow(data);
    }
    
}














/* Source: https://gist.github.com/erickoledadevrel/6b1e9e2796e3c21f669f */
/**
 * Converts an XML string to a JSON object, using logic similar to the
 * sunset method Xml.parse().
 * @param {string} xml The XML to parse.
 * @returns {Object} The parsed XML.
 */
function XML_to_JSON1(xml) {
    var doc = XmlService.parse(xml);
    var result = {};
    var root = doc.getRootElement();
    result[root.getName()] = elementToJSON(root);
    return result;
}

/**
 * Converts an XmlService element to a JSON object, using logic similar to 
 * the sunset method Xml.parse().
 * @param {XmlService.Element} element The element to parse.
 * @returns {Object} The parsed element.
 */
function elementToJSON(element) {
    var result = {};
    // Attributes.
    element.getAttributes().forEach(function (attribute) {
        result[attribute.getName()] = attribute.getValue();
    });
    // Child elements.
    element.getChildren().forEach(function (child) {
        var key = child.getName();
        var value = elementToJSON(child);
        if (result[key]) {
            if (!(result[key] instanceof Array)) {
                result[key] = [result[key]];
            }
            result[key].push(value);
        } else {
            result[key] = value;
        }
    });
    // Text content.
    if (element.getText()) {
        result['Text'] = element.getText();
    }
    return result;
}
