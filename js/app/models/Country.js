// js/app/models/Country.js

export class Country {
    constructor(data) {
        this.name = data.name.common;
        this.nativeName = this._getNativeName(data.name.nativeName, data.name.common);
        this.population = data.population || 0;
        this.region = data.region || 'Unknown';
        this.subregion = data.subregion || 'Unknown';
        this.capital = data.capital ? data.capital[0] : 'Unknown';
        this.topLevelDomain = data.tld ? data.tld[0] : 'Unknown';
        this.currencies = this._getCurrencies(data.currencies);
        this.languages = this._getLanguages(data.languages);
        this.borders = data.borders || [];
        this.flag = data.flags?.svg || data.flags?.png || '';
        this.cca3 = data.cca3;
    }

    _getNativeName(nativeNameData, fallbackName) {
        if (!nativeNameData) return fallbackName;
        return Object.values(nativeNameData)[0]?.common || fallbackName;
    }

    _getCurrencies(currenciesData) {
        if (!currenciesData) return 'Unknown';
        return Object.values(currenciesData).map(curr => curr.name).join(', ');
    }

    _getLanguages(languagesData) {
        if (!languagesData) return 'Unknown';
        return Object.values(languagesData).join(', ');
    }

    // Method to generate the HTML for the country card
    toCardHtml(formatNumberFn) {
        return `
            <div class="country-card" onclick="app.showCountryDetail('${this.cca3}')">
                <img src="${this.flag}" alt="Flag of ${this.name}" class="country-flag">
                <div class="country-info">
                    <h3 class="country-name">${this.name}</h3>
                    <div class="country-details">
                        <div class="country-detail-item">
                            <span class="country-detail-label">Population:</span> ${formatNumberFn(this.population)}
                        </div>
                        <div class="country-detail-item">
                            <span class="country-detail-label">Region:</span> ${this.region}
                        </div>
                        <div class="country-detail-item">
                            <span class="country-detail-label">Capital:</span> ${this.capital}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Method to generate the HTML for the country detail view
    toDetailHtml(formatNumberFn, borderCountries) {
        const borderTagsHtml = borderCountries.length > 0 ? `
            <div class="border-countries">
                <h3>Border Countries:</h3>
                <div class="border-tags">
                    ${borderCountries.map(border => `
                        <span class="border-tag" onclick="app.showCountryDetail('${border.code}')">
                            ${border.name}
                        </span>
                    `).join('')}
                </div>
            </div>
        ` : '<div class="border-countries"><p>No border countries.</p></div>';

        return `
            <img src="${this.flag}" alt="Flag of ${this.name}" class="detail-flag">
            <div class="detail-info">
                <h2>${this.name}</h2>
                <div class="detail-content">
                    <div class="detail-item">
                        <span class="detail-label">Native Name:</span> ${this.nativeName}
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Top Level Domain:</span> ${this.topLevelDomain}
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Population:</span> ${formatNumberFn(this.population)}
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Currencies:</span> ${this.currencies}
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Region:</span> ${this.region}
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Languages:</span> ${this.languages}
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Sub Region:</span> ${this.subregion}
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Capital:</span> ${this.capital}
                    </div>
                </div>
                ${borderTagsHtml}
            </div>
        `;
    }
}