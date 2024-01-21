import { useRef, useState, useCallback} from 'react';

import Countries from './components/Countries.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailableCountries from './components/AvailableCountries.jsx';
import { fetchUserPlaces, updateUserPlaces } from './http.js';
import Error from './components/Error.jsx';
import { useFetch } from './hooks/useFetch.js';

function App() {
  const selectedCountry = useRef();
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const {
    isFetching,
    error,
    fetchedData: userCountries,
    setFetchedData: setUserCountries} = useFetch(fetchUserPlaces,[])
  function handleStartRemovePlace(Country) {
    setModalIsOpen(true);
    selectedCountry.current = Country;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }
  
  async function handleSelectCountry(selectedCountry) {
    setUserCountries((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.key === selectedCountry.key)) {

        return prevPickedPlaces;
      }
      return [selectedCountry, ...prevPickedPlaces];
    });

    try {
      await updateUserPlaces([selectedCountry, ...userCountries]);
      console.log("FUCK ME B");
    } catch (error) {
      console.log("FUCK ME C");
      setUserCountries(userCountries);
      setErrorUpdatingPlaces({
        message: error.message || 'Failed to update countries.',
      });
    }
  }
  
  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      setUserCountries((prevPickedPlaces) =>
        prevPickedPlaces.filter(
          (place) => place.key !== selectedCountry.current.key
        )
      );

      try {
        await updateUserPlaces(
          userCountries.filter((place) => place.key !== selectedCountry.current.key)
        );
      } catch (error) {
        setUserCountries(userCountries);
        setErrorUpdatingPlaces({
          message: error.message || 'Failed to delete countries.',
        });
      }

      setModalIsOpen(false);
    },
    [userCountries, setUserCountries]
  );

  function handleError() {
    setErrorUpdatingPlaces(null);
  }

  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {errorUpdatingPlaces && (
          <Error
            title="An error occurred!"
            message={errorUpdatingPlaces.message}
            onConfirm={handleError}
          />
        )}
      </Modal>

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error && <Error title="An error occurred!" message={error.message} />}
        {!error && (
          <Countries
            title="I'd like to visit ..."
            fallbackText="Select the countries you would like to visit below."
            isLoading={isFetching}
            loadingText="Fetching your countries..."
            countries={userCountries}
            onSelectCountry={handleStartRemovePlace}
          />
        )}

        <AvailableCountries onSelectCountry={handleSelectCountry} />
      </main>
    </>
  );
}

export default App;