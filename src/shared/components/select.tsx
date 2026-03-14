import React, { useState } from "react";
import { cn } from "../utils/utils";
import { tv } from "tailwind-variants";

const selectVariants = tv({
  base: "relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
  //   variants: {
  //     color: {
  //       default: "bg-primary text-primary-foreground hover:bg-primary/90",
  //       destructive:
  //         "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  //       outline:
  //         "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  //       secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  //       ghost: "hover:bg-accent hover:text-accent-foreground",
  //       link: "text-primary underline-offset-4 hover:underline",
  //     },
  //     size: {
  //       default: "h-10 px-4 py-2",
  //       sm: "h-9 rounded-md px-3",
  //       xs: "h-6 rounded-md px-2 text-xs",
  //       lg: "h-11 rounded-md px-8",
  //       icon: "h-10 w-10",
  //     },

  //     defaultVariants: {
  //       color: "default",
  //       size: "default",
  //     },
  //   },
});

// export const Select = ({ children, color, sizeType, ...rest }: SelectProps) => {
//   return (
//     <select
//       {...rest}
//       className={cn(selectVariants({ size: sizeType, color }), rest.className)}
//     >
//       {children}
//     </select>
//   );
// };

// interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
//   children?: React.ReactNode;
//   Label?: React.ReactNode;
//   color?:
//     | "default"
//     | "destructive"
//     | "outline"
//     | "secondary"
//     | "ghost"
//     | "link";
//   sizeType?: "default" | "sm" | "xs" | "lg" | "icon";
// }

// export const SelectGroupOne = React.forwardRef< SelectProps>({ Label, children, ...rest }) => {
//   const [selectedOption, setSelectedOption] = useState<string>("");
//   const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

//   const changeTextColor = () => {
//     setIsOptionSelected(true);
//   };

//   return (
//     <div className="mb-4.5">
//       {/* <label className="mb-2.5 block text-black dark:text-white">Subject</label> */}
//       {Label}
//       <div className="relative z-20 bg-transparent dark:bg-form-input">
//         <select
//           {...rest}
//           value={selectedOption}
//           onChange={(e) => {
//             setSelectedOption(e.target.value);
//             changeTextColor();
//           }}
//           // className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${

//           // }`}

//           className={cn(
//             selectVariants(),
//             rest.className,
//             isOptionSelected ? "text-black dark:text-white" : ""
//           )}
//         >
//          {children}
//         </select>

//         <span className="absolute z-30 -translate-y-1/2 top-1/2 right-4">
//           <svg
//             className="fill-current"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <g opacity="0.8">
//               <path
//                 fillRule="evenodd"
//                 clipRule="evenodd"
//                 d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
//                 fill=""
//               ></path>
//             </g>
//           </svg>
//         </span>
//       </div>
//     </div>
//   );
// };

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children?: React.ReactNode;
  Label?: React.ReactNode;
  color?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  sizeType?: "default" | "sm" | "xs" | "lg" | "icon";
  error?: string;
}

export const SelectGroupOne = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ Label, children, ...rest }, ref) => {
    const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
    const handleChange = () => {
      setIsOptionSelected(true);
    };

    return (
      <div className="mb-4.5">
        {Label}
        <div className="relative z-20 bg-transparent dark:bg-form-input">
          <select
            {...rest}
            onChange={handleChange}
            className={cn(
              selectVariants(),
              "relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
              isOptionSelected ? "text-black dark:text-white" : "",
              rest.className
            )}
            ref={ref}
          >
            {children}
          </select>

          {rest.error && (
            <span className="my-2 text-xs font-bold t text-danger">
              {rest.error}
            </span>
          )}
          <span className="absolute z-30 -translate-y-1/2 top-1/2 right-4">
            <svg
              className="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.8">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                  fill=""
                ></path>
              </g>
            </svg>
          </span>
        </div>
      </div>
    );
  }
);
