const Filter = ({ searchTerm, handleSearch }) => (
  <div>
    Filter names: <input value={searchTerm} onChange={handleSearch} />
  </div>
);

export default Filter; // ✅ Make sure it's default export
