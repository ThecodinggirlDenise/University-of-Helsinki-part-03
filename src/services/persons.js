import axios from "axios";

const baseUrl =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:3001/api/persons";

const getAll = () => {
  console.log("🔄 Fetching all persons...");
  return axios.get(baseUrl).then((res) => res.data);
};

const create = (newPerson) => {
  console.log("📤 Creating person:", newPerson);
  return axios.post(baseUrl, newPerson).then((res) => res.data);
};

const remove = (id) => {
  console.log(`🗑️ Deleting person with id: ${id}`);
  return axios.delete(`${baseUrl}/${id}`);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, remove };
