import OnlineVideoCard from "./types/OnlineVideoCard";
import ImagesCard from "./types/ImagesCard";
import FilesCard from "./types/FilesCard";
import VideosCard from "./types/VideoCard";
import AudioCard from "./types/AudioCard";
import LinkCard from "./types/LinkCard";
import TextCard from "./types/TextCard";
import BlankCard from "./types/BlankCard";
import TodoCard from "./types/TodoCard";

/**
 * audio/mpeg - audio
 * text/javascript - file
 * image/png - image
 * application/v.oandsis.opendocument.text - file
 * application/pdf - pdf
 * video/mp4 - video
 * @param {*} type 
 * @param {*} content 
 */
// returns a CardType component based on "type"
export default function cardChooser(type) {
    switch (type) {
        case "blank":
            return BlankCard;
        case "text":
            return TextCard;
        case "todo":
            return TodoCard;
        case "VideoLink":
            return OnlineVideoCard;
        case "video":
            return VideosCard;
        case "VideoFile":
            return VideosCard
        case "image":
            return ImagesCard;
        case "audio":
            return AudioCard;
        case "link":
            return LinkCard;
        case "file":
            return FilesCard;
        default:
            return BlankCard;
    }
}