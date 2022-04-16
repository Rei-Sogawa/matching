import { Dialog, Transition } from "@headlessui/react";
import classNames from "classnames";
import { head } from "lodash-es";
import { ChangeEventHandler, FC, Fragment, useEffect, useRef, useState } from "react";
import { Field, Form } from "react-final-form";

import useObjectURL from "../../hooks/useObjectURL";
import { Modal } from "../base/Modal";
import { CropImageModal } from "../case/CropImageModal";

const useImageInput = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File>();

  const onClick = () => {
    inputRef.current?.click();
  };
  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = head(e.target.files);
    setFile(file);
  };

  return {
    inputRef,
    file,
    setFile,
    onClick,
    onChange,
  };
};

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

  const { inputRef, file, setFile, onClick, onChange } = useImageInput();

  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const { objectURL, setObject } = useObjectURL(null);

  useEffect(() => {
    setObject(file ?? null);
  }, [file]);

  const onOk = (file: File) => {
    setFile(file);
    onClose();
  };

  return (
    <Form
      initialValues={initialValues}
      validate={validate}
      onSubmit={(v) => {
        return;
        onSubmit(v);
      }}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Your Photo</span>
            </label>
            <input type="file" accept="image/*" hidden ref={inputRef} onChange={onChange} />

            {file && objectURL ? (
              <div className="flex flex-col space-y-2">
                <img src={objectURL} style={{ width: "250px", height: "350px" }} className="rounded-md object-cover" />
                <button type="button" className="self-start btn btn-xs btn-ghost btn-active" onClick={onOpen}>
                  Crop Your Photo
                </button>
                <button type="button" className="self-start btn btn-xs btn-ghost btn-active" onClick={onClick}>
                  Pick Your Photo
                </button>
                <CropImageModal file={file} isOpen={isOpen} onClose={onClose} onOk={onOk} />
              </div>
            ) : (
              <button type="button" className="self-start btn btn-xs btn-ghost btn-active" onClick={onClick}>
                Pick Your Photo
              </button>
            )}
          </div>

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
                  autoComplete="on"
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
                  autoComplete="on"
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
                  autoComplete="on"
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
