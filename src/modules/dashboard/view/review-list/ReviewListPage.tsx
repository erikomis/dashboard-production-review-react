import { useReviewListModel } from "./review-list.model";
import { ReviewListView } from "./review-list.view";

const ReviewListPage = () => {
  const methods = useReviewListModel();
  return <ReviewListView {...methods} />;
};

export default ReviewListPage;
