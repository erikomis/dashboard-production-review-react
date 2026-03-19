import { useCreateReviewModel } from "./create-review.model";
import { CreateReviewView } from "./create-review.view";

const CreateReviewPage = () => {
  const methods = useCreateReviewModel();
  return <CreateReviewView {...methods} />;
};

export default CreateReviewPage;
