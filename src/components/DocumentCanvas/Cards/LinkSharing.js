import React from "react";
import { Passers } from "prop-passer";
import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    WhatsappShareButton,
    PinterestShareButton,
  
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    WhatsappIcon,
    PinterestIcon
} from "react-share";

const LinkSharing = (props) => 
{
    const {
        url = String(window.location),
        title = "GroupThink Website",
        shareImage = "https://www.steadylearner.com/static/images/brand/prop-passer.png",
        size = "2.5rem",
    } =props
    const ShareList = Passers({
        url,
        className: "network__share-button",
    })
    ({
        className: "network cursor-pointer hover transition--default",
        title: `Share ${url}`,
    })("li");
    return(
        <div style={{display: "inline-flex"}}>
            <ShareList>
                <FacebookShareButton
                    quote={title}
                >
                    <FacebookIcon
                    size={size}
                    />
                </FacebookShareButton>

                <TwitterShareButton
                    title={title}
                >
                    <TwitterIcon
                    size={size}
                    />
                </TwitterShareButton>

                <WhatsappShareButton
                    title={title}
                    separator=":: "
                >
                    <WhatsappIcon size={size} />
                </WhatsappShareButton>

                <LinkedinShareButton
                    title={title}
                    windowWidth={750}
                    windowHeight={600}
                >
                    <LinkedinIcon
                    size={size}

                    />
                </LinkedinShareButton>

                <PinterestShareButton
                    url={String(window.location)}
                    media={`${shareImage}`}
                    windowWidth={1000}
                    windowHeight={730}
                >
                    <PinterestIcon size={size} />
                </PinterestShareButton>

            </ShareList>
        </div>
    )
}
export default LinkSharing;
