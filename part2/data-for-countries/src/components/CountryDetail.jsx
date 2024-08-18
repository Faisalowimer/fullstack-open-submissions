import React from "react"

const CountryDetail = ({ country, weather}) => {
    return(
        <div>
            <h1>{country.name.common}</h1>
            <p>Capital: {country.capital[0]}</p>
            <p>Area: {country.area}</p>
            <h2>Languages:</h2>
            <ul>
                {Object.values(country.languages).map((language, index) => (
                    <li key={index}>
                        {language}
                    </li>
                ))}
            </ul>
            <img 
                src={country.flags.png} 
                alt={`Flag of ${country.name.common}`} 
                width="100" 
            />
            <h2>Weather in {country.capital[0]}</h2>
            {weather && (
                <div>
                    <p>Temperature: {weather.main.temp} °C</p>
                    <p>Weather: {weather.weather[0].description}</p>
                    <img 
                        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                        alt={weather.weather[0].description}
                    />
                    <p>Wind: {weather.wind.speed} m/s</p>
                </div>
            )}
        </div>
    )
}

export default CountryDetail