import { useEffect, useRef } from "react";
import { Card, Form, Input, List, Button, Skeleton } from "antd";
import { CandidateReview } from "../types";
import dayjs from "dayjs";
export default function CandidateReviewsSection({
  candidateReviews,
  loadingCandidateReviews,
  setMore,
  paginationState,
}: {
  candidateReviews: CandidateReview[];
  loadingCandidateReviews: boolean;
  setMore: (more: number) => void;
  paginationState?: { page: number; perPage: number; total?: number };
}) {
  const listRef = useRef<HTMLDivElement>(null);

  const handleLoadMore = () => {
    setMore(paginationState!.page + 1);
  };

  useEffect(() => {
    if (
      candidateReviews.length < (paginationState?.total || 0) &&
      listRef.current &&
      listRef.current.scrollHeight <= listRef.current.clientHeight + 50
    ) {
      handleLoadMore();
    }
  }, [candidateReviews.length]);

  return (
    <Card title="Đánh giá nội bộ" className="mt-6">
      <div className="max-h-80 overflow-auto mb-4 pr-2">
        <Skeleton
          loading={loadingCandidateReviews}
          active
          paragraph={{ rows: 4 }}
        >
          <div className="max-h-64 overflow-y-auto mb-4 pr-2" ref={listRef}>
            <List
              dataSource={candidateReviews}
              locale={{ emptyText: "Chưa có đánh giá nào" }}
              renderItem={(item, index) => (
                <List.Item key={index} className="!p-2">
                  <div className="bg-gray-100 rounded-lg p-2 w-full shadow-sm flex justify-between">
                    <p className="text-sm mb-1 whitespace-pre-line">
                      {item.feedback}
                    </p>
                    <p className="text-xs text-gray-500 text-right">
                      {dayjs(item.createdAt).format("HH:mm DD/MM/YYYY")}
                    </p>
                  </div>
                </List.Item>
              )}
            />
          </div>

          {candidateReviews.length < (paginationState?.total || 0) && (
            <div className="text-center mt-4">
              <Button
                loading={loadingCandidateReviews}
                onClick={handleLoadMore}
              >
                Xem thêm đánh giá
              </Button>
            </div>
          )}
        </Skeleton>
      </div>

      <Form.Item name="feedback">
        <Input.TextArea
          rows={3}
          placeholder="Nhập đánh giá..."
          showCount
          maxLength={1000}
        />
      </Form.Item>
    </Card>
  );
}
