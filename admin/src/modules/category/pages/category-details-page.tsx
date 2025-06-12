import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";
import { useParams } from "react-router-dom";
import type { UploadFile } from "antd/es/upload/interface";
import { toast } from "react-toastify";
import { RootState } from "@/store";
import { categoriesActions } from "../store/categories-slice";
import { Category } from "../types";
import CategoryForm from "../components/CategoryForm";
import SkeletonCategoryForm from "../components/SkeletonCategoryForm";
export default function CategoryDetailsPage() {
    const params = useParams();
    const dispatch = useDispatch();
    const { categoryDetail, isDetailLoading } = useSelector((state: RootState) => state.categories)
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    useEffect(() => {
        if (params.slug) {
            dispatch(categoriesActions.fetchCategoryDetailRequest(params.slug));
        }
    }, [dispatch, params.slug])
    useEffect(() => {
        if (categoryDetail) {
            form.setFieldsValue({
                ...categoryDetail
            })
        }
    }, [categoryDetail, form])
    if (isDetailLoading) {
        return <SkeletonCategoryForm />
    }
    if (!categoryDetail) {
        return (
            <div className="p-8 text-center text-red-500">
                Không tìm thấy danh mục!
            </div>
        )
    }
    const handleSave = async (values: Category) => {
        try {
            await dispatch(categoriesActions.updateCategoryRequest({ slug: params.slug, category: values }));
        } catch {
            toast.error("Có lỗi xảy ra khi cập nhật!");
        }
    };
    return (
        <CategoryForm
            initialValues={categoryDetail}
            onSubmit={handleSave}
            mode="edit"
            fileList={fileList}
            setFileList={setFileList}
        />
    )
}
