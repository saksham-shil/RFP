import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import VendorPageLayout from '../../../Layout/VendorPageLayout';

const Quote = () => {
    const { rfp_id } = useParams();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const crumbLinks = [
        { name: 'Home', link: '/vendor' },
        { name: 'RFPs', link: '/vendor/rfp-for-quote' },
        { name: 'Apply' }
    ];

    const formik = useFormik({
        initialValues: {
            vendorPrice: '',
            itemDescription: '',
            quantity: 1,
            totalCost: '',
        },
        validationSchema: Yup.object({
            vendorPrice: Yup.number().typeError("Price must be a number.").positive('Price must be positive.').required('Vendor price is required.'),
            itemDescription: Yup.string().required('Item description is required.'),
            quantity: Yup.number().typeError("Quantity must be a number.").min(1, 'Quantity must be at least 1.').required('Quantity is required.'),
            totalCost: Yup.number().typeError("Total cost must be a number.").positive('Total cost must be positive.').required('Total cost is required.'),
        }),
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                const res = await api.post(`/api/rfp/apply/${rfp_id}`, {
                    item_price: values.vendorPrice,
                    total_cost: values.totalCost,
                    _method: 'put',
                });
                if (res.data.response === 'success') {
                    toast.success('Quote submitted successfully!');
                    navigate('/vendor/rfp-for-quote');
                } else {
                    toast.error(res.data.error || 'Failed to submit quote.');
                }
            } catch (error) {
                toast.error('An error occurred while submitting the quote.');
                console.error(error);
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    return (
        <VendorPageLayout title="Submit a Quote" crumbs={crumbLinks}>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Apply for RFP</h4>
                            <p className="card-title-desc">Fill out the form below to submit your quote.</p>
                            <form onSubmit={formik.handleSubmit} className="mt-4">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="quantity" className="form-label">Quantity*</label>
                                        <input id="quantity" name="quantity" type="number" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.quantity} />
                                        {formik.touched.quantity && formik.errors.quantity ? <div className="text-danger mt-1">{formik.errors.quantity}</div> : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="vendorPrice" className="form-label">Your Price per Item*</label>
                                        <input id="vendorPrice" name="vendorPrice" type="number" step="0.01" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.vendorPrice} />
                                        {formik.touched.vendorPrice && formik.errors.vendorPrice ? <div className="text-danger mt-1">{formik.errors.vendorPrice}</div> : null}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="itemDescription" className="form-label">Item Description*</label>
                                    <textarea id="itemDescription" name="itemDescription" className="form-control" rows="4" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.itemDescription}></textarea>
                                    {formik.touched.itemDescription && formik.errors.itemDescription ? <div className="text-danger mt-1">{formik.errors.itemDescription}</div> : null}
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="totalCost" className="form-label">Total Cost*</label>
                                        <input id="totalCost" name="totalCost" type="number" step="0.01" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.totalCost} />
                                        {formik.touched.totalCost && formik.errors.totalCost ? <div className="text-danger mt-1">{formik.errors.totalCost}</div> : null}
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end mt-4">
                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                        {isSubmitting ? 'Submitting...' : 'Submit Quote'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </VendorPageLayout>
    );
};

export default Quote;
