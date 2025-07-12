import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../services/api'
import { useState, useEffect } from 'react'
import Select from 'react-select'
import axios from 'axios'

const RegisterVendor = () => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const navigate = useNavigate();

  const fetchCategories = async (signal) => {
    try {
      const res = await api.get('/api/categories', { signal });

      console.log(res.data);

      if (res.data.response === 'success') {
        const categories = Object.values(res.data.categories)
        const activeCategories = categories?.filter((category) => (
          category.status === 'Active'
        ));
        const options = activeCategories?.map((category => (
          { value: category.id, label: category.name }
        )))
        setCategoryOptions(options);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to fetch categories, please refresh.");
      }
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchCategories(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      noOfEmployees: '',
      revenue: '',
      gstNo: '',
      panNo: '',
      phoneNo: '',
      categories: []
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(2, "Please enter at least 2 characters")
        .required("First Name is required."),
      lastName: Yup.string()
        .min(2, "Please enter at least 2 characters")
        .required("Last Name is required."),
      email: Yup.string()
        .email("Must be a valid email format")
        .required("Email is required."),
      password: Yup.string()
        .min(5, "Password must be at least 5 characters")
        .required("Password is required."),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], "Passwords must match")
        .required("Confirm Password is required."),
      noOfEmployees: Yup.number()
        .typeError("Number of employees must be integer")
        .positive("Number of employees must be positive")
        .integer("Number of employees must be integer")
        .required("Number of employees is required."),
      revenue: Yup.string()
        .matches(
          /^\s*\d+(\.\d+)?\s*,\s*\d+(\.\d+)?\s*,\s*\d+(\.\d+)?\s*$/,
          "Please enter three comma-separated values (e.g., 1000,2000,3000)"
        )
        .required("Revenue for the last 3 years is required."),
      gstNo: Yup.string()
        .length(15, "GST Number must be exactly 15 characters")
        .required("GST Number is required."),
      panNo: Yup.string()
        .length(10, "PAN Number must be exactly 10 characters")
        .required("PAN Number is required."),
      phoneNo: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
        .required("Phone number is required."),
      categories: Yup.array()
        .min(1, "Please select at least one category.")
        .required("Categories are required.")
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);

      try {
        const categoryIds = values.categories?.map(category => category.value).join(',');
        const res = await api.post('/api/registervendor', {
          'firstname': values.firstName,
          'lastname': values.lastName,
          'email': values.email,
          'password': values.password,
          'no_of_employees': values.noOfEmployees,
          'revenue': values.revenue,
          'gst_no': values.gstNo,
          'pancard_no': values.panNo,
          'mobile': values.phoneNo,
          'category': categoryIds
        });
        console.log(res);
        if (res.data.error) {
          if (res.data.error === 'User already exist.' || res.data.error[0] === 'User already exist.')
            toast.error('User with this email already exists')
          else toast.error(error[0])
        } else {
          toast.success(`Registered Successfully`);
          navigate('/login');
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
        console.error("Register failed:", error);
      } finally {
        setSubmitting(false);
      }
    }
  })

  return (
    <>
      <div className="account-pages my-5 pt-sm-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 col-xl-8">
              <div className="card overflow-hidden">
                <div className="bg-soft-primary">
                  <div className="row">
                    <div className="col-12">
                      <div className="text-primary p-4">
                        <h5 className="text-primary">
                          Welcome to RFP System!
                        </h5>
                        <p>Register as Vendor</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body pt-0">
                  <div className="p-4">
                    <form
                      className="form-horizontal"
                      onSubmit={formik.handleSubmit}
                    >
                      <div className="row">
                        <div className="col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group">
                            <label htmlFor="firstname">First name*</label>
                            <input
                              type="text"
                              className="form-control"
                              id="firstname"
                              placeholder="Enter Firstname"
                              name="firstName"
                              value={formik.values.firstName}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </div>
                          {formik.touched.firstName && formik.errors.firstName && (
                            <p className="text-danger">{formik.errors.firstName}</p>
                          )}
                        </div>
                        <div className="col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group">
                            <label htmlFor="lastname">Last Name<em>*</em></label>
                            <input
                              type="text"
                              className="form-control"
                              id="lastname"
                              placeholder="Enter Lastname"
                              name="lastName"
                              value={formik.values.lastName}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </div>
                          {formik.touched.lastName && formik.errors.lastName && (
                            <p className="text-danger">{formik.errors.lastName}</p>
                          )}
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="email">Email*</label>
                            <input
                              type="text"
                              className="form-control"
                              id="email"
                              placeholder="Enter Email"
                              name="email"
                              value={formik.values.email}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </div>
                          {formik.touched.email && formik.errors.email && (
                            <p className="text-danger">{formik.errors.email}</p>
                          )}
                        </div>

                        <div className="col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group">
                            <label htmlFor="password">Password*</label>
                            <input
                              type="password"
                              className="form-control"
                              id="password"
                              placeholder="Enter Password"
                              name="password"
                              value={formik.values.password}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </div>
                          {formik.touched.password && formik.errors.password && (
                            <p className="text-danger">{formik.errors.password}</p>
                          )}
                        </div>
                        <div className="col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password*</label>
                            <input
                              type="password"
                              className="form-control"
                              id="confirmPassword"
                              placeholder="Enter Confirm Password"
                              name="confirmPassword"
                              value={formik.values.confirmPassword}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </div>
                          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <p className="text-danger">{formik.errors.confirmPassword}</p>
                          )}
                        </div>

                        <div className="col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group">
                            <label htmlFor="revenue">Revenue (Last 3 Years in Lacks)*</label>
                            <input
                              type="text"
                              className="form-control"
                              id="revenue"
                              placeholder="Enter Revenue"
                              name="revenue"
                              value={formik.values.revenue}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </div>
                          {formik.touched.revenue && formik.errors.revenue && (
                            <p className="text-danger">{formik.errors.revenue}</p>
                          )}
                        </div>
                        <div className="col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group">
                            <label htmlFor="noofemployees">No of Employees*</label>
                            <input
                              type="text"
                              className="form-control"
                              id="noofemployees"
                              placeholder="No of Employees"
                              name="noOfEmployees"
                              value={formik.values.noOfEmployees}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </div>
                          {formik.touched.noOfEmployees && formik.errors.noOfEmployees && (
                            <p className="text-danger">{formik.errors.noOfEmployees}</p>
                          )}
                        </div>

                        <div className="col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group">
                            <label htmlFor="gstno">GST No*</label>
                            <input
                              type="text"
                              className="form-control"
                              id="gstno"
                              placeholder="Enter GST No"
                              name="gstNo"
                              value={formik.values.gstNo}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </div>
                          {formik.touched.gstNo && formik.errors.gstNo && (
                            <p className="text-danger">{formik.errors.gstNo}</p>
                          )}
                        </div>
                        <div className="col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group">
                            <label htmlFor="panno">PAN No*</label>
                            <input
                              type="text"
                              className="form-control"
                              id="panno"
                              placeholder="Enter PAN No"
                              name="panNo"
                              value={formik.values.panNo}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </div>
                          {formik.touched.panNo && formik.errors.panNo && (
                            <p className="text-danger">{formik.errors.panNo}</p>
                          )}
                        </div>

                        <div className="col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group">
                            <label htmlFor="phoneno">Phone No*</label>
                            <input
                              type="text"
                              className="form-control"
                              id="phoneno"
                              placeholder="Enter Phone No"
                              name="phoneNo"
                              value={formik.values.phoneNo}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </div>
                          {formik.touched.phoneNo && formik.errors.phoneNo && (
                            <p className="text-danger">{formik.errors.phoneNo}</p>
                          )}
                        </div>
                        <div className="col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group">
                            <label htmlFor="categories">Categories*</label>
                            <Select
                              className="form-control"
                              isMulti
                              id="categories"
                              name="categories"
                              options={categoryOptions}
                              onChange={selectedOptions => {
                                formik.setFieldValue('categories', selectedOptions)
                              }}
                              value={formik.values.categories}
                              onBlur={() => { formik.setFieldTouched('categories', true) }}
                              placeholder={isLoadingCategories ? "Loading Categories" : "Select categories"}
                            />
                          </div>
                          {formik.touched.categories && formik.errors.categories && (
                            <p className="text-danger">{formik.errors.categories}</p>
                          )}
                        </div>

                        <div className="p-2 mt-3">
                          <button
                            className="btn btn-primary btn-block waves-effect waves-light"
                            type="submit"
                            disabled={formik.isSubmitting}
                          >
                            {formik.isSubmitting ? 'Registering...' : 'Register'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="mt-5 text-center">
                <div>
                  <p>
                    &copy; Copyright <i className="mdi mdi-heart text-danger"></i> RFP System
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RegisterVendor