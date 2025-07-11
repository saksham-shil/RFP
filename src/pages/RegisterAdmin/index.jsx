import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../services/api'
import Select from 'react-select'

const RegisterAdmin = () => {
  const navigate = useNavigate(); 

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNo: '',
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
      phoneNo: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
        .required("Phone number is required.")
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);

      try {
        const res = await api.post('/api/registeradmin', {
          'firstname': values.firstName,
          'lastname': values.lastName,
          'email': values.email, 
          'password': values.password,
          'mobile': values.phoneNo,
        });
        console.log(res);
        if (res.data.error) {
          if (res.data.error === 'User already exist.' || res.data.error[0] === 'User already exist.') 
            toast.error('User with this email already exists')
          else toast.error(error[0])
        } else {
          toast.success(`Registered Successfully. Proceed to login`);
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
                        <p>Register as Admin</p>
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

export default RegisterAdmin