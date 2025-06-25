import { usePageMode } from "@/hooks/use-page-mode";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { candidateActions } from "../store/candidate-slice";
import { LocalSpinner } from "@/components/ui/local-spinner";
import PageInfo from "@/components/page-info";
import CandidateForm from "../components/candidate-form";
import { authActions } from "@/modules/auth/store/auth-slice";
import { hiringActions } from "@/modules/hiring/store/hiring-slice";

export default function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const {
    candidate,
    loadingSingle,
    partialUpdate,
    candidateReviews,
    loadingCandidateReviews,
    createCandidateReview,
    paginationCandidateReviews: paginationState,
  } = useAppSelector((state: RootState) => state.candidates);
  const { hiringDetail } = useAppSelector((state: RootState) => state.hiring);

  const { user } = useAppSelector((state: RootState) => state.auth);
  const mode: ENUM_PAGE_MODE = usePageMode();
  const [more, setMore] = useState(0);
  const isLoading = loadingSingle || partialUpdate.loading;
  useEffect(() => {
    if (id && mode === ENUM_PAGE_MODE.EDIT) {
      dispatch(candidateActions.getCandidateDetail({ candidateId: id }));
      dispatch(
        candidateActions.getCandidateReviews({
          candidate: id,
          more: more,
        })
      );
      dispatch(authActions.getUserProfile());
    }
  }, [id, mode, dispatch, more]);

  useEffect(() => {
    if (candidate?.hiring) {
      dispatch(hiringActions.getHiringDetail({ hiringId: candidate.hiring }));
    }
  }, [candidate?.hiring]);

  const pageName = useMemo(() => {
    switch (mode) {
      case ENUM_PAGE_MODE.EDIT:
        return "Chỉnh sửa ứng viên";
      case ENUM_PAGE_MODE.VIEW:
        return "Chi tiết ứng viên";
      default:
        return "Ứng viên";
    }
  }, [mode]);

  return (
    <div className="w-full min-h-full relative">
      {isLoading && <LocalSpinner text="Loading..." />}
      <div className="px-4 pt-3 pb-14 flex flex-col gap-3">
        <PageInfo name={pageName} />
        {!candidate && mode === ENUM_PAGE_MODE.EDIT ? (
          <h2 className="text-center text-lg">Không tìm thấy ứng viên</h2>
        ) : (
          <CandidateForm
            mode={mode}
            initialValue={candidate}
            candidateReviews={candidateReviews}
            loadingCandidateReviews={loadingCandidateReviews}
            setMore={setMore}
            user={user}
            paginationState={{
              page: more,
              perPage: (more + 1) * 10,
              total: paginationState?.total,
            }}
            hiringDetail={hiringDetail}
            createCandidateReview={createCandidateReview}
          />
        )}
      </div>
    </div>
  );
}
