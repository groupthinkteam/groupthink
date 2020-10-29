import React from 'react';
/**
 * This Card Upload Image file & Shows the Image in Galllery
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id` 
 */
const ImagesCard = (props) => {
  const changeSize = (height, width) => {
    props.typeAPI.resize(props.id, { width: width, height: height })
  }
  return (
    <>
      {
        Object.entries(props.content).map(([key, val]) => {
          if (val?.height !== undefined) {
            const maxDimension = Math.max(val.height, val.width);
            const multiplier = maxDimension > 500 ? 500 / maxDimension : 1;
            return (
              <div key={key}>
                <img
                  alt={key}
                  src={`${val?.url}`}
                  height={`${Math.floor(val.height * multiplier)}px`}
                  width={`${Math.floor(val.width * multiplier)}px`}
                  onLoad={e => changeSize(Math.floor(val.height * multiplier) + 5, Math.floor(val.width * multiplier) + 5)}
                />

              </div>
            )
          }
          else
            return null;
        })
      }
    </>
  )
}
export default React.memo(ImagesCard);
