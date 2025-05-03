import { GridLoader } from "react-spinners";

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

function Loading() {
    return (
        <div className="flex flex-col justify-center items-center text-2xl" 
        style={{ minHeight: "calc(100vh - 5rem)" }}>
            <GridLoader
                color={"#059669"}
                loading={true}
                cssOverride={override}
                size={80}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
            <h1>Loading data...</h1>
        </div>
    );
}

export default Loading