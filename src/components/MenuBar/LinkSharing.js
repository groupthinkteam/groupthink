import React from "react";
import { Passers } from "prop-passer";
import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    WhatsappShareButton,
    PinterestShareButton,
    EmailShareButton,
  
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    WhatsappIcon,
    PinterestIcon,
    EmailIcon
} from 'react-share';

const LinkSharing = (props) => 
{
    const { url ,title , size } = props
    const ShareList = Passers({
        url,
        className: "network__share-button",
    })
    ({
        className: "network cursor-pointer hover transition--default",
        title: `Share ${url}`,
    })("li");
    return(
        <div className="social_link" >
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
                    windowWidth={1000}
                    windowHeight={730}
                >
                    <PinterestIcon size={size} />
                </PinterestShareButton>

                <EmailShareButton 
                    subject="Groupthink Web Link"
                    body={`Here is the link ${url}`}
                >
                    <EmailIcon size={size}/>
                </EmailShareButton>

            </ShareList>
        </div>
    )
}
export default LinkSharing;
