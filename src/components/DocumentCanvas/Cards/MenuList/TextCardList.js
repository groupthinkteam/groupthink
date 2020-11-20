import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import PopperMenu from '../../../PopperMenu/PopperMenu'
import { useStore } from '../../../../store/hook';

const TextCardList = (props) => {
    const store = useStore();
    const cardId = props.id;
    const [showPopper, setShowPopper] = useState(false)
    const citeButtonRef = useRef(null)
    const convLinks = (citationStyle) => {
        props.setShowLoader(true)
        // TODO if bool is false, the operation failed, show error
        store.convertLinksToCitation(cardId, citationStyle, (bool) => props.setShowLoader(false))
    }
    return (
        <div>
                <button ref={citeButtonRef} onClick={() => setShowPopper(!showPopper)}>Citations</button>
            <PopperMenu
                buttonref={citeButtonRef}
                position="right-start"
                offset={[0, 13]}
                tooltipclass="tooltips"
                arrowclass="arrow"
                showpopper={showPopper}//{store.currentActive === props.id}
                zIndex={1}
            >
                <div><button
                        onClick={() => convLinks("apa")}
                    >
                        APA Style
                    </button>
                    <button
                        onClick={() => convLinks("vancouver")}
                    >
                        Vancouver Style
                    </button>
                    <button
                        onClick={() => convLinks("harvard1")}
                    >
                        Harvard Style
                    </button></div>
            </PopperMenu>
            <hr />
             

        </div>
    )
}
export default observer(TextCardList);