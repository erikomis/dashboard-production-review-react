import { Mail } from "lucide-react";
import { Input } from "../../../shared/components/input";
import { Label } from "../../../shared/components/label";

export const CreateCategory = () => {
  return (
    <div className="flex flex-col gap-10 overflow-auto">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <form>
          <Input
           
            color="primary"
            name="username"
            id="email"
            type="text"
            autoComplete="username"
            placeholder="Enter your email"
            icon={<Mail size={24} />}
            children={<Label value="Username:" htmlFor="email" />}
          
          />
        </form>
      </div>
    </div>
  );
};
