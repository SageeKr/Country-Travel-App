import { useState } from "react";

export default function Countries({ title, countries, fallbackText, onSelectCountry, isLoading, loadingText, searchBar }) {
  const[searchTerm, setSearchTerm] = useState("")
  function handleSearch(newSearchTerm)
  {
    setSearchTerm(newSearchTerm.toLowerCase())
  }
  let content;
  if(searchTerm === "")
  {
    content= !isLoading && countries.length > 0 && (
      <ul className="countries">
        {countries.map((country) => (
          <li key={country.key} className="country-item">
            <button onClick={() => onSelectCountry(country)}>
              <img src={`${country.flag}`} alt={country.name} />
              <h3>{country.name}</h3>
            </button>
          </li>
        ))}
      </ul>
    )
  }
  else
  {
    content = !isLoading && countries.length > 0 && (
      <ul className="countries">
        {countries.map((country) => {
          if (country.name.toLowerCase().includes(searchTerm)) {
            return (
              <li key={country.key} className="country-item">
                <button onClick={() => onSelectCountry(country)}>
                  <img src={`${country.flag}`} alt={country.name} />
                  <h3>{country.name}</h3>
                </button>
              </li>
            );
          }
        })}
      </ul>
    );}
    
  return (
    <section className="countries-category">
      <h2>{title}</h2>
      {searchBar && <input value={searchTerm} onChange={(event)=>handleSearch(event.target.value)} type='text' placeholder='search'></input>}

      {isLoading && <p className="fallback-text">{loadingText}</p>}
      {!isLoading && countries.length === 0 && <p className="fallback-text">{fallbackText}</p>}
      {content}
     
    </section>
  );
}
