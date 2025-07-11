import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../services/api'

const Login = () => {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email format").required("Email is required."),
            password: Yup.string().min(5, 'Password must be of 5 letters').required("Password is required")
        }),
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);

            try {
                const res = await api.post('/api/login', {
                    'email': values.email,
                    'password': values.password
                });
                console.log(res);
                if (res.data.error) {
                    if (res.data.error === 'Invalid credential') toast.error ('Invalid Credentials. Please try again.')
                    if (res.data.error === "Account status Pending") toast.error ('Your account is yet to be approved by an Admin')
                } else {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('role', res.data.type);
                    localStorage.setItem('userid', res.data.user_id);
                    localStorage.setItem('name', res.data.name);
                    navigate(`/${res.data.type}`);
                    toast.success(`${res.data.name} Logged in Successfully`);
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
                                                <label htmlFor="password">Password</label>
                                                <input 
                                                type="password" 
                                                className="form-control" 
                                                id="password" 
                                                name="password"
                                                onChange={formik.handleChange}
                                                value={formik.values.password}
                                                placeholder="Enter Password"/>
                                            </div>
                                            {formik.touched.password && formik.errors.password && (
                                                <p className="text-danger">{formik.errors.password}</p>
                                            )}
                    
                                            <div className="custom-control custom-checkbox">
                                                <input type="checkbox" className="custom-control-input" id="customControlInline"/>
                                                
                                            </div>
                                            
                                            <div className="mt-3">
                                                <button className="btn btn-primary btn-block waves-effect waves-light" type="submit">Log In</button>
                                            </div>
                                            
                                            <div className="mt-4 text-center">
                                                <Link to='/registervendor' >Register as Vendor</Link>
                                                
                                            </div>
                                            <div className="mt-4 text-center">
                                                <Link to='/registeradmin' >Register as Admin</Link>
                                                
                                            </div>
                                            <div className="mt-4 text-center">
                                                <Link to='/forgotpass' >Forgot your password?</Link>
                                                
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

export default Login
