const getInfo = (header, returnState, returnIndex) => {
    fetch(`${import.meta.env.VITE_BACKEND_LINK}${header}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Parse JSON data from the response
    })
    .then((data) => {
      // Handle successful response
      if(returnIndex != null) {
        returnState(data[returnIndex]);
      }
      else {
        returnState(data);
      }
    });
};

export default getInfo;
