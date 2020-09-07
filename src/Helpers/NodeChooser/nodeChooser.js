// import all the node types here
import TextNode from "../../components/NodeCard/types/TextNode"

export default function nodeChooser(type) {
    switch (type) {
        case "text":
            return TextNode;
        default:
            return TextNode;
    }
}