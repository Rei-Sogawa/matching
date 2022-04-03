import { FC } from "react";
import { Link } from "react-router-dom";

import { LogInForm } from "../components/sign-up/LogInForm";
import { routes } from "../routes";

export const LogIn: FC = () => {
  return (
    <div className="h-screen bg-gray-50">
      <div className="max-w-sm mx-4 sm:mx-auto py-20">
        <div className="text-center font-bold text-2xl">Matching!</div>
        <LogInForm
          onSubmit={(v) => {
            console.log(v);
            return Promise.resolve();
          }}
        />
        <div className="mt-4 ml-1 flex flex-col space-y-1">
          <Link className="link link-primary" to={routes["/sign-up"].path()}>
            Sign Up
          </Link>
          <Link className="link link-primary" to={routes["/"].path()}>
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};
