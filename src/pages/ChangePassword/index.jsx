import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../services/api'

const ChangePassword = () => {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            email: '',
            old_password: '',
            new_password:''
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email format").required("Email is required."),
            old_password: Yup.string().min(5, 'Password must be of 5 letters').required("Password is required"),
            new_password: Yup.string().min(5, 'Password must be of 5 letters').required("Password is required").notOneOf([Yup.ref('old_password'), null], 'New password cannot be the same as the old password.'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);

            try {
                const res = await api.post('/api/resetPassword', {
                    'email': values.email,
                    'old_password': values.old_password,
                    'new_password': values.new_password
                });
                console.log(res);
                if (res.data.error) {
                    if (res.data.error[0] === 'Invalid credentials') toast.error ('Invalid Credentials. Please try again.')
                    else toast.error(res.data.error[0]);
                } else {
                    toast.success(`Password changed successfully`);
                    navigate(`/login`);
                }
            } catch (error) {
                toast.error("An error occurred. Please try again.");
                console.error("Login failed:", error);
            } finally {
                setSubmitting(false);
            }
        }
    })


  return (
    <>
        <div>
            <div className="home-btn d-none d-sm-block">
                <a href="index.html" className="text-dark"><i className="fas fa-home h2"></i></a>
            </div>
            <div className="account-pages my-5 pt-sm-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6 col-xl-5">
                            <div className="card overflow-hidden">
                                <div className="bg-soft-primary">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="text-primary p-4">
                                                <h5 className="text-primary">Welcome to RFP System!</h5>
                                                <p>Sign in to continue</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body pt-0"> 
                                    <div className="p-2">
                                        <form className="form-horizontal" onSubmit={formik.handleSubmit}>
            
                                            <div className="form-group">
                                                <label htmlFor="email">Email</label>
                                                <input 
                                                type="text" 
                                                className="form-control" 
                                                id="email" 
                                                name="email"
                                                onChange={formik.handleChange}
                                                value={formik.values.email}
                                                placeholder="Enter Email"/>
                                            </div>
                                            {formik.touched.email && formik.errors.email && (
                                                <p className="text-danger">{formik.errors.email}</p>
                                            )}
                    
                                            <div className="form-group">
                                                <label htmlFor="old_password">Current Password</label>
                                                <input 
                                                type="password" 
                                                className="form-control" 
                                                id="old_password" 
                                                name="old_password"
                                                onChange={formik.handleChange}
                                                value={formik.values.old_password}
                                                placeholder="Enter Current Password"/>
                                            </div>
                                            {formik.touched.old_password && formik.errors.old_password && (
                                                <p className="text-danger">{formik.errors.old_password}</p>
                                            )}

                                            <div className="form-group">
                                                <label htmlFor="new_password">New Password</label>
                                                <input 
                                                type="password" 
                                                className="form-control" 
                                                id="new_password" 
                                                name="new_password"
                                                onChange={formik.handleChange}
                                                value={formik.values.new_password}
                                                placeholder="Enter New Password"/>
                                            </div>
                                            {formik.touched.new_password && formik.errors.new_password && (
                                                <p className="text-danger">{formik.errors.new_password}</p>
                                            )}
                    
                                            <div className="custom-control custom-checkbox">
                                                <input type="checkbox" className="custom-control-input" id="customControlInline"/>
                                                
                                            </div>
                                            
                                            <div className="mt-3">
                                                <button className="btn btn-primary btn-block waves-effect waves-light" type="submit" disabled={formik.isSubmitting}>{formik.isSubmitting ? 'Submitting...' : 'Proceed'}</button>
                                            </div>
                                            
                                            <div className="mt-4 text-center">
                                                <Link to='/login' >Login</Link>
                                                
                                            </div>
                                            <div className="mt-4 text-center">
                                                  <Link to='/forgot-password' >Forgot your password?</Link>                                                
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 text-center">
                                <div>
                                    <p>&copy; Copyright <i className="mdi mdi-heart text-danger"></i> RFP System</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default ChangePassword
