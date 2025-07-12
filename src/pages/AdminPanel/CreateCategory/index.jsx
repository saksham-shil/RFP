import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../../Layout/PageLayout';
import api from '../../../services/api';

const CreateCategory = () => {
    const crumbLinks = [
        { name: 'Home', link: '/admin' },
        { name: 'Category', link:'/admin/categories' },
        { name: 'Create'}
    ]

    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            name: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Category name is Required."),
        }),
        onSubmit: async(values) => {
            try {
                const res = await api.post('/api/categories', {name:values.name});
                console.log(res);
                if (res.data.response === 'success') {
                    toast.success('Category created successfully');
                    navigate('/admin/categories');
                } else {
                    toast.error(res.data.error);
                }
            } catch (error) {
                toast.error('An error occurred while creating the Category.');
                console.error(error);
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    return (
        <PageLayout title={`Create New Category`} crumbs={crumbLinks}>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="TableHeader">
                                <div className="row justify-content-between align-items-center">
                                    <div className="col-auto">
                                        <form onSubmit={formik.handleSubmit} className="mt-3">
                                            <div className="row">
                                                <div className="col-md-12 mb-3">
                                                    <label htmlFor="name" className="form-label">Name*</label>
                                                    <input id="name" name="name" type="text" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name} />
                                                    {formik.touched.name && formik.errors.name? <div className="text-danger mt-1">{formik.errors.name}</div> : null}
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between mt-4">
                                                <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                                                    {isSubmitting ? "Submitting..." : "Submit"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default CreateCategory;