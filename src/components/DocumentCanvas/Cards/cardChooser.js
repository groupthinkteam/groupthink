import YoutubeCard from "./types/YoutubeCard";
import PDFCard from "./types/PDFCard";
import ImagesCard from "./types/ImagesCard";
import FilesCard from "./types/FilesCard";
import VideosCard from "./types/VideoCard";
import AudiosCard from "./types/AudioCard";
import LinkCard from "./types/LinkCard";
import TextCard from "./types/TextCard";
import BlankCard from "./types/BlankCard";

// returns a CardType component based on "type"
export default function cardChooser(type) {
    console.log(type)
    return AudiosCard
    // switch (type) {
    //     case "blank":
    //         return BlankCard;
    //     case "text":
    //         return TextCard;
    //     case "onlineVideo":
    //         return YoutubeCard;
    //     case "offlineVideo":
    //         return VideosCard;
    //     case "image":
    //         return ImagesCard;
    //     case "audio":
    //         return AudiosCard;
    //     case "link":
    //         return LinkCard;
    //     case "pdf":
    //         return PDFCard;
    //     case "file":
    //         return FilesCard;
    //     default:
    //         return BlankCard;
    // }
}