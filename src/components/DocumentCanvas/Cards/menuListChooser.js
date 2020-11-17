import ImageCardList from "./MenuList/ImageCardList";
import TextCardList from "./MenuList/TextCardList";
import OnlineVideoCardList from "./MenuList/OnlineVideoCardList";
import VideoCardList from './MenuList/VideoCardList';
import LinkCardList from "./MenuList/LinkCardList";
import FileCardList from './MenuList/FileCardList';
import AudioCardList from './MenuList/AudioCardList';
export default function menuListChooser(type) {
    switch (type) {
        case "text":
            return TextCardList;
        case "todo":
            return 'TodoCard';
        case "VideoLink":
            return OnlineVideoCardList;
        case "VideoFile":
            return VideoCardList;
        case "image":
            return ImageCardList;
        case "audio":
            return AudioCardList;
        case "link":
            return LinkCardList;
        case "file":
            return FileCardList;
        default:
            return 'BlankCard';
    }
}