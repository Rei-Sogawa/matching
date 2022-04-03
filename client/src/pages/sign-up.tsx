import { FC } from "react";
import { Link } from "react-router-dom";

import { SignUpForm } from "../components/sign-up/SignUpForm";
import { routes } from "../routes";

export const SignUp: FC = () => {
  return (
    <div className="h-screen bg-gray-50">
      <div className="max-w-sm mx-4 sm:mx-auto py-20">
        <div className="text-center font-bold text-2xl">Matching!</div>
        <SignUpForm
          onSubmit={(v) => {
            console.log(v);
            return Promise.resolve();
          }}
        />
        <div className="mt-4 ml-1 flex flex-col space-y-1">
          <Link className="link link-primary" to={routes["/log-in"].path()}>
            Log In
          </Link>
          <Link className="link link-primary" to={routes["/"].path()}>
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};
