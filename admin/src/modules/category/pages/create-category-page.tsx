import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useState } from "react";
import type { UploadFile } from "antd/es/upload/interface";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@/constants/router-path";
import { categoriesActions } from "../store/categories-slice";
import CategoryForm from "../components/CategoryForm";
import { Category } from "../types";
export default function CreateCategoryPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const handleSave = async (values: Category) => {
        try {
            await dispatch(categoriesActions.createCategoryRequest({ category: values }));
            setTimeout(() => {
                navigate(ROUTER_PATH.CATEGORY);
            }, 350);

        } catch {
            toast.error("Có lỗi xảy ra khi tạo!");
        }
    };
    return (
        <CategoryForm
            onSubmit={handleSave}
            mode="create"
            fileList={fileList}
            setFileList={setFileList}
        />
    )
}
