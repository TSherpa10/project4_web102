import "./BanList.css";

/* eslint-disable react/prop-types */
const BanList = (props) => {
  const handleClick = (itemToRemove) => {
    props.onRemove(itemToRemove);
  };

  return (
    <div className="banlist">
      <h3>Banned queries ❌</h3>
      {props.array &&
        props.array.map((query) => (
          <button key={query} onClick={() => handleClick(query)}>
            <h3>{query}</h3>
          </button>
        ))}
    </div>
  );
};

export default BanList;
