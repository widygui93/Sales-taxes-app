document.querySelector("#input").addEventListener("click", inputData);

let productName = "";
let quantity = 0;
let price = 0.0;
let typeProduct = "";
let importedProduct = false;

let products = [];

function inputData(){
	productName = document.querySelector("#product_name").value;
	quantity = parseInt(document.querySelector("#quantity").value);
	price = parseFloat(document.querySelector("#price").value);
	typeProduct = Array.from(document.getElementsByName("type_product")).filter(p => {
		if (p.checked) {
			return p;
		}
	})[0].value;

	importedProduct = Array.from(document.getElementsByName("imported_product")).filter(p => {
		if(p.checked){
			return p;
		}
	})[0].value;

	// do comparison with === to check the data type
	// because Any string which isn't the empty string will evaluate to true
	// including string "false"
	importedProduct = (importedProduct === "true");

	// input data ke dalam objek daftar_product
	// nanti untuk perhitungan tinggal pake data yg ada di objek daftar_product
	products.push(
	{
		name: productName,
		quantity: quantity,
		price: price,
		type: typeProduct,
		isImported: importedProduct
	}
	);

	displayData(quantity, productName, price, importedProduct);
	
}


let listProducts;
let item;

function displayData(quantity, productName, price, importedProduct){
	listProducts = document.querySelector(".list_products");
	item = document.createElement("li");
	item.innerHTML = `${quantity} ${ importedProduct === true ? "imported " : ""} ${productName} at ${price}`;
	listProducts.appendChild(item);
}

document.querySelector("#calculate").addEventListener("click", calculateData);

let calculatedProduct = [];
let tempPrice = 0;
let salesTaxes = 0;
let total = 0;

function calculateData(){
	if(products.length === 0){
		alert("need to input some data")
	} else {
		products.map(p => {
			if(p.type == "none" && p.isImported === true){
				// kena pajak 15%
				tempPrice = Number(((p.price + (p.price * 0.15)) * p.quantity).toFixed(2));
				salesTaxes = Number((salesTaxes + ((p.price * 0.15) * p.quantity)).toFixed(2));
			} else if (p.type == "none" && p.isImported === false){
				// kena pajak 10%
				tempPrice = Number(((p.price + (p.price * 0.1)) * p.quantity).toFixed(2));
				salesTaxes = Number((salesTaxes + ((p.price * 0.1) * p.quantity)).toFixed(2));
			} else if (p.type != "none" && p.isImported === true) {
				// kena pajak 5%
				tempPrice = Number(((p.price + (p.price * 0.05)) * p.quantity).toFixed(2));
				salesTaxes = Number((salesTaxes + ((p.price * 0.05) * p.quantity)).toFixed(2));
			} else {
				// tidak kena pajak
				tempPrice = Number((p.price * p.quantity).toFixed(2));
			}

			total = total + tempPrice;

			calculatedProduct.push(
			{
				name: p.name,
				quantity: p.quantity,
				pricePlusTax: tempPrice,
				type: p.type,
				isImported: p.isImported
			}
			);
		});
	}
	// console.log(calculatedProduct);
	// console.log(salesTaxes);
	// console.log(total);

	displayCalculateData(calculatedProduct, salesTaxes, total);

}

let listCalculatedProducts;
let calculatedItem;

function displayCalculateData(calculatedProduct, salesTaxes, total){
	listCalculatedProducts = document.querySelector(".calculate_products");

	calculatedProduct.map(p => {
		calculatedItem = document.createElement("li");
		calculatedItem.innerHTML = `${p.quantity} ${ p.isImported === true ? "imported " : ""} ${p.name} : ${p.pricePlusTax}`;
		listCalculatedProducts.appendChild(calculatedItem);
	});

	let parafSalesTaxes = document.createElement("p");
	parafSalesTaxes.innerHTML = `sales taxes: ${salesTaxes}`;
	listCalculatedProducts.parentNode.appendChild(parafSalesTaxes);
	
	let parafTotal = document.createElement("p");
	parafTotal.innerHTML = `total: ${total}`;
	listCalculatedProducts.parentNode.appendChild(parafTotal);
}