import { gql } from "@apollo/client";

gql`
  fragment UserLikedItem on User {
    id
    gender
    nickName
    age
    livingPref
    topPhotoUrl
  }
`;
