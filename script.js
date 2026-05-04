// Products data
const products = {
    cookies: [
        { id: 'cookies-1', name: 'Lays Chips:1can ~50g', price: 40, image: '' },
        { id: 'cookies-2', name: 'Doritos:~50g', price: 40, image: '' },
        { id: 'cookies-3', name: 'Pringles:~50g', price: 40, image: '' }
    ],
    snacks: [
        { id: 'snacks-1', name: 'Airwaves', price: 50, image: '' },
        { id: 'snacks-2', name: 'Hersheys', price: 50, image: '' },
    ],
    drinks: [
        { id: 'drinks-1', name: 'Coke:~350ml', price: 50, image: '' },
        { id: 'drinks-2', name: 'Sprite:~350ml', price: 50, image: '' },
        { id: 'drinks-3', name: 'Orange Juice:~200ml', price: 50, image: '' },
        { id: 'drinks-4', name: 'Pepsi:~350ml', price: 50, image: '' }
    ],
    donuts: [
        { id: 'donuts-1', name: '(mr.donut) Glazed Donut', price: 50, image: '' },
        { id: 'donuts-2', name: '(mr.donut) Strawberry Donut', price: 50, image: '' },
        { id: 'donuts-3', name: '(mr.donut) Chocolate Donut', price: 50, image: '' },
        { id: 'donuts-4', name: '(mr.donut) Strawberry/Chocolate Donut', price: 50, image: '' }
    ],
    giftcards: [
        { id: 'giftcard-1', name: 'Minecraft Gift Card', price: 800.00, image: '' },
        { id: 'giftcard-2', name: 'Apple Shop Gift Card', price: 500.00, image: '' },
        { id: 'giftcard-3', name: 'Google Play Gift Card', price: 500.00, image: '' }
    ]
};
let cart = [];
let quantities = {};
let currentOrderNumber = '';

// Initialize quantities
Object.values(products).flat().forEach(p => {
    quantities[p.id] = 1;
});

// Generate random 6-digit order number
function generateOrderNumber() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Render products
function renderProducts() {
    Object.keys(products).forEach(category => {
        const grid = document.getElementById(`${category}-grid`);
        grid.innerHTML = products[category].map(p => `
            <div class="product-card">
                <div class="product-image">
                    ${p.image ? `<img src="${p.image}" alt="${p.name}">` : '<div style="font-size: 3em;">📦</div>'}
                </div>
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                    <div class="product-price">${p.price.toFixed(2)}</div>
                    <div class="quantity-control">
                        <button class="qty-btn" data-id="${p.id}" data-action="decrease">-</button>
                        <div class="qty-display" id="qty-${p.id}">1</div>
                        <button class="qty-btn" data-id="${p.id}" data-action="increase">+</button>
                    </div>
                    <button class="add-to-cart-btn" data-id="${p.id}">Add to Cart</button>
                </div>
            </div>
        `).join('');
    });
}

// Change quantity
function changeQty(productId, change) {
    quantities[productId] = Math.max(1, quantities[productId] + change);
    document.getElementById('qty-' + productId).textContent = quantities[productId];
}

// Add to cart
function addToCart(productId) {
    const product = Object.values(products).flat().find(p => p.id === productId);
    if (product) {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: quantities[productId]
        });
        quantities[productId] = 1;
        document.getElementById('qty-' + productId).textContent = 1;
        updateCartDisplay();
    }
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
    const cartItemsEl = document.getElementById('cartItems');
    const cartCountEl = document.getElementById('cartCount');
    const totalAmountEl = document.getElementById('totalAmount');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        totalAmountEl.textContent = '$0.00';
    } else {
        let total = 0;
        const html = cart.map((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
                        <div class="cart-item-qty">Quantity: ${item.quantity}</div>
                    </div>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                </div>
            `;
        }).join('');
        cartItemsEl.innerHTML = html;
        totalAmountEl.textContent = '$' + total.toFixed(2);
    }
}

// Toggle cart
function toggleCart() {
    document.getElementById('cartOverlay').classList.toggle('active');
    document.getElementById('cartSidebar').classList.toggle('active');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();

    // Cart button
    document.getElementById('cartButton').addEventListener('click', toggleCart);
    document.getElementById('closeCartBtn').addEventListener('click', toggleCart);
    document.getElementById('cartOverlay').addEventListener('click', toggleCart);

    // Quantity buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('qty-btn')) {
            const productId = e.target.dataset.id;
            const action = e.target.dataset.action;
            changeQty(productId, action === 'increase' ? 1 : -1);
        }
    });

    // Add to cart buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            addToCart(e.target.dataset.id);
        }
    });

    // Remove from cart buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            removeFromCart(parseInt(e.target.dataset.index));
        }
    });

    // Checkout button
    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
        } else {
            // Generate new order number
            currentOrderNumber = generateOrderNumber();
            document.getElementById('orderNumber').value = currentOrderNumber;
            
            // Close cart and show checkout form
            toggleCart();
            document.getElementById('formOverlay').classList.add('active');
            document.getElementById('checkoutForm').classList.add('active');
        }
    });

    // Cancel checkout
    document.getElementById('cancelBtn').addEventListener('click', closeCheckoutForm);
    document.getElementById('formOverlay').addEventListener('click', closeCheckoutForm);

    // Handle form submission
    document.getElementById('orderForm').addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission
        
        // Build order items text
        let orderItemsText = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            orderItemsText += `${index + 1}. ${item.name} | Qty: ${item.quantity} | ${item.price.toFixed(2)} each | Subtotal: ${itemTotal.toFixed(2)}\n`;
        });
        
        // Set hidden fields
        document.getElementById('orderItems').value = orderItemsText;
        document.getElementById('totalAmountHidden').value = `${total.toFixed(2)}`;
        
        // Submit form using AJAX
        const form = e.target;
        const formData = new FormData(form);
        
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            // Close checkout form
            closeCheckoutForm();
            
            // Show thank you message
            document.getElementById('displayOrderNumber').textContent = currentOrderNumber;
            document.getElementById('thankYouOverlay').classList.add('active');
            
            // Clear cart
            cart = [];
            updateCartDisplay();
            
            // Clear form
            form.reset();
        }).catch(error => {
            alert('There was an error submitting your order. Please try again.');
        });
    });

    // Thank you button
    document.getElementById('thankYouBtn').addEventListener('click', () => {
        document.getElementById('thankYouOverlay').classList.remove('active');
    });

    // Category navigation
    document.querySelectorAll('.category-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const categoryId = e.target.dataset.category;
            const element = document.getElementById(categoryId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

function closeCheckoutForm() {
    document.getElementById('formOverlay').classList.remove('active');
    document.getElementById('checkoutForm').classList.remove('active');
}
