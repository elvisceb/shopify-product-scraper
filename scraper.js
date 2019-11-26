var VENDOR = "glowjumps";
var PUBLISH = "FALSE";

//var productData = JSON.parse(document.getElementById('ProductJson-product-template').innerHTML);

function parseToCSV(json) {
  var arr = [];
  var products = json;
  var fields = ['Handle', 'Title', 'Body (HTML)', 'Vendor', 'Type', 'Tags', 'Published', 'Option1 Name', 'Option1 Value', 'Option2 Name', 'Option2 Value', 'Option3 Name', 'Option3 Value', 'Variant SKU', 'Variant Grams', 'Variant Inventory Tracker', 'Variant Inventory Qty', 'Variant Inventory Policy', 'Variant Fulfillment Service', 'Variant Price', 'Variant Compare At Price', 'Variant Requires Shipping', 'Variant Taxable', 'Variant Barcode', 'Image Src', 'Image Alt Text', 'Gift Card', 'Google Shopping / MPN', 'Google Shopping / Age Group', 'Google Shopping / Gender', 'Google Shopping / Google Product Category', 'SEO Title', 'SEO Description', 'Google Shopping / AdWords Grouping', 'Google Shopping / AdWords Labels', 'Google Shopping / Condition', 'Google Shopping / Custom Product', 'Google Shopping / Custom Label 0', 'Google Shopping / Custom Label 1', 'Google Shopping / Custom Label 2', 'Google Shopping / Custom Label 3', 'Google Shopping / Custom Label 4', 'Variant Image', 'Variant Weight Unit'];
  console.log('products.length : ' + products.length);
  for (var i = 0; i < products.length; i++) {
    var product = products[i];

    var handle = product.handle;
    var title = product.title;
    var body_html = product.description;
    var published_at = PUBLISH; //product.published_at;
    var vendor = VENDOR;
    var product_type = product.type;
    // let tags = ''//product.tags.toString();
    var tags = product.tags.toString();
    var variants = product.variants;
    var images = product.images;
    var options = product.options;

    var variants_len = variants.length; // 变量属性长度
    var options_len = options.length; // 匹配属性长度
    var share = {
      Handle: handle,
      Title: title,
      'Body (HTML)': body_html,
      Vendor: vendor,
      Type: product_type,
      Tags: tags,
      Published: published_at,
      'Variant Inventory Qty': 0,
      'Variant Inventory Policy': 'continue',
      'Variant Fulfillment Service': 'manual'
    };
    var _var = {
      'Variant Inventory Qty': 0,
      'Variant Inventory Policy': 'continue',
      'Variant Fulfillment Service': 'manual'
    };

    var os = [];
    // variants
    for (var k = 0; k < variants_len; k++) {
      var variant = variants[k];
      var o = {};
      var option1_name = options[0] ? options[0] : '';
      var option1 = variant.option1 ? variant.option1 : '';
      var option2_name = options[1] ? options[1] : '';
      var option2 = variant.option2 ? variant.option2 : '';
      var option3_name = options[2] ? options[2] : '';
      var option3 = variant.option3 ? variant.option3 : '';
      o['Option1 Name'] = option1_name;
      o['Option1 Value'] = option1;
      o['Option2 Name'] = option2_name;
      o['Option2 Value'] = option2;
      o['Option3 Name'] = option3_name;
      o['Option3 Value'] = option3;

      var sku = variant.sku ? variant.sku : '';
      var price = variant.price ? variant.price/100 : '';
      var compare_at_price = variant.compare_at_price ? variant.compare_at_price/100 : '';
      var position = variant.position ? variant.position : '';
      var feature_image = variant.featured_image;

      o['Variant Image'] = feature_image ? feature_image.src : '';
      o['Variant SKU'] = sku;
      o['Variant Price'] = price;
      o['Variant Compare At Price'] = compare_at_price ? compare_at_price : '';

      if (k === 0) {
        o = Object.assign(o, share);
      } else {
        o = Object.assign(o, { Handle: handle });
        o = Object.assign(o, _var);
      }
      os.push(o);
      // arr.push(o);
    }

    // options
    for (var m = 0; m < options.length; m++) {
      var option = options[m];
    }
    // 图片
    var images_len = images.length;
    for (var j = 0; j < images.length; j++) {
      var image = images[j];
      var _o2 = os[j];
      if (_o2) {
        _o2['Image Src'] = "https:" + image;
        _o2['Image Alt Text']; //= image.alt;
      } else {
        var _o = {};
        _o['Image Src'] = "https:" + image;
        _o['Image Alt Text'] //= image.alt;
        _o['Handle'] //= handle;
        os.push(_o);
      }
      // let obj = _.assign(o, {
      //   'Image Src': image.src,
      //   'Image Alt Text': image.alt,
      // })
    }

    arr = arr.concat(os);
    //console.log(arr);
  }
    var csv = json2csv.parse(arr, { fields: fields });
	console.log(product)
    downloadCsv(csv, /*product.handle +*/ "products.csv")
}

function downloadCsv(csv, filename){
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement("a");

    if (link.download !== undefined) { // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
var productsJSON = [];


function truncate(str, no_words) {
    return str.split(" ").splice(0,no_words).join(" ");
}
function getProductHTML(productName, productLink, thumbnailLink, productPosition){
	return '<div class="row"> <div class="col col-2"><img class="img-thumbnail" src="https:'+ thumbnailLink + '" /></div><div class="col col-8"><a target="_blank" href="'+ productLink + '"> <h3 class="text-center">'+ productName + '</h3> </a></div>  <div class="col col-2"><a id="removeProduct" data-product="'+ productPosition +'" href="javascript:void(0)">❌</a> </div>  </div>'
}
function insertProduct(productData, productUrl){
	var productPosition = productsJSON.push(productData)-1;
	$("#productfeed-container").append(getProductHTML(truncate(productData.title, 5), productUrl, productData.featured_image, productPosition));
}

$("#addProductBtn").click(function(){
	var productUrl = $("#productUrl").val(); 
	$("#productUrl").val("");
	if(productUrl){
		$.get(productUrl, "", function(content){
			var productDataHTML = $(content).find("#ProductJson-product-template")[0].innerHTML;
			if(productDataHTML){
				var productData = JSON.parse(productDataHTML);
				insertProduct(productData,productUrl);	
			}else{alert("Error; No product data found!")}
		}, "html");	
	}else{ alert("Bad URL") }
});

$("#downloadProductBtn").click(function(){
	parseToCSV(productsJSON)
});

$('#productfeed-container').on('click', '#removeProduct', function(e) {
    var productPosition = $(this).data("product");
	$(this).closest("div.row").remove();
	productsJSON.splice(productPosition, 1);
});

/*
$.getScript("https://cdn.jsdelivr.net/npm/json2csv", function() {
    parseToCSV(productData)
});
*/