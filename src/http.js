export async function fetchAvailableCountrys()
{
    const response = await fetch('http://localhost:3000/countrys')
      const resData = await response.json()
      if(!response.ok)
      {
        throw new Error('Falied to fetch places');
      }
      return resData.places;
}
export async function fetchUserPlaces()
{
    const response = await fetch('http://localhost:3000/user-places-to-visit')
      const resData = await response.json()
      if(!response.ok)
      {
        throw new Error('Falied to fetch user places');
      }
      return resData.places;
}
export async function updateUserPlaces(places)
{
    const response = await fetch('http://localhost:3000/user-places-to-visit',{
      method:'PUT',
      body: JSON.stringify({places}),
      headers:{
        'Content-Type':'application/json'
      }
    })
      const resData = await response.json()
      if(!response.ok)
      {
        throw new Error('Falied to update user places');
      }
      return resData.message;
}