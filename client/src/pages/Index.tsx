import { getAuth, signOut } from "firebase/auth";
import { FC } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../contexts/Auth";
import { useMeQuery } from "../graphql/generated";
import { AppLayout } from "../layouts/AppLayout";
import { routes } from "../routes";

export const Index: FC = () => {
  const { uid } = useAuth();
  const { data } = useMeQuery({ skip: !uid });

  const logOut = async () => {
    await signOut(getAuth());
  };

  return (
    <AppLayout>
      <div className="h-full bg-gray-50 flex flex-col justify-center items-center">
        <div className="font-bold text-2xl">{data?.me.displayName || "Not Logged In"}</div>
        <div className="flex space-x-2">
          {uid ? (
            <>
              <Link to={routes["/likes"].path()} className="link link-primary">
                Likes
              </Link>
              <Link
                to="#"
                className="link link-primary"
                onClick={async (e) => {
                  e.preventDefault();
                  await logOut();
                }}
              >
                LogOut
              </Link>
            </>
          ) : (
            <>
              <Link to={routes["/sign-up"].path()} className="link link-primary">
                SignUp
              </Link>
              <Link to={routes["/log-in"].path()} className="link link-primary">
                LogIn
              </Link>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};
