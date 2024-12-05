// Elements
const topBar = document.querySelector('#top-bar');
const exteriorColorSection = document.querySelector('#exterior-buttons');
const interiorColorSection = document.querySelector('#interior-buttons');
const exteriorImage = document.querySelector('#exterior-image');
const interiorImage = document.querySelector('#interior-image');
const wheelButtonsSection = document.querySelector('#wheel-buttons');
const performanceBtn = document.querySelector('#performance-btn');
const totalPriceElement = document.querySelector('#total-price');
const fullSelfDrivingCheckbox = document.querySelector('#full-self-driving-checkbox');
const accessoryCheckboxes = document.querySelectorAll('.accessory-form-checkbox');
const downPaymentElement = document.querySelector('#down-payment');
const monthlyPaymentElement = document.querySelector('#monthly-payment');

// Defaults
const basePrice = 52490;
let currentPrice = basePrice;

let selectedColor = 'Stealth Grey';
const selectedOptions = {
  'Performance Wheels': false,
  'Performance Package': false,
  'Full Self-Driving': false,
};

const pricing = {
  'Performance Wheels': 2500,
  'Performance Package': 5000,
  'Full Self-Driving': 8500,
  Accessories: {
    'Center Console Trays': 35,
    Sunshade: 105,
    'All-Weather Interior Liners': 225,
  },
};

const exteriorImages = {
  'Stealth Grey': './images/model-y-stealth-grey.jpg',
  'Pearl White': './images/model-y-pearl-white.jpg',
  'Deep Blue': './images/model-y-deep-blue-metallic.jpg',
  'Solid Black': './images/model-y-solid-black.jpg',
  'Ultra Red': './images/model-y-ultra-red.jpg',
  Quicksilver: './images/model-y-quicksilver.jpg',
};

const interiorImages = {
  Dark: './images/model-y-interior-dark.jpg',
  Light: './images/model-y-interior-light.jpg',
};

// Utility: Update Total Price
const updateTotalPrice = () => {
  currentPrice = basePrice;

  // Add selected options
  Object.keys(selectedOptions).forEach((key) => {
    if (selectedOptions[key]) {
      currentPrice += pricing[key];
    }
  });

  // Add accessories
  accessoryCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const label = checkbox.closest('label').querySelector('span').textContent.trim();
      currentPrice += pricing['Accessories'][label] || 0;
    }
  });

  // Update UI
  totalPriceElement.textContent = `$${currentPrice.toLocaleString()}`;
  updatePaymentBreakdown();
};

// Utility: Update Payment Breakdown
const updatePaymentBreakdown = () => {
  const loanTerm = parseInt(document.querySelector('#loan-term')?.value || 60, 10);
  const interestRate = parseFloat(document.querySelector('#interest-rate')?.value || 3) / 100;
  const downPaymentPercentage = parseFloat(document.querySelector('#down-payment-percentage')?.value || 10) / 100;

  const downPayment = currentPrice * downPaymentPercentage;
  const loanAmount = currentPrice - downPayment;
  const monthlyRate = interestRate / 12;
  const monthlyPayment = (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm))) / (Math.pow(1 + monthlyRate, loanTerm) - 1);

  // Update UI
  downPaymentElement.textContent = `$${downPayment.toLocaleString()}`;
  monthlyPaymentElement.textContent = `$${monthlyPayment.toFixed(2).toLocaleString()}`;
};

// Utility: Update Images
const updateImage = async (imageElement, images, key, suffix = '', fallback = './images/default.jpg') => {
  const imagePath = images[key]?.replace('.jpg', `${suffix}.jpg`) || fallback;
  if (await imageExists(imagePath)) {
    imageElement.src = imagePath;
  } else {
    console.error(`Image not found for ${key}`);
    imageElement.src = fallback;
  }
};

// Event: Handle Scroll
const handleScroll = () => {
  const atTop = window.scrollY === 0;
  topBar?.classList.toggle('visible-bar', atTop);
  topBar?.classList.toggle('hidden-bar', !atTop);
};

// Event: Handle Color Selection
const handleColorSelection = (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const buttons = event.currentTarget.querySelectorAll('button');
  buttons.forEach((btn) => btn.classList.remove('btn-selected'));
  button.classList.add('btn-selected');

  if (event.currentTarget === exteriorColorSection) {
    selectedColor = button.querySelector('img').alt;
    updateImage(exteriorImage, exteriorImages, selectedColor, selectedOptions['Performance Wheels'] ? '-performance' : '');
  } else if (event.currentTarget === interiorColorSection) {
    const color = button.querySelector('img').alt;
    interiorImage.src = interiorImages[color];
  }
};

// Event: Handle Wheel Button Click
const handleWheelSelection = (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const buttons = wheelButtonsSection.querySelectorAll('button');
  buttons.forEach((btn) => btn.classList.remove('bg-gray-700', 'text-white'));
  button.classList.add('bg-gray-700', 'text-white');

  selectedOptions['Performance Wheels'] = button.textContent.includes('Performance');
  updateImage(exteriorImage, exteriorImages, selectedColor, selectedOptions['Performance Wheels'] ? '-performance' : '');
  updateTotalPrice();
};

// Event: Toggle Performance Package
const togglePerformancePackage = () => {
  performanceBtn?.classList.toggle('bg-gray-700');
  performanceBtn?.classList.toggle('text-white');
  selectedOptions['Performance Package'] = performanceBtn?.classList.contains('bg-gray-700');
  updateTotalPrice();
};

// Event: Full Self Driving Selection
const toggleFullSelfDriving = () => {
  selectedOptions['Full Self-Driving'] = fullSelfDrivingCheckbox?.checked;
  updateTotalPrice();
};

// Utility: Check if Image Exists
const imageExists = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

// Event Listeners
window.addEventListener('scroll', handleScroll);
exteriorColorSection?.addEventListener('click', handleColorSelection);
interiorColorSection?.addEventListener('click', handleColorSelection);
wheelButtonsSection?.addEventListener('click', handleWheelSelection);
performanceBtn?.addEventListener('click', togglePerformancePackage);
fullSelfDrivingCheckbox?.addEventListener('change', toggleFullSelfDriving);
accessoryCheckboxes.forEach((checkbox) => checkbox.addEventListener('change', updateTotalPrice));

// Initialize
updateTotalPrice();
