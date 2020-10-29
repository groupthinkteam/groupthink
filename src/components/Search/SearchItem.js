import React from 'react';
const SearchedItem = (props) => {
    return (
        <div className={props.className}>
            {
                Object.entries(props.results.result).map(([_, val]) =>
                    <div key={_}>

                        <span className="container" style={{ columns: 2 }}>ID:{val.id}</span>
                        <span>
                            Field : {val.match[val.terms[0]][0]}
                        </span>
                        <hr />
                    </div>
                )
            }
        </div>
    )
}
export default SearchedItem;