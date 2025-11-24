// State Management
const state = {
    cart: JSON.parse(localStorage.getItem('vibe_cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('vibe_wishlist')) || []
};

// DOM Elements
const cartCount = document.querySelector('.cart-count');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

// Core Functions
function updateCartCount() {
    if (cartCount) {
        const totalItems = state.cart.reduce((acc, item) => acc + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function addToCart(product, size = 'M') {
    const existingItem = state.cart.find(item => item.id === product.id && item.size === size);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        state.cart.push({ ...product, quantity: 1, size });
    }

    saveState();
    updateCartCount();
    showToast(`Added ${product.name} to cart!`);
}

function removeFromCart(productId, size) {
    state.cart = state.cart.filter(item => !(item.id === productId && item.size === size));
    saveState();
    updateCartCount();
}

function saveState() {
    localStorage.setItem('vibe_cart', JSON.stringify(state.cart));
    localStorage.setItem('vibe_wishlist', JSON.stringify(state.wishlist));
}

function showToast(message) {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--neon-pink);
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        z-index: 2000;
        animation: slideIn 0.3s ease;
        font-family: var(--font-heading);
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Event Listeners
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // Add keyframes for toast if not exists
    if (!document.querySelector('#toast-style')) {
        const style = document.createElement('style');
        style.id = 'toast-style';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
});
