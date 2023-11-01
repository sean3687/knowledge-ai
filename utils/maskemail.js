export default function maskEmail(email) {
    if (typeof email !== 'string' || email.trim() === '') {
        // Handle invalid or empty email here
        return '';
    }

    let [localPart, domain] = email.split("@");
    let domainName = domain.split(".")[0];
    let domainExtension = domain.split(".")[1];

    let maskedLocalPart;
    let maskedDomainName;

    if (localPart.length <= 3) {
        // For emails with a local part of length <= 3, show the first two characters.
        maskedLocalPart = localPart.substring(0, 2) + "*";
    } else {
        // For longer local parts, show the first three characters followed by asterisks.
        maskedLocalPart = localPart.substring(0, 3) + "*".repeat(localPart.length - 3);
    }

    // Mask domain name except for the first character.
    maskedDomainName = domainName.substring(0, 1) + "*".repeat(domainName.length - 1);

    return `${maskedLocalPart}@${maskedDomainName}.${domainExtension}`;
}