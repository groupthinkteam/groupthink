function linksFromText(string) {
    const regexp = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;
    const str = string;
    const array = [...str.match(regexp)];
    return array
}
