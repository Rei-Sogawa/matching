import classNames from "classnames";
import { FC } from "react";
import { Field, Form } from "react-final-form";

type FormValues = {
  email: string;
  password: string;
  confirm: string;
  displayName: string;
};

type SignUpFormProps = {
  onSubmit: (values: FormValues) => Promise<void>;
};

export const SignUpForm: FC<SignUpFormProps> = ({ onSubmit }) => {
  const initialValues: FormValues = { email: "", password: "", confirm: "", displayName: "" };

  const validate = (values: FormValues) => {
    let res = {};
    if (values.password !== values.confirm) res = { ...res, confirm: "Must match." };
    return res;
  };

  return (
    <Form
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Field name="email">
            {({ input }) => (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered input-primary"
                  placeholder="Email"
                  autoComplete="off"
                  required
                  {...input}
                />
              </div>
            )}
          </Field>

          <Field name="password">
            {({ input }) => (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered input-primary"
                  placeholder="Password"
                  required
                  {...input}
                />
              </div>
            )}
          </Field>

          <Field name="confirm">
            {({ input, meta }) => (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password Confirm</span>
                </label>
                <input
                  type="password"
                  className={classNames(
                    "input input-bordered",
                    meta.error && meta.touched ? "input-error" : "input-primary"
                  )}
                  placeholder="Password Confirm"
                  required
                  {...input}
                />
                {meta.error && meta.touched && <span className="ml-1 mt-2 text-sm text-red-600">{meta.error}</span>}
              </div>
            )}
          </Field>

          <Field name="displayName">
            {({ input }) => (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Display Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered input-primary"
                  placeholder="DisplayName"
                  required
                  {...input}
                />
              </div>
            )}
          </Field>

          <button type="submit" className="w-full mt-4 btn">
            Sign Up
          </button>
        </form>
      )}
    />
  );
};
