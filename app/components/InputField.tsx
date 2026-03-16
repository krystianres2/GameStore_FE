
type InputFieldProps = {
  label: string;
  type?: string;
//   register: any;
//   name: string;
//   defaultValue?: string;
// //   error?: FieldError;
//   inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const InputField = ({
  label,
  type = "text",
//   register,
//   name,
//   defaultValue,
//   inputProps,
}: InputFieldProps) =>{
    return(
        <div className="w-full">
            
            <input type={type} className="grow" />
       </div>
    )
}