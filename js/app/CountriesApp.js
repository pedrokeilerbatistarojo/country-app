
import { Country } from './models/Country.js';

export class CountriesApp {
    constructor() {
        this.countries = [];
        this.filteredCountries = [];
        this.currentTheme = localStorage.getItem('theme') || 'light';

        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupTheme();
        await this.loadCountries();
        this.renderCountries();
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Search
        document.getElementById('searchInput').addEventListener('input', () => {
            this.filterCountries();
        });

        // Region filter
        document.getElementById('regionFilter').addEventListener('change', () => {
            this.filterCountries();
        });

        // Back button
        document.getElementById('backButton').addEventListener('click', () => {
            this.showHomePage();
        });

        // Delegate click for country cards (since onclick is in HTML)
        // Add a click listener to the grid to handle clicks on country cards
        document.getElementById('countriesGrid').addEventListener('click', (event) => {
            const card = event.target.closest('.country-card');
            if (card) {
                const countryName = card.dataset.countryName; // Get the name from data-country-name
                if (countryName) {
                    this.showCountryDetail(countryName);
                }
            }
        });

        // Delegate click for border tags on the detail page
        document.getElementById('countryDetail').addEventListener('click', (event) => {
            const borderTag = event.target.closest('.border-tag');
            if (borderTag) {
                const countryName = borderTag.dataset.countryName; // Get the name from data-country-name
                if (countryName) {
                    this.showCountryDetail(countryName);
                }
            }
        });
    }

