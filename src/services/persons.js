import axios from "axios";


  const baseUrl = "https://university-of-helsinki-part-03.onrender.com/api/persons";";

const getAll = () => axios.get(baseUrl).then((response) => response.data);
const create = (newObject) =>
  axios.post(baseUrl, newObject).then((response) => response.data);
const remove = (id) => axios.delete(`${baseUrl}/${id}`);

export default { getAll, create, remove };
