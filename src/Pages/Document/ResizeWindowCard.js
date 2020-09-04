export const resizableWindow = (el,state) =>
{
    if(state.cardInfo!= null)
                {
                    if((state.cardInfo.y+state.cardInfo.height)>window.innerHeight)
                    {
                        window.innerHeight = window.innerHeight + state.cardInfo.height;
                        el.style.height = `${window.innerHeight}px`
                    }
                    if((state.cardInfo.x+state.cardInfo.width)>window.innerWidth)
                    {
                        window.innerWidth = window.innerWidth + state.cardInfo.width;
                        el.style.width = `${window.innerWidth}px`;
                    }
                  //console.log("Runned Condition ",window.innerHeight,window.innerWidth,state.cardInfo)
                  //-------- Scroll on CO-ordinate -----
                  //window.scroll(state.cardInfo.x,state.cardInfo.y);          
                    if(window.innerHeight >state.initialHeight && state.cardInfo.old_y > state.cardInfo.y) 
                    {
                        window.innerHeight = window.innerHeight - state.cardInfo.height;
                        el.style.height = `${window.innerHeight}px`
                    }
                    if(window.innerWidth >state.initialWidth && state.cardInfo.old_x > state.cardInfo.x)
                    {
                        window.innerWidth = window.innerWidth - state.cardInfo.width;
                        el.style.width = `${window.innerWidth}px`  ;
                    }
                }
                else 
                {
                  el.style.height = `${window.innerHeight}px`;
                  el.style.width = `${window.innerWidth}px`;
                  //console.log("Runned Else Condition ",window.innerHeight,window.innerWidth)
                }
}