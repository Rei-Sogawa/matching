import { gql } from "@apollo/client";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";

import { SignUpForm } from "../components/domain/SignUpForm";
import { SignUpInput, useSignUpMutation } from "../graphql/generated";
import { routes } from "../routes";

gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      id
      ...UserForMe
    }
  }
`;

export const SignUp: FC = () => {
  const navigate = useNavigate();

  const [mutate] = useSignUpMutation();
  const signUp = async ({ displayName, email, password }: SignUpInput) => {
    await mutate({ variables: { input: { displayName, email, password } } });
    await signInWithEmailAndPassword(getAuth(), email, password);
    navigate(routes["/"].path());
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-sm mx-4 sm:mx-auto py-8">
        <div className="text-center font-bold text-2xl">Matching!</div>
        <SignUpForm onSubmit={signUp} />
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
