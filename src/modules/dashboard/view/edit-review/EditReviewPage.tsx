import { useEditReviewModel } from "./edit-review.model";
import { EditReviewView } from "./edit-review.view";

const EditReviewPage = () => {
  const methods = useEditReviewModel();
  return <EditReviewView {...methods} />;
};

export default EditReviewPage;
