export default function linkify(inputText) {
    
    let replacedText, replacePattern1, replacePattern2, replacePattern3;

    // URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: blue; text-decoration: underline;">$1</a>');

    // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank" rel="noopener noreferrer" style="color: blue; text-decoration: underline;">$2</a>');

    // Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-.])+@[a-zA-Z0-9\-]+(\.[a-zA-Z0-9\-]+)*(\.[A-Za-z]{2,}))/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1" style="color: blue; text-decoration: underline;">$1</a>');

    return replacedText;
}
