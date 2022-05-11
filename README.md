# matching

## usecase

- user
  - query
    - me
    - user
    - users
    - receiveLikeUsers
    - sendLikeUsers
  - mutation
    - createUser
    - updateUserProfile
    - updateUserLastAccess
- like
  - mutation
    - createLike
    - cancelLike
    - skipLike
    - matchLike
- messageRoom
  - query
    - newMessageRooms
    - openMessageRooms
    - messageRoom
    - message
  - mutation
    - createMessageRoom
    - createMessage

## index

- userIndex
- user
  - likeIndex
