export const CARDS_QUERY = `
query CardsQuery {
  cards {
    title
    imageUrl
    url
  }
}
`;

export const CARD_QUERY = `
query CardQuery($id:String!, $size: SizeOption) {
  card(input: {
    cardId: $id,
    size: $size
  }) {
    title
    size
    availableSizes {
      id
      title
    }
    imageUrl
    price
    pages {
      title
      width
      height
      imageUrl
    }
  }
}
`;
