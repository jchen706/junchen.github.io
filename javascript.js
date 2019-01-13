try {
    var app = new Clarifai.App({
        apiKey: '537495149e67440f9442c73754a61e39'
    });
} catch (err) {
    alert("Need a valid API Key!");
    throw "Invalid API Key";
}

function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    var image = document.getElementById('output');
    image.src = URL.createObjectURL(element.files[0]);
    document.getElementById("imageName").textContent = element.files[0].name;
    reader.onloadend = function() {
        //console.log('RESULT', reader.result)
        bae = reader.result.split(',')[1];
        //console.log(bae);
        app.models.predict(Clarifai.GENERAL_MODEL, {
            base64: '' + bae + ''
        }).then(
            function(response) {
                var tags = new Array();
                var tag = new Array();
                var first = "";
                tag = response.outputs[0].data.concepts;
                var len = tag.length;
                var tableHeader = "<table><tr><th>Prediction</th><th>Probability</th></tr>";
                var tableContent = "";
                for (var i = 0; i < len; i++) {

                    tags[i] = response.outputs[0].data.concepts[i].name;
                    if (i == 0) {
                        first = tag[i].name;
                    }
                    tableContent = tableContent + "<tr><td id='name' onclick='getUrl(this.innerHTML)'>" + tag[i].name + "</td><td>" + tag[i].value + "</tr>";

                    //console.log(tableContent);
                    //console.log(tag[i]);
                    // var row = document.createElement("tr");
                    // console.log("create");
                    // var cell = document.createElement("td");
                    // var cell2 = document.createElement("td");
                    // var cellText = document.createTextNode(tags[i].name);
                    // var cell2Text = document.createTextNode(tags[i].value);
                    // console.log("create2");
                    //
                    // cell.appendChild(cellText);
                    // cell2Text.appendChild(cell2Text);
                    // row.appendChild(cell);
                    // row.appendChild(cell2);
                    // tblBody.appendChild(row);
                }
                //console.log("create2");
                // tbl.appendChild(tblBody);
                // divi.appendChild(tbl);
                // tbl.setAttribute("border", "2");
                var tableFooter = "</table>";
                document.getElementById("airesults").innerHTML = (tableHeader + tableContent + tableFooter);
                getUrl(first);
                addRowHandlers();
            },


            function(err) {
                document.getElementById("imageName").textContent = "Invalid Image: Image Size Must Be Less than 10MB or Daily API Call Limit Reached. Please Try Again!";
                // there was an error
            }
        );
    }
    reader.readAsDataURL(file);
}


function getUrl(word) {
    url = " https://svcs.ebay.com/services/search/FindingService/v1";
    url += "?OPERATION-NAME=findItemsByKeywords";
    url += "&SERVICE-VERSION=2.0.0";
    url += "&siteid=EBAY-US";
    url += "&SECURITY-APPNAME=-My1Api-PRD-68bb06b1d-2b1daea1";
    url += "&GLOBAL-ID=EBAY-US";
    url += "&RESPONSE-DATA-FORMAT=JSON";
    url += "&callback=_cb_findItemsByKeywords";
    url += "&sortOrder=StartTimeNewest";
    url += "&REST-PAYLOAD";
    url += "&keywords=" + word;
    url += "&itemFilter(0).name=HideDuplicateItems";
    url += "&itemFilter(0).value=true";
    url += "&itemFilter(1).name=ListingType";
    url += "&itemFilter(1).value(0)=AuctionWithBIN";
    url += "&itemFilter(1).value(1)=FixedPrice";
    url += "&itemFilter(2).name=LocatedIn";
    url += "&itemFilter(2).value(0)=US";
    url += "&paginationInput.entriesPerPage=10";

    // Submit the request
    s = document.createElement('script'); // create script element
    s.src = url;
    document.body.appendChild(s);
    //console.log(url);
}


function _cb_findItemsByKeywords(root) {
    var items = root.findItemsByKeywordsResponse[0].searchResult[0].item || [];
    var html = [];
    html.push('<table width="100%" border="0" cellspacing="0" cellpadding="10"><tbody>');
    for (var i = 0; i < items.length; ++i) {
        var item = items[i];
        var title = item.title;
        var price = item.sellingStatus[0].currentPrice[0].__value__;
        //console.log(price);
        var num = Number(price).toFixed(2);
        var pic = item.galleryURL;
        var viewitem = item.viewItemURL;
        if (null != title && null != viewitem) {
            html.push('<tr><td>' + '<img src="' + pic + '" border="0">' + '</td>' +
                '<td><a href="' + viewitem + '" target="_blank">' + title + '</a></td>' + '<td>$' + num + '</td></tr>');
        }
    }
    html.push('</tbody></table>');
    document.getElementById("results").innerHTML = html.join("");
}