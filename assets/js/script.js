'use strict';

// Element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// Mobile Navigation Toggle
const header = document.querySelector(".header");
const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll("[data-nav-link]");

if (navToggleBtn) {
  navToggleBtn.addEventListener("click", function () {
    elementToggleFunc(header);
    elementToggleFunc(navbar);
  });
}

// Close mobile navbar on nav link click
for (let i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener("click", function () {
    header.classList.remove("active");
    navbar.classList.remove("active");
  });
}

// Custom Select / Filter for Credentials
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

// Add event in all select items for mobile dropdown
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// Filter function
const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

// Add click event in all filter button items for desktop/large screens
if (filterBtn.length > 0) {
  let lastClickedBtn = filterBtn[0];

  for (let i = 0; i < filterBtn.length; i++) {
    filterBtn[i].addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = this.innerText;
      filterFunc(selectedValue);

      lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    });
  }
}

// Contact form validation
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

if (form && formInputs.length > 0 && formBtn) {
  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", function () {
      // check form validation
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  }
}

// Active link on scroll (Scroll Spy) & Header transparency
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", function () {
  let scrollY = window.pageYOffset;
  
  // Header background control
  if (scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  // Active navigation link tracking
  sections.forEach(current => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 140;
    const sectionId = current.getAttribute("id");
    const activeNavLink = document.querySelector(`.navbar-link[href*=${sectionId}]`);

    if (activeNavLink) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelector(".navbar-link.active")?.classList.remove("active");
        activeNavLink.classList.add("active");
      }
    }
  });
});

// Scroll Reveal Animation (Intersection Observer)
const revealElements = document.querySelectorAll("[data-scroll-reveal]");

const revealCallback = function (entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
      // Stop observing once revealed to improve scroll performance
      observer.unobserve(entry.target);
    }
  });
};

const revealObserver = new IntersectionObserver(revealCallback, {
  root: null,
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
});

revealElements.forEach(element => {
  revealObserver.observe(element);
});

// UPGRADE 1: IST Live Clock Ticker
function updateClock() {
  const clockEl = document.getElementById("live-clock");
  if (!clockEl) return;
  
  // Calculate UTC time, then offset by 5.5 hours for IST
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const ist = new Date(utc + (3600000 * 5.5));
  
  let hours = ist.getHours();
  let minutes = ist.getMinutes();
  let seconds = ist.getSeconds();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  
  clockEl.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
}
setInterval(updateClock, 1000);
updateClock(); // Initial call

// UPGRADE 2: Theme Selector Switcher
const themeButtons = document.querySelectorAll(".theme-btn");
themeButtons.forEach(btn => {
  btn.addEventListener("click", function() {
    const theme = this.dataset.theme;
    
    // Set active button
    themeButtons.forEach(b => b.classList.remove("active"));
    this.classList.add("active");
    
    // Apply to body
    document.body.classList.remove("oled-theme", "violet-theme");
    if (theme === "oled") document.body.classList.add("oled-theme");
    if (theme === "violet") document.body.classList.add("violet-theme");
    
    localStorage.setItem("selected-theme", theme);
  });
});

// Load saved theme preference
const savedTheme = localStorage.getItem("selected-theme");
if (savedTheme) {
  const targetBtn = document.querySelector(`.theme-btn[data-theme="${savedTheme}"]`);
  if (targetBtn) targetBtn.click();
}

// UPGRADE 3: Frosted Glass Certificate Modals
const certItems = document.querySelectorAll(".project-item");
const certModal = document.getElementById("certModal");
const modalImg = document.getElementById("modalCertImg");
const modalCat = document.getElementById("modalCertCat");
const modalTitle = document.getElementById("modalCertTitle");
const modalVerify = document.getElementById("modalCertVerify");
const modalClose = document.querySelector(".cert-modal-close");
const modalOverlay = document.querySelector(".cert-modal-overlay");

certItems.forEach(item => {
  const link = item.querySelector("a");
  if (!link) return;

  link.addEventListener("click", function(e) {
    e.preventDefault(); // Prevent jump behavior
    
    const title = item.dataset.certTitle;
    const cat = item.dataset.certCategory;
    const img = item.dataset.certImg;
    const verify = item.dataset.certVerify;

    if (modalImg) modalImg.src = img;
    if (modalCat) modalCat.textContent = cat;
    if (modalTitle) modalTitle.textContent = title;
    if (modalVerify) {
      modalVerify.href = verify;
      if (!verify || verify === "#") {
        modalVerify.style.display = "none";
      } else {
        modalVerify.style.display = "flex";
      }
    }

    if (certModal) certModal.classList.add("active");
  });
});

const closeCertModal = function() {
  if (certModal) certModal.classList.remove("active");
};

if (modalClose) modalClose.addEventListener("click", closeCertModal);
if (modalOverlay) modalOverlay.addEventListener("click", closeCertModal);
// Close modal on Esc key press
window.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    closeCertModal();
  }
});