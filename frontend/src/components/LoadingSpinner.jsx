import ClipLoader from "react-spinners/ClipLoader";

function LoadingSpinner() {
  return (
    <div className="loader">
      <ClipLoader color={"aliceblue"} size={50} />
    </div>
  );
}

export default LoadingSpinner;
