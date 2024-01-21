import Countries from "./Countries.jsx";
import Error from "./Error.jsx";
import { sortCountrysByDistance } from "../loc.js";
import { fetchAvailableCountrys } from "../http.js";
import { useFetch } from "../hooks/useFetch.js";


async function fetchSortedCountries() {
  const countries = await fetchAvailableCountrys();

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedCountries = sortCountrysByDistance(
        countries,
        position.coords.latitude,
        position.coords.longitude
      );

      resolve(sortedCountries);
    });
  });
}
export default function AvailableCountries({ onSelectCountry }) {
  const {
    isFetching,
    error,
    fetchedData: availableCountries,
  } = useFetch(fetchSortedCountries, []);

  if (error) {
    return <Error title="An error occurred!" message={error.message} />;
  }
  return (
    <Countries
      title="Available Countries"
      countries={availableCountries}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectCountry={onSelectCountry}
      searchBar
    />
  );
}
