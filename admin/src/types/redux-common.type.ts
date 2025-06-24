export interface ApiOperationStatus {
  loading: boolean;
  success: boolean;
}

export interface BaseLoadingState {
  loadingList: boolean;
  loadingSingle: boolean;
}

export interface BaseApiState {
  loadingList: boolean;
  loadingSingle: boolean;
  create: ApiOperationStatus;
  update: ApiOperationStatus;
  deletion: ApiOperationStatus;
  partialUpdate: ApiOperationStatus;
}
