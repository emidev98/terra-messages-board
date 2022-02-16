import "./Loader.scss";

interface Props {
    position?: "fixed" | "absolute";
}

export const Loader = (props: Props) => {
    const position =  props.position ? props.position : "absolute"; ;

    return (
        <div className="LoaderWrapper"  
            style={{position : position}}>
            <div className="Loader">
                <div className="LoaderAnimation">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <h2>Loading...</h2>
            </div>
        </div>
    );
}
