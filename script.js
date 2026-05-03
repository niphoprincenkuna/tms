let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getClickedProductImage(){
  const button = document.activeElement;

  if(button){
    const productCard = button.closest(".product-card");

    if(productCard){
      const img = productCard.querySelector("img");
      if(img){
        return img.getAttribute("src");
      }
    }
  }

  return "logo.jpg";
}

function addToCart(name, price, image = null){
  const productImage = image || getClickedProductImage();

  const existingProduct = cart.find(item => item.name === name);

  if(existingProduct){
    existingProduct.quantity += 1;
  }else{
    cart.push({
      name: name,
      price: price,
      quantity: 1,
      image: productImage
    });
  }

  saveCart();
  updateCart();

  alert(`${name} added to cart`);
}

function updateCart(){
  const cartCount = document.getElementById("cart-count");

  let count = 0;

  cart.forEach(item => {
    count += item.quantity;
  });

  if(cartCount){
    cartCount.innerText = count;
  }

  updateSideCart();
  updateCartPage();
}

function updateSideCart(){
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  if(!cartItems || !cartTotal) return;

  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    cartItems.innerHTML += `
      <div class="cart-item">
        <h4>${item.name}</h4>
        <p>R${item.price} x ${item.quantity}</p>
        <button onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
  });

  cartTotal.innerText = `Total: R${total}`;
}

function updateCartPage(){
  const cartPageItems = document.getElementById("cart-page-items");
  const cartPageTotal = document.getElementById("cart-page-total");

  if(!cartPageItems || !cartPageTotal) return;

  cartPageItems.innerHTML = "";

  if(cart.length === 0){
    cartPageItems.innerHTML = `
      <div class="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Add products to your cart before checkout.</p>
        <a href="shop.html">Continue Shopping</a>
      </div>
    `;

    cartPageTotal.innerText = "Total: R0";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    cartPageItems.innerHTML += `
      <div class="cart-page-item">
        <img src="${item.image || 'logo.jpg'}" alt="${item.name}">

        <div class="cart-page-info">
          <h3>${item.name}</h3>
          <p>Price: R${item.price}</p>
          <p>Subtotal: R${itemTotal}</p>
        </div>

        <div class="cart-page-actions">
          <button onclick="decreaseQuantity(${index})">−</button>
          <strong>${item.quantity}</strong>
          <button onclick="increaseQuantity(${index})">+</button>
          <button class="remove-cart-item" onclick="removeFromCart(${index})">Remove</button>
        </div>
      </div>
    `;
  });

  cartPageTotal.innerText = `Total: R${total}`;
}

function increaseQuantity(index){
  cart[index].quantity += 1;
  saveCart();
  updateCart();
}

function decreaseQuantity(index){
  if(cart[index].quantity > 1){
    cart[index].quantity -= 1;
  }else{
    cart.splice(index, 1);
  }

  saveCart();
  updateCart();
}

function removeFromCart(index){
  cart.splice(index, 1);
  saveCart();
  updateCart();
}

function clearCart(){
  cart = [];
  saveCart();
  updateCart();
}

function openCart(){
  window.location.href = "cart.html";
}

function closeCart(){
  const cartPanel = document.getElementById("cart-panel");

  if(cartPanel){
    cartPanel.style.display = "none";
  }
}

function addVillaToCart(productName, selectId){
  const scent = document.getElementById(selectId).value;
  const fullName = `${productName} - ${scent}`;

  let image = "assets/villa/MEN.png";

  if(productName.toLowerCase().includes("ladies")){
    image = "assets/villa/WEMEN.png";
  }

  addToCart(fullName, 160, image);
}

function addMscentsToCart(productName, selectId){
  const select = document.getElementById(selectId);
  const price = Number(select.value);
  const size = select.options[select.selectedIndex].text.split(" - ")[0];

  const image = getClickedProductImage();

  addToCart(`${productName} - ${size}`, price, image);
}

function addFineFragranceToCart(productName, selectId){
  const scent = document.getElementById(selectId).value;
  const fullName = `${productName} - ${scent}`;

  let image = "assets/Fine/black and white.png";

  if(productName.toLowerCase().includes("men")){
    image = "assets/Fine/black.png";
  }

  if(productName.toLowerCase().includes("ladies")){
    image = "assets/Fine/white.png";
  }

  addToCart(fullName, 65, image);
}

function checkoutWhatsApp(){
  if(cart.length === 0){
    alert("Your cart is empty.");
    return;
  }

  let paymentMethod = "";

  const paymentSelect = document.getElementById("payment-option");

  if(paymentSelect){
    paymentMethod = paymentSelect.value;

    if(paymentMethod === ""){
      alert("Please choose a payment option.");
      return;
    }
  }else{
    const paymentOption = prompt(
      "Choose payment option:\n\n1 = Pay Immediately\n2 = End Of Month"
    );

    if(paymentOption === "1"){
      paymentMethod = "Pay Immediately";
    }
    else if(paymentOption === "2"){
      paymentMethod = "End Of Month";
    }
    else{
      alert("Invalid option selected.");
      return;
    }
  }

  let message = "🛒 *TM's Perfume Paradise Order*%0A%0A";

  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    message +=
      `*${index + 1}. ${item.name}*%0A` +
      `Price: R${item.price}%0A` +
      `Quantity: ${item.quantity}%0A` +
      `Subtotal: R${itemTotal}%0A%0A`;
  });

  message += `💳 *Payment Option:* ${paymentMethod}%0A`;
  message += `💰 *Total:* R${total}`;

  const phoneNumber = "27722274193";
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;

  window.open(whatsappURL, "_blank");
}

function sendItemRequest(event){
  event.preventDefault();

  const name = document.getElementById("request-name").value;
  const phone = document.getElementById("request-phone").value;
  const item = document.getElementById("request-item").value;
  const details = document.getElementById("request-details").value;
  const payment = document.getElementById("request-payment").value;

  let message =
    `📝 *TM's Perfume Paradise Item Request*%0A%0A` +
    `*Name:* ${name}%0A` +
    `*Phone:* ${phone}%0A` +
    `*Requested Item:* ${item}%0A` +
    `*Extra Details:* ${details || "None"}%0A` +
    `*Payment Option:* ${payment}`;

  const phoneNumber = "27722274193";
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;

  window.open(whatsappURL, "_blank");
}

updateCart();