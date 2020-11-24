export enum ErrorMessage {
  network = 'Unable to request resources required for query',
  cardPreviewGeneration = 'Unable to generate card for the options provided',
  missingTemplateForCard = 'No template is available for the card selected',
  missingPriceInformationForSize = 'No price information is available for the card size selected',
  cacheReadError = 'Unable to parse cached value for resource',
}
