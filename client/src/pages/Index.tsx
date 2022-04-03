import { getAuth, signOut } from "firebase/auth";
import { FC } from "react";
import { Link } from "react-router-dom";

import { AppLayout } from "../components/layouts/AppLayout";
import { useAuth } from "../contexts/Auth";
import { useMeQuery } from "../graphql/generated";
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
          <Link to={routes["/sign-up"].path()} className="link link-primary">
            Sign Up
          </Link>
          <Link to={routes["/log-in"].path()} className="link link-primary">
            Log In
          </Link>
          <Link
            to="#"
            className="link link-primary"
            onClick={async (e) => {
              e.preventDefault();
              await logOut();
            }}
          >
            Log Out
          </Link>
        </div>
      </div>
    </AppLayout>
  );
};
