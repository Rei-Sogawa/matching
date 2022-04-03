import { FC } from "react";
import { Field, Form } from "react-final-form";

type FormValues = {
  email: string;
  password: string;
};

type LogInFormProps = {
  onSubmit: (values: FormValues) => Promise<void>;
};

export const LogInForm: FC<LogInFormProps> = ({ onSubmit }) => {
  const initialValues: FormValues = { email: "", password: "" };

  return (
    <Form
      initialValues={initialValues}
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

          <button type="submit" className="w-full mt-4 btn">
            Log In
          </button>
        </form>
      )}
    />
  );
};
