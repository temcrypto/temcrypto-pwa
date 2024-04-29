// Inspired on https://github.com/gpxl-dev/truncate-eth-address
// Code assisted by Claude 3 Sonnet, an AI assistant created by Anthropic

/**
 * Shortens an Ethereum address to a user-defined format.
 *
 * @param address - The Ethereum address to shorten.
 * @param numDigits - The number of digits to show at the start and end of the shortened address.
 * @returns The shortened address in the format "0x<start>…<end> or the received address if is not valid".
 */
export default function shortenAddress(
  address: string,
  numDigits: number = 4
): string {
  const truncateRegexStr = `^(0x[a-zA-Z0-9]{${numDigits}})[a-zA-Z0-9]+([a-zA-Z0-9]{${numDigits}})$`;
  const match = address.match(new RegExp(truncateRegexStr));
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
}
