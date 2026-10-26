/**
 * Tania Sweets - Frontend UI/UX Logic
 * Dynamic WhatsApp Link Generator & Interactive Card Options
 * Supports Dynamic Size Pricing & Interactive Extra Topping Add-on (+$7 pesos)
 */

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_PHONE = '525561965408';
  const BASE_WA_URL = 'https://wa.me/' + WHATSAPP_PHONE;

  // Current State for each product
  const productState = {
    crepas: {
      title: 'Crepa artesanal',
      basePrice: 60,
      flavor: 'Con Philadelphia y (fresa o pl\u00E1tano)',
      topping: 'Coco rallado',
      hasExtra: false,
      extraTopping: 'Chispas de chocolate'
    },
    donitas: {
      title: 'Mini Donas (8 piezas)',
      basePrice: 50,
      flavor: 'Con Lechera',
      topping: 'Coco rallado',
      hasExtra: false,
      extraTopping: 'Chispas de chocolate'
    },
    fresas: {
      title: 'Fresas con Crema',
      sizeName: 'Vaso Chico',
      basePrice: 60,
      topping: 'Coco rallado',
      hasExtra: false,
      extraTopping: 'Chispas de chocolate'
    },
    duraznos: {
      title: 'Duraznos con Crema',
      sizeName: 'Vaso Est\u00E1ndar',
      basePrice: 65,
      topping: 'Coco rallado',
      hasExtra: false,
      extraTopping: 'Chispas de chocolate'
    }
  };

  /**
   * Updates the card price badge and header text dynamically with subtle animation
   */
  function updateCardPrice(productKey) {
    const p = productState[productKey];
    if (!p) return;

    const total = p.basePrice + (p.hasExtra ? 7 : 0);
    const dynamicPriceEl = document.getElementById(productKey + '-dynamic-price');
    if (dynamicPriceEl) {
      dynamicPriceEl.textContent = '$' + total;
      dynamicPriceEl.style.transform = 'scale(1.15)';
      dynamicPriceEl.style.color = '#E82B63';
      setTimeout(() => {
        dynamicPriceEl.style.transform = 'scale(1)';
        dynamicPriceEl.style.color = '';
      }, 200);
    }
  }

  /**
   * Updates the WhatsApp button URL for a specific product card
   */
  function updateWhatsAppLink(productKey) {
    let message = '';
    const p = productState[productKey];
    if (!p) return;

    const total = p.basePrice + (p.hasExtra ? 7 : 0);

    if (productKey === 'fresas') {
      if (p.hasExtra) {
        message = '\u00A1Hola Tania Sweets! Quiero unas Fresas con Crema en ' + p.sizeName + ' con Topping Extra. Incluido: ' + p.topping + ' | Extra: ' + p.extraTopping + '. Total: $' + total;
      } else {
        message = '\u00A1Hola Tania Sweets! Quiero unas Fresas con Crema en ' + p.sizeName + ' ($' + total + ') con Topping Incluido de: ' + p.topping;
      }
    } else if (productKey === 'duraznos') {
      if (p.hasExtra) {
        message = '\u00A1Hola Tania Sweets! Quiero unos Duraznos con Crema en ' + p.sizeName + ' con Topping Extra. Incluido: ' + p.topping + ' | Extra: ' + p.extraTopping + '. Total: $' + total;
      } else {
        message = '\u00A1Hola Tania Sweets! Quiero unos Duraznos con Crema en ' + p.sizeName + ' ($' + total + ') con Topping Incluido de: ' + p.topping;
      }
    } else if (productKey === 'crepas') {
      if (p.hasExtra) {
        message = '\u00A1Hola Tania Sweets! Quiero una ' + p.title + ' con Topping Extra:\n\u2022 Sabor: ' + p.flavor + '\n\u2022 Incluido: ' + p.topping + ' | Extra: ' + p.extraTopping + '\nTotal: $' + total;
      } else {
        message = '\u00A1Hola Tania Sweets! Quiero una ' + p.title + ' ($' + total + '):\n\u2022 Sabor: ' + p.flavor + '\n\u2022 Topping Incluido: ' + p.topping;
      }
    } else if (productKey === 'donitas') {
      if (p.hasExtra) {
        message = '\u00A1Hola Tania Sweets! Quiero una orden de ' + p.title + ' con Topping Extra:\n\u2022 Cobertura: ' + p.flavor + '\n\u2022 Incluido: ' + p.topping + ' | Extra: ' + p.extraTopping + '\nTotal: $' + total;
      } else {
        message = '\u00A1Hola Tania Sweets! Quiero una orden de ' + p.title + ' ($' + total + '):\n\u2022 Cobertura: ' + p.flavor + '\n\u2022 Topping Incluido: ' + p.topping;
      }
    }

    const btn = document.getElementById('btn-order-' + productKey);
    if (btn) {
      const encodedMsg = encodeURIComponent(message);
      btn.href = BASE_WA_URL + '?text=' + encodedMsg;
    }
  }

  // --- 1. Flavour / Combination Pills Click Handler ---
  const optionPills = document.querySelectorAll('.option-pill');
  optionPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const product = pill.getAttribute('data-product');
      const value = pill.getAttribute('data-value');

      // Update active state in UI
      const parent = pill.closest('.options-pills');
      if (parent) {
        parent.querySelectorAll('.option-pill').forEach(btn => btn.classList.remove('active'));
      }
      pill.classList.add('active');

      // Update state & link
      if (productState[product]) {
        productState[product].flavor = value;
        updateWhatsAppLink(product);
      }
    });
  });

  // --- 2. Toppings Tags Click Handler (Primary / Included Topping) ---
  const toppingTags = document.querySelectorAll('.topping-tag:not(.extra-topping-btn)');
  toppingTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const product = tag.getAttribute('data-product');
      const value = tag.getAttribute('data-value');

      // Update active state in UI
      const parent = tag.closest('.toppings-tags');
      if (parent) {
        parent.querySelectorAll('.topping-tag').forEach(btn => btn.classList.remove('active'));
      }
      tag.classList.add('active');

      // Update state & link
      if (productState[product]) {
        productState[product].topping = value;
        updateWhatsAppLink(product);
      }
    });
  });

  // --- 3. Size Variants Click Handler (For Fresas & Duraznos) ---
  const sizeBtns = document.querySelectorAll('.size-btn');
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const product = btn.getAttribute('data-product');
      const size = btn.getAttribute('data-size');
      const price = parseInt(btn.getAttribute('data-price'), 10);

      // Update active state in UI
      const parent = btn.closest('.size-variants');
      if (parent) {
        parent.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      }
      btn.classList.add('active');

      // Update state, price and link
      if (productState[product]) {
        productState[product].sizeName = size;
        productState[product].basePrice = price;
        updateCardPrice(product);
        updateWhatsAppLink(product);
      }
    });
  });

  // --- 4. Extra Topping Checkbox Toggle Handler ---
  const extraCheckboxes = document.querySelectorAll('.extra-topping-checkbox');
  extraCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const product = checkbox.getAttribute('data-product');
      const isChecked = checkbox.checked;
      const box = checkbox.closest('.extra-topping-box');
      const panel = document.getElementById('extra-panel-' + product);

      if (box) {
        if (isChecked) {
          box.classList.add('is-active');
        } else {
          box.classList.remove('is-active');
        }
      }

      if (panel) {
        panel.style.display = isChecked ? 'block' : 'none';
      }

      if (productState[product]) {
        productState[product].hasExtra = isChecked;
        updateCardPrice(product);
        updateWhatsAppLink(product);
      }
    });
  });

  // --- 5. Extra Topping Selection Handler (Second Topping) ---
  const extraToppingBtns = document.querySelectorAll('.extra-topping-btn');
  extraToppingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const product = btn.getAttribute('data-product');
      const value = btn.getAttribute('data-value');

      const parent = btn.closest('.extra-tags');
      if (parent) {
        parent.querySelectorAll('.extra-topping-btn').forEach(b => b.classList.remove('active'));
      }
      btn.classList.add('active');

      if (productState[product]) {
        productState[product].extraTopping = value;
        updateWhatsAppLink(product);
      }
    });
  });

  // Initialize all cards with default values and generated links
  ['crepas', 'donitas', 'fresas', 'duraznos'].forEach(product => {
    updateCardPrice(product);
    updateWhatsAppLink(product);
  });

  // --- 6. Header Shadow on Scroll ---
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 20) {
        header.style.boxShadow = '0 6px 20px rgba(90, 23, 68, 0.08)';
      } else {
        header.style.boxShadow = '0 2px 8px rgba(90, 23, 68, 0.04)';
      }
    }
  });

  // --- 7. Smooth Scroll for Navigation ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerHeight = header ? header.offsetHeight : 0;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 15;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
});
