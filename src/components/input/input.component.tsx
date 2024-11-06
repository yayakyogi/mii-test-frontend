import { HTMLProps, Ref, forwardRef } from "react";

interface InputProps extends HTMLProps<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef((props: InputProps, ref: Ref<HTMLInputElement>) => {
  const { label, error, ...inputProps } = props;

  return (
    <div className="mb-3">
      <label
        htmlFor="first_name"
        className="block mb-2 text-sm font-medium text-gray-500"
      >
        {label}
      </label>
      <input
        {...inputProps}
        ref={ref}
        id={label}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-3"
      />
      <span>{error}</span>
    </div>
  );
});

export default Input;
