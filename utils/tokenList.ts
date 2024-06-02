// This is a subset of https://api-polygon-tokens.polygon.technology/tokenlists/polygonPopular.tokenlist.json
// TODO: Improve this to get from the API or cache
import supportedTokenList from '../tokenlist.json';

export type SupportedToken = (typeof supportedTokenList)[0];

export default supportedTokenList;
