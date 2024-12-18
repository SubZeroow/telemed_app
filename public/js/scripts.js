// Modal elements and event listeners setup
const signupModal = document.getElementById("signup-modal");
const loginModal = document.getElementById("login-modal");
const signupBtn = document.querySelector(".signup-btn");
const loginBtn = document.querySelector(".login-btn");
const closeBtns = document.querySelectorAll(".close-btn");

// Toggle modal visibility
function toggleModal(modal, action) {
    modal.style.display = action === "open" ? "block" : "none";
}

if (signupBtn) signupBtn.addEventListener("click", () => toggleModal(signupModal, "open"));
if (loginBtn) loginBtn.addEventListener("click", () => toggleModal(loginModal, "open"));

closeBtns.forEach(btn => btn.addEventListener("click", () => {
    toggleModal(signupModal, "close");
    toggleModal(loginModal, "close");
}));

window.addEventListener("click", (event) => {
    if (event.target === signupModal) toggleModal(signupModal, "close");
    if (event.target === loginModal) toggleModal(loginModal, "close");
});

// URL parameter handling
function getUrlParams() {
    const params = {};
    const queryArray = window.location.search.substring(1).split('&');
    queryArray.forEach(param => {
        const [key, value] = param.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
    return params;
}

window.onload = () => {
    const urlParams = getUrlParams();
    if (urlParams['login-email']) document.getElementById('login-email').value = urlParams['login-email'];
    if (urlParams['login-password']) document.getElementById('login-password').value = urlParams['login-password'];
};

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    console.log('Logging in with', email, password);
}

// Signup and login form handlers
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');

if (signupForm) signupForm.addEventListener("submit", (event) => event.preventDefault());
if (loginForm) loginForm.addEventListener("submit", handleLogin);

// Populate dropdown with data
function populateDropdown(data, dropdownElement) {
    dropdownElement.innerHTML = "<option value=''>Select</option>";
    data.forEach(item => {
        if (item) {
            const option = document.createElement("option");
            option.value = item;
            option.textContent = item;
            dropdownElement.appendChild(option);
        }
    });
}

// Fetch and load dropdown data
async function fetchDropdownData(endpoint, dropdownElement) {
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        populateDropdown(data, dropdownElement);
    } catch (error) {
        console.error(`Error loading ${endpoint} data:`, error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchDropdownData('/api/doctors/specializations', document.getElementById("specializationDropdown"));
    fetchDropdownData('/api/doctors/cities', document.getElementById("cityDropdown"));
});

// Load municipalities based on selected city
document.getElementById("cityDropdown").addEventListener("change", (event) => {
    const selectedCity = event.target.value;
    if (selectedCity) {
        fetchDropdownData(`/api/doctors/municipalities/${selectedCity}`, document.getElementById("municipalityDropdown"));
    } else {
        document.getElementById("municipalityDropdown").innerHTML = "<option value=''>Select Municipality</option>";
    }
});

// Search doctors functionality
async function searchDoctors() {
    const specialization = document.getElementById("specializationDropdown").value;
    const city = document.getElementById("cityDropdown").value;
    const municipality = document.getElementById("municipalityDropdown").value;

    try {
        const response = await fetch(`/api/doctors/search?specialization=${encodeURIComponent(specialization)}&city=${encodeURIComponent(city)}&municipality=${encodeURIComponent(municipality)}`);
        if (!response.ok) throw new Error("Search endpoint not found");
        
        const doctors = await response.json();
        populateDoctorSearchResults(doctors);
    } catch (error) {
        console.error("Error fetching search results:", error);
    }
}

// Function to populate the doctor search results dynamically
function populateDoctorSearchResults(doctors) {
    const doctorSearchContainer = document.querySelector(".doctor-search");
    doctorSearchContainer.innerHTML = ""; // Clear previous search results

    doctors.forEach(doctor => {
        const doctorItem = document.createElement("div");
        doctorItem.classList.add("doctor-item");

        doctorItem.innerHTML = `
            <div class="doctor-details">
                <h4>${doctor.fullName}</h4>
                <p><strong>Specialization:</strong> ${doctor.specialization}</p>
                <p><strong>City:</strong> ${doctor.city}</p>
                <p><strong>Municipality:</strong> ${doctor.municipality}</p>
            </div>
            <div class="button-container">
                <div class="doctor-availability">
                    <button>Book</button>
                </div>
                <button class="view-details">View Details</button>
            </div>
        `;

        doctorSearchContainer.appendChild(doctorItem);
    });
}

// Listen for a click event on the search button
document.querySelector(".search-btn").addEventListener("click", searchDoctors);

document.querySelector('.hamburger').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Example JavaScript for search functionality
document.querySelector('.search-btn').addEventListener('click', function() {
    const searchQuery = document.getElementById('doctor').value;

    if (searchQuery) {
        fetch(`/api/search-doctors?query=${searchQuery}`)
            .then(response => response.json())
            .then(data => {
                const searchResultsContainer = document.querySelector('.search-results');
                searchResultsContainer.innerHTML = '';
                data.forEach(doctor => {
                    const doctorCard = document.createElement('div');
                    doctorCard.classList.add('doctor-item');
                    doctorCard.innerHTML = `
                        <div class="doctor-details">
                            <img src="${doctor.image}" alt="Doctor Image">
                            <h4>${doctor.name}</h4>
                            <p><strong>Specialization:</strong> ${doctor.specialization}</p>
                            <p><strong>City:</strong> ${doctor.city}</p>
                            <p><strong>Municipality:</strong> ${doctor.municipality}</p>
                        </div>
                        <div class="button-container">
                            <button class="view-details">View Details</button>
                        </div>
                    `;
                    searchResultsContainer.appendChild(doctorCard);
                });
            })
            .catch(error => console.error('Error fetching doctor data:', error));
    }
});