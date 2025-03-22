const API_URL = "https://restcountries.com/v3.1/all";

const mainContent = document.getElementById("mainContent");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const mapLink = document.getElementById("mapLink");

class CountryCard extends HTMLElement {
    constructor(country) {
        super();
        this.country = country;
        const shadow = this.attachShadow({ mode: "open" });
        const card = document.createElement("div");
        card.classList.add("country-card");
        const flag = document.createElement("img");
        flag.src = country.flags.png;
        flag.alt = `Bandera de ${country.name.common}`;
        const name = document.createElement("h2");
        name.textContent = country.name.common;
        card.appendChild(flag);
        card.appendChild(name);
        card.addEventListener("click", () => this.openModal());
        const style = document.createElement("style");

        style.textContent = `
        .country-card {
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition: transform 0.3s ease;
        cursor: pointer;
        }
        .country-card:hover {
                transform: scale(1.05);
        }
        .country-card img {
                width: 100%;
                height: 150px;
                object-fit: cover;
        }
        .country-card h2 {
                font-size: 18px;
                margin: 10px;
                text-align: center;
        }
    `;
        shadow.appendChild(style);
        shadow.appendChild(card);
    }

    openModal() {
        modalTitle.textContent = this.country.name.common;
        modalText.textContent = `Continente: ${this.country.continents[0]}`;
        mapLink.href = this.country.maps.googleMaps;
        modal.classList.remove("hidden");
    }
}

customElements.define("country-card", CountryCard);

async function fetchCountries() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const limitedData = data.slice(0, 12); // puedes comentar esta linea para mostrar todos los paises
        displayCountries(limitedData); // en ves de pasar limitedData pasas data
    } catch (error) {
        console.error("Error al cargar los países:", error);
        mainContent.innerHTML = "<p>Error al cargar los datos.</p>";
    }
}

function displayCountries(countries) {
    mainContent.innerHTML = "";

    countries.forEach((country) => {
        const card = new CountryCard(country);
        mainContent.appendChild(card);
    });
}

searchInput.addEventListener("input", (event) => {
    const query = event.target.value.trim();
    if (query === "") {
        fetchCountries();
        return;
    }

    fetch(API_URL)
        .then((response) => response.json())
        .then((data) => {
            const filteredCountries = data.filter((country) =>
                country.name.common.toLowerCase().includes(query.toLowerCase())
            );
            displayCountries(filteredCountries);
        })
        .catch((error) => console.error("Error al filtrar países:", error));
});

closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});
fetchCountries();
