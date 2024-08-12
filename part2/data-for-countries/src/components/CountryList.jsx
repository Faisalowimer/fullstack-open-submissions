import React from "react"
import CountryDetail from "./CountryDetail"

const CountryList = ({ 
    countries, selectedCountry, onSelectCountry, weather
    }) => {
            if (countries.length === 0) {
                return <p>Type a country name to display information.</p>
          
            } else if (countries.length > 10) {
                return <p>Too many matches, specify another filter</p>
          
            } else if (countries.length > 1) {
                return (
                  <ul>
                    {countries.map(country => (
                      <li key={country.cca3}>
                        {country.name.common}
                        <button onClick={() => onSelectCountry(country)}>
                          {selectedCountry === country ? "hide" : "show"}
                        </button>
                        {selectedCountry === country && (
                          <CountryDetail 
                            country={country}
                            weather={weather}
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                )
          
              } else if (countries.length === 1) {
                const country = countries[0]
                return (
                  <CountryDetail 
                    country={country}
                    weather={weather}
                  />
                )
              }
        
}

export default CountryList