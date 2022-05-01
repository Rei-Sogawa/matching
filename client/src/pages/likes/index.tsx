// import { gql } from "@apollo/client";
// import { Box, Center, HStack, IconButton, Spinner, Stack } from "@chakra-ui/react";
// import { FC, useEffect, useMemo, useState } from "react";
// import { BiDislike, BiLike } from "react-icons/bi";
// import { useNavigate } from "react-router-dom";

// import { SwipeCardItem } from "../../components/case/SwipeCardItem";
// import { SwipeCardItemWrapper } from "../../components/case/SwipeCardItemWrapper";
// import { SwipeLikeBadge } from "../../components/case/SwipeLikeBadge";
// import { SwipeNopeBadge } from "../../components/case/SwipeNopeBadge";
// import { UserSwipeCard } from "../../components/domain/UserSwipeCard";
// import { UserForUserSwipeCardFragment, useUsersForLikesQuery } from "../../graphql/generated";
// import { useSwipeItems } from "../../hooks/useSwipeItems";
// import { routes } from "../../routes";

// gql`
//   query UsersForLikes {
//     users {
//       id
//       ...UserForUserSwipeCard
//     }
//   }
// `;

// const useUsers = () => {
//   const { data, loading } = useUsersForLikesQuery();
//   const users = data?.users ?? [];
//   return { loading, users };
// };

// type LikePageTemplateProps = {
//   users: UserForUserSwipeCardFragment[];
// };

// const LikePageTemplate: FC<LikePageTemplateProps> = ({ users }) => {
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     setTimeout(() => setLoading(false), 1_500);
//   }, []);

//   const [liked, setLiked] = useState(false);
//   const [noped, setNoped] = useState(false);

//   const onLike = () => {
//     console.log("onLike");
//     setLiked(true);
//     setTimeout(() => {
//       setLiked(false);
//     }, 500);
//   };

//   const onNope = () => {
//     console.log("onNope");
//     setNoped(true);
//     setTimeout(() => {
//       setNoped(false);
//     }, 500);
//   };

//   const onEnd = () => {
//     console.log("onEnd");
//     setTimeout(() => {
//       navigate(routes["/"].path());
//     }, 500);
//   };

//   const {
//     toRight: toLike,
//     toLeft: toNope,
//     doRight: doLike,
//     doLeft: doNope,
//     swipeItems,
//     bind,
//     style,
//   } = useSwipeItems({
//     length: users.length,
//     onRight: onLike,
//     onLeft: onNope,
//     onEnd,
//   });

//   return (
//     <>
//       <Stack position="relative" h="full" justifyContent="center" hidden={loading}>
//         <Box h="70%" w="full" position="relative">
//           {swipeItems.map(({ x, y, rot }, i) => (
//             <SwipeCardItemWrapper key={i} style={{ x, y }}>
//               <SwipeCardItem {...bind(i)} style={style(rot)}>
//                 <UserSwipeCard user={users[i]} />
//               </SwipeCardItem>
//             </SwipeCardItemWrapper>
//           ))}
//         </Box>

//         <HStack alignSelf="center" h="20%" spacing="8">
//           <IconButton w="20" h="20" fontSize="2xl" isRound icon={<BiDislike />} aria-label="dislike" onClick={doNope} />
//           <IconButton
//             w="20"
//             h="20"
//             fontSize="2xl"
//             isRound
//             colorScheme="primary"
//             icon={<BiLike />}
//             aria-label="like"
//             onClick={doLike}
//           />
//         </HStack>

//         {(toLike || liked) && <SwipeLikeBadge />}
//         {(toNope || noped) && <SwipeNopeBadge />}
//       </Stack>

//       <Center h="full" hidden={!loading}>
//         <Spinner size="lg" />
//       </Center>
//     </>
//   );
// };

// export const LikesPage: FC = () => {
//   const { loading, users } = useUsers();

//   const cache = useMemo(
//     () => users.flatMap((user) => user.photoUrls).map((url) => <img key={url} src={url} style={{ display: "none" }} />),
//     [users]
//   );

//   return loading ? null : (
//     <>
//       {cache}
//       <LikePageTemplate users={users} />
//     </>
//   );
// };

import { FC } from "react";

export const LikesPage: FC = () => {
  return null;
};
