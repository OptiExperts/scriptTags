// #MainProduct-template--14767178252348__main   .product--container   .form-area
const div_Main = document.querySelector(".form-area");
const get_prod_title = document.querySelector(".product-title");
const sliderDiv = document.createElement("div");
const heading = document.createElement("h1");
const desc = document.createElement("p");
// CONVERT THIS TO ARRAY WHILE WORKING WITH NGROK AND TO OBJECT WHILE WITH CYCLIC
let products = {};
let key = [];
let productId, title, imgLink, priceTag;

// SLIDER SECTION
sliderDiv.classList.add("main-carousel");
sliderDiv.style.hegight = "300px",
document.querySelector(".flickity-viewport").style.height = "250px !important";
heading.style.fontSize = "15px";
heading.style.textAlign = "center";
desc.style.textAlign = "center";
desc.style.fontSize = "13px";

// GETTING LINK OF THE PRODUCT
let prod_type_uri = window.location.href.split("/").slice(0, 5).join("/");

// THIS IS THE DATA FETCHED FROM THE LOCATION
fetch(`${prod_type_uri}/products.json`, {
    method: "GET", 
    headers: {
        "Content-Type": "application/json",
    }
})
.then((response) => response.json())
.then(async(data) => {
    // PUTTNG RESPONSE DATA INTO PRODUCTS OBJECT
    // FOR CYCLIC
    products = data.products;

    // FOR NGROK
    // products.push(data.product);
    
    // SETTING UP HEADING AND DESCRIPTION FOR THE SLIDER
    // THIS NGROK SHOULD BE CHANGED TO THE NEW SCRIPTTAG CREATED
    await fetch("https://rich-red-hippo-vest.cyclic.app/send/scriptFile", {
        method: "POST",
    })
    .then((resp) => resp.json())
    .then((fileContent) => {
        heading.innerText = "👋 " + fileContent.contentArray[0].heading;
        desc.innerText = fileContent.contentArray[0].description;
        sliderDiv.appendChild(heading);
        sliderDiv.appendChild(desc)
    })
    .catch((err) => {
        console.log(err)
    })

    products.forEach((product, index) => {

        // SKIPPING THE PRODUCT THAT MATCHES THE RESULT OF THE PRODUCT PAGE
        if(get_prod_title.innerText == product.title) {
            index++;
            return;
        }

        // INNER PRODUCT CARD
        const innerSection = document.createElement("div");
        innerSection.style.width = "calc(45% - 5px)";
        innerSection.style.margin = "5px"
        innerSection.style.height = "auto";
        innerSection.style.display = "flex";
        innerSection.style.alignItems = "center";
        innerSection.style.flexDirection = "column";
        innerSection.style.justifyContent = "center"
        innerSection.style.textAlign = "center";
        innerSection.style.transition = "all 0.3s";
        innerSection.classList.add("carousal-cell");
        innerSection.setAttribute("data-variant-id", products[index].variants[0].id)

        // IMAGE OF THE PRODUCT
        const prodImage = document.createElement("img");
        prodImage.style.width = "80%";
        prodImage.style.height = "auto";

        // TITLE OF THE PRODUCT AND IMAGE
        const prodTitle = document.createElement("p");
        prodTitle.style.fontSize = "11px";
        prodImage.src = product.images[0].src;
        prodTitle.innerText = product.title.slice(0, 13) + "...";
        prodTitle.style.margin = "0px";

        // PRICE OF THE PRODUCT
        const price = document.createElement("p");
        price.innerText = (product.variants[0].price === null) ? "No Price Tag" : "£" + product.variants[0].price;
        price.style.fontSize = "14px";
        price.style.marginTop = "15px";

        // APPENDING CHILDS INTO CARD(innerSection) AND SLIDER(sliderDiv)
        innerSection.appendChild(prodImage);
        innerSection.appendChild(price);
        innerSection.appendChild(prodTitle);
        sliderDiv.appendChild(innerSection);
    });

    // APPENDING ALL CHILDS INTO THE THEME 
    div_Main.appendChild(heading);
    div_Main.appendChild(desc);
    div_Main.appendChild(sliderDiv);
})
.catch((error) => console.log(error))
.finally(() => {
    // RUNNING SLIDER HERE
    var sliderCarousel = new Flickity(sliderDiv, {
        freeScroll: true,
        wrapAround: true,
        pageDots: false,
    });


    // GETTING ALL CARDS TO PERFORM OPERATION ON EACH CARD
    let cards = document.querySelectorAll('.carousal-cell');
    cards.forEach((card, index) => {
        card.addEventListener('click', async(event) => {
            
            if(!card.getAttribute("checked")) {
                // ADDING EFFECT TO CARD
                card.style.boxShadow = "0px 0px 15px green";
                card.setAttribute("checked", true);
                card.classList.add("loading-overlay__spinner");
                // ADDING ITEMS TO THE CART
                // replace with this while working with cyclic => products[index+1].variants[0].id
                let cart_product = {items: [{"id": products[index+1].variants[0].id, "quantity": 1}]};
                let cart_response = await fetch(`https://${window.location.host}/cart/add.js`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(cart_product),
                });
                let result = await cart_response.json();
                key.push(result.items[index].key);
                if(cart_response.ok) {
                    // CHANGING COUNT OF THE CART BUBBLE
                    // cart-count-bubble
                    // site-header-cart--count
    
                    let bubble_count = document.querySelector(".site-header-cart--count");
                    if(!bubble_count.classList.contains("visible")) {
                        bubble_count.classList.add("visible");
                        bubble_count.setAttribute("data-header-cart-count", "1");
                    } else {
                        let currentCount = parseInt(bubble_count.getAttribute("data-header-cart-count"));
                        let newCount = currentCount + 1;
                        bubble_count.setAttribute("data-header-cart-count", newCount.toString());
                    }
    
                    // DISPLAY TICK AT THE TOP OF PRODUCT
                    let check = document.createElement("div");
                    check.classList.add("check");
                    check.style.cssText = "display: flex; align-items: center; justify-content: center; position: absolute; top: 0; left: 0; width: 40px; height: 40px; border-radius: 50%; color: #fff; background-color: green;";
                    check.innerText = "✓";
                    card.appendChild(check);
                    card.style.boxShadow = "none";
                } else {
                    console.log("Item could not be added..");
                    // DISPLAY CROOS AT THE TOP OF PRODUCT
                    let check = document.createElement("div");
                    check.classList.add("check");
                    check.style.cssText = "display: flex; align-items: center; justify-content: center; position: absolute; top: 0; left: 0; width: 40px; height: 40px; border-radius: 50%; color: #fff; background-color: red;";
                    check.innerText = "✖";
                    card.appendChild(check);
                }
            } else {
                let response = await fetch(`https://${window.location.host}/cart/change.js`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        id: key[index],
                        quantity: 0,
                    }),
                });
                if(response.ok) {
                    card.removeAttribute('checked');
                    card.style.boxShadow = "none";
                    let tick = card.querySelector(".check");
                    if(tick instanceof Node) {
                        card.removeChild(tick);
                    } else {
                        console.log("not removed");
                    }
                     // CHANGING COUNT OF THE CART BUBBLE
                    // cart-count-bubble
                    // site-header-cart--count
                    let bubble_count = document.querySelector(".site-header-cart--count");
                    let currentCount = parseInt(bubble_count.getAttribute("data-header-cart-count"));
                    let newCount = currentCount - 1;
                    bubble_count.setAttribute("data-header-cart-count", newCount.toString());
                }
            }
        });
    
        card.addEventListener('mouseover', (event) => {
            card.style.borderRadius = "10px";
            card.style.border = "1px solid #000";
        });
    
        card.addEventListener('mouseout', (event) => {
            card.style.border = "none";
        });
    })     
}) 
