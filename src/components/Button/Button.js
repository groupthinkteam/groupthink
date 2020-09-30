import React from 'react'

const Button = ({handleClick, children , className , style}) => {
  return (
    <button onClick={handleClick} className={className} style={style}>{children}</button>
  )
}
export default React.memo(Button);
