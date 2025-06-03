import { Button } from '@/components/ui/button';
import { FaCirclePlus } from 'react-icons/fa6';

export const JobsInteract = () => {
  return (
    <div className="w-full h-auto mt-2">
      <div className=" w-full flex justify-end items-center">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear cursor-pointer">
          <FaCirclePlus />
          <span>Create Job</span>
        </Button>
      </div>
    </div>
  );
};
