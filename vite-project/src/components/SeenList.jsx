import "./SeenList.css";

/* eslint-disable react/prop-types */
const SeenList = (props) => {
  return (
    <div className="seenlist">
      <h3>Captured doggos 🦮</h3>
      {props.array &&
        props.array.map(([image, description], index) => (
          <div key={index}>
            <img src={image} alt="" className="seenlist-img" />
            <h3>{description}</h3>
          </div>
        ))}
    </div>
  );
};

export default SeenList;
