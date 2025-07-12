import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';
import Select from 'react-select';
import api from '../../../../services/api';

const CreateRFPPage2 = ({ onBack, onSubmit, selectedCategory, isSubmitting }) => {
    const [vendorOptions, setVendorOptions] = useState([]);
    const [isLoadingVendors, setIsLoadingVendors] = useState(true);

    useEffect(() => {
        if (!selectedCategory || !selectedCategory.value) {
            toast.error("No category selected. Please go back.");
            setIsLoadingVendors(false);
            return;
        }

        const controller = new AbortController();
        const fetchVendors = async (signal) => {
            setIsLoadingVendors(true);
            try {
                const res = await api.get(`/api/vendorlist/${selectedCategory.value}`, { signal });
                if (res.data.response === 'success') {
                    const vendors = res.data.vendors
                    const options = vendors.map(vendor => ({
                        value: vendor.user_id,
                        label: vendor.name,
                    }));
                    setVendorOptions(options);
                } else {
                    toast.error("Could not load vendors.");
                }
            } catch (error) {
                if (!axios.isCancel(error)) {
                    toast.error("An error occurred while fetching vendors.");
                }
            } finally {
                setIsLoadingVendors(false);
            }
        };

        fetchVendors(controller.signal);

        return () => controller.abort();
    }, [selectedCategory]);

    const formik = useFormik({
        initialValues: {
            rfp_no: '',
            itemName: '',
            itemDescription: '',
            quantity: 1,
            lastDate: '',
            minPrice: '',
            maxPrice: '',
            selectedVendors: [],
        },
        validationSchema: Yup.object({
            rfp_no: Yup.string().required('RFP number is required.'),
            itemName: Yup.string().required('Item name is required.'),
            itemDescription: Yup.string().required('Item description is required.'),
            quantity: Yup.number().typeError("Quantity must be a number.").min(1, 'Quantity must be at least 1.').required('Quantity is required.'),
            lastDate: Yup.date().min(new Date(), 'Last date cannot be in the past.').required('Last date is required.'),
            minPrice: Yup.number().typeError("Price must be a number.").positive('Price must be positive.').required('Minimum price is required.'),
            maxPrice: Yup.number().typeError("Price must be a number.").positive('Price must be positive.').required('Maximum price is required.').min(Yup.ref('minPrice'), 'Max price cannot be less than min price.'),
            selectedVendors: Yup.array().min(1, 'Please select at least one vendor.').required('This field is required.'),
        }),
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="mt-3">
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="rfp_no" className="form-label">RFP Number*</label>
                    <input id="rfp_no" name="rfp_no" type="text" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.rfp_no} />
                    {formik.touched.rfp_no && formik.errors.rfp_no ? <div className="text-danger mt-1">{formik.errors.rfp_no}</div> : null}
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="itemName" className="form-label">Item Name*</label>
                    <input id="itemName" name="itemName" type="text" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.itemName} />
                    {formik.touched.itemName && formik.errors.itemName ? <div className="text-danger mt-1">{formik.errors.itemName}</div> : null}
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="quantity" className="form-label">Quantity*</label>
                    <input id="quantity" name="quantity" type="number" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.quantity} />
                    {formik.touched.quantity && formik.errors.quantity ? <div className="text-danger mt-1">{formik.errors.quantity}</div> : null}
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="itemDescription" className="form-label">Item Description*</label>
                <textarea id="itemDescription" name="itemDescription" className="form-control" rows="3" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.itemDescription}></textarea>
                {formik.touched.itemDescription && formik.errors.itemDescription ? <div className="text-danger mt-1">{formik.errors.itemDescription}</div> : null}
            </div>

            <div className="row">
                <div className="col-md-4 mb-3">
                    <label htmlFor="minPrice" className="form-label">Minimum Price*</label>
                    <input id="minPrice" name="minPrice" type="number" step="0.01" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.minPrice} />
                    {formik.touched.minPrice && formik.errors.minPrice ? <div className="text-danger mt-1">{formik.errors.minPrice}</div> : null}
                </div>
                <div className="col-md-4 mb-3">
                    <label htmlFor="maxPrice" className="form-label">Maximum Price*</label>
                    <input id="maxPrice" name="maxPrice" type="number" step="0.01" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.maxPrice} />
                    {formik.touched.maxPrice && formik.errors.maxPrice ? <div className="text-danger mt-1">{formik.errors.maxPrice}</div> : null}
                </div>
                <div className="col-md-4 mb-3">
                    <label htmlFor="lastDate" className="form-label">Last Date for Submission*</label>
                    <input id="lastDate" name="lastDate" type="date" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.lastDate} />
                    {formik.touched.lastDate && formik.errors.lastDate ? <div className="text-danger mt-1">{formik.errors.lastDate}</div> : null}
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="selectedVendors" className="form-label">Vendors*</label>
                <Select
                    id="selectedVendors"
                    name="selectedVendors"
                    isMulti
                    options={vendorOptions}
                    isLoading={isLoadingVendors}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={isLoadingVendors ? "Loading vendors..." : vendorOptions.length > 0 ? "Select vendors..." : "No vendors found for this category."}
                    onChange={selectedOptions => formik.setFieldValue('selectedVendors', selectedOptions)}
                    onBlur={() => formik.setFieldTouched('selectedVendors', true)}
                    value={formik.values.selectedVendors}
                />
                {formik.touched.selectedVendors && formik.errors.selectedVendors ? <div className="text-danger mt-1">{formik.errors.selectedVendors}</div> : null}
            </div>

            <div className="d-flex justify-content-between mt-4">
                <button type="button" className="btn btn-secondary" onClick={onBack}>
                    <i className="mdi mdi-arrow-left"></i> Back
                </button>
                <button type="submit" className="btn btn-success" disabled={isSubmitting || isLoadingVendors}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                </button>
            </div>
        </form>
    );
};

export default CreateRFPPage2;