    setupTheme() {
        if (this.currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
            document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>';
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.body.classList.toggle('dark-mode');

        const themeButton = document.getElementById('themeToggle');
        if (this.currentTheme === 'dark') {
            themeButton.innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>';
        } else {
            themeButton.innerHTML = '<i class="fas fa-moon"></i><span>Dark Mode</span>';
        }

        localStorage.setItem('theme', this.currentTheme);

        this.updateFilterSelectArrowColor();
    }

    updateFilterSelectArrowColor() {
        const filterSelect = document.getElementById('regionFilter');
        if (filterSelect) {
            setTimeout(() => {
                const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
                const encodedColor = encodeURIComponent(textColor.replace('#', ''));
                filterSelect.style.backgroundImage = `url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23${encodedColor}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6,9 12,15 18,9'></polyline></svg>")`;
            }, 50);
        }
    }

    async loadCountries() {
        try {
            document.getElementById('loading').style.display = 'block';

            // MODIFICACIÓN: REMOVER 'cca3' de la solicitud de fields
            const apiUrl = 'https://restcountries.com/v3.1/all?fields=name,population,region,subregion,capital,tld,currencies,languages,borders,flags';

            const response = await fetch(apiUrl);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${response.status} - ${errorData.message || response.statusText}`);
            }

            const data = await response.json();

            this.countries = data.map(countryData => new Country(countryData)).sort((a, b) => a.name.localeCompare(b.name));

            this.filteredCountries = [...this.countries];

            document.getElementById('loading').style.display = 'none';
            this.updateFilterSelectArrowColor();
        } catch (error) {
            console.error('Error loading countries:', error);
            document.getElementById('loading').innerHTML = `<p>Error loading countries: ${error.message || 'Please try again later.'}</p>`;
        }
    }

    filterCountries() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const regionFilter = document.getElementById('regionFilter').value;

        this.filteredCountries = this.countries.filter(country => {
            const matchesSearch = country.name.toLowerCase().includes(searchTerm);
            const matchesRegion = !regionFilter || country.region === regionFilter;

            return matchesSearch && matchesRegion;
        });

        this.renderCountries();
    }

    renderCountries() {
        const grid = document.getElementById('countriesGrid');
        const noResults = document.getElementById('noResults');

        if (this.filteredCountries.length === 0) {
            grid.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }

        grid.style.display = 'grid';
        noResults.style.display = 'none';

        // Pass a reference to the app instance for the onclick
        grid.innerHTML = this.filteredCountries.map(country => country.toCardHtml(this.formatNumber)).join('');
    }

    // MODIFICACIÓN: showCountryDetail ahora recibe el nombre del país
    showCountryDetail(countryName) {
        // Encontrar el país por su nombre
        const country = this.countries.find(c => c.name === countryName);
        if (!country) {
            console.error('Country not found:', countryName);
            return;
        }

        // Los border `codes` que obtenemos de la API siguen siendo CCA3
        // Necesitamos convertirlos a nombres comunes para la navegación
        const borderCountries = country.borders.map(borderCode => {
            const borderCountry = this.countries.find(c => c.cca3 === borderCode); // Aquí usamos cca3 para buscar
            return borderCountry ? { name: borderCountry.name, code: borderCountry.name } : null; // Guardamos el nombre como 'code' para pasarlo
        }).filter(Boolean);

        document.getElementById('countryDetail').innerHTML = country.toDetailHtml(this.formatNumber, borderCountries);

        this.showDetailPage();
    }

    showDetailPage() {
        document.getElementById('homePage').style.display = 'none';
        document.getElementById('detailPage').style.display = 'block';
    }

    showHomePage() {
        document.getElementById('detailPage').style.display = 'none';
        document.getElementById('homePage').style.display = 'block';
        // Reset search input and region filter when returning to home page
        document.getElementById('searchInput').value = '';
        document.getElementById('regionFilter').value = '';
        this.filterCountries();
    }

    formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    }
}

// export class CountriesApp {
//     constructor() {
//         this.countries = [];
//         this.filteredCountries = [];
//         this.currentTheme = localStorage.getItem('theme') || 'light';
//
//         this.init();
//     }
//
//     async init() {
//         this.setupEventListeners();
//         this.setupTheme();
//         await this.loadCountries();
//         this.renderCountries();
//     }
//
//     setupEventListeners() {
//         // Theme toggle
//         document.getElementById('themeToggle').addEventListener('click', () => {
//             this.toggleTheme();
//         });
//
//         // Search
//         document.getElementById('searchInput').addEventListener('input', () => {
//             this.filterCountries();
//         });
//
//         // Region filter
//         document.getElementById('regionFilter').addEventListener('change', () => {
//             this.filterCountries();
//         });
//
//         // Back button
//         document.getElementById('backButton').addEventListener('click', () => {
//             this.showHomePage();
//         });
//     }
//
//     setupTheme() {
//         if (this.currentTheme === 'dark') {
//             document.body.classList.add('dark-mode');
//             document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>';
//         }
//     }
//
//     toggleTheme() {
//         this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
//         document.body.classList.toggle('dark-mode');
//
//         const themeButton = document.getElementById('themeToggle');
//         if (this.currentTheme === 'dark') {
//             themeButton.innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>';
//         } else {
//             themeButton.innerHTML = '<i class="fas fa-moon"></i><span>Dark Mode</span>';
//         }
//
//         localStorage.setItem('theme', this.currentTheme);
//
//         // Update SVG arrow color for filter-select on theme change
//         this.updateFilterSelectArrowColor();
//     }
//
//     updateFilterSelectArrowColor() {
//         const filterSelect = document.getElementById('regionFilter');
//         if (filterSelect) {
//             // Asegurarse de obtener el color correctamente después de que el tema cambie
//             setTimeout(() => { // Pequeño retraso para asegurar que el CSS haya aplicado el nuevo color
//                 const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
//                 const encodedColor = encodeURIComponent(textColor.replace('#', ''));
//                 filterSelect.style.backgroundImage = `url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23${encodedColor}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6,9 12,15 18,9'></polyline></svg>")`;
//             }, 50); // Ajusta el tiempo si es necesario
//         }
//     }
//
//     async loadCountries() {
//         try {
//             document.getElementById('loading').style.display = 'block';
//
//             const response = await fetch('https://restcountries.com/v3.1/all?fields=name,population,region,subregion,capital,tld,currencies,languages,borders,flags');
//             const data = await response.json();
//
//             this.countries = data.map(countryData => new Country(countryData)).sort((a, b) => a.name.localeCompare(b.name));
//
//             this.filteredCountries = [...this.countries];
//
//             document.getElementById('loading').style.display = 'none';
//             this.updateFilterSelectArrowColor(); // Initial call to set arrow color
//         } catch (error) {
//             console.error('Error loading countries:', error);
//             document.getElementById('loading').innerHTML = '<p>Error loading countries. Please try again later.</p>';
//         }
//     }
//
//     filterCountries() {
//         const searchTerm = document.getElementById('searchInput').value.toLowerCase();
//         const regionFilter = document.getElementById('regionFilter').value;
//
//         this.filteredCountries = this.countries.filter(country => {
//             const matchesSearch = country.name.toLowerCase().includes(searchTerm);
//             const matchesRegion = !regionFilter || country.region === regionFilter;
//
//             return matchesSearch && matchesRegion;
//         });
//
//         this.renderCountries();
//     }
//
//     renderCountries() {
//         const grid = document.getElementById('countriesGrid');
//         const noResults = document.getElementById('noResults');
//
//         if (this.filteredCountries.length === 0) {
//             grid.style.display = 'none';
//             noResults.style.display = 'block';
//             return;
//         }
//
//         grid.style.display = 'grid';
//         noResults.style.display = 'none';
//
//         grid.innerHTML = this.filteredCountries.map(country => country.toCardHtml(this.formatNumber)).join('');
//     }
//
//     showCountryDetail(countryCode) {
//         const country = this.countries.find(c => c.cca3 === countryCode);
//         if (!country) return;
//
//         const borderCountries = country.borders.map(borderCode => {
//             const borderCountry = this.countries.find(c => c.cca3 === borderCode);
//             return borderCountry ? { name: borderCountry.name, code: borderCountry.cca3 } : null;
//         }).filter(Boolean);
//
//         document.getElementById('countryDetail').innerHTML = country.toDetailHtml(this.formatNumber, borderCountries);
//
//         this.showDetailPage();
//     }
//
//     showDetailPage() {
//         document.getElementById('homePage').style.display = 'none';
//         document.getElementById('detailPage').style.display = 'block';
//     }
//
//     showHomePage() {
//         document.getElementById('detailPage').style.display = 'none';
//         document.getElementById('homePage').style.display = 'block';
//     }
//
//     formatNumber(num) {
//         return new Intl.NumberFormat().format(num);
//     }
// }