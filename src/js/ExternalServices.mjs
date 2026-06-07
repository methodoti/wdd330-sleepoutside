const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  let jsonResponse;
  try {
    jsonResponse = await res.json();
  } catch (err) {
    jsonResponse = { message: res.statusText || 'Unexpected server response' };
  }

  if (res.ok) {
    return jsonResponse;
  }

  throw { name: 'servicesError', message: jsonResponse };
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
