import OnlineVideoCard from "./types/OnlineVideoCard";
import PDFCard from "./types/PDFCard";
import ImagesCard from "./types/ImagesCard";
import FilesCard from "./types/FilesCard";
import VideosCard from "./types/VideoCard";
import AudioCard from "./types/AudioCard";
import LinkCard from "./types/LinkCard";
import TextCard from "./types/TextCard";
import BlankCard from "./types/BlankCard";

// returns a CardType component based on "type"
export default function cardChooser(type) {
    console.log(type)
    //return AudioCard
    switch (type) {
        case "blank":
            return BlankCard;
        case "text":
            return TextCard;
        case "VideoLink":
            return OnlineVideoCard;
        case "VideoFile":
            return VideosCard;
        case "image":
            return ImagesCard;
        case "audio":
            return AudioCard;
        case "link":
            return LinkCard;
        case "pdf":
            return PDFCard;
        case "file":
            return FilesCard;
        default:
            return BlankCard;
    }
}