const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  // Extract and wait for the response body converted in JS object
  const data = await res.json();
  // console.log(data);

  if (res.ok) {
    // if the res object is ok: return the data object
    return data;
  } else {
    // if data object is not ok: send the response body: name and message
    throw { name: 'servicesError', message: data };
  }

  // old stuff
  // if (res.ok) {
  //   return res.json();
  // } else {
  //   throw new Error('Bad Response');
  // }
}

export default class ExternalServices {
  constructor(category) {
    // this.category = category;
    // this.path = `/json/${this.category}.json`;
  }
  async getData(category) {
    // return fetch(this.path)
    //   .then(convertToJson)
    //   .then((data) => data);
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  // A function that sends a POST request to the server with the order data to process a checkout.
  async checkout(orderObject) {
    // Send a POST request to the server with the order data in the body, as JSON, and the needed options for a POST request.
    const response = await fetch(`${baseURL}checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderObject),
    });
    // Convert the response to JSON and return it.
    const data = await convertToJson(response);
    return data;
  }
}
