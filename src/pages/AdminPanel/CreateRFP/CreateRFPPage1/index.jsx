import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';
import Select from 'react-select';
import api from '../../../../services/api';

const CreateRFPPage1 = ({ onNext, initialSelectedCategory }) => {
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const fetchCategories = async (signal) => {
            try {
                const res = await api.get('/api/categories', { signal });
                if (res.data.response === 'success') {
                    const categories = Object.values(res.data.categories);
                    const activeCategories = categories?.filter(cat => cat.status === 'Active');
                    const options = activeCategories?.map(cat => ({ value: cat.id, label: cat.name }));
                    setCategoryOptions(options);
                }
            } catch (error) {
                if (!axios.isCancel(error)) {
                    toast.error("Failed to fetch categories.");
                }
            } finally {
                setIsLoadingCategories(false);
            }
        };
        fetchCategories(controller.signal);
        return () => controller.abort();
    }, []);

    const formik = useFormik({
        initialValues: {
            category: initialSelectedCategory || null,
        },
        validationSchema: Yup.object({
            category: Yup.object().nullable().required("Please select a category."),
        }),
        onSubmit: (values) => {
            onNext(values.category);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="mt-3">
            <h5>Select Category</h5>
            <p className="text-muted">Choose the category for this RFP.</p>
            <div className="form-group">
                <Select
                    id="category"
                    name="category"
                    options={categoryOptions}
                    isLoading={isLoadingCategories}
                    className="basic-single"
                    classNamePrefix="select"
                    placeholder={isLoadingCategories ? "Loading categories..." : categoryOptions.length > 0 ? "Select a category..." : "Couldn't fetch Categories, refresh"}
                    onChange={selectedOption => {
                        formik.setFieldValue('category', selectedOption);
                    }}
                    value={formik.values.category}
                    onBlur={() => formik.setFieldTouched('category', true)}
                />
            </div>
            {formik.touched.category && formik.errors.category ? (
                <div className="alert alert-danger p-2 mt-2">{formik.errors.category}</div>
            ) : null}
            <div className="d-flex justify-content-end mt-4">
                <button type="submit" className="btn btn-primary" disabled={isLoadingCategories}>
                    Next <i className="mdi mdi-arrow-right"></i>
                </button>
            </div>
        </form>
    );
};

export default CreateRFPPage1;