import { useState, useEffect } from 'react'
import CountrySearch from './components/CountrySearch'
import CountryList from './components/CountryList'
import axios from 'axios'

const App = () => {
  const [value, setValue] = useState("")
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] =useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
          if (Array.isArray(response.data)) {
            setCountries(response.data)
          } else if (typeof response.data === "object" && response.data !== null) {
            setCountries([response.data])
          } else {
            setCountries([])
          }
        })
        .catch(error => {
          console.error("Error fetching data:", error)
          setCountries([])
        })
  }, [])

  useEffect(() => {
    if (value) {
      const filteredData = countries.filter(country => 
        country.name.common.toLowerCase().includes(value.toLowerCase())
        )
        setFilteredCountries(filteredData)
      } else {
        setFilteredCountries([])
      }
    }, [value, countries])

    useEffect(() => {
      if (filteredCountries.length === 1) {
        setSelectedCountry(filteredCountries[0])
      }
    }, [filteredCountries])

    useEffect(() => {
      if (selectedCountry && selectedCountry.capitalInfo && selectedCountry.capitalInfo?.latlng) {
        const [lat, lon] = selectedCountry.capitalInfo.latlng
        axios
        .get(`https://api.openweathermap.org/data/3.0/onecall`,{
          params: {
            lat: lat,
            lon: lon,
            exclude: `minutely, hourly, daily, alerts`,
            appid: API_KEY,
            units: "metric"
          }
        })
        .then(response => {
          setWeather(response.data.current)
          console.log(response.data)
        })
      }
    }, [selectedCountry, API_KEY])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const handleView = (country) => {
    setSelectedCountry(selectedCountry === country ? null : country)
  }

  return (
    <div>
    <CountrySearch 
      value={value}
      onChange={handleChange}
    />
      <pre>
       <CountryList 
        countries={filteredCountries}
        selectedCountry={selectedCountry}
        onSelectCountry={handleView}
        weather={weather}
       />
      </pre>
    </div>
  )
}

export default App